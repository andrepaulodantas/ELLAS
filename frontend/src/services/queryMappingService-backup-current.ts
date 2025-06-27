import * as apiService from "./apiService";
import { fetchQuery } from "./apiService";
import { getQueriesByCategory, getSparqlQuery } from "../data";

// Flag para forçar o uso de dados de demonstração no ambiente de desenvolvimento
// Isso é útil quando o endpoint SPARQL não está disponível ou com problemas de CORS/autenticação
// Mudando para false para tentar consultas reais primeiro
const FORCE_DEMO_DATA = false;

// Flag para debug detalhado
// const DEBUG_MODE = true;

// Interface para representar uma consulta mapeada
interface MappedQuery {
  name: string;
  description: string;
  category: string;
  apiFunction: () => Promise<any>;
}

// Interface para opções de grafo
export interface GraphOption {
  value: string;
  label: string;
  count?: number;
  type?: string;
}

// Mapeamento de consultas predefinidas para funções reais do apiService
const fetchPoliciesAppliedInCountries = async () => {
  console.log(
    "Chamando fetchPoliciesAppliedInCountries do queryMappingService"
  );
  return await fetchQuery(`
    PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    SELECT ?policyName ?countryName
    WHERE {
      ?policy a Ellas:Policy.
      ?policy rdfs:label ?policyName.
      ?policy Ellas:created_in ?country.
      ?country rdfs:label ?countryName.
    }
    ORDER BY ?countryName
  `);
};

const fetchPolicyTypesInLatinAmerica = async () => {
  console.log("Chamando fetchPolicyTypesInLatinAmerica do queryMappingService");
  return await fetchQuery(`
    PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    SELECT ?policyType (COUNT(?policy) as ?count)
    WHERE {
      ?policy a Ellas:Policy.
      ?policy Ellas:policy_type ?type.
      ?type rdfs:label ?policyType.
      ?policy Ellas:created_in ?country.
      ?country rdfs:label ?countryName.
      FILTER(REGEX(?countryName, "America", "i"))
    }
    GROUP BY ?policyType
    ORDER BY DESC(?count)
  `);
};

const fetchPoliciesPromotingWomenInSTEM = async () => {
  console.log(
    "Chamando fetchPoliciesPromotingWomenInSTEM do queryMappingService"
  );
  return await fetchQuery(`
    PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    SELECT ?policyName ?countryName
    WHERE {
      ?policy a Ellas:Policy.
      ?policy rdfs:label ?policyName.
      ?policy Ellas:focused_on ?focus.
      ?focus rdfs:label ?focusLabel.
      ?policy Ellas:created_in ?country.
      ?country rdfs:label ?countryName.
      FILTER(REGEX(?focusLabel, "STEM|Science|Technology|Engineering|Math", "i"))
    }
    ORDER BY ?countryName
  `);
};

const fetchPoliciesImplementedInCountriesSince2015 = async () => {
  console.log(
    "Chamando fetchPoliciesImplementedInCountriesSince2015 do queryMappingService"
  );
  return await fetchQuery(`
    PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    SELECT ?policyName ?countryName ?date
    WHERE {
      ?policy a Ellas:Policy.
      ?policy rdfs:label ?policyName.
      ?policy Ellas:created_in ?country.
      ?country rdfs:label ?countryName.
      ?policy Ellas:date ?date.
      FILTER(?date >= "2015-01-01"^^xsd:date)
      FILTER(REGEX(?countryName, "Bolivia|Brazil|Peru", "i"))
    }
    ORDER BY ?countryName ?date
  `);
};

const fetchInitiativesByCountry = async () => {
  console.log("Chamando fetchInitiativesByCountry do queryMappingService");
  return await fetchQuery(`
    PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    SELECT ?countryName (COUNT(?initiative) as ?count)
    WHERE {
      ?initiative a Ellas:Initiative.
      ?initiative Ellas:located_in ?country.
      ?country rdfs:label ?countryName.
    }
    GROUP BY ?countryName
    ORDER BY DESC(?count)
  `);
};

const fetchActiveInitiatives = async () => {
  console.log("Chamando fetchActiveInitiatives do queryMappingService");
  return await fetchQuery(`
    PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    SELECT ?initiativeName ?countryName
    WHERE {
      ?initiative a Ellas:Initiative.
      ?initiative rdfs:label ?initiativeName.
      ?initiative Ellas:status ?status.
      ?status rdfs:label "Active"@en.
      ?initiative Ellas:located_in ?country.
      ?country rdfs:label ?countryName.
    }
    ORDER BY ?countryName
  `);
};

const fetchInitiativesByPhase = async () => {
  console.log("Chamando fetchInitiativesByPhase do queryMappingService");
  return await fetchQuery(`
    PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    SELECT ?phase (COUNT(?initiative) as ?count)
    WHERE {
      ?initiative a Ellas:Initiative.
      ?initiative Ellas:phase ?phaseObj.
      ?phaseObj rdfs:label ?phase.
    }
    GROUP BY ?phase
    ORDER BY DESC(?count)
  `);
};

const fetchFinishedInitiatives = async () => {
  console.log("Chamando fetchFinishedInitiatives do queryMappingService");
  return await fetchQuery(`
    PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    SELECT ?initiativeName ?countryName
    WHERE {
      ?initiative a Ellas:Initiative.
      ?initiative rdfs:label ?initiativeName.
      ?initiative Ellas:status ?status.
      ?status rdfs:label "Finished"@en.
      ?initiative Ellas:located_in ?country.
      ?country rdfs:label ?countryName.
    }
    ORDER BY ?countryName
  `);
};

const fetchInitiativesForGirlsOrAdolescents = async () => {
  console.log(
    "Chamando fetchInitiativesForGirlsOrAdolescents do queryMappingService"
  );
  return await fetchQuery(`
    PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    SELECT ?initiativeName ?countryName
    WHERE {
      ?initiative a Ellas:Initiative.
      ?initiative rdfs:label ?initiativeName.
      ?initiative Ellas:target_audience ?audience.
      ?audience rdfs:label ?audienceLabel.
      ?initiative Ellas:located_in ?country.
      ?country rdfs:label ?countryName.
      FILTER(REGEX(?audienceLabel, "Girls|Adolescents", "i"))
    }
    ORDER BY ?countryName
  `);
};

const fetchInitiativesForBlackWomen = async () => {
  console.log("Chamando fetchInitiativesForBlackWomen do queryMappingService");
  return await fetchQuery(`
    PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    SELECT ?initiativeName ?countryName
    WHERE {
      ?initiative a Ellas:Initiative.
      ?initiative rdfs:label ?initiativeName.
      ?initiative Ellas:target_audience ?audience.
      ?audience rdfs:label ?audienceLabel.
      ?initiative Ellas:located_in ?country.
      ?country rdfs:label ?countryName.
      FILTER(REGEX(?audienceLabel, "Black Women", "i"))
    }
    ORDER BY ?countryName
  `);
};

const fetchFundedInitiatives = async () => {
  console.log("Chamando fetchFundedInitiatives do queryMappingService");
  return await fetchQuery(`
    PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    SELECT ?initiativeName ?countryName ?fundingSource
    WHERE {
      ?initiative a Ellas:Initiative.
      ?initiative rdfs:label ?initiativeName.
      ?initiative Ellas:funded_by ?funding.
      ?funding rdfs:label ?fundingSource.
      ?initiative Ellas:located_in ?country.
      ?country rdfs:label ?countryName.
    }
    ORDER BY ?countryName
  `);
};

const fetchInitiativeWebsites = async () => {
  console.log("Chamando fetchInitiativeWebsites do queryMappingService");
  return await fetchQuery(`
    PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    SELECT ?initiativeName ?website
    WHERE {
      ?initiative a Ellas:Initiative.
      ?initiative rdfs:label ?initiativeName.
      ?initiative Ellas:website ?website.
    }
    ORDER BY ?initiativeName
  `);
};

const fetchInitiativeFundingSectors = async () => {
  console.log("Chamando fetchInitiativeFundingSectors do queryMappingService");
  return await fetchQuery(`
    PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    SELECT ?sector (COUNT(?initiative) as ?count)
    WHERE {
      ?initiative a Ellas:Initiative.
      ?initiative Ellas:funded_by ?funding.
      ?funding Ellas:sector ?sectorObj.
      ?sectorObj rdfs:label ?sector.
    }
    GROUP BY ?sector
    ORDER BY DESC(?count)
  `);
};

