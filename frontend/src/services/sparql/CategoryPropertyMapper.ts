import { getRootCategoriesWithTranslation } from '../../utils/categoryTranslations';

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
    'policy_status': 'Policy',
    'policy_objective': 'Policy',
    'policy_description': 'Policy',
    'policy_start_date': 'Policy',
    'policy_end_date': 'Policy',
    'target_audience': 'Policy',
    
    // Factor properties
    'factor_type': 'Factor',
    'factors_impact_type': 'Factor',
    'factors_severity_level': 'Factor',
    'factors_temporal_scope': 'Factor',
    'factors_affects_population': 'Factor',
    'factors_impact_level': 'Factor',
    'factors_target_group': 'Factor',
    'factors_context_type': 'Factor',
    'factors_impact': 'Factor',
    'analyzed_in': 'Factor',
    'factors_description': 'Factor',
    'factors_evidence': 'Factor',
    'factors_source': 'Factor',
    'factors_mitigation_strategy': 'Factor',
    'factors_recommendation': 'Factor',
    'factors_related_policy': 'Factor',
    'factors_related_initiative': 'Factor',
    'factors_stakeholder': 'Factor',
    'factors_geographic_scope': 'Factor',
    'factors_institutional_level': 'Factor',
    'factors_educational_level': 'Factor',
    'factors_stem_area': 'Factor',
    'factors_gender_dimension': 'Factor',
    'factors_intersectionality': 'Factor',
    'factors_data_source': 'Factor',
    'factors_methodology': 'Factor',
    'factors_limitation': 'Factor',
    'factors_future_research': 'Factor',
    
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
    if (property.startsWith('factor_') || property.startsWith('factors_')) return 'Factor';

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
        'policy_status',
        'created_in',
        'start_date',
        'end_date',
        'description',
        'objective'
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
        'factors_impact_type',
        'factors_severity_level',
        'factors_temporal_scope',
        'factors_target_group',
        'factors_context_type',
        'factors_impact',
        'analyzed_in',
        'factors_description',
        'factors_evidence',
        'factors_source',
        'factors_mitigation_strategy',
        'factors_recommendation',
        'factors_related_policy',
        'factors_related_initiative',
        'factors_stakeholder',
        'factors_geographic_scope',
        'factors_institutional_level',
        'factors_educational_level',
        'factors_stem_area',
        'factors_gender_dimension',
        'factors_intersectionality',
        'factors_data_source',
        'factors_methodology',
        'factors_limitation',
        'factors_future_research'
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
    return getRootCategoriesWithTranslation();
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
    // Propriedades comuns para todas as categorias
    const commonProperties = [
      "created_in",
      "located_in",
      "start_date",
      "end_date",
      "description",
      "objective"
    ];

    const categoryMap: Record<string, string[]> = {
      Policy: [
        "policy_type",
        "policy_impact",
        "policy_status",
        "target_audience",
        "policy_impact_description",
      ],
      Initiative: [
        "initiative_reach",
        "initiative_status",
        "initiative_type",
        "initiative_data_source",
        "initiative_coordinator_gender",
        "initiative_organization_sector",
        "initiative_format",
        "funded_by",
        "website",
      ],
      Factor: [
        "factor_type",
        "factors_impact_type",
        "factors_severity_level",
        "factors_temporal_scope",
        "factors_affects_population",
        "factors_impact_level",
        "factors_target_group",
        "factors_context_type",
        "factors_impact",
        "analyzed_in",
        "factors_description",
        "factors_evidence",
        "factors_source",
        "factors_mitigation_strategy",
        "factors_recommendation",
        "factors_related_policy",
        "factors_related_initiative",
        "factors_stakeholder",
        "factors_geographic_scope",
        "factors_institutional_level",
        "factors_educational_level",
        "factors_stem_area",
        "factors_gender_dimension",
        "factors_intersectionality",
        "factors_data_source",
        "factors_methodology",
        "factors_limitation",
        "factors_future_research"
      ]
    };

    // Combinar propriedades específicas da categoria com propriedades comuns
    return [...(categoryMap[category] || []), ...commonProperties];
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
