// Teste para verificar se a correção da navegação hierárquica está funcionando
const fs = require("fs");
const path = require("path");

console.log("🔍 Testando correções na navegação hierárquica...\n");

// 1. Verificar se as funções getRootCategories e isRootLevel existem
const queryMappingServicePath = path.join(
  __dirname,
  "src/services/queryMappingService.ts"
);

if (fs.existsSync(queryMappingServicePath)) {
  const content = fs.readFileSync(queryMappingServicePath, "utf8");

  const hasGetRootCategories = content.includes(
    "export const getRootCategories"
  );
  const hasIsRootLevel = content.includes("export const isRootLevel");

  console.log("✅ queryMappingService.ts:");
  console.log(
    `   - getRootCategories: ${
      hasGetRootCategories ? "✅ Presente" : "❌ Ausente"
    }`
  );
  console.log(
    `   - isRootLevel: ${hasIsRootLevel ? "✅ Presente" : "❌ Ausente"}`
  );

  if (hasGetRootCategories) {
    // Extrair as categorias definidas
    const match = content.match(
      /getRootCategories[^}]+value: "(\w+)"[^}]+value: "(\w+)"[^}]+value: "(\w+)"/
    );
    if (match) {
      console.log(
        `   - Categorias definidas: ${match[1]}, ${match[2]}, ${match[3]}`
      );
    }
  }
} else {
  console.log("❌ queryMappingService.ts não encontrado");
}

console.log("");

// 2. Verificar se o QueryBuilder usa renderRootCategories
const queryBuilderPath = path.join(
  __dirname,
  "src/components/QueryBuilder/index.tsx"
);

if (fs.existsSync(queryBuilderPath)) {
  const content = fs.readFileSync(queryBuilderPath, "utf8");

  const hasRenderRootCategories = content.includes(
    "const renderRootCategories"
  );
  const hasCorrectCall = content.includes("return renderRootCategories()");
  const hasCorrectCondition = content.includes("if (!selectedCategory)");

  console.log("✅ QueryBuilder/index.tsx:");
  console.log(
    `   - renderRootCategories função: ${
      hasRenderRootCategories ? "✅ Presente" : "❌ Ausente"
    }`
  );
  console.log(
    `   - Chamada correta: ${hasCorrectCall ? "✅ Presente" : "❌ Ausente"}`
  );
  console.log(
    `   - Condição correta: ${
      hasCorrectCondition ? "✅ Presente" : "❌ Ausente"
    }`
  );
} else {
  console.log("❌ QueryBuilder/index.tsx não encontrado");
}

console.log("");

// 3. Verificar logs de problemas conhecidos
console.log("🔍 Verificando possíveis problemas:");

if (fs.existsSync(queryBuilderPath)) {
  const content = fs.readFileSync(queryBuilderPath, "utf8");

  // Verificar se ainda há chamadas para getCategoryDemoProperties
  const hasDemoCall = content.includes("getCategoryDemoProperties");
  console.log(
    `   - Chamadas para getCategoryDemoProperties: ${
      hasDemoCall ? "⚠️  Ainda presente (pode causar 28 opções)" : "✅ Removida"
    }`
  );

  // Verificar se renderDynamicGraphOptions está sendo usado nas abas
  const basicTabUsage =
    content.includes('activeTab === "basic"') &&
    content.includes("renderDynamicGraphOptions");
  console.log(
    `   - Aba basic usa navegação hierárquica: ${
      basicTabUsage ? "✅ Sim" : "❌ Não"
    }`
  );
}

console.log("\n🎯 Resumo da correção:");
console.log(
  '   - O problema era que getCategoryDemoProperties retornava 28 propriedades de "Initiative"'
);
console.log(
  "   - A solução foi criar getRootCategories() que retorna apenas 3 categorias"
);
console.log(
  "   - O QueryBuilder agora deve mostrar apenas Initiative, Policy, Factor na raiz"
);
console.log(
  "\n📝 Para testar: Abra http://localhost:3000 e verifique se só aparecem 3 categorias iniciais"
);
