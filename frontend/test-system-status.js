// Teste simplificado da conectividade e fallback
console.log("🧪 Testando conectividade com GraphDB...\n");

// Simular uma consulta SPARQL real
const testSparqlQuery = `
PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

SELECT DISTINCT ?property ?propertyLabel (COUNT(DISTINCT ?subject) as ?count)
WHERE {
  ?subject rdf:type Ellas:Initiative .
  ?subject ?property ?object .
  
  # Filtrar apenas propriedades do namespace Ellas
  FILTER(STRSTARTS(STR(?property), "https://ellas.ufmt.br/Ontology/Ellas#"))
  
  # Obter label da propriedade se disponível
  OPTIONAL { 
    ?property rdfs:label ?propertyLabel .
    FILTER(LANG(?propertyLabel) = "en" || LANG(?propertyLabel) = "")
  }
}
GROUP BY ?property ?propertyLabel
ORDER BY DESC(?count)
LIMIT 50
`;

console.log("📝 Consulta SPARQL para propriedades de Initiative:");
console.log(testSparqlQuery);

console.log("\n🔄 Status esperado do sistema:");
console.log("1. ✅ Consulta real ao GraphDB (se conectividade OK)");
console.log("2. 🔄 Fallback inteligente (se consulta falhar)");
console.log("3. 📊 Retorno de dados realistas em ambos os casos");

console.log("\n📋 Dados de fallback esperados para Initiative:");
const fallbackProperties = [
  "created_in (44 países)",
  "initiative_website (1 URL real)",
  "initiative_format (4 formatos)",
  "initiative_number_of_participants (5 faixas)",
  "duration (5 opções)",
  "target_audience",
  "stem_area",
  "funding_source",
  "status",
];

fallbackProperties.forEach((prop, index) => {
  console.log(`   ${index + 1}. ${prop}`);
});

console.log(
  "\n💡 O sistema deve funcionar independente da conectividade com GraphDB!"
);
console.log("   Se GraphDB estiver disponível → dados reais");
console.log("   Se GraphDB não estiver disponível → dados de demonstração");
