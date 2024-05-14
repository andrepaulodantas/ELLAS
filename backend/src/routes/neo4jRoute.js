// src/routes/neo4jRoute.js
const { Router } = require('express');
const { getAllPersons, getPersonByName } = require('../queries');

const router = Router();

router.get('/neo4j/persons', async (req, res) => {
  try {
    const persons = await getAllPersons();
    res.json(persons);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/neo4j/person/:name', async (req, res) => {
  try {
    const { name } = req.params;
    const person = await getPersonByName(name);
    res.json(person);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
