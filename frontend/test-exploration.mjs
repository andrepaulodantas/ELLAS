// Teste direto das funcionalidades de exploração do ELLAS
import {
  explorePropertiesForClass,
  exploreValuesForProperty,
} from "./src/services/queryMappingService.js";

const testExplorationFunctions = async () => {
  console.log("🧪 Testando funções de exploração...\n");

  try {
    // Teste 1: Explorar propriedades para Initiative
    console.log('1️⃣ Testando explorePropertiesForClass("Initiative")...');
    const properties = await explorePropertiesForClass("Initiative");
    console.log(
      `   ✅ Resultado: ${properties.length} propriedades encontradas`
    );
    console.log(
      `   📋 Propriedades:`,
      properties
        .slice(0, 5)
        .map((p) => `${p.value} (${p.count})`)
        .join(", ")
    );

    // Teste 2: Explorar valores para created_in
    console.log(
      '\n2️⃣ Testando exploreValuesForProperty("Initiative", "created_in")...'
    );
    const countries = await exploreValuesForProperty(
      "Initiative",
      "created_in"
    );
    console.log(`   ✅ Resultado: ${countries.length} países encontrados`);
    console.log(
      `   🌎 Países:`,
      countries
        .slice(0, 5)
        .map((c) => c.value)
        .join(", ")
    );

    // Teste 3: Explorar valores para initiative_website
    console.log(
      '\n3️⃣ Testando exploreValuesForProperty("Initiative", "initiative_website")...'
    );
    const websites = await exploreValuesForProperty(
      "Initiative",
      "initiative_website"
    );
    console.log(`   ✅ Resultado: ${websites.length} websites encontrados`);
    console.log(`   🔗 Websites:`, websites.map((w) => w.value).join(", "));

    // Teste 4: Explorar valores para initiative_format
    console.log(
      '\n4️⃣ Testando exploreValuesForProperty("Initiative", "initiative_format")...'
    );
    const formats = await exploreValuesForProperty(
      "Initiative",
      "initiative_format"
    );
    console.log(`   ✅ Resultado: ${formats.length} formatos encontrados`);
    console.log(`   📊 Formatos:`, formats.map((f) => f.value).join(", "));

    console.log("\n🎉 Todos os testes concluídos com sucesso!");
  } catch (error) {
    console.error("❌ Erro durante os testes:", error);
  }
};

// Executar testes
testExplorationFunctions();
