import { ISPARQLExecutor, ISPARQLQueryBuilder, ISPARQLResultConverter, GraphOption, PropertyAvailability, EnhancedGraphOption } from './interfaces';

/**
 * Serviço responsável por explorar propriedades e valores da ontologia
 * Implementa o princípio de Responsabilidade Única
 */
export class PropertyExplorationService {
  constructor(
    private sparqlExecutor: ISPARQLExecutor,
    private queryBuilder: ISPARQLQueryBuilder,
    private resultConverter: ISPARQLResultConverter
  ) {}

  /**
   * Explorar propriedades disponíveis para uma classe
   */
  async explorePropertiesForClass(category: string): Promise<GraphOption[]> {
    console.log(`🔍 Explorando propriedades para categoria: ${category}`);
    
    try {
      const query = `
        PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        
        SELECT DISTINCT ?property ?propertyLabel (COUNT(DISTINCT ?s) as ?count)
        WHERE {
          ?s rdf:type Ellas:${category} .
          ?s ?property ?value .
          
          # Filtrar apenas propriedades Ellas
          FILTER(STRSTARTS(STR(?property), "https://ellas.ufmt.br/Ontology/Ellas#"))
          
          # Obter label da propriedade se disponível
          OPTIONAL { ?property rdfs:label ?propertyLabel }
          
          # Excluir propriedades comuns do RDF/RDFS/OWL
          FILTER(?property != rdf:type)
          FILTER(?property != rdfs:label)
        }
        GROUP BY ?property ?propertyLabel
        ORDER BY DESC(?count)
        LIMIT 50
      `;

      const result = await this.sparqlExecutor.executeQuery(query);
      
      if (result?.results?.bindings?.length > 0) {
        console.log(`✅ Encontradas ${result.results.bindings.length} propriedades para ${category}`);
        
        return result.results.bindings.map((binding: any) => {
          const propertyUri = binding.property ? binding.property.value : "";
          const propertyName = propertyUri.split("#").pop() || propertyUri;
          const propertyLabel = binding.propertyLabel 
            ? binding.propertyLabel.value 
            : this.resultConverter.formatPropertyLabel(propertyName);
          const count = binding.count ? parseInt(binding.count.value) : 0;

          return {
            value: propertyName,
            label: propertyLabel,
            count: count,
            type: "property",
          };
        });
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
   * Explorar valores possíveis para uma propriedade específica
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
        console.log(`🔧 Construindo ${Object.keys(filters).length} cláusulas de filtro...`);
        Object.entries(filters).forEach(([filterProp, filterValue]) => {
          if (!filterProp || !filterValue) return;

          filterClauses += `?s Ellas:${filterProp} ?${filterProp}Filter .\n`;

          if (typeof filterValue === "object" && filterValue !== null) {
            if (filterValue.iri) {
              filterClauses += `  FILTER(?${filterProp}Filter = <${filterValue.iri}>) .\n`;
            } else if (filterValue.value) {
              filterClauses += `  FILTER(STR(?${filterProp}Filter) = "${filterValue.value}") .\n`;
            }
          } else {
            filterClauses += `  FILTER(STR(?${filterProp}Filter) = "${filterValue}" || ?${filterProp}Filter = "${filterValue}"@en) .\n`;
          }
        });
      }

      const query = `
        PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        
        SELECT DISTINCT ?value (COUNT(DISTINCT ?s) as ?count)
        WHERE {
          ?s rdf:type Ellas:${actualCategory} .
          
          OPTIONAL {
            ?s Ellas:${property} ?propValue .
            
            OPTIONAL { 
              ?propValue rdfs:label ?label .
              FILTER(LANG(?label) = "en" || LANG(?label) = "" || LANG(?label) = "pt" || LANG(?label) = "es")
            }
            BIND(COALESCE(?label, STR(?propValue)) AS ?value)
          }
          
          FILTER(BOUND(?value) && ?value != "")
          
          ${filterClauses}
        }
        GROUP BY ?value
        ORDER BY DESC(?count)
        LIMIT 100
      `;

      console.log(`📝 Executando consulta SPARQL:`, query);
      const result = await this.sparqlExecutor.executeQuery(query);

      if (result?.results?.bindings?.length > 0) {
        console.log(`✅ Encontrados ${result.results.bindings.length} valores para ${property}`);
        
        return result.results.bindings.map((binding: any) => {
          const value = binding.value ? binding.value.value : "";
          const count = binding.count ? parseInt(binding.count.value) : 0;

          return {
            value: value,
            label: value,
            count: count,
            type: "value",
          };
        });
      } else {
        console.warn(`⚠️ Propriedade ${property} não tem dados disponíveis`);
        return [];
      }
    } catch (error) {
      console.error(`❌ Erro ao explorar valores para ${property}:`, error);
      return [];
    }
  }

  /**
   * Verificar disponibilidade de uma propriedade
   */
  async checkPropertyAvailability(category: string, property: string): Promise<PropertyAvailability> {
    console.log(`🔍 Verificando disponibilidade da propriedade: ${property} para ${category}`);

    try {
      const query = `
        PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        
        SELECT 
          (COUNT(DISTINCT ?s) as ?entityCount) 
          (COUNT(DISTINCT ?propValue) as ?valueCount)
          (COUNT(DISTINCT ?entitiesWithProp) as ?entitiesWithProperty)
        WHERE {
          ?s rdf:type Ellas:${category} .
          OPTIONAL { 
            ?s Ellas:${property} ?propValue 
            BIND(?s as ?entitiesWithProp)
          }
        }
      `;

      const result = await this.sparqlExecutor.executeQuery(query);

      if (result?.results?.bindings?.length > 0) {
        const binding = result.results.bindings[0];
        const entityCount = binding.entityCount ? parseInt(binding.entityCount.value) : 0;
        const valueCount = binding.valueCount ? parseInt(binding.valueCount.value) : 0;
        const entitiesWithProperty = binding.entitiesWithProperty ? parseInt(binding.entitiesWithProperty.value) : 0;

        const exists = valueCount > 0;
        const isOptional = entitiesWithProperty < entityCount;

        console.log(`📊 Estatísticas para ${property}:`, {
          entityCount,
          valueCount,
          entitiesWithProperty,
          exists,
          isOptional,
          coverage: entityCount > 0 ? ((entitiesWithProperty / entityCount) * 100).toFixed(1) + "%" : "0%",
        });

        return {
          exists,
          entityCount,
          valueCount,
          isOptional,
        };
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
   * Explorar propriedades com informações de disponibilidade
   */
  async explorePropertiesWithAvailability(category: string): Promise<EnhancedGraphOption[]> {
    console.log(`🔍 Explorando propriedades com informações de disponibilidade para: ${category}`);

    try {
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

      const sortedProperties = propertiesWithAvailability.sort((a, b) => {
        const coverageA = a.availability?.coverage || 0;
        const coverageB = b.availability?.coverage || 0;
        return coverageB - coverageA;
      });

      console.log(`📋 Propriedades com informações de disponibilidade:`, sortedProperties);
      return sortedProperties;
    } catch (error) {
      console.error(`❌ Erro ao explorar propriedades com disponibilidade:`, error);
      return [];
    }
  }

  /**
   * Detectar categoria apropriada para uma propriedade
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

      const result = await this.sparqlExecutor.executeQuery(query);
      
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
