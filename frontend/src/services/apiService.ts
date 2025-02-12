import axios from "axios";

const BASE_URL = "http://200.17.60.189:7200/repositories/EllasV2";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/sparql-query",
    Accept: "application/sparql-results+json",
    Authorization: "Basic " + btoa("integracao:Ellas@integration"), // Autenticação básica
  },
  withCredentials: true, // Incluir credenciais
});

const fetchQuery = async (query: string) => {
  try {
    const response = await axiosInstance.post("", query);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

// Consultas relacionadas às Políticas (Activity 2)

// Em quais países a política foi aplicada?
export const fetchPoliciesAppliedInCountries = async () => {
  const query = `
  PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>
  PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    select ?policyName ?countryName where {
      ?policy a Ellas:Policy.
      ?policy rdfs:label ?policyName.
      ?policy Ellas:created_in ?country.
      ?country rdfs:label ?countryName.}
`;
  return await fetchQuery(query);
};

// Quais tipos de políticas/processos/práticas de gênero existem na América Latina?
export const fetchPolicyTypesInLatinAmerica = (query?: string) => {
  const defaultQuery = `
    PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
      select  ?policyName ?countryName ?policyType where {
      ?policy a Ellas:Policy.
      ?policy rdfs:label ?policyName.
      ?policy Ellas:policy_type ?policyType.
      ?policy Ellas:created_in ?country.
      ?country rdfs:label ?countryName.}
  `;
  return fetchQuery(query || defaultQuery);
};

// Como as políticas identificadas/analisadas estão promovendo a participação das mulheres em STEM?
export const fetchPoliciesPromotingWomenInSTEM = (query?: string) => {
  const defaultQuery = `
  PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>
  PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    select ?policyName ?countryName ?policyResults where {
    ?policy a Ellas:Policy.
    ?policy rdfs:label ?policyName.
    ?policy Ellas:policy_description ?policyResults.
    ?policy Ellas:created_in ?country.
    ?country rdfs:label ?countryName.}
  `;
  return fetchQuery(query || defaultQuery);
};

// Quais tipos de políticas/processos/práticas de gênero foram implementadas na Bolívia, Brasil e Peru desde 2015?
export const fetchPoliciesImplementedInCountriesSince2015 = (
  query?: string
) => {
  const defaultQuery = `
    PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>

PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>

select ?policyName ?countryName ?start_date  where {

?policy a Ellas:Policy.

?policy rdfs:label ?policyName.

?policy Ellas:created_in ?country.

?country rdfs:label ?countryName.

?policy Ellas:start_date ?start_date

filter(xsd:integer(?start_date) > 2015)

filter(regex(str(?countryName),"Peru") || regex(str(?countryName),"peru") ||

regex(str(?countryName),"Brazil") || regex(str(?countryName),"brazil") ||

regex(str(?countryName),"Bolivia") ||regex(str(?countryName),"bolivia"))}
  `;
  return fetchQuery(query || defaultQuery);
};

// Consultas relacionadas às Iniciativas (Activity 3)

// Quais e quantas iniciativas são realizadas no Brasil?
// export const fetchInitiativesByCountry = (countryName, initiativeName, initiativeStatus, startDate, finishDate) => {
export const fetchInitiativesByCountry = (query?: string) => {
  const defaultQuery = `
    PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>

PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>

select ?policyName ?countryName ?start_date  where {

?policy a Ellas:Policy.

?policy rdfs:label ?policyName.

?policy Ellas:created_in ?country.

?country rdfs:label ?countryName.

?policy Ellas:start_date ?start_date

filter(xsd:integer(?start_date) > 2015)

filter(regex(str(?countryName),"Peru") || regex(str(?countryName),"peru") ||

regex(str(?countryName),"Brazil") || regex(str(?countryName),"brazil") ||

regex(str(?countryName),"Bolivia") ||regex(str(?countryName),"bolivia"))}
  `;
  return fetchQuery(defaultQuery);
};

// Quais fontes de dados são usadas para a iniciativa?
export const fetchDataSourcesForInitiatives = (query?: string) => {
  const defaultQuery = `
    PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>

PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

select ?initiativeName ?countryName ?datasource where {

?initiative a Ellas:Initiative.

?initiative rdfs:label ?initiativeName.

?initiative Ellas:initiative_data_source ?datasource.

?initiative Ellas:created_in ?country.

?country rdfs:label ?countryName.
 }
  `;
  return fetchQuery(query || defaultQuery);
};

// Quais são as redes sociais da iniciativa?
export const fetchSocialNetworksForInitiatives = (query?: string) => {
  const defaultQuery = `
    PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>

PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

select ?initiativeName ?countryName ?link where {

?initiative a Ellas:Initiative.

?initiative rdfs:label ?initiativeName.

?initiative Ellas:initiative_socialmedia_link ?link.

?initiative Ellas:created_in ?country.

?country rdfs:label ?countryName. }
  `;
  return fetchQuery(query || defaultQuery);
};

// Quantas iniciativas são de programa?
export const fetchProgramInitiatives = (query?: string) => {
  const defaultQuery = `
    PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>

PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

select ?initiativeName ?countryName where {

?initiative a Ellas:Program.

?initiative rdfs:label ?initiativeName. 

?initiative Ellas:created_in ?country.

?country rdfs:label ?countryName.}
  `;
  return fetchQuery(query || defaultQuery);
};

// As iniciativas são públicas ou privadas?
export const fetchPublicPrivateInitiatives = (query?: string) => {
  const defaultQuery = `
    PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>

PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

select ?initiativeName ?countryName ?sector where {

?initiative a Ellas:Program.

?initiative rdfs:label ?initiativeName.

?initiative Ellas:initiative_organization_sector ?sector.

?initiative Ellas:created_in ?country.

?country rdfs:label ?countryName. }
  `;
  return fetchQuery(query || defaultQuery);
};

// Quantas iniciativas são coordenadas por indivíduos?
export const fetchIndividualCoordinatedInitiatives = (query?: string) => {
  const defaultQuery = `
    PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>

PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

select ?initiativeName ?countryName ?coordinatorType where {

?initiative a Ellas:Initiative.

?initiative rdfs:label ?initiativeName.

?initiative Ellas:initiative_coordinator_type ?coordinatorType.

?initiative Ellas:created_in ?country.

?country rdfs:label ?countryName.

filter(?coordinatorType = "Personal"@en) }
  `;
  return fetchQuery(query || defaultQuery);
};

// Qual é o gênero social das pessoas que são responsáveis pelas iniciativas?
export const fetchCoordinatorGenderForInitiatives = (query?: string) => {
  const defaultQuery = `
    PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>

PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

select ?initiativeName ?countryName ?coordinatorGender where {

?initiative a Ellas:Initiative.

?initiative rdfs:label ?initiativeName.

?initiative Ellas:initiative_coordinator_gender ?coordinatorGender.

?initiative Ellas:created_in ?country.

?country rdfs:label ?countryName.
 }
  `;
  return fetchQuery(query || defaultQuery);
};

// Qual é o objetivo da iniciativa?
export const fetchInitiativeObjectives = (query?: string) => {
  const defaultQuery = `
    PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>

PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

select ?initiativeName ?countryName ?objective where {

?initiative a Ellas:Initiative.

?initiative rdfs:label ?initiativeName.

?initiative Ellas:initiative_objective ?objective.

?initiative Ellas:created_in ?country.

?country rdfs:label ?countryName. }
  `;
  return fetchQuery(query || defaultQuery);
};

// Qual modalidade de iniciativa é usada para as ações/atividades?
export const fetchInitiativeFormats = (query?: string) => {
  const defaultQuery = `
   PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>

PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

select ?initiativeName ?countryName ?format where {

?initiative a Ellas:Initiative.

?initiative rdfs:label ?initiativeName.

?initiative Ellas:initiative_format ?format.

?initiative Ellas:created_in ?country.

?country rdfs:label ?countryName.
 }
  `;
  return fetchQuery(query || defaultQuery);
};

// Quais iniciativas atendem meninas ou adolescentes?
export const fetchInitiativesForGirlsOrAdolescents = (query?: string) => {
  const defaultQuery = `
    PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>

PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

select ?initiativeName ?countryName ?targetAudienceAge where {

?initiative a Ellas:Initiative.

?initiative rdfs:label ?initiativeName.

?initiative Ellas:focused_on ?targetAudience.

?targetAudience a Ellas:Target_Audience_Age.

?targetAudience rdfs:label ?targetAudienceAge.

?initiative Ellas:created_in ?country.

?country rdfs:label ?countryName.

FILTER (regex(str(?targetAudienceAge), "teenagers")||regex(str(?targetAudienceAge), "Teenagers")

|| regex(str(?targetAudienceAge), "children") || regex(str(?targetAudienceAge), "Children")) }
  `;
  return fetchQuery(query || defaultQuery);
};

// Qual é o gênero social do público-alvo atendido pela iniciativa?
export const fetchTargetAudienceGenderForInitiatives = (query?: string) => {
  const defaultQuery = `
   PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>

PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

select ?initiativeName ?countryName ?targetAudienceGender where {

?initiative a Ellas:Initiative.

?initiative rdfs:label ?initiativeName.

?initiative Ellas:focused_on ?targetAudience.

?targetAudience a Ellas:Target_Audience_Gender.

?targetAudience rdfs:label ?targetAudienceGender.

?initiative Ellas:created_in ?country.

?country rdfs:label ?countryName.}
  `;
  return fetchQuery(query || defaultQuery);
};

// Quais iniciativas atendem mulheres negras?
export const fetchInitiativesForBlackWomen = (query?: string) => {
  const defaultQuery = `
    PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>

PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

select ?initiativeName ?countryName ?targetAudienceRace ?targetAudienceGender where {

?initiative a Ellas:Initiative.

?initiative rdfs:label ?initiativeName.

?initiative Ellas:focused_on ?targetAudience.

?targetAudience a Ellas:Target_Audience_Race.

?targetAudience rdfs:label ?targetAudienceRace.

?initiative Ellas:focused_on ?targetAudienceG.

?targetAudienceG a Ellas:Target_Audience_Gender.

?targetAudienceG rdfs:label ?targetAudienceGender.

?initiative Ellas:created_in ?country.

?country rdfs:label ?countryName.

filter( regex(str(?targetAudienceRace), "Black") || regex(str(?targetAudienceRace), "black")   )

filter( regex(str(?targetAudienceGender), "Feminine")) }
  `;
  return fetchQuery(query || defaultQuery);
};

// Quais iniciativas estão sendo desenvolvidas em um determinado nível escolar?
export const fetchInitiativesByEducationalLevel = (query?: string) => {
  const defaultQuery = `
    PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>

PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

select ?initiativeName ?countryName ?targetAudienceEducationalLevel where {

?initiative a Ellas:Initiative.

?initiative rdfs:label ?initiativeName.

?initiative Ellas:focused_on ?targetAudience.

?targetAudience a Ellas:Target_Audience_EducationalLevel.

?targetAudience rdfs:label ?targetAudienceEducationalLevel.

?initiative Ellas:created_in ?country.

?country rdfs:label ?countryName.

filter( regex(str(?targetAudienceEducationalLevel), "Undergraduate") || regex(str(?targetAudienceEducationalLevel), "undergraduate"))
}
  `;
  return fetchQuery(query || defaultQuery);
};

// Quais iniciativas atendem a determinados grupos vulneráveis?
export const fetchInitiativesForVulnerableGroups = (query?: string) => {
  const defaultQuery = `
    PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>

PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

select ?initiativeName ?countryName ?targetAudienceVulnerable where {

?initiative a Ellas:Initiative.

?initiative rdfs:label ?initiativeName.

?initiative Ellas:focused_on ?targetAudience.

?targetAudience a Ellas:Target_Audience_VulnerableGroups.

?targetAudience rdfs:label ?targetAudienceVulnerable.

?initiative Ellas:created_in ?country.

?country rdfs:label ?countryName.

filter( regex(str(?targetAudienceVulnerable), "disabilities") )
}
  `;
  return fetchQuery(query || defaultQuery);
};

// As iniciativas envolvem a comunidade escolar?
export const fetchSchoolCommunityInvolvementInInitiatives = (
  query?: string
) => {
  const defaultQuery = `
    PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>

PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

select ?initiativeName ?countryName ?targetAudienceStakeholders where {

?initiative a Ellas:Initiative.

?initiative rdfs:label ?initiativeName.

?initiative Ellas:focused_on ?targetAudience.

?targetAudience a Ellas:Target_Audience_Stakeholders.

?targetAudience rdfs:label ?targetAudienceStakeholders.

?initiative Ellas:created_in ?country.

?country rdfs:label ?countryName.

filter( regex(str(?targetAudienceStakeholders), "School") )}
  `;
  return fetchQuery(query || defaultQuery);
};

// Quais e quantas iniciativas são realizadas em uma determinada cidade?
export const fetchInitiativesByCity = (query?: string) => {
  const defaultQuery = `
    PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>

PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

select ?initiativeName ?countryName ?cityName where {

?initiative a Ellas:Initiative.

?initiative rdfs:label ?initiativeName.

?initiative Ellas:located_in ?city.

?city a Ellas:City.

?city rdfs:label ?cityName.

?initiative Ellas:created_in ?country.

?country rdfs:label ?countryName.

filter( ?cityName= "Curitiba"@en ) }
  `;
  return fetchQuery(query || defaultQuery);
};

// Quais e quantas iniciativas são realizadas em um determinado estado?
export const fetchInitiativesByState = (query?: string) => {
  const defaultQuery = `
    PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>

PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

select ?initiativeName ?countryName ?stateName where {

?initiative a Ellas:Initiative.

?initiative rdfs:label ?initiativeName.

?initiative Ellas:located_in ?state.

?state a Ellas:State.

?state rdfs:label ?stateName.

?initiative Ellas:created_in ?country.

?country rdfs:label ?countryName.

filter( ?stateName= "Paraná"@en ) }
  `;
  return fetchQuery(query || defaultQuery);
};

// Quais e quantas iniciativas são realizadas em uma determinada área?
export const fetchInitiativesByArea = (query?: string) => {
  const defaultQuery = `
    PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>

PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

select ?initiativeName ?countryName ?areaName where {

?initiative a Ellas:Initiative.

?initiative rdfs:label ?initiativeName.

?initiative Ellas:located_in ?area.

?area a Ellas:Area.

?area rdfs:label ?areaName.

?initiative Ellas:created_in ?country.

?country rdfs:label ?countryName.

filter( ?areaName= "Urban"@en ) }
  `;
  return fetchQuery(query || defaultQuery);
};

// Quais e quantas iniciativas são realizadas em uma determinada região?
export const fetchInitiativesByRegion = (query?: string) => {
  const defaultQuery = `
    PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>

PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

select ?initiativeName ?countryName ?regionName where {

?initiative a Ellas:Initiative.

?initiative rdfs:label ?initiativeName.

?initiative Ellas:located_in ?region.

?region a Ellas:Region.

?region rdfs:label ?regionName.

?initiative Ellas:created_in ?country.

?country rdfs:label ?countryName.

filter(regex (str(?regionName),"Coast") ) }
  `;
  return fetchQuery(query || defaultQuery);
};

// Quais e quantas iniciativas têm determinado alcance?
export const fetchInitiativesByReach = (query?: string) => {
  const defaultQuery = `
    PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>

PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

select ?initiativeName ?countryName ?regionName where {

?initiative a Ellas:Initiative.

?initiative rdfs:label ?initiativeName.

?initiative Ellas:located_in ?region.

?region a Ellas:Region.

?region rdfs:label ?regionName.

?initiative Ellas:created_in ?country.

?country rdfs:label ?countryName.

filter(regex (str(?regionName),"Coast") ) }
  `;
  return fetchQuery(query || defaultQuery);
};

// As iniciativas são financiadas?
export const fetchFundedInitiatives = (query?: string) => {
  const defaultQuery = `
    PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>

PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

select ?initiativeName ?countryName ?organizationName where {

?initiative a Ellas:Initiative.

?initiative rdfs:label ?initiativeName.

?initiative Ellas:funded_by ?organization.

?organization rdfs:label ?organizationName. 

?initiative Ellas:created_in ?country.

?country rdfs:label ?countryName.
}
  `;
  return fetchQuery(query || defaultQuery);
};

// Qual é o setor da(s) organização(ões) que financia(m) a iniciativa?
export const fetchInitiativeFundingSectors = (query?: string) => {
  const defaultQuery = `
   PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>

PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

select ?initiativeName ?countryName ?sector where {

?initiative a Ellas:Initiative.

?initiative rdfs:label ?initiativeName.

?initiative Ellas:funded_by ?organization.

?organization Ellas:organization_sector ?sector.

?initiative Ellas:created_in ?country.

?country rdfs:label ?countryName.
 }
  `;
  return fetchQuery(query || defaultQuery);
};

// Quais iniciativas estão ativas?
export const fetchActiveInitiatives = (query?: string) => {
  const defaultQuery = `
    PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>

PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

select ?initiativeName ?countryname ?status where {

?initiative a Ellas:Initiative.

?initiative rdfs:label ?initiativeName.

?initiative Ellas:initiative_status ?status.

?initiative Ellas:created_in ?country.

?country rdfs:label ?countryName.

filter(?status="Active"@en) }
  `;
  return fetchQuery(query || defaultQuery);
};

// As iniciativas já foram implementadas ou ainda estão em fase de design?
export const fetchInitiativesByPhase = (query?: string) => {
  const defaultQuery = `
   PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>

PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

select ?initiativeName ?countryName ?startDate where {

?initiative a Ellas:Initiative.

?initiative rdfs:label ?initiativeName.

?initiative Ellas:start_date ?startDate.

?initiative Ellas:created_in ?country.

?country rdfs:label ?countryName.}
  `;
  return fetchQuery(query || defaultQuery);
};

// Quais iniciativas já foram concluídas?
export const fetchFinishedInitiatives = (query?: string) => {
  const defaultQuery = `
   PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>

PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

select ?initiativeName ?countryName ?finishDate where {

?initiative a Ellas:Initiative.

?initiative rdfs:label ?initiativeName.

?initiative Ellas:finish_date ?finishDate.

?initiative Ellas:created_in ?country.

?country rdfs:label ?countryName. }
  `;
  return fetchQuery(query || defaultQuery);
};

// Qual é o site (URL) da iniciativa?
export const fetchInitiativeWebsites = async () => {
  const defaultQuery = `
    PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>

PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

select ?initiativeName ?countryName ?website where {

?initiative a Ellas:Initiative.
 
?initiative rdfs:label ?initiativeName.
    
       optional{
?initiative Ellas:initiative_website ?website.
    }
?initiative Ellas:created_in ?country.

?country rdfs:label ?countryName.
}order by desc(?website)
  `;
  return fetchQuery(defaultQuery);
};

// Quantas iniciativas fazem parte de comunidades?
export const fetchCommunityInitiatives = (query?: string) => {
  const defaultQuery = `
    PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>

PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

select ?initiativeName ?countryName ?communityName where {

?initiative a Ellas:Initiative.

?initiative rdfs:label ?initiativeName.

?initiative Ellas:initiative_community_name ?communityName. 

?initiative Ellas:created_in ?country.

?country rdfs:label ?countryName.
}
  `;
  return fetchQuery(query || defaultQuery);
};

// Fetch functions for Contextual Factors (Activity 4)

// Positive contextual factors in countries analyzed
export const fetchPositiveContextualFactors = async () => {
  const query = `
    PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>

PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

select ?contextualFactorName  ?countryName ?impactType where {

?factor a Ellas:Factor.

?contextualFactor rdfs:subClassOf ?factor.

?contextualFactor rdfs:label ?contextualFactorName.

?contextualFactor Ellas:factors_impact_type ?impactType.

?contextualFactor Ellas:analyzed_in ?country.

?country rdfs:label ?countryName.

filter(?impactType ="Positive"@en)}
  `;
  return await fetchQuery(query);
};

// Negative contextual factors in institution activities
export const fetchNegativeContextualFactorsInInstitution = async () => {
  const query = `
    PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>

PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

select ?contextualFactorName ?impactType ?countryName ?contextType where {

?factor a Ellas:Factor.

?contextualFactor rdfs:subClassOf ?factor.

?contextualFactor rdfs:label ?contextualFactorName.

?contextualFactor Ellas:factors_impact_type ?impactType.

?contextualFactor Ellas:analyzed_in ?country.

?country rdfs:label ?countryName.

?contextualFactor Ellas:factors_context_type ?contextType.

filter(?impactType ="Negative"@en)

filter(regex (str(?contextType),"University")) }
  `;
  return await fetchQuery(query);
};

// Contextual factors related to educational factors
export const fetchContextualFactorsByEducationType = async () => {
  const query = `
    PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>

PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

select ?contextualFactorName ?countryName ?factorName where {

?factor a Ellas:Factor.

?contextualFactor rdfs:subClassOf ?factor.

?contextualFactor rdfs:label ?contextualFactorName.

?factor rdfs:label ?factorName.

?contextualFactor Ellas:analyzed_in ?country.

?country rdfs:label ?countryName.

filter(regex(str(?factorName),"educational")||regex(str(?factorName),"Educational"))}
  `;
  return await fetchQuery(query);
};

// Contextual factors impacting females positively/negatively
export const fetchContextualFactorsImpactingFemales = async () => {
  const query = `
    PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>

PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

select ?contextualFactorName ?countryName ?impactType ?targetAudienceGender where {

?factor a Ellas:Factor.

?contextualFactor rdfs:subClassOf ?factor.

?contextualFactor rdfs:label ?contextualFactorName.

?contextualFactor Ellas:factors_impact_type ?impactType.

?contextualFactor Ellas:focused_on ?targetAudience.

?targetAudience a Ellas:Target_Audience_Gender.

?targetAudience rdfs:label ?targetAudienceGender.

?contextualFactor Ellas:analyzed_in ?country.

?country rdfs:label ?countryName.

filter(?impactType ="Positive"@en)

filter(?targetAudienceGender="Female"@en) }
  `;
  return await fetchQuery(query);
};

// Impacts of a specific contextual factor
export const fetchImpactsOfContextualFactor = async () => {
  const query = `
    PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>

PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

select ?contextualFactorName ?countryName ?impact where {

?factor a Ellas:Factor.

?contextualFactor rdfs:subClassOf ?factor.

?contextualFactor rdfs:label ?contextualFactorName.

?contextualFactor Ellas:analyzed_in ?country.

?country rdfs:label ?countryName.

?contextualFactor Ellas:factors_impact ?impact.}
  `;
  return await fetchQuery(query);
};

// Impact types of contextual factor in Latin American institutions
export const fetchImpactTypesOfContextualFactors = async () => {
  const query = `
   PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>

PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

select ?contextualFactorName ?impactType ?countryName ?contextType where {

?factor a Ellas:Factor.

?contextualFactor rdfs:subClassOf ?factor.

?contextualFactor rdfs:label ?contextualFactorName.

?contextualFactor Ellas:factors_impact_type ?impactType.

?contextualFactor Ellas:analyzed_in ?country.

?country rdfs:label ?countryName.

?contextualFactor Ellas:factors_context_type ?contextType.

filter(?contextualFactorName="Gender stereotypes"@en)

filter(?impactType ="Negative"@en)

filter(regex (str(?contextType),"University"))}
  `;
  return await fetchQuery(query);
};

// Contextual factors impacting specific impacts (e.g., leadership) in a country
export const fetchContextualFactorsImpactingSpecificImpacts = async () => {
  const query = `
    PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>

PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

select ?contextualFactorName ?impactType ?impact ?countryName  where {

?factor a Ellas:Factor.

?contextualFactor rdfs:subClassOf ?factor.

?contextualFactor rdfs:label ?contextualFactorName.

?contextualFactor Ellas:factors_impact_type ?impactType.

?contextualFactor Ellas:factors_impact ?impact.

?contextualFactor Ellas:analyzed_in ?country.

?country rdfs:label ?countryName.

filter(?impactType ="Positive"@en)

filter(regex(str(?impact),"Leadership")||regex(str(?impact),"leadership")) }
  `;
  return await fetchQuery(query);
};

// Atualize o mapeamento de perguntas para funções de busca
export const questionFunctions: { [key: string]: any } = {
  "Which/How many initiatives are carried out by countries?":
    fetchInitiativesByCountry,
  "What data source are used for initiative?": fetchDataSourcesForInitiatives,
  "What is the initiative's social network(s)?":
    fetchSocialNetworksForInitiatives,
  "How many initiatives are of program?": fetchProgramInitiatives,
  "Are these initiatives public or private?": fetchPublicPrivateInitiatives,
  "How many initiatives are coordinated by individuals?":
    fetchIndividualCoordinatedInitiatives,
  "What is the social gender of the people who are responsible for the initiatives?":
    fetchCoordinatorGenderForInitiatives,
  "What is the OBJECTIVE of the initiative?": fetchInitiativeObjectives,
  "Which initiative modality are used for the actives/actions?":
    fetchInitiativeFormats,
  "What initiatives serve girls or adolescents?":
    fetchInitiativesForGirlsOrAdolescents,
  "What is the social gender of the target audience served by the initiative?":
    fetchTargetAudienceGenderForInitiatives,
  "What initiatives serve black women?": fetchInitiativesForBlackWomen,
  "What initiatives are being developed <at a given school level>?":
    fetchInitiativesByEducationalLevel,
  "What initiatives serve <a certain vulnerable group>?":
    fetchInitiativesForVulnerableGroups,
  "Do the initiatives involve the School community?":
    fetchSchoolCommunityInvolvementInInitiatives,
  "Which/How many initiatives are carried out <in a given city>?":
    fetchInitiativesByCity,
  "What/How many initiatives are carried out <in a given state>?":
    fetchInitiativesByState,
  "What/How many initiatives are carried out <in a given area>?":
    fetchInitiativesByArea,
  "What/How many initiatives are carried out <in a given region>?":
    fetchInitiativesByRegion,
  "Which/How many initiatives have <a given reach>?": fetchInitiativesByReach,
  "Are the initiatives funded?": fetchFundedInitiatives,
  "What is the sector of the organization(s) that finance(s) the initiative?":
    fetchInitiativeFundingSectors,
  "What initiatives are active?": fetchActiveInitiatives,
  "Have the initiatives already been implemented or are they still in the design phase?":
    fetchInitiativesByPhase,
  "Which initiatives are already finished?": fetchFinishedInitiatives,
  "What is the initiative's website (URL)?": fetchInitiativeWebsites,
  "How many initiatives are part of communities?": fetchCommunityInitiatives,
  "In which countries the policy was applied?": fetchPoliciesAppliedInCountries,
  "What types of gender policies/processes/practices exist in Latin America?":
    fetchPolicyTypesInLatinAmerica,
  "How policies identified/analyzed are promoting women's participation in STEM fields?":
    fetchPoliciesPromotingWomenInSTEM,
  "What types of gender policies/processes/practices have been implemented in Bolivia, Brazil and Peru since 2015?":
    fetchPoliciesImplementedInCountriesSince2015,
  "What are the positive CONTEXTUAL FACTORS in COUNTRIES ANALYZED?":
    fetchPositiveContextualFactors,
  "What are the negative CONTEXTUAL FACTORS in activities in Institution X in COUNTRIES ANALYZED?":
    fetchNegativeContextualFactorsInInstitution,
  "Which CONTEXTUAL FACTORS are related to the TYPE of Educational FACTOR?":
    fetchContextualFactorsByEducationType,
  "What are the CONTEXTUAL FACTORS that impact Positively/Negatively the GENDER Female?":
    fetchContextualFactorsImpactingFemales,
  "What are the IMPACTS of CONTEXTUAL FACTOR X?":
    fetchImpactsOfContextualFactor,
  "Which are the IMPACT TYPES of the CONTEXTUAL FACTOR Y in Latin American INSTITUTIONS?":
    fetchImpactTypesOfContextualFactors,
  "What are the CONTEXTUAL FACTORS that impact Positively/Negatively on IMPACT (IMPACT=Leadership, permanence, motivation, others) in the country X?":
    fetchContextualFactorsImpactingSpecificImpacts,
};

// New functions to support additional features

// Function to transform URL strings into clickable links
export const processUrlData = (data: any) => {
  if (!data) return data;

  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return data.replace(
    urlRegex,
    '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>'
  );
};

// Function to get featured questions for the carousel
export const getFeaturedQuestions = () => {
  return [
    {
      category: "Policies",
      questions: [
        {
          text: "In which countries the policy was applied?",
          query: fetchPoliciesAppliedInCountries,
        },
        {
          text: "What types of gender policies exist in Latin America?",
          query: fetchPolicyTypesInLatinAmerica,
        },
      ],
    },
    {
      category: "Initiatives",
      questions: [
        {
          text: "Which initiatives are active?",
          query: fetchActiveInitiatives,
        },
        {
          text: "What initiatives serve black women?",
          query: fetchInitiativesForBlackWomen,
        },
      ],
    },
    {
      category: "Factors",
      questions: [
        {
          text: "What are the positive contextual factors?",
          query: fetchPositiveContextualFactors,
        },
        {
          text: "What impacts do contextual factors have?",
          query: fetchImpactsOfContextualFactor,
        },
      ],
    },
  ];
};

// Function to get Latin America focused question
export const getLatinAmericaFocusQuestion = () => {
  return {
    text: "What types of gender policies/processes/practices exist in Latin America?",
    query: fetchPolicyTypesInLatinAmerica,
  };
};

// Function to get shortcut queries
export const getShortcutQueries = () => {
  return {
    policies: {
      text: "View all policies",
      query: fetchPoliciesAppliedInCountries,
    },
    initiatives: {
      text: "View all initiatives",
      query: fetchInitiativesByCountry,
    },
    factors: {
      text: "View all factors",
      query: fetchPositiveContextualFactors,
    },
  };
};

// Function to support column sorting
export const sortData = (
  data: any[],
  column: string,
  direction: "asc" | "desc"
) => {
  return [...data].sort((a, b) => {
    const valueA = a[column]?.toLowerCase() || "";
    const valueB = b[column]?.toLowerCase() || "";

    if (direction === "asc") {
      return valueA.localeCompare(valueB);
    } else {
      return valueB.localeCompare(valueA);
    }
  });
};

// Function to filter data based on column values
export const filterData = (data: any[], filters: { [key: string]: string }) => {
  return data.filter((row) => {
    return Object.entries(filters).every(([column, filterValue]) => {
      const cellValue = String(row[column] || "").toLowerCase();
      return cellValue.includes(filterValue.toLowerCase());
    });
  });
};

// Function to support language selection
export const getTranslations = async (language: string) => {
  // This would typically fetch translations from a backend service
  // For now, returning a simple object
  const translations = {
    en: {
      openData: "Open Data",
      explore: "Explore the data",
      featured: "Featured Data",
      latinAmerica: "Latin America in Focus",
      // ... more translations
    },
    es: {
      openData: "Datos Abiertos",
      explore: "Explorar los datos",
      featured: "Datos Destacados",
      latinAmerica: "América Latina en Foco",
      // ... more translations
    },
    pt: {
      openData: "Dados Abertos",
      explore: "Explorar os dados",
      featured: "Dados em Destaque",
      latinAmerica: "América Latina em Foco",
      // ... more translations
    },
  };

  return translations[language as keyof typeof translations] || translations.en;
};

// Authentication types
interface User {
  id: string;
  email: string;
  name: string;
  token: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData extends LoginCredentials {
  name: string;
}

interface AuthResponse {
  user: User;
  token: string;
}

// Authentication functions
export const login = async (credentials: LoginCredentials): Promise<User> => {
  try {
    const response = await axiosInstance.post<AuthResponse>(
      "/auth/login",
      credentials
    );
    const { user, token } = response.data;

    // Store token
    localStorage.setItem("authToken", token);
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    return user;
  } catch (error) {
    console.error("Login error:", error);
    throw new Error("Failed to login. Please check your credentials.");
  }
};

export const register = async (data: RegisterData): Promise<User> => {
  try {
    const response = await axiosInstance.post<AuthResponse>(
      "/auth/register",
      data
    );
    const { user, token } = response.data;

    // Store token
    localStorage.setItem("authToken", token);
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    return user;
  } catch (error) {
    console.error("Registration error:", error);
    throw new Error("Failed to register. Please try again.");
  }
};

export const logout = async (): Promise<void> => {
  try {
    await axiosInstance.post("/auth/logout");
  } catch (error) {
    console.error("Logout error:", error);
  } finally {
    // Clean up local storage and headers
    localStorage.removeItem("authToken");
    delete axiosInstance.defaults.headers.common["Authorization"];
  }
};

// Auth helper functions
export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem("authToken");
};

export const getCurrentUser = async (): Promise<User | null> => {
  try {
    if (!isAuthenticated()) return null;

    const response = await axiosInstance.get<User>("/auth/me");
    return response.data;
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
};

// Setup axios interceptor for token refresh
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh token
        const response = await axiosInstance.post<AuthResponse>(
          "/auth/refresh"
        );
        const { token } = response.data;

        localStorage.setItem("authToken", token);
        axiosInstance.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${token}`;

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // If refresh fails, logout
        await logout();
        throw refreshError;
      }
    }

    return Promise.reject(error);
  }
);

// Enhanced PDF export with proper styling
export const exportToPDF = async (data: any[], title: string) => {
  try {
    // Fallback to CSV if pdfmake is not available
    if (!data || !data.length) {
      throw new Error("No data to export");
    }

    try {
      // Try to use CSV as a more reliable alternative
      await exportToCSV(data, title);
    } catch (csvError) {
      console.error("Error generating CSV:", csvError);
      throw csvError;
    }
  } catch (error) {
    console.error("Error generating PDF/CSV:", error);
    throw error;
  }
};

// New CSV export function as reliable alternative
export const exportToCSV = async (data: any[], title: string) => {
  try {
    // Add BOM for Excel UTF-8 compatibility
    const BOM = "\uFEFF";
    const csvContent =
      BOM +
      [
        Object.keys(data[0]).join(","), // header
        ...data.map((row) =>
          Object.values(row)
            .map((value) => `"${String(value).replace(/"/g, '""')}"`)
            .join(",")
        ), // rows
      ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `${title.toLowerCase().replace(/\s+/g, "_")}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error generating CSV:", error);
    throw error;
  }
};

// Function to export visualization to image
export const exportToImage = async (
  elementId: string,
  format: "jpg" | "png"
) => {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error(`Element with id ${elementId} not found`);
    }

    // Use canvas API directly instead of html2canvas
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    if (!context) {
      throw new Error("Could not get canvas context");
    }

    // Set canvas size to match element
    const rect = element.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    // Draw element background
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Convert element to image using native APIs
    const data = new XMLSerializer().serializeToString(element);
    const svgBlob = new Blob([data], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);

    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        context.drawImage(img, 0, 0);
        URL.revokeObjectURL(url);

        // Create download link
        const link = document.createElement("a");
        link.download = `visualization.${format}`;
        link.href = canvas.toDataURL(`image/${format}`);
        link.click();
        resolve(true);
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error("Error loading image"));
      };
      img.src = url;
    });
  } catch (error) {
    console.error("Error generating image:", error);
    throw error;
  }
};

// Function to share on social media
export const shareOnSocialMedia = (
  platform: "twitter" | "facebook" | "linkedin",
  data: {
    title: string;
    url: string;
    description?: string;
  }
) => {
  const urls = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      data.title
    )}&url=${encodeURIComponent(data.url)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      data.url
    )}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      data.url
    )}`,
  };

  window.open(urls[platform], "_blank");
};