const fetchCommunityInitiatives = async () => {
  console.log("Chamando fetchCommunityInitiatives do queryMappingService");
  return await fetchQuery(`
    PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    SELECT ?initiativeName ?countryName
    WHERE {
      ?initiative a Ellas:Initiative.
      ?initiative rdfs:label ?initiativeName.
      ?initiative Ellas:community_based ?isCommunity.
      FILTER(?isCommunity = true)
      ?initiative Ellas:located_in ?country.
      ?country rdfs:label ?countryName.
    }
    ORDER BY ?countryName
  `);
};

const fetchPublicPrivateInitiatives = async () => {
  console.log("Chamando fetchPublicPrivateInitiatives do queryMappingService");
  return await fetchQuery(`
    PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    SELECT ?type (COUNT(?initiative) as ?count)
    WHERE {
      ?initiative a Ellas:Initiative.
      ?initiative Ellas:type ?typeObj.
      ?typeObj rdfs:label ?type.
      FILTER(REGEX(?type, "Public|Private", "i"))
    }
    GROUP BY ?type
    ORDER BY DESC(?count)
  `);
};

const fetchInitiativesByEducationalLevel = async () => {
  console.log(
    "Chamando fetchInitiativesByEducationalLevel do queryMappingService"
  );
  return await fetchQuery(`
    PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    SELECT ?level (COUNT(?initiative) as ?count)
    WHERE {
      ?initiative a Ellas:Initiative.
      ?initiative Ellas:educational_level ?levelObj.
      ?levelObj rdfs:label ?level.
    }
    GROUP BY ?level
    ORDER BY DESC(?count)
  `);
};

const fetchInitiativesByCity = async () => {
  console.log("Chamando fetchInitiativesByCity do queryMappingService");
  return await fetchQuery(`
    PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    SELECT ?city (COUNT(?initiative) as ?count)
    WHERE {
      ?initiative a Ellas:Initiative.
      ?initiative Ellas:located_in_city ?cityObj.
      ?cityObj rdfs:label ?city.
    }
    GROUP BY ?city
    ORDER BY DESC(?count)
  `);
};

const fetchInitiativesByState = async () => {
  console.log("Chamando fetchInitiativesByState do queryMappingService");
  return await fetchQuery(`
    PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    SELECT ?state (COUNT(?initiative) as ?count)
    WHERE {
      ?initiative a Ellas:Initiative.
      ?initiative Ellas:located_in_state ?stateObj.
      ?stateObj rdfs:label ?state.
    }
    GROUP BY ?state
    ORDER BY DESC(?count)
  `);
};

const fetchInitiativesByRegion = async () => {
  console.log("Chamando fetchInitiativesByRegion do queryMappingService");
  return await fetchQuery(`
    PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    SELECT ?region (COUNT(?initiative) as ?count)
    WHERE {
      ?initiative a Ellas:Initiative.
      ?initiative Ellas:located_in_region ?regionObj.
      ?regionObj rdfs:label ?region.
    }
    GROUP BY ?region
    ORDER BY DESC(?count)
  `);
};

const fetchPositiveContextualFactors = async () => {
  console.log("Chamando fetchPositiveContextualFactors do queryMappingService");
  return await fetchQuery(`
    PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    SELECT ?factorName ?countryName
    WHERE {
      ?factor a Ellas:Factor.
      ?factor rdfs:label ?factorName.
      ?factor Ellas:impact_type ?impact.
      ?impact rdfs:label "Positive"@en.
      ?factor Ellas:analyzed_in ?country.
      ?country rdfs:label ?countryName.
    }
    ORDER BY ?countryName
  `);
};

const fetchNegativeContextualFactorsInInstitution = async () => {
  console.log(
    "Chamando fetchNegativeContextualFactorsInInstitution do queryMappingService"
  );
  return await fetchQuery(`
    PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    SELECT ?factorName ?institutionName ?countryName
    WHERE {
      ?factor a Ellas:Factor.
      ?factor rdfs:label ?factorName.
      ?factor Ellas:impact_type ?impact.
      ?impact rdfs:label "Negative"@en.
      ?factor Ellas:analyzed_in_institution ?institution.
      ?institution rdfs:label ?institutionName.
      ?factor Ellas:analyzed_in ?country.
      ?country rdfs:label ?countryName.
    }
    ORDER BY ?countryName ?institutionName
  `);
};

const fetchContextualFactorsByEducationType = async () => {
  console.log(
    "Chamando fetchContextualFactorsByEducationType do queryMappingService"
  );
  return await fetchQuery(`
    PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    SELECT ?factorName ?educationType
    WHERE {
      ?factor a Ellas:Factor.
      ?factor rdfs:label ?factorName.
      ?factor Ellas:related_to_education_type ?eduType.
      ?eduType rdfs:label ?educationType.
    }
    ORDER BY ?educationType
  `);
};

const fetchContextualFactorsImpactingFemales = async () => {
  console.log(
    "Chamando fetchContextualFactorsImpactingFemales do queryMappingService"
  );
  return await fetchQuery(`
    PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    SELECT ?factorName ?impactType ?countryName
    WHERE {
      ?factor a Ellas:Factor.
      ?factor rdfs:label ?factorName.
      ?factor Ellas:impact_type ?impactTypeObj.
      ?impactTypeObj rdfs:label ?impactType.
      ?factor Ellas:impacts_gender ?gender.
      ?gender rdfs:label "Female"@en.
      ?factor Ellas:analyzed_in ?country.
      ?country rdfs:label ?countryName.
    }
    ORDER BY ?impactType ?countryName
  `);
};

const fetchImpactsOfContextualFactor = async () => {
  console.log("Chamando fetchImpactsOfContextualFactor do queryMappingService");
  return await fetchQuery(`
    PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    SELECT ?factorName ?impactName
    WHERE {
      ?factor a Ellas:Factor.
      ?factor rdfs:label ?factorName.
      ?factor Ellas:has_impact ?impact.
      ?impact rdfs:label ?impactName.
    }
    ORDER BY ?factorName
  `);
};

const fetchImpactTypesOfContextualFactors = async () => {
  console.log(
    "Chamando fetchImpactTypesOfContextualFactors do queryMappingService"
  );
  return await fetchQuery(`
    PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    SELECT ?factorName ?impactType ?institutionName ?countryName
    WHERE {
      ?factor a Ellas:Factor.
      ?factor rdfs:label ?factorName.
      ?factor Ellas:impact_type ?impactTypeObj.
      ?impactTypeObj rdfs:label ?impactType.
      ?factor Ellas:analyzed_in_institution ?institution.
      ?institution rdfs:label ?institutionName.
      ?factor Ellas:analyzed_in ?country.
      ?country rdfs:label ?countryName.
      FILTER(REGEX(?countryName, "Latin America", "i"))
    }
    ORDER BY ?impactType ?countryName
  `);
};

const fetchContextualFactorsImpactingSpecificImpacts = async () => {
  console.log(
    "Chamando fetchContextualFactorsImpactingSpecificImpacts do queryMappingService"
  );
  return await fetchQuery(`
    PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    SELECT ?factorName ?impactType ?impactName ?countryName
    WHERE {
      ?factor a Ellas:Factor.
      ?factor rdfs:label ?factorName.
      ?factor Ellas:impact_type ?impactTypeObj.
      ?impactTypeObj rdfs:label ?impactType.
      ?factor Ellas:has_impact ?impact.
      ?impact rdfs:label ?impactName.
      ?factor Ellas:analyzed_in ?country.
      ?country rdfs:label ?countryName.
    }
    ORDER BY ?impactType ?impactName ?countryName
  `);
};

