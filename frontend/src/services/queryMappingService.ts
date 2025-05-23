import * as apiService from './apiService';
import { fetchQuery } from './apiService';
import { loadQueryDatabase, getQueriesByCategory, getSparqlQuery } from '../data';
import axios from 'axios';

// Flag para forçar o uso de dados de demonstração no ambiente de desenvolvimento
// Isso é útil quando o endpoint SPARQL não está disponível ou com problemas de CORS/autenticação
const FORCE_DEMO_DATA = false;

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
const queryMappings: Record<string, () => Promise<any>> = {
  // Consultas de políticas
  "In which countries the policy was applied?": apiService.fetchPoliciesAppliedInCountries,
  "What types of gender policies/processes/practices exist in Latin America?": apiService.fetchPolicyTypesInLatinAmerica,
  "How policies identified/analyzed are promoting women's participation in STEM fields?": apiService.fetchPoliciesPromotingWomenInSTEM,
  "What types of gender policies/processes/practices have been implemented in Bolivia, Brazil and Peru since 2015?": apiService.fetchPoliciesImplementedInCountriesSince2015,
  
  // Consultas de iniciativas
  "Which/How many initiatives are carried out in countries?": apiService.fetchInitiativesByCountry,
  "What initiatives are active?": apiService.fetchActiveInitiatives,
  "Have the initiatives already been implemented or are they still in the design phase?": apiService.fetchInitiativesByPhase,
  "Which initiatives are already finished?": apiService.fetchFinishedInitiatives,
  "What initiatives serve girls or adolescents?": apiService.fetchInitiativesForGirlsOrAdolescents,
  "What initiatives serve black women?": apiService.fetchInitiativesForBlackWomen,
  "Are the initiatives funded?": apiService.fetchFundedInitiatives,
  "What is the initiative's website (URL)?": apiService.fetchInitiativeWebsites,
  
  // Consultas de fatores
  "What are the positive CONTEXTUAL FACTORS in COUNTRIES ANALYZED?": apiService.fetchPositiveContextualFactors,
  "What are the negative CONTEXTUAL FACTORS in activities in Institution X in COUNTRIES ANALYZED?": apiService.fetchNegativeContextualFactorsInInstitution
};

// Obter todas as consultas disponíveis por categoria
export const getAvailableQueriesByCategory = async (category: string): Promise<MappedQuery[]> => {
  try {
    const queries = await getQueriesByCategory(category);
    return queries.map(query => ({
      name: query,
      description: query,
      category,
      apiFunction: queryMappings[query] || (() => Promise.reject('API function not found'))
    })).filter(q => queryMappings[q.name]); // Filtra apenas consultas que têm uma função API mapeada
  } catch (error) {
    console.error(`Erro ao obter consultas para categoria ${category}:`, error);
    return [];
  }
};