// Function to get column configuration for better width distribution
export const getColumnConfig = (data: any[]) => {
  if (!data.length) return {};

  const columns = Object.keys(data[0]);
  return columns.reduce((acc, column) => {
    // Calculate optimal width based on content
    const maxLength = Math.max(
      column.length,
      ...data.map((row) => String(row[column] || "").length)
    );

    return {
      ...acc,
      [column]: {
        minWidth: Math.min(maxLength * 8, 300), // 8px per character, max 300px
        maxWidth: Math.min(maxLength * 12, 500), // 12px per character, max 500px
      },
    };
  }, {});
};

// Function to handle visualization type selection and state
export const visualizationTypes = {
  TABLE: "TABLE",
  MAP: "MAP",
  CHART: "CHART",
} as const;

interface VisualizationState {
  type: keyof typeof visualizationTypes;
  question: string;
  data: any[];
}

interface EnhancedVisualizationState extends VisualizationState {
  filters: { [key: string]: string };
  sorting: { column: string; direction: "asc" | "desc" } | null;
  lastUpdated: number;
}

export const setVisualizationType = (state: EnhancedVisualizationState) => {
  const enhancedState = {
    ...state,
    lastUpdated: Date.now(),
  };
  localStorage.setItem("visualizationState", JSON.stringify(enhancedState));
  return enhancedState;
};