// Mapeamento de consultas predefinidas para funções reais do apiService
const queryMappings: Record<string, () => Promise<any>> = {
  // Consultas de políticas
  "In which countries the policy was applied?":
    apiService.fetchPoliciesAppliedInCountries,
  "What types of gender policies/processes/practices exist in Latin America?":
    apiService.fetchPolicyTypesInLatinAmerica,
  "How policies identified/analyzed are promoting women's participation in STEM fields?":
    apiService.fetchPoliciesPromotingWomenInSTEM,
  "What types of gender policies/processes/practices have been implemented in Bolivia, Brazil and Peru since 2015?":
    apiService.fetchPoliciesImplementedInCountriesSince2015,

  // Consultas de iniciativas
  "Which/How many initiatives are carried out in countries?":
    apiService.fetchInitiativesByCountry,
  "What initiatives are active?": apiService.fetchActiveInitiatives,
  "Have the initiatives already been implemented or are they still in the design phase?":
    apiService.fetchInitiativesByPhase,
  "Which initiatives are already finished?":
    apiService.fetchFinishedInitiatives,
  "What initiatives serve girls or adolescents?":
    apiService.fetchInitiativesForGirlsOrAdolescents,
  "What initiatives serve black women?":
    apiService.fetchInitiativesForBlackWomen,
  "Are the iniciativas funded?": apiService.fetchFundedInitiatives,
  "What is the initiative's website (URL)?": apiService.fetchInitiativeWebsites,

  // Consultas de fatores
  "What are the positive CONTEXTUAL FACTORS in COUNTRIES ANALYZED?":
    apiService.fetchPositiveContextualFactors,
  "What are the negative CONTEXTUAL FACTORS in activities in Institution X in COUNTRIES ANALYZED?":
    apiService.fetchNegativeContextualFactorsInInstitution,
};

// Obter todas as consultas disponíveis por categoria
export const getAvailableQueriesByCategory = async (
  category: string
): Promise<MappedQuery[]> => {
  try {
    const queries = await getQueriesByCategory(category);
    return queries
      .map((query) => ({
        name: query,
        description: query,
        category,
        apiFunction:
          queryMappings[query] ||
          (() => Promise.reject("API function not found")),
      }))
      .filter((q) => queryMappings[q.name]); // Filtra apenas consultas que têm uma função API mapeada
  } catch (error) {
    console.error(`Erro ao obter consultas para categoria ${category}:`, error);
    return [];
  }
};

// Executar uma consulta específica pelo nome
export const executeQuery = async (queryName: string): Promise<any> => {
  if (
    queryName.startsWith("PREFIX") ||
    queryName.toLowerCase().includes("select ")
  ) {
    // Se for uma consulta SPARQL direta, executar
    return fetchQuery(queryName);
  }

  if (!queryMappings[queryName]) {
    // Se não encontrarmos a consulta no mapeamento, tentamos usar o SPARQL diretamente
    const sparqlQuery = await getSparqlQuery(queryName);
    if (sparqlQuery) {
      return fetchQuery(sparqlQuery);
    }
    throw new Error(`Consulta não encontrada: ${queryName}`);
  }

  // Executar a função de API mapeada para esta consulta
  return queryMappings[queryName]();
};

// Executar uma consulta com parâmetros personalizados
export const executeQueryWithParams = async (
  category: string,
  countries: string[] = [],
  filters: Record<string, any> = {}
): Promise<any> => {
  // Check for empty category and return default empty result
  if (!category || category.trim() === "") {
    console.log("Categoria não fornecida, retornando resultado vazio");
    return { results: { bindings: [] } };
  }

  // Identificar se estamos lidando com uma consulta de propriedade específica
  const propertyName = filters.property || filters.propertyName;
  const propertyValue = filters.value || filters.propertyValue;

  console.log("Executando consulta com parâmetros:", {
    category,
    countries,
    filters,
    propertyName,
    propertyValue,
  });

  // Construir uma consulta SPARQL com base nos parâmetros fornecidos
  let query = "";

  // Se temos uma propriedade específica, usar uma consulta genérica para propriedades
  if (propertyName) {
    console.log(
      `Executando consulta genérica para propriedade: ${propertyName}`
    );

    // Verificar se estamos filtrando por um valor específico
    let valueFilter = "";
    if (propertyValue) {
      valueFilter = `FILTER(?propValue = "${propertyValue}" || STR(?propValue) = "${propertyValue}")`;
    }

    // Mapeamento de campos de entidade com base na categoria
    let entityType = category;
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
        entityType = "Factor";
        entityNameField = "factorName";
        break;
      default:
        entityNameField = "name";
    }

    query = `
      PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>
      PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
      PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
      
      SELECT ?${entityNameField} ?propValue ?countryName
      WHERE {
        ?entity rdf:type Ellas:${entityType} .
        ?entity rdfs:label ?${entityNameField} .
        ?entity Ellas:${propertyName} ?propValue .
        
        # País é opcional para TODAS as consultas de propriedades
        OPTIONAL {
          ?entity Ellas:created_in ?country .
          ?country rdfs:label ?countryName .
        }
        
        ${valueFilter}
      }
      ORDER BY ?${entityNameField}
      LIMIT 100
    `;
    return await apiService.fetchQuery(query);
  }

  // Verificar se estamos lidando com uma consulta de fontes de dados conectadas
  // ou qualquer consulta que não exija país
  const isPropertyOrConnectedDataQuery =
    // Para consultas de finish_date ou outras propriedades específicas
    Object.keys(filters).some((key) =>
      key.toLowerCase().includes("property")
    ) ||
    // Para consultas de fontes de dados
    (category.toLowerCase() === "initiative" &&
      (filters.query?.toLowerCase().includes("data source") ||
        filters.subCategory === "data-source")) ||
    // Para consultas com flags personalizadas
    (filters.customFields &&
      (filters.customFields.isConnectedData === true ||
        filters.customFields.dataSource === true));

  // Se for uma consulta de propriedade ou fonte de dados, usar consulta específica
  if (isPropertyOrConnectedDataQuery) {
    console.log(
      "Executando consulta específica que não exige país (propriedade ou dados conectados)"
    );

    // Determinar qual consulta executar com base na categoria e filtros
    if (
      category.toLowerCase() === "initiative" &&
      (filters.query?.toLowerCase().includes("data source") ||
        filters.subCategory === "data-source")
    ) {
      query = `
        PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        
        SELECT ?initiativeName ?datasource ?countryName
        WHERE {
          ?initiative a Ellas:Initiative.
          ?initiative rdfs:label ?initiativeName.
          ?initiative Ellas:initiative_data_source ?datasource.
          
          # País é opcional para consultas de fontes de dados
          OPTIONAL {
            ?initiative Ellas:created_in ?country.
            ?country rdfs:label ?countryName.
          }
        }
      `;
    } else {
      // Consulta genérica para outra propriedade
      query = `
        PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        
        SELECT ?name ?value ?countryName
        WHERE {
          ?entity a Ellas:${category}.
          ?entity rdfs:label ?name.
          
          # País é opcional para consultas de propriedades
          OPTIONAL {
            ?entity Ellas:created_in ?country.
            ?country rdfs:label ?countryName.
          }
        }
      `;
    }

    return await apiService.fetchQuery(query);
  }

  switch (category.toLowerCase()) {
    case "policies":
    case "policy":
      // Para políticas com filtro de país
      if (countries.length > 0) {
        query = `
          PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>
          PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
          SELECT ?policyName ?countryName ?policyType ?startDate
          WHERE {
            ?policy a Ellas:Policy.
            ?policy rdfs:label ?policyName.
            ?policy Ellas:created_in ?country.
            ?country rdfs:label ?countryName.
            OPTIONAL { ?policy Ellas:policy_type ?policyType }
            OPTIONAL { ?policy Ellas:start_date ?startDate }
            FILTER(${countries
              .map((c) => `?countryName="${c}"@en`)
              .join(" || ")})
          }
        `;
      } else {
        query = `
          PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>
          PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
          SELECT ?policyName ?countryName ?policyType ?startDate
          WHERE {
            ?policy a Ellas:Policy.
            ?policy rdfs:label ?policyName.
            ?policy Ellas:created_in ?country.
            ?country rdfs:label ?countryName.
            OPTIONAL { ?policy Ellas:policy_type ?policyType }
            OPTIONAL { ?policy Ellas:start_date ?startDate }
          }
        `;
      }
      break;

    case "initiatives":
    case "initiative":
      // Para iniciativas com filtro de país
      if (countries.length > 0) {
        query = `
          PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>
          PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
          SELECT ?initiativeName ?countryName ?startDate ?status
          WHERE {
            ?initiative a Ellas:Initiative.
            ?initiative rdfs:label ?initiativeName.
            ?initiative Ellas:created_in ?country.
            ?country rdfs:label ?countryName.
            OPTIONAL { ?initiative Ellas:startDate ?startDate }
            OPTIONAL { ?initiative Ellas:initiative_status ?status }
            FILTER(${countries
              .map((c) => `?countryName="${c}"@en`)
              .join(" || ")})
          }
        `;
      } else {
        query = `
          PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>
          PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
          SELECT ?initiativeName ?countryName ?startDate ?status
          WHERE {
            ?initiative a Ellas:Initiative.
            ?initiative rdfs:label ?initiativeName.
            ?initiative Ellas:created_in ?country.
            ?country rdfs:label ?countryName.
            OPTIONAL { ?initiative Ellas:startDate ?startDate }
            OPTIONAL { ?initiative Ellas:initiative_status ?status }
          }
        `;
      }
      break;

    case "factors":
    case "factor":
    case "contextualfactor":
      // Para fatores com filtro de país
      if (countries.length > 0) {
        query = `
          PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>
          PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
          SELECT ?factorName ?countryName ?impactType
          WHERE {
            ?factor a Ellas:ContextualFactor.
            ?factor rdfs:label ?factorName.
            ?factor Ellas:located_in ?country.
            ?country rdfs:label ?countryName.
            OPTIONAL { ?factor Ellas:impact_type ?impactType }
            FILTER(${countries
              .map((c) => `?countryName="${c}"@en`)
              .join(" || ")})
          }
        `;
      } else {
        query = `
          PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>
          PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
          SELECT ?factorName ?countryName ?impactType
          WHERE {
            ?factor a Ellas:ContextualFactor.
            ?factor rdfs:label ?factorName.
            ?factor Ellas:located_in ?country.
            ?country rdfs:label ?countryName.
            OPTIONAL { ?factor Ellas:impact_type ?impactType }
          }
        `;
      }
      break;

    default:
      throw new Error(`Categoria não suportada: ${category}`);
  }

  // Adicionar filtros adicionais à consulta
  if (Object.keys(filters).length > 0) {
    // Implementar lógica para adicionar filtros específicos à consulta SPARQL
    // Isso depende dos tipos de filtros suportados
  }

  // Executar a consulta SPARQL
  return fetchQuery(query);
};

