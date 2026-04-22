import React from "react";
import styled from "@emotion/styled";
import { useLanguage } from "../../contexts/LanguageContext";

// Arquivos de survey estáticos - servidos diretamente pelo frontend
const SURVEY_FILES = [
  {
    name: "Data_dictionary-2025-11-21.pdf",
    size: 0.82 * 1024 * 1024, // ~819KB
    type: "PDF",
    url: "/survey/Data_dictionary-2025-11-21.pdf"
  },
  {
    name: "data_dictionary-2026-04-21.csv",
    size: 0.05 * 1024 * 1024, // ~50KB
    type: "CSV",
    url: "/survey/data_dictionary-2026-04-21.csv",
    labelPt: "Dicionário de Dados (CSV)",
    labelEn: "Data Dictionary (CSV)",
    labelEs: "Diccionario de Datos (CSV)"
  },
  {
    name: "surveyELLAS_2025-11-21_.csv",
    size: 5.0 * 1024 * 1024, // ~5MB
    type: "CSV",
    url: "/survey/surveyELLAS_2025-11-21_.csv"
  }
];

// Dados brutos via backend (policies, initiatives, factors)
const BACKEND_API =
  process.env.NODE_ENV === "production"
    ? "https://app.ellas.ufmt.br/api"
    : "http://localhost:8082/api";

const RAW_DATA_CATEGORIES = [
  { key: "policies", label: "Políticas (CSV)", labelEn: "Policies (CSV)", labelEs: "Políticas (CSV)" },
  { key: "initiatives", label: "Iniciativas (CSV)", labelEn: "Initiatives (CSV)", labelEs: "Iniciativas (CSV)" },
  { key: "factors", label: "Fatores (CSV)", labelEn: "Factors (CSV)", labelEs: "Factores (CSV)" },
];

const DownloadContainer = styled.div`
  background: linear-gradient(135deg, #4a2b4e 0%, #6b3a6e 100%);
  border-radius: 12px;
  padding: 16px 20px;
  margin: 0;
  box-shadow: 0 4px 15px rgba(74, 43, 78, 0.3);
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
`;

const DownloadTitle = styled.span`
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 8px;

  svg {
    width: 20px;
    height: 20px;
  }
`;

const DownloadButton = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  cursor: pointer;

  &.csv {
    background: #27ae60;
    color: white;

    &:hover {
      background: #219a52;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(39, 174, 96, 0.4);
    }
  }

  &.pdf {
    background: #e74c3c;
    color: white;

    &:hover {
      background: #c0392b;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(231, 76, 60, 0.4);
    }
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const FileSize = styled.span`
  font-size: 11px;
  opacity: 0.8;
  margin-left: 4px;
`;

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
};

const DownloadIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
    />
  </svg>
);

const DataIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 7v10c0 2 1 3 3 3h10c2 0 3-1 3-3V7c0-2-1-3-3-3H7C5 4 4 5 4 7z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 12h16"
    />
  </svg>
);

const SurveyDownload: React.FC = () => {
  const { translations, language } = useLanguage();

  const getButtonClass = (type: string): string => {
    return type.toLowerCase();
  };

  const getLangLabel = (cat: typeof RAW_DATA_CATEGORIES[0]) => {
    if (language?.startsWith("pt")) return cat.label;
    if (language?.startsWith("es")) return cat.labelEs;
    return cat.labelEn;
  };

  const getFileLabel = (file: typeof SURVEY_FILES[0]) => {
    if ((file as any).labelEn) {
      if (language?.startsWith("pt")) return (file as any).labelPt;
      if (language?.startsWith("es")) return (file as any).labelEs;
      return (file as any).labelEn;
    }
    return file.type;
  };

  return (
    <>
      {/* Documentação e survey */}
      <DownloadContainer>
        <DownloadTitle>
          <DataIcon />
          {translations.surveyDownload?.title || "Baixar Dados do Survey:"}
        </DownloadTitle>
        {SURVEY_FILES.map((file, index) => (
          <DownloadButton
            key={index}
            href={file.url}
            download={file.name}
            target="_blank"
            rel="noopener noreferrer"
            className={getButtonClass(file.type)}
          >
            <DownloadIcon />
            {getFileLabel(file)}
            <FileSize>({formatFileSize(file.size)})</FileSize>
          </DownloadButton>
        ))}
      </DownloadContainer>

      {/* Dados brutos por categoria */}
      <DownloadContainer style={{ marginTop: 12 }}>
        <DownloadTitle>
          <DataIcon />
          {translations.surveyDownload?.rawDataTitle || "Baixar Dados Brutos:"}
        </DownloadTitle>
        {RAW_DATA_CATEGORIES.map((cat) => (
          <DownloadButton
            key={cat.key}
            href={`${BACKEND_API}/raw-data/${cat.key}`}
            download
            target="_blank"
            rel="noopener noreferrer"
            className="csv"
          >
            <DownloadIcon />
            {getLangLabel(cat)}
          </DownloadButton>
        ))}
      </DownloadContainer>
    </>
  );
};

export default SurveyDownload;
