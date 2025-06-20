/**
 * Mapeador de categorias e propriedades
 * Princípio da Responsabilidade Única: Apenas mapeia categorias e propriedades
 */
export class CategoryPropertyMapper {
  private static readonly PROPERTY_CATEGORY_MAP: Record<string, string> = {
    // Initiative properties
    'initiative_reach': 'Initiative',
    'initiative_status': 'Initiative',
    'initiative_type': 'Initiative',
    'initiative_data_source': 'Initiative',
    'initiative_coordinator_gender': 'Initiative',
    'initiative_organization_sector': 'Initiative',
    'initiative_format': 'Initiative',
    'funded_by': 'Initiative',
    'website': 'Initiative',
    
    // Policy properties
    'policy_type': 'Policy',
    'policy_impact': 'Policy',
    'policy_impact_description': 'Policy',
    'target_audience': 'Policy',
    
    // Factor properties
    'factor_type': 'Factor',
    'impact_type': 'Factor',
    'severity_level': 'Factor',
    'temporal_scope': 'Factor',
    'affects_population': 'Factor',
    'impact_level': 'Factor',
    'target_group': 'Factor',
    
    // Common properties
    'created_in': 'All',
    'located_in': 'All',
    'start_date': 'All',
    'end_date': 'All',
    'description': 'All',
    'objective': 'All',
  };

  /**
   * Mapeia uma propriedade para sua categoria
   */
  mapPropertyToCategory(property: string): string | null {
    // Verifica mapeamento direto
    if (CategoryPropertyMapper.PROPERTY_CATEGORY_MAP[property]) {
      const category = CategoryPropertyMapper.PROPERTY_CATEGORY_MAP[property];
      return category === 'All' ? null : category;
    }

    // Mapeia por prefixo
    if (property.startsWith('initiative_')) return 'Initiative';
    if (property.startsWith('policy_')) return 'Policy';
    if (property.startsWith('factor_')) return 'Factor';

    return null;
  }

  /**
   * Obter tipos de consulta disponíveis
   */
  getQueryTypes(): string[] {
    return [
      'Policy',
      'Initiative', 
      'Factor',
      'ContextualFactor'
    ];
  }

  /**
   * Obter opções de filtro disponíveis
   */
  getFilterOptions(): Record<string, string[]> {
    return {
      Policy: [
        'policy_type',
        'target_audience',
        'policy_impact',
        'created_in',
        'start_date'
      ],
      Initiative: [
        'initiative_status',
        'initiative_type',
        'initiative_reach',
        'initiative_format',
        'funded_by',
        'located_in'
      ],
      Factor: [
        'factor_type',
        'impact_type',
        'severity_level',
        'temporal_scope',
        'target_group'
      ]
    };
  }

  /**
   * Obtém as categorias raiz do sistema
   */
  getRootCategories(): string[] {
    return ['Policy', 'Initiative', 'Factor'];
  }

  /**
   * Obtém as categorias raiz com detalhes completos
   */
  getRootCategoriesWithDetails(): Array<{ value: string; label: string; count: number; type: string }> {
    return [
      { value: "Initiative", label: "Iniciativas", count: 245, type: "category" },
      { value: "Policy", label: "Políticas", count: 88, type: "category" },
      { value: "Factor", label: "Fatores", count: 52, type: "category" },
    ];
  }

  /**
   * Verifica se estamos no nível raiz
   */
  isRootLevel(category: string | null): boolean {
    return !category || category === "";
  }

  /**
   * Obtém propriedades válidas para uma categoria
   */
  getValidPropertiesForCategory(category: string): string[] {
    const categoryMap: Record<string, string[]> = {
      Policy: [
        "created_in",
        "policy_type",
        "start_date",
        "policy_impact",
        "target_audience",
        "description",
        "objective",
        "policy_impact_description",
        "end_date",
      ],
      Initiative: [
        "created_in",
        "initiative_reach",
        "start_date",
        "initiative_status",
        "initiative_type",
        "initiative_data_source",
        "initiative_coordinator_gender",
        "initiative_organization_sector",
        "initiative_format",
        "funded_by",
        "website",
        "description",
        "objective",
        "end_date",
      ],
      Factor: [
        "created_in",
        "impact_type",
        "factor_type",
        "severity_level",
        "temporal_scope",
        "affects_population",
        "impact_level",
        "target_group",
        "description",
        "start_date",
      ],
    };

    return categoryMap[category] || [];
  }

  /**
   * Detecta automaticamente a categoria para uma propriedade
   */
  detectCategoryForProperty(property: string): string {
    const mapped = this.mapPropertyToCategory(property);
    if (mapped) return mapped;

    // Fallback para Initiative se não conseguir detectar
    console.warn(`⚠️ Não foi possível detectar categoria para ${property}, usando Initiative como padrão`);
    return 'Initiative';
  }
}
