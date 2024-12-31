const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const routes = require('./routes');

const app = express();

// Configuração do CORS
const corsOptions = {
  origin: 'http://localhost:3000', // Substitua com o domínio do seu frontend
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use('/api', routes);

module.exports = app;
