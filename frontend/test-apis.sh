#!/bin/bash

echo "🧪 Testando APIs do ELLAS..."
echo "============================="

echo ""
echo "1️⃣ Testando API de propriedades para Initiative:"
curl -s -X GET "http://localhost:3002/api/ellas/properties/Initiative" \
  -H "Accept: application/json" | head -5

echo ""
echo "2️⃣ Testando API de valores para created_in:"
curl -s -X GET "http://localhost:3002/api/ellas/property-values/Initiative/created_in" \
  -H "Accept: application/json" | head -5

echo ""
echo "3️⃣ Testando API de valores para initiative_website:"
curl -s -X GET "http://localhost:3002/api/ellas/property-values/Initiative/initiative_website" \
  -H "Accept: application/json" | head -5

echo ""
echo "4️⃣ Testando conectividade direta com GraphDB:"
curl -s -X POST "https://app.ellas.ufmt.br/repositories/EllasV2" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -H "Accept: application/sparql-results+json" \
  -H "Authorization: Basic $(echo -n 'integracao:Ellas@integration' | base64)" \
  -d "query=PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#> SELECT DISTINCT ?website WHERE { ?s a Ellas:Initiative . ?s Ellas:initiative_website ?website } LIMIT 3" \
  --connect-timeout 10 | head -5

echo ""
echo "✅ Testes concluídos!"
