// Teste direto das propriedades problemáticas
const testDirectProperties = async () => {
  console.log("🔍 Testando propriedades diretamente no GraphDB...\n");

  const properties = [
    "initiative_organization_sector",
    "initiative_coordinator_gender",
    "initiative_status",
    "initiative_reach",
  ];

  for (const property of properties) {
    console.log(`\n📋 Testando: ${property}`);

    // Consulta mais direta possível
    const query = `
      PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>
      SELECT DISTINCT ?value
      WHERE {
        ?s Ellas:${property} ?value .
      }
      LIMIT 10
    `;

    try {
      console.log("🔍 Executando consulta direta...");

      // Simular a consulta via console do navegador
      console.log("Query para executar no console do navegador:");
      console.log(`
fetch('/proxy', {
  method: 'POST',
  headers: { 'Content-Type': 'application/sparql-query' },
  body: \`${query}\`
}).then(r => r.json()).then(data => {
  console.log('${property}:', data.results?.bindings?.map(b => b.value?.value) || []);
});
      `);
    } catch (error) {
      console.error(`❌ Erro:`, error);
    }
  }

  console.log("\n🔧 Para resolver:");
  console.log("1. Execute as consultas acima no console do navegador");
  console.log("2. Verifique se as propriedades retornam dados reais");
  console.log(
    "3. Se não retornarem, pode ser problema de nomenclatura das propriedades"
  );
};

testDirectProperties();
