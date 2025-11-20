import React, { useState } from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import { translateCountry } from "../../utils/exportUtils";
import { translatePropertyName } from "../../utils/propertyTranslations";
import "./styles.css";

// Define o tipo de dado para as linhas da tabela
interface DataTableProps {
  data: any[];
  dynamicFields: string[];
  exportTableDataToCSV: (data: any[], fields: string[]) => void;
  className?: string;
  category?: string; // Categoria dos dados: 'policy', 'initiative', 'factor'
}

interface SortConfig {
  key: string;
  direction: "asc" | "desc";
}

const DataTable: React.FC<DataTableProps> = ({
  data,
  dynamicFields,
  exportTableDataToCSV,
  className = "",
  category = "unknown",
}) => {
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  const [filters, setFilters] = useState<{ [key: string]: string }>({});
  const { translations, language } = useLanguage();

  // Format column headers to be more user-friendly
  const formatColumnHeader = (field: string): string => {
    if (field === 'countryName' || field === 'country') return translations.filters?.country || 'País';
    if (field === 'initiativeName' || field === 'policyName' || field === 'factorName') return translations.properties?.label || 'Nome';
    return translatePropertyName(field);
  };

  // Funções auxiliares
  const isValidUrl = (str: string) => {
    if (!str || typeof str !== 'string') return false;
    
    try {
      const url = new URL(str);
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const normalizeUrl = (str: string) => {
    if (!str || typeof str !== 'string') return str;
    
    // Remove espaços em branco
    let url = str.trim();
    
    // Adiciona protocolo se não existir
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }
    
    return url;
  };

  const truncateUrl = (url: string, maxLength: number = 50) => {
    if (!url || typeof url !== 'string') return url;
    
    if (url.length <= maxLength) return url;
    
    const protocol = url.startsWith('https://') ? 'https://' : 'http://';
    const domain = url.replace(protocol, '');
    
    if (domain.length <= maxLength - 3) {
      return protocol + domain;
    }
    
    return protocol + domain.substring(0, maxLength - 6) + '...';
  };

  const sortData = (key: string) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const handleFilterChange = (field: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Aplicar filtros e ordenação
  let filteredData = [...data];
  Object.keys(filters).forEach((key) => {
    const filterValue = filters[key].toLowerCase();
    if (filterValue) {
      filteredData = filteredData.filter((item) =>
        String(item[key]).toLowerCase().includes(filterValue)
      );
    }
  });

  if (sortConfig) {
    filteredData.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  }

  return (
    <div className={`w-full ${className}`} key={language}>
      {/* Removidos os botões de exportação e compartilhamento */}
      <div className="border border-gray-200 rounded-lg mb-0">
        <div
          className="overflow-y-auto"
          style={{ height: "calc(100vh - 400px)" }}
        >
          <table className="w-full data-table">
            <thead className="sticky top-0 bg-white z-10 border-b border-gray-200">
              <tr>
                {dynamicFields.map((field) => (
                  <th
                    key={field}
                    className="px-4 py-3 bg-[#6B3E82] text-left text-sm font-medium text-white uppercase tracking-wider cursor-pointer hover:bg-[#7d4e9a] break-words max-w-xs"
                    onClick={() => sortData(field)}
                  >
                    {formatColumnHeader(field)}
                    {sortConfig?.key === field && (
                      <span className="ml-1">
                        {sortConfig.direction === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </th>
                ))}
              </tr>
              <tr>
                {dynamicFields.map((field) => (
                  <th
                    key={`filter-${field}`}
                    className="px-4 py-2 bg-[#F5F5F5]"
                  >
                    <input
                      type="text"
                      placeholder={`${
                        translations.filters.filterBy
                      } ${formatColumnHeader(field)}`}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E6A17A] focus:border-transparent"
                      onChange={(e) =>
                        handleFilterChange(field, e.target.value)
                      }
                      value={filters[field] || ""}
                    />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((row, rowIndex) => (
                  <tr
                    key={rowIndex}
                    className={`${
                      rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50"
                    } hover:bg-gray-100 transition-colors`}
                  >
                    {dynamicFields.map((field) => {
                      let cellValue = row[field];
                      
                      // Translate country values
                      if (field === 'countryName' || field === 'country' || field === 'created_in' || field === 'located_in' || field === 'analyzed_in') {
                        cellValue = translateCountry(cellValue, translations);
                      }

                      return (
                      <td
                        key={`${rowIndex}-${field}`}
                        className="px-4 py-3 text-sm text-gray-700 border-b border-gray-200 break-words max-w-xs"
                      >
                        {isValidUrl(row[field]) ? (
                          <a
                            href={normalizeUrl(row[field])}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline break-all"
                            style={{
                              maxWidth: '300px',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              wordBreak: 'break-all',
                              overflowWrap: 'break-word'
                            }}
                            title={`${row[field]} - Clique para abrir em nova aba`}
                          >
                            {truncateUrl(row[field], 60)}
                          </a>
                        ) : (
                          <span>
                            {cellValue}
                          </span>
                        )}
                      </td>
                    );
                    })}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={dynamicFields.length}
                    className="px-4 py-4 text-center text-gray-500 border-b border-gray-200"
                  >
                    {translations?.table?.noData || "Nenhum dado disponível"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DataTable;
