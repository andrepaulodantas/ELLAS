import { ISPARQLExecutor } from './interfaces';
import { fetchQuery } from '../apiService';

/**
 * Serviço responsável por gerenciar consultas SPARQL predefinidas
 * Implementa o princípio de Responsabilidade Única
 */
export class PredefinedQueryService {
  private sparqlExecutor: ISPARQLExecutor;
  private predefinedQueries: Map<string, () => Promise<any>>;

  constructor(sparqlExecutor: ISPARQLExecutor) {
    this.sparqlExecutor = sparqlExecutor;
    this.predefinedQueries = new Map();
    this.initializePredefinedQueries();
  }

  /**
   * Inicializar todas as consultas predefinidas
   */
  private initializePredefinedQueries(): void {
    // Políticas
    this.predefinedQueries.set('policies_applied_in_countries', this.fetchPoliciesAppliedInCountries);
    this.predefinedQueries.set('policy_types_in_latin_america', this.fetchPolicyTypesInLatinAmerica);
    this.predefinedQueries.set('policies_promoting_women_in_stem', this.fetchPoliciesPromotingWomenInSTEM);
    this.predefinedQueries.set('policies_implemented_since_2015', this.fetchPoliciesImplementedInCountriesSince2015);

    // Iniciativas
    this.predefinedQueries.set('initiatives_by_country', this.fetchInitiativesByCountry);
    this.predefinedQueries.set('active_initiatives', this.fetchActiveInitiatives);
    this.predefinedQueries.set('initiatives_by_phase', this.fetchInitiativesByPhase);
    this.predefinedQueries.set('finished_initiatives', this.fetchFinishedInitiatives);
    this.predefinedQueries.set('initiatives_for_girls_or_adolescents', this.fetchInitiativesForGirlsOrAdolescents);
    this.predefinedQueries.set('initiatives_for_black_women', this.fetchInitiativesForBlackWomen);
    this.predefinedQueries.set('initiatives_by_educational_level', this.fetchInitiativesByEducationalLevel);
    this.predefinedQueries.set('initiatives_by_city', this.fetchInitiativesByCity);
    this.predefinedQueries.set('initiatives_by_state', this.fetchInitiativesByState);
    this.predefinedQueries.set('initiatives_by_region', this.fetchInitiativesByRegion);

    // Fatores Contextuais
    this.predefinedQueries.set('positive_contextual_factors', this.fetchPositiveContextualFactors);
    this.predefinedQueries.set('negative_contextual_factors_in_institution', this.fetchNegativeContextualFactorsInInstitution);
  }

  /**
   * Obter consultas disponíveis por categoria
   */
  async getQueriesByCategory(category: string): Promise<string[]> {
    const categoryKey = category.toLowerCase();
    const queries: string[] = [];

    for (const [key] of this.predefinedQueries) {
      if (key.includes(categoryKey) || key.includes(category.toLowerCase())) {
        queries.push(key);
      }
    }

    return queries;
  }

  /**
   * Executar consulta predefinida pelo nome
   */
  async executeQuery(queryName: string): Promise<any> {
    const queryFunction = this.predefinedQueries.get(queryName);
    
    if (!queryFunction) {
      throw new Error(`Consulta predefinida não encontrada: ${queryName}`);
    }

    return await queryFunction.call(this);
  }

  // Consultas predefinidas para Políticas
  private async fetchPoliciesAppliedInCountries(): Promise<any> {
    console.log("Executando fetchPoliciesAppliedInCountries");
    return await fetchQuery(`
      PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>
      PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
      SELECT ?policyName ?countryName
      WHERE {
        ?policy a Ellas:Policy.
        ?policy rdfs:label ?policyName.
        ?policy Ellas:created_in ?country.
        ?country rdfs:label ?countryName.
      }
      ORDER BY ?countryName
    `);
  }

  private async fetchPolicyTypesInLatinAmerica(): Promise<any> {
    console.log("Executando fetchPolicyTypesInLatinAmerica");
    return await fetchQuery(`
      PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>
      PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
      SELECT ?policyType (COUNT(?policy) as ?count)
      WHERE {
        ?policy a Ellas:Policy.
        ?policy Ellas:policy_type ?type.
        ?type rdfs:label ?policyType.
        ?policy Ellas:created_in ?country.
        ?country rdfs:label ?countryName.
        FILTER(REGEX(?countryName, "America", "i"))
      }
      GROUP BY ?policyType
      ORDER BY DESC(?count)
    `);
  }

