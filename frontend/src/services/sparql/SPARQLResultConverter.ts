import { ISPARQLResultConverter, GraphOption, PropertyAvailability, SPARQLResponse } from "./interfaces";

/**
 * Conversor de resultados SPARQL para objetos do domínio
 * Princípio da Responsabilidade Única: Apenas converte dados
 */
export class SPARQLResultConverter implements ISPARQLResultConverter {
  /**
   * Converte resultados SPARQL gerais em GraphOptions
   */
  convertToGraphOptions(result: SPARQLResponse): GraphOption[] {
    if (!result?.results?.bindings) {
      return [];
    }

    return result.results.bindings.map((binding: any, index: number) => {
      // Detectar o tipo de resultado com base nas chaves disponíveis
      if (binding.property) {
        return this.convertPropertyBinding(binding);
      } else if (binding.value) {
        return this.convertValueBinding(binding);
      } else {
        return this.convertGenericBinding(binding, index);
      }
    });
  }

  /**
   * Converte resultados SPARQL em opções de propriedades
   */
  convertToPropertyOptions(bindings: any[]): GraphOption[] {
    return bindings.map(binding => this.convertPropertyBinding(binding));
  }

  /**
   * Converte resultados SPARQL em opções de valores
   */
  convertToValueOptions(bindings: any[]): GraphOption[] {
    return bindings.map(binding => this.convertValueBinding(binding));
  }

  /**
   * Converte binding de propriedade para GraphOption
   */
  private convertPropertyBinding(binding: any): GraphOption {
    const propertyUri = binding.property ? binding.property.value : "";
    const propertyName = propertyUri.split("#").pop() || propertyUri;
    const propertyLabel = binding.propertyLabel 
      ? binding.propertyLabel.value 
      : this.formatPropertyLabel(propertyName);
    const count = binding.count ? parseInt(binding.count.value) : 0;

    return {
      value: propertyName,
      label: propertyLabel,
      count: count,
      type: "property",
    };
  }

  /**
   * Converte binding de valor para GraphOption
   */
  private convertValueBinding(binding: any): GraphOption {
    const value = binding.value ? binding.value.value : "";
    const count = binding.count ? parseInt(binding.count.value) : 0;

    return {
      value: value,
      label: value,
      count: count,
      type: "value",
    };
  }

  /**
   * Converte binding genérico para GraphOption
   */
  private convertGenericBinding(binding: any, index: number): GraphOption {
    // Tentar encontrar uma propriedade que pareça um nome/label
    const keys = Object.keys(binding);
    const nameKey = keys.find(key => 
      key.includes('name') || key.includes('label') || key.includes('Name')
    ) || keys[0];

    const value = binding[nameKey] ? binding[nameKey].value : `Item ${index + 1}`;
    
    return {
      value: value,
      label: value,
      count: 1,
      type: "generic",
    };
  }

  /**
   * Converte resultados de consulta de disponibilidade
   */
  convertToAvailabilityInfo(result: SPARQLResponse): PropertyAvailability {
    if (!result?.results?.bindings?.[0]) {
      return {
        exists: false,
        entityCount: 0,
        valueCount: 0,
        isOptional: true,
      };
    }

    const binding = result.results.bindings[0];
    const entityCount = binding.entityCount ? parseInt(binding.entityCount.value) : 0;
    const valueCount = binding.valueCount ? parseInt(binding.valueCount.value) : 0;
    const entitiesWithProperty = binding.entitiesWithProperty ? parseInt(binding.entitiesWithProperty.value) : 0;

    return {
      exists: valueCount > 0,
      entityCount,
      valueCount,
      isOptional: entitiesWithProperty < entityCount,
    };
  }

  /**
   * Método legacy para compatibilidade
   */
  convertAvailabilityResult(bindings: any[]): {
    entityCount: number;
    valueCount: number;
    entitiesWithProperty: number;
  } {
    if (!bindings?.[0]) {
      return {
        entityCount: 0,
        valueCount: 0,
        entitiesWithProperty: 0,
      };
    }

    const binding = bindings[0];
    return {
      entityCount: binding.entityCount ? parseInt(binding.entityCount.value) : 0,
      valueCount: binding.valueCount ? parseInt(binding.valueCount.value) : 0,
      entitiesWithProperty: binding.entitiesWithProperty ? parseInt(binding.entitiesWithProperty.value) : 0,
    };
  }

  /**
   * Formata labels de propriedades de forma legível
   */
  formatPropertyLabel(propName: string): string {
    // Converter camelCase ou snake_case para palavras separadas e capitalizar
    return propName
      .replace(/_/g, " ")
      .replace(/([A-Z])/g, " $1")
      .replace(/^\w/, (c) => c.toUpperCase())
      .trim();
  }

  /**
   * Converte resultados em formato tabular
   */
  convertToTableData(result: SPARQLResponse): Array<Record<string, any>> {
    if (!result?.results?.bindings) {
      return [];
    }

    return result.results.bindings.map(binding => {
      const row: Record<string, any> = {};
      
      Object.keys(binding).forEach(key => {
        row[key] = binding[key]?.value || '';
      });
      
      return row;
    });
  }

  /**
   * Extrai nomes de colunas dos resultados SPARQL
   */
  extractColumnNames(result: SPARQLResponse): string[] {
    if (!result?.results?.bindings?.[0]) {
      return [];
    }

    return Object.keys(result.results.bindings[0]);
  }

  /**
   * Converte valores para diferentes tipos de dados
   */
  convertValue(value: any, type: 'string' | 'number' | 'boolean' | 'date' = 'string'): any {
    if (!value || !value.value) {
      return null;
    }

    const val = value.value;

    switch (type) {
      case 'number':
        return isNaN(Number(val)) ? 0 : Number(val);
      case 'boolean':
        return val === 'true' || val === '1';
      case 'date':
        return new Date(val);
      default:
        return val;
    }
  }
}
