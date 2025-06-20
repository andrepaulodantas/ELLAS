// Serviço principal refatorado seguindo princípios SOLID
// Substitui o queryMappingService.ts monolítico

import { QueryMappingFacade } from './sparql/QueryMappingFacade';
import { GraphOption } from './sparql/interfaces';

// Instância principal do serviço
const queryMappingFacade = new QueryMappingFacade();

// Funções principais exportadas mantendo compatibilidade com o código existente

/**
 * Obter consultas disponíveis por categoria
 */
export const getAvailableQueriesByCategory = async (category: string) => {
  return queryMappingFacade.getAvailableQueriesByCategory(category);
};

/**
 * Executar consulta predefinida
 */
export const executeQuery = async (queryName: string) => {
  return queryMappingFacade.executeQuery(queryName);
};

/**
 * Executar consulta com parâmetros dinâmicos
 */
export const executeQueryWithParams = async (
  category: string, 
  countries: string[] = [], 
  filters: Record<string, any> = {}
) => {
  return queryMappingFacade.executeQueryWithParams(category, countries, filters);
};

/**
 * Explorar propriedades para uma classe
 */
export const explorePropertiesForClass = async (category: string): Promise<GraphOption[]> => {
  return queryMappingFacade.explorePropertiesForClass(category);
};

/**
 * Explorar valores para uma propriedade
 */
export const exploreValuesForProperty = async (
  category: string,
  property: string,
  filters: Record<string, any> = {}
): Promise<GraphOption[]> => {
  return queryMappingFacade.exploreValuesForProperty(category, property, filters);
};

/**
 * Construir consulta dinâmica para grafo
 */
export const buildDynamicGraphQuery = async (
  category: string,
  filters: Record<string, any> = {}
): Promise<string> => {
  return queryMappingFacade.buildDynamicGraphQuery(category, filters);
};

/**
 * Executar consulta dinâmica para grafo
 */
export const executeDynamicGraphQuery = async (
  category: string,
  filters: Record<string, any> = {}
) => {
  return queryMappingFacade.executeDynamicGraphQuery(category, filters);
};

/**
 * Verificar disponibilidade de propriedade
 */
export const checkPropertyAvailability = async (category: string, property: string) => {
  return queryMappingFacade.checkPropertyAvailability(category, property);
};

/**
 * Explorar propriedades com informações de disponibilidade
 */
export const explorePropertiesWithAvailability = async (category: string) => {
  return queryMappingFacade.explorePropertiesWithAvailability(category);
};

/**
 * Obter tipos de consulta
 */
export const getQueryTypes = (): string[] => {
  return queryMappingFacade.getQueryTypes();
};

/**
 * Obter opções de filtro
 */
export const getFilterOptions = (): Record<string, string[]> => {
  return queryMappingFacade.getFilterOptions();
};

/**
 * Obter categorias raiz
 */
export const getRootCategories = (): string[] => {
  return queryMappingFacade.getRootCategories();
};

/**
 * Verificar se é nível raiz
 */
export const isRootLevel = (category: string): boolean => {
  return queryMappingFacade.isRootLevel(category);
};

/**
 * Detectar categoria para propriedade
 */
export const detectCategoryForProperty = async (property: string): Promise<string> => {
  return queryMappingFacade.detectCategoryForProperty(property);
};

/**
 * Formatar label de propriedade
 */
export const formatPropertyLabel = (propName: string): string => {
  return queryMappingFacade.formatPropertyLabel(propName);
};

// Exportar o serviço principal como default para compatibilidade
const queryMappingService = {
  getAvailableQueriesByCategory,
  executeQuery,
  executeQueryWithParams,
  explorePropertiesForClass,
  exploreValuesForProperty,
  buildDynamicGraphQuery,
  executeDynamicGraphQuery,
  checkPropertyAvailability,
  explorePropertiesWithAvailability,
  getQueryTypes,
  getFilterOptions,
  getRootCategories,
  isRootLevel,
  detectCategoryForProperty,
  formatPropertyLabel,
};

export default queryMappingService;

// Exportar tipos para compatibilidade
export type { GraphOption } from './sparql/interfaces';

// Log de inicialização
console.log('🏗️ QueryMappingService refatorado com arquitetura SOLID iniciado');
console.log('📋 Princípios SOLID implementados:');
console.log('   ✅ Single Responsibility: Cada classe tem uma responsabilidade única');
console.log('   ✅ Open/Closed: Aberto para extensão, fechado para modificação');
console.log('   ✅ Liskov Substitution: Interfaces permitem substituição');
console.log('   ✅ Interface Segregation: Interfaces pequenas e específicas');
console.log('   ✅ Dependency Inversion: Dependências abstraídas por interfaces');
