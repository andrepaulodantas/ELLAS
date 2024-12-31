const neo4j = require('../neo4j');

// Consulta: In which countries the policy was applied?
async function queryPoliciesCountries(req, res) {
  const session = neo4j.session();
  const query = `
    MATCH (policy:Person)
    RETURN policy.Título_da_Publicação AS policyName, policy.COUNTRY AS countryName
  `;

  try {
    const result = await session.run(query);
    const policies = result.records.map(record => ({
      policyName: record.get('policyName'),
      countryName: record.get('countryName')
    }));
    res.json(policies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    await session.close();
  }
}

// Consulta: What types of gender policies/processes/practices exist in Latin America?
async function queryPolicyTypes(req, res) {
  const session = neo4j.session();
  const query = `
    MATCH (policy:Person)
    RETURN DISTINCT policy.Título_da_Publicação AS policyName, policy.Tipo_de_Política AS policyType, policy.COUNTRY AS countryName
  `;

  try {
    const result = await session.run(query);
    const policyTypes = result.records.map(record => ({
      policyName: record.get('policyName'),
      policyType: record.get('policyType'),
      countryName: record.get('countryName')
    }));
    res.json(policyTypes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    await session.close();
  }
}

// Consulta: How policies identified/analyzed are promoting women's participation in STEM fields?
async function queryPolicyPromotions(req, res) {
  const session = neo4j.session();
  const query = `
    MATCH (policy:Person)
    RETURN policy.Título_da_Publicação AS policyName, policy.Results AS policyResults
  `;

  try {
    const result = await session.run(query);
    const policies = result.records.map(record => ({
      policyName: record.get('policyName'),
      policyResults: record.get('policyResults')
    }));
    res.json(policies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    await session.close();
  }
}

// Consulta: What types of gender policies/processes/practices have been implemented in Bolivia, Brazil and Peru since 2015?
async function queryPoliciesByCountryAndDate(req, res) {
  const session = neo4j.session();
  const query = `
    MATCH (policy:Person)
    WHERE toInteger(policy.Data_Início) > 2015 AND 
          (policy.COUNTRY = 'Peru' OR policy.COUNTRY = 'Brazil' OR policy.COUNTRY = 'Bolivia')
    RETURN policy.Título_da_Publicação AS policyName, policy.Data_Início AS startDate, policy.COUNTRY AS countryName
  `;

  try {
    const result = await session.run(query);
    const policies = result.records.map(record => ({
      policyName: record.get('policyName'),
      startDate: record.get('startDate'),
      countryName: record.get('countryName')
    }));
    res.json(policies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    await session.close();
  }
}

// Adicione outras funções de consulta aqui...

module.exports = {
  queryPoliciesCountries,
  queryPolicyTypes,
  queryPolicyPromotions,
  queryPoliciesByCountryAndDate,
  // Exporte outras funções de consulta aqui...
};

