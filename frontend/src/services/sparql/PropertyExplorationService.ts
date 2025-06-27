import { ISPARQLExecutor, ISPARQLQueryBuilder, ISPARQLResultConverter, GraphOption, PropertyAvailability, EnhancedGraphOption } from './interfaces';
import { requestManager } from './RequestManager';

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
  async explorePropertiesForCategory(category: string): Promise<GraphOption[]> {
    console.log(`🔍 Explorando propriedades para categoria: ${category}`);

    try {
      let query;
      
      if (category === 'Factor') {
        // Consulta específica para Fatores que considera a hierarquia de classes
        query = `
          PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>
          PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
          PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
          
          SELECT DISTINCT ?property (STRAFTER(STR(?property), STR(Ellas:)) as ?propertyLabel) (COUNT(DISTINCT ?s) as ?count)
          WHERE {
            {
              # Buscar fatores diretos
              ?s rdf:type Ellas:Factor .
              ?s ?property ?value .
            }
            UNION
            {
              # Buscar fatores contextuais
              ?s rdf:type ?type .
              ?type rdfs:subClassOf Ellas:Factor .
              ?s ?property ?value .
            }
            
            # Filtrar apenas propriedades Ellas e remover propriedades do sistema
            FILTER(STRSTARTS(STR(?property), STR(Ellas:)))
            FILTER(?property NOT IN (
              rdf:type,
              rdfs:label,
              rdfs:subClassOf
            ))
          }
          GROUP BY ?property
          ORDER BY DESC(?count)
        `;
      } else {
        // Consulta padrão para outras categorias
        query = `
          PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>
          PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
          PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
          
          SELECT DISTINCT ?property (STRAFTER(STR(?property), STR(Ellas:)) as ?propertyLabel) (COUNT(?s) as ?count)
          WHERE {
            ?s rdf:type Ellas:${category} .
            ?s ?property ?value .
            
            # Filtrar apenas propriedades Ellas e remover propriedades do sistema
            FILTER(STRSTARTS(STR(?property), STR(Ellas:)))
            FILTER(?property NOT IN (
              rdf:type,
              rdfs:label,
              rdfs:subClassOf
            ))
          }
          GROUP BY ?property
          ORDER BY DESC(?count)
        `;
      }

      console.log("📝 Executando consulta:", query);
      const result = await this.executor.executeQuery(query);
      
      if (!result?.results?.bindings) {
        console.log("⚠️ Nenhuma propriedade encontrada");
        return [];
      }

      const properties = result.results.bindings.map(binding => ({
        value: binding.propertyLabel.value,
        label: this.formatPropertyLabel(binding.propertyLabel.value),
        count: parseInt(binding.count.value),
        type: 'property'
      }));

      console.log(`✅ Encontradas ${properties.length} propriedades:`, properties);
      return properties;
    } catch (error) {
      console.error("❌ Erro ao explorar propriedades:", error);
      throw error;
    }
  }

  /**
   * Formata o label da propriedade para exibição
   */
  private formatPropertyLabel(propertyName: string): string {
    // Remove prefixo "factors_" se existir
    const name = propertyName.replace(/^factors_/, '');
    
    // Substitui underscores por espaços e capitaliza cada palavra
    return name
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  /**
   * Explora valores possíveis para uma propriedade
   */
  async exploreValuesForProperty(
    category: string,
    property: string,
    filters: Record<string, any> = {}
  ): Promise<GraphOption[]> {
    console.log(`🔍 Explorando valores para propriedade: ${property} na categoria: ${category}`);
    console.log(`📋 Filtros aplicados:`, filters);

    try {
      // Detectar automaticamente a categoria correta se necessário
      let actualCategory = category;
      
      if (
        (property.startsWith("factors_") && category !== "Factor") ||
        (property.startsWith("initiative_") && category !== "Initiative") ||
        (property.startsWith("policy_") && category !== "Policy")
      ) {
        console.log(`🔄 Detectando categoria automática para ${property}...`);
        actualCategory = await this.detectCategoryForProperty(property);
      }

      console.log(`📊 Usando categoria: ${actualCategory} para propriedade: ${property}`);

      // Construir cláusulas de filtro
      let filterClauses = "";
      if (Object.keys(filters).length > 0) {
        Object.entries(filters).forEach(([filterProp, filterValue]) => {
          if (!filterProp || !filterValue) return;
          if (actualCategory === 'Factor') {
            filterClauses += `
              ?contextualFactor Ellas:${filterProp} ?${filterProp}Filter .
              FILTER(STR(?${filterProp}Filter) = "${filterValue}" || ?${filterProp}Filter = "${filterValue}"@en)
            `;
          } else {
            filterClauses += `
              ?s Ellas:${filterProp} ?${filterProp}Filter .
              FILTER(STR(?${filterProp}Filter) = "${filterValue}" || ?${filterProp}Filter = "${filterValue}"@en)
            `;
          }
        });
      }

      let query;
      
      if (actualCategory === 'Factor') {
        // Consulta específica para valores de propriedades de Fatores
        query = `
          PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>
          PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
          PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
          
          SELECT DISTINCT ?value (COUNT(DISTINCT ?s) as ?count)
          WHERE {
            {
              # Buscar valores de fatores diretos
              ?s rdf:type Ellas:Factor .
              ?s Ellas:${property} ?propValue .
            }
            UNION
            {
              # Buscar valores de fatores contextuais
              ?s rdf:type ?type .
              ?type rdfs:subClassOf Ellas:Factor .
              ?s Ellas:${property} ?propValue .
            }
            
            OPTIONAL {
              ?propValue rdfs:label ?label .
              FILTER(LANG(?label) = "en" || LANG(?label) = "")
            }
            
            BIND(COALESCE(?label, STR(?propValue)) as ?value)
            
            ${filterClauses}
          }
          GROUP BY ?value
          ORDER BY DESC(?count)
        `;
      } else {
        // Consulta padrão para outras categorias
        query = `
          PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>
          PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
          PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
          
          SELECT DISTINCT ?value (COUNT(?s) as ?count)
          WHERE {
            ?s rdf:type Ellas:${actualCategory} .
            ?s Ellas:${property} ?propValue .
            
            OPTIONAL {
              ?propValue rdfs:label ?label .
              FILTER(LANG(?label) = "en" || LANG(?label) = "")
            }
            
            BIND(COALESCE(?label, STR(?propValue)) as ?value)
            
            ${filterClauses}
          }
          GROUP BY ?value
          ORDER BY DESC(?count)
        `;
      }

      const result = await this.executor.executeQuery(query);
      
      if (!result?.results?.bindings) {
        console.log("⚠️ Nenhum valor encontrado");
        return [];
      }

      const values = result.results.bindings.map(binding => ({
        value: binding.value.value,
        label: binding.value.value,
        count: parseInt(binding.count.value),
        type: 'value'
      }));

      console.log(`✅ Encontrados ${values.length} valores distintos`);
      return values;
    } catch (error) {
      console.error("❌ Erro ao explorar valores:", error);
      throw error;
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

      const properties = await this.explorePropertiesForCategory(category);

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
