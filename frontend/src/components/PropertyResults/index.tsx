import React from "react";
import { useLanguage } from "../../contexts/LanguageContext";

interface PropertyQueryResult {
  headers: string[];
  rows: Array<Record<string, any>>;
  title: string;
}

interface PropertyResultsProps {
  result: PropertyQueryResult | null;
  loading: boolean;
  error: string | null;
  onRetry?: () => void;
}

const PropertyResults: React.FC<PropertyResultsProps> = ({
  result,
  loading,
  error,
  onRetry,
}) => {
  const { translations } = useLanguage();

  if (loading) {
    return (
      <div className="modal-loading">
        <div className="modal-spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="modal-error">
        <div className="modal-error-message">
          Erro ao carregar dados: {error}
        </div>
        {onRetry && (
          <button className="modal-retry-button" onClick={onRetry}>
            Tentar novamente
          </button>
        )}
      </div>
    );
  }

  if (!result || !result.rows || result.rows.length === 0) {
    return (
      <div className="modal-no-results">
        <div className="modal-no-results-message">
          Nenhum resultado encontrado
        </div>
        <div className="modal-no-results-subtitle">
          Não foram encontrados dados relacionados para esta propriedade.
        </div>
      </div>
    );
  }

  return (
    <div>
      <p className="text-sm text-gray-600 mb-4">
        Encontrados {result.rows.length} resultado(s)
      </p>

      <div className="overflow-x-auto">
        <table className="property-results-table">
          <thead>
            <tr>
              {result.headers.map((header, index) => (
                <th key={index}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {result.rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {result.headers.map((header, cellIndex) => (
                  <td key={cellIndex}>{row[header] || "N/A"}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PropertyResults;
