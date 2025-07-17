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
  const [rootCategories, setRootCategories] = useState(() =>
    getCurrentCategories()
  );

  // Log para debug
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

  // Função para carregar dados básicos de uma categoria
  const loadBasicCategoryData = async (category: string) => {
    try {
      setIsExecutingQuery(true);
      setSelectedGraphPath([]);
      setCurrentGraphLevel(0);
      setSelectedFilters({});
      setDynamicOptions({});
      setQueryResults([]);

      const result = await queryMappingService.executeDynamicGraphQuery(
        category,
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
        setQueryResults(result.results.bindings as QueryResult[]);
        setTableKey(Date.now().toString());
      } else {
        setQueryResults([]);
        setTableKey(Date.now().toString());
      }
    } catch (error) {
      console.error("Erro ao carregar dados básicos:", error);
      setQueryResults([]);
      setTableKey(Date.now().toString());
    } finally {
      setIsExecutingQuery(false);
    }
  };

  // Trigger preview update whenever relevant state changes
  useEffect(() => {
    updatePreviewQuery();
  }, [updatePreviewQuery]);

  // CORREÇÃO CRÍTICA: Sempre começar mostrando categorias raiz
  useEffect(() => {
    setSelectedCategory("");
    setForceRootView(true);
    setSelectedGraphPath([]);
    setCurrentGraphLevel(0);
    setDynamicOptions({});
    setSelectedFilters({});
    setQueryResults([]);
  }, []);

  // CORREÇÃO ADICIONAL: Processar initialCategory corretamente
  useEffect(() => {
    setSelectedCategory("");
    setForceRootView(true);
    setSelectedGraphPath([]);
    setCurrentGraphLevel(0);
    setDynamicOptions({});

    if (initialCategory) {
      // Process initial category if needed
    }
  }, [initialCategory]);

  // Efeito para atualizar as categorias quando o idioma muda
  useEffect(() => {
    setRootCategories(getCurrentCategories());
  }, [i18n.language, getCurrentCategories]);

  // useEffect para executar consulta automaticamente quando filtros mudarem
  useEffect(() => {
    const executeFilterQuery = async () => {
      if (!selectedCategory) {
        return;
      }

      if (selectedGraphPath.length === 0) {
        try {
          setIsExecutingQuery(true);
          setQueryResults([]);

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
            setQueryResults(result.results.bindings as QueryResult[]);
            setTableKey(Date.now().toString());
          } else {
            setQueryResults([]);
            setTableKey(Date.now().toString());
          }
        } catch (error) {
          setQueryResults([]);
          setTableKey(Date.now().toString());
        } finally {
          setIsExecutingQuery(false);
        }
        return;
      }

      if (selectedGraphPath.length % 2 !== 0) {
        return;
      }

      try {
        setIsExecutingQuery(true);
        const queryPath = selectedGraphPath;

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
          setQueryResults(result.results.bindings as QueryResult[]);
          setTableKey(Date.now().toString());
        } else {
          setQueryResults([]);
          setTableKey(Date.now().toString());
        }
      } catch (error) {
        setQueryResults([]);
        setTableKey(Date.now().toString());
      } finally {
        setIsExecutingQuery(false);
      }
    };

    executeFilterQuery();
  }, [selectedCategory, selectedGraphPath]);

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

    if (
      !queryResults ||
      !Array.isArray(queryResults) ||
      queryResults.length === 0
    ) {
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

    // Format function for displaying values
    const formatValue = (value: any) => {
      if (!value || !value.value) return "-";
      const val = value.value;

      // Check if it's a date
      if (val.match(/^\d{4}-\d{2}-\d{2}/)) {
        try {
          return new Date(val).toLocaleDateString();
        } catch {
          return val;
        }
      }

      return val;
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

    const columnConfig = [
      { key: "label", label: t("properties.label"), required: true },
      {
        key: "created_in",
        label: translatePropertyName("created_in"),
        required: false,
      },
      {
        key: "start_date",
        label: translatePropertyName("start_date"),
        required: false,
      },
      {
        key: "policy_type",
        label: translatePropertyName("policy_type"),
        required: false,
      },
    ];

    const visibleColumns = columnConfig.filter(
      (col) => col.required || availableFields.has(col.key)
    );

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
                <button className="reload-button" onClick={handleReload}>
                  🔄 Recarregar Dados
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
                  <span className="loading-indicator">
                    {" "}
                    - {t("common.loading")}
                  </span>
                )}
              </h3>
              <div className="results-info">
                <span className="category-badge">
                  {rootCategories.find((cat) => cat.value === selectedCategory)
                    ?.label || selectedCategory}
                </span>
                {selectedGraphPath.length > 0 && (
                  <span className="filter-info">
                    {t("queryBuilder.results.filteredBy")}:{" "}
                    {selectedGraphPath.join(" → ")}
                  </span>
                )}
                {selectedGraphPath.length === 0 && (
                  <span className="filter-info">
                    {t("queryBuilder.results.basicData")}
                  </span>
                )}
                <span className="table-status">
                  {t("queryBuilder.results.tableUpdated")}:{" "}
                  {new Date().toLocaleTimeString()}
                </span>
              </div>
            </div>

            <div className="results-table-container" key={`table-${tableKey}`}>
              <table className="results-table">
                <thead>
                  <tr>
                    {visibleColumns.map((col) => (
                      <th key={col.key} className={`col-${col.key}`}>
                        {col.label}
                      </th>
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
                            <span className="date-value">
                              📅 {formatValue(result[col.key])}
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
                  Mostrando todos os {queryResults.length} resultados
                  encontrados.
                </p>
                <button
                  className="export-button"
                  onClick={() => {
                    // Implementar exportação futura
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

  // Função para renderizar opções do grafo dinamicamente
  const renderDynamicGraphOptions = () => {
    return (
      <div className="dynamic-graph-container">
        <h3>🔍 Navegação por Categorias</h3>
        <div className="category-cards">
          {rootCategories.map((category) => (
            <div
              key={category.value}
              className={`category-card ${
                selectedCategory === category.value ? "selected" : ""
              }`}
              onClick={async () => {
                setSelectedCategory(category.value);
                setForceRootView(false);
                await loadBasicCategoryData(category.value);
              }}
            >
              <h4>{category.label}</h4>
              <p>Explorar dados de {category.label.toLowerCase()}</p>
            </div>
          ))}
        </div>
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
        {/* Basic Search Tab */}
        {activeTab === "basic" && (
          <div className="basic-search">{renderDynamicGraphOptions()}</div>
        )}

        {/* Advanced Search Tab */}
        {activeTab === "advanced" && (
          <div className="advanced-search">
            {renderDynamicGraphOptions()}

            {/* Date Range e outras opções */}
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

        {/* Expert Search Tab */}
        {activeTab === "expert" && (
          <div className="expert-search">
            <SparqlEditor
              initialQuery={customSparql}
              onQueryChange={setCustomSparql}
              onQueryExecute={(results) => {
                if (results && results.results && results.results.bindings) {
                  setQueryResults(results.results.bindings as QueryResult[]);
                }
              }}
            />

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
