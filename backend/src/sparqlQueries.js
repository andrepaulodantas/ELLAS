const axios = require('axios');
const fs = require('fs');
const path = require('path');

const username = 'integracao';
const password = 'Ellas@integration';
const url = 'http://44.212.115.153:7200/repositories/EllasV2';

async function executeSparqlQuery(query) {
  try {
    const response = await axios.get(url, {
      headers: {
        'Accept': 'application/sparql-results+json'
      },
      auth: {
        username: username,
        password: password
      },
      params: {
        query: query
      }
    });

    if (response.status === 200) {
      const data = response.data;

      // Salvando os resultados em um arquivo JSON no diretório do projeto
      const filePath = path.join(__dirname, 'resultados.json');
      fs.writeFileSync(filePath, JSON.stringify(data, null, 4), 'utf-8');
      console.log("Consulta realizada e resultados salvos em 'resultados.json'");

      return data.results.bindings;
    } else {
      throw new Error(`Erro ao realizar a consulta: ${response.status}`);
    }
  } catch (error) {
    console.error('Error executing SPARQL query:', error.message);
    throw new Error(`Error executing SPARQL query: ${error.message}`);
  }
}

module.exports = { executeSparqlQuery };
