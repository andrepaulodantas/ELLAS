// Teste simples usando fetch diretamente
const fetch = require('node-fetch');

console.log('🧪 Testando endpoint SPARQL diretamente...');

async function testSparqlEndpoint() {
  try {
    // Teste 1: Consulta que antes causava erro 400 (duplicação de ?label)
    console.log('📋 Teste 1: Consulta que antes falhava com ?label duplicado');
    
    const query = `
      PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>
      PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
      PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
      
      SELECT DISTINCT ?entity ?label ?created_in
      WHERE {
        ?entity rdf:type Ellas:Initiative .
        ?entity rdfs:label ?label .
        OPTIONAL { 
          ?entity Ellas:created_in ?created_in_value .
          OPTIONAL { ?created_in_value rdfs:label ?created_in }
          BIND(COALESCE(?created_in, STR(?created_in_value)) AS ?created_in)
        }
      }
      ORDER BY ?label
      LIMIT 5
    `;
    
    console.log('🔍 Enviando consulta SPARQL...');
    
    const response = await fetch('https://ellas.ufmt.br/repositories/Ellas', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/sparql-query',
        'Accept': 'application/sparql-results+json'
      },
      body: query
    });
    
    console.log('📡 Status da resposta:', response.status);
    
    if (response.status === 200) {
      const data = await response.json();
      console.log('✅ SUCESSO: Consulta funcionou!');
      console.log('📊 Resultados:', {
        hasBindings: !!(data?.results?.bindings),
        count: data?.results?.bindings?.length || 0
      });
      
      if (data?.results?.bindings?.length > 0) {
        console.log('🎯 Primeiro resultado:', data.results.bindings[0]);
      }
      
      // Verificar se ainda retorna sempre 44 (dados de fallback)
      if (data?.results?.bindings?.length === 44) {
        console.log('🚨 AVISO: Ainda retorna exatos 44 resultados - pode ser dados de fallback');
      }
      
    } else if (response.status === 400) {
      const errorText = await response.text();
      console.log('❌ ERRO 400 (Bad Request):', errorText);
      
      if (errorText.includes('?label')) {
        console.log('🚨 PROBLEMA: Ainda há duplicação de ?label na consulta!');
      }
    } else {
      console.log('❌ Erro HTTP:', response.status, await response.text());
    }
    
  } catch (error) {
    console.error('❌ Erro na requisição:', error.message);
  }
}

testSparqlEndpoint();
