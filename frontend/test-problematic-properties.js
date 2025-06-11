// Teste específico para as propriedades problemáticas
const testProblematicProperties = async () => {
  console.log("🔍 Testando propriedades problemáticas...\n");

  const properties = [
    "initiative_organization_sector",
    "initiative_coordinator_gender",
  ];

  for (const property of properties) {
    console.log(`\n📋 Testando propriedade: ${property}`);

    try {
      // Teste 1: Verificar se a propriedade existe no GraphDB
      const checkQuery = `
        PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>
        SELECT (COUNT(*) as ?count)
        WHERE {
          ?s Ellas:${property} ?o .
        }
      `;

      console.log("🔍 Verificando se a propriedade existe...");
      const response1 = await fetch("/proxy", {
        method: "POST",
        headers: { "Content-Type": "application/sparql-query" },
        body: checkQuery,
      });

      if (response1.ok) {
        const data1 = await response1.json();
        const count = data1.results?.bindings[0]?.count?.value || 0;
        console.log(`✅ Propriedade encontrada: ${count} ocorrências`);

        if (count > 0) {
          // Teste 2: Obter valores reais
          const valuesQuery = `
            PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>
            PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
            SELECT DISTINCT ?value (COUNT(*) as ?count)
            WHERE {
              ?s Ellas:${property} ?propValue .
              OPTIONAL { ?propValue rdfs:label ?label }
              BIND(COALESCE(?label, STR(?propValue)) AS ?value)
            }
            GROUP BY ?value
            ORDER BY DESC(?count)
            LIMIT 10
          `;

          console.log("🔍 Obtendo valores reais...");
          const response2 = await fetch("/proxy", {
            method: "POST",
            headers: { "Content-Type": "application/sparql-query" },
            body: valuesQuery,
          });

          if (response2.ok) {
            const data2 = await response2.json();
            const values = data2.results?.bindings || [];

            console.log(`✅ Valores encontrados: ${values.length}`);
            values.forEach((v, i) => {
              console.log(
                `   ${i + 1}. ${v.value?.value} (${v.count?.value} ocorrências)`
              );
            });
          } else {
            console.log(`❌ Erro ao obter valores: ${response2.status}`);
          }
        } else {
          console.log("⚠️ Propriedade não tem valores no GraphDB");
        }
      } else {
        console.log(`❌ Erro ao verificar propriedade: ${response1.status}`);
      }
    } catch (error) {
      console.error(`❌ Erro ao testar ${property}:`, error);
    }
  }

  console.log("\n🔧 Possíveis soluções:");
  console.log("1. Verificar se os nomes das propriedades estão corretos");
  console.log("2. Verificar se os dados existem no GraphDB");
  console.log("3. Verificar se o mapeamento de propriedades está correto");
  console.log(
    "4. Atualizar a função exploreValuesForProperty para lidar melhor com essas propriedades"
  );
};

// Executar teste
testProblematicProperties();
