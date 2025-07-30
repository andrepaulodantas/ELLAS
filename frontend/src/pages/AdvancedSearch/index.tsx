import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import { QueryBuilder } from "../../components";
import Header from "../../components/Header";
import "./styles.css";

interface CustomQuery {
  category: string;
  subCategory?: string;
  countries: string[];
  filters: Record<string, any>;
  customFields?: Record<string, any>;
}

const AdvancedSearchPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchCount, setSearchCount] = useState(() => {
    const savedCount = localStorage.getItem("advanced_search_count");
    return savedCount ? parseInt(savedCount) : 0;
  });
  const [searchError, setSearchError] = useState<string | null>(null);
  const [lastSuccessfulQuery, setLastSuccessfulQuery] =
    useState<CustomQuery | null>(() => {
      const lastQuery = localStorage.getItem("last_successful_query");
      return lastQuery ? JSON.parse(lastQuery) : null;
    });

  // Detectar se é a primeira visita à página para mostrar o guia
  const [showGuide, setShowGuide] = useState(() => {
    const visited = localStorage.getItem("advanced_search_visited");
    return !visited;
  });

  useEffect(() => {
    // Marcar como visitado após o primeiro carregamento
    if (showGuide) {
      localStorage.setItem("advanced_search_visited", "true");
    }
  }, [showGuide]);

  // Salvar a contagem de buscas e a última busca bem-sucedida no localStorage
  useEffect(() => {
    if (searchCount > 0) {
      localStorage.setItem("advanced_search_count", searchCount.toString());
    }
  }, [searchCount]);

  useEffect(() => {
    if (lastSuccessfulQuery) {
      localStorage.setItem(
        "last_successful_query",
        JSON.stringify(lastSuccessfulQuery)
      );
    }
  }, [lastSuccessfulQuery]);

  const validateQuery = useCallback((query: CustomQuery): string | null => {
    console.log("Validando consulta:", query);

    // Validação básica: apenas verificar se uma categoria foi selecionada
    if (!query.category) {
      return t("advancedSearch.validation.categoryRequired");
    }

    // Não exigir mais a seleção de país para nenhuma consulta
    // Todas as consultas agora são flexíveis e funcionam com ou sem país selecionado
    return null;
  }, [t]);

  const handleQuerySubmit = async (query: CustomQuery) => {
    setIsSubmitting(true);
    setSearchError(null);

    try {
      // Validar a query
      const validationError = validateQuery(query);
      if (validationError) {
        throw new Error(validationError);
      }

      // Convert the query to URL parameters for the search page
      const params = new URLSearchParams();

      // Add basic parameters
      params.append("category", query.category);

      if (query.subCategory) {
        params.append("subCategory", query.subCategory);
      }

      if (query.countries && query.countries.length > 0) {
        params.append("countries", query.countries.join(","));
        // Also add preselect parameter for map visualization
        params.append("preselect", query.countries.join(","));
      }

      // Add filters as URL parameters
      Object.entries(query.filters).forEach(([key, value]) => {
        if (Array.isArray(value) && value.length > 0) {
          params.append(key, value.join(","));
        } else if (value !== null && value !== undefined && value !== "") {
          params.append(key, String(value));
        }
      });

      // Process audience filters specially - convert checkboxes to comma-separated string
      if (
        query.filters.audience &&
        Array.isArray(query.filters.audience) &&
        query.filters.audience.length > 0
      ) {
        params.append("audience", query.filters.audience.join(","));
      }

      // Add custom fields if any
      if (query.customFields) {
        Object.entries(query.customFields).forEach(([key, value]) => {
          if (value !== null && value !== undefined && value !== "") {
            params.append(`custom_${key}`, String(value));
          }
        });
      }

      // Force execution flag to ensure query runs on arrival at BuscaOne
      params.append("forceExecution", "true");

      // Armazenar a última consulta bem-sucedida
      setLastSuccessfulQuery(query);

      // Increment search count to show the notification
      setSearchCount((prevCount) => prevCount + 1);

      // Add timestamp to ensure the query is treated as new by React router
      params.append("t", Date.now().toString());

      // Feedback visual antes de navegar
      setTimeout(() => {
        console.log(
          "Navegando para BuscaOne com parâmetros:",
          params.toString()
        );
        navigate(`/open-data/1?${params.toString()}`);
        setIsSubmitting(false);
      }, 800);
    } catch (error) {
      console.error("Erro ao processar consulta:", error);
      setSearchError(
        error instanceof Error
          ? error.message
          : t("advancedSearch.errors.unknownError")
      );
      setIsSubmitting(false);
    }
  };

  // Fechar o guia de introdução
  const closeGuide = () => {
    setShowGuide(false);
  };

  // Limpar o histórico de buscas
  const clearSearchHistory = () => {
    setSearchCount(0);
    setLastSuccessfulQuery(null);
    localStorage.removeItem("advanced_search_count");
    localStorage.removeItem("last_successful_query");
  };

  return (
    <>
      <Helmet>
        <title>{t("advancedSearch.pageTitle")}</title>
        <meta
          name="description"
          content={t("advancedSearch.pageDescription")}
        />
      </Helmet>

      <Header />
      <div className="advanced-search-page">
        <div className="advanced-search-header">
          <h1>{t("advancedSearch.title")}</h1>
          <p>
            {t("advancedSearch.description")}
          </p>

          {searchCount > 0 && (
            <div
              className="search-count-badge"
              title={t("advancedSearch.searchCount.tooltip")}
            >
              {t("advancedSearch.searchCount.label", { count: searchCount })}
              <button
                onClick={clearSearchHistory}
                className="clear-history-button"
                title={t("advancedSearch.searchCount.clearTooltip")}
              >
                ×
              </button>
            </div>
          )}

          {lastSuccessfulQuery && (
            <div className="last-query-indicator" title={t("advancedSearch.lastQuery.tooltip")}>
              {t("advancedSearch.lastQuery.label")} {lastSuccessfulQuery.category} -
              {lastSuccessfulQuery.countries.length > 0
                ? ` ${lastSuccessfulQuery.countries.length} ${
                    lastSuccessfulQuery.countries.length === 1
                      ? t("advancedSearch.lastQuery.country")
                      : t("advancedSearch.lastQuery.countries")
                  }`
                : ` ${t("advancedSearch.lastQuery.allCountries")}`}
            </div>
          )}
        </div>

        {/* Mostrar mensagem de erro se houver */}
        {searchError && (
          <div className="error-message">
            <p>⚠️ {searchError}</p>
            <button onClick={() => setSearchError(null)}>{t("advancedSearch.errors.close")}</button>
          </div>
        )}

        <div className="advanced-search-content">
          <QueryBuilder onQuerySubmit={handleQuerySubmit} />
        </div>

        {/* Botão de Construir Consulta fixo na parte inferior */}
        <div className="fixed-build-button">
          <button
            onClick={() => setShowGuide(true)}
            className="fixed-build-button-inner"
            title={t("advancedSearch.helpButton")}
          >
            {t("advancedSearch.buildQuery")} ➔
          </button>
        </div>

        {/* Guia de introdução para novos usuários */}
        {showGuide && (
          <div className="guide-overlay">
            <div className="guide-content">
              <h2>{t("advancedSearch.guide.title")}</h2>
              <p>
                {t("advancedSearch.guide.description")}
              </p>

              <div className="guide-steps">
                <div className="guide-step">
                  <div className="step-number">1</div>
                  <div className="step-content">
                    <h3>{t("advancedSearch.guide.step1.title")}</h3>
                    <p>
                      {t("advancedSearch.guide.step1.description")}
                    </p>
                  </div>
                </div>

                <div className="guide-step">
                  <div className="step-number">2</div>
                  <div className="step-content">
                    <h3>{t("advancedSearch.guide.step2.title")}</h3>
                    <p>
                      {t("advancedSearch.guide.step2.description")}
                    </p>
                  </div>
                </div>

                <div className="guide-step">
                  <div className="step-number">3</div>
                  <div className="step-content">
                    <h3>{t("advancedSearch.guide.step3.title")}</h3>
                    <p>
                      {t("advancedSearch.guide.step3.description")}
                    </p>
                  </div>
                </div>

                <div className="guide-step">
                  <div className="step-number">4</div>
                  <div className="step-content">
                    <h3>{t("advancedSearch.guide.step4.title")}</h3>
                    <p>
                      {t("advancedSearch.guide.step4.description")}
                    </p>
                  </div>
                </div>
              </div>

              <button className="guide-close-button" onClick={closeGuide}>
                {t("advancedSearch.guide.closeButton")}
              </button>
            </div>
          </div>
        )}

        {isSubmitting && (
          <div className="loading-overlay">
            <div className="loading-spinner"></div>
            <p>{t("advancedSearch.loading")}</p>
          </div>
        )}

        {/* Botão de ajuda flutuante */}
        <button
          className="help-button"
          onClick={() => setShowGuide(true)}
          aria-label={t("advancedSearch.helpButton")}
        >
          ?
        </button>
      </div>
    </>
  );
};

export default AdvancedSearchPage;
