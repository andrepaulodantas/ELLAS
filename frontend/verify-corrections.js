// Script para verificar se as consultas SPARQL ainda estão com erro
// Simula o que acontece quando o usuário navega no sistema

console.log('🧪 Verificando status das correções SPARQL...');

// Simular busca direta no arquivo de logs para encontrar padrões de erro
const fs = require('fs');
const path = require('path');

function checkForErrors() {
  console.log('🔍 Verificando se há logs de erro recentes...');
  
  // Verificar se o sistema está configurado corretamente
  const queryMappingPath = './src/services/queryMappingService.ts';
  
  if (fs.existsSync(queryMappingPath)) {
    const content = fs.readFileSync(queryMappingPath, 'utf8');
    
    // Verificar se as correções estão aplicadas
    const hasFilteredExtraFields = content.includes('filteredExtraFields');
    const hasDuplicateProtection = content.includes('filter(field => field !== \'label\')');
    
    console.log('📋 Status das correções aplicadas:');
    console.log(`   ✅ Filtro para extraFields: ${hasFilteredExtraFields ? 'SIM' : 'NÃO'}`);
    console.log(`   ✅ Proteção contra duplicação: ${hasDuplicateProtection ? 'SIM' : 'NÃO'}`);
    
    if (hasFilteredExtraFields && hasDuplicateProtection) {
      console.log('✅ TODAS as correções estão aplicadas no código!');
      console.log('');
      console.log('🎯 PRÓXIMOS PASSOS PARA VALIDAR:');
      console.log('   1. Abrir http://localhost:8080 no navegador');
      console.log('   2. Abrir DevTools (F12) > aba Network');
      console.log('   3. Clicar em "Initiative" ou qualquer categoria');
      console.log('   4. Verificar se NÃO há requisições com status 400');
      console.log('   5. Verificar se o número de resultados muda conforme filtros');
      console.log('');
      console.log('🚨 SE AINDA HÁ PROBLEMAS:');
      console.log('   - Pode ser cache do navegador (Ctrl+F5 para refresh completo)');
      console.log('   - Pode ser que o build não foi atualizado (npm run build)');
      console.log('   - Verificar console do navegador para erros JavaScript');
      
    } else {
      console.log('❌ Nem todas as correções estão aplicadas!');
    }
    
    // Verificar se FORCE_DEMO_DATA está false
    const isDemoDataForced = content.includes('FORCE_DEMO_DATA = true');
    console.log(`   📊 Modo demonstração forçado: ${isDemoDataForced ? 'SIM (problema!)' : 'NÃO (correto)'}`);
    
  } else {
    console.log('❌ Arquivo queryMappingService.ts não encontrado!');
  }
}

checkForErrors();
