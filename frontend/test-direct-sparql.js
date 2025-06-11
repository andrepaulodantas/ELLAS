// Teste direto das consultas SPARQL
const { fetchQuery } = require("./src/services/apiService");

console.log("🧪 Testando consultas SPARQL diretamente...");

async function testDirectSparql() {
  try {
    // Teste 1: Consulta simples sem ?label duplicado
    console.log("📋 Teste 1: Consulta simples");
    const query1 = `
      PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>
      PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
      PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
      
      SELECT DISTINCT ?entity ?label
      WHERE {
        ?entity rdf:type Ellas:Initiative .
        ?entity rdfs:label ?label .
      }
      ORDER BY ?label
      LIMIT 10
    `;

    const result1 = await fetchQuery(query1);
    console.log("📊 Resultado 1:", {
      hasResult: !!result1,
      hasBindings: !!result1?.results?.bindings,
      count: result1?.results?.bindings?.length || 0,
      status: result1?.status || "sem status",
    });

    // Teste 2: Consulta com campos extras (simulando a correção)
    console.log(
      "📋 Teste 2: Consulta com campos extras (sem duplicação de label)"
    );
    const query2 = `
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
      LIMIT 10
    `;

    const result2 = await fetchQuery(query2);
    console.log("📊 Resultado 2:", {
      hasResult: !!result2,
      hasBindings: !!result2?.results?.bindings,
      count: result2?.results?.bindings?.length || 0,
      status: result2?.status || "sem status",
    });

    if (result2?.results?.bindings?.length > 0) {
      console.log("🎯 Primeiro resultado:", result2.results.bindings[0]);
    }
  } catch (error) {
    console.error("❌ Erro no teste:", error);
  }
}

testDirectSparql();