export const getVisualizationState = (): EnhancedVisualizationState | null => {
  const saved = localStorage.getItem("visualizationState");
  if (!saved) return null;

  const state = JSON.parse(saved);
  // Validate state before returning
  if (!state.type || !state.question) {
    localStorage.removeItem("visualizationState");
    return null;
  }
  return state;
};

// Function to handle restart/reset
export const resetState = (): EnhancedVisualizationState => {
  // Remove all stored states
  localStorage.removeItem("visualizationState");
  localStorage.removeItem("selectedFilters");
  localStorage.removeItem("selectedQuestion");
  localStorage.removeItem("lastSearch");

  // Clear session storage as well
  sessionStorage.clear();

  // Return a reset state object
  return {
    type: "TABLE",
    question: "",
    data: [],
    filters: {},
    sorting: null,
    lastUpdated: Date.now(),
  };
};

// Function to get carousel images
export const getCarouselImages = () => {
  return [
    {
      src: "/images/prototype1.jpg",
      alt: "Prototype Image 1",
      caption: "ELLAS Platform Overview",
    },
    {
      src: "/images/prototype2.jpg",
      alt: "Prototype Image 2",
      caption: "Data Visualization",
    },
    {
      src: "/images/prototype3.jpg",
      alt: "Prototype Image 3",
      caption: "Interactive Features",
    },
  ];
};

