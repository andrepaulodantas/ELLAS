import React, { useState, useEffect } from "react";
import { Button } from "../../components";
import { saveAs } from "file-saver";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

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
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [filteredData, setFilteredData] = useState(data);
  const tableRef = React.useRef<HTMLDivElement>(null);

  // URL validation
  const isValidUrl = (str: string) => {
    try {
      new URL(str);
      return true;
    } catch {
      return false;
    }
  };

  // Sorting function
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

  // Filter function
  const handleFilterChange = (field: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value.toLowerCase(),
    }));
  };

  // Apply filters and sorting
  useEffect(() => {
    let result = [...data];

    // Apply filters
    Object.keys(filters).forEach((key) => {
      if (filters[key]) {
        result = result.filter((item) =>
          String(item[key]).toLowerCase().includes(filters[key])
        );
      }
    });

    // Apply sorting
    if (sortConfig) {
      result.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }

    setFilteredData(result);
  }, [data, filters, sortConfig]);

  // Export functions
  const exportToPDF = async () => {
    if (tableRef.current) {
      const canvas = await html2canvas(tableRef.current);
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("l", "mm", "a4");
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("table-data.pdf");
    }
  };

  const exportToJPG = async () => {
    if (tableRef.current) {
      const canvas = await html2canvas(tableRef.current);
      canvas.toBlob((blob) => {
        if (blob) {
          saveAs(blob, "table-data.jpg");
        }
      });
    }
  };

  const currentUrl = window.location.href;

  const handleShare = (platform: string) => {
    const shareUrl = currentUrl;
    const title = "Check out this data from ELLAS";

    switch (platform) {
      case "facebook":
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
            shareUrl
          )}`,
          "_blank"
        );
        break;
      case "twitter":
        window.open(
          `https://twitter.com/intent/tweet?url=${encodeURIComponent(
            shareUrl
          )}&text=${encodeURIComponent(title)}`,
          "_blank"
        );
        break;
      case "linkedin":
        window.open(
          `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
            shareUrl
          )}`,
          "_blank"
        );
        break;
    }
  };

  return (
    <div className={`w-full px-4 sm:px-6 lg:px-8 ${className}`}>
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={() => exportTableDataToCSV(data, dynamicFields)}
            variant="outline"
            className="text-sm sm:text-base w-full sm:w-auto"
          >
            Export CSV
          </Button>
          <Button
            onClick={exportToPDF}
            variant="outline"
            className="text-sm sm:text-base w-full sm:w-auto"
          >
            Export PDF
          </Button>
          <Button
            onClick={exportToJPG}
            variant="outline"
            className="text-sm sm:text-base w-full sm:w-auto"
          >
            Export JPG
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={() => handleShare("facebook")}
            variant="outline"
            className="text-sm sm:text-base w-full sm:w-auto"
          >
            Share on Facebook
          </Button>
          <Button
            onClick={() => handleShare("twitter")}
            variant="outline"
            className="text-sm sm:text-base w-full sm:w-auto"
          >
            Share on Twitter
          </Button>
          <Button
            onClick={() => handleShare("linkedin")}
            variant="outline"
            className="text-sm sm:text-base w-full sm:w-auto"
          >
            Share on LinkedIn
          </Button>
        </div>
      </div>

      <div className="w-full" ref={tableRef}>
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="sticky top-0 bg-white z-10 border-b border-gray-200">
            <div className="w-full overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="px-2 sm:px-4 py-2 bg-gray-50 min-w-[120px] sm:min-w-[150px]">
                      <div className="text-sm sm:text-base">Country</div>
                      <input
                        type="text"
                        placeholder="Filter..."
                        className="w-full mt-1 p-1 text-xs sm:text-sm border rounded"
                        onChange={(e) =>
                          handleFilterChange("country", e.target.value)
                        }
                      />
                    </th>
                    <th className="px-2 sm:px-4 py-2 bg-gray-50 min-w-[150px] sm:min-w-[200px]">
                      <div className="text-sm sm:text-base">Name</div>
                      <input
                        type="text"
                        placeholder="Filter..."
                        className="w-full mt-1 p-1 text-xs sm:text-sm border rounded"
                        onChange={(e) =>
                          handleFilterChange("name", e.target.value)
                        }
                      />
                    </th>
                    {dynamicFields.map((field) => (
                      <th
                        key={field}
                        className="px-2 sm:px-4 py-2 bg-gray-50 cursor-pointer min-w-[120px] sm:min-w-[150px]"
                      >
                        <div className="flex items-center text-sm sm:text-base">
                          <span className="truncate">{field}</span>
                          {sortConfig?.key === field && (
                            <span className="ml-1">
                              {sortConfig.direction === "asc" ? "↑" : "↓"}
                            </span>
                          )}
                        </div>
                        <input
                          type="text"
                          placeholder="Filter..."
                          className="w-full mt-1 p-1 text-xs sm:text-sm border rounded"
                          onChange={(e) =>
                            handleFilterChange(field, e.target.value)
                          }
                        />
                      </th>
                    ))}
                  </tr>
                </thead>
              </table>
            </div>
          </div>

          <div className="overflow-x-auto">
            <div className="overflow-y-auto" style={{ height: "400px" }}>
              <table className="w-full">
                <tbody>
                  {filteredData.map((item, index) => (
                    <tr
                      key={index}
                      className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                    >
                      <td className="px-2 sm:px-4 py-2 border-b min-w-[120px] sm:min-w-[150px]">
                        <div
                          className="truncate text-sm sm:text-base"
                          title={item.country || "N/A"}
                        >
                          {item.country || "N/A"}
                        </div>
                      </td>
                      <td className="px-2 sm:px-4 py-2 border-b min-w-[150px] sm:min-w-[200px]">
                        <div
                          className="truncate text-sm sm:text-base"
                          title={item.name || "N/A"}
                        >
                          {item.name || "N/A"}
                        </div>
                      </td>
                      {dynamicFields.map((field) => (
                        <td
                          key={field}
                          className="px-2 sm:px-4 py-2 border-b min-w-[120px] sm:min-w-[150px]"
                        >
                          <div
                            className="truncate text-sm sm:text-base"
                            title={item[field] || "N/A"}
                          >
                            {isValidUrl(item[field]) ? (
                              <a
                                href={item[field]}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                              >
                                {item[field]}
                              </a>
                            ) : (
                              item[field] || "N/A"
                            )}
                          </div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataTable;
