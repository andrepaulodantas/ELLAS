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

  // Funções de exportação
  const exportToPDF = async () => {
    try {
      // Import jsPDF dynamically to reduce initial load time
      const { jsPDF } = await import("jspdf");
      const { default: autoTable } = await import("jspdf-autotable");

      const doc = new jsPDF();

      // Add title
      doc.setFontSize(16);
      doc.text("ELLAS - Dados Exportados", 14, 15);
      doc.setFontSize(10);
      doc.text(
        `Data de exportação: ${new Date().toLocaleDateString()}`,
        14,
        22
      );

      // Format headers for PDF
      const headers = dynamicFields.map((field) => formatColumnHeader(field));

      // Format data for PDF
      const tableData = filteredData.map((row) =>
        dynamicFields.map((field) => row[field])
      );

      // Generate table
      autoTable(doc, {
        head: [headers],
        body: tableData,
        startY: 30,
        styles: { fontSize: 8, cellPadding: 2 },
        headStyles: { fillColor: [107, 74, 125], textColor: [255, 255, 255] },
      });

      // Save PDF
      doc.save("ellas_data_export.pdf");
    } catch (error) {
      console.error("Error exporting to PDF:", error);
      alert("Erro ao exportar para PDF. Por favor, tente novamente.");
    }
  };

  const exportToJPG = async () => {
    try {
      // Import html2canvas dynamically
      const html2canvas = (await import("html2canvas")).default;

      // Get the table element
      const table = document.querySelector("table");
      if (!table) throw new Error("Table element not found");

      // Create a clone of the table to avoid modifying the original
      const tableClone = table.cloneNode(true) as HTMLElement;

      // Apply styles for better image quality
      tableClone.style.width = "auto";
      tableClone.style.border = "1px solid #ccc";
      tableClone.style.borderCollapse = "collapse";

      // Create a container with white background
      const container = document.createElement("div");
      container.style.position = "absolute";
      container.style.left = "-9999px";
      container.style.background = "white";
      container.style.padding = "20px";
      container.appendChild(tableClone);
      document.body.appendChild(container);

      // Add title
      const title = document.createElement("h2");
      title.textContent = "ELLAS - Dados Exportados";
      title.style.fontFamily = "Arial, sans-serif";
      title.style.marginBottom = "10px";
      container.insertBefore(title, tableClone);

      // Convert to canvas and then to image
      const canvas = await html2canvas(container, { scale: 2 });

      // Remove the temporary container
      document.body.removeChild(container);

      // Convert to image and download
      const image = canvas.toDataURL("image/jpeg", 1.0);
      const link = document.createElement("a");
      link.download = "ellas_data_export.jpg";
      link.href = image;
      link.click();
    } catch (error) {
      console.error("Error exporting to JPG:", error);
      alert("Erro ao exportar para JPG. Por favor, tente novamente.");
    }
  };

  const handleShare = (platform: string) => {
    // ELLAS social media profiles
    const ellasProfiles = {
      facebook: "https://www.facebook.com/ellas.latinamerica",
      twitter: "https://twitter.com/ellas_network",
      linkedin: "https://www.linkedin.com/company/ellas-network",
    };

    // Open the corresponding social media profile
    if (ellasProfiles[platform]) {
      window.open(ellasProfiles[platform], "_blank");
    }
  };

  const IconWrapper: React.FC<{
    icon: React.ReactNode;
    className?: string;
  }> = ({ icon, className }) => {
    return (
      <span className={`flex items-center justify-center ${className}`}>
        {icon}
      </span>
    );
  };

  // Export to CSV with formatted headers
  const handleExportCSV = () => {
    try {
      if (!data || data.length === 0) {
        alert(translations.table.noData);
        return;
      }

      // Format headers for CSV
      const formattedHeaders = dynamicFields.map((field) =>
        formatColumnHeader(field)
      );

      // Create CSV content with formatted headers
      const csvContent = [
        // Headers row
        formattedHeaders.join(","),
        // Data rows
        ...filteredData.map((row) =>
          dynamicFields
            .map((field) => {
              // Handle values with commas by wrapping in quotes
              const value = String(row[field] || "");
              return value.includes(",") ? `"${value}"` : value;
            })
            .join(",")
        ),
      ].join("\n");

      // Create blob and trigger download
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "ellas_data_export.csv";
      link.click();
      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error("Error exporting to CSV:", error);
      alert("Erro ao exportar para CSV. Por favor, tente novamente.");
    }
  };

  return (
    <div className={`w-full ${className}`} key={language}>
      {/* Botões de ação */}
      <div className="share-buttons-container py-4 border-t border-gray-200">
        {/* Download Section */}
        <div className="share-section">
          <div className="share-label">
            <IconWrapper
              icon={<Download fontSize="medium" />}
              className="text-lg"
            />
            <span>{translations.buttons.export}</span>
          </div>
          <div className="share-buttons">
            <button
              onClick={handleExportCSV}
              className="share-button csv-button"
              title={translations.buttons.export}
            >
              <IconWrapper
                icon={<FileDownload fontSize="medium" />}
                className="text-lg"
              />
            </button>
            <button
              onClick={exportToPDF}
              className="share-button"
              style={{ backgroundColor: "#dc2626" }}
              title={translations.buttons.export}
            >
              <IconWrapper
                icon={<PictureAsPdf fontSize="medium" />}
                className="text-lg"
              />
            </button>
            <button
              onClick={exportToJPG}
              className="share-button"
              style={{ backgroundColor: "#2563eb" }}
              title={translations.buttons.export}
            >
              <IconWrapper
                icon={<Image fontSize="medium" />}
                className="text-lg"
              />
            </button>
          </div>
        </div>

        <div className="divider"></div>

        {/* Share Section */}
        <div className="share-section">
          <div className="share-label">
            <IconWrapper
              icon={<Share fontSize="medium" />}
              className="text-lg"
            />
            <span>{translations.buttons.share}</span>
          </div>
          <div className="share-buttons">
            <button
              onClick={() => handleShare("facebook")}
              className="share-button facebook-button"
              title="Facebook ELLAS"
            >
              <IconWrapper
                icon={<Facebook fontSize="medium" />}
                className="text-lg"
              />
            </button>
            <button
              onClick={() => handleShare("twitter")}
              className="share-button twitter-button"
              title="Twitter ELLAS"
            >
              <IconWrapper
                icon={<Twitter fontSize="medium" />}
                className="text-lg"
              />
            </button>
            <button
              onClick={() => handleShare("linkedin")}
              className="share-button linkedin-button"
              title="LinkedIn ELLAS"
            >
              <IconWrapper
                icon={<LinkedIn fontSize="medium" />}
                className="text-lg"
              />
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
