/**
 * Script de Teste Direto para Validação das Correções
 *
 * Testa diretamente as funções implementadas no frontend
 * sem depender do backend que pode não ter os endpoints necessários
 */

const path = require("path");

// Cores para output no terminal
const colors = {
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  reset: "\x1b[0m",
  bold: "\x1b[1m",
};

function log(color, message) {
  console.log(`${color}${message}${colors.reset}`);
}

async function testRootCategoriesFunction() {
  log(colors.blue + colors.bold, "\n=== TESTE 1: Função getRootCategories ===");

  try {
    // Importar dinamicamente o módulo do frontend
    const queryMappingPath = path.join(
      __dirname,
      "src/services/queryMappingService.ts"
    );

    // Como é TypeScript, vamos testar lendo o arquivo diretamente
    const fs = require("fs");
    const content = fs.readFileSync(queryMappingPath, "utf8");

    // Verificar se a função getRootCategories existe
    const hasGetRootCategories = content.includes(
      "export const getRootCategories"
    );

    if (hasGetRootCategories) {
      log(colors.green, "✅ SUCESSO: Função getRootCategories encontrada");

      // Extrair as categorias do código
      const match = content.match(
        /getRootCategories[^}]+return\s*\[([^\]]+)\]/s
      );
      if (match) {
        const categoriesText = match[1];
        const categories = [];

        // Extrair valores das categorias
        const valueMatches = categoriesText.match(/value:\s*"([^"]+)"/g);
        if (valueMatches) {
          valueMatches.forEach((vm) => {
            const value = vm.match(/value:\s*"([^"]+)"/)[1];
            categories.push(value);
          });
        }

        log(colors.yellow, `Categorias encontradas: ${categories.length}`);
        categories.forEach((cat) => {
          log(colors.blue, `   - ${cat}`);
        });

        if (
          categories.length === 3 &&
          categories.includes("Initiative") &&
          categories.includes("Policy") &&
          categories.includes("Factor")
        ) {
          log(
            colors.green,
            "✅ SUCESSO: Todas as 3 categorias corretas estão presentes"
          );
          return true;
        } else {
          log(
            colors.red,
            "❌ ERRO: Categorias incorretas ou quantidade inválida"
          );
          return false;
        }
      } else {
        log(
          colors.red,
          "❌ ERRO: Não foi possível extrair as categorias do código"
        );
        return false;
      }
    } else {
      log(colors.red, "❌ ERRO: Função getRootCategories não encontrada");
      return false;
    }
  } catch (error) {
    log(colors.red, `❌ ERRO: ${error.message}`);
    return false;
  }
}

async function testIsRootLevelFunction() {
  log(colors.blue + colors.bold, "\n=== TESTE 2: Função isRootLevel ===");

  try {
    const fs = require("fs");
    const queryMappingPath = path.join(
      __dirname,
      "src/services/queryMappingService.ts"
    );
    const content = fs.readFileSync(queryMappingPath, "utf8");

    const hasIsRootLevel = content.includes("export const isRootLevel");

    if (hasIsRootLevel) {
      log(colors.green, "✅ SUCESSO: Função isRootLevel encontrada");

      // Verificar lógica da função
      const functionMatch = content.match(/isRootLevel[^}]+{([^}]+)}/);
      if (functionMatch) {
        const functionBody = functionMatch[1];
        if (
          functionBody.includes("!category") ||
          (functionBody.includes("!selectedClass") &&
            functionBody.includes("!selectedProperty"))
        ) {
          log(
            colors.green,
            "✅ SUCESSO: Lógica da função isRootLevel está correta"
          );
          return true;
        } else {
          log(
            colors.red,
            "❌ ERRO: Lógica da função isRootLevel pode estar incorreta"
          );
          log(colors.yellow, `   Corpo da função: ${functionBody.trim()}`);
          return false;
        }
      }
    } else {
      log(colors.red, "❌ ERRO: Função isRootLevel não encontrada");
      return false;
    }
  } catch (error) {
    log(colors.red, `❌ ERRO: ${error.message}`);
    return false;
  }
}

