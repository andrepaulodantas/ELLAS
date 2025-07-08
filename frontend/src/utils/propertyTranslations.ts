import i18n from '../i18n';

/**
 * Mapeamento de propriedades para chaves de tradução
 */
const propertyTranslationMap: { [key: string]: string } = {
  // Propriedades comuns
  'created_in': 'properties.created_in',
  'description': 'properties.description',
  'start_date': 'properties.start_date',
  'end_date': 'properties.end_date',
  'objective': 'properties.objective',
  
  // Propriedades de Policy
  'policy_type': 'properties.policy_type',
  'policy_impact': 'properties.policy_impact',
  'policy_impact_description': 'properties.policy_impact_description',
  'target_audience': 'properties.target_audience',
  
  // Propriedades de Initiative
  'initiative_reach': 'properties.initiative_reach',
  'initiative_status': 'properties.initiative_status',
  'initiative_format': 'properties.initiative_format',
  'coordinator_gender': 'properties.coordinator_gender',
  'initiative_coordinator_gender': 'properties.initiative_coordinator_gender',
  
  // Propriedades de Factor
  'factor_type': 'properties.factor_type',
  'factors_impact_type': 'properties.factors_impact_type',
  'factors_severity_level': 'properties.factors_severity_level',
  'factors_temporal_scope': 'properties.factors_temporal_scope',
  'factors_affects_population': 'properties.factors_affects_population',
  'factors_impact_level': 'properties.factors_impact_level',
  'factors_target_group': 'properties.factors_target_group',
  'factors_context_type': 'properties.factors_context_type',
  'factors_impact': 'properties.factors_impact',
  'analyzed_in': 'properties.analyzed_in',
  'factors_description': 'properties.factors_description',
  'factors_evidence': 'properties.factors_evidence',
  'factors_source': 'properties.factors_source',
  'factors_mitigation_strategy': 'properties.factors_mitigation_strategy',
  'factors_recommendation': 'properties.factors_recommendation',
  'factors_related_policy': 'properties.factors_related_policy',
  'factors_related_initiative': 'properties.factors_related_initiative',
  'factors_stakeholder': 'properties.factors_stakeholder',
  'factors_geographic_scope': 'properties.factors_geographic_scope',
  'factors_institutional_level': 'properties.factors_institutional_level',
  'factors_educational_level': 'properties.factors_educational_level',
  'factors_stem_area': 'properties.factors_stem_area',
  'factors_gender_dimension': 'properties.factors_gender_dimension',
  'factors_intersectionality': 'properties.factors_intersectionality',
  'factors_data_source': 'properties.factors_data_source',
  'factors_methodology': 'properties.factors_methodology',
  'factors_limitation': 'properties.factors_limitation',
  'factors_future_research': 'properties.factors_future_research',
};

/**
 * Função para traduzir nomes de propriedades
 */
export const translatePropertyName = (propertyName: string): string => {
  const translationKey = propertyTranslationMap[propertyName];
  
  if (translationKey) {
    const translation = i18n.t(translationKey);
    // Se a tradução não foi encontrada, usar o fallback
    if (translation === translationKey) {
      return formatPropertyNameFallback(propertyName);
    }
    return translation;
  }
  
  // Fallback para formatação padrão
  return formatPropertyNameFallback(propertyName);
};

/**
 * Função de fallback para formatar nome de propriedade (snake_case -> formato legível)
 */
export const formatPropertyNameFallback = (name: string): string => {
  return name
    .replace(/_/g, " ")
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase());
};