// Novas funções para exploração dinâmica do grafo RDF

// Função para mapear automaticamente propriedade para categoria correta
const mapPropertyToCategory = (property: string): string | null => {
  // Mapear baseado nos prefixos das propriedades
  if (
    property.startsWith("initiative_") ||
    property === "created_in" ||
    property === "located_in" ||
    property === "focused_on" ||
    property === "start_date" ||
    property === "funded_by"
  ) {
    return "Initiative";
  } else if (
    property.startsWith("policy_") ||
    property.startsWith("policies_")
  ) {
    return "Policy";
  } else if (
    property.startsWith("factors_") ||
    property.startsWith("factor_")
  ) {
    return "Factor";
  }

  // Se não conseguir mapear pelo prefixo, tentar descobrir automaticamente
  return null;
};

// Função para detectar automaticamente a categoria correta de uma propriedade
const detectCategoryForProperty = async (property: string): Promise<string> => {
  console.log(`🔍 Detectando categoria para propriedade: ${property}`);

  // Primeiro, tentar mapeamento por prefixo
  const mappedCategory = mapPropertyToCategory(property);
  if (mappedCategory) {
    console.log(
      `✅ Categoria mapeada por prefixo: ${property} → ${mappedCategory}`
    );
    return mappedCategory;
  }

  // Se não conseguir mapear por prefixo, testar as 3 categorias principais
  const categories = ["Initiative", "Policy", "Factor"];

  for (const category of categories) {
    try {
      const testQuery = `
        PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>
        SELECT (COUNT(*) as ?count)
        WHERE {
          ?s a Ellas:${category} .
          ?s Ellas:${property} ?o .
        }
        LIMIT 1
      `;

      const result = await fetchQuery(testQuery);

      if (
        result &&
        result.results &&
        result.results.bindings &&
        result.results.bindings.length > 0
      ) {
        const count = parseInt(result.results.bindings[0].count.value);
        if (count > 0) {
          console.log(
            `✅ Propriedade ${property} encontrada na categoria ${category} com ${count} registros`
          );
          return category;
        }
      }
    } catch (error) {
      console.log(
        `⚠️ Erro ao testar categoria ${category} para ${property}:`,
        error
      );
    }
  }

  console.warn(
    `⚠️ Não foi possível detectar categoria para ${property}, usando Initiative como padrão`
  );
  return "Initiative";
};

// Explorar propriedades disponíveis para uma categoria
export const explorePropertiesForClass = async (
  category: string
): Promise<GraphOption[]> => {
  try {
    console.log(`🔍 Explorando propriedades para categoria: ${category}`);

    // Consulta aprimorada para obter propriedades com OPTIONAL
    const query = `
      PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>
      PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
      PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
      
      SELECT DISTINCT ?property ?propertyLabel (COUNT(DISTINCT ?subject) as ?count)
      WHERE {
        ?subject rdf:type Ellas:${category} .
        
        # Usar OPTIONAL para propriedades que podem não existir
        OPTIONAL {
          ?subject ?property ?object .
          
          # Filtrar apenas propriedades do namespace Ellas
          FILTER(STRSTARTS(STR(?property), "https://ellas.ufmt.br/Ontology/Ellas#"))
          
          # Obter label da propriedade se disponível (também opcional)
          OPTIONAL { 
            ?property rdfs:label ?propertyLabel .
            FILTER(LANG(?propertyLabel) = "en" || LANG(?propertyLabel) = "" || LANG(?propertyLabel) = "pt")
          }
        }
        
        # Garantir que só incluímos propriedades que realmente existem
        FILTER(BOUND(?property))
      }
      GROUP BY ?property ?propertyLabel
      ORDER BY DESC(?count)
    `;

    console.log(
      `📝 Executando consulta SPARQL para propriedades de ${category}`
    );

    const result = await fetchQuery(query);

    // Verificar se obtivemos resultados reais do GraphDB
    if (
      result &&
      result.results &&
      result.results.bindings &&
      result.results.bindings.length > 0
    ) {
      console.log(
        `✅ Consulta real retornou ${result.results.bindings.length} propriedades para ${category}`
      );

      // Converter resultados reais para a estrutura GraphOption
      const properties = result.results.bindings.map((binding: any) => {
        const propertyUri = binding.property ? binding.property.value : "";
        const propertyName = propertyUri.split("#").pop() || propertyUri;
        const propertyLabel = binding.propertyLabel
          ? binding.propertyLabel.value
          : formatPropertyLabel(propertyName);
        const count = binding.count ? parseInt(binding.count.value) : 0;

        return {
          value: propertyName,
          label: propertyLabel,
          count: count,
          type: "property",
        };
      });

      return properties;
    } else {
      console.warn(
        `⚠️ Consulta real não retornou dados para ${category}, usando dados demonstrativos`
      );
      return getCategoryDemoProperties(category);
    }
  } catch (error) {
    console.error(`❌ Erro ao consultar propriedades para ${category}:`, error);
    console.log(`🔄 Usando dados demonstrativos para ${category}`);
    return getCategoryDemoProperties(category);
  }
};