// Executar uma consulta específica pelo nome
export const executeQuery = async (queryName: string): Promise<any> => {
  if (queryName.startsWith('PREFIX') || queryName.toLowerCase().includes('select ')) {
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
  if (!category || category.trim() === '') {
    console.log('Categoria não fornecida, retornando resultado vazio');
    return { results: { bindings: [] } };
  }
  
  // Constrói uma consulta SPARQL com base nos parâmetros fornecidos
  let query = '';
  
  switch (category.toLowerCase()) {
    case 'policies':
    case 'policy': 
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
            FILTER(${countries.map(c => `?countryName="${c}"@en`).join(' || ')})
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
    
    case 'initiatives':
    case 'initiative':
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
            FILTER(${countries.map(c => `?countryName="${c}"@en`).join(' || ')})
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
    
    case 'factors':
    case 'factor':
    case 'contextualfactor':
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
            FILTER(${countries.map(c => `?countryName="${c}"@en`).join(' || ')})
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

// Explorar propriedades disponíveis para uma categoria
export const explorePropertiesForClass = async (category: string): Promise<GraphOption[]> => {
  try {
    // Se estamos forçando dados de demonstração, pular a consulta real
    if (FORCE_DEMO_DATA) {
      console.log(`Usando dados de demonstração para propriedades de ${category}`);
      return getCategoryDemoProperties(category);
    }
    
    // Consulta mais abrangente para obter propriedades e contagem
    const query = `
      PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>
      PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
      PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
      
      SELECT ?property ?propName (COUNT(DISTINCT ?s) as ?count)
      WHERE {
        ?s rdf:type Ellas:${category} .
        ?s ?property ?o .
        
        # Obter nome da propriedade extraindo a parte após #
        BIND(REPLACE(STR(?property), ".*#", "") AS ?propName) .
        
        # Filtrar apenas propriedades do namespace Ellas
        FILTER(isIRI(?property) && STRSTARTS(STR(?property), "https://ellas.ufmt.br/Ontology/Ellas#"))
        FILTER(?property != rdf:type)
      }
      GROUP BY ?property ?propName
      ORDER BY DESC(?count)
      LIMIT 100
    `;
    
    console.log("Executando consulta de propriedades aprimorada:", query);
    
    const result = await fetchQuery(query);
    
    if (result && result.results && result.results.bindings && result.results.bindings.length > 0) {
      console.log(`Encontradas ${result.results.bindings.length} propriedades para ${category}`);
      
      // Criar propriedades a partir dos resultados
      const properties = result.results.bindings.map((binding: any) => {
        const propName = binding.propName ? binding.propName.value : "";
        const count = binding.count ? parseInt(binding.count.value) : 0;
        
        return {
          value: propName,
          label: formatPropertyLabel(propName),
          count: count,
          type: 'property'
        };
      });
      
      return properties.length > 0 ? properties : getCategoryDemoProperties(category);
    } else {
      console.warn(`Nenhuma propriedade encontrada para a categoria ${category}, usando dados demonstrativos`);
      return getCategoryDemoProperties(category);
    }
  } catch (error) {
    console.error('Erro ao explorar propriedades:', error);
    return getCategoryDemoProperties(category);
  }
};

// Função auxiliar para obter propriedades de demonstração para uma categoria
const getCategoryDemoProperties = (category: string): GraphOption[] => {
  if (category === 'Policy') {
    return [
      { value: 'created_in', label: 'Country', count: 15, type: 'property' },
      { value: 'policy_type', label: 'Policy Type', count: 12, type: 'property' },
      { value: 'start_date', label: 'Start Date', count: 10, type: 'property' }
    ];
  } else if (category === 'Initiative') {
    return [
      { value: 'created_in', label: 'Country', count: 25, type: 'property' },
      { value: 'initiative_status', label: 'Status', count: 20, type: 'property' },
      { value: 'initiative_audience', label: 'Target Audience', count: 18, type: 'property' }
    ];
  } else if (category === 'ContextualFactor') {
    return [
      { value: 'located_in', label: 'Country', count: 10, type: 'property' },
      { value: 'impact_type', label: 'Impact Type', count: 8, type: 'property' },
      { value: 'factor_type', label: 'Factor Type', count: 5, type: 'property' }
    ];
  }
  
  return [];
};

// Função auxiliar para formatar labels de propriedades
const formatPropertyLabel = (propName: string): string => {
  // Converter camelCase ou snake_case para palavras separadas e capitalizar
  return propName
    .replace(/_/g, ' ')
    .replace(/([A-Z])/g, ' $1')
    .replace(/^\w/, c => c.toUpperCase())
    .trim();
};

// Explorar valores possíveis para uma propriedade
export const exploreValuesForProperty = async (
  category: string,
  property: string,
  filters: Record<string, any> = {}
): Promise<GraphOption[]> => {
  try {
    // Se estamos forçando dados de demonstração, pular a consulta real
    if (FORCE_DEMO_DATA) {
      console.log(`Usando dados de demonstração para valores de ${property}`);
      return getPropertyDemoValues(property);
    }
    
    // Construir cláusulas de filtro a partir dos filtros existentes
    let filterClauses = '';
    if (Object.keys(filters).length > 0) {
      Object.entries(filters).forEach(([filterProp, filterValue]) => {
        // Ignorar propriedades vazias
        if (!filterProp || !filterValue) return;
        
        // Adicionar um filtro para a propriedade
        filterClauses += `?s Ellas:${filterProp} ?${filterProp}Filter .\n`;
        
        // Se o valor for um objeto complexo, adicionar propriedades específicas
        if (typeof filterValue === 'object' && filterValue !== null) {
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
    
    // Consulta aprimorada para obter valores de propriedades com contagem
    const query = `
      PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>
      PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
      PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
      
      SELECT DISTINCT ?value (COUNT(DISTINCT ?s) as ?count)
      WHERE {
        ?s rdf:type Ellas:${category} .
        
        # Obter valores da propriedade
        ?s Ellas:${property} ?propValue .
        
        # Obter rótulo ou valor literal
        OPTIONAL { 
          ?propValue rdfs:label ?label .
          FILTER(LANG(?label) = "en" || LANG(?label) = "")
        }
        BIND(COALESCE(?label, STR(?propValue)) AS ?value)
        
        # Aplicar filtros existentes
        ${filterClauses}
      }
      GROUP BY ?value
      ORDER BY DESC(?count)
      LIMIT 100
    `;
    
    console.log(`Executando consulta para valores de ${property}:`, query);
    
    const result = await fetchQuery(query);
    
    if (result && result.results && result.results.bindings && result.results.bindings.length > 0) {
      console.log(`Encontrados ${result.results.bindings.length} valores para ${property}`);
      
      // Converter resultados para a estrutura GraphOption
      const values = result.results.bindings.map((binding: any) => {
        const value = binding.value ? binding.value.value : "";
        const count = binding.count ? parseInt(binding.count.value) : 0;
        
        return {
          value: value,
          label: value,
          count: count,
          type: 'value'
        };
      });
      
      return values.length > 0 ? values : getPropertyDemoValues(property);
    } else {
      console.warn(`Nenhum valor encontrado para ${property}, usando dados demonstrativos`);
      return getPropertyDemoValues(property);
    }
  } catch (error) {
    console.error(`Erro ao explorar valores para ${property}:`, error);
    return getPropertyDemoValues(property);
  }
};

// Função auxiliar para obter valores de demonstração para uma propriedade
const getPropertyDemoValues = (property: string): GraphOption[] => {
  if (property === 'created_in' || property === 'located_in') {
    return [
      { value: 'Brazil', label: 'Brazil', count: 15, type: 'value' },
      { value: 'Peru', label: 'Peru', count: 10, type: 'value' },
      { value: 'Argentina', label: 'Argentina', count: 8, type: 'value' },
      { value: 'Bolivia', label: 'Bolivia', count: 5, type: 'value' },
      { value: 'Chile', label: 'Chile', count: 3, type: 'value' }
    ];
  } else if (property === 'policy_type') {
    return [
      { value: 'Legislative', label: 'Legislative', count: 8, type: 'value' },
      { value: 'Educational', label: 'Educational', count: 7, type: 'value' },
      { value: 'Affirmative Action', label: 'Affirmative Action', count: 5, type: 'value' }
    ];
  } else if (property === 'initiative_status') {
    return [
      { value: 'Active', label: 'Active', count: 12, type: 'value' },
      { value: 'Completed', label: 'Completed', count: 8, type: 'value' },
      { value: 'Planned', label: 'Planned', count: 4, type: 'value' }
    ];
  } else if (property === 'impact_type') {
    return [
      { value: 'Positive', label: 'Positive', count: 6, type: 'value' },
      { value: 'Negative', label: 'Negative', count: 5, type: 'value' },
      { value: 'Mixed', label: 'Mixed', count: 2, type: 'value' }
    ];
  } else {
    return [
      { value: 'Value 1', label: 'Value 1', count: 5, type: 'value' },
      { value: 'Value 2', label: 'Value 2', count: 3, type: 'value' },
      { value: 'Value 3', label: 'Value 3', count: 2, type: 'value' }
    ];
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
  let query = `
    PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    
    SELECT DISTINCT ?entity ?label ${extraFields.map(field => `?${field}`).join(' ')}
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
        
        // Adicionar padrão de tripla para a propriedade
        query += `      ?entity Ellas:${property} ${varName} .\n`;
        
        // Adicionar padrão para o valor (tentando diferentes formas)
        query += `      {\n`;
        // Tentar com rdfs:label em inglês
        query += `        ${varName} rdfs:label "${value}"@en .\n`;
        query += `      } UNION {\n`;
        // Tentar com rdfs:label sem idioma
        query += `        ${varName} rdfs:label "${value}" .\n`;
        query += `      } UNION {\n`;
        // Tentar com o valor literal direto
        query += `        FILTER(STR(${varName}) = "${value}")\n`;
        query += `      }\n`;
      }
    }
  }
  
  // Adicionar campos extras se solicitados
  if (extraFields.length > 0) {
    extraFields.forEach(field => {
      const varName = `?${field}_value`;
      query += `      OPTIONAL { 
        ?entity Ellas:${field} ${varName} .
        OPTIONAL { ${varName} rdfs:label ?${field} }
        BIND(COALESCE(?${field}, STR(${varName})) AS ?${field})
      }\n`;
    });
  }
  
  // Fechar a consulta
  query += `    }
    ORDER BY ?label
    LIMIT ${limit}
  `;
  
  console.log("Consulta dinâmica gerada:", query);
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
    
    // Executar a consulta
    console.log("Executando consulta dinâmica");
    const result = await fetchQuery(query);
    
    if (result && result.results && result.results.bindings) {
      console.log(`Consulta retornou ${result.results.bindings.length} resultados`);
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
      'gender_policy_types',
      'women_participation',
      'since_2015',
      'countries_applied'
    ],
    initiatives: [
      'by_countries',
      'data_source',
      'social_networks',
      'program_initiatives',
      'public_private',
      'active_initiatives',
      'finished_initiatives',
      'initiative_website'
    ],
    factors: [
      'positive_contextual',
      'negative_contextual',
      'educational_factors',
      'gender_impact',
      'factor_impacts',
      'impact_types',
      'impact_factors'
    ]
  };
};

// Obter opções de filtro para uma categoria e tipo de filtro
export const getFilterOptions = (category: string, filterType: string): any[] => {
  // Implementar este método para retornar opções de filtro baseadas na categoria e tipo
  // Exemplo: Para categoria "policies" e tipo "status", retornar opções como "Active", "Finished" etc.
  return [];
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
  getFilterOptions
};

export default queryMappingService; 