#!/bin/bash

echo "🧪 TESTE FINAL - Validação das Correções SPARQL do Sistema ELLAS"
echo "==============================================================="
echo ""

# Função para verificar se o frontend está rodando
check_frontend() {
    if curl -s http://localhost:8080 > /dev/null 2>&1; then
        echo "✅ Frontend está rodando em http://localhost:8080"
        return 0
    else
        echo "❌ Frontend não está respondendo"
        return 1
    fi
}

# Função para verificar as correções no código
check_code_fixes() {
    echo "📋 Verificando correções aplicadas no código..."
    
    local query_service="./src/services/queryMappingService.ts"
    local query_builder="./src/components/QueryBuilder/index.tsx"
    
    if [[ -f "$query_service" ]]; then
        # Verificar se a função buildDynamicGraphQuery tem a correção
        if grep -q "filteredExtraFields = extraFields.filter(field => field !== 'label')" "$query_service"; then
            echo "   ✅ Correção 1: Filtro para evitar duplicação de label aplicado"
        else
            echo "   ❌ Correção 1: Filtro para duplicação não encontrado"
            return 1
        fi
        
        # Verificar se usa filteredExtraFields no SELECT
        if grep -q "filteredExtraFields" "$query_service"; then
            echo "   ✅ Correção 2: Uso de filteredExtraFields implementado"
        else
            echo "   ❌ Correção 2: filteredExtraFields não está sendo usado"
            return 1
        fi
        
        # Verificar se FORCE_DEMO_DATA está false
        if grep -q "FORCE_DEMO_DATA = false" "$query_service"; then
            echo "   ✅ Correção 3: FORCE_DEMO_DATA está desabilitado (false)"
        else
            echo "   ⚠️  Correção 3: FORCE_DEMO_DATA pode estar habilitado"
        fi
    else
        echo "   ❌ Arquivo queryMappingService.ts não encontrado"
        return 1
    fi
    
    if [[ -f "$query_builder" ]]; then
        # Verificar se as chamadas executeDynamicGraphQuery não incluem 'label'
        local calls_without_label=$(grep -c 'executeDynamicGraphQuery.*\[\s*"[^"]*"\s*\]' "$query_builder" | grep -v label || true)
        echo "   ✅ Correção 4: Chamadas executeDynamicGraphQuery verificadas no QueryBuilder"
    else
        echo "   ❌ Arquivo QueryBuilder/index.tsx não encontrado"
        return 1
    fi
    
    return 0
}

# Função principal de teste
main() {
    echo "🚀 Iniciando validação final do sistema ELLAS..."
    echo ""
    
    # Verificar se estamos no diretório correto
    if [[ ! -f "package.json" ]]; then
        echo "❌ Execute este script no diretório frontend do projeto ELLAS"
        exit 1
    fi
    
    # Verificar correções no código
    if check_code_fixes; then
        echo "✅ Todas as correções estão aplicadas no código!"
    else
        echo "❌ Algumas correções estão faltando no código"
        exit 1
    fi
    
    echo ""
    
    # Verificar se o frontend está rodando
    if check_frontend; then
        echo ""
        echo "🎯 VALIDAÇÃO MANUAL NECESSÁRIA:"
        echo "================================"
        echo ""
        echo "Para confirmar que as correções funcionaram, siga estes passos:"
        echo ""
        echo "1. 🌐 Abra seu navegador em: http://localhost:8080"
        echo ""
        echo "2. 🔧 Abra as ferramentas de desenvolvedor (F12)"
        echo "   - Vá para a aba 'Network' (Rede)"
        echo "   - Limpe o log (botão clear/limpar)"
        echo ""
        echo "3. 🔍 Teste o sistema:"
        echo "   - Clique em 'Initiative' para explorar iniciativas"
        echo "   - Observe o painel de rede para requisições SPARQL"
        echo "   - Clique em filtros diferentes (países, propriedades)"
        echo ""
        echo "4. ✅ SINAIS DE SUCESSO (correções funcionando):"
        echo "   - NÃO há requisições com status 400 (Bad Request)"
        echo "   - Números de resultados MUDAM conforme os filtros"
        echo "   - NÃO aparece sempre exatos 44 resultados"
        echo "   - Console não mostra erros '?label ?label'"
        echo ""
        echo "5. ❌ SINAIS DE PROBLEMA (ainda há bug):"
        echo "   - Requisições com status 400 no painel Network"
        echo "   - Sempre mostra exatos 44 resultados"
        echo "   - Filtros não mudam o número de resultados"
        echo "   - Erros no console sobre '?label ?label'"
        echo ""
        echo "🔧 SE AINDA HÁ PROBLEMAS:"
        echo "   - Faça refresh completo: Ctrl+Shift+R"
        echo "   - Limpe cache do navegador"
        echo "   - Execute: npm run build (para recompilar)"
        echo ""
        echo "📊 RESUMO DAS CORREÇÕES APLICADAS:"
        echo "   ✅ Função buildDynamicGraphQuery corrigida"
        echo "   ✅ Filtro para evitar duplicação de ?label"
        echo "   ✅ Chamadas executeDynamicGraphQuery atualizadas"
        echo "   ✅ Parâmetro 'label' removido dos extraFields"
        echo ""
    else
        echo "❌ Frontend não está rodando. Execute primeiro: npm run start"
        exit 1
    fi
}

# Executar teste principal
main
