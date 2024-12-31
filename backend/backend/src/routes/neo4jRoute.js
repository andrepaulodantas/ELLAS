const express = require('express');
const router = express.Router();
const neo4jController = require('../controllers/neo4jController');

router.get('/persons', neo4jController.getPersons);

module.exports = router;
