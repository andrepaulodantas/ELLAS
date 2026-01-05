import React from "react";
import styled from "@emotion/styled";
import { useLanguage } from "../../contexts/LanguageContext";

// Arquivos de survey estáticos - servidos diretamente pelo frontend
const SURVEY_FILES = [
  {
    name: "Data_dictionary-2025-11-21.pdf",
    size: 2.0 * 1024 * 1024, // ~2MB
    type: "PDF",
    url: "/survey/Data_dictionary-2025-11-21.pdf"
  },
  {
    name: "surveyELLAS_2025-11-21_.csv",
    size: 5.0 * 1024 * 1024, // ~5MB
    type: "CSV",
    url: "/survey/surveyELLAS_2025-11-21_.csv"
  }
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
  const { translations } = useLanguage();

  const getButtonClass = (type: string): string => {
    return type.toLowerCase();
  };

  return (
    <DownloadContainer>
      <DownloadTitle>
        <DataIcon />
        {translations.surveyDownload?.title || "Descargar Datos del Survey:"}
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
          {file.type}
          <FileSize>({formatFileSize(file.size)})</FileSize>
        </DownloadButton>
      ))}
    </DownloadContainer>
  );
};

export default SurveyDownload;
