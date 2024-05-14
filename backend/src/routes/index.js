// src/routes/index.js
const express = require('express');
const pessoas = require('./pessoasRoute');
const usuarios = require('./usuariosRoute');
const neo4j = require('./neo4jRoute'); // Adicionar a rota do Neo4j

module.exports = (app) => {
  app.use(express.json());
  app.use(pessoas);
  app.use('/api', usuarios);
  app.use('/api', neo4j); // Adicionar a rota do Neo4j com o prefixo /api
};
