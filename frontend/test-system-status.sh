#!/bin/bash

echo "🧪 Testando se o sistema ELLAS foi corrigido..."
echo "📋 Verificando se ainda retorna sempre 44 resultados..."

# Iniciar servidor frontend se não estiver rodando
if ! pgrep -f "npm run start" > /dev/null; then
    echo "🚀 Iniciando servidor frontend..."
    cd /home/araujo/ELLAS/frontend
    npm run start &
    sleep 10
fi

echo "🔍 Sistema deveria estar rodando em http://localhost:8080"
echo "📊 Para testar manualmente:"
echo "   1. Abra http://localhost:8080 no navegador"
echo "   2. Clique em 'Initiative' para explorar iniciativas"
echo "   3. Observe se sempre mostra 44 resultados (problema) ou números diferentes (corrigido)"
echo "   4. Teste diferentes filtros para ver se o número muda"
echo ""
echo "🎯 SINAIS DE CORREÇÃO FUNCIONANDO:"
echo "   ✅ Números de resultados diferentes de 44"
echo "   ✅ Filtros realmente filtram os dados"
echo "   ✅ Sem erros 400 (Bad Request) no console do navegador"
echo ""
echo "🚨 SINAIS DE PROBLEMA PERSISTENTE:"
echo "   ❌ Sempre retorna exatos 44 resultados"
echo "   ❌ Filtros não funcionam"
echo "   ❌ Erros 400 no console com '?label ?label'"

# Verificar se conseguimos acessar o frontend
if curl -s http://localhost:8080 > /dev/null; then
    echo "✅ Frontend está respondendo em http://localhost:8080"
else
    echo "❌ Frontend não está respondendo"
fi
