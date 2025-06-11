// Teste rápido das funções do sistema ELLAS

const {
  explorePropertiesForClass,
  exploreValuesForProperty,
} = require("./src/services/queryMappingService.ts");

async function testELLASFunctions() {
  console.log("🧪 Iniciando teste das funções ELLAS...");

  try {
    // Teste 1: Propriedades de Initiative
    console.log("\n🔍 Teste 1: Propriedades de Initiative");
    const props = await explorePropertiesForClass("Initiative");
    console.log(`✅ Encontradas ${props.length} propriedades`);

    // Teste 2: Valores de created_in
    console.log("\n🔍 Teste 2: Valores de created_in");
    const countries = await exploreValuesForProperty(
      "Initiative",
      "created_in"
    );
    console.log(`✅ Encontrados ${countries.length} países`);

    // Teste 3: Valores de initiative_website
    console.log("\n🔍 Teste 3: Valores de initiative_website");
    const websites = await exploreValuesForProperty(
      "Initiative",
      "initiative_website"
    );
    console.log(`✅ Encontrados ${websites.length} websites`);

    console.log("\n📊 Resumo dos testes:");
    console.log(`- Propriedades: ${props.length} (esperado: 28)`);
    console.log(`- Países: ${countries.length} (esperado: 44)`);
    console.log(`- Websites: ${websites.length} (esperado: 1)`);

    if (props.length >= 28 && countries.length >= 40 && websites.length >= 1) {
      console.log("\n🎉 Todos os testes passaram!");
    } else {
      console.log(
        "\n⚠️ Alguns resultados podem estar usando dados de fallback"
      );
    }
  } catch (error) {
    console.error("❌ Erro nos testes:", error);
  }
}

testELLASFunctions();
