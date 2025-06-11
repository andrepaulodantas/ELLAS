import React, { useState, useEffect } from "react";
import {
  explorePropertiesForClass,
  exploreValuesForProperty,
} from "../../services/queryMappingService";

const DiagnosticTest: React.FC = () => {
  const [results, setResults] = useState<any>({
    initiativeProperties: null,
    createdInValues: null,
    websiteValues: null,
    loading: false,
    error: null,
  });

  const runDiagnostic = async () => {
    setResults((prev) => ({ ...prev, loading: true, error: null }));

    try {
      console.log("🧪 Iniciando teste de diagnóstico...");

      // Teste 1: Explorar propriedades de Initiative
      console.log("🔍 Teste 1: Explorando propriedades de Initiative");
      const initiativeProperties = await explorePropertiesForClass(
        "Initiative"
      );
      console.log("✅ Propriedades de Initiative:", initiativeProperties);

      // Teste 2: Explorar valores para created_in
      console.log("🔍 Teste 2: Explorando valores para created_in");
      const createdInValues = await exploreValuesForProperty(
        "Initiative",
        "created_in"
      );
      console.log("✅ Valores de created_in:", createdInValues);

      // Teste 3: Explorar valores para initiative_website
      console.log("🔍 Teste 3: Explorando valores para initiative_website");
      const websiteValues = await exploreValuesForProperty(
        "Initiative",
        "initiative_website"
      );
      console.log("✅ Valores de initiative_website:", websiteValues);

      setResults({
        initiativeProperties,
        createdInValues,
        websiteValues,
        loading: false,
        error: null,
      });

      console.log("🎉 Teste de diagnóstico completo!");
    } catch (error) {
      console.error("❌ Erro no teste de diagnóstico:", error);
      setResults((prev) => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : "Erro desconhecido",
      }));
    }
  };

  const formatResults = (data: any[], title: string) => {
    if (!data || data.length === 0) {
      return (
        <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mb-4">
          <h4 className="font-semibold text-yellow-800">{title}</h4>
          <p className="text-yellow-600">Nenhum resultado encontrado</p>
        </div>
      );
    }

    return (
      <div className="bg-green-50 border border-green-200 rounded p-3 mb-4">
        <h4 className="font-semibold text-green-800 mb-2">
          {title} ({data.length} resultados)
        </h4>
        <div className="max-h-32 overflow-y-auto">
          {data.slice(0, 10).map((item, index) => (
            <div key={index} className="text-sm text-green-700 mb-1">
              <span className="font-medium">{item.label || item.value}</span>
              {item.count && (
                <span className="text-green-500 ml-2">({item.count})</span>
              )}
            </div>
          ))}
          {data.length > 10 && (
            <p className="text-green-600 text-xs">
              ... e mais {data.length - 10} resultados
            </p>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          🧪 Teste de Diagnóstico ELLAS
        </h2>

        <p className="text-gray-600 mb-6">
          Este teste verifica se o sistema está retornando dados corretos para
          consultas de propriedades.
        </p>

        <button
          onClick={runDiagnostic}
          disabled={results.loading}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-medium py-2 px-4 rounded-md transition-colors mb-6"
        >
          {results.loading
            ? "🔄 Executando..."
            : "🚀 Executar Teste de Diagnóstico"}
        </button>

        {results.error && (
          <div className="bg-red-50 border border-red-200 rounded p-4 mb-6">
            <h4 className="font-semibold text-red-800">❌ Erro</h4>
            <p className="text-red-600">{results.error}</p>
          </div>
        )}

        {results.initiativeProperties && (
          <>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              📊 Resultados dos Testes
            </h3>

            {formatResults(
              results.initiativeProperties,
              "1. Propriedades de Initiative (deve ter 28 itens)"
            )}

            {formatResults(
              results.createdInValues,
              "2. Valores de created_in (deve ter 44 países)"
            )}

            {formatResults(
              results.websiteValues,
              "3. Valores de initiative_website (deve ter 1 item)"
            )}

            <div className="bg-blue-50 border border-blue-200 rounded p-4 mt-6">
              <h4 className="font-semibold text-blue-800 mb-2">
                📋 Resumo do Teste
              </h4>
              <ul className="text-blue-700 space-y-1">
                <li>
                  ✅ Propriedades de Initiative:{" "}
                  {results.initiativeProperties?.length || 0} encontradas
                </li>
                <li>
                  ✅ Países (created_in): {results.createdInValues?.length || 0}{" "}
                  encontrados
                </li>
                <li>
                  ✅ Websites: {results.websiteValues?.length || 0} encontrados
                </li>
              </ul>

              {results.initiativeProperties?.length === 28 &&
              results.createdInValues?.length >= 40 &&
              results.websiteValues?.length >= 1 ? (
                <p className="text-green-600 font-semibold mt-3">
                  🎉 Todos os testes passaram!
                </p>
              ) : (
                <p className="text-orange-600 font-semibold mt-3">
                  ⚠️ Alguns resultados podem estar usando dados de fallback
                </p>
              )}
            </div>
          </>
        )}

        <div className="mt-6 text-sm text-gray-500">
          <p>
            💡 <strong>Dica:</strong> Abra as ferramentas de desenvolvedor (F12)
            para ver logs detalhados da execução.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DiagnosticTest;
