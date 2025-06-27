#!/usr/bin/env node

/**
 * Script de Debugging das Limitações do Sistema ELLAS
 * 
 * Verifica e testa as três questões críticas:
 * 1. Limitação de 6 propriedades em "Explorar Dados Conectados"
 * 2. Categoria Factor não mostrando dados
 * 3. Propriedade located_in incorretamente incluída em Policy
 */

const axios = require('axios');
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  bold: '\x1b[1m',
  reset: '\x1b[0m'
};

const BASE_URL = 'http://localhost:3000';

const log = (color, message) => {
  console.log(`${color}${message}${colors.reset}`);
};

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * TESTE 1: Verificar limitação de propriedades para Initiative
 */
async function testInitiativePropertiesLimit() {
  log(colors.blue + colors.bold, '\n=== TESTE 1: Limitação de Propriedades Initiative ===');
  
  try {
    const response = await axios.get(`${BASE_URL}/api/graph-options`, {
      params: { selectedClass: 'Initiative' }
    });
    
    const properties = response.data;
    log(colors.yellow, `Total de propriedades encontradas para Initiative: ${properties.length}`);
    
    if (properties.length > 6) {
      log(colors.green, '✅ SUCCESS: Mais de 6 propriedades disponíveis para Initiative');
      log(colors.blue, 'Propriedades disponíveis:');
      properties.forEach((prop, index) => {
        log(colors.blue, `   ${index + 1}. ${prop.label || prop.value} (count: ${prop.count || 0})`);
      });
      return true;
    } else {
      log(colors.red, `❌ LIMITAÇÃO DETECTADA: Apenas ${properties.length} propriedades (esperado > 6)`);
      log(colors.yellow, 'Propriedades limitadas:');
      properties.forEach((prop, index) => {
        log(colors.yellow, `   ${index + 1}. ${prop.label || prop.value}`);
      });
      return false;
    }
    
  } catch (error) {
    log(colors.red, `❌ ERRO na requisição: ${error.message}`);
    return false;
  }
}

/**
 * TESTE 2: Verificar categoria Factor
 */
async function testFactorCategory() {
  log(colors.blue + colors.bold, '\n=== TESTE 2: Dados da Categoria Factor ===');
  
  try {
    // Testar categoria Factor
    const responseOptions = await axios.get(`${BASE_URL}/api/graph-options`, {
      params: { selectedClass: 'Factor' }
    });
    
    const properties = responseOptions.data;
    log(colors.yellow, `Propriedades encontradas para Factor: ${properties.length}`);
    
    if (properties.length === 0) {
      log(colors.red, '❌ PROBLEMA: Factor não retorna propriedades');
      
      // Testar com ContextualFactor
      log(colors.blue, 'Testando com ContextualFactor...');
      const responseContextual = await axios.get(`${BASE_URL}/api/graph-options`, {
        params: { selectedClass: 'ContextualFactor' }
      });
      
      const contextualProperties = responseContextual.data;
      log(colors.yellow, `Propriedades encontradas para ContextualFactor: ${contextualProperties.length}`);
      
      if (contextualProperties.length > 0) {
        log(colors.yellow, '⚠️ DIAGNÓSTICO: Sistema usa ContextualFactor ao invés de Factor');
        return false;
      }
      
    } else {
      log(colors.green, '✅ SUCCESS: Factor retorna propriedades');
      properties.slice(0, 5).forEach((prop, index) => {
        log(colors.blue, `   ${index + 1}. ${prop.label || prop.value} (count: ${prop.count || 0})`);
      });
      return true;
    }
    
  } catch (error) {
    log(colors.red, `❌ ERRO na requisição: ${error.message}`);
    return false;
  }
}

/**
 * TESTE 3: Verificar located_in em Policy
 */
async function testPolicyLocatedIn() {
  log(colors.blue + colors.bold, '\n=== TESTE 3: located_in em Policy ===');
  
  try {
    const response = await axios.get(`${BASE_URL}/api/graph-options`, {
      params: { selectedClass: 'Policy' }
    });
    
    const properties = response.data;
    const hasLocatedIn = properties.some(prop => prop.value === 'located_in');
    
    if (hasLocatedIn) {
      log(colors.red, '❌ PROBLEMA: located_in incorretamente incluída em Policy');
      log(colors.yellow, 'Propriedades Policy:');
      properties.forEach((prop, index) => {
        const marker = prop.value === 'located_in' ? ' 🚨' : '';
        log(colors.yellow, `   ${index + 1}. ${prop.label || prop.value}${marker}`);
      });
      return false;
    } else {
      log(colors.green, '✅ SUCCESS: located_in não está em Policy');
      log(colors.blue, `Total de propriedades Policy: ${properties.length}`);
      return true;
    }
    
  } catch (error) {
    log(colors.red, `❌ ERRO na requisição: ${error.message}`);
    return false;
  }
}

