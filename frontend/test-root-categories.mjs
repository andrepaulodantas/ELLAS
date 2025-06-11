// Teste direto das funções de categoria raiz
console.log("🔍 Testando funções de categoria raiz...\n");

// Importar e testar a função getRootCategories
import queryMappingService from "./src/services/queryMappingService.js";

console.log("📋 Testando getRootCategories:");
try {
  const rootCategories = queryMappingService.getRootCategories();
  console.log("✅ getRootCategories retornou:", rootCategories);
  console.log(`📊 Quantidade: ${rootCategories.length} categorias`);

  rootCategories.forEach((cat, index) => {
    console.log(
      `   ${index + 1}. ${cat.label} (${cat.value}) - ${cat.count} itens`
    );
  });

  if (rootCategories.length === 3) {
    console.log("✅ CORRETO: 3 categorias retornadas");
  } else {
    console.log(
      `❌ PROBLEMA: ${rootCategories.length} categorias retornadas (deveria ser 3)`
    );
  }
} catch (error) {
  console.error("❌ Erro ao testar getRootCategories:", error);
}

console.log("\n📋 Testando isRootLevel:");
try {
  const tests = [
    { input: null, expected: true },
    { input: "", expected: true },
    { input: "Initiative", expected: false },
    { input: "Policy", expected: false },
  ];

  tests.forEach((test) => {
    const result = queryMappingService.isRootLevel(test.input);
    const status = result === test.expected ? "✅" : "❌";
    console.log(
      `   ${status} isRootLevel(${test.input}) = ${result} (esperado: ${test.expected})`
    );
  });
} catch (error) {
  console.error("❌ Erro ao testar isRootLevel:", error);
}

console.log("\n🎯 Se as funções estão corretas, o problema pode estar em:");
console.log("   1. O componente não está chamando renderRootCategories()");
console.log("   2. selectedCategory não está vazio como esperado");
console.log("   3. Há alguma lógica sobrescrevendo nossa função");
console.log(
  "\n💡 Verifique o console do navegador para os logs do QueryBuilder!"
);
