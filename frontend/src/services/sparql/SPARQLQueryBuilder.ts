import { ISPARQLQueryBuilder } from './interfaces';

/**
 * Construtor de consultas SPARQL
 * Princípio da Responsabilidade Única: Apenas constrói queries SPARQL
 */
export class SPARQLQueryBuilder implements ISPARQLQueryBuilder {
  private static readonly PREFIXES = `
    PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
  `;

  /**
   * Constrói uma consulta para explorar propriedades de uma categoria
   */
  buildPropertyExplorationQuery(category: string): string {
    if (category === "Factor") {
      return `${SPARQLQueryBuilder.PREFIXES}
        SELECT DISTINCT ?property ?propertyLabel (COUNT(DISTINCT ?s) as ?count)
        WHERE {
          {
            # Buscar propriedades de fatores diretos
            ?s rdf:type Ellas:Factor .
            ?s ?property ?object .
          }
          UNION
          {
            # Buscar propriedades de fatores contextuais
            ?s rdf:type ?type .
            ?type rdfs:subClassOf Ellas:Factor .
            ?s ?property ?object .
          }
          
          # Filtrar apenas propriedades Ellas
          FILTER(STRSTARTS(STR(?property), "https://ellas.ufmt.br/Ontology/Ellas#"))
          
          # Remover propriedades do sistema
          FILTER(?property NOT IN (rdf:type, rdfs:label, rdfs:subClassOf))
          
          OPTIONAL { 
            ?property rdfs:label ?propertyLabel .
            FILTER(LANG(?propertyLabel) = "en" || LANG(?propertyLabel) = "" || LANG(?propertyLabel) = "pt")
          }
        }
        GROUP BY ?property ?propertyLabel
        ORDER BY DESC(?count)
      `;
    }
    
    return `${SPARQLQueryBuilder.PREFIXES}
      SELECT DISTINCT ?property ?propertyLabel (COUNT(DISTINCT ?subject) as ?count)
      WHERE {
        ?subject rdf:type Ellas:${category} .
        
        OPTIONAL {
          ?subject ?property ?object .
          FILTER(STRSTARTS(STR(?property), "https://ellas.ufmt.br/Ontology/Ellas#"))
          
          OPTIONAL { 
            ?property rdfs:label ?propertyLabel .
            FILTER(LANG(?propertyLabel) = "en" || LANG(?propertyLabel) = "" || LANG(?propertyLabel) = "pt")
          }
        }
        
        FILTER(BOUND(?property))
      }
      GROUP BY ?property ?propertyLabel
      ORDER BY DESC(?count)
    `;
  }

  /**
   * Constrói uma consulta para explorar valores de uma propriedade
   */
  buildValueExplorationQuery(
    category: string, 
    property: string, 
    filters: Record<string, any> = {}
  ): string {
    const filterClauses = this.buildFilterClauses(filters);
    
    if (category === "Factor") {
      return `${SPARQLQueryBuilder.PREFIXES}
        SELECT DISTINCT ?value (COUNT(DISTINCT ?s) as ?count)
        WHERE {
          {
            # Buscar valores de fatores diretos
            ?s rdf:type Ellas:Factor .
            ?s Ellas:${property} ?propValue .
          }
          UNION
          {
            # Buscar valores de fatores contextuais
            ?s rdf:type ?type .
            ?type rdfs:subClassOf Ellas:Factor .
            ?s Ellas:${property} ?propValue .
          }
          
          OPTIONAL { 
            ?propValue rdfs:label ?label .
            FILTER(LANG(?label) = "en" || LANG(?label) = "" || LANG(?label) = "pt" || LANG(?label) = "es")
          }
          BIND(COALESCE(?label, STR(?propValue)) AS ?value)
          
          FILTER(BOUND(?value) && ?value != "")
          
          ${filterClauses}
        }
        GROUP BY ?value
        ORDER BY DESC(?count)
        LIMIT 100
      `;
    }
    
    return `${SPARQLQueryBuilder.PREFIXES}
      SELECT DISTINCT ?value (COUNT(DISTINCT ?s) as ?count)
      WHERE {
        ?s rdf:type Ellas:${category} .
        
        OPTIONAL {
          ?s Ellas:${property} ?propValue .
          
          OPTIONAL { 
            ?propValue rdfs:label ?label .
            FILTER(LANG(?label) = "en" || LANG(?label) = "" || LANG(?label) = "pt" || LANG(?label) = "es")
          }
          BIND(COALESCE(?label, STR(?propValue)) AS ?value)
        }
        
        FILTER(BOUND(?value) && ?value != "")
        
        ${filterClauses}
      }
      GROUP BY ?value
      ORDER BY DESC(?count)
      LIMIT 100
    `;
  }

