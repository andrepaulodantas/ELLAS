import React, { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import queryMappingService from "../../services/queryMappingService";
import SparqlEditor from "../SparqlEditor";
import { useCategoryTranslations } from "../../utils/categoryTranslations";
import { translatePropertyName } from "../../utils/propertyTranslations";
import "./styles.css";

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
  sortOrder?: "asc" | "desc";
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

const DEMO_MODE = process.env.NODE_ENV === "development";

const QueryBuilder: React.FC<QueryBuilderProps> = ({
  onQuerySubmit,
  initialCategory,
}) => {
  const { t, i18n } = useTranslation();
  const { getCurrentCategories } = useCategoryTranslations();
  
  // State for selected options
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [forceRootView, setForceRootView] = useState<boolean>(true);
  
  // Estado para as categorias traduzidas
  const [rootCategories, setRootCategories] = useState(() => getCurrentCategories());
  
  // Efeito para atualizar as categorias quando o idioma muda
  useEffect(() => {
    setRootCategories(getCurrentCategories());
  }, [i18n.language, getCurrentCategories]);

  // Log para debug
  console.log("🔍 QueryBuilder State:", {
    selectedCategory,
    forceRootView,
    initialCategory,
    selectedCategoryEmpty: !selectedCategory,
    selectedCategoryLength: selectedCategory?.length,
  });
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>("");
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [selectedFilters, setSelectedFilters] = useState<Record<string, any>>(
    {}
  );
  const [customFields, setCustomFields] = useState<Record<string, any>>({});
  const [previewQuery, setPreviewQuery] = useState<CustomQuery | null>(null);
  const [queryCount, setQueryCount] = useState<number>(0);

  // Enhanced states
  const [activeTab, setActiveTab] = useState<"basic" | "advanced" | "expert">(
    "basic"
  );
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [resultLimit, setResultLimit] = useState<number>(500);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [customSparql, setCustomSparql] = useState<string>("");

  // Novo estado para opções dinâmicas do grafo
  const [dynamicOptions, setDynamicOptions] = useState<
    Record<string, GraphOption[]>
  >({});
  const [isLoadingOptions, setIsLoadingOptions] = useState<boolean>(false);
  const [selectedGraphPath, setSelectedGraphPath] = useState<string[]>([]);
  const [currentGraphLevel, setCurrentGraphLevel] = useState<number>(0);
  const [tableKey, setTableKey] = useState<string>(Date.now().toString());

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
        const isDemo =
          !result ||
          !result.results ||
          !result.results.bindings ||
          result.results.bindings.length === 0;

        // Se estamos em modo de demonstração, mostrar a mensagem
        setShowDemoMessage(isDemo);

        // Se estamos em modo de demonstração, mostrar por 10 segundos
        if (isDemo) {
          const timer = setTimeout(() => setShowDemoMessage(false), 10000);
          return () => clearTimeout(timer);
        }
      } catch (error) {
        console.error("Erro ao verificar modo de demonstração:", error);
        setShowDemoMessage(true);
      }
    };

    checkDemoMode();
  }, []);

  // Efeito de diagnóstico para verificar se o serviço está funcionando
  useEffect(() => {
    const runDiagnostics = async () => {
      try {
        console.log("Iniciando diagnóstico do serviço SPARQL");

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

        console.log("Executando consulta de teste:", testQuery);
        const testResult = await queryMappingService.executeQuery(testQuery);

        if (testResult && testResult.results && testResult.results.bindings) {
          const count = testResult.results.bindings[0]?.count?.value || "0";
          console.log(
            `Teste SPARQL executado com sucesso. Encontradas ${count} políticas.`
          );
        } else {
          console.error("Teste SPARQL falhou - nenhum resultado retornado");
        }

        // Testar explorePropertiesForClass para Política
        console.log("Testando exploração de propriedades para Policy");
        const policyProps = await queryMappingService.explorePropertiesForClass(
          "Policy"
        );
        console.log(
          `Encontradas ${policyProps.length} propriedades para Policy:`,
          policyProps
        );
      } catch (error) {
        console.error("Diagnóstico falhou:", error);
      }
    };

    runDiagnostics();
  }, []); // Executar apenas uma vez na montagem

  // Quando uma nova categoria principal é selecionada
  useEffect(() => {
    console.log("🔄 useEffect[selectedCategory] disparado:", {
      selectedCategory,
      forceRootView,
      hasSelectedCategory: !!selectedCategory,
      selectedCategoryValue: `"${selectedCategory}"`,
    });

    // IMPORTANTE: Só carregar se não estivermos forçando a visualização da raiz
    if (selectedCategory && !forceRootView) {
      console.log(
        `📊 Categoria "${selectedCategory}" selecionada pelo usuário, carregando propriedades`
      );

      // Redefinir caminhos e níveis
      setSelectedGraphPath([]);
      setCurrentGraphLevel(0);

      // Limpar opções antigas e carregar novas opções
      setDynamicOptions({});

      // Função assíncrona para carregar as opções e garantir que o estado seja atualizado
      const loadInitialOptions = async () => {
        try {
          setIsLoadingOptions(true);

          // Definir propriedades válidas por categoria
          const categoryPropertyMap: Record<string, string[]> = {
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
              "initiative_format",
              "coordinator_gender",
              "description",
              "objective",
              "initiative_coordinator_gender",
              "end_date",
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
              "factors_future_research",
              "created_in",
              "description",
              "start_date"
            ],
          };

          // Usar a função do serviço para obter propriedades
          const allOptions =
            await queryMappingService.explorePropertiesForClass(
              selectedCategory
            );

          // CORREÇÃO: Remover limitação de propriedades para todas as categorias
          let filteredProps = allOptions.filter(
            (p) => !selectedGraphPath.includes(p.value)
          );
          console.log(`🔓 CORREÇÃO: Sem limitação - ${filteredProps.length} propriedades disponíveis para ${selectedCategory}`);

          setDynamicOptions((prev) => ({
            ...prev,
            [""]: filteredProps,
          }));
        } catch (error) {
          console.error("Erro ao carregar opções iniciais:", error);
        } finally {
          setIsLoadingOptions(false);
        }
      };

      // Executar a função para carregar opções
      loadInitialOptions();
    } else if (selectedCategory && forceRootView) {
      console.log(
        "🛑 selectedCategory definido mas forceRootView=true, ignorando carregamento"
      );
    } else {
      console.log("✅ selectedCategory vazio, NÃO carregando propriedades");
    }
  }, [selectedCategory, forceRootView]);

  // Efeito para recarregar opções quando o idioma muda
  useEffect(() => {
    if (selectedCategory && !forceRootView) {
      console.log("🌐 Idioma mudou, recarregando opções para tradução");
      // Recarregar as opções para que as traduções sejam atualizadas
      const reloadOptions = async () => {
        try {
          setIsLoadingOptions(true);
          const allOptions = await queryMappingService.explorePropertiesForClass(selectedCategory);
          let filteredProps = allOptions.filter(
            (p) => !selectedGraphPath.includes(p.value)
          );
          
          setDynamicOptions((prev) => ({
            ...prev,
            "": filteredProps,
          }));
        } catch (error) {
          console.error("Erro ao recarregar opções:", error);
        } finally {
          setIsLoadingOptions(false);
        }
      };
      
      reloadOptions();
    }
  }, [i18n.language, selectedCategory, forceRootView, selectedGraphPath]);

  // Debug: Monitor mudanças nos resultados da consulta
  useEffect(() => {
    console.log("🔍 DEBUG - queryResults mudou:", {
      length: queryResults.length,
      selectedCategory,
      isExecutingQuery,
      firstFew: queryResults.slice(0, 3),
      timestamp: new Date().toLocaleTimeString()
    });
  }, [queryResults, selectedCategory, isExecutingQuery]);

  // Debug effect para monitorar mudanças no queryResults
  useEffect(() => {
    console.log(`🔍 DEBUG useEffect: queryResults mudou:`, {
      length: queryResults.length,
      selectedCategory,
      timestamp: new Date().toISOString(),
      sampleData: queryResults.slice(0, 2)
    });
  }, [queryResults, selectedCategory]);

  // Quando o usuário seleciona uma opção no caminho do grafo
  const handleGraphOptionSelect = useCallback(
    async (option: GraphOption, level: number) => {
      console.log(
        `Selecionada opção: ${option.label} (${
          option.value
        }) no nível ${level}, tipo: ${option.type || "não especificado"}`
      );

      // CORREÇÃO: Truncar o caminho até o nível atual (agora só values)
      const newPath = selectedGraphPath.slice(0, level);

      // CORREÇÃO: Adicionar a nova seleção ao caminho no formato correto [propriedade, valor]
      // Para propriedades: value = nome da propriedade, label = nome formatado
      // Para valores: value = valor real, label = nome formatado
      // Armazenar apenas os values no selectedGraphPath para facilitar consultas SPARQL
      const updatedPath = [...newPath, option.value];
      console.log("Novo caminho (apenas values):", updatedPath);

      // VALIDAÇÃO RIGOROSA: Verificar se a propriedade é compatível com a categoria atual
      if (option.type === "property" && selectedCategory) {
        const categoryPropertyMap: Record<string, string[]> = {
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
            "initiative_format",
            "coordinator_gender",
            "description",
            "objective",
            "initiative_coordinator_gender",
            "end_date",
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
            "factors_future_research",
            "created_in",
            "description",
            "start_date"
          ],
        };

        const allowedProperties = categoryPropertyMap[selectedCategory];
        if (allowedProperties && !allowedProperties.includes(option.value)) {
          console.log(
            `📋 Propriedade ${option.value} não listada para ${selectedCategory}, mas será permitida`
          );
        }
      }

      // Atualizar o estado com o novo caminho e nível
      setSelectedGraphPath(updatedPath);
      setCurrentGraphLevel(level + 1);

      // Determinar o tipo da opção se não foi especificado
      const optionType =
        option.type || (level % 2 === 0 ? "property" : "value");

      // Carregar as próximas opções com base no tipo da opção
      if (optionType === "property") {
        // Se for uma propriedade, carregar seus valores possíveis
        console.log(`Carregando valores para propriedade ${option.value}`);

        // Função assíncrona para carregar valores e atualizar o estado
        const loadValues = async () => {
          try {
            setIsLoadingOptions(true);

            // CORREÇÃO: Criar filtros a partir do caminho atual (apenas values)
            const filters: Record<string, any> = {};
            for (let i = 0; i < updatedPath.length - 1; i += 2) {
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

            console.log(
              `Recebidos ${values.length} valores para ${option.value}:`,
              values
            );

            // Atualizar o estado diretamente
            setDynamicOptions((prev) => ({
              ...prev,
              [option.value]: values.filter(
                (v) => v.value && v.value !== "undefined"
              ),
            }));
          } catch (error) {
            console.error(
              `Erro ao carregar valores para ${option.value}:`,
              error
            );
          } finally {
            setIsLoadingOptions(false);
          }
        };

        // Executar carregamento de valores
        loadValues();
      } else if (optionType === "value") {
        // Se for um valor, apenas atualizar os filtros
        if (level > 0) {
          const property = selectedGraphPath[level * 2 - 2];
          console.log(
            `🔍 handleOptionClick: Adicionando filtro: ${property} = ${option.value}`
          );

          // Atualizar filtros (o useEffect vai executar a consulta automaticamente)
          setSelectedFilters((prev) => ({
            ...prev,
            [property]: option.value,
          }));

          console.log(
            `🔍 handleOptionClick: Filtro adicionado, useEffect vai executar consulta automaticamente`
          );

          // Carregar próximas propriedades disponíveis
          const loadNextProperties = async () => {
            try {
              setIsLoadingOptions(true);

              // Definir propriedades válidas por categoria
              const categoryPropertyMap: Record<string, string[]> = {
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
                  "initiative_format",
                  "coordinator_gender",
                  "description",
                  "objective",
                  "initiative_coordinator_gender",
                  "end_date",
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
                  "factors_future_research",
                  "created_in",
                  "description",
                  "start_date"
                ],
              };

              const nextProps =
                await queryMappingService.explorePropertiesForClass(
                  selectedCategory
                );
              
              // CORREÇÃO: Remover limitação de propriedades para todas as categorias
              let filteredProps = nextProps.filter(
                (p) => !selectedGraphPath.includes(p.value)
              );
              console.log(`🔓 CORREÇÃO: Sem limitação - ${filteredProps.length} propriedades disponíveis para ${selectedCategory}`);

              setDynamicOptions((prev) => ({
                ...prev,
                [level]: filteredProps,
              }));
            } catch (error) {
              console.error("Erro ao carregar próximas propriedades:", error);
            } finally {
              setIsLoadingOptions(false);
            }
          };

          loadNextProperties();
        }
      }
    },
    [selectedCategory, selectedGraphPath]
  );

  // Função para renderizar as categorias raiz
  const renderRootCategories = () => {
    console.log(
      "✅ renderRootCategories chamada - mostrando 3 categorias principais"
    );
    console.log("📋 Categorias raiz:", rootCategories);

    return (
      <div className="form-section">
        <h3>{t("queryBuilder.selectCategory")}</h3>
        <div className="graph-options-container">
          <div className="graph-options-list">
            {rootCategories.map((category, index) => (
              <div
                key={index}
                className="graph-option-item"
                onClick={async () => {
                  console.log(`🎯 Categoria selecionada: ${category.value}`);

                  // CORREÇÃO CRÍTICA: Limpar TUDO antes de definir nova categoria
                  console.log(
                    `🧹 Limpando estado completo antes de selecionar ${category.value}`
                  );
                  setSelectedGraphPath([]);
                  setCurrentGraphLevel(0);
                  setSelectedFilters({});
                  setDynamicOptions({});
                  setQueryResults([]);

                  // Definir nova categoria e desativar visualização da raiz
                  setSelectedCategory(category.value);
                  setForceRootView(false);

                  // Carregar dados básicos da categoria imediatamente
                  await loadBasicCategoryData(category.value);
                }}
              >
                <span className="option-label">{category.label}</span>
                {category.count && category.count > 0 && (
                  <span className="option-count">({category.count})</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Função para carregar dados básicos de uma categoria
  const loadBasicCategoryData = async (category: string) => {
    try {
      setIsExecutingQuery(true);
      console.log(`🔍 Carregando dados básicos para categoria: ${category}`);

      // CORREÇÃO CRÍTICA: Limpar filtros e caminhos ao mudar de categoria
      console.log(
        `🧹 Limpando filtros e caminhos antes de carregar dados para ${category}`
      );
      setSelectedGraphPath([]);
      setCurrentGraphLevel(0);
      setSelectedFilters({});
      setDynamicOptions({});

      console.log(`🔍 DEBUG: Estado atual queryResults antes da consulta:`, {
        length: queryResults?.length,
        first3: queryResults?.slice(0, 3),
      });

      // Limpar resultados antes da nova consulta
      setQueryResults([]);
      console.log(
        `🧹 Resultados limpos, iniciando nova consulta para ${category}`
      );

      // Executar uma consulta básica para obter exemplos da categoria
      console.log(`🚀 Executando consulta para categoria: ${category}`);
      const result = await queryMappingService.executeDynamicGraphQuery(
        category,
        [], // Caminho vazio para dados básicos - IMPORTANTE: sempre vazio para dados básicos
        [
          "created_in",
          "start_date",
          "policy_type",
          "policy_impact",
          "description",
          "objective",
        ] // campos que queremos recuperar (label já incluído por padrão)
      );

      console.log(
        `🔍 DEBUG: Resposta completa da API para categoria ${category}:`,
        {
          hasResult: !!result,
          hasResults: !!result?.results,
          hasBindings: !!result?.results?.bindings,
          bindingsLength: result?.results?.bindings?.length,
          resultStructure: result ? Object.keys(result) : "null",
          sampleBinding: result?.results?.bindings?.[0],
          fullResult: result,
        }
      );

      if (
        result &&
        result.results &&
        result.results.bindings &&
        result.results.bindings.length > 0
      ) {
        const bindingsLength = result.results.bindings.length;
        console.log(
          `📊 SUCESSO: Carregados ${bindingsLength} registros para ${category}`
        );
        console.log(
          `🔍 DEBUG: Primeiros 3 registros:`,
          result.results.bindings.slice(0, 3)
        );

        // Log detalhado da atualização
        console.log(`🔄 Atualizando queryResults com ${bindingsLength} registros`);
        setQueryResults(result.results.bindings as QueryResult[]);
        
        // Forçar re-renderização da tabela quando carregamos novos dados
        setTableKey(Date.now().toString());

        // IMPORTANTE: Verificar se há problemas de contagem
        if (bindingsLength === 100) {
          console.warn(`⚠️ ATENÇÃO: Exatamente 100 registros retornados. Pode ser limite SPARQL ou dados de demonstração!`);
        }

        // Verificar se o estado foi atualizado corretamente
        setTimeout(() => {
          console.log(`🔍 DEBUG: Estado queryResults após setQueryResults:`, {
            length: queryResults?.length,
            actualLength: result.results.bindings.length,
            category: category,
            timestamp: new Date().toISOString(),
            message: `Deve mostrar ${result.results.bindings.length} registros reais na UI`
          });
        }, 100);
      } else {
        console.error(
          `❌ PROBLEMA: Nenhum resultado encontrado para a categoria ${category}`
        );
        console.log(`🔍 DEBUG: Estrutura do resultado:`, result);
        setQueryResults([]);
      }
    } catch (error) {
      console.error(
        `❌ ERRO CRÍTICO ao carregar dados básicos para ${category}:`,
        error
      );
      setQueryResults([]);
    } finally {
      setIsExecutingQuery(false);
      console.log(`✅ Finalizando loadBasicCategoryData para ${category}`);
    }
  };

  // Função para renderizar opções do grafo dinamicamente
  const renderDynamicGraphOptions = () => {
    console.log("🔍 renderDynamicGraphOptions chamada:", {
      selectedCategory,
      forceRootView,
      selectedCategoryLength: selectedCategory?.length,
      isSelectedCategoryEmpty: !selectedCategory,
      dynamicOptionsKeys: Object.keys(dynamicOptions),
      dynamicOptionsCount: Object.values(dynamicOptions).reduce(
        (acc, opts) => acc + opts.length,
        0
      ),
    });

    // PRIMEIRA VERIFICAÇÃO: Se forceRootView está ativo, SEMPRE mostrar raiz
    if (forceRootView) {
      console.log("🏠 forceRootView=true, mostrando categorias raiz");
      return renderRootCategories();
    }

    // SEGUNDA VERIFICAÇÃO: Se não há categoria selecionada, mostrar raiz
    if (!selectedCategory) {
      console.log("✅ selectedCategory vazio, mostrando categorias raiz");
      return renderRootCategories();
    }

    // Se chegou até aqui, há uma categoria selecionada e não estamos forçando a raiz
    console.log(
      `📊 Categoria "${selectedCategory}" selecionada, renderizando opções dinâmicas`
    );

    // Mostrar uma visualização do estado para debugging
    const allOptions = Object.entries(dynamicOptions);

    // Função para formatar nome de propriedade usando tradução
    const formatPropertyName = (name: string): string => {
      return translatePropertyName(name);
    };

    // Determinar qual conjunto de opções deve ser mostrado com base no caminho atual
    let optionsToShow: GraphOption[] = [];
    let emptyMessage = "Nenhuma opção disponível";
    let optionsTitle = "";

    if (selectedGraphPath.length === 0) {
      // No nível raiz, mostrar propriedades da categoria (chave vazia)
      optionsToShow = dynamicOptions[""] || [];
      optionsTitle = `${t("queryBuilder.propertiesAvailable")} ${selectedCategory}`;
      emptyMessage = t("queryBuilder.selectCategoryToSeeConnections");
    } else if (selectedGraphPath.length % 2 === 1) {
      // CORREÇÃO: selectedGraphPath agora contém apenas values
      // Se length é ímpar, estamos em uma propriedade (último elemento é a propriedade)
      const propertyName = selectedGraphPath[selectedGraphPath.length - 1];
      optionsToShow = dynamicOptions[propertyName] || [];
      optionsTitle = `${t("queryBuilder.valuesFor")} ${formatPropertyName(propertyName)}`;
      emptyMessage = `${t("queryBuilder.loadingValuesFor")} ${propertyName}...`;
    } else {
      // Se o caminho termina em um valor, mostrar as próximas propriedades
      const fullPath = selectedGraphPath.join("/");
      optionsToShow = dynamicOptions[fullPath] || dynamicOptions[""] || [];
      optionsTitle = t("queryBuilder.nextProperties");
      emptyMessage = t("queryBuilder.noMoreConnections");
    }

    // VALIDAÇÃO RIGOROSA: Filtrar propriedades que não pertencem à categoria atual
    const categoryPropertyMap: Record<string, string[]> = {
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
        "initiative_format",
        "coordinator_gender",
        "description",
        "objective",
        "initiative_coordinator_gender",
        "end_date",
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
        "factors_future_research",
        "created_in",
        "description",
        "start_date"
      ],
    };

    // VALIDAÇÃO CONTÍNUA: Verificar compatibilidade em todos os níveis
    if (selectedCategory && selectedGraphPath.length > 0) {
      // Verificar se todas as propriedades no path são válidas para a categoria
      const allowedProperties = categoryPropertyMap[selectedCategory] || [];

      // Extrair apenas as propriedades (elementos em posições ímpares após o primeiro)
      const pathProperties: string[] = [];
      for (let i = 0; i < selectedGraphPath.length; i += 2) {
        pathProperties.push(selectedGraphPath[i]);
      }

      // Verificar se alguma propriedade é incompatível
      const invalidProperty = pathProperties.find(
        (prop) => !allowedProperties.includes(prop)
      );

      if (invalidProperty) {
        console.error(
          `❌ PROPRIEDADE INCOMPATÍVEL: "${invalidProperty}" não é válida para categoria "${selectedCategory}"`
        );
        console.log(
          `📋 Propriedades válidas para ${selectedCategory}:`,
          allowedProperties
        );

        // Limpar path inválido automaticamente
        setSelectedGraphPath([]);

        // Mostrar apenas propriedades da categoria atual
        optionsToShow = dynamicOptions[""] || [];
        optionsToShow = optionsToShow.filter((option) =>
          allowedProperties.includes(option.value)
        );
        optionsTitle = `Propriedades disponíveis para ${selectedCategory} (path limpo)`;
        emptyMessage = `Propriedade "${invalidProperty}" não é compatível com ${selectedCategory}. Path foi resetado.`;
      }
    }

    // Filtrar propriedades no nível raiz
    if (selectedGraphPath.length === 0 && selectedCategory) {
      // CORREÇÃO: Remover limitação para Initiative
      if (selectedCategory !== "Initiative") {
        const allowedProperties = categoryPropertyMap[selectedCategory];
        if (allowedProperties) {
          optionsToShow = optionsToShow.filter((option) =>
            allowedProperties.includes(option.value)
          );
          console.log(
            `🔍 Propriedades filtradas para ${selectedCategory}:`,
            optionsToShow.map((o) => o.value)
          );
        }
      } else {
        console.log(
          `🔓 Initiative sem filtros: ${optionsToShow.length} propriedades disponíveis`
        );
      }
    }

    // Ordenar as opções por contagem (se disponível)
    const sortedOptions = [...optionsToShow].sort((a, b) => {
      if (a.count && b.count) {
        return b.count - a.count; // Ordem decrescente por contagem
      }
      return 0;
    });

    // Função para limpar filtros e recarregar dados
    const handleReload = () => {
      setSelectedGraphPath([]);
      setSelectedFilters({});
      loadBasicCategoryData(selectedCategory);
    };

    return (
      <div className="dynamic-graph-explorer">
        <div className="explorer-header">
          <h3>{t("queryBuilder.exploreConnectedData")}</h3>
          <button
            className="reload-button"
            onClick={handleReload}
            disabled={isLoadingOptions}
          >
            {isLoadingOptions ? t("common.loading") : t("queryBuilder.reloadData")}
          </button>
        </div>

        {/* Caminho atual */}
        {selectedGraphPath.length > 0 && (
          <div className="current-path">
            <span>{t("queryBuilder.currentPath")}: </span>
            <span className="selected-category">{selectedCategory}</span>
            {selectedGraphPath.map((item, index) => (
              <span
                key={index}
                className={index % 2 === 0 ? "path-property" : "path-value"}
              >
                {index % 2 === 0 ? " → " : ": "}
                {index % 2 === 0 ? formatPropertyName(item) : item}
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
            <div className="loading-indicator">{t("queryBuilder.loadingOptions")}</div>
          ) : sortedOptions && sortedOptions.length > 0 ? (
            <div className="graph-options-list">
              {sortedOptions.map((option, index) => (
                <div
                  key={index}
                  className="graph-option-item"
                  onClick={() =>
                    handleGraphOptionSelect(option, currentGraphLevel)
                  }
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
              <div className="no-data-info">
                <p>{emptyMessage}</p>
                {selectedGraphPath.length > 0 && (
                  <div className="navigation-help">
                    <p>
                      💡 <strong>Dica:</strong> Esta propriedade não tem dados
                      disponíveis.
                    </p>
                    <p>Você pode:</p>
                    <ul>
                      <li>Voltar ao nível anterior</li>
                      <li>Selecionar uma categoria diferente</li>
                      <li>Explorar outras propriedades</li>
                    </ul>
                    <button
                      className="back-button"
                      onClick={() => {
                        // CORREÇÃO: Voltar ao nível anterior - remover 1 elemento
                        const newPath = selectedGraphPath.slice(0, -1);
                        setSelectedGraphPath(newPath);
                        setCurrentGraphLevel(
                          Math.max(0, currentGraphLevel - 1)
                        );
                      }}
                    >
                      ← Voltar ao nível anterior
                    </button>
                    <button
                      className="back-button root-button"
                      onClick={() => {
                        // Voltar à raiz (categorias principais)
                        console.log("🏠 Voltando à raiz");
                        setForceRootView(true);
                        setSelectedCategory("");
                        setSelectedGraphPath([]);
                        setCurrentGraphLevel(0);
                        setDynamicOptions({});
                      }}
                      style={{ marginLeft: "10px", backgroundColor: "#28a745" }}
                    >
                      🏠 Voltar à Raiz
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Área de depuração - Simplificada para não ocupar tanto espaço */}
        <div
          className="debug-info"
          style={{
            margin: "10px 0",
            padding: "10px",
            background: "#f5f5f5",
            border: "1px solid #ddd",
            borderRadius: "4px",
            fontSize: "12px",
          }}
        >
          <div>
            <strong>Debug - Opções disponíveis:</strong>
          </div>
          <div>
            {allOptions.length > 0 ? (
              allOptions.map(([key, options]) => (
                <div key={key} style={{ margin: "5px 0" }}>
                  <strong>{key || "[raiz]"}:</strong> {options.length} opções [
                  {options
                    .slice(0, 3)
                    .map((o) => o.label)
                    .join(", ")}
                  {options.length > 3 ? "..." : ""}]
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

  // Wrap updatePreviewQuery in useCallback
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
      dateRange:
        startDate || endDate
          ? {
              startDate: startDate || undefined,
              endDate: endDate || undefined,
            }
          : undefined,
      sortBy: sortBy || undefined,
      sortOrder: sortBy ? sortOrder : undefined,
      limit: resultLimit,
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
    selectedTags,
  ]);

  // Trigger preview update whenever relevant state changes
  useEffect(() => {
    updatePreviewQuery();
  }, [updatePreviewQuery]);

  // useEffect para executar consulta automaticamente quando filtros mudarem
  useEffect(() => {
    const executeFilterQuery = async () => {
      // Só executar se temos categoria
      if (!selectedCategory) {
        console.log(
          "🔍 useEffect[filtros]: Sem categoria, ignorando execução automática"
        );
        return;
      }

      // Se não há filtros, carregar dados básicos da categoria
      if (selectedGraphPath.length === 0) {
        console.log(
          "🔍 useEffect[filtros]: Sem filtros, carregando dados básicos da categoria"
        );
        // Inline da função para evitar dependência circular
        try {
          setIsExecutingQuery(true);
          console.log(
            `🔍 Carregando dados básicos para categoria: ${selectedCategory}`
          );

          setQueryResults([]);
          console.log(
            `🧹 Resultados limpos, iniciando nova consulta para ${selectedCategory}`
          );

          const result = await queryMappingService.executeDynamicGraphQuery(
            selectedCategory,
            [],
            [
              "created_in",
              "start_date",
              "policy_type",
              "policy_impact",
              "description",
              "objective",
            ]
          );

          if (
            result &&
            result.results &&
            result.results.bindings &&
            result.results.bindings.length > 0
          ) {
            console.log(
              `📊 SUCESSO: Carregados ${result.results.bindings.length} registros para ${selectedCategory}`
            );
            setQueryResults(result.results.bindings as QueryResult[]);
            setTableKey(Date.now().toString());
          } else {
            console.error(
              `❌ PROBLEMA: Nenhum resultado encontrado para a categoria ${selectedCategory}`
            );
            setQueryResults([]);
            setTableKey(Date.now().toString());
          }
        } catch (error) {
          console.error(
            `❌ ERRO CRÍTICO ao carregar dados básicos para ${selectedCategory}:`,
            error
          );
          setQueryResults([]);
          setTableKey(Date.now().toString());
        } finally {
          setIsExecutingQuery(false);
        }
        return;
      }

      // CORREÇÃO: Com a nova estrutura, caminho completo deve ter comprimento par
      // (propriedade + valor)
      if (selectedGraphPath.length % 2 !== 0) {
        console.log(
          "🔍 useEffect[filtros]: Caminho incompleto, aguardando valor"
        );
        return;
      }

      console.log("🔍 useEffect[filtros]: Executando consulta automática", {
        selectedCategory,
        selectedGraphPath,
        pathLength: selectedGraphPath.length,
      });

      try {
        setIsExecutingQuery(true);

        // CORREÇÃO: Usar selectedGraphPath diretamente para consulta SPARQL
        // selectedGraphPath agora contém apenas [propriedade, valor, propriedade, valor...]
        const queryPath = selectedGraphPath;

        console.log(
          "🔍 useEffect[filtros]: Executando consulta com caminho:",
          queryPath
        );

        // Executar a consulta dinâmica
        const result = await queryMappingService.executeDynamicGraphQuery(
          selectedCategory,
          queryPath,
          [
            "created_in",
            "start_date",
            "policy_type",
            "policy_impact",
            "description",
            "objective",
          ]
        );

        if (result && result.results && result.results.bindings) {
          console.log(
            `🔍 useEffect[filtros]: Consulta executada com sucesso - ${result.results.bindings.length} resultados`
          );
          setQueryResults(result.results.bindings as QueryResult[]);
          setTableKey(Date.now().toString()); // Forçar re-renderização da tabela
        } else {
          console.log("🔍 useEffect[filtros]: Nenhum resultado encontrado");
          setQueryResults([]);
          setTableKey(Date.now().toString());
        }
      } catch (error) {
        console.error(
          "🔍 useEffect[filtros]: Erro ao executar consulta:",
          error
        );
        setQueryResults([]);
        setTableKey(Date.now().toString());
      } finally {
        setIsExecutingQuery(false);
      }
    };

    executeFilterQuery();
  }, [selectedCategory, selectedGraphPath]); // Remover loadBasicCategoryDataCallback para evitar loop infinito

  // As consultas são executadas automaticamente através do useEffect quando filtros mudam

  // Renderizar os resultados da consulta
  const renderQueryResults = () => {
    console.log("🔍 renderQueryResults - Estado atual:", {
      isExecutingQuery,
      queryResultsExists: !!queryResults,
      queryResultsLength: queryResults?.length,
      queryResultsType: typeof queryResults,
      queryResultsSample: queryResults?.slice(0, 2),
      selectedCategory,
      tableKey,
      isArrayResults: Array.isArray(queryResults),
    });

    if (isExecutingQuery) {
      return (
        <div className="query-results loading">
          <div className="loading-spinner"></div>
          <p>Executando consulta...</p>
        </div>
      );
    }

    if (
      !queryResults ||
      !Array.isArray(queryResults) ||
      queryResults.length === 0
    ) {
      console.log("🚫 Não renderizando tabela:", {
        noQueryResults: !queryResults,
        notArray: !Array.isArray(queryResults),
        lengthZero: queryResults?.length === 0,
        actualLength: queryResults?.length,
      });
      return (
        <div className="query-results empty">
          <div className="empty-results-message">
            <h3>{t("queryBuilder.queryData.title")}</h3>
            <p>{t("queryBuilder.queryData.subtitle")}</p>
            <div className="instructions">
              <p>
                <strong>{t("queryBuilder.queryData.howToUse.title")}</strong>
              </p>
              <ul>
                <li>{t("queryBuilder.queryData.howToUse.step1")}</li>
                <li>{t("queryBuilder.queryData.howToUse.step2")}</li>
                <li>{t("queryBuilder.queryData.howToUse.step3")}</li>
              </ul>
            </div>
          </div>
        </div>
      );
    }

    // Função para formatar datas
    const formatDate = (dateStr: string) => {
      try {
        const date = new Date(dateStr);
        return date.toLocaleDateString("pt-BR");
      } catch (e) {
        return dateStr;
      }
    };

    // Função para formatar valores
    const formatValue = (value: any) => {
      if (!value) return "-";
      if (typeof value === "object" && value.value) {
        // Se for um valor do SPARQL
        if (value.value.startsWith("http")) {
          // Se for uma URI, pegar só a última parte
          const lastPart =
            value.value.split("#").pop() || value.value.split("/").pop();
          return lastPart || value.value;
        }
        return value.value;
      }
      return value;
    };

    // Função para truncar texto longo
    const truncateText = (text: string, maxLength: number = 50) => {
      if (!text || text.length <= maxLength) return text;
      return text.substring(0, maxLength) + "...";
    };

    // Determinar colunas dinâmicas baseadas nos dados disponíveis
    const availableFields = new Set<string>();
    queryResults.forEach((result) => {
      Object.keys(result).forEach((key) => {
        if (result[key] && formatValue(result[key]) !== "-") {
          availableFields.add(key);
        }
      });
    });

    console.log("🔍 Debug campos disponíveis:", {
      availableFields: Array.from(availableFields),
      sampleResult: queryResults[0],
      sampleResultKeys: Object.keys(queryResults[0] || {}),
    });

    const columnConfig = [
      { key: "label", label: t("properties.label"), required: true },
      { key: "created_in", label: translatePropertyName("created_in"), required: false },
      { key: "start_date", label: translatePropertyName("start_date"), required: false },
      { key: "policy_type", label: translatePropertyName("policy_type"), required: false },
      { key: "policy_impact", label: translatePropertyName("policy_impact"), required: false },
      { key: "description", label: translatePropertyName("description"), required: false },
      { key: "objective", label: translatePropertyName("objective"), required: false },
      { key: "end_date", label: translatePropertyName("end_date"), required: false },
      { key: "target_audience", label: translatePropertyName("target_audience"), required: false },
      { key: "initiative_reach", label: translatePropertyName("initiative_reach"), required: false },
      { key: "initiative_status", label: translatePropertyName("initiative_status"), required: false },
      { key: "initiative_format", label: translatePropertyName("initiative_format"), required: false },
      { key: "coordinator_gender", label: translatePropertyName("coordinator_gender"), required: false },
      { key: "factor_type", label: translatePropertyName("factor_type"), required: false },
      { key: "factors_impact_type", label: translatePropertyName("factors_impact_type"), required: false },
      { key: "analyzed_in", label: translatePropertyName("analyzed_in"), required: false },
    ];

    const visibleColumns = columnConfig.filter(
      (col) => col.required || availableFields.has(col.key)
    );

    console.log("🔍 Debug colunas visíveis:", {
      visibleColumns: visibleColumns.map((c) => c.key),
      visibleColumnsCount: visibleColumns.length,
    });

    // Função para limpar filtros e recarregar dados
    const handleReload = () => {
      setSelectedGraphPath([]);
      setSelectedFilters({});
      loadBasicCategoryData(selectedCategory);
    };

    return (
      <div className="query-results">
        {!selectedCategory && (
          <div className="no-category-selected">
            <h3>{t("queryBuilder.queryData.title")}</h3>
            <p>{t("queryBuilder.queryData.subtitle")}</p>
            <div className="instructions">
              <p>
                <strong>{t("queryBuilder.queryData.howToUse.title")}</strong>
              </p>
              <ul>
                <li>{t("queryBuilder.queryData.howToUse.step1")}</li>
                <li>{t("queryBuilder.queryData.howToUse.step2")}</li>
                <li>{t("queryBuilder.queryData.howToUse.step3")}</li>
              </ul>
            </div>
          </div>
        )}

        {selectedCategory && queryResults.length === 0 && !isExecutingQuery && (
          <div className="no-results-warning">
            <h3>⚠️ Nenhum Resultado Encontrado</h3>
            <p>A consulta atual não retornou nenhum resultado.</p>
            {selectedGraphPath.length > 0 && (
              <div className="filter-info">
                <p>Filtros aplicados:</p>
                <ul>
                  {selectedGraphPath.map((path, index) => (
                    <li key={index}>{path}</li>
                  ))}
                </ul>
                <button className="clear-filters" onClick={handleReload}>
                  🔄 Limpar Filtros
                </button>
              </div>
            )}
          </div>
        )}

        {selectedCategory && queryResults.length > 0 && (
          <>
            <div className="results-header">
              <h3>
                {t("queryBuilder.results.title")}
                <span className="results-count">
                  ({queryResults.length} {t("queryBuilder.results.records")})
                </span>
                {isExecutingQuery && (
                  <span className="loading-indicator"> - {t("common.loading")}</span>
                )}
              </h3>
              <div className="results-info">
                <span className="category-badge">{rootCategories.find(cat => cat.value === selectedCategory)?.label || selectedCategory}</span>
                {selectedGraphPath.length > 0 && (
                  <span className="filter-info">
                    {t("queryBuilder.results.filteredBy")}: {selectedGraphPath.join(" → ")}
                  </span>
                )}
                {selectedGraphPath.length === 0 && (
                  <span className="filter-info">{t("queryBuilder.results.basicData")}</span>
                )}
                <span className="table-status">
                  {t("queryBuilder.results.tableUpdated")}: {new Date().toLocaleTimeString()}
                </span>
              </div>
            </div>

            <div className="results-table-container" key={`table-${tableKey}`}>
              <table className="results-table">
                <thead>
                  <tr>
                    {visibleColumns.map((col) => (
                      <th key={col.key}>{col.label}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {queryResults.map((result, index) => (
                    <tr key={`${tableKey}-row-${index}`}>
                      {visibleColumns.map((col) => (
                        <td
                          key={`${tableKey}-${col.key}-${index}`}
                          className={`col-${col.key}`}
                        >
                          {col.key === "start_date" ? (
                            result[col.key] ? (
                              formatDate(formatValue(result[col.key]))
                            ) : (
                              "-"
                            )
                          ) : col.key === "description" ||
                            col.key === "objective" ? (
                            <span title={formatValue(result[col.key])}>
                              {truncateText(formatValue(result[col.key]))}
                            </span>
                          ) : (
                            formatValue(result[col.key])
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {queryResults.length > 10 && (
              <div className="results-footer">
                <p>
                  Mostrando todos os {queryResults.length} resultados encontrados.
                </p>
                <button
                  className="export-button"
                  onClick={() => {
                    // Implementar exportação futura
                    console.log("Exportar dados:", queryResults);
                  }}
                >
                  📄 Exportar Dados
                </button>
              </div>
            )}
          </>
        )}
      </div>
    );
  };

  return (
    <div className="advanced-query-builder">
      <div className="query-builder-header">
        <h2 className="query-builder-title">{t("queryBuilder.tabs.title")}</h2>
        <div className="query-builder-tabs">
          <button
            className={`tab-button ${activeTab === "basic" ? "active" : ""}`}
            onClick={() => setActiveTab("basic")}
          >
            {t("queryBuilder.tabs.basic")}
          </button>
          <button
            className={`tab-button ${activeTab === "advanced" ? "active" : ""}`}
            onClick={() => setActiveTab("advanced")}
          >
            {t("queryBuilder.tabs.advanced")}
          </button>
          <button
            className={`tab-button ${activeTab === "expert" ? "active" : ""}`}
            onClick={() => setActiveTab("expert")}
          >
            {t("queryBuilder.tabs.expert")}
          </button>
        </div>
      </div>

      <div className="query-form">
        {/* Basic Search Tab - Agora usa a função de categorias raiz */}
        {activeTab === "basic" && (
          <div className="basic-search">
            {/* Navegação hierárquica começando pelas 3 categorias principais */}
            {renderDynamicGraphOptions()}
          </div>
        )}

        {/* Advanced Search Tab */}
        {activeTab === "advanced" && (
          <div className="advanced-search">
            {/* Navegação hierárquica também na aba avançada */}
            {renderDynamicGraphOptions()}

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
                        checked={sortOrder === "asc"}
                        onChange={() => setSortOrder("asc")}
                      />
                      <label htmlFor="sort-asc">Crescente</label>
                    </div>
                    <div className="sort-radio-group">
                      <input
                        type="radio"
                        id="sort-desc"
                        name="sort-direction"
                        checked={sortOrder === "desc"}
                        onChange={() => setSortOrder("desc")}
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

        {/* Expert Search Tab - Nova implementação com SparqlEditor */}
        {activeTab === "expert" && (
          <div className="expert-search">
            <SparqlEditor
              initialQuery={customSparql}
              onQueryChange={setCustomSparql}
              onQueryExecute={(results) => {
                console.log("Resultados da consulta SPARQL:", results);
                // Processar resultados da consulta SPARQL personalizada
                if (results && results.results && results.results.bindings) {
                  setQueryResults(results.results.bindings as QueryResult[]);
                }
              }}
            />

            {/* Explorador de dados conectados também disponível na aba Expert */}
            {selectedCategory && (
              <div className="form-section">
                <h3>🔗 Explorador de Dados Conectados</h3>
                <p className="section-description">
                  Explore as relações entre os dados navegando pelas
                  propriedades e valores disponíveis.
                </p>
                {renderDynamicGraphOptions()}
              </div>
            )}
          </div>
        )}

        {/* Instruções de Pesquisa */}
        <div className="search-instructions">
          <div className="search-instructions-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z" />
            </svg>
          </div>
          <div className="search-instructions-content">
            <h3>{t("queryBuilder.howToSearch.title")}</h3>
            <ol>
              <li dangerouslySetInnerHTML={{ __html: t("queryBuilder.howToSearch.step1") }} />
              <li dangerouslySetInnerHTML={{ __html: t("queryBuilder.howToSearch.step2") }} />
              <li>
                {t("queryBuilder.howToSearch.step3")}
              </li>
              <li dangerouslySetInnerHTML={{ __html: t("queryBuilder.howToSearch.step4") }} />
              <li dangerouslySetInnerHTML={{ __html: t("queryBuilder.howToSearch.step5") }} />
            </ol>
          </div>
        </div>

        {/* Query Preview */}
        {previewQuery && (
          <div className="query-preview">
            <h3>
              {t("queryBuilder.queryPreview.title")}{" "}
              {queryCount > 0 && (
                <span className="query-count">({queryCount} parâmetros)</span>
              )}
            </h3>
            <div className="preview-content">
              <p>
                <strong>Categoria:</strong> {previewQuery.category}
              </p>
              {previewQuery.subCategory && (
                <p>
                  <strong>Subcategoria:</strong> {previewQuery.subCategory}
                </p>
              )}
              {previewQuery.countries.length > 0 && (
                <p>
                  <strong>Países:</strong> {previewQuery.countries.join(", ")}
                </p>
              )}
              {selectedTags.length > 0 && (
                <p>
                  <strong>Tags:</strong> {selectedTags.join(", ")}
                </p>
              )}
              {(startDate || endDate) && (
                <p>
                  <strong>Período:</strong> {startDate || "Início"} até{" "}
                  {endDate || "Presente"}
                </p>
              )}
              {sortBy && (
                <p>
                  <strong>Ordenação:</strong> {sortBy} (
                  {sortOrder === "asc" ? "Crescente" : "Decrescente"})
                </p>
              )}
              {Object.keys(previewQuery.filters).length > 0 && (
                <div>
                  <p>
                    <strong>Filtros:</strong>
                  </p>
                  <ul>
                    {Object.entries(previewQuery.filters).map(
                      ([key, value]) => (
                        <li key={key}>
                          {key}:{" "}
                          {Array.isArray(value)
                            ? value.join(", ")
                            : typeof value === "object"
                            ? JSON.stringify(value)
                            : value}
                        </li>
                      )
                    )}
                  </ul>
                </div>
              )}
              {customFields.keyword && (
                <p>
                  <strong>Palavras-chave:</strong> {customFields.keyword}
                </p>
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
              console.log("🧹 Limpando todos os campos e voltando à raiz");
              setForceRootView(true);
              setSelectedCategory("");
              setSelectedSubCategory("");
              setSelectedCountries([]);
              setSelectedFilters({});
              setCustomFields({});
              setStartDate("");
              setEndDate("");
              setSortBy("");
              setSortOrder("asc");
              setResultLimit(50);
              setSelectedTags([]);
              setCustomSparql("");
              setSelectedGraphPath([]);
              setCurrentGraphLevel(0);
              setDynamicOptions({});
              setQueryResults([]);
              setIsExecutingQuery(false);
              // Forçar re-renderização da tabela após limpar
              setTableKey(Date.now().toString());
            }}
          >
            Limpar
          </button>
        </div>
      </div>

      {showDemoMessage && (
        <div className="demo-mode-banner">
          <div className="demo-mode-message">
            <span>
              <strong>Modo de Demonstração:</strong> Usando dados simulados para
              o explorador de grafos.
              {DEMO_MODE && (
                <button onClick={() => setShowDemoMessage(false)}>×</button>
              )}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default QueryBuilder;