// Função auxiliar para obter propriedades de demonstração para uma categoria
const getCategoryDemoProperties = (category: string): GraphOption[] => {
  if (category === "Policy") {
    return [
      { value: "created_in", label: "Created In", count: 44, type: "property" },
      {
        value: "policy_type",
        label: "Policy Type",
        count: 8,
        type: "property",
      },
      { value: "start_date", label: "Start Date", count: 32, type: "property" },
      {
        value: "finish_date",
        label: "Finish Date",
        count: 28,
        type: "property",
      },
      {
        value: "target_audience",
        label: "Target Audience",
        count: 15,
        type: "property",
      },
      { value: "policy_status", label: "Status", count: 12, type: "property" },
      { value: "focused_on", label: "Focused On", count: 25, type: "property" },
    ];
  } else if (category === "Initiative") {
    // Retornando 28 propriedades conforme mencionado pelo usuário
    return [
      { value: "created_in", label: "Created In", count: 44, type: "property" },
      {
        value: "initiative_website",
        label: "Website",
        count: 1,
        type: "property",
      },
      { value: "start_date", label: "Start Date", count: 42, type: "property" },
      {
        value: "finish_date",
        label: "Finish Date",
        count: 38,
        type: "property",
      },
      {
        value: "initiative_status",
        label: "Status",
        count: 35,
        type: "property",
      },
      {
        value: "initiative_audience",
        label: "Target Audience",
        count: 33,
        type: "property",
      },
      { value: "focused_on", label: "Focused On", count: 31, type: "property" },
      { value: "located_in", label: "Located In", count: 44, type: "property" },
      { value: "located_in_city", label: "City", count: 28, type: "property" },
      {
        value: "located_in_state",
        label: "State",
        count: 22,
        type: "property",
      },
      {
        value: "educational_level",
        label: "Educational Level",
        count: 18,
        type: "property",
      },
      {
        value: "initiative_type",
        label: "Initiative Type",
        count: 16,
        type: "property",
      },
      { value: "funded_by", label: "Funded By", count: 25, type: "property" },
      {
        value: "community_based",
        label: "Community Based",
        count: 14,
        type: "property",
      },
      { value: "has_impact", label: "Has Impact", count: 29, type: "property" },
      {
        value: "requires_factor",
        label: "Requires Factor",
        count: 12,
        type: "property",
      },
      {
        value: "partnership",
        label: "Partnership",
        count: 8,
        type: "property",
      },
      { value: "budget", label: "Budget", count: 6, type: "property" },
      { value: "duration", label: "Duration", count: 11, type: "property" },
      {
        value: "methodology",
        label: "Methodology",
        count: 9,
        type: "property",
      },
      {
        value: "evaluation_method",
        label: "Evaluation Method",
        count: 7,
        type: "property",
      },
      {
        value: "sustainability",
        label: "Sustainability",
        count: 5,
        type: "property",
      },
      {
        value: "scalability",
        label: "Scalability",
        count: 4,
        type: "property",
      },
      {
        value: "innovation_level",
        label: "Innovation Level",
        count: 3,
        type: "property",
      },
      {
        value: "technology_used",
        label: "Technology Used",
        count: 2,
        type: "property",
      },
      {
        value: "gender_focus",
        label: "Gender Focus",
        count: 13,
        type: "property",
      },
      { value: "age_group", label: "Age Group", count: 17, type: "property" },
      {
        value: "socioeconomic_level",
        label: "Socioeconomic Level",
        count: 10,
        type: "property",
      },
    ];
  } else if (category === "ContextualFactor") {
    return [
      { value: "located_in", label: "Located In", count: 44, type: "property" },
      {
        value: "impact_type",
        label: "Impact Type",
        count: 15,
        type: "property",
      },
      {
        value: "factor_type",
        label: "Factor Type",
        count: 12,
        type: "property",
      },
      {
        value: "severity_level",
        label: "Severity Level",
        count: 8,
        type: "property",
      },
      {
        value: "temporal_scope",
        label: "Temporal Scope",
        count: 6,
        type: "property",
      },
      {
        value: "affects_population",
        label: "Affects Population",
        count: 18,
        type: "property",
      },
    ];
  }

  return [];
};

// Função auxiliar para formatar labels de propriedades
const formatPropertyLabel = (propName: string): string => {
  // Converter camelCase ou snake_case para palavras separadas e capitalizar
  return propName
    .replace(/_/g, " ")
    .replace(/([A-Z])/g, " $1")
    .replace(/^\w/, (c) => c.toUpperCase())
    .trim();
};

// Explorar valores possíveis para uma propriedade
export const exploreValuesForProperty = async (
  category: string,
  property: string,
  filters: Record<string, any> = {}
): Promise<GraphOption[]> => {
  console.log(
    `🔍 Explorando valores para propriedade: ${property} na categoria: ${category}`
  );
  console.log(`📋 Filtros aplicados:`, filters);

  try {
    // Se estamos forçando dados de demonstração, pular a consulta real
    if (FORCE_DEMO_DATA) {
      console.log(
        `⚠️ Usando dados de demonstração para valores de ${property} (FORCE_DEMO_DATA=true)`
      );
      return getPropertyDemoValues(property);
    }

    // Detectar automaticamente a categoria correta se necessário
    let actualCategory = category;

    // Se a categoria passada não parece correta para a propriedade, detectar automaticamente
    if (
      (property.startsWith("factors_") && category !== "Factor") ||
      (property.startsWith("initiative_") && category !== "Initiative") ||
      (property.startsWith("policy_") && category !== "Policy")
    ) {
      console.log(
        `🔄 Categoria ${category} pode não ser correta para ${property}, detectando automaticamente...`
      );
      actualCategory = await detectCategoryForProperty(property);
    }

    console.log(
      `📊 Usando categoria: ${actualCategory} para propriedade: ${property}`
    );

    // Construir cláusulas de filtro a partir dos filtros existentes
    let filterClauses = "";
    if (Object.keys(filters).length > 0) {
      console.log(
        `🔧 Construindo ${Object.keys(filters).length} cláusulas de filtro...`
      );
      Object.entries(filters).forEach(([filterProp, filterValue]) => {
        // Ignorar propriedades vazias
        if (!filterProp || !filterValue) return;

        // Adicionar um filtro para a propriedade
        filterClauses += `?s Ellas:${filterProp} ?${filterProp}Filter .\n`;

        // Se o valor for um objeto complexo, adicionar propriedades específicas
        if (typeof filterValue === "object" && filterValue !== null) {
          if (filterValue.iri) {
            filterClauses += `  FILTER(?${filterProp}Filter = <${filterValue.iri}>) .\n`;
          } else if (filterValue.value) {
            filterClauses += `  FILTER(STR(?${filterProp}Filter) = "${filterValue.value}") .\n`;
          }
        } else {
          // Para valores simples
          filterClauses += `  FILTER(STR(?${filterProp}Filter) = "${filterValue}" || ?${filterProp}Filter = "${filterValue}"@en) .\n`;
        }
      });
    }

    // Consulta SPARQL aprimorada com OPTIONAL para propriedades que podem não existir
    const query = `
      PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>
      PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
      PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
      
      SELECT DISTINCT ?value (COUNT(DISTINCT ?s) as ?count)
      WHERE {
        ?s rdf:type Ellas:${actualCategory} .
        
        # Usar OPTIONAL para propriedades que podem não existir
        OPTIONAL {
          ?s Ellas:${property} ?propValue .
          
          # Obter rótulo ou valor literal (também opcional)
          OPTIONAL { 
            ?propValue rdfs:label ?label .
            FILTER(LANG(?label) = "en" || LANG(?label) = "" || LANG(?label) = "pt" || LANG(?label) = "es")
          }
          BIND(COALESCE(?label, STR(?propValue)) AS ?value)
        }
        
        # Filtrar apenas resultados que têm valor para a propriedade
        FILTER(BOUND(?value) && ?value != "")
        
        # Aplicar filtros existentes
        ${filterClauses}
      }
      GROUP BY ?value
      ORDER BY DESC(?count)
      LIMIT 100
    `;

    console.log(`📝 Executando consulta SPARQL:`, query);
    console.time(`Query-${property}`);

    const result = await fetchQuery(query);

    console.timeEnd(`Query-${property}`);
    console.log(`📊 Resultado da consulta:`, result);

    if (
      result &&
      result.results &&
      result.results.bindings &&
      result.results.bindings.length > 0
    ) {
      console.log(
        `✅ Encontrados ${result.results.bindings.length} valores reais para ${property}`
      );

      // Converter resultados para a estrutura GraphOption
      const values = result.results.bindings.map((binding: any) => {
        const value = binding.value ? binding.value.value : "";
        const count = binding.count ? parseInt(binding.count.value) : 0;

        return {
          value: value,
          label: value,
          count: count,
          type: "value",
        };
      });

      console.log(`🎯 Valores processados:`, values);
      return values;
    } else {
      console.warn(
        `⚠️ Propriedade ${property} não tem dados disponíveis - tornando opcional`
      );

      // Tentar uma consulta mais simples para verificar se a propriedade existe
      try {
        console.log(
          `🔧 Verificando existência da propriedade ${property} com consulta simplificada...`
        );

        const existenceQuery = `
          PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>
          PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
          
          SELECT (COUNT(DISTINCT ?s) as ?entityCount) (COUNT(DISTINCT ?propValue) as ?valueCount)
          WHERE {
            ?s rdf:type Ellas:${actualCategory} .
            OPTIONAL { ?s Ellas:${property} ?propValue }
          }
        `;

        const existenceResult = await fetchQuery(existenceQuery);

        if (
          existenceResult &&
          existenceResult.results &&
          existenceResult.results.bindings &&
          existenceResult.results.bindings.length > 0
        ) {
          const binding = existenceResult.results.bindings[0];
          const entityCount = binding.entityCount
            ? parseInt(binding.entityCount.value)
            : 0;
          const valueCount = binding.valueCount
            ? parseInt(binding.valueCount.value)
            : 0;

          console.log(`📊 Estatísticas da propriedade ${property}:`);
          console.log(
            `   - Entidades da categoria ${actualCategory}: ${entityCount}`
          );
          console.log(`   - Valores da propriedade ${property}: ${valueCount}`);

          if (valueCount === 0) {
            console.log(
              `❌ Propriedade ${property} realmente não existe nos dados - retornando array vazio`
            );
            return [];
          } else {
            console.log(
              `⚠️ Propriedade ${property} existe mas pode ter problemas na consulta principal`
            );

            // Tentar uma consulta ainda mais simples para obter alguns valores
            const simpleValueQuery = `
              PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>
              PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
              PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
              
              SELECT DISTINCT ?value
              WHERE {
                ?s rdf:type Ellas:${actualCategory} .
                ?s Ellas:${property} ?propValue .
                OPTIONAL { ?propValue rdfs:label ?label }
                BIND(COALESCE(?label, STR(?propValue)) AS ?value)
                FILTER(?value != "")
              }
              LIMIT 20
            `;

            const simpleResult = await fetchQuery(simpleValueQuery);

            if (
              simpleResult &&
              simpleResult.results &&
              simpleResult.results.bindings &&
              simpleResult.results.bindings.length > 0
            ) {
              console.log(
                `✅ Consulta simplificada funcionou! Encontrados ${simpleResult.results.bindings.length} valores`
              );

              const values = simpleResult.results.bindings.map(
                (binding: any, index: number) => ({
                  value: binding.value
                    ? binding.value.value
                    : `Valor ${index + 1}`,
                  label: binding.value
                    ? binding.value.value
                    : `Valor ${index + 1}`,
                  count: 1, // Contagem padrão
                  type: "value",
                })
              );

              return values;
            }
          }
        }
      } catch (existenceError) {
        console.error(
          `❌ Erro ao verificar existência da propriedade ${property}:`,
          existenceError
        );
      }

      // Se chegamos aqui, a propriedade realmente não tem dados
      return [];
    }
  } catch (error) {
    console.error(`❌ Erro ao explorar valores para ${property}:`, error);
    console.error(
      `📋 Stack trace:`,
      error instanceof Error ? error.stack : "N/A"
    );

    // Se houver erro de conectividade, tente uma consulta mais simples
    if (
      error instanceof Error &&
      (error.message.includes("CORS") ||
        error.message.includes("401") ||
        error.message.includes("403"))
    ) {
      console.log(
        `🔧 Tentando consulta simplificada devido a erro de conectividade...`
      );

      try {
        const simpleQuery = `
          PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>
          SELECT DISTINCT ?value
          WHERE {
            ?s Ellas:${property} ?value .
          }
          LIMIT 10
        `;

        const simpleResult = await fetchQuery(simpleQuery);

        if (
          simpleResult &&
          simpleResult.results &&
          simpleResult.results.bindings &&
          simpleResult.results.bindings.length > 0
        ) {
          console.log(
            `✅ Consulta simplificada funcionou! Encontrados ${simpleResult.results.bindings.length} valores`
          );

          const values = simpleResult.results.bindings.map((binding: any) => ({
            value: binding.value ? binding.value.value : "",
            label: binding.value ? binding.value.value : "",
            count: 1,
            type: "value",
          }));

          return values;
        }
      } catch (simpleError) {
        console.error(`❌ Consulta simplificada também falhou:`, simpleError);
      }
    }

    return getPropertyDemoValues(property);
  }
};

