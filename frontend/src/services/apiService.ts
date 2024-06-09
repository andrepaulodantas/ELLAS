import axios from 'axios';

const BASE_URL = 'http://44.212.115.153:7200/repositories/EllasV2';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/sparql-query',
    'Accept': 'application/sparql-results+json',
    'Authorization': 'Basic ' + btoa('integracao:Ellas@integration'), // Autenticação básica
  },
  withCredentials: true, // Incluir credenciais
});

const fetchQuery = async (query: string) => {
  try {
    const response = await axiosInstance.post('', query);
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

export const fetchInitiatives = () => {
  const query = `
    PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    SELECT ?initiativeName ?countryName WHERE {
      ?initiative a Ellas:Initiative.
      ?initiative rdfs:label ?initiativeName.
      ?initiative Ellas:created_in ?country.
      ?country rdfs:label ?countryName.
      FILTER(?countryName="Brazil"@en).
    }
  `;
  return fetchQuery(query);
};

export const fetchPolicies = () => {
  const query = `
    PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    SELECT ?policyName ?countryName WHERE {
      ?policy a Ellas:Policy.
      ?policy rdfs:label ?policyName.
      ?policy Ellas:created_in ?country.
      ?country rdfs:label ?countryName.
    }
  `;
  return fetchQuery(query);
};

export const fetchPolicyTypes = () => {
  const query = `
    PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    SELECT DISTINCT ?policyType WHERE {
      ?policy a Ellas:Policy.
      ?policy Ellas:policy_type ?policyType.
    }
  `;
  return fetchQuery(query);
};

export const fetchPolicyResults = () => {
  const query = `
    PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    SELECT ?policyName ?policyResults WHERE {
      ?policy a Ellas:Policy.
      ?policy rdfs:label ?policyName.
      ?policy Ellas:policy_description ?policyResults.
    }
  `;
  return fetchQuery(query);
};

export const fetchPoliciesByCountryAndDate = () => {
  const query = `
    PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
    SELECT ?policyName ?start_date ?countryName WHERE {
      ?policy a Ellas:Policy.
      ?policy rdfs:label ?policyName.
      ?policy Ellas:created_in ?country.
      ?country rdfs:label ?countryName.
      ?policy Ellas:start_date ?start_date.
      FILTER(xsd:integer(?start_date) > 2015)
      FILTER(
        regex(str(?countryName), "Peru", "i") || 
        regex(str(?countryName), "Brazil", "i") || 
        regex(str(?countryName), "Bolivia", "i")
      )
    }
  `;
  return fetchQuery(query);
};
