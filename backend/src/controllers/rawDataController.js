const axios = require('axios');

const graphDBEndpoint = process.env.GRAPHDB_ENDPOINT || 'http://44.212.115.153:7200/repositories/EllasV2';
const username = process.env.GRAPHDB_USER || 'integracao';
const password = process.env.GRAPHDB_PASSWORD;

// Queries completas para download de dados brutos por categoria
const RAW_DATA_QUERIES = {
  policies: `
    PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    SELECT DISTINCT ?policyName ?countryName ?policyType ?startDate ?policyDescription ?source
    WHERE {
      ?policy a Ellas:Policy.
      ?policy rdfs:label ?policyName.
      FILTER(LANG(?policyName) = "en")
      ?policy Ellas:created_in ?country.
      ?country rdfs:label ?countryName.
      FILTER(LANG(?countryName) = "en")
      OPTIONAL { ?policy Ellas:policy_type ?policyType. }
      OPTIONAL { ?policy Ellas:start_date ?startDate. }
      OPTIONAL { ?policy Ellas:policy_description ?policyDescription. }
      OPTIONAL { ?policy Ellas:policy_source ?source. }
    }
    ORDER BY ?countryName ?policyName
  `,
  initiatives: `
    PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    SELECT DISTINCT ?initiativeName ?countryName ?status ?startDate ?finishDate
                    ?format ?objective ?coordinatorType ?coordinatorGender
                    ?organizationSector ?website ?dataSource
    WHERE {
      ?initiative a Ellas:Initiative.
      ?initiative rdfs:label ?initiativeName.
      FILTER(LANG(?initiativeName) = "en")
      ?initiative Ellas:created_in ?country.
      ?country rdfs:label ?countryName.
      FILTER(LANG(?countryName) = "en")
      OPTIONAL { ?initiative Ellas:initiative_status ?status. }
      OPTIONAL { ?initiative Ellas:start_date ?startDate. }
      OPTIONAL { ?initiative Ellas:finish_date ?finishDate. }
      OPTIONAL { ?initiative Ellas:initiative_format ?format. }
      OPTIONAL { ?initiative Ellas:initiative_objective ?objective. }
      OPTIONAL { ?initiative Ellas:initiative_coordinator_type ?coordinatorType. }
      OPTIONAL { ?initiative Ellas:initiative_coordinator_gender ?coordinatorGender. }
      OPTIONAL { ?initiative Ellas:initiative_organization_sector ?organizationSector. }
      OPTIONAL { ?initiative Ellas:initiative_website ?website. }
      OPTIONAL { ?initiative Ellas:initiative_data_source ?dataSource. }
    }
    ORDER BY ?countryName ?initiativeName
  `,
  factors: `
    PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    SELECT DISTINCT ?factorName ?factorCategory ?countryName ?impactType
                    ?contextType ?impact ?source
    WHERE {
      ?factor a Ellas:Factor.
      ?contextualFactor rdfs:subClassOf ?factor.
      ?contextualFactor rdfs:label ?factorName.
      FILTER(LANG(?factorName) = "en")
      ?factor rdfs:label ?factorCategory.
      FILTER(LANG(?factorCategory) = "en")
      ?contextualFactor Ellas:analyzed_in ?country.
      ?country rdfs:label ?countryName.
      FILTER(LANG(?countryName) = "en")
      OPTIONAL { ?contextualFactor Ellas:factors_impact_type ?impactType. }
      OPTIONAL { ?contextualFactor Ellas:factors_context_type ?contextType. }
      OPTIONAL { ?contextualFactor Ellas:factors_impact ?impact. }
      OPTIONAL { ?contextualFactor Ellas:factors_source ?source. }
    }
    ORDER BY ?countryName ?factorCategory ?factorName
  `,
};

async function executeSparqlForCsv(query) {
  if (!password) {
    throw new Error('Credenciais do GraphDB não configuradas no servidor.');
  }

  const auth = Buffer.from(`${username}:${password}`).toString('base64');
  const params = new URLSearchParams();
  params.append('query', query);

  const response = await axios.post(graphDBEndpoint, params.toString(), {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/sparql-results+json',
      'Authorization': `Basic ${auth}`,
    },
    timeout: 60000,
  });

  return response.data;
}

function sparqlResultsToCsv(data) {
  if (!data?.results?.bindings?.length) return '';

  const vars = data.head.vars;
  const header = vars.join(',');

  const rows = data.results.bindings.map(binding => {
    return vars.map(v => {
      const cell = binding[v]?.value || '';
      // Escape CSV: wrap in quotes if contains comma, newline or quote
      if (cell.includes(',') || cell.includes('\n') || cell.includes('"')) {
        return `"${cell.replace(/"/g, '""')}"`;
      }
      return cell;
    }).join(',');
  });

  return [header, ...rows].join('\n');
}

async function rawDataDownload(req, res) {
  const { category } = req.params;

  if (!RAW_DATA_QUERIES[category]) {
    return res.status(400).json({
      error: `Categoria inválida. Use: ${Object.keys(RAW_DATA_QUERIES).join(', ')}`
    });
  }

  try {
    const data = await executeSparqlForCsv(RAW_DATA_QUERIES[category]);
    const csv = sparqlResultsToCsv(data);
    const filename = `ellas_${category}_${new Date().toISOString().slice(0, 10)}.csv`;

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send('\uFEFF' + csv); // BOM para UTF-8 no Excel
  } catch (error) {
    console.error('Erro ao gerar dados brutos:', error.message);
    res.status(502).json({ error: 'Falha ao obter dados do GraphDB.', details: error.message });
  }
}

module.exports = { rawDataDownload };