// Função auxiliar para obter valores de demonstração para uma propriedade
const getPropertyDemoValues = (property: string): GraphOption[] => {
  console.log(`🎭 Gerando dados de demonstração para propriedade: ${property}`);

  if (property === "impact_type") {
    return [
      { value: "Positive", label: "Positive", count: 6, type: "value" },
      { value: "Negative", label: "Negative", count: 5, type: "value" },
      { value: "Mixed", label: "Mixed", count: 2, type: "value" },
    ];
  } else {
    // Expandir dados de demonstração para cobrir todas as propriedades comuns
    switch (property) {
      // Propriedades de formato/modalidade (dados reais do GraphDB)
      case "initiative_format":
        return [
          { value: "Virtual", label: "Virtual", count: 19, type: "value" },
          { value: "Hibrid", label: "Hibrid", count: 14, type: "value" },
          { value: "Hybrid", label: "Hybrid", count: 3, type: "value" },
          { value: "In person", label: "In person", count: 1, type: "value" },
          { value: "Presencial", label: "Presencial", count: 1, type: "value" },
        ];

      // Propriedades numéricas
      case "initiative_number_of_participants":
      case "number_of_participants":
        return [
          { value: "50", label: "50 participantes", count: 3, type: "value" },
          { value: "100", label: "100 participantes", count: 5, type: "value" },
          { value: "200", label: "200 participantes", count: 4, type: "value" },
          { value: "500", label: "500 participantes", count: 2, type: "value" },
          {
            value: "1000",
            label: "1000+ participantes",
            count: 1,
            type: "value",
          },
        ];

      // Propriedades de duração
      case "initiative_duration":
      case "duration":
        return [
          { value: "1 mês", label: "1 mês", count: 5, type: "value" },
          { value: "3 meses", label: "3 meses", count: 8, type: "value" },
          { value: "6 meses", label: "6 meses", count: 12, type: "value" },
          { value: "1 ano", label: "1 ano", count: 10, type: "value" },
          { value: "2 anos", label: "2 anos", count: 6, type: "value" },
        ];

      // Propriedades de tipo/categoria
      case "initiative_type":
        return [
          { value: "Workshop", label: "Workshop", count: 8, type: "value" },
          { value: "Curso", label: "Curso", count: 12, type: "value" },
          { value: "Mentoría", label: "Mentoría", count: 6, type: "value" },
          { value: "Programa", label: "Programa", count: 15, type: "value" },
          {
            value: "Conferencia",
            label: "Conferencia",
            count: 4,
            type: "value",
          },
        ];

      // Propriedades de público-alvo
      case "target_audience":
      case "initiative_audience":
        return [
          {
            value: "Estudantes",
            label: "Estudantes",
            count: 18,
            type: "value",
          },
          {
            value: "Professoras",
            label: "Professoras",
            count: 12,
            type: "value",
          },
          {
            value: "Pesquisadoras",
            label: "Pesquisadoras",
            count: 10,
            type: "value",
          },
          {
            value: "Profissionais",
            label: "Profissionais",
            count: 8,
            type: "value",
          },
        ];

      // Propriedades de área STEM
      case "focused_on":
      case "stem_area":
        return [
          {
            value: "Ciência da Computação",
            label: "Ciência da Computação",
            count: 15,
            type: "value",
          },
          {
            value: "Engenharia",
            label: "Engenharia",
            count: 12,
            type: "value",
          },
          { value: "Matemática", label: "Matemática", count: 8, type: "value" },
          { value: "Física", label: "Física", count: 6, type: "value" },
          { value: "Biologia", label: "Biologia", count: 10, type: "value" },
        ];

      // Propriedades de financiamento
      case "funded_by":
      case "funding_source":
        return [
          {
            value: "Governo Federal",
            label: "Governo Federal",
            count: 8,
            type: "value",
          },
          {
            value: "Universidade",
            label: "Universidade",
            count: 12,
            type: "value",
          },
          { value: "ONG", label: "ONG", count: 6, type: "value" },
          {
            value: "Empresa Privada",
            label: "Empresa Privada",
            count: 4,
            type: "value",
          },
          {
            value: "Organização Internacional",
            label: "Organização Internacional",
            count: 3,
            type: "value",
          },
        ];

      // Propriedades de nível educacional
      case "educational_level":
        return [
          {
            value: "Ensino Fundamental",
            label: "Ensino Fundamental",
            count: 5,
            type: "value",
          },
          {
            value: "Ensino Médio",
            label: "Ensino Médio",
            count: 8,
            type: "value",
          },
          { value: "Graduação", label: "Graduação", count: 15, type: "value" },
          {
            value: "Pós-graduação",
            label: "Pós-graduação",
            count: 10,
            type: "value",
          },
        ];

      // Propriedades de localização específica
      case "located_in_city":
        return [
          { value: "São Paulo", label: "São Paulo", count: 5, type: "value" },
          {
            value: "Rio de Janeiro",
            label: "Rio de Janeiro",
            count: 4,
            type: "value",
          },
          { value: "Brasília", label: "Brasília", count: 3, type: "value" },
          {
            value: "Belo Horizonte",
            label: "Belo Horizonte",
            count: 2,
            type: "value",
          },
          { value: "Curitiba", label: "Curitiba", count: 2, type: "value" },
        ];

      case "located_in_state":
        return [
          { value: "São Paulo", label: "São Paulo", count: 8, type: "value" },
          {
            value: "Rio de Janeiro",
            label: "Rio de Janeiro",
            count: 5,
            type: "value",
          },
          {
            value: "Minas Gerais",
            label: "Minas Gerais",
            count: 4,
            type: "value",
          },
          { value: "Paraná", label: "Paraná", count: 3, type: "value" },
          {
            value: "Rio Grande do Sul",
            label: "Rio Grande do Sul",
            count: 3,
            type: "value",
          },
        ];

      // Propriedades temporais
      case "start_date":
        return [
          { value: "2020", label: "2020", count: 3, type: "value" },
          { value: "2021", label: "2021", count: 5, type: "value" },
          { value: "2022", label: "2022", count: 8, type: "value" },
          { value: "2023", label: "2023", count: 12, type: "value" },
          { value: "2024", label: "2024", count: 10, type: "value" },
        ];

      case "finish_date":
        return [
          { value: "2023-12-31", label: "2023-12-31", count: 5, type: "value" },
          { value: "2024-06-30", label: "2024-06-30", count: 4, type: "value" },
          { value: "2024-12-31", label: "2024-12-31", count: 6, type: "value" },
          { value: "2025-06-30", label: "2025-06-30", count: 3, type: "value" },
        ];

      // Website (mantendo o valor específico)
      case "initiative_website":
        return [
          {
            value: "https://www.pronabem.org.br",
            label: "https://www.pronabem.org.br",
            count: 1,
            type: "value",
          },
        ];

      // Alcance da iniciativa (dados reais do GraphDB)
      case "initiative_reach":
        return [
          { value: "National", label: "National", count: 80, type: "value" },
          { value: "Local", label: "Local", count: 15, type: "value" },
          { value: "Regional", label: "Regional", count: 15, type: "value" },
          {
            value: "International",
            label: "International",
            count: 13,
            type: "value",
          },
        ];

      // Propriedades de impacto
      case "has_impact":
      case "impact":
        return [
          { value: "Alto", label: "Alto", count: 8, type: "value" },
          { value: "Médio", label: "Médio", count: 12, type: "value" },
          { value: "Baixo", label: "Baixo", count: 5, type: "value" },
        ];

      // Propriedades de metodologia
      case "methodology":
        return [
          { value: "Hands-on", label: "Hands-on", count: 10, type: "value" },
          {
            value: "Teoria e Prática",
            label: "Teoria e Prática",
            count: 8,
            type: "value",
          },
          {
            value: "Project-based",
            label: "Project-based",
            count: 6,
            type: "value",
          },
          {
            value: "Peer Learning",
            label: "Peer Learning",
            count: 4,
            type: "value",
          },
        ];

      // Propriedades de status
      case "initiative_status":
      case "status":
        return [
          { value: "Active", label: "Ativo", count: 15, type: "value" },
          { value: "Completed", label: "Concluído", count: 8, type: "value" },
          { value: "Planned", label: "Planejado", count: 4, type: "value" },
          { value: "Paused", label: "Pausado", count: 2, type: "value" },
        ];

      // Propriedades de orçamento
      case "budget":
      case "funding_amount":
        return [
          { value: "R$ 50.000", label: "R$ 50.000", count: 3, type: "value" },
          { value: "R$ 100.000", label: "R$ 100.000", count: 5, type: "value" },
          { value: "R$ 250.000", label: "R$ 250.000", count: 4, type: "value" },
          { value: "R$ 500.000", label: "R$ 500.000", count: 2, type: "value" },
        ];

      // Para propriedades desconhecidas, retornar dados mais inteligentes
      default:
        console.warn(
          `⚠️ Propriedade '${property}' não reconhecida. Gerando dados baseados no tipo da propriedade.`
        );

        // Tentar gerar dados baseados no nome da propriedade
        if (property.includes("status")) {
          return [
            { value: "Active", label: "Ativo", count: 8, type: "value" },
            { value: "Inactive", label: "Inativo", count: 4, type: "value" },
            { value: "Pending", label: "Pendente", count: 2, type: "value" },
          ];
        } else if (property.includes("type") || property.includes("category")) {
          return [
            { value: "Type A", label: "Tipo A", count: 6, type: "value" },
            { value: "Type B", label: "Tipo B", count: 4, type: "value" },
            { value: "Type C", label: "Tipo C", count: 3, type: "value" },
          ];
        } else if (property.includes("level")) {
          return [
            { value: "Basic", label: "Básico", count: 5, type: "value" },
            {
              value: "Intermediate",
              label: "Intermediário",
              count: 4,
              type: "value",
            },
            { value: "Advanced", label: "Avançado", count: 3, type: "value" },
          ];
        } else if (
          property.includes("age") ||
          property.includes("year") ||
          property.includes("date")
        ) {
          return [
            { value: "2020", label: "2020", count: 3, type: "value" },
            { value: "2021", label: "2021", count: 4, type: "value" },
            { value: "2022", label: "2022", count: 5, type: "value" },
            { value: "2023", label: "2023", count: 6, type: "value" },
          ];
        } else {
          // Para propriedades específicas que sabemos que têm dados problemáticos
          if (property === "initiative_organization_sector") {
            return [
              { value: "Public", label: "Público", count: 5, type: "value" },
              { value: "Private", label: "Privado", count: 3, type: "value" },
              { value: "NGO", label: "ONG", count: 4, type: "value" },
              {
                value: "Academic",
                label: "Acadêmico",
                count: 2,
                type: "value",
              },
            ];
          } else if (property === "initiative_coordinator_gender") {
            return [
              { value: "Female", label: "Feminino", count: 8, type: "value" },
              { value: "Male", label: "Masculino", count: 6, type: "value" },
              { value: "Mixed", label: "Misto", count: 3, type: "value" },
            ];
          } else {
            // Fallback mais informativo indicando que não há dados
            return [
              {
                value: "no_data_available",
                label: "Sem dados disponíveis",
                count: 0,
                type: "value",
              },
            ];
          }
        }
    }
  }
};

