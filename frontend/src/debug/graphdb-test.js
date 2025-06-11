// Debug script para testar conectividade com GraphDB
import axios from "axios";

const BASE_URL = "https://app.ellas.ufmt.br/repositories/EllasV2";
const AUTH_HEADER = "Basic " + btoa("integracao:Ellas@integration");

// Teste básico de conectividade
async function testBasicConnection() {
  console.log("=== Teste 1: Conectividade básica ===");

  try {
    const response = await axios.get(BASE_URL, {
      headers: {
        Accept: "application/sparql-results+json",
        Authorization: AUTH_HEADER,
      },
      timeout: 10000,
    });

    console.log("✅ Conectividade básica OK:", response.status);
    return true;
  } catch (error) {
    console.error("❌ Erro de conectividade:", error.message);
    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Headers:", error.response.headers);
    }
    return false;
  }
}

// Teste de consulta simples
async function testSimpleQuery() {
  console.log("\n=== Teste 2: Consulta simples ===");

  const query = `
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    SELECT (COUNT(*) as ?count)
    WHERE { 
      ?s ?p ?o 
    } 
    LIMIT 1
  `;

  try {
    const params = new URLSearchParams();
    params.append("query", query);

    const response = await axios.post(BASE_URL, params, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/sparql-results+json",
        Authorization: AUTH_HEADER,
      },
      timeout: 15000,
    });

    console.log("✅ Consulta simples OK:", response.status);
    console.log("Dados:", JSON.stringify(response.data, null, 2));
    return response.data;
  } catch (error) {
    console.error("❌ Erro na consulta simples:", error.message);
    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Data:", error.response.data);
    }
    return null;
  }
}

// Teste de consulta de propriedades específica
async function testPropertyQuery() {
  console.log("\n=== Teste 3: Consulta de propriedades ===");

  const query = `
    PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    
    SELECT DISTINCT ?value (COUNT(DISTINCT ?s) as ?count)
    WHERE {
      ?s rdf:type Ellas:Initiative .
      ?s Ellas:initiative_website ?propValue .
      BIND(STR(?propValue) AS ?value)
    }
    GROUP BY ?value
    ORDER BY DESC(?count)
    LIMIT 10
  `;

  try {
    const params = new URLSearchParams();
    params.append("query", query);

    const response = await axios.post(BASE_URL, params, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/sparql-results+json",
        Authorization: AUTH_HEADER,
      },
      timeout: 15000,
    });

    console.log("✅ Consulta de propriedades OK:", response.status);
    console.log("Resultados:", JSON.stringify(response.data, null, 2));
    return response.data;
  } catch (error) {
    console.error("❌ Erro na consulta de propriedades:", error.message);
    return null;
  }
}

// Executar todos os testes
export async function runGraphDBTests() {
  console.log("🔍 Iniciando testes de conectividade com GraphDB...\n");

  const basicOK = await testBasicConnection();
  if (!basicOK) {
    console.log(
      "\n❌ Falha na conectividade básica. Verifique a configuração de rede/proxy."
    );
    return false;
  }

  const simpleResult = await testSimpleQuery();
  if (!simpleResult) {
    console.log(
      "\n❌ Falha na consulta simples. Verifique autenticação e endpoint."
    );
    return false;
  }

  const propertyResult = await testPropertyQuery();
  if (!propertyResult) {
    console.log(
      "\n❌ Falha na consulta de propriedades. Verifique a estrutura dos dados."
    );
    return false;
  }

  console.log(
    "\n✅ Todos os testes passaram! O GraphDB está funcionando corretamente."
  );
  return true;
}

// Para uso direto no browser console
if (typeof window !== "undefined") {
  window.runGraphDBTests = runGraphDBTests;
}
