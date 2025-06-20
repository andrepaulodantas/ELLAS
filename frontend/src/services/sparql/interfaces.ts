// Interfaces comuns para o sistema SPARQL
export interface GraphOption {
  value: string;
  label: string;
  count?: number;
  type?: string;
}

export interface QueryResult {
  label?: { value: string };
  created_in?: { value: string };
  start_date?: { value: string };
  entity?: { value: string };
  [key: string]: { value: string } | undefined;
}

export interface PropertyAvailability {
  exists: boolean;
  entityCount: number;
  valueCount: number;
  isOptional: boolean;
}

export interface EnhancedGraphOption extends GraphOption {
  availability?: {
    exists: boolean;
    coverage: number;
    isOptional: boolean;
  };
}

export interface FilterOptions {
  [key: string]: any;
}

export interface SPARQLResponse {
  results: {
    bindings: any[];
  };
}

// Interfaces dos serviços SPARQL
export interface ISPARQLExecutor {
  executeQuery(query: string): Promise<SPARQLResponse>;
}

export interface ISPARQLQueryBuilder {
  buildPropertyExplorationQuery(category: string): string;
  buildValueExplorationQuery(category: string, property: string, filters: Record<string, any>): string;
  buildPropertyAvailabilityQuery(category: string, property: string): string;
  buildDynamicQuery(category: string, countries: string[], filters: Record<string, any>): string;
}

export interface ISPARQLResultConverter {
  convertToGraphOptions(result: SPARQLResponse): GraphOption[];
  convertToAvailabilityInfo(result: SPARQLResponse): PropertyAvailability;
  formatPropertyLabel(propName: string): string;
}