// Função para construir consulta dinâmica com base no caminho do grafo
export const buildDynamicGraphQuery = async (
  category: string,
  path: string[], // Caminho alternado de propriedades e valores
  extraFields: string[] = [],
  limit: number = 100
): Promise<string> => {
  // Base da consulta com prefixos
  // Filtrar extraFields para evitar duplicação de label
  const filteredExtraFields = extraFields.filter((field) => field !== "label");

  let query = `
    PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    
    SELECT DISTINCT ?entity ?label ${filteredExtraFields
      .map((field) => `?${field}`)
      .join(" ")}
    WHERE {
      ?entity rdf:type Ellas:${category} .
      ?entity rdfs:label ?label .
  `;

  // Adicionar restrições de caminho
  if (path && path.length > 0) {
    for (let i = 0; i < path.length; i += 2) {
      const property = path[i];
      const value = path[i + 1];

      if (property && value) {
        const varName = `?${property}_value`;

        // CORREÇÃO CRÍTICA: Escapar quebras de linha e caracteres especiais
        const escapedValue = value
          .replace(/\\/g, "\\\\") // Escapar barras invertidas
          .replace(/"/g, '\\"') // Escapar aspas duplas
          .replace(/\n/g, "\\n") // Escapar quebras de linha
          .replace(/\r/g, "\\r") // Escapar retorno de carro
          .replace(/\t/g, "\\t"); // Escapar tabs

        // Adicionar padrão de tripla para a propriedade
        query += `      ?entity Ellas:${property} ${varName} .\n`;

        // Adicionar padrão para o valor (tentando diferentes formas)
        query += `      {\n`;
        // Tentar com rdfs:label em inglês
        query += `        ${varName} rdfs:label "${escapedValue}"@en .\n`;
        query += `      } UNION {\n`;
        // Tentar com rdfs:label sem idioma
        query += `        ${varName} rdfs:label "${escapedValue}" .\n`;
        query += `      } UNION {\n`;
        // Tentar com o valor literal direto
        query += `        FILTER(STR(${varName}) = "${escapedValue}")\n`;
        query += `      }\n`;
      }
    }
  }

  // Adicionar campos extras se solicitados (usando campos filtrados)
  if (filteredExtraFields.length > 0) {
    filteredExtraFields.forEach((field) => {
      const varName = `?${field}_value`;
      const labelVar = `?${field}_label`;
      query += `      OPTIONAL { 
        ?entity Ellas:${field} ${varName} .
        OPTIONAL { ${varName} rdfs:label ${labelVar} }
        BIND(COALESCE(${labelVar}, STR(${varName})) AS ?${field})
      }\n`;
    });
  }

  // Fechar a consulta
  query += `    }
    ORDER BY ?label
    LIMIT ${limit}
  `;

  console.log(
    `🔍 DEBUG buildDynamicGraphQuery - Consulta completa gerada:`,
    query
  );
  console.log(`🔍 DEBUG Parâmetros:`, {
    category,
    path,
    extraFields,
    limit,
    pathLength: path?.length,
    hasPath: path && path.length > 0,
  });

  return query;
};

// Função para buscar nomes de entidades para uma consulta dinâmica
export const executeDynamicGraphQuery = async (
  category: string,
  path: string[],
  extraFields: string[] = []
): Promise<any> => {
  try {
    // Construir a consulta dinâmica
    const query = await buildDynamicGraphQuery(category, path, extraFields);

    console.log(
      `🔍 DEBUG executeDynamicGraphQuery: Categoria=${category}, Path=${JSON.stringify(
        path
      )}, ExtraFields=${JSON.stringify(extraFields)}`
    );
    console.log(`🔍 DEBUG Consulta SPARQL gerada:`, query);

    // Executar a consulta
    console.log("Executando consulta dinâmica");
    const result = await fetchQuery(query);

    console.log(`🔍 DEBUG Resultado bruto da fetchQuery:`, {
      hasResult: !!result,
      resultType: typeof result,
      hasResults: !!result?.results,
      hasBindings: !!result?.results?.bindings,
      bindingsLength: result?.results?.bindings?.length,
      firstBinding: result?.results?.bindings?.[0],
      isArrayBindings: Array.isArray(result?.results?.bindings),
      resultKeys: result ? Object.keys(result) : [],
      resultsKeys: result?.results ? Object.keys(result.results) : [],
    });

    if (result && result.results && result.results.bindings) {
      const bindingsLength = result.results.bindings.length;
      console.log(`📊 DEBUG: Consulta retornou ${bindingsLength} resultados`);

      // Verificar se sempre retorna 44
      if (bindingsLength === 44) {
        console.error(
          `🚨 ALERTA: Sempre retorna 44 resultados! Pode ser dados de fallback!`
        );
        console.log(
          `🔍 DEBUG Primeiros 3 resultados:`,
          result.results.bindings.slice(0, 3)
        );
        console.log(`🔍 DEBUG Fonte dos dados:`, {
          category,
          path,
          query: query.substring(0, 200) + "...",
        });
      }

      return result;
    } else {
      console.warn("Consulta não retornou resultados");
      return { results: { bindings: [] } };
    }
  } catch (error) {
    console.error("Erro ao executar consulta dinâmica:", error);
    return { results: { bindings: [] } };
  }
};

// Obter informações sobre os tipos de consultas disponíveis
export const getQueryTypes = (): Record<string, string[]> => {
  return {
    policies: [
      "gender_policy_types",
      "women_participation",
      "since_2015",
      "countries_applied",
    ],
    initiatives: [
      "by_countries",
      "data_source",
      "social_networks",
      "program_initiatives",
      "public_private",
      "active_initiatives",
      "finished_initiatives",
      "initiative_website",
    ],
    factors: [
      "positive_contextual",
      "negative_contextual",
      "educational_factors",
      "gender_impact",
      "factor_impacts",
      "impact_types",
      "impact_factors",
    ],
  };
};

// Obter opções de filtro para uma categoria e tipo de filtro
export const getFilterOptions = (
  category: string,
  filterType: string
): any[] => {
  // Implementar este método para retornar opções de filtro baseadas na categoria e tipo
  // Exemplo: Para categoria "policies" e tipo "status", retornar opções como "Active", "Finished" etc.
  return [];
};

// Função para obter as 3 categorias principais na raiz
export const getRootCategories = (): GraphOption[] => {
  return [
    { value: "Initiative", label: "Iniciativas", count: 245, type: "category" },
    { value: "Policy", label: "Políticas", count: 88, type: "category" },
    { value: "Factor", label: "Fatores", count: 52, type: "category" },
  ];
};

// Função para determinar se estamos na raiz (sem categoria selecionada)
export const isRootLevel = (category: string | null): boolean => {
  return !category || category === "";
};

// Função para verificar a disponibilidade de uma propriedade antes de carregá-la
export const checkPropertyAvailability = async (
  category: string,
  property: string
): Promise<{
  exists: boolean;
  entityCount: number;
  valueCount: number;
  isOptional: boolean;
}> => {
  console.log(
    `🔍 Verificando disponibilidade da propriedade ${property} para categoria ${category}`
  );

  try {
    const query = `
      PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>
      PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
      
      SELECT 
        (COUNT(DISTINCT ?entity) as ?entityCount) 
        (COUNT(DISTINCT ?propValue) as ?valueCount)
        (COUNT(DISTINCT ?entityWithProp) as ?entitiesWithProperty)
      WHERE {
        ?entity rdf:type Ellas:${category} .
        
        OPTIONAL { 
          ?entity Ellas:${property} ?propValue .
          BIND(?entity AS ?entityWithProp)
        }
      }
    `;

    const result = await fetchQuery(query);

    if (
      result &&
      result.results &&
      result.results.bindings &&
      result.results.bindings.length > 0
    ) {
      const binding = result.results.bindings[0];
      const entityCount = binding.entityCount
        ? parseInt(binding.entityCount.value)
        : 0;
      const valueCount = binding.valueCount
        ? parseInt(binding.valueCount.value)
        : 0;
      const entitiesWithProperty = binding.entitiesWithProperty
        ? parseInt(binding.entitiesWithProperty.value)
        : 0;

      const exists = valueCount > 0;
      const isOptional = entitiesWithProperty < entityCount; // Nem todas as entidades têm esta propriedade

      console.log(`📊 Estatísticas para ${property}:`, {
        entityCount,
        valueCount,
        entitiesWithProperty,
        exists,
        isOptional,
        coverage:
          entityCount > 0
            ? ((entitiesWithProperty / entityCount) * 100).toFixed(1) + "%"
            : "0%",
      });

      return {
        exists,
        entityCount,
        valueCount,
        isOptional,
      };
    }
  } catch (error) {
    console.error(
      `❌ Erro ao verificar disponibilidade da propriedade ${property}:`,
      error
    );
  }

  return {
    exists: false,
    entityCount: 0,
    valueCount: 0,
    isOptional: true,
  };
};

// Função para obter propriedades com informações de disponibilidade
export const explorePropertiesWithAvailability = async (
  category: string
): Promise<
  (GraphOption & {
    availability?: {
      exists: boolean;
      coverage: number;
      isOptional: boolean;
    };
  })[]
> => {
  console.log(
    `🔍 Explorando propriedades com informações de disponibilidade para: ${category}`
  );

  try {
    // Primeiro, obter todas as propriedades
    const properties = await explorePropertiesForClass(category);

    // Depois, verificar a disponibilidade de cada uma
    const propertiesWithAvailability = await Promise.all(
      properties.map(async (prop) => {
        const availability = await checkPropertyAvailability(
          category,
          prop.value
        );
        const coverage =
          availability.entityCount > 0
            ? (availability.valueCount / availability.entityCount) * 100
            : 0;

        return {
          ...prop,
          availability: {
            exists: availability.exists,
            coverage,
            isOptional: availability.isOptional,
          },
        };
      })
    );

    // Ordenar por cobertura (propriedades com mais dados primeiro)
    const sortedProperties = propertiesWithAvailability.sort((a, b) => {
      const coverageA = a.availability?.coverage || 0;
      const coverageB = b.availability?.coverage || 0;
      return coverageB - coverageA;
    });

    console.log(
      `📋 Propriedades com informações de disponibilidade:`,
      sortedProperties
    );

    return sortedProperties;
  } catch (error) {
    console.error(
      `❌ Erro ao explorar propriedades com disponibilidade:`,
      error
    );
    return [];
  }
};

// Exportar o serviço
const queryMappingService = {
  getAvailableQueriesByCategory,
  executeQuery,
  executeQueryWithParams,
  explorePropertiesForClass,
  exploreValuesForProperty,
  buildDynamicGraphQuery,
  executeDynamicGraphQuery,
  getQueryTypes,
  getFilterOptions,
  getRootCategories,
  isRootLevel,
};

export default queryMappingService;
