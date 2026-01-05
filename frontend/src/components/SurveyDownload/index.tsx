import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";
import { useLanguage } from "../../contexts/LanguageContext";

interface SurveyFile {
  name: string;
  size: number;
  type: string;
  url: string;
}

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

  &.other {
    background: #3498db;
    color: white;

    &:hover {
      background: #2980b9;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(52, 152, 219, 0.4);
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

const LoadingText = styled.span`
  color: #fff;
  font-size: 13px;
  opacity: 0.8;
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
  const [files, setFiles] = useState<SurveyFile[]>([]);
  const [loading, setLoading] = useState(true);
  const { translations } = useLanguage();

  // Detectar automaticamente a URL base da API
  const getApiBaseUrl = (): string => {
    // Se houver variável de ambiente definida, usar ela
    if (process.env.REACT_APP_API_URL) {
      return process.env.REACT_APP_API_URL;
    }
    
    // Em produção, usar URL relativa (mesmo domínio)
    if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
      return ''; // URL relativa - a API está no mesmo domínio
    }
    
    // Em desenvolvimento local
    return 'http://localhost:3002';
  };

  const API_BASE_URL = getApiBaseUrl();

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/survey-files`);
        if (response.ok) {
          const data = await response.json();
          setFiles(data.files || []);
        }
      } catch (error) {
        console.error("Error fetching survey files:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, [API_BASE_URL]);

  if (loading) {
    return (
      <DownloadContainer>
        <DownloadTitle>
          <DataIcon />
          {translations.surveyDownload?.loading || "Loading survey data..."}
        </DownloadTitle>
      </DownloadContainer>
    );
  }

  if (files.length === 0) {
    return null;
  }

  const getButtonClass = (type: string): string => {
    switch (type.toLowerCase()) {
      case "csv":
        return "csv";
      case "pdf":
        return "pdf";
      default:
        return "other";
    }
  };

  return (
    <DownloadContainer>
      <DownloadTitle>
        <DataIcon />
        {translations.surveyDownload?.title || "Download Survey Data:"}
      </DownloadTitle>
      {files.map((file, index) => (
        <DownloadButton
          key={index}
          href={`${API_BASE_URL}${file.url}`}
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


