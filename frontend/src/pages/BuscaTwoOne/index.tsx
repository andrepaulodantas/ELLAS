import React, { useState, useEffect, ChangeEvent, useMemo } from "react";
import { Helmet } from "react-helmet";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Text,
  Img,
  Heading,
  Button,
  SelectBox,
  RadioGroup,
} from "../../components";
import { TabPanel, TabList, Tab, Tabs } from "react-tabs";
import {
  questionFunctions,
  getEnglishQuestionKey,
} from "../../services/apiService"; // Certifique-se de que essas funções estão exportadas corretamente no apiService.ts
import { Bar, Line } from "react-chartjs-2";
import "chart.js/auto"; // Importação necessária para Chart.js
import { getTabClass } from "../../utils/tabUtils";
import { saveAs } from "file-saver";
import Header from "../../components/Header";
import { useLanguage } from "../../contexts/LanguageContext";
import styled from "@emotion/styled";

import { questionQueries, timeRelatedQuestions } from "../../utils/questions";
import DataTable from "components/DataTable";
import Sidebar from "../../components/Sidebar";

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

// Add styled components for bars page
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
    &:hover {
      background-color: #4c70ba;
    }
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
    &:hover {
      background-color: #4db5f5;
    }
  }
  &.linkedin {
    background-color: #0077b5;
    &:hover {
      background-color: #0a95dc;
    }
  }
  &.whatsapp {
    background-color: #25d366;
  }
  &.share {
    background-color: #ff6542;
    &:hover {
      background-color: #ff8066;
    }
  }
  &.download {
    background-color: #f8b195;
    &:hover {
      background-color: #ffb066;
    }
  }
  &.info {
    background-color: #17a2b8;
    &:hover {
      background-color: #28c2d7;
    }
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

const MainContent = styled.div`
  background: #fff8f5;
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
`;

// Melhorando o estilo do dropdown para perguntas longas
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

// Adicionar o styled component DownloadIcon
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

type SelectOption = { value: string; label: string };

const BuscaTwoOnePage = () => {
  const { translations, language } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);
  const [data, setData] = useState<any[]>([]);
  const [dynamicFields, setDynamicFields] = useState<string[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [countryCounts, setCountryCounts] = useState<{
    [key: string]: number;
  }>({});
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>("ambos");
  const isTimeDropdownEnabled = selectedQuestion
    ? timeRelatedQuestions.includes(selectedQuestion)
    : false;
  const [selectedVisualization, setSelectedVisualization] =
    useState<string>("linhas");

  // Add new filter states similar to BuscaOne
  const [selectedCountry, setSelectedCountry] = useState<SelectOption | null>(
    null
  );
  const [selectedYear, setSelectedYear] = useState<SelectOption | null>(null);
  const [selectedStatusFilter, setSelectedStatusFilter] =
    useState<SelectOption | null>(null);

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

  // Update yearOptions to be string array
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

          // For BuscaTwoOne, we need to match the queryType parameter directly with the question text
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
            console.log(
              "No matching question found, using first available question."
            );
            setSelectedQuestion(questions[0]);
          }
        } catch (error) {
          console.error("Error decoding queryType parameter:", error);
          // In case of error, try to use the first available question
          const questions = questionQueries[categoryParam]?.[language] || [];
          if (questions.length > 0) {
            setSelectedQuestion(questions[0]);
          }
        }
      }
    }

    // Set country filter if provided
    if (countryParam && countryParam !== "all") {
      console.log("Setting country from URL:", countryParam);
      const countryOption = countryOptions.find(
        (option) => option.value.toLowerCase() === countryParam.toLowerCase()
      );
      if (countryOption) {
        setSelectedCountry(countryOption);
      } else {
        // Se não encontrar o país exato, defina como "all"
        console.log("Country not found in options, setting to all");
        setSelectedCountry(
          countryOptions.find((opt) => opt.value === "all") || null
        );
      }
    } else {
      // Se não tiver parâmetro de país ou for "all", defina explicitamente como "all"
      console.log("No country param or it's 'all', setting to all");
      setSelectedCountry(
        countryOptions.find((opt) => opt.value === "all") || null
      );
    }

    // Set year filter if provided
    if (yearParam) {
      const yearOption = yearOptions.find((option) => option === yearParam);
      if (yearOption) {
        setSelectedYear({ label: yearOption, value: yearOption });
      }
    }

    // Set status filter if provided
    if (statusParam) {
      const statusOption = statusOptions.find(
        (option) => option.value === statusParam
      );
      if (statusOption) {
        setSelectedStatusFilter(statusOption);
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
      console.error("Elemento do gráfico não encontrado");
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
        .catch((err) => {
          console.error("Erro ao exportar imagem:", err);
          alert(translations.errors?.exportImage || "Erro ao exportar imagem");
        });
    } catch (error) {
      console.error("Erro ao importar html2canvas:", error);
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
            .catch((err) => {
              console.error("Erro ao exportar PDF:", err);
              alert(translations.errors?.exportPDF || "Erro ao exportar PDF");
            });
        })
        .catch((err) => {
          console.error("Erro ao exportar PDF:", err);
          alert(translations.errors?.exportPDF || "Erro ao exportar PDF");
        });
    } catch (error) {
      console.error("Erro ao importar jsPDF:", error);
      alert(translations.errors?.exportPDF || "Erro ao exportar PDF");
    }
  };

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

              // Atualizar contagem por país
              const countryCountMap: { [key: string]: number } = {};
              formattedData.forEach((item) => {
                if (item.countryName) {
                  countryCountMap[item.countryName] =
                    (countryCountMap[item.countryName] || 0) + 1;
                }
              });
              setCountryCounts(countryCountMap);
            } else {
              setData([]);
              setDynamicFields([]);
              setCountryCounts({});
            }
          } catch (error) {
            console.error("Error fetching data:", error);
          }
        }
      }
    };

    fetchData();
  }, [selectedCategory, selectedQuestion, language]);

  useEffect(() => {
    setFilteredData(data); // Atualiza filteredData com os dados carregados
  }, [data]);

  const handleCategoryChange = (option: SelectOption | null) => {
    setSelectedCategory(option ? option.value : null);
    setSelectedQuestion(null); // Reset question when category changes

    // Don't reset filters when changing category
    // This allows filters to persist across category changes
  };

  const handleQuestionChange = (option: SelectOption | null) => {
    setSelectedQuestion(option ? option.value : null);
  };

  const handleReset = () => {
    // Reset all state variables
    setSelectedCategory(null);
    setSelectedQuestion(null);
    setData([]);
    setDynamicFields([]);
    setFilteredData([]);
    setCountryCounts({});
    setSelectedTime(null);
    setSelectedStatus("ambos");
    setSelectedVisualization("linhas");
    setSelectedCountry(null);
    setSelectedYear(null);
    setSelectedStatusFilter(null);

    // Clear URL params on reset
    navigate("/buscatwoone", { replace: true });
  };

  const handleTimeChange = (option: SelectOption | null) => {
    setSelectedTime(option ? option.value : null);
  };

  const handleStatusChange = (status: string) => {
    const option = statusOptions.find((opt) => opt.value === status);
    setSelectedStatusFilter(option || null);
  };

  const handleVisualizationChange = (event: ChangeEvent<HTMLInputElement>) => {
    console.log("Visualização selecionada:", event.target.value); // Verifique o valor
    setSelectedVisualization(event.target.value);
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
    if (selectedCountry && selectedCountry.value !== "all")
      params.append("country", selectedCountry.value);
    if (selectedYear && selectedYear.value !== "all")
      params.append("year", selectedYear.value);
    if (selectedStatusFilter && selectedStatusFilter.value !== "all")
      params.append("status", selectedStatusFilter.value);

    navigate(`${path}?${params.toString()}`);
  };

  const renderChart = () => {
    const countries = Object.keys(countryCounts); // Lista de países
    const totalSteps = 100; // Eixo X vai de 0 a 100

    // Se não temos dados para exibir, mostre um gráfico vazio
    if (countries.length === 0) {
      return (
        <div className="text-center p-4">
          {translations.messages?.noDataAvailable ||
            "Nenhum dado disponível para exibição"}
        </div>
      );
    }

    // Função auxiliar para gerar valores exponenciais acumulativos
    const generateExponentialCurve = (totalValue: number) => {
      const base = 1.2; // Base da exponencial
      const maxExponent = totalSteps; // Exponente máximo será igual ao totalSteps

      // Gera valores cumulativos exponenciais
      return Array.from({ length: totalSteps + 1 }, (_, i) => {
        return (
          totalValue *
          ((Math.pow(base, i / maxExponent) - 1) / (Math.pow(base, 0.1) - 1))
        ); // Normaliza para 0 até totalValue
      });
    };

    // Criar datasets: cada país terá uma "linha cumulativa" única
    const datasets = countries.map((country, index) => {
      const totalValue = countryCounts[country]; // Quantidade total para o país

      return {
        label: country, // Nome do país
        data: generateExponentialCurve(totalValue), // Valores cumulativos exponenciais
        borderColor: `hsl(${index * 100}, 50%, 65%)`, // Cor única para cada país
        pointBackgroundColor: `hsl(${index * 60}, 70%, 70%)`,
        borderWidth: 2, // Ajusta a espessura da linha (pouco mais grossa)
        tension: 0.4, // Linhas suavizadas para curva exponencial
        fill: false, // Sem preenchimento
      };
    });

    const chartData = {
      labels: Array.from({ length: totalSteps + 1 }, (_, i) => i), // Eixo X de 0 a 100
      datasets,
    };

    const options = {
      responsive: true,
      plugins: {
        legend: {
          display: true,
          position: "top" as const,
        },
      },
      scales: {
        x: {
          title: {
            display: true,
            text: "Steps",
          },
          beginAtZero: true,
        },
        y: {
          title: {
            display: true,
            text: "Cumulative Value",
          },
          beginAtZero: true,
          suggestedMax: Math.max(...Object.values(countryCounts)) * 1.1, // Ajusta dinamicamente o máximo
        },
      },
    };

    return <Line data={chartData} options={options} />;
  };

  // Update the filtering logic in the useEffect
  useEffect(() => {
    if (!data || data.length === 0) return;

    let filtered = [...data];

    // Apply country filter
    if (
      selectedCountry &&
      selectedCountry.value &&
      selectedCountry.value !== "all"
    ) {
      filtered = filtered.filter((item) => {
        const itemCountry = item.countryName || item.country || "";
        return itemCountry
          .toLowerCase()
          .includes(selectedCountry.value.toLowerCase());
      });
    }

    // Apply year filter
    if (selectedYear && selectedYear.value && selectedYear.value !== "all") {
      const year = selectedYear.value;
      filtered = filtered.filter((item) => {
        // Check startDate
        if (item.startDate) {
          try {
            const startDateYear = new Date(item.startDate)
              .getFullYear()
              .toString();
            if (startDateYear === year) return true;
          } catch (e) {
            if (item.startDate.includes(year)) return true;
          }
        }

        // Check finishDate
        if (item.finishDate) {
          try {
            const finishDateYear = new Date(item.finishDate)
              .getFullYear()
              .toString();
            if (finishDateYear === year) return true;
          } catch (e) {
            if (item.finishDate.includes(year)) return true;
          }
        }

        // Check start_date (alternative field name)
        if (item.start_date) {
          try {
            const startDateYear = new Date(item.start_date)
              .getFullYear()
              .toString();
            if (startDateYear === year) return true;
          } catch (e) {
            if (item.start_date.includes(year)) return true;
          }
        }

        return false;
      });
    }

    // Apply status filter
    if (
      selectedStatusFilter &&
      selectedStatusFilter.value &&
      selectedStatusFilter.value !== "all"
    ) {
      filtered = filtered.filter((item) => {
        if (!item.status) return false;
        const itemStatus = item.status.toLowerCase();
        const selectedStatusValue = selectedStatusFilter.value.toLowerCase();
        return itemStatus.includes(selectedStatusValue);
      });
    }

    // Update filtered data
    setFilteredData(filtered);

    // Update country counts
    const countryCountMap: { [key: string]: number } = {};

    // Se não tiver filtro de país ou o filtro for "all", contar todos os países
    if (!selectedCountry || selectedCountry.value === "all") {
      filtered.forEach((item) => {
        const country = item.countryName || item.country || "";
        if (country) {
          countryCountMap[country] = (countryCountMap[country] || 0) + 1;
        }
      });
    } else {
      // Se tiver filtro de país específico, contar apenas o país selecionado
      const countryName = selectedCountry.value;
      const count = filtered.filter((item) => {
        const itemCountry = item.countryName || item.country || "";
        return itemCountry.toLowerCase().includes(countryName.toLowerCase());
      }).length;

      if (count > 0) {
        countryCountMap[selectedCountry.label] = count;
      }
    }

    setCountryCounts(countryCountMap);

    console.log("Country counts updated:", countryCountMap);
  }, [data, selectedCountry, selectedYear, selectedStatusFilter]);

  // Update the handlers to properly set the state
  const handleCountryChange = (country: string) => {
    const option = countryOptions.find((opt) => opt.value === country);
    setSelectedCountry(option || null);
  };

  const handleYearChange = (year: string) => {
    const option = { label: year, value: year };
    setSelectedYear(option);
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
                    <TopTab onClick={handleNavigation("/buscatwo")}>
                      {translations.visualization?.bars || "Barras"}{" "}
                      <img src="/images/img_iconx18_11.svg" alt="Bars Icon" />
                    </TopTab>
                    <TopTab selected>
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
                      exportChartAsPNG();
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
                  selectedCountries={
                    selectedCountry ? [selectedCountry.value] : []
                  }
                  selectedYears={selectedYear ? [selectedYear.value] : []}
                  selectedStatuses={
                    selectedStatusFilter ? [selectedStatusFilter.value] : []
                  }
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
                  <div className="bg-white p-6 rounded-lg shadow-sm">
                    <QuestionTitle as="h2">
                      {selectedQuestion
                        ? selectedQuestion
                        : translations.labels?.selectQuestion ||
                          "Selecione uma Pergunta"}
                    </QuestionTitle>
                    <div className="w-full">
                      {renderChart()}
                      <div className="text-right text-sm text-gray-600 mt-2 pr-2">
                        {translations.source?.inep ||
                          "Fonte: INEP, UNESCO e Dados Secundários da plataforma ELLAS"}
                        <DownloadIcon
                          onClick={() =>
                            exportTableDataToCSV(filteredData, dynamicFields)
                          }
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                          >
                            <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
                          </svg>
                        </DownloadIcon>
                      </div>
                    </div>
                  </div>

                  {/* Data Table Section */}
                  <div className="mt-8">
                    <Heading as="h3" size="xl" className="mb-4">
                      {translations.busca?.tabelaDeDados || "Tabela de Dados"}
                    </Heading>
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
          </MainContent>
        </div>
      </div>
    </>
  );
};

export default BuscaTwoOnePage;
