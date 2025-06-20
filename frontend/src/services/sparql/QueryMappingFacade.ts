// Facade service que integra todos os módulos SPARQL seguindo os princípios SOLID
import { ISPARQLExecutor } from './interfaces';
import { SPARQLExecutor } from './SPARQLExecutor';
import { SPARQLQueryBuilder } from './SPARQLQueryBuilder';
import { SPARQLResultConverter } from './SPARQLResultConverter';
import { CategoryPropertyMapper } from './CategoryPropertyMapper';
import { PropertyExplorationService } from './PropertyExplorationService';
import { DynamicQueryService } from './DynamicQueryService';
import { GraphOption } from './interfaces';

/**
 * Facade que coordena todos os serviços SPARQL
 * Implementa o padrão Facade para simplificar a interface externa
 */
export class QueryMappingFacade {
  private sparqlExecutor: ISPARQLExecutor;
  private queryBuilder: SPARQLQueryBuilder;
  private resultConverter: SPARQLResultConverter;
  private categoryMapper: CategoryPropertyMapper;
  private propertyExplorer: PropertyExplorationService;
  private dynamicQuery: DynamicQueryService;

  constructor() {
    // Injeção de dependências seguindo o princípio de Inversão de Dependência
    this.sparqlExecutor = new SPARQLExecutor();
    this.queryBuilder = new SPARQLQueryBuilder();
    this.resultConverter = new SPARQLResultConverter();
    this.categoryMapper = new CategoryPropertyMapper();
    this.propertyExplorer = new PropertyExplorationService(
      this.sparqlExecutor,
      this.queryBuilder,
      this.resultConverter
    );
    this.dynamicQuery = new DynamicQueryService(
      this.sparqlExecutor,
      this.queryBuilder
    );
  }

  // Métodos públicos que delegam para os serviços apropriados
  
  /**
   * Obter consultas predefinidas por categoria
   */
  async getAvailableQueriesByCategory(category: string) {
    // Implementação temporária - pode ser expandida futuramente
    const predefinedQueries = [
      'policies_applied_in_countries',
      'policy_types_in_latin_america', 
      'policies_promoting_women_in_stem',
      'initiatives_by_country',
      'active_initiatives',
      'positive_contextual_factors'
    ];
    
    return predefinedQueries.filter(query => 
      query.toLowerCase().includes(category.toLowerCase())
    );
  }

  /**
   * Executar consulta predefinida
   */
  async executeQuery(queryName: string) {
    // Implementação temporária - delegando para dynamic query
    console.log(`🔍 Executando consulta predefinida: ${queryName}`);
    return this.dynamicQuery.executeQueryWithParams('Initiative', [], {});
  }

  /**
   * Executar consulta com parâmetros dinâmicos
   */
  async executeQueryWithParams(
    category: string, 
    countries: string[] = [], 
    filters: Record<string, any> = {}
  ) {
    return this.dynamicQuery.executeQueryWithParams(category, countries, filters);
  }

  /**
   * Explorar propriedades para uma classe
   */
  async explorePropertiesForClass(category: string): Promise<GraphOption[]> {
    return this.propertyExplorer.explorePropertiesForClass(category);
  }

  /**
   * Explorar valores para uma propriedade
   */
  async exploreValuesForProperty(
    category: string,
    property: string,
    filters?: Record<string, any>
  ): Promise<GraphOption[]>;
  async exploreValuesForProperty(
    category: string,
    path: string[],
    extraFields: string[]
  ): Promise<any>;
  async exploreValuesForProperty(
    category: string,
    propertyOrPath: string | string[],
    filtersOrExtraFields: Record<string, any> | string[] = {}
  ): Promise<GraphOption[] | any> {
    if (Array.isArray(propertyOrPath)) {
      // Segunda sobrecarga: exploreDynamicQuery
      const path = propertyOrPath;
      const extraFields = filtersOrExtraFields as string[];
      return this.dynamicQuery.exploreDynamicQuery(category, path, extraFields);
    } else {
      // Primeira sobrecarga: exploreValuesForProperty original
      const property = propertyOrPath;
      const filters = filtersOrExtraFields as Record<string, any>;
      return this.propertyExplorer.exploreValuesForProperty(category, property, filters || {});
    }
  }

  /**
   * Construir consulta dinâmica para grafo
   */
  async buildDynamicGraphQuery(
    category: string,
    filters: Record<string, any> = {}
  ): Promise<string> {
    return this.dynamicQuery.buildDynamicGraphQuery(category, filters);
  }

  /**
   * Executar consulta dinâmica para grafo
   */
  async executeDynamicGraphQuery(
    category: string,
    filters: Record<string, any> = {}
  ) {
    // Converter filters para array de strings para compatibilidade
    const countries: string[] = [];
    if (filters.country) {
      if (Array.isArray(filters.country)) {
        countries.push(...filters.country);
      } else {
        countries.push(filters.country);
      }
    }
    
    return this.dynamicQuery.executeQueryWithParams(category, countries, filters);
  }

  /**
   * Verificar disponibilidade de propriedade
   */
  async checkPropertyAvailability(category: string, property: string) {
    return this.propertyExplorer.checkPropertyAvailability(category, property);
  }

  /**
   * Explorar propriedades com informações de disponibilidade
   */
  async explorePropertiesWithAvailability(category: string) {
    return this.propertyExplorer.explorePropertiesWithAvailability(category);
  }

  /**
   * Obter tipos de consulta
   */
  getQueryTypes(): string[] {
    return this.categoryMapper.getQueryTypes();
  }

  /**
   * Obter opções de filtro
   */
  getFilterOptions(): Record<string, string[]> {
    return this.categoryMapper.getFilterOptions();
  }

  /**
   * Obter categorias raiz
   */
  getRootCategories(): string[] {
    return this.categoryMapper.getRootCategories();
  }

  /**
   * Verificar se é nível raiz
   */
  isRootLevel(category: string): boolean {
    return this.categoryMapper.isRootLevel(category);
  }

  /**
   * Detectar categoria para propriedade
   */
  async detectCategoryForProperty(property: string): Promise<string> {
    return this.propertyExplorer.detectCategoryForProperty(property);
  }

  /**
   * Formatar label de propriedade
   */
  formatPropertyLabel(propName: string): string {
    return this.resultConverter.formatPropertyLabel(propName);
  }
}

// Exportar instância singleton
export const queryMappingFacade = new QueryMappingFacade();
export default queryMappingFacade;
