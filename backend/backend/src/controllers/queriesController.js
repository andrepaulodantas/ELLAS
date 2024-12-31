const axios = require('axios');

const graphDBEndpoint = 'http://44.212.115.153:7200/repositories/EllasV2';
const username = 'integracao';
const password = 'Ellas@integration';

// Function to execute SPARQL queries
async function executeSparqlQuery(sparqlQuery) {
  const auth = Buffer.from(`${username}:${password}`).toString('base64');
  try {
    const response = await axios.post(
      graphDBEndpoint,
      `query=${encodeURIComponent(sparqlQuery)}`,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${auth}`
        }
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(`Error executing SPARQL query: ${error.message}`);
  }
}

// Example of query function
async function queryInitiativesInBrazil(req, res) {
  const sparqlQuery = `
    PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#> 
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> 
    SELECT ?initiativeName ?countryName 
    WHERE { 
      ?initiative a Ellas:Initiative. 
      ?initiative rdfs:label ?initiativeName. 
      ?initiative Ellas:created_in ?country. 
      ?country rdfs:label ?countryName. 
      FILTER(?countryName="Brazil"@en).
    }
  `;
  try {
    const data = await executeSparqlQuery(sparqlQuery);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function queryPoliciesCountries(req, res) {
  const sparqlQuery = `
    PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#> 
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> 
    SELECT ?policyName ?countryName 
    WHERE { 
      ?policy a Ellas:Policy.
      ?policy rdfs:label ?policyName.
      ?policy Ellas:created_in ?country.
      ?country rdfs:label ?countryName.
    }
  `;
  try {
    const data = await executeSparqlQuery(sparqlQuery);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function queryPolicyTypes(req, res) {
  const sparqlQuery = `
    PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#> 
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> 
    SELECT ?policyType  
    WHERE { 
      ?policy a Ellas:Policy.
      ?policy rdfs:label ?policyName.
      ?policy Ellas:policy_type ?policyType.
      ?policy Ellas:created_in ?country.
      ?country rdfs:label ?countryName.
    }
  `;
  try {
    const data = await executeSparqlQuery(sparqlQuery);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function queryPolicyPromotions(req, res) {
  const sparqlQuery = `
    PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#> 
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> 
    SELECT ?policyName ?policyResults 
    WHERE { 
      ?policy a Ellas:Policy.
      ?policy rdfs:label ?policyName.
      ?policy Ellas:policy_description ?policyResults.   
    }
  `;
  try {
    const data = await executeSparqlQuery(sparqlQuery);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function queryPoliciesByCountryAndDate(req, res) {
  const sparqlQuery = `
    PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#> 
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> 
    PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
    SELECT ?policyName ?start_date ?countryName 
    WHERE { 
      ?policy a Ellas:Policy.
      ?policy rdfs:label ?policyName.
      ?policy Ellas:created_in ?country.
      ?country rdfs:label ?countryName.
      ?policy Ellas:start_date ?start_date
      filter(xsd:integer(?start_date) > 2015)
      filter(regex(str(?countryName),"Peru") || regex(str(?countryName),"peru") ||
      regex(str(?countryName),"Brazil") || regex(str(?countryName),"brazil") ||
      regex(str(?countryName),"Bolivia") ||regex(str(?countryName),"bolivia"))    
    }
  `;
  try {
    const data = await executeSparqlQuery(sparqlQuery);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function queryInitiativeDataSource(req, res) {
  const sparqlQuery = `
    PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#> 
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> 
    SELECT ?initiativeName ?datasource 
    WHERE { 
      ?initiative a Ellas:Initiative.
      ?initiative rdfs:label ?initiativeName.
      ?initiative Ellas:initiative_data_source ?datasource
    }
  `;
  try {
    const data = await executeSparqlQuery(sparqlQuery);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function queryInitiativeSocialNetwork(req, res) {
  const sparqlQuery = `
    PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#> 
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> 
    SELECT ?initiativeName ?link 
    WHERE { 
      ?initiative a Ellas:Initiative.
      ?initiative rdfs:label ?initiativeName.
      ?initiative Ellas:initiative_socialmedia_link ?link
    }
  `;
  try {
    const data = await executeSparqlQuery(sparqlQuery);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function queryInitiativesOfProgram(req, res) {
  const sparqlQuery = `
    PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#> 
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> 
    SELECT ?initiativeName 
    WHERE { 
      ?initiative a Ellas:Program.
      ?initiative rdfs:label ?initiativeName
    }
  `;
  try {
    const data = await executeSparqlQuery(sparqlQuery);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function queryPublicPrivateInitiatives(req, res) {
  const sparqlQuery = `
    PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#> 
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> 
    SELECT ?initiativeName ?sector 
    WHERE { 
      ?initiative a Ellas:Program.
      ?initiative rdfs:label ?initiativeName.
      ?initiative Ellas:initiative_organization_sector ?sector
    }
  `;
  try {
    const data = await executeSparqlQuery(sparqlQuery);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function queryIndividualCoordinatedInitiatives(req, res) {
  const sparqlQuery = `
    PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#> 
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> 
    SELECT ?initiativeName ?coordinatorType 
    WHERE { 
      ?initiative a Ellas:Initiative.
      ?initiative rdfs:label ?initiativeName.
      ?initiative Ellas:initiative_coordinator_type ?coordinatorType
      FILTER(?coordinatorType = "Personal"@en)
    }
  `;
  try {
    const data = await executeSparqlQuery(sparqlQuery);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function queryInitiativeCoordinatorGender(req, res) {
  const sparqlQuery = `
    PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#> 
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> 
    SELECT ?initiativeName ?coordinatorGender 
    WHERE { 
      ?initiative a Ellas:Initiative.
      ?initiative rdfs:label ?initiativeName.
      ?initiative Ellas:initiative_coordinator_gender ?coordinatorGender  
    }
  `;
  try {
    const data = await executeSparqlQuery(sparqlQuery);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function queryInitiativeObjective(req, res) {
  const sparqlQuery = `
    PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#> 
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> 
    SELECT ?initiativeName ?objective 
    WHERE { 
      ?initiative a Ellas:Initiative.
      ?initiative rdfs:label ?initiativeName.
      ?initiative Ellas:initiative_objective ?objective
    }
  `;
  try {
    const data = await executeSparqlQuery(sparqlQuery);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function queryInitiativeFormat(req, res) {
  const sparqlQuery = `
    PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#> 
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> 
    SELECT ?initiativeName ?format 
    WHERE { 
      ?initiative a Ellas:Initiative.
      ?initiative rdfs:label ?initiativeName.
      ?initiative Ellas:initiative_format ?format
    }
  `;
  try {
    const data = await executeSparqlQuery(sparqlQuery);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function queryInitiativesForGirls(req, res) {
  const sparqlQuery = `
    PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#> 
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> 
    SELECT ?initiativeName ?targetAudienceAge 
    WHERE { 
      ?initiative a Ellas:Initiative.
      ?initiative rdfs:label ?initiativeName.
      ?initiative Ellas:focused_on ?targetAudience.
      ?targetAudience a Ellas:Target_Audience_Age.
      ?targetAudience rdfs:label ?targetAudienceAge.
      FILTER (regex(str(?targetAudienceAge), "teenagers") || regex(str(?targetAudienceAge), "Teenagers")
        || regex(str(?targetAudienceAge), "children") || regex(str(?targetAudienceAge), "Children"))
    }
  `;
  try {
    const data = await executeSparqlQuery(sparqlQuery);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function queryInitiativesForBlackWomen(req, res) {
  const sparqlQuery = `
    PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#> 
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> 
    SELECT ?initiativeName ?targetAudienceRace ?targetAudienceGender 
    WHERE { 
      ?initiative a Ellas:Initiative.
      ?initiative rdfs:label ?initiativeName.
      ?initiative Ellas:focused_on ?targetAudience.
      ?targetAudience a Ellas:Target_Audience_Race.
      ?targetAudience rdfs:label ?targetAudienceRace.
      ?initiative Ellas:focused_on ?targetAudienceG.
      ?targetAudienceG a Ellas:Target_Audience_Gender.
      ?targetAudienceG rdfs:label ?targetAudienceGender.
      FILTER (regex(str(?targetAudienceRace), "Black") || regex(str(?targetAudienceRace), "black"))
      FILTER (regex(str(?targetAudienceGender), "Feminine"))
    }
  `;
  try {
    const data = await executeSparqlQuery(sparqlQuery);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function querySchoolLevelInitiatives(req, res) {
  const sparqlQuery = `
    PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#> 
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> 
    SELECT ?initiativeName ?targetAudienceEducationalLevel 
    WHERE { 
      ?initiative a Ellas:Initiative.
      ?initiative rdfs:label ?initiativeName.
      ?initiative Ellas:focused_on ?targetAudience.
      ?targetAudience a Ellas:Target_Audience_EducationalLevel.
      ?targetAudience rdfs:label ?targetAudienceEducationalLevel.   
      FILTER (regex(str(?targetAudienceEducationalLevel), "Undergraduate") || regex(str(?targetAudienceEducationalLevel), "undergraduate"))
    }
  `;
  try {
    const data = await executeSparqlQuery(sparqlQuery);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  queryInitiativesInBrazil,
  queryPoliciesCountries,
  queryPolicyTypes,
  queryPolicyPromotions,
  queryPoliciesByCountryAndDate,
  queryInitiativeDataSource,
  queryInitiativeSocialNetwork,
  queryInitiativesOfProgram,
  queryPublicPrivateInitiatives,
  queryIndividualCoordinatedInitiatives,
  queryInitiativeCoordinatorGender,
  queryInitiativeObjective,
  queryInitiativeFormat,
  queryInitiativesForGirls,
  queryInitiativesForBlackWomen,
  querySchoolLevelInitiatives,
};
