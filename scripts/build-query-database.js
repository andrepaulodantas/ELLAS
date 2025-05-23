#!/usr/bin/env node

/**
 * Script para extrair todas as consultas disponíveis da API ELLAS
 * e armazená-las em um banco de dados local para uso na busca avançada.
 * 
 * Este script faz o seguinte:
 * 1. Lista todas as consultas disponíveis na API
 * 2. Executa cada consulta e armazena os resultados
 * 3. Gera um arquivo JSON com todas as consultas e resultados
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const readline = require('readline');

// URLs da API ELLAS
const API_BASE_URL = 'https://api.ellas.ufmt.br';
const SPARQL_ENDPOINT = 'https://ellas.ufmt.br/sparql';

// Categorias de consulta disponíveis
const CATEGORIES = ['policies', 'initiatives', 'factors'];

// Mapeamento das consultas em inglês para as funções de fetch
const QUERIES = {
  // Consultas de políticas
  "In which countries the policy was applied?": 
    "PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#> PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> SELECT ?policyName ?countryName WHERE { ?policy a Ellas:Policy. ?policy rdfs:label ?policyName. ?policy Ellas:created_in ?country. ?country rdfs:label ?countryName. }",
  
  "What types of gender policies/processes/practices exist in Latin America?": 
    "PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#> PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> SELECT ?policyName ?countryName ?policyType ?startDate WHERE { ?policy a Ellas:Policy. ?policy rdfs:label ?policyName. ?policy Ellas:created_in ?country. ?country rdfs:label ?countryName. OPTIONAL { ?policy Ellas:policy_type ?policyType } OPTIONAL { ?policy Ellas:start_date ?startDate } }",
  
  "How policies identified/analyzed are promoting women's participation in STEM fields?": 
    "PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#> PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> SELECT ?policyName ?countryName ?objective WHERE { ?policy a Ellas:Policy. ?policy rdfs:label ?policyName. ?policy Ellas:created_in ?country. ?country rdfs:label ?countryName. OPTIONAL { ?policy Ellas:policy_objective ?objective } FILTER(CONTAINS(LCASE(STR(?objective)), 'stem') || CONTAINS(LCASE(STR(?objective)), 'science') || CONTAINS(LCASE(STR(?objective)), 'women') || CONTAINS(LCASE(STR(?policyName)), 'women') || CONTAINS(LCASE(STR(?policyName)), 'gender')) }",
  
  // Consultas de iniciativas
  "Which/How many initiatives are carried out in countries?": 
    "PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#> PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> SELECT ?initiativeName ?countryName ?startDate ?status WHERE { ?initiative a Ellas:Initiative. ?initiative rdfs:label ?initiativeName. ?initiative Ellas:created_in ?country. ?country rdfs:label ?countryName. OPTIONAL { ?initiative Ellas:startDate ?startDate } OPTIONAL { ?initiative Ellas:initiative_status ?status } }",
  
  "What initiatives are active?": 
    "PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#> PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> SELECT ?initiativeName ?countryName ?startDate ?status WHERE { ?initiative a Ellas:Initiative. ?initiative rdfs:label ?initiativeName. ?initiative Ellas:created_in ?country. ?country rdfs:label ?countryName. OPTIONAL { ?initiative Ellas:startDate ?startDate } ?initiative Ellas:initiative_status ?status. FILTER(CONTAINS(LCASE(STR(?status)), 'active')) }",
  
  "Have the initiatives already been implemented or are they still in the design phase?": 
    "PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#> PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> SELECT ?initiativeName ?countryName ?startDate ?status WHERE { ?initiative a Ellas:Initiative. ?initiative rdfs:label ?initiativeName. ?initiative Ellas:created_in ?country. ?country rdfs:label ?countryName. OPTIONAL { ?initiative Ellas:startDate ?startDate } ?initiative Ellas:initiative_status ?status. FILTER(CONTAINS(LCASE(STR(?status)), 'design') || CONTAINS(LCASE(STR(?status)), 'planning')) }",
  
  "Which initiatives are already finished?": 
    "PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#> PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> SELECT ?initiativeName ?countryName ?startDate ?status WHERE { ?initiative a Ellas:Initiative. ?initiative rdfs:label ?initiativeName. ?initiative Ellas:created_in ?country. ?country rdfs:label ?countryName. OPTIONAL { ?initiative Ellas:startDate ?startDate } ?initiative Ellas:initiative_status ?status. FILTER(CONTAINS(LCASE(STR(?status)), 'finished')) }",
  
  // Consultas de public alvo (audience)
  "What initiatives serve girls or adolescents?": 
    "PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#> PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> SELECT ?initiativeName ?countryName ?audienceAge ?audienceGender WHERE { ?initiative a Ellas:Initiative. ?initiative rdfs:label ?initiativeName. ?initiative Ellas:created_in ?country. ?country rdfs:label ?countryName. OPTIONAL { ?initiative Ellas:audience_age ?audienceAge } OPTIONAL { ?initiative Ellas:audience_gender ?audienceGender } FILTER(CONTAINS(LCASE(STR(?audienceAge)), 'children') || CONTAINS(LCASE(STR(?audienceAge)), 'teenagers') || CONTAINS(LCASE(STR(?audienceAge)), 'adolescent')) }",
  
  "What initiatives serve black women?": 
    "PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#> PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> SELECT ?initiativeName ?countryName ?audienceRace ?audienceGender WHERE { ?initiative a Ellas:Initiative. ?initiative rdfs:label ?initiativeName. ?initiative Ellas:created_in ?country. ?country rdfs:label ?countryName. OPTIONAL { ?initiative Ellas:audience_race ?audienceRace } OPTIONAL { ?initiative Ellas:audience_gender ?audienceGender } FILTER(CONTAINS(LCASE(STR(?audienceRace)), 'black') && CONTAINS(LCASE(STR(?audienceGender)), 'female')) }",
  
  // Consultas de fatores
  "What are the positive CONTEXTUAL FACTORS in COUNTRIES ANALYZED?": 
    "PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#> PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> SELECT ?factorName ?countryName ?impactType WHERE { ?factor a Ellas:Contextual_Factor. ?factor rdfs:label ?factorName. ?factor Ellas:located_in ?country. ?country rdfs:label ?countryName. ?factor Ellas:impact_type ?impactType. FILTER(CONTAINS(LCASE(STR(?impactType)), 'positive')) }",
  
  "What are the negative CONTEXTUAL FACTORS in activities in Institution X in COUNTRIES ANALYZED?": 
    "PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#> PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> SELECT ?factorName ?countryName ?impactType ?institutionName WHERE { ?factor a Ellas:Contextual_Factor. ?factor rdfs:label ?factorName. ?factor Ellas:located_in ?country. ?country rdfs:label ?countryName. ?factor Ellas:impact_type ?impactType. OPTIONAL { ?factor Ellas:institution ?institution. ?institution rdfs:label ?institutionName } FILTER(CONTAINS(LCASE(STR(?impactType)), 'negative')) }"
};

// Caminho para o diretório de saída
const OUTPUT_DIR = path.resolve(__dirname, '../frontend/src/data');
const QUERY_DB_FILE = path.join(OUTPUT_DIR, 'query-database.json');

// Garante que o diretório de saída existe
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

/**
 * Função para executar uma consulta SPARQL e retornar os resultados
 */
