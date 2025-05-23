import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import queryMappingService from '../../services/queryMappingService';
import { getSparqlQuery } from '../../data';
import './styles.css';

interface QueryBuilderProps {
  onQuerySubmit?: (query: CustomQuery) => void;
  initialCategory?: string;
}

// Define the structure of our custom query
interface CustomQuery {
  category: string;
  subCategory?: string;
  countries: string[];
  filters: Record<string, any>;
  customFields?: Record<string, any>;
  dateRange?: {
    startDate?: string;
    endDate?: string;
  };
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  limit?: number;
}

// Interface para definir uma opção dinâmica carregada do grafo SPARQL
interface GraphOption {
  value: string;
  label: string;
  count?: number;
  type?: string;
}

// Interface para os resultados da consulta
interface QueryResult {
  label?: { value: string };
  created_in?: { value: string };
  start_date?: { value: string };
  entity?: { value: string };
  [key: string]: { value: string } | undefined;
}

const DEMO_MODE = process.env.NODE_ENV === 'development';

const QueryBuilder: React.FC<QueryBuilderProps> = ({ 
  onQuerySubmit,
  initialCategory
}) => {
  const { language, translations } = useLanguage();
  const navigate = useNavigate();
  
  // State for selected options
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || '');
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('');
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [selectedFilters, setSelectedFilters] = useState<Record<string, any>>({});
  const [customFields, setCustomFields] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [previewQuery, setPreviewQuery] = useState<CustomQuery | null>(null);
  const [queryCount, setQueryCount] = useState<number>(0);
  
  // State for available options - agora serão carregados dinamicamente
  const [subCategories, setSubCategories] = useState<GraphOption[]>([]);
  const [availableFilters, setAvailableFilters] = useState<Record<string, GraphOption[]>>({});
  const [availableQueries, setAvailableQueries] = useState<string[]>([]);
  const [selectedPredefinedQuery, setSelectedPredefinedQuery] = useState<string>('');
  const [sparqlPreview, setSparqlPreview] = useState<string>('');
  
  // Enhanced states
  const [activeTab, setActiveTab] = useState<'basic' | 'advanced' | 'expert'>('basic');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [resultLimit, setResultLimit] = useState<number>(50);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [showSparqlEditor, setShowSparqlEditor] = useState<boolean>(false);
  const [customSparql, setCustomSparql] = useState<string>('');
  
  // Novo estado para opções dinâmicas do grafo
  const [dynamicOptions, setDynamicOptions] = useState<Record<string, GraphOption[]>>({});
  const [isLoadingOptions, setIsLoadingOptions] = useState<boolean>(false);
  const [selectedGraphPath, setSelectedGraphPath] = useState<string[]>([]);
  const [currentGraphLevel, setCurrentGraphLevel] = useState<number>(0);
  
  // Adicione esse useEffect para mostrar uma mensagem informativa
  const [showDemoMessage, setShowDemoMessage] = useState(false);

  // Adicionar estado para resultados
  const [queryResults, setQueryResults] = useState<QueryResult[]>([]);
  const [isExecutingQuery, setIsExecutingQuery] = useState(false);

  useEffect(() => {
    // Verificar se estamos em modo de demonstração real
    const checkDemoMode = async () => {
      try {
        // Tenta fazer uma consulta simples para verificar se temos dados reais
        const testQuery = `
          PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
          SELECT (COUNT(*) as ?count) WHERE { ?s ?p ?o } LIMIT 1
        `;
        
        const result = await queryMappingService.executeQuery(testQuery);
        const isDemo = !result || !result.results || !result.results.bindings || result.results.bindings.length === 0;
        
        // Se estamos em modo de demonstração, mostrar a mensagem
        setShowDemoMessage(isDemo);
        
        // Se estamos em modo de demonstração, mostrar por 10 segundos
        if (isDemo) {
          const timer = setTimeout(() => setShowDemoMessage(false), 10000);
          return () => clearTimeout(timer);
        }
      } catch (error) {
        console.error('Erro ao verificar modo de demonstração:', error);
        setShowDemoMessage(true);
      }
    };
    
    checkDemoMode();
  }, []);
  
  // Efeito de diagnóstico para verificar se o serviço está funcionando
  useEffect(() => {
    const runDiagnostics = async () => {
      try {
        console.log('Iniciando diagnóstico do serviço SPARQL');
        
        // Testar conexão com endpoint SPARQL com uma consulta simples
        const testQuery = `
          PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
          PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
          PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>
          
          SELECT (COUNT(?s) as ?count) 
          WHERE { 
            ?s rdf:type Ellas:Policy 
          }
          LIMIT 10
        `;
        
        console.log('Executando consulta de teste:', testQuery);
        const testResult = await queryMappingService.executeQuery(testQuery);
        
        if (testResult && testResult.results && testResult.results.bindings) {
          const count = testResult.results.bindings[0]?.count?.value || '0';
          console.log(`Teste SPARQL executado com sucesso. Encontradas ${count} políticas.`);
        } else {
          console.error('Teste SPARQL falhou - nenhum resultado retornado');
        }
        
        // Testar explorePropertiesForClass para Política
        console.log('Testando exploração de propriedades para Policy');
        const policyProps = await queryMappingService.explorePropertiesForClass('Policy');
        console.log(`Encontradas ${policyProps.length} propriedades para Policy:`, policyProps);
        
      } catch (error) {
        console.error('Diagnóstico falhou:', error);
      }
    };
    
    runDiagnostics();
  }, []);  // Executar apenas uma vez na montagem

  // Função para carregar opções dinamicamente a partir do endpoint SPARQL
  const loadDynamicOptions = useCallback(async (category: string, path: string[] = []) => {
    if (!category) return;
    
    setIsLoadingOptions(true);
    
    try {
      console.log(`Carregando propriedades para categoria ${category} com caminho ${path.join('/')}`);
      
      // Usar a função do serviço para obter propriedades 
      const options = await queryMappingService.explorePropertiesForClass(category);
      
      console.log(`Recebidas ${options.length} propriedades para ${category}`, options);
      
      // Determinar a chave apropriada para o armazenamento
      const pathKey = path.length > 0 ? path.join('/') : '';
      console.log(`Armazenando propriedades com chave: "${pathKey}"`);
      
      // Atualizar opções dinâmicas
      setDynamicOptions(prevOptions => ({
        ...prevOptions,
        [pathKey]: options
      }));
      
      // Se for a categoria inicial, também definir subcategorias
      if (path.length === 0) {
        setSubCategories(options);
      }
    } catch (error) {
      console.error('Erro ao carregar opções dinâmicas:', error);
    } finally {
      setIsLoadingOptions(false);
    }
  }, []);
  
  // Carregar valores para uma propriedade selecionada
  const loadPropertyValues = useCallback(async (category: string, property: string, path: string[] = []) => {
    setIsLoadingOptions(true);
    
    try {
      console.log(`Carregando valores para propriedade ${property} da categoria ${category}`);
      console.log('Caminho atual:', path);
      
      // Criar objeto de filtros a partir do caminho atual
      const filters: Record<string, any> = {};
      for (let i = 0; i < path.length; i += 2) {
        if (i + 1 < path.length) {
          filters[path[i]] = path[i + 1];
        }
      }
      
      // Usar a função do serviço para obter valores
      const options = await queryMappingService.exploreValuesForProperty(category, property, filters);
      
      console.log(`Recebidos ${options.length} valores para propriedade ${property}`, options);
      
      // Atualizar opções dinâmicas - construir a chave corretamente
      const pathKey = property; // Simplificamos a chave para ser apenas o nome da propriedade
      console.log('Armazenando valores com chave:', pathKey);
      
      setDynamicOptions(prevOptions => ({
        ...prevOptions,
        [pathKey]: options
      }));
      
      // Log detalhado do estado atual após a atualização
      setTimeout(() => {
        console.log('Estado atual dynamicOptions após atualização:', dynamicOptions);
      }, 0);
    } catch (error) {
      console.error('Erro ao carregar valores de propriedade:', error);
    } finally {
      setIsLoadingOptions(false);
    }
  }, []);
  
  // Quando uma nova categoria principal é selecionada
  useEffect(() => {
    if (selectedCategory) {
      console.log(`Categoria alterada para ${selectedCategory}, carregando propriedades iniciais`);
      
      // Redefinir caminhos e níveis
      setSelectedGraphPath([]);
      setCurrentGraphLevel(0);
      
      // Limpar opções antigas e carregar novas opções
      setDynamicOptions({});
      
      // Função assíncrona para carregar as opções e garantir que o estado seja atualizado
      const loadInitialOptions = async () => {
        try {
          setIsLoadingOptions(true);
          // Usar a função do serviço para obter propriedades 
          const options = await queryMappingService.explorePropertiesForClass(selectedCategory);
          
          console.log(`Recebidas ${options.length} propriedades iniciais para ${selectedCategory}:`, options);
          
          // Atualizar opções dinâmicas diretamente no estado
          setDynamicOptions(prevOptions => {
            const newOptions = { ...prevOptions, '': options };
            console.log('Novo estado após carregar propriedades iniciais:', newOptions);
            return newOptions;
          });
          
          // Se necessário, também definir subcategorias
          setSubCategories(options);
        } catch (error) {
          console.error('Erro ao carregar opções iniciais:', error);
        } finally {
          setIsLoadingOptions(false);
        }
      };
      
      // Executar a função para carregar opções
      loadInitialOptions();
    }
  }, [selectedCategory]);
  
  // Quando o usuário seleciona uma opção no caminho do grafo
  const handleGraphOptionSelect = useCallback(async (option: GraphOption, level: number) => {
    console.log(`Selecionada opção: ${option.label} (${option.value}) no nível ${level}, tipo: ${option.type || 'não especificado'}`);
    
    // Truncar o caminho até o nível atual
    const newPath = selectedGraphPath.slice(0, level * 2);
    
    // Adicionar a nova seleção ao caminho
    const updatedPath = [...newPath, option.value, option.label];
    console.log('Novo caminho:', updatedPath);
    
    // Atualizar o estado com o novo caminho e nível
    setSelectedGraphPath(updatedPath);
    setCurrentGraphLevel(level + 1);
    
    // Determinar o tipo da opção se não foi especificado
    const optionType = option.type || (level % 2 === 0 ? 'property' : 'value');
    
    // Carregar as próximas opções com base no tipo da opção
    if (optionType === 'property') {
      // Se for uma propriedade, carregar seus valores possíveis
      console.log(`Carregando valores para propriedade ${option.value}`);
      
      // Função assíncrona para carregar valores e atualizar o estado
      const loadValues = async () => {
        try {
          setIsLoadingOptions(true);
          
          // Criar filtros a partir do caminho atual
          const filters: Record<string, any> = {};
          for (let i = 0; i < updatedPath.length; i += 2) {
            if (i + 1 < updatedPath.length) {
              filters[updatedPath[i]] = updatedPath[i + 1];
            }
          }
          
          // Obter valores para a propriedade
          const values = await queryMappingService.exploreValuesForProperty(
            selectedCategory, 
            option.value, 
            filters
          );
          
          console.log(`Recebidos ${values.length} valores para ${option.value}:`, values);
          
          // Atualizar o estado diretamente
          setDynamicOptions(prev => ({
            ...prev,
            [option.value]: values.filter(v => v.value && v.value !== 'undefined')
          }));
        } catch (error) {
          console.error(`Erro ao carregar valores para ${option.value}:`, error);
        } finally {
          setIsLoadingOptions(false);
        }
      };
      
      // Executar carregamento de valores
      loadValues();
    } else if (optionType === 'value') {
      // Se for um valor, atualizar os filtros
      if (level > 0) {
        const property = selectedGraphPath[level * 2 - 2];
        console.log(`Adicionando filtro: ${property} = ${option.value}`);
        
        // Atualizar filtros
        setSelectedFilters(prev => ({
          ...prev,
          [property]: option.value
        }));
        
        // Executar a consulta dinâmica com o caminho atual
        try {
          setIsExecutingQuery(true);
          console.log('Executando consulta com caminho:', updatedPath);
          
          // Construir o caminho para a consulta (apenas propriedades e valores, sem labels)
          const queryPath: string[] = [];
          for (let i = 0; i < updatedPath.length; i += 2) {
            if (updatedPath[i] && updatedPath[i + 1]) {
              queryPath.push(updatedPath[i]); // propriedade
              queryPath.push(updatedPath[i + 1]); // valor
            }
          }
          
          // Executar a consulta dinâmica
          const result = await queryMappingService.executeDynamicGraphQuery(
            selectedCategory,
            queryPath,
            ['label', 'created_in', 'start_date', 'policy_type', 'policy_impact'] // campos extras que queremos recuperar
          );
          
          if (result && result.results && result.results.bindings) {
            console.log('Resultados da consulta:', result.results.bindings);
            setQueryResults(result.results.bindings as QueryResult[]);
          }
        } catch (error) {
          console.error('Erro ao executar consulta:', error);
        } finally {
          setIsExecutingQuery(false);
        }
        
        // Carregar próximas propriedades disponíveis
        const loadNextProperties = async () => {
          try {
            setIsLoadingOptions(true);
            const nextProps = await queryMappingService.explorePropertiesForClass(selectedCategory);
            setDynamicOptions(prev => ({
              ...prev,
              '': nextProps.filter(p => !selectedGraphPath.includes(p.value))
            }));
          } catch (error) {
            console.error('Erro ao carregar próximas propriedades:', error);
          } finally {
            setIsLoadingOptions(false);
          }
        };
        
        loadNextProperties();
      }
    }
  }, [selectedCategory, selectedGraphPath]);
  
  // Função para renderizar opções do grafo dinamicamente
  const renderDynamicGraphOptions = () => {
    if (!selectedCategory) return null;
    
    // Mostrar uma visualização do estado para debugging
    const allOptions = Object.entries(dynamicOptions);
    const debugInfo = {
      selectedCategory,
      currentPath: selectedGraphPath,
      currentLevel: currentGraphLevel,
      availableKeys: Object.keys(dynamicOptions),
      availableOptions: allOptions
    };
    
    // Determinar qual conjunto de opções deve ser mostrado com base no caminho atual
    let optionsToShow: GraphOption[] = [];
    let emptyMessage = "Nenhuma opção disponível";
    let optionsTitle = "";
    
    if (selectedGraphPath.length === 0) {
      // No nível raiz, mostrar propriedades da categoria (chave vazia)
      optionsToShow = dynamicOptions[''] || [];
      optionsTitle = "Propriedades disponíveis";
      emptyMessage = "Selecione uma categoria para ver as conexões disponíveis.";
    } else if (selectedGraphPath.length % 2 === 1) {
      // Corrigido: pegar o value da propriedade, não o label
      const propertyName = selectedGraphPath[selectedGraphPath.length - 2];
      optionsToShow = dynamicOptions[propertyName] || [];
      optionsTitle = `Valores para ${formatPropertyName(propertyName)}`;
      emptyMessage = `Carregando valores para ${propertyName}...`;
    } else {
      // Se o caminho termina em um valor, mostrar as próximas propriedades
      const fullPath = selectedGraphPath.join('/');
      optionsToShow = dynamicOptions[fullPath] || dynamicOptions[''] || [];
      optionsTitle = "Próximas propriedades";
      emptyMessage = "Não há mais conexões disponíveis neste caminho.";
    }
    
    // Ordenar as opções por contagem (se disponível)
    const sortedOptions = [...optionsToShow].sort((a, b) => {
      if (a.count && b.count) {
        return b.count - a.count; // Ordem decrescente por contagem
      }
      return 0;
    });
    
    // Função para formatar nome de propriedade (snake_case -> formato legível)
    function formatPropertyName(name: string): string {
      return name
        .replace(/_/g, ' ')
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, str => str.toUpperCase());
    }
    
    // Função para recarregar dados manualmente
    const handleReload = async () => {
      if (!selectedCategory) return;
      
      setIsLoadingOptions(true);
      
      try {
        // Se estamos no nível inicial, recarregar propriedades da categoria
        if (selectedGraphPath.length === 0) {
          const options = await queryMappingService.explorePropertiesForClass(selectedCategory);
          setDynamicOptions(prev => ({ ...prev, '': options }));
        } 
        // Se estamos em uma propriedade, recarregar seus valores
        else if (selectedGraphPath.length % 2 === 1) {
          const propertyName = selectedGraphPath[selectedGraphPath.length - 1];
          const values = await queryMappingService.exploreValuesForProperty(
            selectedCategory, 
            propertyName, 
            {}
          );
          setDynamicOptions(prev => ({ ...prev, [propertyName]: values }));
        }
        // Se estamos em um valor, recarregar próximas propriedades
        else {
          const options = await queryMappingService.explorePropertiesForClass(selectedCategory);
          setDynamicOptions(prev => ({ ...prev, '': options }));
        }
      } catch (error) {
        console.error('Erro ao recarregar dados:', error);
      } finally {
        setIsLoadingOptions(false);
      }
    };
    
    return (
      <div className="dynamic-graph-explorer">
        <div className="explorer-header">
          <h3>Explorar Dados Conectados</h3>
          <button 
            className="reload-button" 
            onClick={handleReload}
            disabled={isLoadingOptions}
          >
            {isLoadingOptions ? 'Carregando...' : 'Recarregar Dados'}
          </button>
        </div>
        
        {/* Caminho atual */}
        {selectedGraphPath.length > 0 && (
          <div className="current-path">
            <span>Caminho: </span>
            <span className="selected-category">{selectedCategory}</span>
            {selectedGraphPath.map((item, index) => (
              <span key={index} className={index % 2 === 0 ? 'path-property' : 'path-value'}>
                {index % 2 === 0 ? ' → ' : ': '}
                {item}
              </span>
            ))}
          </div>
        )}
        
        {/* Título da seção de opções */}
        {optionsTitle && (
          <div className="options-section-title">
            <h4>{optionsTitle}</h4>
            {!isLoadingOptions && sortedOptions.length > 0 && (
              <span className="options-count">({sortedOptions.length})</span>
            )}
          </div>
        )}
        
        {/* Mostrar opções ou indicador de carregamento */}
        <div className="graph-options-container">
          {isLoadingOptions ? (
            <div className="loading-indicator">Carregando opções...</div>
          ) : sortedOptions && sortedOptions.length > 0 ? (
            <div className="graph-options-list">
              {sortedOptions.map((option, index) => (
                <div 
                  key={index}
                  className="graph-option-item"
                  onClick={() => handleGraphOptionSelect(option, currentGraphLevel)}
                >
                  <span className="option-label">{option.label}</span>
                  {option.count && option.count > 0 && (
                    <span className="option-count">({option.count})</span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-options-message">
              {emptyMessage}
            </div>
          )}
        </div>
        
        {/* Área de depuração - Simplificada para não ocupar tanto espaço */}
        <div className="debug-info" style={{ 
          margin: '10px 0',
          padding: '10px', 
          background: '#f5f5f5', 
          border: '1px solid #ddd',
          borderRadius: '4px',
          fontSize: '12px'
        }}>
          <div><strong>Debug - Opções disponíveis:</strong></div>
          <div>
            {allOptions.length > 0 ? (
              allOptions.map(([key, options]) => (
                <div key={key} style={{ margin: '5px 0' }}>
                  <strong>{key || "[raiz]"}:</strong> {options.length} opções 
                  [{options.slice(0, 3).map(o => o.label).join(', ')}
                  {options.length > 3 ? '...' : ''}]
                </div>
              ))
            ) : (
              <div>Nenhuma opção carregada ainda</div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Carregar consultas disponíveis quando a categoria muda
  useEffect(() => {
    const loadAvailableQueries = async () => {
      if (!selectedCategory) {
        setAvailableQueries([]);
        return;
      }
      
      try {
        // Usar o serviço de mapeamento para obter as consultas disponíveis
        const mappedQueries = await queryMappingService.getAvailableQueriesByCategory(selectedCategory);
        // Extrair apenas os nomes das consultas
        const queryNames = mappedQueries.map(q => q.name);
        setAvailableQueries(queryNames);
        console.log(`Carregadas ${queryNames.length} consultas para a categoria ${selectedCategory}`);
      } catch (error) {
        console.error(`Erro ao carregar consultas para ${selectedCategory}:`, error);
        setAvailableQueries([]);
      }
    };
    
    loadAvailableQueries();
  }, [selectedCategory]);

  // Atualizar SPARQL preview quando uma consulta predefinida é selecionada
  useEffect(() => {
    const loadSparqlQuery = async () => {
      if (!selectedPredefinedQuery) {
        setSparqlPreview('');
        return;
      }
      
      try {
        const sparql = await getSparqlQuery(selectedPredefinedQuery);
        if (sparql) {
          setSparqlPreview(sparql);
          setCustomSparql(sparql);
          console.log('SPARQL query carregada:', sparql);
        } else {
          setSparqlPreview('');
          setCustomSparql('');
        }
      } catch (error) {
        console.error('Erro ao carregar SPARQL query:', error);
        setSparqlPreview('');
        setCustomSparql('');
      }
    };
    
    loadSparqlQuery();
  }, [selectedPredefinedQuery]);

  // Update the preview query
  const updatePreviewQuery = useCallback(() => {
    if (!selectedCategory) {
      setPreviewQuery(null);
      return;
    }
    
    const query: CustomQuery = {
      category: selectedCategory,
      subCategory: selectedSubCategory,
      countries: selectedCountries,
      filters: selectedFilters,
      customFields,
      dateRange: (startDate || endDate) ? { 
        startDate: startDate || undefined, 
        endDate: endDate || undefined 
      } : undefined,
      sortBy: sortBy || undefined,
      sortOrder: sortBy ? sortOrder : undefined,
      limit: resultLimit
    };
    
    setPreviewQuery(query);
    
    // Count the number of query parameters
    let count = 0;
    if (selectedCategory) count++;
    if (selectedSubCategory) count++;
    if (selectedCountries.length > 0) count++;
    count += Object.keys(selectedFilters).length;
    count += Object.keys(customFields).length;
    if (startDate) count++;
    if (endDate) count++;
    if (sortBy) count++;
    if (selectedTags.length > 0) count++;
    
    setQueryCount(count);
  }, [
    selectedCategory, 
    selectedSubCategory, 
    selectedCountries, 
    selectedFilters, 
    customFields,
    startDate,
    endDate,
    sortBy,
    sortOrder,
    resultLimit,
    selectedTags
  ]);

  // Trigger preview update whenever relevant state changes
  useEffect(() => {
    updatePreviewQuery();
  }, [
    selectedCategory, 
    selectedSubCategory, 
    selectedCountries, 
    selectedFilters, 
    customFields,
    startDate,
    endDate,
    sortBy,
    sortOrder,
    resultLimit,
    selectedTags,
    updatePreviewQuery
  ]);

  // Handle predefined query selection
  const handlePredefinedQuerySelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const queryText = e.target.value;
    setSelectedPredefinedQuery(queryText);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedCategory && !showSparqlEditor) return;
    
    setIsLoading(true);
    
    try {
      let query: CustomQuery;
      let result;
      
      // If using custom SPARQL
      if (showSparqlEditor && customSparql) {
        query = {
          category: selectedCategory || 'custom',
          countries: selectedCountries,
          filters: selectedFilters,
          customFields: { ...customFields, sparql: customSparql }
        };
        
        console.log('Executando consulta SPARQL personalizada');
        
        // Use custom SPARQL directly
        result = await queryMappingService.executeQuery(customSparql);
      }
      // If using predefined query
      else if (selectedPredefinedQuery) {
        query = {
          category: selectedCategory,
          countries: selectedCountries,
          filters: selectedFilters,
          customFields,
          dateRange: (startDate || endDate) ? { 
            startDate, 
            endDate 
          } : undefined,
          sortBy,
          sortOrder,
          limit: resultLimit
        };
        
        console.log('Executando consulta predefinida:', selectedPredefinedQuery);
        
        // Use mapping service
        result = await queryMappingService.executeQuery(selectedPredefinedQuery);
      } 
      // Use built custom query
      else {
        query = {
          category: selectedCategory,
          subCategory: selectedSubCategory,
          countries: selectedCountries,
          filters: selectedFilters,
          customFields,
          dateRange: (startDate || endDate) ? { 
            startDate, 
            endDate 
          } : undefined,
          sortBy,
          sortOrder,
          limit: resultLimit
        };
        
        console.log('Executando consulta personalizada:', query);
        
        // Use mapping service
        result = await queryMappingService.executeQueryWithParams(
          selectedCategory,
          selectedCountries,
          selectedFilters
        );
      }
      
      // Use callback or navigate
      if (onQuerySubmit) {
        onQuerySubmit(query);
      } else {
        if (result) {
          console.log('Resultados da consulta:', result);
          
          // Navigate to search page with query params
          const params = new URLSearchParams();
          
          params.append('category', selectedCategory);
          
          if (selectedPredefinedQuery) {
            params.append('queryText', selectedPredefinedQuery);
          }
          
          if (selectedSubCategory) {
            params.append('subCategory', selectedSubCategory);
          }
          
          if (selectedCountries.length > 0) {
            params.append('countries', selectedCountries.join(','));
          }
          
          // Add filters as URL parameters
          Object.entries(selectedFilters).forEach(([key, value]) => {
            if (Array.isArray(value)) {
              params.append(key, value.join(','));
            } else if (value !== null && value !== undefined) {
              params.append(key, String(value));
            }
          });
          
          // Add date range
          if (startDate) {
            params.append('startDate', startDate);
          }
          
          if (endDate) {
            params.append('endDate', endDate);
          }
          
          // Add sorting
          if (sortBy) {
            params.append('sortBy', sortBy);
            params.append('sortOrder', sortOrder);
          }
          
          // Add limit
          if (resultLimit !== 50) {
            params.append('limit', String(resultLimit));
          }
          
          // Add tags
          if (selectedTags.length > 0) {
            params.append('tags', selectedTags.join(','));
          }
          
          // Add custom fields
          if (customFields.keyword) {
            params.append('keyword', customFields.keyword);
          }
          
          // Store results in session
          sessionStorage.setItem('queryResults', JSON.stringify(result));
          
          navigate(`/buscaone?${params.toString()}`);
        } else {
          console.error('Erro ao executar consulta: Nenhum resultado obtido');
        }
      }
    } catch (error) {
      console.error('Erro ao executar consulta:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Render countries by region
  const renderCountriesByRegion = () => {
    return null; // Função vazia já que não temos mais a lista de países
  };

  // Handle country selection
  const handleCountryChange = (country: string) => {
    setSelectedCountries(prev => 
      prev.includes(country) 
        ? prev.filter(c => c !== country) 
        : [...prev, country]
    );
  };

  // Renderizar os resultados da consulta
  const renderQueryResults = () => {
    if (isExecutingQuery) {
      return (
        <div className="query-results loading">
          <div className="loading-spinner"></div>
          <p>Executando consulta...</p>
        </div>
      );
    }
    
    if (!queryResults || queryResults.length === 0) {
      return null;
    }
    
    // Função para formatar datas
    const formatDate = (dateStr: string) => {
      try {
        const date = new Date(dateStr);
        return date.toLocaleDateString('pt-BR');
      } catch (e) {
        return dateStr;
      }
    };
    
    // Função para formatar valores
    const formatValue = (value: any) => {
      if (!value) return '-';
      if (typeof value === 'object' && value.value) {
        // Se for um valor do SPARQL
        if (value.value.startsWith('http')) {
          // Se for uma URI, pegar só a última parte
          return value.value.split('#').pop() || value.value;
        }
        return value.value;
      }
      return value;
    };
    
    return (
      <div className="query-results">
        <h3>
          Resultados da Consulta 
          <span className="results-count">({queryResults.length})</span>
        </h3>
        <div className="results-table-container">
          <table className="results-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>País</th>
                <th>Data de Início</th>
                <th>Tipo</th>
                <th>Impacto</th>
              </tr>
            </thead>
            <tbody>
              {queryResults.map((result, index) => (
                <tr key={index}>
                  <td>{formatValue(result.label)}</td>
                  <td>{formatValue(result.created_in)}</td>
                  <td>{result.start_date ? formatDate(formatValue(result.start_date)) : '-'}</td>
                  <td>{formatValue(result.policy_type)}</td>
                  <td>{formatValue(result.policy_impact)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="advanced-query-builder">
      <div className="query-builder-header">
        <h2 className="query-builder-title">Consulta Avançada</h2>
        <div className="query-builder-tabs">
          <button 
            className={`tab-button ${activeTab === 'basic' ? 'active' : ''}`}
            onClick={() => setActiveTab('basic')}
          >
            Básico
          </button>
          <button 
            className={`tab-button ${activeTab === 'advanced' ? 'active' : ''}`}
            onClick={() => setActiveTab('advanced')}
          >
            Avançado
          </button>
          <button 
            className={`tab-button ${activeTab === 'expert' ? 'active' : ''}`}
            onClick={() => setActiveTab('expert')}
          >
            Expert
          </button>
        </div>
      </div>
      
      {recentSearches.length > 0 && (
        <div className="recent-searches">
          <h3>Consultas Recentes</h3>
          <ul className="recent-search-list">
            {recentSearches.map((search, index) => (
              <li key={index} className="recent-search-item">
                <button className="recent-search-button" onClick={() => {
                  // Logic to restore this search would go here
                  console.log("Restaurando busca:", search);
                }}>
                  {search}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="query-form">
        {/* Basic Search Tab - Mantém apenas as 3 categorias principais como estáticas */}
        {activeTab === 'basic' && (
          <div className="basic-search">
            {/* Category Selection - Apenas estas 3 são estáticas */}
            <div className="form-section">
              <h3>Selecione a Categoria</h3>
              <div className="category-options">
                <div className={`category-option ${selectedCategory === 'Policy' ? 'selected' : ''}`}>
                  <input 
                    type="radio" 
                    id="category-policies" 
                    name="category"
                    value="Policy"
                    checked={selectedCategory === 'Policy'}
                    onChange={() => setSelectedCategory('Policy')}
                  />
                  <label htmlFor="category-policies">Políticas</label>
                </div>
                
                <div className={`category-option ${selectedCategory === 'Initiative' ? 'selected' : ''}`}>
                  <input 
                    type="radio" 
                    id="category-initiatives" 
                    name="category"
                    value="Initiative"
                    checked={selectedCategory === 'Initiative'}
                    onChange={() => setSelectedCategory('Initiative')}
                  />
                  <label htmlFor="category-initiatives">Iniciativas</label>
                </div>
                
                <div className={`category-option ${selectedCategory === 'ContextualFactor' ? 'selected' : ''}`}>
                  <input 
                    type="radio" 
                    id="category-factors" 
                    name="category"
                    value="ContextualFactor"
                    checked={selectedCategory === 'ContextualFactor'}
                    onChange={() => setSelectedCategory('ContextualFactor')}
                  />
                  <label htmlFor="category-factors">Fatores</label>
                </div>
              </div>
            </div>
            
            {/* Explorador de grafo dinâmico - Nova seção */}
            {selectedCategory && (
              <div className="form-section">
                {renderDynamicGraphOptions()}
              </div>
            )}
          </div>
        )}
        
        {/* Advanced Search Tab */}
        {activeTab === 'advanced' && (
          <div className="advanced-search">
            {/* Explorador de grafo dinâmico também na aba avançada */}
            {selectedCategory && (
              <div className="form-section">
                {renderDynamicGraphOptions()}
              </div>
            )}
            
            {/* Date Range e outras opções permanecem */}
            <div className="form-section">
              <h3>Período de Tempo</h3>
              <div className="date-range-inputs">
                <div className="date-input-group">
                  <label htmlFor="start-date">Data Inicial</label>
                  <input 
                    type="date" 
                    id="start-date"
                    className="date-input"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div className="date-input-group">
                  <label htmlFor="end-date">Data Final</label>
                  <input 
                    type="date" 
                    id="end-date"
                    className="date-input"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>
            </div>
            
            {/* Sort Options */}
            <div className="form-section">
              <h3>Opções de Ordenação</h3>
              <div className="sort-controls">
                <div className="sort-field">
                  <label htmlFor="sort-by">Ordenar por</label>
                  <select 
                    id="sort-by" 
                    className="sort-select"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="">Sem ordenação</option>
                    <option value="date">Data</option>
                    <option value="relevance">Relevância</option>
                    <option value="name">Nome</option>
                    <option value="country">País</option>
                  </select>
                </div>
                
                {sortBy && (
                  <div className="sort-direction">
                    <div className="sort-radio-group">
                      <input
                        type="radio"
                        id="sort-asc"
                        name="sort-direction"
                        checked={sortOrder === 'asc'}
                        onChange={() => setSortOrder('asc')}
                      />
                      <label htmlFor="sort-asc">Crescente</label>
                    </div>
                    <div className="sort-radio-group">
                      <input
                        type="radio"
                        id="sort-desc"
                        name="sort-direction"
                        checked={sortOrder === 'desc'}
                        onChange={() => setSortOrder('desc')}
                      />
                      <label htmlFor="sort-desc">Decrescente</label>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Result Limit */}
            <div className="form-section">
              <h3>Limite de Resultados</h3>
              <div className="limit-slider">
                <input 
                  type="range" 
                  min="10" 
                  max="200" 
                  step="10"
                  value={resultLimit}
                  onChange={(e) => setResultLimit(parseInt(e.target.value))}
                  className="range-input"
                />
                <span className="limit-value">{resultLimit} resultados</span>
              </div>
            </div>
          </div>
        )}
        
        {/* Expert Search Tab */}
        {activeTab === 'expert' && (
          <div className="expert-search">
            {/* SPARQL Editor */}
            <div className="form-section sparql-editor-section">
              <div className="sparql-header">
                <h3>Editor SPARQL</h3>
                <label className="sparql-toggle">
                  <input
                    type="checkbox"
                    checked={showSparqlEditor}
                    onChange={() => setShowSparqlEditor(!showSparqlEditor)}
                  />
                  <span className="toggle-label">Ativar editor SPARQL</span>
                </label>
              </div>
              
              {showSparqlEditor && (
                <div className="sparql-editor">
                  <textarea
                    className="sparql-textarea"
                    value={customSparql}
                    onChange={(e) => setCustomSparql(e.target.value)}
                    placeholder="Insira sua consulta SPARQL personalizada aqui..."
                    rows={10}
                  />
                  <div className="sparql-editor-help">
                    <p>
                      Use prefixos padrão: <code>PREFIX Ellas: &lt;https://ellas.ufmt.br/Ontology/Ellas#&gt;</code>, <code>PREFIX rdfs: &lt;http://www.w3.org/2000/01/rdf-schema#&gt;</code>
                    </p>
                  </div>
                </div>
              )}
            </div>
            
            {/* Consultas geradas dinamicamente */}
            {selectedCategory && !showSparqlEditor && (
              <div className="form-section">
                <h3>Explorador de Dados Conectados</h3>
                {renderDynamicGraphOptions()}
                
                {selectedGraphPath.length > 0 && (
                  <div className="generated-sparql-preview">
                    <h4>Consulta SPARQL Gerada</h4>
                    <pre className="sparql-preview-code">
                      {`PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

SELECT ?s ?label
WHERE {
  ?s rdf:type Ellas:${selectedCategory}.
  ?s rdfs:label ?label.
${selectedGraphPath.reduce((acc, item, index) => {
  if (index % 2 === 0) {
    return acc + `  ?s Ellas:${item} ?o${index/2}.\n`;
  } else {
    return acc + `  ?o${(index-1)/2} rdfs:label "${item}"@en.\n`;
  }
}, '')}}`}
                    </pre>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
        
        {/* Instruções de Pesquisa */}
        <div className="search-instructions">
          <div className="search-instructions-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
              <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/>
            </svg>
          </div>
          <div className="search-instructions-content">
            <h3>Como realizar sua pesquisa</h3>
            <ol>
              <li>Selecione uma <strong>Categoria</strong> (Políticas, Iniciativas ou Fatores)</li>
              <li>Explore as <strong>conexões disponíveis</strong> no grafo de dados</li>
              <li>Siga o caminho de propriedades e valores para refinar sua consulta</li>
              <li>Ou use o <strong>Editor SPARQL</strong> para consultas personalizadas avançadas</li>
              <li>Clique no botão <strong>Pesquisar</strong> para visualizar os resultados</li>
            </ol>
          </div>
        </div>
        
        {/* Query Preview */}
        {previewQuery && (
          <div className="query-preview">
            <h3>Pré-visualização da Consulta {queryCount > 0 && <span className="query-count">({queryCount} parâmetros)</span>}</h3>
            <div className="preview-content">
              <p><strong>Categoria:</strong> {previewQuery.category}</p>
              {previewQuery.subCategory && <p><strong>Subcategoria:</strong> {previewQuery.subCategory}</p>}
              {selectedPredefinedQuery && <p><strong>Consulta Predefinida:</strong> {selectedPredefinedQuery}</p>}
              {previewQuery.countries.length > 0 && (
                <p><strong>Países:</strong> {previewQuery.countries.join(', ')}</p>
              )}
              {selectedTags.length > 0 && (
                <p><strong>Tags:</strong> {selectedTags.join(', ')}</p>
              )}
              {(startDate || endDate) && (
                <p><strong>Período:</strong> {startDate || 'Início'} até {endDate || 'Presente'}</p>
              )}
              {sortBy && (
                <p><strong>Ordenação:</strong> {sortBy} ({sortOrder === 'asc' ? 'Crescente' : 'Decrescente'})</p>
              )}
              {Object.keys(previewQuery.filters).length > 0 && (
                <div>
                  <p><strong>Filtros:</strong></p>
                  <ul>
                    {Object.entries(previewQuery.filters).map(([key, value]) => (
                      <li key={key}>
                        {key}: {Array.isArray(value) ? value.join(', ') : 
                          typeof value === 'object' ? JSON.stringify(value) : value}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {customFields.keyword && (
                <p><strong>Palavras-chave:</strong> {customFields.keyword}</p>
              )}
            </div>
          </div>
        )}
        
        {/* Adicionar a seção de resultados após o explorador de grafo */}
        {renderQueryResults()}
        
        {/* Form Controls */}
        <div className="form-controls">
          <button 
            type="button" 
            className="reset-button"
            onClick={() => {
              setSelectedCategory('');
              setSelectedSubCategory('');
              setSelectedCountries([]);
              setSelectedFilters({});
              setCustomFields({});
              setSelectedPredefinedQuery('');
              setSparqlPreview('');
              setStartDate('');
              setEndDate('');
              setSortBy('');
              setSortOrder('asc');
              setResultLimit(50);
              setSelectedTags([]);
              setCustomSparql('');
              setShowSparqlEditor(false);
              setSelectedGraphPath([]);
              setCurrentGraphLevel(0);
              setDynamicOptions({});
            }}
          >
            Limpar
          </button>
          
          <button 
            type="submit" 
            className="submit-button"
            disabled={(!selectedCategory && !showSparqlEditor) || isLoading}
          >
            {isLoading ? (
              <>
                <span className="loading-spinner"></span>
                <span>Pesquisando...</span>
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                </svg>
                <span>PESQUISAR</span>
              </>
            )}
          </button>
        </div>
      </form>

      {showDemoMessage && (
        <div className="demo-mode-banner">
          <div className="demo-mode-message">
            <span>
              <strong>Modo de Demonstração:</strong> Usando dados simulados para o explorador de grafos.
              {DEMO_MODE && <button onClick={() => setShowDemoMessage(false)}>×</button>}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default QueryBuilder; 