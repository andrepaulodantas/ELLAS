const neo4j = require('../neo4j');

async function getPersons(req, res) {
  const session = neo4j.session();
  const query = `
    MATCH (p:Person)
    RETURN p
  `;

  try {
    const result = await session.run(query);
    const persons = result.records.map(record => record.get('p').properties);
    res.json(persons);
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    await session.close();
  }
}

module.exports = {
  getPersons
};
