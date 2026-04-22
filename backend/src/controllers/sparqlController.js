const axios = require('axios');

const graphDBEndpoint = process.env.GRAPHDB_ENDPOINT || 'http://44.212.115.153:7200/repositories/EllasV2';
const username = process.env.GRAPHDB_USER || 'integracao';
const password = process.env.GRAPHDB_PASSWORD;

/**
 * Proxy genérico para consultas SPARQL.
 * O frontend envia a query no body; as credenciais ficam apenas no servidor.
 */
async function sparqlProxy(req, res) {
  const query = req.body.query || req.query.query;

  if (!query) {
    return res.status(400).json({ error: 'Parâmetro "query" é obrigatório.' });
  }

  if (!password) {
    return res.status(500).json({ error: 'Credenciais do GraphDB não configuradas no servidor.' });
  }

  const auth = Buffer.from(`${username}:${password}`).toString('base64');

  try {
    const params = new URLSearchParams();
    params.append('query', query);

    const response = await axios.post(graphDBEndpoint, params.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/sparql-results+json',
        'Authorization': `Basic ${auth}`,
      },
      timeout: 30000,
    });

    return res.json(response.data);
  } catch (error) {
    console.error('Erro ao executar SPARQL via proxy:', error.message);
    return res.status(502).json({
      error: 'Falha ao conectar com o GraphDB.',
      details: error.message,
    });
  }
}

module.exports = { sparqlProxy };