// Function to handle table spacing
export const getTableStyles = () => {
  return {
    container: {
      marginBottom: "2rem", // Add space below table
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
    },
    cell: {
      padding: "0.75rem",
      borderBottom: "1px solid #e2e8f0",
    },
  };
};

// Function to get page title styles
export const getPageTitleStyles = () => {
  return {
    container: {
      textAlign: "left" as const,
      marginBottom: "1.5rem",
    },
    title: {
      fontSize: "1.875rem",
      fontWeight: "600",
      color: "#1a202c",
    },
  };
};

// Function to handle language switching with full translations
export const getFullTranslations = async (language: string) => {
  const translations = {
    en: {
      openData: "Open Data",
      explore: "Explore the data",
      featured: "Featured Data",
      latinAmerica: "Latin America in Focus",
      table: {
        noData: "No data available",
        loading: "Loading data...",
        filter: "Filter",
        export: "Export",
        share: "Share",
        columns: "Columns",
        rows: "Rows",
      },
      buttons: {
        restart: "Restart",
        apply: "Apply",
        cancel: "Cancel",
        export: {
          pdf: "Export as PDF",
          csv: "Export as CSV",
          image: "Export as Image",
        },
        share: {
          twitter: "Share on Twitter",
          facebook: "Share on Facebook",
          linkedin: "Share on LinkedIn",
        },
      },
      auth: {
        login: "Login",
        register: "Register",
        logout: "Logout",
        profile: "Profile",
        settings: "Settings",
      },
      visualization: {
        table: "Table View",
        map: "Map View",
        chart: "Chart View",
        select: "Select Visualization",
      },
    },
    es: {
      // Spanish translations...
    },
    pt: {
      // Portuguese translations...
    },
  };

  return translations[language as keyof typeof translations] || translations.en;
};

// Function to process clickable URLs in table data
export const processTableData = (data: any[]) => {
  return data.map((row) => {
    const processedRow = { ...row };
    Object.keys(row).forEach((key) => {
      const value = row[key];
      if (typeof value === "string" && value.match(/(https?:\/\/[^\s]+)/g)) {
        processedRow[key] = processUrlData(value);
      }
    });
    return processedRow;
  });
};

// Project icon configuration
export const getProjectIcon = () => {
  return {
    src: "/images/ellas-logo.png",
    alt: "ELLAS Project Logo",
  };
};

// Enhanced visualization info
export const getVisualizationInfo = (type: keyof typeof visualizationTypes) => {
  const info = {
    [visualizationTypes.TABLE]: {
      icon: "table-icon",
      label: "Table View",
      description: "View data in tabular format",
    },
    [visualizationTypes.MAP]: {
      icon: "map-icon",
      label: "Map View",
      description: "View geographical distribution",
    },
    [visualizationTypes.CHART]: {
      icon: "chart-icon",
      label: "Chart View",
      description: "View data in charts",
    },
  };
  return info[type];
};