function executeSparqlQuery(query) {
  try {
    console.log(`Executando consulta: ${query.substring(0, 80)}...`);
    
    // Escape da string de consulta para uso no curl
    const escapedQuery = query.replace(/"/g, '\\"');
    
    // Executa a consulta usando curl
    const result = execSync(`curl -s -X POST ${SPARQL_ENDPOINT} \
                            -H "Content-Type: application/x-www-form-urlencoded" \
                            -H "Accept: application/sparql-results+json" \
                            --data-urlencode "query=${escapedQuery}"`, 
                           { encoding: 'utf8' });
    
    // Parse do resultado JSON
    const jsonResult = JSON.parse(result);
    
    return {
      success: true,
      data: jsonResult
    };
  } catch (error) {
    console.error(`Erro ao executar consulta: ${error.message}`);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Função principal para construir o banco de dados de consultas
 */
async function buildQueryDatabase() {
  console.log('Iniciando a construção do banco de dados de consultas...');
  
  const queryDatabase = {
    metadata: {
      created: new Date().toISOString(),
      version: '1.0.0'
    },
    categories: {},
    queries: {}
  };
  
  // Inicializa as categorias
  CATEGORIES.forEach(category => {
    queryDatabase.categories[category] = {
      count: 0,
      queries: []
    };
  });
  
  // Para cada consulta disponível
  for (const [queryText, sparqlQuery] of Object.entries(QUERIES)) {
    console.log(`\nProcessando consulta: "${queryText}"`);
    
    // Determina a categoria com base na consulta
    let category = 'other';
    if (queryText.includes('policy') || queryText.includes('policies')) {
      category = 'policies';
    } else if (queryText.includes('initiative') || queryText.includes('initiatives')) {
      category = 'initiatives';
    } else if (queryText.includes('factor') || queryText.includes('factors')) {
      category = 'factors';
    }
    
    // Executa a consulta
    const result = executeSparqlQuery(sparqlQuery);
    
    // Armazena os resultados
    queryDatabase.queries[queryText] = {
      category,
      sparqlQuery,
      result
    };
    
    // Atualiza a contagem de consultas da categoria
    queryDatabase.categories[category].count++;
    queryDatabase.categories[category].queries.push(queryText);
    
    // Aguarda um breve momento para não sobrecarregar o servidor
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  // Salva o banco de dados em um arquivo JSON
  fs.writeFileSync(QUERY_DB_FILE, JSON.stringify(queryDatabase, null, 2));
  
  console.log(`\nBanco de dados de consultas criado com sucesso em ${QUERY_DB_FILE}`);
  console.log('\nEstatísticas:');
  
  // Exibe estatísticas das consultas
  CATEGORIES.forEach(category => {
    console.log(`- ${category}: ${queryDatabase.categories[category].count} consultas`);
  });
}

// Executa a função principal
buildQueryDatabase().catch(error => {
  console.error('Erro ao construir banco de dados de consultas:', error);
  process.exit(1);
}); 