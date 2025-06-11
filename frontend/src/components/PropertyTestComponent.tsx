import React, { useState } from "react";
import { exploreValuesForProperty } from "../services/queryMappingService";
import { GraphOption } from "../services/queryMappingService";

interface TestResult {
  property: string;
  category: string;
  success: boolean;
  values: GraphOption[];
  error?: string;
  duration: number;
}

const PropertyTestComponent: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<TestResult[]>([]);

  const testProperties = [
    { category: "Initiative", property: "initiative_website" },
    { category: "Initiative", property: "initiative_status" },
    { category: "Initiative", property: "created_in" },
    { category: "Policy", property: "policy_type" },
    { category: "Policy", property: "created_in" },
  ];

  const runTest = async (
    category: string,
    property: string
  ): Promise<TestResult> => {
    const startTime = Date.now();

    try {
      console.log(`🧪 Testando ${property} em ${category}`);
      const values = await exploreValuesForProperty(category, property, {});
      const duration = Date.now() - startTime;

      return {
        property,
        category,
        success: true,
        values,
        duration,
      };
    } catch (error) {
      const duration = Date.now() - startTime;

      return {
        property,
        category,
        success: false,
        values: [],
        error: error instanceof Error ? error.message : "Erro desconhecido",
        duration,
      };
    }
  };

  const runAllTests = async () => {
    setIsLoading(true);
    setResults([]);

    console.log("🔬 Iniciando bateria de testes de propriedades...");

    const testResults: TestResult[] = [];

    for (const test of testProperties) {
      const result = await runTest(test.category, test.property);
      testResults.push(result);
      setResults([...testResults]); // Atualizar resultados incrementalmente
    }

    setIsLoading(false);
    console.log("✅ Testes concluídos");
  };

  const getStatusIcon = (result: TestResult) => {
    if (result.success && result.values.length > 0) {
      return "✅"; // Sucesso com dados
    } else if (result.success && result.values.length === 0) {
      return "⚠️"; // Sucesso mas sem dados
    } else {
      return "❌"; // Erro
    }
  };

  const getStatusText = (result: TestResult) => {
    if (result.success && result.values.length > 0) {
      return `${result.values.length} valores encontrados`;
    } else if (result.success && result.values.length === 0) {
      return "Nenhum valor encontrado";
    } else {
      return `Erro: ${result.error}`;
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h2>🧪 Teste de Conectividade de Propriedades</h2>
      <p>
        Este componente testa a conectividade com o GraphDB para diferentes
        propriedades.
      </p>

      <button
        onClick={runAllTests}
        disabled={isLoading}
        style={{
          padding: "10px 20px",
          backgroundColor: isLoading ? "#ccc" : "#007bff",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: isLoading ? "not-allowed" : "pointer",
          marginBottom: "20px",
        }}
      >
        {isLoading ? "🔄 Executando testes..." : "▶️ Executar Testes"}
      </button>

      {results.length > 0 && (
        <div>
          <h3>📊 Resultados dos Testes</h3>

          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginBottom: "20px",
            }}
          >
            <thead>
              <tr style={{ backgroundColor: "#f8f9fa" }}>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                  Status
                </th>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                  Categoria
                </th>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                  Propriedade
                </th>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                  Resultado
                </th>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                  Tempo (ms)
                </th>
              </tr>
            </thead>
            <tbody>
              {results.map((result, index) => (
                <tr key={index}>
                  <td
                    style={{
                      border: "1px solid #ddd",
                      padding: "8px",
                      textAlign: "center",
                    }}
                  >
                    {getStatusIcon(result)}
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {result.category}
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {result.property}
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {getStatusText(result)}
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {result.duration}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Mostrar detalhes dos valores para testes bem-sucedidos */}
          {results
            .filter((r) => r.success && r.values.length > 0)
            .map((result, index) => (
              <div
                key={index}
                style={{
                  marginBottom: "20px",
                  padding: "10px",
                  border: "1px solid #ddd",
                  borderRadius: "5px",
                }}
              >
                <h4>
                  🎯 Valores para {result.category}.{result.property}
                </h4>
                <ul>
                  {result.values.slice(0, 5).map((value, vIndex) => (
                    <li key={vIndex}>
                      <strong>{value.label}</strong>
                      {value.count && ` (${value.count} ocorrências)`}
                    </li>
                  ))}
                  {result.values.length > 5 && (
                    <li>
                      <em>... e mais {result.values.length - 5} valores</em>
                    </li>
                  )}
                </ul>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default PropertyTestComponent;
