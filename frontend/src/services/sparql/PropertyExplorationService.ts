import { ISPARQLExecutor, ISPARQLQueryBuilder, ISPARQLResultConverter, GraphOption, PropertyAvailability, EnhancedGraphOption } from './interfaces';

/**
 * Serviço para exploração de propriedades
 * Princípio da Responsabilidade Única: Explora propriedades e seus valores
 */
export class PropertyExplorationService {
  constructor(
    private executor: ISPARQLExecutor,
    private queryBuilder: ISPARQLQueryBuilder,
    private converter: ISPARQLResultConverter
  ) {}

  /**
   * Explora propriedades disponíveis para uma categoria
   */
  async explorePropertiesForClass(category: string): Promise<GraphOption[]> {
    try {
      console.log(`🔍 Explorando propriedades para categoria: ${category}`);

      const query = this.queryBuilder.buildPropertyExplorationQuery(category);
      const result = await this.executor.executeQuery(query);

      if (result.results.bindings.length > 0) {
        console.log(`✅ Encontradas ${result.results.bindings.length} propriedades para ${category}`);
        return this.converter.convertToGraphOptions(result);
      } else {
        console.warn(`⚠️ Nenhuma propriedade encontrada para ${category}`);
        return [];
      }
    } catch (error) {
      console.error(`❌ Erro ao explorar propriedades para ${category}:`, error);
      return [];
    }
  }

  /**
   * Explora valores possíveis para uma propriedade
   */
  async exploreValuesForProperty(
    category: string,
    property: string,
    filters: Record<string, any> = {}
  ): Promise<GraphOption[]> {
    try {
      console.log(`🔍 Explorando valores para propriedade: ${property} na categoria: ${category}`);

      // Detectar categoria correta se necessário
      const actualCategory = this.detectCorrectCategory(category, property);
      
      const query = this.queryBuilder.buildValueExplorationQuery(actualCategory, property, filters);
      const result = await this.executor.executeQuery(query);

      if (result.results.bindings.length > 0) {
        console.log(`✅ Encontrados ${result.results.bindings.length} valores para ${property}`);
        return this.converter.convertToGraphOptions(result);
      } else {
        console.warn(`⚠️ Nenhum valor encontrado para propriedade ${property}`);
        return this.trySimplifiedQuery(actualCategory, property);
      }
    } catch (error) {
      console.error(`❌ Erro ao explorar valores para ${property}:`, error);
      return [];
    }
  }

  /**
   * Verifica disponibilidade de uma propriedade
   */
  async checkPropertyAvailability(
    category: string,
    property: string
  ): Promise<PropertyAvailability> {
    try {
      console.log(`🔍 Verificando disponibilidade da propriedade ${property} para categoria ${category}`);

      const query = this.queryBuilder.buildPropertyAvailabilityQuery(category, property);
      const result = await this.executor.executeQuery(query);

      if (result.results.bindings.length > 0) {
        return this.converter.convertToAvailabilityInfo(result);
      }
    } catch (error) {
      console.error(`❌ Erro ao verificar disponibilidade da propriedade ${property}:`, error);
    }

    return {
      exists: false,
      entityCount: 0,
      valueCount: 0,
      isOptional: true,
    };
  }

  /**
   * Explora propriedades com informações de disponibilidade
   */
  async explorePropertiesWithAvailability(category: string): Promise<EnhancedGraphOption[]> {
    try {
      console.log(`🔍 Explorando propriedades com disponibilidade para: ${category}`);

      const properties = await this.explorePropertiesForClass(category);

      const propertiesWithAvailability = await Promise.all(
        properties.map(async (prop) => {
          const availability = await this.checkPropertyAvailability(category, prop.value);
          const coverage = availability.entityCount > 0
            ? (availability.valueCount / availability.entityCount) * 100
            : 0;

          return {
            ...prop,
            availability: {
              exists: availability.exists,
              coverage,
              isOptional: availability.isOptional,
            },
          };
        })
      );

      // Ordenar por cobertura
      return propertiesWithAvailability.sort((a, b) => {
        const coverageA = a.availability?.coverage || 0;
        const coverageB = b.availability?.coverage || 0;
        return coverageB - coverageA;
      });
    } catch (error) {
      console.error(`❌ Erro ao explorar propriedades com disponibilidade:`, error);
      return [];
    }
  }