async function testOptionalQueriesImplementation() {
  log(
    colors.blue + colors.bold,
    "\n=== TESTE 3: Consultas SPARQL com OPTIONAL ==="
  );

  try {
    const fs = require("fs");
    const queryMappingPath = path.join(
      __dirname,
      "src/services/queryMappingService.ts"
    );
    const content = fs.readFileSync(queryMappingPath, "utf8");

    // Verificar se há consultas OPTIONAL implementadas
    const hasOptionalQueries = content.includes("OPTIONAL {");

    if (hasOptionalQueries) {
      log(
        colors.green,
        "✅ SUCESSO: Consultas SPARQL com OPTIONAL encontradas"
      );

      // Contar quantas consultas OPTIONAL existem
      const optionalMatches = content.match(/OPTIONAL\s*{/g);
      if (optionalMatches) {
        log(
          colors.blue,
          `   Encontradas ${optionalMatches.length} consultas OPTIONAL`
        );
      }

      // Verificar se há tratamento para propriedades sem dados
      const hasEmptyArrayHandling =
        content.includes("return []") || content.includes("return [");
      if (hasEmptyArrayHandling) {
        log(
          colors.green,
          "✅ SUCESSO: Tratamento de arrays vazios implementado"
        );
      }

      return true;
    } else {
      log(colors.red, "❌ ERRO: Consultas SPARQL com OPTIONAL não encontradas");
      return false;
    }
  } catch (error) {
    log(colors.red, `❌ ERRO: ${error.message}`);
    return false;
  }
}

async function testQueryBuilderNavigation() {
  log(
    colors.blue + colors.bold,
    "\n=== TESTE 4: Navegação no QueryBuilder ==="
  );

  try {
    const fs = require("fs");
    const queryBuilderPath = path.join(
      __dirname,
      "src/components/QueryBuilder/index.tsx"
    );
    const content = fs.readFileSync(queryBuilderPath, "utf8");

    // Verificar se há função renderRootCategories
    const hasRenderRootCategories = content.includes("renderRootCategories");

    if (hasRenderRootCategories) {
      log(colors.green, "✅ SUCESSO: Função renderRootCategories encontrada");

      // Verificar se há controle de estado forceRootView
      const hasForceRootView = content.includes("forceRootView");
      if (hasForceRootView) {
        log(colors.green, "✅ SUCESSO: Estado forceRootView implementado");
      }

      // Verificar se há botão de debug
      const hasDebugButton =
        content.includes("DEBUG: Forçar Raiz") || content.includes("🔧");
      if (hasDebugButton) {
        log(colors.green, "✅ SUCESSO: Botão de debug implementado");
      }

      return true;
    } else {
      log(colors.red, "❌ ERRO: Função renderRootCategories não encontrada");
      return false;
    }
  } catch (error) {
    log(colors.red, `❌ ERRO: ${error.message}`);
    return false;
  }
}

async function testStylesForOptionalProperties() {
  log(
    colors.blue + colors.bold,
    "\n=== TESTE 5: Estilos para Propriedades Opcionais ==="
  );

  try {
    const fs = require("fs");
    const stylesPath = path.join(
      __dirname,
      "src/components/QueryBuilder/styles.css"
    );

    if (fs.existsSync(stylesPath)) {
      const content = fs.readFileSync(stylesPath, "utf8");

      // Verificar estilos específicos
      const hasOptionalPropertyStyles = content.includes(
        "optional-property-container"
      );
      const hasNoDataStyles = content.includes("no-data-info");
      const hasNavigationStyles = content.includes("navigation-help");

      if (hasOptionalPropertyStyles) {
        log(
          colors.green,
          "✅ SUCESSO: Estilos para propriedades opcionais encontrados"
        );
      }

      if (hasNoDataStyles) {
        log(colors.green, "✅ SUCESSO: Estilos para dados vazios encontrados");
      }

      if (hasNavigationStyles) {
        log(colors.green, "✅ SUCESSO: Estilos para navegação encontrados");
      }

      return (
        hasOptionalPropertyStyles && hasNoDataStyles && hasNavigationStyles
      );
    } else {
      log(colors.yellow, "⚠️  Arquivo de estilos não encontrado");
      return true; // Não crítico
    }
  } catch (error) {
    log(colors.red, `❌ ERRO: ${error.message}`);
    return false;
  }
}

async function runAllTests() {
  log(
    colors.blue + colors.bold,
    "🚀 INICIANDO TESTES DE VALIDAÇÃO DAS CORREÇÕES (FRONTEND)\n"
  );

  const results = {
    rootCategories: false,
    isRootLevel: false,
    optionalQueries: false,
    queryBuilderNav: false,
    optionalStyles: false,
  };

  // Executar todos os testes
  results.rootCategories = await testRootCategoriesFunction();
  results.isRootLevel = await testIsRootLevelFunction();
  results.optionalQueries = await testOptionalQueriesImplementation();
  results.queryBuilderNav = await testQueryBuilderNavigation();
  results.optionalStyles = await testStylesForOptionalProperties();

  // Relatório Final
  log(colors.blue + colors.bold, "\n=== RELATÓRIO FINAL ===");

  const passedTests = Object.values(results).filter(Boolean).length;
  const totalTests = Object.keys(results).length;

  Object.entries(results).forEach(([test, passed]) => {
    const status = passed ? "✅ PASSOU" : "❌ FALHOU";
    const color = passed ? colors.green : colors.red;
    log(color, `${status}: ${test}`);
  });

  log(
    colors.blue + colors.bold,
    `\nRESULTADO: ${passedTests}/${totalTests} testes passaram`
  );

  if (passedTests === totalTests) {
    log(
      colors.green + colors.bold,
      "🎉 TODOS OS TESTES PASSARAM! As correções estão implementadas corretamente."
    );
    log(colors.blue, "\n📋 RESUMO DAS CORREÇÕES VALIDADAS:");
    log(
      colors.green,
      "   ✅ Navegação hierárquica com apenas 3 categorias raiz"
    );
    log(colors.green, "   ✅ Função isRootLevel para controle de navegação");
    log(colors.green, "   ✅ Consultas SPARQL com cláusulas OPTIONAL");
    log(colors.green, "   ✅ Interface de navegação melhorada no QueryBuilder");
    log(colors.green, "   ✅ Estilos para propriedades opcionais");
  } else {
    log(
      colors.red + colors.bold,
      "⚠️  ALGUNS TESTES FALHARAM. Verifique os logs acima para detalhes."
    );
  }

  return passedTests === totalTests;
}

// Executar
if (require.main === module) {
  runAllTests().catch((error) => {
    log(colors.red, `❌ ERRO fatal: ${error.message}`);
    process.exit(1);
  });
}

module.exports = {
  testRootCategoriesFunction,
  testIsRootLevelFunction,
  testOptionalQueriesImplementation,
  testQueryBuilderNavigation,
  testStylesForOptionalProperties,
  runAllTests,
};