  private async fetchPoliciesPromotingWomenInSTEM(): Promise<any> {
    console.log("Executando fetchPoliciesPromotingWomenInSTEM");
    return await fetchQuery(`
      PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>
      PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
      SELECT ?policyName ?countryName
      WHERE {
        ?policy a Ellas:Policy.
        ?policy rdfs:label ?policyName.
        ?policy Ellas:focused_on ?focus.
        ?focus rdfs:label ?focusLabel.
        ?policy Ellas:created_in ?country.
        ?country rdfs:label ?countryName.
        FILTER(REGEX(?focusLabel, "STEM|Science|Technology|Engineering|Math", "i"))
      }
      ORDER BY ?countryName
    `);
  }

  private async fetchPoliciesImplementedInCountriesSince2015(): Promise<any> {
    console.log("Executando fetchPoliciesImplementedInCountriesSince2015");
    return await fetchQuery(`
      PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>
      PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
      PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
      SELECT ?policyName ?countryName ?date
      WHERE {
        ?policy a Ellas:Policy.
        ?policy rdfs:label ?policyName.
        ?policy Ellas:created_in ?country.
        ?country rdfs:label ?countryName.
        ?policy Ellas:date ?date.
        FILTER(?date >= "2015-01-01"^^xsd:date)
        FILTER(REGEX(?countryName, "Bolivia|Brazil|Peru", "i"))
      }
      ORDER BY ?countryName ?date
    `);
  }

  // Consultas predefinidas para Iniciativas
  private async fetchInitiativesByCountry(): Promise<any> {
    console.log("Executando fetchInitiativesByCountry");
    return await fetchQuery(`
      PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>
      PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
      SELECT ?countryName (COUNT(?initiative) as ?count)
      WHERE {
        ?initiative a Ellas:Initiative.
        ?initiative Ellas:located_in ?country.
        ?country rdfs:label ?countryName.
      }
      GROUP BY ?countryName
      ORDER BY DESC(?count)
    `);
  }

  private async fetchActiveInitiatives(): Promise<any> {
    console.log("Executando fetchActiveInitiatives");
    return await fetchQuery(`
      PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>
      PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
      SELECT ?initiativeName ?countryName
      WHERE {
        ?initiative a Ellas:Initiative.
        ?initiative rdfs:label ?initiativeName.
        ?initiative Ellas:status ?status.
        ?status rdfs:label "Active"@en.
        ?initiative Ellas:located_in ?country.
        ?country rdfs:label ?countryName.
      }
      ORDER BY ?countryName
    `);
  }

  private async fetchInitiativesByPhase(): Promise<any> {
    console.log("Executando fetchInitiativesByPhase");
    return await fetchQuery(`
      PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>
      PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
      SELECT ?phase (COUNT(?initiative) as ?count)
      WHERE {
        ?initiative a Ellas:Initiative.
        ?initiative Ellas:phase ?phaseObj.
        ?phaseObj rdfs:label ?phase.
      }
      GROUP BY ?phase
      ORDER BY DESC(?count)
    `);
  }

  private async fetchFinishedInitiatives(): Promise<any> {
    console.log("Executando fetchFinishedInitiatives");
    return await fetchQuery(`
      PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>
      PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
      SELECT ?initiativeName ?countryName
      WHERE {
        ?initiative a Ellas:Initiative.
        ?initiative rdfs:label ?initiativeName.
        ?initiative Ellas:status ?status.
        ?status rdfs:label "Finished"@en.
        ?initiative Ellas:located_in ?country.
        ?country rdfs:label ?countryName.
      }
      ORDER BY ?countryName
    `);
  }

  private async fetchInitiativesForGirlsOrAdolescents(): Promise<any> {
    console.log("Executando fetchInitiativesForGirlsOrAdolescents");
    return await fetchQuery(`
      PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>
      PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
      SELECT ?initiativeName ?countryName
      WHERE {
        ?initiative a Ellas:Initiative.
        ?initiative rdfs:label ?initiativeName.
        ?initiative Ellas:target_audience ?audience.
        ?audience rdfs:label ?audienceLabel.
        ?initiative Ellas:located_in ?country.
        ?country rdfs:label ?countryName.
        FILTER(REGEX(?audienceLabel, "Girls|Adolescents", "i"))
      }
      ORDER BY ?countryName
    `);
  }

