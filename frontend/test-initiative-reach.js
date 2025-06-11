// Teste específico para initiative_reach
const axios = require("axios");

const BASE_URL = "https://app.ellas.ufmt.br/repositories/EllasV2";

const testInitiativeReach = async () => {
  console.log("🧪 Testando initiative_reach...");

  try {
    const query = `
      PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>
      PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
      
      SELECT DISTINCT ?reach ?reachLabel (COUNT(?initiative) as ?count)
      WHERE {
        ?initiative a Ellas:Initiative .
        ?initiative Ellas:initiative_reach ?reach .
        OPTIONAL { ?reach rdfs:label ?reachLabel }
      }
      GROUP BY ?reach ?reachLabel
      ORDER BY DESC(?count)
    `;

    const params = new URLSearchParams();
    params.append("query", query);

    const response = await axios.post(BASE_URL, params, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/sparql-results+json",
        Authorization:
          "Basic " +
          Buffer.from("integracao:Ellas@integration").toString("base64"),
      },
      timeout: 30000,
    });

    console.log("✅ Resposta recebida:", response.status);
    console.log("📊 Dados:", JSON.stringify(response.data, null, 2));

    // Processar os dados como o sistema deveria fazer
    if (
      response.data &&
      response.data.results &&
      response.data.results.bindings
    ) {
      const values = response.data.results.bindings.map((binding) => {
        const value = binding.reach ? binding.reach.value : "";
        const count = binding.count ? parseInt(binding.count.value) : 0;

        return {
          value: value,
          label: value,
          count: count,
          type: "value",
        };
      });

      console.log("🎯 Valores processados que deveriam aparecer no frontend:");
      values.forEach((v) => console.log(`  - ${v.label} (${v.count})`));

      return values;
    }
  } catch (error) {
    console.error("❌ Erro:", error.message);
    if (error.response) {
      console.error(
        "📋 Resposta do erro:",
        error.response.status,
        error.response.statusText
      );
    }
  }
};

testInitiativeReach();
