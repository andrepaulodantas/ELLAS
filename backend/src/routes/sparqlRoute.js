const express = require('express');
const router = express.Router();
const { sparqlProxy } = require('../controllers/sparqlController');

// POST /api/sparql  — corpo: { query: "SELECT ..." }
router.post('/', sparqlProxy);
// GET /api/sparql?query=...  — alternativa via query string
router.get('/', sparqlProxy);

module.exports = router;