  private async fetchInitiativesForBlackWomen(): Promise<any> {
    console.log("Executando fetchInitiativesForBlackWomen");
    return await fetchQuery(`
      PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>
      PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
      SELECT ?initiativeName ?countryName
      WHERE {
        ?initiative a Ellas:Initiative.
        ?initiative rdfs:label ?initiativeName.
        ?initiative Ellas:target_audience ?audience.
        ?audience rdfs:label ?audienceLabel.
        ?initiative Ellas:located_in ?country.
        ?country rdfs:label ?countryName.
        FILTER(REGEX(?audienceLabel, "Black Women|Mulheres Negras", "i"))
      }
      ORDER BY ?countryName
    `);
  }

  private async fetchInitiativesByEducationalLevel(): Promise<any> {
    console.log("Executando fetchInitiativesByEducationalLevel");
    return await fetchQuery(`
      PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>
      PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
      SELECT ?level (COUNT(?initiative) as ?count)
      WHERE {
        ?initiative a Ellas:Initiative.
        ?initiative Ellas:educational_level ?levelObj.
        ?levelObj rdfs:label ?level.
      }
      GROUP BY ?level
      ORDER BY DESC(?count)
    `);
  }

  private async fetchInitiativesByCity(): Promise<any> {
    console.log("Executando fetchInitiativesByCity");
    return await fetchQuery(`
      PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>
      PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
      SELECT ?city (COUNT(?initiative) as ?count)
      WHERE {
        ?initiative a Ellas:Initiative.
        ?initiative Ellas:located_in_city ?cityObj.
        ?cityObj rdfs:label ?city.
      }
      GROUP BY ?city
      ORDER BY DESC(?count)
    `);
  }

  private async fetchInitiativesByState(): Promise<any> {
    console.log("Executando fetchInitiativesByState");
    return await fetchQuery(`
      PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>
      PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
      SELECT ?state (COUNT(?initiative) as ?count)
      WHERE {
        ?initiative a Ellas:Initiative.
        ?initiative Ellas:located_in_state ?stateObj.
        ?stateObj rdfs:label ?state.
      }
      GROUP BY ?state
      ORDER BY DESC(?count)
    `);
  }

  private async fetchInitiativesByRegion(): Promise<any> {
    console.log("Executando fetchInitiativesByRegion");
    return await fetchQuery(`
      PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>
      PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
      SELECT ?region (COUNT(?initiative) as ?count)
      WHERE {
        ?initiative a Ellas:Initiative.
        ?initiative Ellas:located_in_region ?regionObj.
        ?regionObj rdfs:label ?region.
      }
      GROUP BY ?region
      ORDER BY DESC(?count)
    `);
  }

  // Consultas predefinidas para Fatores Contextuais
  private async fetchPositiveContextualFactors(): Promise<any> {
    console.log("Executando fetchPositiveContextualFactors");
    return await fetchQuery(`
      PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>
      PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
      SELECT ?factorName ?countryName
      WHERE {
        ?factor a Ellas:Factor.
        ?factor rdfs:label ?factorName.
        ?factor Ellas:impact_type ?impact.
        ?impact rdfs:label "Positive"@en.
        ?factor Ellas:analyzed_in ?country.
        ?country rdfs:label ?countryName.
      }
      ORDER BY ?countryName
    `);
  }

  private async fetchNegativeContextualFactorsInInstitution(): Promise<any> {
    console.log("Executando fetchNegativeContextualFactorsInInstitution");
    return await fetchQuery(`
      PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>
      PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
      SELECT ?factorName ?institutionName ?countryName
      WHERE {
        ?factor a Ellas:Factor.
        ?factor rdfs:label ?factorName.
        ?factor Ellas:impact_type ?impact.
        ?impact rdfs:label "Negative"@en.
        ?factor Ellas:analyzed_in_institution ?institution.
        ?institution rdfs:label ?institutionName.
        ?factor Ellas:analyzed_in ?country.
        ?country rdfs:label ?countryName.
      }
      ORDER BY ?countryName
    `);
  }
}
