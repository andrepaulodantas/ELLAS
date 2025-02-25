import React, { useState } from "react";
import {
  Facebook,
  Twitter,
  LinkedIn,
  Share,
  Download,
  FileDownload,
  PictureAsPdf,
  Image,
} from "@mui/icons-material";
import { useLanguage } from "../../contexts/LanguageContext";

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

  // Funções de exportação
  const exportToPDF = async () => {
    // Implementação da exportação para PDF
    console.log("Exporting to PDF...");
  };

  const exportToJPG = async () => {
    // Implementação da exportação para JPG
    console.log("Exporting to JPG...");
  };

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const title = "ELLAS Data";
    const description = "Check out this data from ELLAS portal";

    switch (platform) {
      case "facebook":
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
            url
          )}`,
          "_blank"
        );
        break;
      case "twitter":
        window.open(
          `https://twitter.com/intent/tweet?url=${encodeURIComponent(
            url
          )}&text=${encodeURIComponent(title)}`,
          "_blank"
        );
        break;
      case "linkedin":
        window.open(
          `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
            url
          )}&title=${encodeURIComponent(title)}&summary=${encodeURIComponent(
            description
          )}`,
          "_blank"
        );
        break;
    }
  };

  const IconWrapper: React.FC<{
    icon: React.ReactNode;
    className?: string;
  }> = ({ icon, className }) => {
    return <div className={className}>{icon}</div>;
  };

  return (
    <div className={`w-full ${className}`} key={language}>
      {/* Botões de ação */}
      <div className="flex justify-center items-center gap-8 mb-4 py-4 border-t border-gray-200">
        {/* Download Section */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-gray-700">
            <IconWrapper icon={<Download />} className="text-lg" />
            <span className="font-medium">{translations.buttons.export}</span>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => exportTableDataToCSV(data, dynamicFields)}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-green-500 text-white hover:bg-green-600 transition-colors shadow-md hover:shadow-lg"
              title={translations.buttons.export}
            >
              <IconWrapper icon={<FileDownload />} className="text-lg" />
            </button>
            <button
              onClick={exportToPDF}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors shadow-md hover:shadow-lg"
              title={translations.buttons.export}
            >
              <IconWrapper icon={<PictureAsPdf />} className="text-lg" />
            </button>
            <button
              onClick={exportToJPG}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors shadow-md hover:shadow-lg"
              title={translations.buttons.export}
            >
              <IconWrapper icon={<Image />} className="text-lg" />
            </button>
          </div>
        </div>

        <div className="h-8 w-px bg-gray-300"></div>

        {/* Share Section */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-gray-700">
            <IconWrapper icon={<Share />} className="text-lg" />
            <span className="font-medium">{translations.buttons.share}</span>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => handleShare("facebook")}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-[#1877f2] text-white hover:bg-[#166fe5] transition-colors shadow-md hover:shadow-lg"
              title={translations.buttons.share}
            >
              <IconWrapper icon={<Facebook />} className="text-lg" />
            </button>
            <button
              onClick={() => handleShare("twitter")}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-[#1da1f2] text-white hover:bg-[#1a91da] transition-colors shadow-md hover:shadow-lg"
              title={translations.buttons.share}
            >
              <IconWrapper icon={<Twitter />} className="text-lg" />
            </button>
            <button
              onClick={() => handleShare("linkedin")}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-[#0a66c2] text-white hover:bg-[#094ea3] transition-colors shadow-md hover:shadow-lg"
              title={translations.buttons.share}
            >
              <IconWrapper icon={<LinkedIn />} className="text-lg" />
            </button>
          </div>
        </div>
      </div>

      {/* Tabela */}
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
                    className="px-4 py-2 bg-[#6B4A7D] text-left text-sm font-medium text-white uppercase tracking-wider cursor-pointer hover:bg-[#7d5b8f] break-words max-w-xs"
                    onClick={() => sortData(field)}
                  >
                    {field}
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
                      placeholder={`${translations.filters.filterBy} ${field}`}
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
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredData.length === 0 ? (
                <tr>
                  <td
                    colSpan={dynamicFields.length}
                    className="px-4 py-3 text-sm text-gray-500 text-center"
                  >
                    {translations.table.noData}
                  </td>
                </tr>
              ) : (
                filteredData.map((row, rowIndex) => (
                  <tr
                    key={rowIndex}
                    className="hover:bg-[#F8F4FA] transition-colors"
                  >
                    {dynamicFields.map((field) => (
                      <td
                        key={`${rowIndex}-${field}`}
                        className="px-4 py-3 text-sm text-gray-900 break-words"
                        style={{ minWidth: "150px", maxWidth: "300px" }}
                      >
                        {isValidUrl(String(row[field])) ? (
                          <a
                            href={row[field]}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#4A2B5C] hover:text-[#E6A17A] hover:underline break-words"
                          >
                            {row[field]}
                          </a>
                        ) : (
                          String(row[field])
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DataTable;
