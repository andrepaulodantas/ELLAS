const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const routes = require('./routes/index');
const config = require('./config/config');

const app = express();

app.use(cors());
app.use(bodyParser.json());

routes(app);

module.exports = app;
