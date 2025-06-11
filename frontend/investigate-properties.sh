#!/bin/bash

echo "🔍 Investigando propriedades relacionadas a público-alvo..."
echo "================================================================"

echo ""
echo "1️⃣ Buscando propriedades que contém 'audience':"
curl -s -X POST "https://app.ellas.ufmt.br/repositories/EllasV2" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -H "Accept: application/sparql-results+json" \
  -H "Authorization: Basic $(echo -n 'integracao:Ellas@integration' | base64)" \
  -d "query=PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#> SELECT DISTINCT ?property WHERE { ?s ?property ?o . FILTER(CONTAINS(STR(?property), 'audience')) } LIMIT 10" \
  --connect-timeout 10

echo ""
echo "2️⃣ Buscando propriedades que contém 'target':"
curl -s -X POST "https://app.ellas.ufmt.br/repositories/EllasV2" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -H "Accept: application/sparql-results+json" \
  -H "Authorization: Basic $(echo -n 'integracao:Ellas@integration' | base64)" \
  -d "query=PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#> SELECT DISTINCT ?property WHERE { ?s ?property ?o . FILTER(CONTAINS(STR(?property), 'target')) } LIMIT 10" \
  --connect-timeout 10

echo ""
echo "3️⃣ Listando todas as propriedades de Initiative:"
curl -s -X POST "https://app.ellas.ufmt.br/repositories/EllasV2" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -H "Accept: application/sparql-results+json" \
  -H "Authorization: Basic $(echo -n 'integracao:Ellas@integration' | base64)" \
  -d "query=PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#> SELECT DISTINCT ?property (COUNT(?s) as ?count) WHERE { ?s a Ellas:Initiative . ?s ?property ?o . FILTER(STRSTARTS(STR(?property), 'https://ellas.ufmt.br/Ontology/Ellas#')) } GROUP BY ?property ORDER BY DESC(?count) LIMIT 20" \
  --connect-timeout 10

echo ""
echo "✅ Investigação concluída!"
