// Script para testar se as correções SPARQL estão funcionando
import { executeDynamicGraphQuery } from './src/services/queryMappingService.js';

console.log('🧪 Testando correções SPARQL...');

async function testSparqlFix() {
  try {
    console.log('📋 Teste 1: Consulta básica de Initiative sem filtros');
    const result1 = await executeDynamicGraphQuery(
      'Initiative',
      [], // Sem filtros
      ['created_in', 'start_date'] // Campos extras (sem 'label' para evitar duplicação)
    );
    
    console.log('📊 Resultado 1:', {
      hasResult: !!result1,
      hasBindings: !!(result1?.results?.bindings),
      count: result1?.results?.bindings?.length || 0
    });
    
    if (result1?.results?.bindings?.length === 44) {
      console.log('🚨 PROBLEMA: Ainda retorna exatos 44 resultados (dados de fallback)');
    } else {
      console.log('✅ SUCESSO: Não retorna dados de fallback fixos');
    }
    
    console.log('📋 Teste 2: Consulta com filtro específico');
    const result2 = await executeDynamicGraphQuery(
      'Initiative',
      ['created_in', 'Brazil'], // Filtro por país
      ['start_date', 'policy_type'] // Campos extras sem 'label'
    );
    
    console.log('📊 Resultado 2:', {
      hasResult: !!result2,
      hasBindings: !!(result2?.results?.bindings),
      count: result2?.results?.bindings?.length || 0
    });
    
    if (result2?.results?.bindings?.length === 44) {
      console.log('🚨 PROBLEMA: Filtro não funciona, ainda retorna 44 resultados');
    } else {
      console.log('✅ SUCESSO: Filtro está funcionando');
    }
    
  } catch (error) {
    console.error('❌ Erro no teste:', error);
  }
}

testSparqlFix();
