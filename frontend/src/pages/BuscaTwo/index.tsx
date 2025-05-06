import React, { useState, useEffect, ChangeEvent, useMemo } from "react";
import { Helmet } from "react-helmet";
import { Text, Img, Heading, Button, SelectBox } from "../../components";
import { TabPanel, TabList, Tab, Tabs } from "react-tabs";
import { useNavigate, useLocation } from "react-router-dom";
import GoogleMapComponent from "../../components/GoogleMap";
import {
  questionFunctions,
  getEnglishQuestionKey,
} from "../../services/apiService";
import { saveAs } from "file-saver";
import Header from "../../components/Header";
import { useLanguage } from "../../contexts/LanguageContext";
import styled from "@emotion/styled";

import { questionQueries, timeRelatedQuestions } from "../../utils/questions";
import DataTable from "components/DataTable";
import Sidebar from "../../components/Sidebar";
import { Bar } from "react-chartjs-2";

// Add styled component for question title (matching with BuscaOne)
const QuestionTitle = styled(Heading)`
  text-align: center;
  color: #4a2b4e;
  font-weight: 600;
  padding-bottom: 16px;
  margin-bottom: 24px;
  border-bottom: 2px solid #e6a17a;
  width: 100%;
  font-size: 24px;
`;

// Add styled components for the tabs
const StyledTabList = styled(TabList)`
  display: flex;
  flex-row: gap-4;
  border-bottom: none;
  background-color: transparent;
  width: 100%;
  padding: 0;
  margin-bottom: 20px;
`;

const StyledTab = styled(Tab)<{ selected?: boolean }>`
  padding: 0.75rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  cursor: pointer;
  outline: none;
  background-color: ${(props) => (props.selected ? "#AF4C5E" : "#FFE4D9")};
  color: ${(props) => (props.selected ? "white" : "black")};
  border-radius: 0;
  margin: 0;
  &:hover {
    background-color: ${(props) => (props.selected ? "#AF4C5E" : "#FFCFBD")};
  }
`;

const TopTabsContainer = styled.div`
  position: relative;
  display: flex;
  align-items: flex-start;
  background: #ffe4d9;
  border-radius: 12px 12px 0 0;
  margin: 0;
  padding: 0;
  width: 100%;
  min-height: 64px;
  flex-direction: row;
  @media (max-width: 600px) {
    flex-direction: column;
    align-items: center;
    min-height: unset;
    padding-bottom: 0.5rem;
  }
`;

const TopTabsListWrapper = styled.div`
  position: absolute;
  left: 50%;
  top: 0;
  transform: translateX(-50%);
  height: 100%;
  display: flex;
  align-items: center;
  z-index: 2;
  @media (max-width: 600px) {
    position: static;
    left: unset;
    top: unset;
    transform: none;
    width: 100%;
    justify-content: center;
    margin-bottom: 0.5rem;
  }
`;

const TopTabsList = styled.div`
  display: flex;
  gap: 0;
  margin: 0 auto;
`;

const TopTab = styled.div<{ selected?: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: 600;
  color: ${(props) => (props.selected ? "#4A2B4E" : "#4A2B4E")};
  background: ${(props) => (props.selected ? "#fff" : "transparent")};
  border-bottom: 4px solid
    ${(props) => (props.selected ? "#4A2B4E" : "transparent")};
  border-radius: 12px 12px 0 0;
  padding: 18px 36px 12px 36px;
  cursor: pointer;
  transition: background 0.2s, border 0.2s;
  svg,
  img {
    width: 22px;
    height: 22px;
  }
`;

const DataNav = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.5rem 0;
`;

const DataNavButton = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  padding: 0.5rem;

  img {
    width: 20px;
    height: 20px;
  }
`;

const DadosAbertosHeader = styled.div`
  background-color: #f2fbff;
  padding: 1rem 2rem;
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  border-bottom: 2px solid #f8b195;
`;

const DadosAbertosTitle = styled.h1`
  color: #4a2b4e;
  font-weight: 600;
  font-size: 28px;
  margin: 0;
`;

const VisualizationContainer = styled.div`
  background: #fff;
  border-radius: 18px;
  box-shadow: none;
  margin: 0 32px 0 0;
  padding: 32px 32px 24px 32px;
  width: 100%;
`;

const MainContent = styled.div`
  background: #fff8f5;
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const ChartBarContainer = styled.div`
  width: 100%;
  height: 20px;
  background-color: #cf9bcc;
`;

const ChartContainer = styled.div`
  width: 100%;
  padding: 2rem;
  background-color: #fff8f5;
`;

const ChartTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  color: #4a2b4e;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const BarChart = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  position: relative;
  padding-top: 20px;
`;

const ScaleContainer = styled.div`
  display: flex;
  justify-content: space-between;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  color: #4a2b4e;
  font-size: 12px;
`;

const BarContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const CountryLabel = styled.div`
  width: 80px;
  text-align: right;
  font-size: 14px;
  color: #4a2b4e;
`;

const BarWrapper = styled.div`
  flex-grow: 1;
  height: 25px;
  position: relative;
`;

const BarElement = styled.div<{ width: number }>`
  height: 100%;
  width: ${(props) => Math.max(props.width, 5)}%;
  min-width: 8px;
  background-color: #bb86c0;
  position: relative;
  border-radius: 0 2px 2px 0;
  &::after {
    content: "";
    position: absolute;
    height: 100%;
    width: 4px;
    right: 0;
    background-color: #9a6eb5;
  }
`;

const CountValue = styled.div`
  position: absolute;
  right: -45px; /* Aumentando o espaço para os valores */
  top: 50%;
  transform: translateY(-50%);
  font-size: 14px;
  color: #4a2b4e;
  min-width: 35px; /* Aumentando o espaço mínimo para os valores */
  text-align: right;
  font-weight: 500;
`;

const SourceText = styled.div`
  font-size: 12px;
  margin-top: 15px;
  color: #666;
  display: flex;
  align-items: center;
  justify-content: flex-end; /* Alinha a fonte à direita */
  width: 100%;

  svg {
    margin-left: 5px;
    cursor: pointer;
  }
`;

const DownloadIcon = styled.div`
  width: 18px;
  height: 18px;
  margin-left: 5px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 16px;
    height: 16px;
    fill: #888;
  }

  &:hover svg {
    fill: #4a2b4e;
  }
