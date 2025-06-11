// Teste para verificar se ainda há dados genéricos sendo retornados
const testGenericData = async () => {
  console.log("🔍 Testando se ainda há dados genéricos...\n");

  try {
    const response = await fetch("http://localhost:3001/api/sparql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
          PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
          PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
          PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>
          
          SELECT DISTINCT ?property ?value
          WHERE { 
            ?s rdf:type Ellas:Policy .
            ?s ?property ?value .
            FILTER(CONTAINS(STR(?value), "Valor"))
          }
          LIMIT 10
        `,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      const results = data.results?.bindings || [];

      console.log('🔍 Resultados com "Valor" genérico encontrados:');
      if (results.length === 0) {
        console.log(
          "✅ Nenhum dado genérico encontrado! Todos os dados parecem ser reais."
        );
      } else {
        console.log(
          `⚠️  Encontrados ${results.length} resultados com dados possivelmente genéricos:`
        );
        results.forEach((result, index) => {
          console.log(
            `   ${index + 1}. ${result.property?.value} = ${
              result.value?.value
            }`
          );
        });
      }
    } else {
      console.log("❌ Erro ao conectar com o backend SPARQL");
    }
  } catch (error) {
    console.log("❌ Erro na consulta:", error.message);
  }

  console.log("\n🎯 Próximos passos:");
  console.log("1. Acesse http://localhost:3000 no navegador");
  console.log(
    "2. Verifique se aparecem apenas 3 categorias: Iniciativas, Políticas, Fatores"
  );
  console.log("3. Teste a navegação hierárquica clicando nas categorias");
  console.log("4. Verifique se os dados mostrados são reais (não genéricos)");
};

// Executar o teste
testGenericData();
