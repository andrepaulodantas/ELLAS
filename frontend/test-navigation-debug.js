// Teste das funcionalidades de navegação
console.log("🧪 TESTE: Verificando se as correções estão funcionando");

console.log("\n1. 📋 Para testar no console do navegador:");
console.log(`
// Testar se getRootCategories retorna 3 categorias
import('./src/services/queryMappingService.js').then(service => {
  const rootCategories = service.getRootCategories();
  console.log('🔍 Root Categories:', rootCategories);
  console.log('📊 Quantidade:', rootCategories.length, '(deveria ser 3)');
});
`);

console.log("\n2. 🔧 Para forçar reset no navegador:");
console.log(`
// No console do navegador, execute:
const forceReset = () => {
  const event = new CustomEvent('forceRootReset');
  window.dispatchEvent(event);
};
forceReset();
`);

console.log("\n3. 📝 Estado atual esperado:");
console.log("   - forceRootView: true (inicial)");
console.log('   - selectedCategory: "" (vazio)');
console.log("   - dynamicOptions: {} (vazio)");
console.log("   - Deve mostrar: Initiative, Policy, Factor");

console.log("\n4. 🚨 Se ainda mostra 28 opções:");
console.log('   - Clique no botão "🔧 DEBUG: Forçar Raiz"');
console.log("   - Ou recarregue a página");
console.log("   - Verifique os logs no console do navegador");

console.log("\n📊 Para verificar no navegador:");
console.log("   - Abra DevTools (F12)");
console.log("   - Vá para a aba Console");
console.log(
  '   - Procure por logs "QueryBuilder State" e "renderDynamicGraphOptions"'
);
console.log('   - Verifique se forceRootView=true e selectedCategory=""');

console.log(
  "\n✅ Se tudo estiver correto, deve mostrar apenas 3 categorias na raiz!"
);
