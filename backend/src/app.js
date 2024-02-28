const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const config = require('./config/config');
const routes = require('./routes/index');

app.use(cors());

routes (app);


module.exports = app;