  /**
   * Constrói uma consulta para verificar disponibilidade de propriedade
   */
  buildPropertyAvailabilityQuery(category: string, property: string): string {
    return `${SPARQLQueryBuilder.PREFIXES}
      SELECT 
        (COUNT(DISTINCT ?s) as ?entityCount) 
        (COUNT(DISTINCT ?propValue) as ?valueCount)
        (COUNT(DISTINCT ?entitiesWithProp) as ?entitiesWithProperty)
      WHERE {
        ?s rdf:type Ellas:${category} .
        OPTIONAL { 
          ?s Ellas:${property} ?propValue 
          BIND(?s as ?entitiesWithProp)
        }
      }
    `;
  }

  /**
   * Constrói uma consulta dinâmica com filtros
   */
  buildDynamicQuery(
    category: string, 
    countries: string[], 
    filters: Record<string, any>
  ): string;
  buildDynamicQuery(
    category: string,
    path: string[],
    extraFields: string[],
    limit: number
  ): string;
  buildDynamicQuery(
    category: string,
    countriesOrPath: string[],
    filtersOrExtraFields?: Record<string, any> | string[],
    limit?: number
  ): string {
    // Se o terceiro parâmetro for um número, é a sobrecarga com path
    if (typeof limit === 'number' && Array.isArray(filtersOrExtraFields)) {
      return this.buildDynamicQueryByPath(category, countriesOrPath, filtersOrExtraFields, limit);
    }
    
    // Caso contrário, é a sobrecarga com countries e filters
    return this.buildDynamicQueryByCountries(
      category, 
      countriesOrPath, 
      filtersOrExtraFields as Record<string, any> || {}
    );
  }

  /**
   * Constrói uma consulta dinâmica baseada em países e filtros
   */
  private buildDynamicQueryByCountries(
    category: string, 
    countries: string[], 
    filters: Record<string, any>
  ): string {
    const countryFilter = countries.length > 0 
      ? `FILTER(${countries.map(c => `?countryName="${c}"@en`).join(" || ")})` 
      : "";
      
    const additionalFilters = this.buildFilterClauses(filters);
    
    let entityNameField = "name";
    switch (category.toLowerCase()) {
      case "policy":
        entityNameField = "policyName";
        break;
      case "initiative":
        entityNameField = "initiativeName";
        break;
      case "contextualfactor":
      case "factor":
        entityNameField = "factorName";
        break;
    }
    
    return `${SPARQLQueryBuilder.PREFIXES}
      SELECT ?${entityNameField} ?countryName
      WHERE {
        ?entity rdf:type Ellas:${category} .
        ?entity rdfs:label ?${entityNameField} .
        
        OPTIONAL {
          ?entity Ellas:created_in ?country .
          ?country rdfs:label ?countryName .
        }
        
        ${countryFilter}
        ${additionalFilters}
      }
      ORDER BY ?${entityNameField}
      LIMIT 100
    `;
  }

  /**
   * Constrói uma consulta dinâmica baseada em um caminho de filtros
   */
  private buildDynamicQueryByPath(
    category: string,
    path: string[],
    extraFields: string[] = [],
    limit: number = 100
  ): string {
    const filteredExtraFields = extraFields.filter(field => field !== 'label');
    
    let query = `${SPARQLQueryBuilder.PREFIXES}
      SELECT DISTINCT ?entity ?label ${filteredExtraFields.map(field => `?${field}`).join(' ')}
      WHERE {
        ?entity rdf:type Ellas:${category} .
        ?entity rdfs:label ?label .
    `;

    // Adicionar restrições de caminho
    query += this.buildPathConstraints(path);

    // Adicionar campos extras
    query += this.buildOptionalFields(filteredExtraFields);

    query += `
      }
      ORDER BY ?label
      LIMIT ${limit}
    `;

    return query;
  }

  /**
   * Método legacy para compatibilidade
   */
  buildPropertiesQuery(category: string): string {
    return this.buildPropertyExplorationQuery(category);
  }

  /**
   * Método legacy para compatibilidade
   */
  buildValuesQuery(
    category: string, 
    property: string, 
    filters: Record<string, any> = {}
  ): string {
    return this.buildValueExplorationQuery(category, property, filters);
  }

  /**
   * Método legacy para compatibilidade
   */
  buildAvailabilityQuery(category: string, property: string): string {
    return this.buildPropertyAvailabilityQuery(category, property);
  }