`;

const SocialMediaContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: auto;
  margin-right: 20px;
  position: static;
  @media (max-width: 600px) {
    margin: 0 auto;
    margin-top: 0.5rem;
    justify-content: center;
    width: 100%;
    order: 2;
  }
`;

const SocialIcon = styled.a`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: white;
  font-size: 16px;
  font-weight: 600;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
  }

  &.facebook {
    background-color: #3b5998;
  }
  &.instagram {
    background: linear-gradient(
      45deg,
      #f09433 0%,
      #e6683c 25%,
      #dc2743 50%,
      #cc2366 75%,
      #bc1888 100%
    );
  }
  &.twitter {
    background-color: #1da1f2;
  }
  &.linkedin {
    background-color: #0077b5;
  }
  &.share {
    background-color: #ff6542;
  }
  &.download {
    background-color: #f8b195;
  }
  &.info {
    background-color: #17a2b8;
    font-family: serif;
    font-style: italic;
  }
`;

const TabsContainer = styled.div`
  background-color: #fff8f5;
  padding: 0 2rem;
`;

const ResetButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 2px solid #6b4a7d;
  background: #fff;
  color: #6b4a7d;
  font-size: 18px;
  margin: 0 auto 24px auto;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  &:hover {
    background: #f3e6f7;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
  svg {
    width: 22px;
    height: 22px;
    fill: #6b4a7d;
  }
`;

const SidebarContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 340px;
  min-width: 300px;
  background: #fff;
  border-right: 1px solid #e6e6e6;
  border-radius: 0;
  margin: 0 24px 0 0;
  padding: 32px 24px 24px 24px;
  gap: 24px;
  box-shadow: none;
`;

const FilterTitle = styled.h3`
  font-size: 1.125rem;
  color: #4a2b4e;
  margin-bottom: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const FilterSelect = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  background: #fff;
  border: 1.5px solid #e6e6e6;
  border-radius: 8px;
  margin-bottom: 16px;
  width: 100%;

  svg {
    margin-left: 12px;
    color: #4a2b4e;
  }

  select {
    flex: 1;
    width: 100%;
    border: none;
    outline: none;
    background: transparent;
    padding: 12px 12px 12px 0;
    font-size: 14px;
    color: #4a2b4e;
    border-radius: 8px;
    appearance: none;
    text-overflow: ellipsis;
    white-space: normal; /* Permite quebra de texto */
    word-wrap: break-word;
    overflow-wrap: break-word;
    line-height: 1.4;
  }

  option {
    padding: 8px;
    font-size: 14px;
    white-space: normal; /* Permite quebra de texto nos options */
    word-wrap: break-word;
  }

  &::after {
    content: "";
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    width: 0;
    height: 0;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-top: 6px solid #4a2b4e;
    pointer-events: none;
  }
`;

const RadioGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;
const CustomRadio = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  color: #4a2b4e;
  input[type="radio"] {
    accent-color: #4a2b4e;
    width: 18px;
    height: 18px;
  }
`;

// Tabs styles
const TabsBar = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background: #ffe4d9;
  border-radius: 16px 16px 0 0;
  margin: 2rem auto 0 auto;
  width: fit-content;
  box-shadow: 0 2px 8px rgba(74, 43, 78, 0.06);
`;

const TabButton = styled.button<{ active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: ${({ active }) => (active ? "#fff" : "transparent")};
  color: ${({ active }) => (active ? "#4A2B4E" : "#4A2B4E")};
  border: none;
  border-radius: 12px 12px 0 0;
  font-weight: 600;
  font-size: 1.1rem;
  padding: 1rem 2.5rem 1rem 1.5rem;
  box-shadow: ${({ active }) =>
    active ? "0 2px 8px rgba(74,43,78,0.10)" : "none"};
  cursor: pointer;
  position: relative;
  top: ${({ active }) => (active ? "-8px" : "0")};
  z-index: ${({ active }) => (active ? 2 : 1)};
  border-bottom: ${({ active }) => (active ? "4px solid #A084CA" : "none")};
`;

// Chart container
const ChartCard = styled.div`
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(74, 43, 78, 0.06);
  padding: 2rem 2.5rem 2.5rem 2.5rem;
  margin: 2rem 2rem 0 0;
`;

// Main background
const MainBg = styled.div`
  background: #fff8f5;
  min-height: 100vh;
`;

type SelectOption = { value: string; label: string };

const BuscaTwoPage = () => {
  const { translations, language } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>("ambos");
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedVisualization, setSelectedVisualization] =
    useState<string>("paises");
  const [data, setData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [years, setYears] = useState<string[]>([]);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [dynamicFields, setDynamicFields] = useState<string[]>([]);
  const [countryCounts, setCountryCounts] = useState<{ [key: string]: number }>(
    {}
  );

  // Add new filter states similar to BuscaOne
  const [selectedYears, setSelectedYears] = useState<string[]>([]);

  // Wrap options in useMemo to prevent dependency changes on every render
  const countryOptions = useMemo(
    () => [
      { label: translations.filters?.all || "All", value: "all" },
      { label: translations.countries?.brasil || "Brazil", value: "Brazil" },
      { label: translations.countries?.peru || "Peru", value: "Peru" },
      { label: translations.countries?.bolivia || "Bolivia", value: "Bolivia" },
      {
        label: translations.countries?.argentina || "Argentina",
        value: "Argentina",
      },
      {
        label: translations.countries?.colombia || "Colombia",
        value: "Colombia",
      },
      { label: translations.countries?.chile || "Chile", value: "Chile" },
      // Add other countries as needed
    ],
    [translations]
  );

  // Replace the yearOptions with a checkbox list
  const yearOptions = useMemo(
    () => [
      "2015",
      "2016",
      "2017",
      "2018",
      "2019",
      "2020",
      "2021",
      "2022",
      "2023",
      "2024",
    ],
    []
  );

  // Status options
  const statusOptions = useMemo(
    () => [
      { label: translations.filters?.all || "All", value: "all" },
      {
        label: translations.filters?.statuses?.active || "Active",
        value: "Active",
      },
      {
        label: translations.filters?.statuses?.finished || "Finished",
        value: "Finished",
      },
      {
        label: translations.filters?.statuses?.design || "Design",
        value: "Design",
      },
    ],
    [translations]
  );

  const isTimeDropdownEnabled = Boolean(
    selectedQuestion &&
      timeRelatedQuestions.includes(selectedQuestion.trim().toLowerCase())
  );

  const getTabClass = (pathname: string, tabPath: string) => {
    return pathname === tabPath ? "text-gray-700 font-medium" : "text-gray-500";
  };

  const navigate = useNavigate();
  const location = useLocation();

  // Read URL parameters when component mounts
  useEffect(() => {
    // Read URL parameters
    const params = new URLSearchParams(location.search);
    const categoryParam = params.get("category");
    const queryTypeParam = params.get("queryType");
    const countryParam = params.get("country");
    const yearParam = params.get("year");
    const statusParam = params.get("status");

    // Set initial category if provided in URL
    if (categoryParam) {
      setSelectedCategory(categoryParam);

      // Load questions based on category and set query type if provided
      if (queryTypeParam) {
        try {
          // Decode the URL parameter
          const decodedQueryType = decodeURIComponent(queryTypeParam);

          // For BuscaTwo, we need to match the queryType parameter directly with the question text
          // Get all available questions for this category
          const questions = questionQueries[categoryParam]?.[language] || [];

          // First try to find an exact match with the question text
          let foundQuestion = questions.find((q) => q === decodedQueryType);

          // If no exact match, try to find a question that contains the queryType
          if (!foundQuestion) {
            foundQuestion = questions.find((q) =>
              q.toLowerCase().includes(decodedQueryType.toLowerCase())
            );

            // If still no match, try to find a question that the queryType contains
            if (!foundQuestion) {
              foundQuestion = questions.find((q) =>
                decodedQueryType.toLowerCase().includes(q.toLowerCase())
              );
            }
          }

          // If we found a matching question, set it
          if (foundQuestion) {
            setSelectedQuestion(foundQuestion);
          } else if (questions.length > 0) {
            // If no match found but we have questions, use the first one
            setSelectedQuestion(questions[0]);
          }
        } catch (error) {
          // In case of error, try to use the first available question
          const questions = questionQueries[categoryParam]?.[language] || [];
          if (questions.length > 0) {
            setSelectedQuestion(questions[0]);
          }
        }
      }
    }

    // Set country filter if provided
    if (countryParam) {
      const countryOption = countryOptions.find(
        (option) => option.value === countryParam
      );
      if (countryOption) {
        setSelectedCountries([countryParam]);
      }
    }

    // Set year filter if provided
    if (yearParam) {
      const yearOption = yearOptions.find((option) => option === yearParam);
      if (yearOption) {
        setSelectedYears([yearOption]);
      }
    }

    // Set status filter if provided
    if (statusParam) {
      const statusOption = statusOptions.find(
        (option) => option.value === statusParam
      );
      if (statusOption) {
        setSelectedStatuses([statusParam]);
      }
    }
  }, [
    location.search,
    language,
    countryOptions,
    yearOptions,
    statusOptions,
    questionQueries,
  ]);

  const handleSupportClick = () => {
    window.location.href = "https://ellas.ufmt.br/pt/parceiros/"; // Redirecionamento Externo
  };

  const handleAboutClick = () => {
    window.location.href = "https://ellas.ufmt.br/pt/sobre-nos/o-projeto/"; // Redirecionamento Externo
  };

  // Função para converter os dados em CSV
  const exportTableDataToCSV = (data, fields) => {
    if (!data || data.length === 0) return;

    // Cabeçalho do CSV
    const headers = ["Country", "Name", ...fields].join(",");

    // Linhas de dados
    const rows = data.map((item) =>
      [
        item.country || "",
        item.name || "",
        ...fields.map((field) => item[field] || ""),
      ].join(",")
    );

    // Juntar tudo no formato CSV
    const csvContent = [headers, ...rows].join("\n");

    // Criar blob e acionar o download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "ellas_data.csv");
  };

  // Função para exportar o gráfico como imagem PNG
  const exportChartAsPNG = () => {
    // Encontrar o elemento do gráfico
    const chartElement = document.querySelector(
      ".chart-container"
    ) as HTMLElement;
    if (!chartElement) {
      return;
    }

    // Usar html2canvas (precisaria ser instalado como dependência)
    try {
      import("html2canvas")
        .then((html2canvas) => {
          html2canvas.default(chartElement).then((canvas) => {
            // Converter para URL de dados e baixar
            const imgData = canvas.toDataURL("image/png");
            const link = document.createElement("a");
            link.href = imgData;
            link.download = "ellas_chart.png";
            link.click();
          });
        })
        .catch(() => {
          alert(translations.errors?.exportImage || "Erro ao exportar imagem");
        });
    } catch (error) {
      alert(translations.errors?.exportImage || "Erro ao exportar imagem");
    }
  };

  // Função para exportar os dados como PDF
  const exportDataAsPDF = () => {
    try {
      import("jspdf")
        .then(({ default: jsPDF }) => {
          import("jspdf-autotable")
            .then(({ default: autoTable }) => {
              const doc = new jsPDF();

              // Adicionar título
              doc.setFontSize(18);
              const title = selectedQuestion || "ELLAS - Dados";
              doc.text(title, 14, 22);

              // Adicionar dados em formato de tabela
              const tableData = filteredData.map((item) => {
                return [
                  item.countryName || item.country || "",
                  item.name || "",
                  ...dynamicFields.map((field) => item[field] || ""),
                ];
              });

              autoTable(doc, {
                head: [["País", "Nome", ...dynamicFields]],
                body: tableData,
                startY: 30,
                styles: { fontSize: 10, cellPadding: 2 },
                headStyles: { fillColor: [74, 43, 78] },
              });

              doc.save("ellas_data.pdf");
            })
            .catch(() => {
              alert(translations.errors?.exportPDF || "Erro ao exportar PDF");
            });
        })
        .catch(() => {
          alert(translations.errors?.exportPDF || "Erro ao exportar PDF");
        });
    } catch (error) {
      alert(translations.errors?.exportPDF || "Erro ao exportar PDF");
    }
  };

  // Atualizar dados com base na categoria e pergunta selecionadas
  useEffect(() => {
    const fetchData = async () => {
      if (selectedCategory && selectedQuestion) {
        // Convert the question to its English equivalent for lookup
        const englishQuestion = getEnglishQuestionKey(
          selectedQuestion,
          language
        );
        const fetchFunction = questionFunctions[englishQuestion];
        if (fetchFunction) {
          try {
            const response = await fetchFunction();
            if (response?.results?.bindings.length > 0) {
              // Get all fields from the response
              const fields = Object.keys(response.results.bindings[0]);
              setDynamicFields(fields);

              const formattedData = response.results.bindings.map(
                (item: any) => {
                  const formattedItem: { [key: string]: any } = {};
                  fields.forEach((field) => {
                    formattedItem[field] = item[field]?.value || "";
                  });
                  return formattedItem;
                }
              );

              setData(formattedData);
              setFilteredData(formattedData);

              // Update `countryCounts`
              const countryCountMap: { [key: string]: number } = {};
              formattedData.forEach((item) => {
                if (item.countryName) {
                  countryCountMap[item.countryName] =
                    (countryCountMap[item.countryName] || 0) + 1;
                }
              });
              setCountryCounts(countryCountMap);

              // Update highlighted countries
              const countries = Object.keys(countryCountMap);
              setSelectedCountries(countries);

              // Update years (if necessary)
              const uniqueYears = Array.from(
                new Set(
                  formattedData.flatMap((item) => {
                    const startYear = item.startDate
                      ? new Date(item.startDate).getFullYear()
                      : null;
                    const finishYear = item.finishDate
                      ? new Date(item.finishDate).getFullYear()
                      : null;

                    return [startYear, finishYear];
                  })
                )
              )
                .filter(Boolean)
                .sort((a, b) => Number(a) - Number(b))
                .map(String);

              setYears(uniqueYears);
            } else {
              setData([]);
              setFilteredData([]);
              setDynamicFields([]);
              setCountryCounts({});
              setSelectedCountries([]);
              setYears([]);
            }
          } catch (error) {
            console.error("Error fetching data:", error);
          }
        }
      }
    };

    fetchData();
  }, [selectedCategory, selectedQuestion, language]);

  // Update the filtering logic
  useEffect(() => {
    if (!data || data.length === 0) return;

    let filtered = [...data];

    // Parse country data - to handle cases where multiple countries are listed in one field
    const parseCountryString = (countryString: string) => {
      if (!countryString) return [];
      // Handle common separators like "and", "&", ",", "y", etc.
      const countries = countryString.split(/\s+and\s+|\s*[,&]\s*|\s+y\s+/);
      return countries.map((country) => country.trim()).filter(Boolean);
    };

    // Apply country filter
    if (selectedCountries.length > 0 && !selectedCountries.includes("all")) {
      filtered = filtered.filter((item) => {
        const itemCountry = item.countryName || item.country || "";
        const countries = parseCountryString(itemCountry);

        // Check if any of the parsed countries matches any selected country
        return countries.some((country) =>
          selectedCountries.some(
            (selectedCountry) =>
              country.toLowerCase() === selectedCountry.toLowerCase()
          )
        );
      });
    }

    // Apply year filter
    if (selectedYears.length > 0) {
      filtered = filtered.filter((item) => {
        const startDate = item.startDate || "";
        const finishDate = item.finishDate || "";

        return selectedYears.some((year) => {
          // Check if year appears in either startDate or finishDate
          return startDate.includes(year) || finishDate.includes(year);
        });
      });
    }

    // Apply status filter
    if (selectedStatuses.length > 0 && !selectedStatuses.includes("all")) {
      filtered = filtered.filter((item) => {
        const itemStatus = item.status || "";
        return selectedStatuses.some(
          (status) => itemStatus.toLowerCase() === status.toLowerCase()
        );
      });
    }

    // Update filtered data
    setFilteredData(filtered);

    // Update countryCounts based on filtered data
    const countryCountMap: { [key: string]: number } = {};
    filtered.forEach((item) => {
      const countryName = item.countryName || item.country || "";
      if (countryName) {
        countryCountMap[countryName] = (countryCountMap[countryName] || 0) + 1;
      }
    });
    setCountryCounts(countryCountMap);
  }, [data, selectedCountries, selectedStatuses, selectedYears]);

  // Update the handlers for filters
  const handleCountryChange = (country: string) => {
    if (country === "all") {
      setSelectedCountries([]);
    } else {
      setSelectedCountries((prev) => {
        if (prev.includes(country)) {
          // Remove o país se já estiver selecionado
          return prev.filter((c) => c !== country);
        } else {
          // Adiciona o país se não estiver selecionado
          return [...prev, country];
        }
      });
    }
  };

  const handleYearChange = (year: string) => {
    setSelectedYears((prev) => {
      if (prev.includes(year)) {
        return prev.filter((y) => y !== year);
      } else {
        return [...prev, year];
      }
    });
  };

  const handleStatusChange = (status: string) => {
    if (status === "all") {
      setSelectedStatuses([]);
    } else {
      setSelectedStatuses((prev) => {
        if (prev.includes(status)) {
          return prev.filter((s) => s !== status);
        } else {
          return [...prev, status];
        }
      });
    }
  };

  const handleCategoryChange = (option: SelectOption | null) => {
    setSelectedCategory(option ? option.value : null);
    setSelectedQuestion(null); // Reset question when category changes

    // Don't reset filters when changing category
    // This allows filters to persist across category changes
  };

  const handleReset = () => {
    // Reset all state variables
    setSelectedCategory(null);
    setSelectedQuestion(null);
    setSelectedTime(null);
    setSelectedStatus("ambos");
    setSelectedStatuses([]);
    setSelectedVisualization("paises");
    setData([]);
    setFilteredData([]);
    setYears([]);
    setSelectedCountries([]);
    setDynamicFields([]);
    setCountryCounts({});
    setSelectedYears([]);

    // Clear URL params on reset
    navigate("/buscatwo", { replace: true });
  };

  const handleQuestionChange = (option: SelectOption | null) => {
    setSelectedQuestion(option ? option.value : null);
    setSelectedTime(null); // Resetar tempo ao mudar pergunta
  };

  const handleVisualizationChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSelectedVisualization(e.target.value);
  };

  const handleNavigation = (path: string) => () => {
    // Preserve search parameters when navigating
    const params = new URLSearchParams();
    if (selectedCategory) params.append("category", selectedCategory);

    // For query type, use the full selected question text
    if (selectedQuestion) {
      try {
        // Encode the full question text to handle special characters
        params.append("queryType", encodeURIComponent(selectedQuestion));
      } catch (error) {
        console.error("Error encoding queryType:", error);
      }
    }

    // Add filter parameters
    if (selectedCountries.length > 0)
      params.append("country", selectedCountries.join(","));
    if (selectedYears.length > 0)
      params.append("year", selectedYears.join(","));
    if (selectedStatuses.length > 0)
      params.append("status", selectedStatuses.join(","));

    navigate(`${path}?${params.toString()}`);
  };

  // Update the category options
  const categoryOptions = useMemo(
    () => [
      { label: translations.categories.initiatives, value: "initiatives" },
      { label: translations.categories.policies, value: "policies" },
      { label: translations.categories.factors, value: "factors" },
    ],
    [translations]
  );

  const exportTableAsPNG = async () => {
    try {
      const tableElement = document.querySelector('.table-image-container') as HTMLElement;
      if (!tableElement) {
        alert(translations.errors?.exportImage || 'Tabela não encontrada');
        return;
      }
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(tableElement, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#fff',
      });
      canvas.toBlob((blob) => {
        if (!blob) {
          alert(translations.errors?.exportImage || 'Erro ao gerar imagem');
          return;
        }
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'ellas_tabela.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 'image/png', 1.0);
    } catch (error) {
      alert(translations.errors?.exportImage || 'Erro ao exportar imagem');
    }
  };

  return (
    <>
      <Helmet>
        <title>ELLAS - Dados Abertos</title>
        <meta name="description" content="Dados Abertos - Portal ELLAS" />
      </Helmet>
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex-grow">
          <MainContent>
            <div className="flex flex-col items-center justify-start w-full bg-[#FFF8F5]">
              {/* Header Section with title and social media icons */}
              <DadosAbertosHeader>
                <DadosAbertosTitle>
                  {translations.busca?.dadosAbertos || "Dados Abertos"}
                </DadosAbertosTitle>
              </DadosAbertosHeader>

              <TopTabsContainer>
                <TopTabsListWrapper>
                  <TopTabsList>
                    <TopTab onClick={handleNavigation("/buscaone")}>
                      {translations.visualization?.map || "Mapa"}{" "}
                      <img src="/images/img_iconx18_9.svg" alt="Map Icon" />
                    </TopTab>
                    <TopTab selected>
                      {translations.visualization?.bars || "Barras"}{" "}
                      <img src="/images/img_iconx18_11.svg" alt="Bars Icon" />
                    </TopTab>
                    <TopTab onClick={handleNavigation("/buscatwoone")}>
                      {translations.visualization?.lines || "Linhas"}{" "}
                      <img src="/images/img_iconx18_12.svg" alt="Lines Icon" />
                    </TopTab>
                  </TopTabsList>
                </TopTabsListWrapper>

                <SocialMediaContainer>
                  <SocialIcon
                    href="https://www.facebook.com/ellasac.lat"
                    target="_blank"
                    className="facebook"
                    title="Facebook"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 320 512"
                      fill="currentColor"
                    >
                      <path d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z" />
                    </svg>
                  </SocialIcon>
                  <SocialIcon
                    href="https://twitter.com/ellasac_lat"
                    target="_blank"
                    className="twitter"
                    title="Twitter"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 512 512"
                      fill="currentColor"
                    >
                      <path d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z" />
                    </svg>
                  </SocialIcon>
                  <SocialIcon
                    href="https://www.instagram.com/ellas.network/"
                    target="_blank"
                    className="instagram"
                    title="Instagram"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 448 512"
                      fill="currentColor"
                    >
                      <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" />
                    </svg>
                  </SocialIcon>
                  <SocialIcon
                    href="https://www.linkedin.com/company/ellasnetwork/"
                    target="_blank"
                    className="linkedin"
                    title="LinkedIn"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 448 512"
                      fill="currentColor"
                    >
                      <path d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z" />
                    </svg>
                  </SocialIcon>
                  <SocialIcon
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      exportDataAsPDF();
                    }}
                    className="facebook"
                    title={translations.download?.pdf || "Baixar PDF"}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M20 2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8.5 7.5c0 .83-.67 1.5-1.5 1.5H9v1.25c0 .41-.34.75-.75.75s-.75-.34-.75-.75V8c0-.55.45-1 1-1H10c.83 0 1.5.67 1.5 1.5v1zm5 2c0 .83-.67 1.5-1.5 1.5h-2c-.28 0-.5-.22-.5-.5v-5c0-.28.22-.5.5-.5h2c.83 0 1.5.67 1.5 1.5v3zm4-3.75c0 .41-.34.75-.75.75H19v1h.75c.41 0 .75.34.75.75s-.34.75-.75.75H19v1.25c0 .41-.34.75-.75.75s-.75-.34-.75-.75V8c0-.55.45-1 1-1h1.25c.41 0 .75.34.75.75zM9 9.5h1v-1H9v1zM3 6c-.55 0-1 .45-1 1v13c0 1.1.9 2 2 2h13c.55 0 1-.45 1-1s-.45-1-1-1H5c-.55 0-1-.45-1-1V7c0-.55-.45-1-1-1zm11 5.5h1v-3h-1v3z" />
                    </svg>
                  </SocialIcon>
                  <SocialIcon
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      exportTableDataToCSV(filteredData, dynamicFields);
                    }}
                    className="twitter"
                    title={translations.download?.csv || "Baixar CSV"}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm-1 7V3.5L18.5 9H13zm1 5.5v-2h-4v2h4zm-4 1v2h4v-2h-4z" />
                      <path d="M5 13h3v-3H5v3zm0 4h3v-3H5v3zm4-8v3h10V9H9zm0 7h10v-3H9v3z" />
                    </svg>
                  </SocialIcon>
                  <SocialIcon
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      exportTableAsPNG();
                    }}
                    className="instagram"
                    title={translations.download?.image || "Baixar Imagem"}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
                    </svg>
                  </SocialIcon>
                </SocialMediaContainer>
              </TopTabsContainer>

              {/* Main Content Section */}
              <div className="flex flex-row md:flex-col justify-between items-start w-full px-0 max-w-[1331px]">
                {/* Sidebar Section */}
                <Sidebar
                  selectedCategory={selectedCategory}
                  selectedQuestion={selectedQuestion}
                  selectedCountries={selectedCountries}
                  selectedYears={selectedYears}
                  selectedStatuses={selectedStatuses}
                  countryOptions={countryOptions}
                  yearOptions={yearOptions}
                  statusOptions={statusOptions}
                  onCategoryChange={handleCategoryChange}
                  onQuestionChange={handleQuestionChange}
                  onCountryChange={handleCountryChange}
                  onYearChange={handleYearChange}
                  onStatusChange={handleStatusChange}
                  onReset={handleReset}
                />

                {/* Visualization Content */}
                <div className="flex flex-col w-[70%] md:w-full">
                  <VisualizationContainer>
                    <div className="flex flex-col items-center justify-center w-full mb-4">
                      <div className="flex flex-col items-start justify-center w-[100%] md:w-full">
                        <QuestionTitle as="h2">
                          {selectedQuestion
                            ? selectedQuestion
                            : translations.labels?.selectQuestion ||
                              "Selecione uma Pergunta"}
                        </QuestionTitle>

                        {/* Scale numbers */}
                        <div className="flex justify-between w-full mb-2">
                          <Text size="md" as="p">
                            0
                          </Text>
                          <Text size="md" as="p">
                            05
                          </Text>
                          <Text size="md" as="p">
                            10
                          </Text>
                          <Text size="md" as="p">
                            15
                          </Text>
                          <Text size="md" as="p">
                            20
                          </Text>
                        </div>

                        {/* Horizontal line */}
                        <div className="h-px w-full bg-gray-300"></div>

                        <ChartContainer>
                          <div className="chart-container">
                            <ChartTitle>
                              {selectedQuestion
                                ? selectedQuestion
                                : translations.labels?.selectQuestion ||
                                  "Selecione uma Pergunta"}
                            </ChartTitle>
                            <BarChart>
                              <ScaleContainer>
                                <span>0</span>
                                <span>45</span>
                                <span>90</span>
                                <span>135</span>
                                <span>180</span>
                              </ScaleContainer>

                              {Object.entries(countryCounts).map(
                                ([country, count]) => {
                                  // Ajustando para escala máxima de 180
                                  const maxDisplayValue = 180;
                                  const maxValue = Math.max(
                                    ...Object.values(countryCounts)
                                  );
                                  const ratio = maxDisplayValue / maxValue;
                                  // Ajustar a escala para tornar valores pequenos mais visíveis
                                  // Usar no mínimo 3% para barras muito pequenas
                                  const percentage = Math.max(
                                    (count / maxValue) * 100,
                                    count > 0 ? 3 : 0
                                  );

                                  return (
                                    <BarContainer key={country}>
                                      <CountryLabel>{country}</CountryLabel>
                                      <BarWrapper>
                                        <BarElement width={percentage} />
                                        <CountValue>
                                          {count < 10 ? `0${count}` : count}
                                        </CountValue>
                                      </BarWrapper>
                                    </BarContainer>
                                  );
                                }
                              )}

                              <SourceText>
                                {translations.source?.inep ||
                                  "Fonte: INEP, UNESCO e Dados Secundários da plataforma ELLAS"}
                                <DownloadIcon
                                  onClick={() =>
                                    exportTableDataToCSV(
                                      filteredData,
                                      dynamicFields
                                    )
                                  }
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                  >
                                    <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
                                  </svg>
                                </DownloadIcon>
                              </SourceText>
                            </BarChart>
                          </div>
                        </ChartContainer>
                      </div>
                    </div>
                  </VisualizationContainer>

                  {/* Data Table Section */}
                  <div className="mt-8">
                    <Heading as="h3" size="xl" className="mb-4">
                      {translations.busca?.tabelaDeDados || "Tabela de Dados"}
                    </Heading>
                    <div className="flex items-center justify-end gap-2 mb-2">
                      <DownloadIcon
                        onClick={() => exportDataAsPDF()}
                        title={translations.download?.pdf || "Baixar PDF"}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                          <path d="M20 2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8.5 7.5c0 .83-.67 1.5-1.5 1.5H9v1.25c0 .41-.34.75-.75.75s-.75-.34-.75-.75V8c0-.55.45-1 1-1H10c.83 0 1.5.67 1.5 1.5v1zm5 2c0 .83-.67 1.5-1.5 1.5h-2c-.28 0-.5-.22-.5-.5v-5c0-.28.22-.5.5-.5h2c.83 0 1.5.67 1.5 1.5v3zm4-3.75c0 .41-.34.75-.75.75H19v1h.75c.41 0 .75.34.75.75s-.34.75-.75.75H19v1.25c0 .41-.34.75-.75.75s-.75-.34-.75-.75V8c0-.55.45-1 1-1h1.25c.41 0 .75.34.75.75zM9 9.5h1v-1H9v1zM3 6c-.55 0-1 .45-1 1v13c0 1.1.9 2 2 2h13c.55 0 1-.45 1-1s-.45-1-1-1H5c-.55 0-1-.45-1-1V7c0-.55-.45-1-1-1zm11 5.5h1v-3h-1v3z" />
                        </svg>
                      </DownloadIcon>
                      <DownloadIcon
                        onClick={() => exportTableDataToCSV(filteredData, dynamicFields)}
                        title={translations.download?.csv || "Baixar CSV"}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                          <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm-1 7V3.5L18.5 9H13z" />
                          <path d="M5 13h3v-3H5v3zm0 4h3v-3H5v3zm4-4h3v-3H9v3z" />
                        </svg>
                      </DownloadIcon>
                      <DownloadIcon
                        onClick={() => exportTableAsPNG()}
                        title={translations.download?.image || "Baixar Imagem"}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                          <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
                        </svg>
                      </DownloadIcon>
                    </div>
                    <div className="table-image-container">
                      <DataTable
                        data={filteredData}
                        dynamicFields={dynamicFields}
                        exportTableDataToCSV={exportTableDataToCSV}
                        key={language}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </MainContent>
        </div>
      </div>
    </>
  );
};

export default BuscaTwoPage;
