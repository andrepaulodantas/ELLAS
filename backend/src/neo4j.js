// src/neo4j.js
const neo4j = require('neo4j-driver');

const driver = neo4j.driver(
  'bolt://localhost:7687',
  neo4j.auth.basic('neo4j', 'ellas2024')
);

const session = driver.session();

const closeConnection = async () => {
  await session.close();
  await driver.close();
};

module.exports = { session, closeConnection };
