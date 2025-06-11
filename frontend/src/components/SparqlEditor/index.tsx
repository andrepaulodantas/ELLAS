import React, { useState, useRef, useEffect } from "react";
import { fetchQuery } from "../../services/apiService";
import "./styles.css";

interface SparqlEditorProps {
  onQueryExecute?: (results: any) => void;
  initialQuery?: string;
  onQueryChange?: (query: string) => void;
}

interface QueryTemplate {
  name: string;
  description: string;
  query: string;
  category: "Policy" | "Initiative" | "Factor";
}

const QUERY_TEMPLATES: QueryTemplate[] = [
  {
    name: "Políticas por País",
    description: "Lista todas as políticas organizadas por país",
    category: "Policy",
    query: `PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

SELECT ?policyName ?countryName ?policyType
WHERE {
  ?policy a Ellas:Policy.
  ?policy rdfs:label ?policyName.
  ?policy Ellas:created_in ?country.
  ?country rdfs:label ?countryName.
  OPTIONAL { ?policy Ellas:policy_type ?policyType }
}
ORDER BY ?countryName ?policyName
LIMIT 100`,
  },
  {
    name: "Iniciativas Ativas",
    description: "Lista iniciativas com status ativo",
    category: "Initiative",
    query: `PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

SELECT ?initiativeName ?countryName ?status
WHERE {
  ?initiative a Ellas:Initiative.
  ?initiative rdfs:label ?initiativeName.
  ?initiative Ellas:initiative_status ?status.
  OPTIONAL {
    ?initiative Ellas:created_in ?country.
    ?country rdfs:label ?countryName.
  }
  FILTER(?status = "Active"@en)
}
ORDER BY ?countryName ?initiativeName
LIMIT 100`,
  },
  {
    name: "Fatores Contextuais Positivos",
    description: "Lista fatores contextuais com impacto positivo",
    category: "Factor",
    query: `PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

SELECT ?factorName ?countryName ?impactType
WHERE {
  ?factor a Ellas:Factor.
  ?contextualFactor rdfs:subClassOf ?factor.
  ?contextualFactor rdfs:label ?factorName.
  ?contextualFactor Ellas:factors_impact_type ?impactType.
  ?contextualFactor Ellas:analyzed_in ?country.
  ?country rdfs:label ?countryName.
  FILTER(?impactType = "Positive"@en)
}
ORDER BY ?countryName ?factorName
LIMIT 100`,
  },
  {
    name: "Busca por Propriedade",
    description: "Template genérico para buscar por qualquer propriedade",
    category: "Policy",
    query: `PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

SELECT ?entityName ?propertyValue ?countryName
WHERE {
  ?entity rdf:type Ellas:Policy .
  ?entity rdfs:label ?entityName .
  ?entity Ellas:PROPERTY_NAME ?propObject .
  
  OPTIONAL { 
    ?propObject rdfs:label ?propLabel .
    FILTER(LANG(?propLabel) = "en" || LANG(?propLabel) = "")
  }
  BIND(COALESCE(?propLabel, STR(?propObject)) AS ?propertyValue)
  
  OPTIONAL {
    ?entity Ellas:created_in ?country .
    ?country rdfs:label ?countryName .
  }
}
ORDER BY ?entityName
LIMIT 100

# Substitua PROPERTY_NAME pela propriedade desejada
# Exemplos: finish_date, start_date, policy_type, initiative_status`,
  },
];

