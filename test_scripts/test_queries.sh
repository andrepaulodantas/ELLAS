#!/bin/bash

# ELLAS SPARQL Query Test Script
# This script tests all SPARQL queries by sending them to the endpoint
# and checking for valid responses

ENDPOINT="http://200.17.60.189:7200/repositories/EllasV2"
AUTH_HEADER="Authorization: Basic $(echo -n "integracao:Ellas@integration" | base64)"
CONTENT_TYPE="Content-Type: application/sparql-query"
ACCEPT_HEADER="Accept: application/sparql-results+json"

# Define a function to test a query
test_query() {
  local name="$1"
  local query="$2"
  
  echo "Testing query: $name"
  echo "$query" > /tmp/query.sparql
  
  # Make the request
  response=$(curl -s -X POST \
    -H "$AUTH_HEADER" \
    -H "$CONTENT_TYPE" \
    -H "$ACCEPT_HEADER" \
    --data-binary @/tmp/query.sparql \
    "$ENDPOINT")
  
  # Check if we got a valid response with results
  if [[ $response == *"results"* ]] && [[ $response == *"bindings"* ]]; then
    # Count the number of results
    result_count=$(echo "$response" | grep -o '"bindings":\[[^]]*\]' | grep -o '\{' | wc -l)
    
    if [ "$result_count" -gt 0 ]; then
      echo "✅ SUCCESS: $name - $result_count results found"
    else
      echo "⚠️ WARNING: $name - Query executed but returned 0 results"
    fi
  else
    echo "❌ FAILED: $name - Invalid response:"
    echo "$response" | head -n 20
  fi
  
  echo "----------------------------------------------"
}

# Test all the queries

# Policies
echo "=== TESTING POLICY QUERIES ==="

test_query "fetchPoliciesAppliedInCountries" "
PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
select ?policyName ?countryName where {
?policy a Ellas:Policy.
?policy rdfs:label ?policyName.
?policy Ellas:created_in ?country.
?country rdfs:label ?countryName.}
"

test_query "fetchPolicyTypesInLatinAmerica" "
PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
select ?policyName ?countryName ?policyType where {
?policy a Ellas:Policy.
?policy rdfs:label ?policyName.
?policy Ellas:created_in ?country.
?country rdfs:label ?countryName.
?policy Ellas:policy_type ?policyType.}
"

test_query "fetchPoliciesPromotingWomenInSTEM" "
PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
select ?policyName ?countryName ?description where {
?policy a Ellas:Policy.
?policy rdfs:label ?policyName.
?policy Ellas:created_in ?country.
?country rdfs:label ?countryName.
?policy Ellas:policy_description ?description.}
"

test_query "fetchPoliciesImplementedInCountriesSince2015" "
PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
select ?policyName ?countryName ?start_date where {
?policy a Ellas:Policy.
?policy rdfs:label ?policyName.
?policy Ellas:created_in ?country.
?country rdfs:label ?countryName.
?policy Ellas:start_date ?start_date
filter(xsd:integer(?start_date) > 2015)
filter(regex(str(?countryName),\"Peru\") || regex(str(?countryName),\"peru\") ||
regex(str(?countryName),\"Brazil\") || regex(str(?countryName),\"brazil\") ||
regex(str(?countryName),\"Bolivia\") ||regex(str(?countryName),\"bolivia\"))}
"

# Initiatives
echo "=== TESTING INITIATIVE QUERIES ==="

test_query "fetchInitiativesByCountry" "
PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
select ?initiativeName ?countryName where {
?initiative a Ellas:Initiative.
?initiative rdfs:label ?initiativeName.
?initiative Ellas:created_in ?country.
?country rdfs:label ?countryName.}
"

test_query "fetchDataSourcesForInitiatives" "
PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
select ?initiativeName ?countryName ?dataSourceName where {
?initiative a Ellas:Initiative.
?initiative rdfs:label ?initiativeName.
?initiative Ellas:has_source ?dataSource.
?dataSource rdfs:label ?dataSourceName.
?initiative Ellas:created_in ?country.
?country rdfs:label ?countryName.}
"

test_query "fetchSocialNetworksForInitiatives" "
PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
select ?initiativeName ?countryName ?socialNetworks where {
?initiative a Ellas:Initiative.
?initiative rdfs:label ?initiativeName.
?initiative Ellas:initiative_social_networks ?socialNetworks.
?initiative Ellas:created_in ?country.
?country rdfs:label ?countryName.}
"

test_query "fetchInitiativeObjectives" "
PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
select ?initiativeName ?countryName ?objective where {
?initiative a Ellas:Initiative.
?initiative rdfs:label ?initiativeName.
?initiative Ellas:initiative_objective ?objective.
?initiative Ellas:created_in ?country.
?country rdfs:label ?countryName.}
"

test_query "fetchInitiativesForBlackWomen" "
PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
select ?initiativeName ?countryName ?targetAudienceRace where {
?initiative a Ellas:Initiative.
?initiative rdfs:label ?initiativeName.
?initiative Ellas:focused_on ?targetAudience.
?targetAudience a Ellas:Target_Audience_Race.
?targetAudience rdfs:label ?targetAudienceRace.
?initiative Ellas:created_in ?country.
?country rdfs:label ?countryName.
filter(regex(str(?targetAudienceRace), \"Black\") || regex(str(?targetAudienceRace), \"black\"))}
"

test_query "fetchActiveInitiatives" "
PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
select ?initiativeName ?countryName ?status where {
?initiative a Ellas:Initiative.
?initiative rdfs:label ?initiativeName.
?initiative Ellas:initiative_status ?status.
?initiative Ellas:created_in ?country.
?country rdfs:label ?countryName.
filter(?status=\"Active\"@en)}
"

test_query "fetchFinishedInitiatives" "
PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
select ?initiativeName ?countryName ?finishDate where {
?initiative a Ellas:Initiative.
?initiative rdfs:label ?initiativeName.
?initiative Ellas:finish_date ?finishDate.
?initiative Ellas:created_in ?country.
?country rdfs:label ?countryName.}
"

# Factors
echo "=== TESTING FACTOR QUERIES ==="

test_query "fetchPositiveContextualFactors" "
PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
select ?contextFactorName ?countryName where {
?contextFactor a Ellas:Contextual_Factor.
?contextFactor rdfs:label ?contextFactorName.
?contextFactor Ellas:created_in ?country.
?country rdfs:label ?countryName.
?contextFactor Ellas:contextual_factor_polarity ?polarity.
filter(str(?polarity)=\"Positive\")}
"

test_query "fetchContextualFactorsImpactingFemales" "
PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
select ?contextFactorName ?countryName ?impact ?polarity where {
?contextFactor a Ellas:Contextual_Factor.
?contextFactor rdfs:label ?contextFactorName.
?contextFactor Ellas:created_in ?country.
?country rdfs:label ?countryName.
?contextFactor Ellas:contextual_factor_polarity ?polarity.
?contextFactor Ellas:impact_on ?gender.
?gender a Ellas:Gender.
?gender rdfs:label ?impact.
filter(regex(str(?impact), \"Female\") || regex(str(?impact), \"female\"))}
"

echo "All tests completed!" 