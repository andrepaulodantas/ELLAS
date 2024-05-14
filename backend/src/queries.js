// src/queries.js
const { session } = require('./neo4j');

const getAllPersons = async () => {
  const result = await session.run('MATCH (p:Person) RETURN p');
  console.log("Result records:", result.records);
  return result.records.map(record => {
    const node = record.get('p');
    console.log("Node properties:", node.properties);
    return node.properties;
  });
};

const getPersonByName = async (name) => {
  const result = await session.run('MATCH (p:Person {name: $name}) RETURN p', { name });
  return result.records.map(record => record.get('p').properties);
};

module.exports = { getAllPersons, getPersonByName };