const SparqlEditor: React.FC<SparqlEditorProps> = ({
  onQueryExecute,
  initialQuery = "",
  onQueryChange,
}) => {
  const [query, setQuery] = useState<string>(initialQuery);
  const [results, setResults] = useState<any>(null);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [showTemplates, setShowTemplates] = useState<boolean>(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (onQueryChange) {
      onQueryChange(query);
    }
  }, [query, onQueryChange]);

  const executeQuery = async () => {
    if (!query.trim()) {
      setError("Por favor, insira uma consulta SPARQL");
      return;
    }

    setIsExecuting(true);
    setError(null);
    setResults(null);

    try {
      const result = await fetchQuery(query);
      setResults(result);

      if (onQueryExecute) {
        onQueryExecute(result);
      }
    } catch (err) {
      console.error("Erro ao executar consulta SPARQL:", err);
      setError(
        `Erro ao executar consulta: ${
          err instanceof Error ? err.message : "Erro desconhecido"
        }`
      );
    } finally {
      setIsExecuting(false);
    }
  };

  const loadTemplate = (templateQuery: string) => {
    setQuery(templateQuery);
    setShowTemplates(false);
    setSelectedTemplate("");
  };

  const formatQuery = () => {
    // Formatação básica da consulta SPARQL
    const formatted = query
      .replace(/PREFIX\s+/gi, "\nPREFIX ")
      .replace(/SELECT\s+/gi, "\nSELECT ")
      .replace(/WHERE\s*{/gi, "\nWHERE {\n  ")
      .replace(/}\s*ORDER/gi, "\n}\nORDER")
      .replace(/}\s*LIMIT/gi, "\n}\nLIMIT")
      .replace(/\.\s*(?=[?])/g, " .\n  ")
      .trim();

    setQuery(formatted);
  };

  const clearQuery = () => {
    setQuery("");
    setResults(null);
    setError(null);
  };

  const insertAtCursor = (text: string) => {
    if (textareaRef.current) {
      const start = textareaRef.current.selectionStart;
      const end = textareaRef.current.selectionEnd;
      const newQuery = query.substring(0, start) + text + query.substring(end);
      setQuery(newQuery);

      // Reposicionar cursor
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart =
            textareaRef.current.selectionEnd = start + text.length;
          textareaRef.current.focus();
        }
      }, 0);
    }
  };

  const renderResults = () => {
    if (!results) return null;

    if (
      !results.results ||
      !results.results.bindings ||
      results.results.bindings.length === 0
    ) {
      return (
        <div className="sparql-results">
          <h3>Resultados</h3>
          <p>Nenhum resultado encontrado.</p>
        </div>
      );
    }

    const bindings = results.results.bindings;
    const headers = results.head.vars;

    return (
      <div className="sparql-results">
        <h3>Resultados ({bindings.length} registros)</h3>
        <div className="results-table-container">
          <table className="results-table">
            <thead>
              <tr>
                {headers.map((header: string) => (
                  <th key={header}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bindings.map((binding: any, index: number) => (
                <tr key={index}>
                  {headers.map((header: string) => (
                    <td key={header}>
                      {binding[header] ? binding[header].value : "N/A"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="sparql-editor">
      <div className="sparql-editor-header">
        <h3>Editor de Consultas SPARQL</h3>
        <div className="sparql-editor-actions">
          <button
            onClick={() => setShowTemplates(!showTemplates)}
            className="template-button"
          >
            📋 Templates
          </button>
          <button onClick={formatQuery} className="format-button">
            🎨 Formatar
          </button>
          <button onClick={clearQuery} className="clear-button">
            🗑️ Limpar
          </button>
        </div>
      </div>

      {showTemplates && (
        <div className="template-selector">
          <h4>Selecionar Template:</h4>
          <div className="template-grid">
            {QUERY_TEMPLATES.map((template, index) => (
              <div key={index} className="template-card">
                <div className="template-header">
                  <span
                    className={`template-category ${template.category.toLowerCase()}`}
                  >
                    {template.category}
                  </span>
                  <h5>{template.name}</h5>
                </div>
                <p>{template.description}</p>
                <button
                  onClick={() => loadTemplate(template.query)}
                  className="load-template-button"
                >
                  Carregar
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="sparql-editor-body">
        <div className="query-input-section">
          <div className="query-tools">
            <span>Ferramentas rápidas:</span>
            <button
              onClick={() =>
                insertAtCursor(
                  "PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>\nPREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n\n"
                )
              }
            >
              + Prefixos
            </button>
            <button onClick={() => insertAtCursor("OPTIONAL {\n  \n}")}>
              + OPTIONAL
            </button>
            <button onClick={() => insertAtCursor("FILTER()")}>+ FILTER</button>
          </div>

          <textarea
            ref={textareaRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Insira sua consulta SPARQL aqui...

Exemplo:
PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

SELECT ?policyName ?countryName
WHERE {
  ?policy a Ellas:Policy.
  ?policy rdfs:label ?policyName.
  ?policy Ellas:created_in ?country.
  ?country rdfs:label ?countryName.
}
LIMIT 10"
            className="sparql-textarea"
            rows={15}
          />

          <div className="execute-section">
            <button
              onClick={executeQuery}
              disabled={isExecuting || !query.trim()}
              className="execute-button"
            >
              {isExecuting ? "Executando..." : "▶️ Executar Consulta"}
            </button>

            {query.trim() && (
              <div className="query-info">
                Linhas: {query.split("\n").length} | Caracteres: {query.length}
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="sparql-error">
            <h4>Erro:</h4>
            <pre>{error}</pre>
          </div>
        )}

        {renderResults()}
      </div>
    </div>
  );
};

export default SparqlEditor;
