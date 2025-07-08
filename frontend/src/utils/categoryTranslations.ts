import i18n from '../i18n';

/**
 * Obtém as traduções das categorias baseado no idioma atual
 */
export const getCategoryTranslation = (categoryValue: string): string => {
  const translations = i18n.getResourceBundle(i18n.language, 'translation');
  
  if (translations?.categories?.categoryLabels?.[categoryValue]) {
    return translations.categories.categoryLabels[categoryValue];
  }
  
  // Fallback para valores conhecidos
  const fallbacks: { [key: string]: string } = {
    'Initiative': 'Iniciativas',
    'Policy': 'Políticas', 
    'Factor': 'Fatores'
  };
  
  return fallbacks[categoryValue] || categoryValue;
};

/**
 * Obtém as categorias raiz com traduções dinâmicas
 */
export const getRootCategoriesWithTranslation = () => {
  return [
    { 
      value: "Initiative", 
      label: getCategoryTranslation("Initiative"), 
      count: 245, 
      type: "category" 
    },
    { 
      value: "Policy", 
      label: getCategoryTranslation("Policy"), 
      count: 88, 
      type: "category" 
    },
    { 
      value: "Factor", 
      label: getCategoryTranslation("Factor"), 
      count: 52, 
      type: "category" 
    },
  ];
};

/**
 * Hook para reagir a mudanças de idioma
 */
export const useCategoryTranslations = () => {
  const getCurrentCategories = () => getRootCategoriesWithTranslation();
  
  // Re-executa quando o idioma muda
  const refreshCategories = () => {
    // Força a atualização das traduções
    return getRootCategoriesWithTranslation();
  };
  
  return {
    getCurrentCategories,
    refreshCategories,
    getCategoryTranslation
  };
};