  /**
   * Constrói uma consulta básica para uma categoria
   */
  buildBasicCategoryQuery(category: string): string {
    return `${SPARQLQueryBuilder.PREFIXES}
      SELECT ?name ?countryName
      WHERE {
        ?entity rdf:type Ellas:${category} .
        ?entity rdfs:label ?name .
        
        OPTIONAL {
          ?entity Ellas:created_in ?country .
          ?country rdfs:label ?countryName .
        }
      }
      ORDER BY ?name
      LIMIT 50
    `;
  }

  /**
   * Constrói uma consulta de contagem para uma categoria
   */
  buildCountQuery(category: string): string {
    return `${SPARQLQueryBuilder.PREFIXES}
      SELECT (COUNT(DISTINCT ?entity) as ?count)
      WHERE {
        ?entity rdf:type Ellas:${category} .
      }
    `;
  }

  /**
   * Constrói consulta para explorar valores de propriedades
   */
  buildPropertyValuesQuery(
    category: string, 
    property: string, 
    filterClauses: string = ''
  ): string {
    return `${SPARQLQueryBuilder.PREFIXES}
      SELECT ?value (COUNT(?s) AS ?count)
      WHERE {
        ?s rdf:type Ellas:${category} .
        
        OPTIONAL {
          ?s Ellas:${property} ?propValue .
          
          OPTIONAL { 
            ?propValue rdfs:label ?label .
            FILTER(LANG(?label) = "en" || LANG(?label) = "" || LANG(?label) = "pt" || LANG(?label) = "es")
          }
          BIND(COALESCE(?label, STR(?propValue)) AS ?value)
        }
        
        FILTER(BOUND(?value) && ?value != "")
        
        ${filterClauses}
      }
      GROUP BY ?value
      ORDER BY DESC(?count)
      LIMIT 100
    `;
  }

  /**
   * Constrói cláusulas de filtro a partir de um objeto de filtros
   */
  private buildFilterClauses(filters: Record<string, any>): string {
    if (!filters || Object.keys(filters).length === 0) {
      return "";
    }

    const clauses: string[] = [];
    
    Object.entries(filters).forEach(([filterProp, filterValue]) => {
      if (!filterProp || !filterValue) return;

      clauses.push(`?s Ellas:${filterProp} ?${filterProp}Filter .`);

      if (typeof filterValue === "object" && filterValue !== null) {
        if (filterValue.iri) {
          clauses.push(`FILTER(?${filterProp}Filter = <${filterValue.iri}>) .`);
        } else if (filterValue.value) {
          clauses.push(`FILTER(STR(?${filterProp}Filter) = "${filterValue.value}") .`);
        }
      } else {
        clauses.push(`FILTER(STR(?${filterProp}Filter) = "${filterValue}" || ?${filterProp}Filter = "${filterValue}"@en) .`);
      }
    });

    return clauses.join('\n        ');
  }

  /**
   * Constrói restrições de caminho
   */
  private buildPathConstraints(path: string[]): string {
    if (!path || path.length === 0) return '';

    let constraints = '';
    for (let i = 0; i < path.length; i += 2) {
      const property = path[i];
      const value = path[i + 1];

      if (property && value) {
        const varName = `?${property}_value`;
        const escapedValue = this.escapeValue(value);

        constraints += `      ?entity Ellas:${property} ${varName} .\n`;
        constraints += `      {\n`;
        constraints += `        ${varName} rdfs:label "${escapedValue}"@en .\n`;
        constraints += `      } UNION {\n`;
        constraints += `        ${varName} rdfs:label "${escapedValue}" .\n`;
        constraints += `      } UNION {\n`;
        constraints += `        FILTER(STR(${varName}) = "${escapedValue}")\n`;
        constraints += `      }\n`;
      }
    }

    return constraints;
  }

  /**
   * Constrói campos opcionais
   */
  private buildOptionalFields(fields: string[]): string {
    if (fields.length === 0) return '';

    let optionals = '';
    fields.forEach(field => {
      const varName = `?${field}_value`;
      const labelVar = `?${field}_label`;
      optionals += `      OPTIONAL { 
        ?entity Ellas:${field} ${varName} .
        OPTIONAL { ${varName} rdfs:label ${labelVar} }
        BIND(COALESCE(${labelVar}, STR(${varName})) AS ?${field})
      }\n`;
    });

    return optionals;
  }

  /**
   * Escapa valores para uso em SPARQL
   */
  private escapeValue(value: string): string {
    return value
      .replace(/\\/g, "\\\\")
      .replace(/"/g, '\\"')
      .replace(/\n/g, "\\n")
      .replace(/\r/g, "\\r")
      .replace(/\t/g, "\\t");
  }
}
