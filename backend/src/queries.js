const neo4j = require('./neo4j');

async function customQuery() {
  const session = neo4j.session();
  const query = `
    MATCH (n:Person)
    RETURN n.name AS name, n.age AS age
  `;

  try {
    const result = await session.run(query);
    return result.records.map(record => ({
      name: record.get('name'),
      age: record.get('age')
    }));
  } finally {
    await session.close();
  }
}

module.exports = {
  customQuery
};
