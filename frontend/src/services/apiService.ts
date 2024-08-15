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

// Consultas relacionadas às Políticas (Activity 2)

// Em quais países a política foi aplicada?
export const fetchPoliciesAppliedInCountries = async () => {
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
  return await fetchQuery(query);
};

// Quais tipos de políticas/processos/práticas de gênero existem na América Latina?
export const fetchPolicyTypesInLatinAmerica = (query?: string) => {
  const defaultQuery = `
    PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    SELECT ?policyType WHERE {
      ?policy a Ellas:Policy.
      ?policy rdfs:label ?policyName.
      ?policy Ellas:policy_type ?policyType.
      ?policy Ellas:created_in ?country.
      ?country rdfs:label ?countryName.
    }
  `;
  return fetchQuery(query || defaultQuery);
};

// Como as políticas identificadas/analisadas estão promovendo a participação das mulheres em STEM?
export const fetchPoliciesPromotingWomenInSTEM = (query?: string) => {
  const defaultQuery = `
    PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    SELECT ?policyName ?policyResults WHERE {
      ?policy a Ellas:Policy.
      ?policy rdfs:label ?policyName.
      ?policy Ellas:policy_description ?policyResults.
    }
  `;
  return fetchQuery(query || defaultQuery);
};

// Quais tipos de políticas/processos/práticas de gênero foram implementadas na Bolívia, Brasil e Peru desde 2015?
export const fetchPoliciesImplementedInCountriesSince2015 = (query?: string) => {
  const defaultQuery = `
    PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
    SELECT ?policyName ?start_date ?countryName WHERE {
      ?policy a Ellas:Policy.
      ?policy rdfs:label ?policyName.
      ?policy Ellas:created_in ?country.
      ?country rdfs:label ?countryName.
      ?policy Ellas:start_date ?start_date.
      FILTER(xsd:integer(?start_date) > 2015).
      FILTER(
        regex(str(?countryName),"Peru") || regex(str(?countryName),"peru") ||
        regex(str(?countryName),"Brazil") || regex(str(?countryName),"brazil") ||
        regex(str(?countryName),"Bolivia") || regex(str(?countryName),"bolivia")
      ).
    }
  `;
  return fetchQuery(query || defaultQuery);
};

// Consultas relacionadas às Iniciativas (Activity 3)

