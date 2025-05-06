import React, { useState } from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import "./styles.css";

// Define o tipo de dado para as linhas da tabela
interface DataTableProps {
  data: any[];
  dynamicFields: string[];
  exportTableDataToCSV: (data: any[], fields: string[]) => void;
  className?: string;
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
}) => {
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  const [filters, setFilters] = useState<{ [key: string]: string }>({});
  const { translations, language } = useLanguage();

  // Format column headers to be more user-friendly
  const formatColumnHeader = (field: string): string => {
    // Convert database field names to proper titles
    const fieldMap: { [key: string]: string } = {
      POLICYNAME: translations.categories.policies,
      COUNTRYNAME: translations.filters.country,
      START_DATE:
        language === "pt"
          ? "Data de Início"
          : language === "es"
          ? "Fecha de Inicio"
          : "Start Date",
      END_DATE:
        language === "pt"
          ? "Data de Término"
          : language === "es"
          ? "Fecha de Finalización"
          : "End Date",
      DESCRIPTION:
        language === "pt"
          ? "Descrição"
          : language === "es"
          ? "Descripción"
          : "Description",
      INITIATIVENAME: translations.categories.initiatives,
      ORGANIZATIONNAME:
        language === "pt"
          ? "Organização"
          : language === "es"
          ? "Organización"
          : "Organization",
      FACTORNAME: translations.categories.factors,
      // Add more mappings as needed
    };

    // If we have a specific mapping, use it
    if (fieldMap[field]) {
      return fieldMap[field];
    }

    // Otherwise, format the field name
    // Convert snake_case or camelCase to Title Case with spaces
    return field
      .replace(/_/g, " ")
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase())
      .trim();
  };

  // Funções auxiliares
  const isValidUrl = (str: string) => {
    try {
      new URL(str);
      return true;
    } catch {
      return false;
    }
  };

  const sortData = (key: string) => {
    let direction: "asc" | "desc" = "asc";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "asc"
    ) {
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
          <table className="w-full">
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
                    {dynamicFields.map((field) => (
                      <td
                        key={`${rowIndex}-${field}`}
                        className="px-4 py-3 text-sm text-gray-700 border-b border-gray-200 break-words max-w-xs"
                      >
                        {isValidUrl(row[field]) ? (
                          <a
                            href={row[field]}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            {row[field]}
                          </a>
                        ) : (
                          row[field]
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={dynamicFields.length}
                    className="px-4 py-4 text-center text-gray-500 border-b border-gray-200"
                  >
                    {translations.table.noData}
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
