import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import Header from "../../components/Header";
import SparqlEditor from "../../components/SparqlEditor";
import "./styles.css";

interface QueryResult {
  headers: string[];
  rows: any[];
  title: string;
}

const SparqlWorkshopPage: React.FC = () => {
  const { t } = useTranslation();
  const [queryResults, setQueryResults] = useState<QueryResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const tutorials = [
    {
      title: "Consulta Básica de Políticas",
      description: "Lista todas as políticas com seus países",
      difficulty: "Iniciante",
      query: `PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

SELECT ?policyName ?countryName
WHERE {
  ?policy a Ellas:Policy.
  ?policy rdfs:label ?policyName.
  ?policy Ellas:created_in ?country.
  ?country rdfs:label ?countryName.
}
ORDER BY ?countryName ?policyName
LIMIT 20`,
    },
    {
      title: "Iniciativas por Status",
      description: "Busca iniciativas filtradas por status",
      difficulty: "Intermediário",
      query: `PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

SELECT ?initiativeName ?status ?countryName
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
LIMIT 15`,
    },
    {
      title: "Análise de Fatores Contextuais",
      description: "Explora fatores com impacto positivo",
      difficulty: "Avançado",
      query: `PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

SELECT ?factorName ?impactType ?countryName (COUNT(?relatedEntity) as ?relatedCount)
WHERE {
  ?factor a Ellas:Factor.
  ?contextualFactor rdfs:subClassOf ?factor.
  ?contextualFactor rdfs:label ?factorName.
  ?contextualFactor Ellas:factors_impact_type ?impactType.
  
  OPTIONAL {
    ?contextualFactor Ellas:analyzed_in ?country.
    ?country rdfs:label ?countryName.
  }
  
  OPTIONAL {
    ?relatedEntity ?property ?contextualFactor.
  }
  
  FILTER(?impactType = "Positive"@en)
}
GROUP BY ?factorName ?impactType ?countryName
ORDER BY DESC(?relatedCount) ?countryName
LIMIT 10`,
    },
  ];

  const handleQueryExecute = async (results: any) => {
    setIsLoading(true);

    try {
      // Processar os resultados para exibir em formato de tabela
      if (results && results.results && results.results.bindings) {
        const bindings = results.results.bindings;
        const headers = results.head.vars;

        const processedResults = {
          headers: headers,
          rows: bindings.map((binding: any) => {
            const row: any = {};
            headers.forEach((header: string) => {
              row[header] = binding[header] ? binding[header].value : "N/A";
            });
            return row;
          }),
          title: `${t("queryBuilder.results.title")} (${bindings.length} ${t(
            "queryBuilder.results.records"
          )})`,
        };

        setQueryResults(processedResults);
      } else {
        setQueryResults({
          headers: [],
          rows: [],
          title:
            t("queryBuilder.results.noData") || "Nenhum resultado encontrado",
        });
      }
    } catch (error) {
      console.error("Erro ao processar resultados:", error);
      setQueryResults({
        headers: [],
        rows: [],
        title: "Erro ao processar resultados",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "iniciante":
        return "#28a745";
      case "intermediário":
        return "#ffc107";
      case "avançado":
        return "#dc3545";
      default:
        return "#6c757d";
    }
  };

  return (
    <>
      <Helmet>
        <title>ELLAS - Workshop SPARQL</title>
        <meta
          name="description"
          content="Aprenda e pratique consultas SPARQL com os dados do projeto ELLAS"
        />
      </Helmet>

      <Header />

      <div className="sparql-workshop-page">
        <div className="workshop-header">
          <h1>🛠️ Workshop SPARQL</h1>
          <p>
            Aprenda a criar consultas SPARQL personalizadas para explorar os
            dados do projeto ELLAS
          </p>
        </div>

        <div className="workshop-content">
          {/* Tutorial Section */}
          <div className="tutorial-section">
            <h2>📚 Tutoriais de Consulta</h2>
            <p>
              Selecione um exemplo para começar ou crie sua própria consulta do
              zero.
            </p>

            <div className="tutorial-grid">
              {tutorials.map((tutorial, index) => (
                <div key={index} className="tutorial-card">
                  <div className="tutorial-header">
                    <h3>{tutorial.title}</h3>
                    <span
                      className="difficulty-badge"
                      style={{
                        backgroundColor: getDifficultyColor(
                          tutorial.difficulty
                        ),
                      }}
                    >
                      {tutorial.difficulty}
                    </span>
                  </div>
                  <p className="tutorial-description">{tutorial.description}</p>
                  <pre className="tutorial-query-preview">
                    {tutorial.query.substring(0, 150)}...
                  </pre>
                  <button
                    className="load-tutorial-button"
                    onClick={() => {
                      // Scroll to editor and load query
                      const editor = document.querySelector(".sparql-editor");
                      if (editor) {
                        editor.scrollIntoView({ behavior: "smooth" });
                      }
                      // Note: The actual loading will be handled by passing the query to SparqlEditor
                    }}
                  >
                    Carregar Tutorial
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Reference */}
          <div className="quick-reference">
            <h2>📖 Referência Rápida</h2>
            <div className="reference-grid">
              <div className="reference-card">
                <h3>🏛️ Principais Classes</h3>
                <ul>
                  <li>
                    <code>Ellas:Policy</code> - Políticas de gênero
                  </li>
                  <li>
                    <code>Ellas:Initiative</code> - Iniciativas
                  </li>
                  <li>
                    <code>Ellas:Factor</code> - Fatores contextuais
                  </li>
                </ul>
              </div>

              <div className="reference-card">
                <h3>🔗 Propriedades Importantes</h3>
                <ul>
                  <li>
                    <code>rdfs:label</code> - Nome/título
                  </li>
                  <li>
                    <code>Ellas:created_in</code> - País de origem
                  </li>
                  <li>
                    <code>Ellas:start_date</code> - Data de início
                  </li>
                  <li>
                    <code>Ellas:policy_type</code> - Tipo de política
                  </li>
                  <li>
                    <code>Ellas:initiative_status</code> - Status
                  </li>
                </ul>
              </div>

              <div className="reference-card">
                <h3>⚡ Prefixos Essenciais</h3>
                <pre>{`PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>`}</pre>
              </div>
            </div>
          </div>

          {/* SPARQL Editor */}
          <div className="editor-section">
            <h2>💻 Editor de Consultas</h2>
            <SparqlEditor
              onQueryExecute={handleQueryExecute}
              initialQuery={`PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

SELECT ?name ?country
WHERE {
  ?entity a Ellas:Policy.
  ?entity rdfs:label ?name.
  ?entity Ellas:created_in ?countryEntity.
  ?countryEntity rdfs:label ?country.
}
LIMIT 10`}
            />
          </div>

          {/* Results Section */}
          {(queryResults || isLoading) && (
            <div className="results-section">
              <h2>{t("queryBuilder.results.title")}</h2>
              {isLoading ? (
                <div className="loading-container">
                  <div className="loading-spinner"></div>
                  <p>Processando resultados...</p>
                </div>
              ) : queryResults ? (
                <div className="results-container">
                  <h3>{queryResults.title}</h3>
                  {queryResults.rows.length > 0 ? (
                    <div className="results-table-wrapper">
                      <table className="results-table">
                        <thead>
                          <tr>
                            {queryResults.headers.map((header, index) => (
                              <th key={index}>{header}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {queryResults.rows.map((row, index) => (
                            <tr key={index}>
                              {queryResults.headers.map((header, cellIndex) => (
                                <td key={cellIndex}>{row[header] || "N/A"}</td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="no-results">
                      Nenhum resultado encontrado para esta consulta.
                    </p>
                  )}
                </div>
              ) : null}
            </div>
          )}

          {/* Tips Section */}
          <div className="tips-section">
            <h2>💡 Dicas para Consultas Eficazes</h2>
            <div className="tips-grid">
              <div className="tip-card">
                <h3>🎯 Filtragem</h3>
                <p>
                  Use <code>FILTER</code> para refinar resultados:
                </p>
                <pre>{`FILTER(?date >= "2020-01-01"^^xsd:date)
FILTER(REGEX(?name, "educação", "i"))`}</pre>
              </div>

              <div className="tip-card">
                <h3>📈 Contagem</h3>
                <p>
                  Conte registros com <code>COUNT</code>:
                </p>
                <pre>{`SELECT ?country (COUNT(?policy) as ?total)
WHERE {
  ?policy Ellas:created_in ?country.
}
GROUP BY ?country`}</pre>
              </div>

              <div className="tip-card">
                <h3>🔄 Dados Opcionais</h3>
                <p>
                  Use <code>OPTIONAL</code> para dados que podem não existir:
                </p>
                <pre>{`OPTIONAL {
  ?policy Ellas:end_date ?endDate.
}`}</pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SparqlWorkshopPage;
