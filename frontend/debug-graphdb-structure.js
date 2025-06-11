// Verificar estrutura real dos dados no GraphDB
console.log("🔍 Verificando estrutura real dos dados...\n");

// Consultas para verificar se as propriedades existem
const queries = {
  "Verificar todas as propriedades de Initiative": `
    PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    SELECT DISTINCT ?property
    WHERE {
      ?s rdf:type Ellas:Initiative .
      ?s ?property ?value .
    }
    LIMIT 50
  `,

  'Verificar propriedades que contêm "sector"': `
    PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>
    SELECT DISTINCT ?property
    WHERE {
      ?s ?property ?value .
      FILTER(CONTAINS(STR(?property), "sector"))
    }
  `,

  'Verificar propriedades que contêm "gender"': `
    PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>
    SELECT DISTINCT ?property
    WHERE {
      ?s ?property ?value .
      FILTER(CONTAINS(STR(?property), "gender"))
    }
  `,

  "Verificar dados específicos": `
    PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    SELECT DISTINCT ?initiative ?prop ?value
    WHERE {
      ?initiative rdf:type Ellas:Initiative .
      ?initiative ?prop ?value .
      FILTER(CONTAINS(STR(?prop), "sector") || CONTAINS(STR(?prop), "gender"))
    }
    LIMIT 20
  `,
};

Object.entries(queries).forEach(([name, query]) => {
  console.log(`\n📋 ${name}:`);
  console.log("Execute no console do navegador:");
  console.log(`
fetch('/proxy', {
  method: 'POST',
  headers: { 'Content-Type': 'application/sparql-query' },
  body: \`${query}\`
}).then(r => r.json()).then(data => {
  console.log('${name}:', data.results?.bindings || []);
});
  `);
});

console.log("\n🎯 O que fazer com os resultados:");
console.log(
  "1. Execute cada consulta para ver que propriedades existem realmente"
);
console.log("2. Compare com os nomes que estamos usando");
console.log(
  "3. Se os nomes estão diferentes, precisamos corrigir o mapeamento"
);
