const express = require('express');
const pessoas = require('./pessoasRoute');
const usuarios = require('./usuariosRoute'); // Adicionado

module.exports = (app) => {
  app.use(express.json());
  app.use(pessoas);
  app.use('/api', usuarios); // Adicionado o prefixo /api
};
