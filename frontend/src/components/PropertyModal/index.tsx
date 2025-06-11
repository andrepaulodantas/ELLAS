import React, { useEffect } from "react";
import "./styles.css";

interface PropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  data: any[];
  headers: string[];
  loading?: boolean;
}

const PropertyModal: React.FC<PropertyModalProps> = ({
  isOpen,
  onClose,
  title,
  data,
  headers,
  loading = false,
}) => {
  // Close modal when pressing ESC key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden"; // Prevent background scrolling
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="property-modal-overlay" onClick={onClose}>
      <div
        className="property-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="property-modal-header">
          <h2 className="property-modal-title">{title}</h2>
          <button
            className="property-modal-close"
            onClick={onClose}
            aria-label="Fechar modal"
          >
            ×
          </button>
        </div>

        <div className="property-modal-body">
          {loading ? (
            <div className="property-modal-loading">
              <div className="loading-spinner"></div>
              <p>Carregando dados...</p>
            </div>
          ) : data.length > 0 ? (
            <div className="property-modal-table-container">
              <table className="property-modal-table">
                <thead>
                  <tr>
                    {headers.map((header, index) => (
                      <th key={index} className="property-modal-th">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.map((row, rowIndex) => (
                    <tr key={rowIndex} className="property-modal-tr">
                      {headers.map((header, cellIndex) => (
                        <td key={cellIndex} className="property-modal-td">
                          {row[header] || "-"}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="property-modal-no-data">
              <p>Nenhum dado encontrado para esta propriedade.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyModal;