/**
 * TESTE 4: Verificar navegação raiz
 */
async function testRootNavigation() {
  log(colors.blue + colors.bold, '\n=== TESTE 4: Navegação Raiz ===');
  
  try {
    const response = await axios.get(`${BASE_URL}/api/graph-options`);
    const options = response.data;
    
    log(colors.yellow, `Opções na raiz: ${options.length}`);
    
    if (options.length === 3) {
      const expectedCategories = ['Initiative', 'Policy', 'Factor'];
      const actualCategories = options.map(opt => opt.value);
      const hasAllCategories = expectedCategories.every(cat => 
        actualCategories.includes(cat)
      );
      
      if (hasAllCategories) {
        log(colors.green, '✅ SUCCESS: Navegação raiz correta (3 categorias)');
        options.forEach((opt) => {
          log(colors.blue, `   - ${opt.label} (${opt.value}): ${opt.count} itens`);
        });
        return true;
      } else {
        log(colors.red, '❌ PROBLEMA: Categorias incorretas na raiz');
        return false;
      }
    } else {
      log(colors.red, `❌ PROBLEMA: Esperado 3 categorias, encontrado ${options.length}`);
      return false;
    }
    
  } catch (error) {
    log(colors.red, `❌ ERRO na requisição: ${error.message}`);
    return false;
  }
}

/**
 * Executar todos os testes
 */
async function runAllTests() {
  log(colors.blue + colors.bold, '🔍 DIAGNÓSTICO DAS LIMITAÇÕES DO SISTEMA ELLAS\n');
  
  const results = {
    rootNavigation: false,
    initiativeLimit: false,
    factorCategory: false,
    policyLocatedIn: false
  };
  
  // Teste 1: Navegação raiz
  results.rootNavigation = await testRootNavigation();
  await delay(500);
  
  // Teste 2: Limitação de propriedades Initiative
  results.initiativeLimit = await testInitiativePropertiesLimit();
  await delay(500);
  
  // Teste 3: Categoria Factor
  results.factorCategory = await testFactorCategory();
  await delay(500);
  
  // Teste 4: located_in em Policy
  results.policyLocatedIn = await testPolicyLocatedIn();
  await delay(500);
  
  // Resumo final
  log(colors.blue + colors.bold, '\n📊 RESUMO DOS TESTES:');
  log(results.rootNavigation ? colors.green : colors.red, 
      `   Navegação Raiz: ${results.rootNavigation ? 'OK' : 'PROBLEMA'}`);
  log(results.initiativeLimit ? colors.green : colors.red, 
      `   Limitação Initiative: ${results.initiativeLimit ? 'CORRIGIDA' : 'AINDA LIMITADA'}`);
  log(results.factorCategory ? colors.green : colors.red, 
      `   Categoria Factor: ${results.factorCategory ? 'OK' : 'SEM DADOS'}`);
  log(results.policyLocatedIn ? colors.green : colors.red, 
      `   Policy located_in: ${results.policyLocatedIn ? 'OK' : 'INCORRETA'}`);
  
  const allPassed = Object.values(results).every(result => result);
  
  log(colors.blue + colors.bold, '\n🎯 CONCLUSÃO:');
  if (allPassed) {
    log(colors.green, '✅ Todos os problemas foram corrigidos!');
  } else {
    log(colors.red, '❌ Ainda existem problemas que precisam ser corrigidos.');
  }
  
  return results;
}

// Executar apenas se chamado diretamente
if (require.main === module) {
  runAllTests().catch((error) => {
    log(colors.red, `❌ ERRO fatal: ${error.message}`);
    process.exit(1);
  });
}

module.exports = {
  testInitiativePropertiesLimit,
  testFactorCategory,
  testPolicyLocatedIn,
  testRootNavigation,
  runAllTests
};