  /**
   * Detecta a categoria correta para uma propriedade
   */
  private detectCorrectCategory(category: string, property: string): string {
    // Detecção baseada em prefixos comuns
    if (property.startsWith("policy_") || property.includes("Policy")) {
      return "Policy";
    }
    if (property.startsWith("initiative_") || property.includes("Initiative")) {
      return "Initiative";
    }
    if (property.startsWith("factor_") || property.includes("Factor") || property.includes("factors_")) {
      return "Factor";
    }
    
    console.log(`🔄 Mantendo categoria original: ${category} para propriedade: ${property}`);
    return category;
  }

  /**
   * Tenta uma consulta simplificada quando a principal falha
   */
  private async trySimplifiedQuery(category: string, property: string): Promise<GraphOption[]> {
    try {
      console.log(`🔧 Tentando consulta simplificada para ${property}...`);

      const simpleQuery = `
        PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        
        SELECT DISTINCT ?value
        WHERE {
          ?s Ellas:${property} ?propValue .
          OPTIONAL { ?propValue rdfs:label ?label }
          BIND(COALESCE(?label, STR(?propValue)) AS ?value)
          FILTER(?value != "")
        }
        LIMIT 20
      `;

      const result = await this.executor.executeQuery(simpleQuery);

      if (result.results.bindings.length > 0) {
        console.log(`✅ Consulta simplificada funcionou! Encontrados ${result.results.bindings.length} valores`);
        
        return result.results.bindings.map((binding: any, index: number) => ({
          value: binding.value ? binding.value.value : `Valor ${index + 1}`,
          label: binding.value ? binding.value.value : `Valor ${index + 1}`,
          count: 1,
          type: "value",
        }));
      }
    } catch (error) {
      console.error(`❌ Consulta simplificada também falhou:`, error);
    }

    return [];
  }

  /**
   * Detectar categoria apropriada para uma propriedade dinamicamente
   */
  async detectCategoryForProperty(property: string): Promise<string> {
    console.log(`🔍 Detectando categoria para propriedade: ${property}`);

    // Mapeamento baseado em prefixos comuns
    if (property.startsWith("policy_") || property.includes("Policy")) {
      return "Policy";
    }
    if (property.startsWith("initiative_") || property.includes("Initiative")) {  
      return "Initiative";
    }
    if (property.startsWith("factor_") || property.includes("Factor") || property.includes("factors_")) {
      return "Factor";
    }

    // Tentar detectar dinamicamente consultando a ontologia
    try {
      const query = `
        PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        
        SELECT DISTINCT ?type (COUNT(?s) as ?count)
        WHERE {
          ?s ?prop ?value .
          ?s rdf:type ?type .
          FILTER(?prop = Ellas:${property})
          FILTER(STRSTARTS(STR(?type), "https://ellas.ufmt.br/Ontology/Ellas#"))
        }
        GROUP BY ?type
        ORDER BY DESC(?count)
        LIMIT 1
      `;

      const result = await this.executor.executeQuery(query);
      
      if (result?.results?.bindings?.length > 0) {
        const typeUri = result.results.bindings[0].type.value;
        const detectedCategory = typeUri.split("#").pop() || typeUri;
        console.log(`✅ Categoria detectada automaticamente: ${detectedCategory}`);
        return detectedCategory;
      }
    } catch (error) {
      console.error(`❌ Erro ao detectar categoria para ${property}:`, error);
    }

    // Fallback para categoria padrão
    console.log(`⚠️ Usando categoria padrão 'Initiative' para ${property}`);
    return "Initiative";
  }
}