// Quais e quantas iniciativas são realizadas no Brasil?
export const fetchInitiativesByCountry = (countryName: string) => {
  const defaultQuery = `
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
  return fetchQuery(defaultQuery);
};

// Quais fontes de dados são usadas para a iniciativa?
export const fetchDataSourcesForInitiatives = (query?: string) => {
  const defaultQuery = `
    PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    SELECT ?initiativeName ?datasource WHERE {
      ?initiative a Ellas:Initiative.
      ?initiative rdfs:label ?initiativeName.
      ?initiative Ellas:initiative_data_source ?datasource.
    }
  `;
  return fetchQuery(query || defaultQuery);
};

// Quais são as redes sociais da iniciativa?
export const fetchSocialNetworksForInitiatives = (query?: string) => {
  const defaultQuery = `
    PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    SELECT ?initiativeName ?link WHERE {
      ?initiative a Ellas:Initiative.
      ?initiative rdfs:label ?initiativeName.
      ?initiative Ellas:initiative_socialmedia_link ?link.
    }
  `;
  return fetchQuery(query || defaultQuery);
};

// Quantas iniciativas são de programa?
export const fetchProgramInitiatives = (query?: string) => {
  const defaultQuery = `
    PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    SELECT ?initiativeName WHERE {
      ?initiative a Ellas:Program.
      ?initiative rdfs:label ?initiativeName.
    }
  `;
  return fetchQuery(query || defaultQuery);
};

// As iniciativas são públicas ou privadas?
export const fetchPublicPrivateInitiatives = (query?: string) => {
  const defaultQuery = `
    PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    SELECT ?initiativeName ?sector WHERE {
      ?initiative a Ellas:Program.
      ?initiative rdfs:label ?initiativeName.
      ?initiative Ellas:initiative_organization_sector ?sector.
    }
  `;
  return fetchQuery(query || defaultQuery);
};

// Quantas iniciativas são coordenadas por indivíduos?
export const fetchIndividualCoordinatedInitiatives = (query?: string) => {
  const defaultQuery = `
    PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    SELECT ?initiativeName ?coordinatorType WHERE {
      ?initiative a Ellas:Initiative.
      ?initiative rdfs:label ?initiativeName.
      ?initiative Ellas:initiative_coordinator_type ?coordinatorType.
      FILTER(?coordinatorType = "Personal"@en).
    }
  `;
  return fetchQuery(query || defaultQuery);
};

// Qual é o gênero social das pessoas que são responsáveis pelas iniciativas?
export const fetchCoordinatorGenderForInitiatives = (query?: string) => {
  const defaultQuery = `
    PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    SELECT ?initiativeName ?coordinatorGender WHERE {
      ?initiative a Ellas:Initiative.
      ?initiative rdfs:label ?initiativeName.
      ?initiative Ellas:initiative_coordinator_gender ?coordinatorGender.
    }
  `;
  return fetchQuery(query || defaultQuery);
};

// Qual é o objetivo da iniciativa?
export const fetchInitiativeObjectives = (query?: string) => {
  const defaultQuery = `
    PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    SELECT ?initiativeName ?objective WHERE {
      ?initiative a Ellas:Initiative.
      ?initiative rdfs:label ?initiativeName.
      ?initiative Ellas:initiative_objective ?objective.
    }
  `;
  return fetchQuery(query || defaultQuery);
};

// Qual modalidade de iniciativa é usada para as ações/atividades?
export const fetchInitiativeFormats = (query?: string) => {
  const defaultQuery = `
    PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    SELECT ?initiativeName ?format WHERE {
      ?initiative a Ellas:Initiative.
      ?initiative rdfs:label ?initiativeName.
      ?initiative Ellas:initiative_format ?format.
    }
  `;
  return fetchQuery(query || defaultQuery);
};

// Quais iniciativas atendem meninas ou adolescentes?
export const fetchInitiativesForGirlsOrAdolescents = (query?: string) => {
  const defaultQuery = `
    PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    SELECT ?initiativeName ?targetAudienceAge WHERE {
      ?initiative a Ellas:Initiative.
      ?initiative rdfs:label ?initiativeName.
      ?initiative Ellas:focused_on ?targetAudience.
      ?targetAudience a Ellas:Target_Audience_Age.
      ?targetAudience rdfs:label ?targetAudienceAge.
      FILTER(
        regex(str(?targetAudienceAge), "teenagers") || regex(str(?targetAudienceAge), "Teenagers") ||
        regex(str(?targetAudienceAge), "children") || regex(str(?targetAudienceAge), "Children")
      ).
    }
  `;
  return fetchQuery(query || defaultQuery);
};

// Qual é o gênero social do público-alvo atendido pela iniciativa?
export const fetchTargetAudienceGenderForInitiatives = (query?: string) => {
  const defaultQuery = `
    PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    SELECT ?initiativeName ?targetAudienceGender WHERE {
      ?initiative a Ellas:Initiative.
      ?initiative rdfs:label ?initiativeName.
      ?initiative Ellas:focused_on ?targetAudience.
      ?targetAudience a Ellas:Target_Audience_Gender.
      ?targetAudience rdfs:label ?targetAudienceGender.
    }
  `;
  return fetchQuery(query || defaultQuery);
};

// Quais iniciativas atendem mulheres negras?
export const fetchInitiativesForBlackWomen = (query?: string) => {
  const defaultQuery = `
    PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    SELECT ?initiativeName ?targetAudienceRace ?targetAudienceGender WHERE {
      ?initiative a Ellas:Initiative.
      ?initiative rdfs:label ?initiativeName.
      ?initiative Ellas:focused_on ?targetAudience.
      ?targetAudience a Ellas:Target_Audience_Race.
      ?targetAudience rdfs:label ?targetAudienceRace.
      ?initiative Ellas:focused_on ?targetAudienceG.
      ?targetAudienceG a Ellas:Target_Audience_Gender.
      ?targetAudienceG rdfs:label ?targetAudienceGender.
      FILTER(
        regex(str(?targetAudienceRace), "Black") || regex(str(?targetAudienceRace), "black")
      ).
      FILTER( regex(str(?targetAudienceGender), "Feminine")).
    }
  `;
  return fetchQuery(query || defaultQuery);
};

// Quais iniciativas estão sendo desenvolvidas em um determinado nível escolar?
export const fetchInitiativesByEducationalLevel = (query?: string) => {
  const defaultQuery = `
    PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    SELECT ?initiativeName ?targetAudienceEducationalLevel WHERE {
      ?initiative a Ellas:Initiative.
      ?initiative rdfs:label ?initiativeName.
      ?initiative Ellas:focused_on ?targetAudience.
      ?targetAudience a Ellas:Target_Audience_EducationalLevel.
      ?targetAudience rdfs:label ?targetAudienceEducationalLevel.
      FILTER(
        regex(str(?targetAudienceEducationalLevel), "Undergraduate") || regex(str(?targetAudienceEducationalLevel), "undergraduate")
      ).
    }
  `;
  return fetchQuery(query || defaultQuery);
};

// Quais iniciativas atendem a determinados grupos vulneráveis?
export const fetchInitiativesForVulnerableGroups = (query?: string) => {
  const defaultQuery = `
    PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    SELECT ?initiativeName ?targetAudienceVulnerable WHERE {
      ?initiative a Ellas:Initiative.
      ?initiative rdfs:label ?initiativeName.
      ?initiative Ellas:focused_on ?targetAudience.
      ?targetAudience a Ellas:Target_Audience_VulnerableGroups.
      ?targetAudience rdfs:label ?targetAudienceVulnerable.
      FILTER( regex(str(?targetAudienceVulnerable), "disabilities") ).
    }
  `;
  return fetchQuery(query || defaultQuery);
};

// As iniciativas envolvem a comunidade escolar?
export const fetchSchoolCommunityInvolvementInInitiatives = (query?: string) => {
  const defaultQuery = `
    PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    SELECT ?initiativeName ?targetAudienceStakeholders WHERE {
      ?initiative a Ellas:Initiative.
      ?initiative rdfs:label ?initiativeName.
      ?initiative Ellas:focused_on ?targetAudience.
      ?targetAudience a Ellas:Target_Audience_Stakeholders.
      ?targetAudience rdfs:label ?targetAudienceStakeholders.
      FILTER( regex(str(?targetAudienceStakeholders), "School") ).
    }
  `;
  return fetchQuery(query || defaultQuery);
};

// Quais e quantas iniciativas são realizadas em uma determinada cidade?
export const fetchInitiativesByCity = (query?: string) => {
  const defaultQuery = `
    PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    SELECT ?initiativeName ?cityName WHERE {
      ?initiative a Ellas:Initiative.
      ?initiative rdfs:label ?initiativeName.
      ?initiative Ellas:located_in ?city.
      ?city a Ellas:City.
      ?city rdfs:label ?cityName.
      FILTER( ?cityName= "Curitiba"@en ).
    }
  `;
  return fetchQuery(query || defaultQuery);
};

// Quais e quantas iniciativas são realizadas em um determinado estado?
export const fetchInitiativesByState = (query?: string) => {
  const defaultQuery = `
    PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    SELECT ?initiativeName ?stateName WHERE {
      ?initiative a Ellas:Initiative.
      ?initiative rdfs:label ?initiativeName.
      ?initiative Ellas:located_in ?state.
      ?state a Ellas:State.
      ?state rdfs:label ?stateName.
      FILTER( ?stateName= "Paraná"@en ).
    }
  `;
  return fetchQuery(query || defaultQuery);
};

// Quais e quantas iniciativas são realizadas em uma determinada área?
export const fetchInitiativesByArea = (query?: string) => {
  const defaultQuery = `
    PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    SELECT ?initiativeName ?areaName WHERE {
      ?initiative a Ellas:Initiative.
      ?initiative rdfs:label ?initiativeName.
      ?initiative Ellas:located_in ?area.
      ?area a Ellas:Area.
      ?area rdfs:label ?areaName.
      FILTER( ?areaName= "Urban"@en ).
    }
  `;
  return fetchQuery(query || defaultQuery);
};

// Quais e quantas iniciativas são realizadas em uma determinada região?
export const fetchInitiativesByRegion = (query?: string) => {
  const defaultQuery = `
    PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    SELECT ?initiativeName ?regionName WHERE {
      ?initiative a Ellas:Initiative.
      ?initiative rdfs:label ?initiativeName.
      ?initiative Ellas:located_in ?region.
      ?region a Ellas:Region.
      ?region rdfs:label ?regionName.
      FILTER( regex (str(?regionName),"Coast") ).
    }
  `;
  return fetchQuery(query || defaultQuery);
};

// Quais e quantas iniciativas têm determinado alcance?
export const fetchInitiativesByReach = (query?: string) => {
  const defaultQuery = `
    PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    SELECT ?initiativeName ?reach WHERE {
      ?initiative a Ellas:Initiative.
      ?initiative rdfs:label ?initiativeName.
      ?initiative Ellas:initiative_reach ?reach.
      FILTER(?reach= "Local"@en).
    }
  `;
  return fetchQuery(query || defaultQuery);
};

// As iniciativas são financiadas?
export const fetchFundedInitiatives = (query?: string) => {
  const defaultQuery = `
    PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    SELECT ?initiativeName ?organizationName WHERE {
      ?initiative a Ellas:Initiative.
      ?initiative rdfs:label ?initiativeName.
      ?initiative Ellas:funded_by ?organization.
      ?organization rdfs:label ?organizationName.
    }
  `;
  return fetchQuery(query || defaultQuery);
};

// Qual é o setor da(s) organização(ões) que financia(m) a iniciativa?
export const fetchInitiativeFundingSectors = (query?: string) => {
  const defaultQuery = `
    PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    SELECT ?initiativeName ?sector WHERE {
      ?initiative a Ellas:Initiative.
      ?initiative rdfs:label ?initiativeName.
      ?initiative Ellas:funded_by ?organization.
      ?organization Ellas:organization_sector ?sector.
    }
  `;
  return fetchQuery(query || defaultQuery);
};

// Quais iniciativas estão ativas?
export const fetchActiveInitiatives = (query?: string) => {
  const defaultQuery = `
    PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    SELECT ?initiativeName ?status WHERE {
      ?initiative a Ellas:Initiative.
      ?initiative rdfs:label ?initiativeName.
      ?initiative Ellas:initiative_status ?status.
      FILTER(?status="Active"@en).
    }
  `;
  return fetchQuery(query || defaultQuery);
};

// As iniciativas já foram implementadas ou ainda estão em fase de design?
export const fetchInitiativesByPhase = (query?: string) => {
  const defaultQuery = `
    PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    SELECT ?initiativeName ?startDate WHERE {
      ?initiative a Ellas:Initiative.
      ?initiative rdfs:label ?initiativeName.
      ?initiative Ellas:start_date ?startDate.
    }
  `;
  return fetchQuery(query || defaultQuery);
};

// Quais iniciativas já foram concluídas?
export const fetchFinishedInitiatives = (query?: string) => {
  const defaultQuery = `
    PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    SELECT ?initiativeName ?finishDate WHERE {
      ?initiative a Ellas:Initiative.
      ?initiative rdfs:label ?initiativeName.
      ?initiative Ellas:finish_date ?finishDate.
    }
  `;
  return fetchQuery(query || defaultQuery);
};

// Qual é o site (URL) da iniciativa?
export const fetchInitiativeWebsites = (query?: string) => {
  const defaultQuery = `
    PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    SELECT ?initiativeName ?website WHERE {
      ?initiative a Ellas:Initiative.
      ?initiative rdfs:label ?initiativeName.
      ?initiative Ellas:initiative_website ?website.
    }
  `;
  return fetchQuery(query || defaultQuery);
};

// Quantas iniciativas fazem parte de comunidades?
export const fetchCommunityInitiatives = (query?: string) => {
  const defaultQuery = `
    PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    SELECT ?initiativeName ?communityName WHERE {
      ?initiative a Ellas:Initiative.
      ?initiative rdfs:label ?initiativeName.
      ?initiative Ellas:initiative_community_name ?communityName.
    }
  `;
  return fetchQuery(query || defaultQuery);
};

// Atualize o mapeamento de perguntas para funções de busca
export const questionFunctions: { [key: string]: any } = {
  "Which/How many initiatives are carried out in Brazil?": fetchInitiativesByCountry,
  "What data source are used for initiative?": fetchDataSourcesForInitiatives,
  "What is the initiative's social network(s)?": fetchSocialNetworksForInitiatives,
  "How many initiatives are of program?": fetchProgramInitiatives,
  "Are these initiatives public or private?": fetchPublicPrivateInitiatives,
  "How many initiatives are coordinated by individuals?": fetchIndividualCoordinatedInitiatives,
  "What is the social gender of the people who are responsible for the initiatives?": fetchCoordinatorGenderForInitiatives,
  "What is the OBJECTIVE of the initiative?": fetchInitiativeObjectives,
  "Which initiative modality are used for the actives/actions?": fetchInitiativeFormats,
  "What initiatives serve girls or adolescents?": fetchInitiativesForGirlsOrAdolescents,
  "What is the social gender of the target audience served by the initiative?": fetchTargetAudienceGenderForInitiatives,
  "What initiatives serve black women?": fetchInitiativesForBlackWomen,
  "What initiatives are being developed <at a given school level>?": fetchInitiativesByEducationalLevel,
  "What initiatives serve <a certain vulnerable group>?": fetchInitiativesForVulnerableGroups,
  "Do the initiatives involve the School community?": fetchSchoolCommunityInvolvementInInitiatives,
  "Which/How many initiatives are carried out <in a given city>?": fetchInitiativesByCity,
  "What/How many initiatives are carried out <in a given state>?": fetchInitiativesByState,
  "What/How many initiatives are carried out <in a given area>?": fetchInitiativesByArea,
  "What/How many initiatives are carried out <in a given region>?": fetchInitiativesByRegion,
  "Which/How many initiatives have <a given reach>?": fetchInitiativesByReach,
  "Are the initiatives funded?": fetchFundedInitiatives,
  "What is the sector of the organization(s) that finance(s) the initiative?": fetchInitiativeFundingSectors,
  "What initiatives are active?": fetchActiveInitiatives,
  "Have the initiatives already been implemented or are they still in the design phase?": fetchInitiativesByPhase,
  "Which initiatives are already finished?": fetchFinishedInitiatives,
  "What is the initiative's website (URL)?": fetchInitiativeWebsites,
  "How many initiatives are part of communities?": fetchCommunityInitiatives,
  "In which countries the policy was applied?": fetchPoliciesAppliedInCountries,
  "What types of gender policies/processes/practices exist in Latin America?": fetchPolicyTypesInLatinAmerica,
  "How policies identified/analyzed are promoting women's participation in STEM fields?": fetchPoliciesPromotingWomenInSTEM,
  "What types of gender policies/processes/practices have been implemented in Bolivia, Brazil and Peru since 2015?": fetchPoliciesImplementedInCountriesSince2015,
};
