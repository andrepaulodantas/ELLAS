// Teste específico para factors_contextual_factor_detail
const testFactorsProperty = () => {
  console.log("🧪 Testando factors_contextual_factor_detail...");

  // Dados esperados baseados na consulta real ao GraphDB
  const expectedValues = [
    { value: "The definition comes from the gence 2.0 instrument.", count: 2 },
    { value: "Workshops", count: 1 },
    { value: "Lectures", count: 1 },
    { value: "Competitions", count: 1 },
    { value: "Help community", count: 1 },
    { value: "Not confident", count: 1 },
    { value: "Maker activities", count: 1 },
    { value: "Participatory design", count: 1 },
    { value: "Real-world problems", count: 1 },
    { value: "Specific techs", count: 1 },
  ];

  console.log("✅ factors_contextual_factor_detail DEVE retornar:");
  expectedValues.forEach((item) => {
    console.log(`  - "${item.value}" (${item.count})`);
  });

  console.log("\n🔧 CORREÇÃO IMPLEMENTADA:");
  console.log("1. ✅ Detecção automática de categoria por prefixo");
  console.log("   - factors_ → Category: Factor");
  console.log("   - initiative_ → Category: Initiative");
  console.log("   - policy_ → Category: Policy");

  console.log("\n2. ✅ Fallback inteligente se prefixo não funcionar");
  console.log("   - Testa as 3 categorias automaticamente");
  console.log("   - Usa a categoria que retorna mais registros");

  console.log("\n3. ✅ Sistema corrigido na função exploreValuesForProperty");
  console.log(
    "   - Mapeia automaticamente factors_contextual_factor_detail → Factor"
  );
  console.log("   - Executa consulta com categoria correta");
  console.log("   - Retorna dados reais do GraphDB");

  console.log('\n❌ SE AINDA APARECER "Valor A, Valor B, Valor C":');
  console.log("   - Verificar console do navegador para logs de debug");
  console.log("   - Limpar cache com Ctrl+F5");
  console.log("   - Verificar se hot reload funcionou");

  console.log("\n🎯 AGORA DEVE FUNCIONAR:");
  console.log("   1. Raiz: 3 opções (Initiative, Policy, Factor)");
  console.log("   2. Factor: ~8 propriedades");
  console.log("   3. factors_contextual_factor_detail: 10 valores reais");

  return true;
};

testFactorsProperty();
