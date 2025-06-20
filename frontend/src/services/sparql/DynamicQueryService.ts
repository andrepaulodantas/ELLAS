import { ISPARQLExecutor, ISPARQLQueryBuilder, SPARQLResponse } from "./interfaces";

/**
 * Serviço para execução de consultas dinâmicas
 * Princípio da Responsabilidade Única: Executa queries dinâmicas baseadas em filtros
 */
export class DynamicQueryService {
  constructor(
    private executor: ISPARQLExecutor,
    private queryBuilder: ISPARQLQueryBuilder
  ) {}

  /**
   * Executa uma consulta dinâmica baseada em categoria, caminho e campos extras
   */
  async executeDynamicGraphQuery(
    category: string,
    path: string[],
    extraFields: string[] = []
  ): Promise<SPARQLResponse> {
    try {
      console.log(`🔍 Executando consulta dinâmica:`, {
        category,
        path,
        extraFields,
        pathLength: path?.length,
      });

      const query = this.queryBuilder.buildDynamicQuery(category, path, extraFields);
      const result = await this.executor.executeQuery(query);

      this.logQueryResults(result, category, path);

      return result;
    } catch (error) {
      console.error("❌ Erro ao executar consulta dinâmica:", error);
      return { results: { bindings: [] } };
    }
  }

  /**
   * Executa uma consulta com parâmetros personalizados
   */
  async executeQueryWithParams(
    category: string,
    countries: string[] = [],
    filters: Record<string, any> = {}
  ): Promise<SPARQLResponse> {
    try {
      if (!category || category.trim() === "") {
        console.log("Categoria não fornecida, retornando resultado vazio");
        return { results: { bindings: [] } };
      }

      console.log("Executando consulta com parâmetros:", {
        category,
        countries,
        filters,
      });

      const query = this.buildParameterizedQuery(category, countries, filters);
      return await this.executor.executeQuery(query);
    } catch (error) {
      console.error("❌ Erro ao executar consulta parametrizada:", error);
      return { results: { bindings: [] } };
    }
  }

  /**
   * Constrói uma consulta parametrizada baseada em categoria e filtros
   */
  private buildParameterizedQuery(
    category: string,
    countries: string[],
    filters: Record<string, any>
  ): string {
    const categoryLower = category.toLowerCase();
    
    switch (categoryLower) {
      case "policy":
      case "policies":
        return this.buildPolicyQuery(countries);
        
      case "initiative":
      case "initiatives":
        return this.buildInitiativeQuery(countries);
        
      case "factor":
      case "factors":
      case "contextualfactor":
        return this.buildFactorQuery(countries);
        
      default:
        throw new Error(`Categoria não suportada: ${category}`);
    }
  }

  /**
   * Constrói consulta para políticas
   */
  private buildPolicyQuery(countries: string[]): string {
    const countryFilter = countries.length > 0 
      ? `FILTER(${countries.map(c => `?countryName="${c}"@en`).join(" || ")})`
      : "";

    return `
      PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>
      PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
      
      SELECT ?policyName ?countryName ?policyType ?startDate
      WHERE {
        ?policy a Ellas:Policy.
        ?policy rdfs:label ?policyName.
        ?policy Ellas:created_in ?country.
        ?country rdfs:label ?countryName.
        OPTIONAL { ?policy Ellas:policy_type ?policyType }
        OPTIONAL { ?policy Ellas:start_date ?startDate }
        ${countryFilter}
      }
    `;
  }

  /**
   * Constrói consulta para iniciativas
   */
  private buildInitiativeQuery(countries: string[]): string {
    const countryFilter = countries.length > 0 
      ? `FILTER(${countries.map(c => `?countryName="${c}"@en`).join(" || ")})`
      : "";

    return `
      PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>
      PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
      
      SELECT ?initiativeName ?countryName ?startDate ?status
      WHERE {
        ?initiative a Ellas:Initiative.
        ?initiative rdfs:label ?initiativeName.
        ?initiative Ellas:created_in ?country.
        ?country rdfs:label ?countryName.
        OPTIONAL { ?initiative Ellas:startDate ?startDate }
        OPTIONAL { ?initiative Ellas:initiative_status ?status }
        ${countryFilter}
      }
    `;
  }

  /**
   * Constrói consulta para fatores
   */
  private buildFactorQuery(countries: string[]): string {
    const countryFilter = countries.length > 0 
      ? `FILTER(${countries.map(c => `?countryName="${c}"@en`).join(" || ")})`
      : "";

    return `
      PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>
      PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
      
      SELECT ?factorName ?countryName ?impactType
      WHERE {
        ?factor a Ellas:ContextualFactor.
        ?factor rdfs:label ?factorName.
        ?factor Ellas:located_in ?country.
        ?country rdfs:label ?countryName.
        OPTIONAL { ?factor Ellas:impact_type ?impactType }
        ${countryFilter}
      }
    `;
  }

  /**
   * Constrói consulta dinâmica para grafo
   */
  async buildDynamicGraphQuery(
    category: string,
    filters: Record<string, any> = {}
  ): Promise<string> {
    try {
      console.log(`🔨 Construindo consulta dinâmica para ${category}:`, filters);
      
      // Converter filters para format esperado pelo queryBuilder
      const countries: string[] = [];
      
      // Se houver filtro de país nos filtros
      if (filters.country) {
        countries.push(filters.country);
      }
      
      return this.queryBuilder.buildDynamicQuery(category, countries, filters);
    } catch (error) {
      console.error(`❌ Erro ao construir consulta dinâmica:`, error);
      return "";
    }
  }

  /**
   * Explora dados dinâmicos baseados em categoria, caminho e campos extras
   * Este método é um alias para executeDynamicGraphQuery para compatibilidade
   */
  async exploreDynamicQuery(
    category: string,
    path: string[],
    extraFields: string[] = []
  ): Promise<any> {
    const result = await this.executeDynamicGraphQuery(category, path, extraFields);
    return result;
  }

  /**
   * Registra resultados da consulta para debugging
   */
  private logQueryResults(result: SPARQLResponse, category: string, path: string[]): void {
    if (result.results.bindings.length === 0) {
      console.warn("⚠️ Consulta não retornou resultados");
      return;
    }

    const bindingsLength = result.results.bindings.length;
    console.log(`📊 Consulta retornou ${bindingsLength} resultados`);

    // Alerta para possíveis dados de fallback
    if (bindingsLength === 44) {
      console.warn(`🚨 ALERTA: Sempre retorna 44 resultados! Pode ser dados de fallback!`);
      console.log(`🔍 Fonte dos dados:`, { category, path });
    }
  }
}
