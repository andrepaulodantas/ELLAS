import React, { useState, useEffect, ChangeEvent } from "react";
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
import { questionFunctions } from "../../services/apiService"; // Certifique-se de que essas funções estão exportadas corretamente no apiService.ts
import { Bar, Line } from "react-chartjs-2";
import "chart.js/auto"; // Importação necessária para Chart.js
import { getTabClass } from "../../utils/tabUtils";
import { saveAs } from "file-saver";
import Header from "components/Header";
import Footer from "components/Footer";

import { questionQueries, timeRelatedQuestions } from "../../utils/questions";

type DropDownOption = {
  label: string;
  value: string;
};

export default function BuscaTwoOnePage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);
  const [data, setData] = useState<any[]>([]);
  const [dynamicFields, setDynamicFields] = useState<string[]>([]);
  const [countryCounts, setCountryCounts] = useState<{
    [key: string]: number;
  }>({});
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>("ambos");
  const isTimeDropdownEnabled = timeRelatedQuestions.includes(selectedQuestion);
  const [selectedVisualization, setSelectedVisualization] =
    useState<string>("linhas");

  const navigate = useNavigate();
  const location = useLocation();

  const handleSupportClick = () => {
    window.location.href = "https://ellas.ufmt.br/support-ellas/"; // Redirecionamento Externo
  };

  const handleAboutClick = () => {
    window.location.href = "https://ellas.ufmt.br/about"; // Redirecionamento Externo
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
    saveAs(blob, "table_data.csv");
  };

  useEffect(() => {
    const fetchData = async () => {
      if (selectedCategory && selectedQuestion) {
        const fetchFunction = questionFunctions[selectedQuestion];
        if (fetchFunction) {
          try {
            const response = await fetchFunction();
            if (response?.results?.bindings.length > 0) {
              const fields = Object.keys(response.results.bindings[0]).filter(
                (key) =>
                  !["countryName", "policyName", "initiativeName"].includes(key)
              );
              setDynamicFields(fields);

              const formattedData = response.results.bindings.map(
                (item: any) => ({
                  country: item.countryName?.value,
                  name: item.policyName?.value || item.initiativeName?.value,
                  ...fields.reduce(
                    (acc, field) => ({
                      ...acc,
                      [field]: item[field]?.value || "",
                    }),
                    {}
                  ),
                })
              );

              setData(formattedData);

              // Atualizar contagem por país
              const countryCountMap: { [key: string]: number } = {};
              formattedData.forEach((item) => {
                if (item.country) {
                  countryCountMap[item.country] =
                    (countryCountMap[item.country] || 0) + 1;
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
  }, [selectedCategory, selectedQuestion]);

  const handleCategoryChange = (option: DropDownOption | null) => {
    setSelectedCategory(option ? option.value : null);
    setSelectedQuestion(null);
    setData([]);
    setDynamicFields([]);
    setCountryCounts({});
  };

  const handleQuestionChange = (option: DropDownOption | null) => {
    setSelectedQuestion(option ? option.value : null);
  };

  const handleReset = () => {
    setSelectedCategory(null);
    setSelectedQuestion(null);
    setData([]);
    setDynamicFields([]);
    setCountryCounts({});
  };

  const handleTimeChange = (option: DropDownOption | null) => {
    setSelectedTime(option ? option.value : null);
  };

  const handleStatusChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSelectedStatus(event.target.value);
  };

  const handleVisualizationChange = (event: ChangeEvent<HTMLInputElement>) => {
    console.log("Visualização selecionada:", event.target.value); // Verifique o valor
    setSelectedVisualization(event.target.value);
  };

  const handleNavigation = (path: string) => () => {
    navigate(path);
  };

  const renderChart = () => {
    const countries = Object.keys(countryCounts); // Lista de países
    const totalSteps = 100; // Eixo X vai de 0 a 100

    // Função auxiliar para gerar valores lineares acumulativos (formato de rampa)
    const generateLinearRamp = (totalValue: number) => {
      return Array.from({ length: totalSteps + 1 }, (_, i) => {
        return (i / totalSteps) * totalValue; // Linearmente de 0 até totalValue
      });
    };

    // Criar datasets: cada país terá uma "linha cumulativa" única
    const datasets = countries.map((country, index) => {
      const totalValue = countryCounts[country]; // Quantidade total para o país

      return {
        label: country, // Nome do país
        data: generateLinearRamp(totalValue), // Valores cumulativos lineares
        borderColor: `hsl(${index * 60}, 70%, 50%)`, // Cor única para cada país
        pointBackgroundColor: `hsl(${index * 60}, 70%, 50%)`,
        borderWidth: 2,
        tension: 0, // Linhas retas para formato de rampa
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

  return (
    <>
      <Helmet>
        <title>ELLAS</title>
        <meta
          name="description"
          content="Web site created using create-react-app"
        />
      </Helmet>
      <div className="flex flex-col items-center justify-start w-full bg-white-A700">
  <Header />
  <div className="flex flex-col items-center justify-start w-full">
    {/* Header Section */}
    <div className="flex flex-row justify-center items-center w-full p-6 sm:p-5 border-b-2 border-deep_orange-200 bg-gray-50">
      <Heading size="2xl" as="h1" className="text-center">
        Data Table
      </Heading>
    </div>

              {/* Main Content Section */}
    <div className="flex flex-row md:flex-col justify-between w-full gap-6 px-6 sm:px-4 max-w-[1331px] mt-5">
      {/* Sidebar */}
      <div className="w-[30%] md:w-full bg-white-A700 shadow-md p-6 sm:p-4">
        <Button
          size="xs"
          variant="outline"
          className="mb-4 gap-2.5 w-full rounded-[35px]"
          onClick={handleReset}
        >
          Restart
        </Button>
        <div className="flex flex-col gap-6">
          <Text size="lg" as="p">
            Category
          </Text>
          <SelectBox
            shape="round"
            name="categoria"
            placeholder="Select Category"
            options={[
              { label: "Initiatives", value: "initiatives" },
              { label: "Policies", value: "policies" },
              { label: "Factors", value: "factors" },
            ]}
            value={
              selectedCategory
                ? { label: selectedCategory, value: selectedCategory }
                : null
            }
            onChange={handleCategoryChange}
            className="w-full border-gray-300_01 border rounded-md"
          />
          <Text size="lg" as="p" className="mt-4">
            Question
          </Text>
          <SelectBox
            shape="round"
            name="pergunta"
            placeholder="Select Question"
            options={
              selectedCategory
                ? questionQueries[selectedCategory].map((question) => ({
                    label: question,
                    value: question,
                  }))
                : []
            }
            value={
              selectedQuestion
                ? { label: selectedQuestion, value: selectedQuestion }
                : null
            }
            onChange={handleQuestionChange}
            className="w-full mt-2 border-gray-300 border rounded-md"
          />
              </div>
            </div>
            
            {/* Sidebar */}
            
          <Tabs
            className="flex flex-col items-center justify-start w-[70%] md:w-full -mt-50 h-[1050px] md:h-auto"
            selectedTabClassName="!text-gray-700 font-medium text-sm border-gray-700 border-b-2 bg-white-A700"
            selectedTabPanelClassName="mt-[-2px] relative tab-panel--selected"
            defaultIndex={0}
          >
            <div className="flex flex-row md:flex-col justify-between items-start w-full md:gap-10">
              <TabList className="flex flex-row justify-start w-full gap-2.5">
                <Tab
                  className={`flex justify-center items-center gap-2.5 p-4 border-b-2 ${getTabClass(
                    location.pathname,
                    "/buscaone"
                  )}`}
                  onClick={() => navigate("/buscaone")}
                >
                  <Text as="p">Map</Text>
                  <Img src="images/img_iconx18_9.svg" alt="Map Icon" />
                </Tab>

                <Tab
                  className={`flex justify-center items-center gap-2.5 p-4 border-b-2 ${getTabClass(
                    location.pathname,
                    "/buscatwo"
                  )}`}
                  onClick={() => navigate("/buscatwo")}
                >
                  <Text as="p">Bars</Text>
                  <Img src="images/img_iconx18_11.svg" alt="Bars Icon" />
                </Tab>

                <Tab
                  className={`flex justify-center items-center gap-2.5 p-4 border-b-2 ${getTabClass(
                    location.pathname,
                    "/buscatwoone"
                  )}`}
                  onClick={() => navigate("/buscatwoone")}
                >
                  <Text as="p">Lines</Text>
                  <Img src="images/img_iconx18_12.svg" alt="Lines Icon" />
                </Tab>
              </TabList>            
            </div>
           
            {/* Main Content */}
      <div className="flex flex-col w-[70%] md:w-full bg-white shadow-md">
        {/* Chart Section */}
        <div className="p-6">
          <Text size="xl" as="p" className="mb-4 text-center">
            {selectedVisualization === "barras"
              ? "Bar Chart by Country"
              : "Line Chart by Country"}
          </Text>
          <div className="w-full">{renderChart()}</div>
        </div>

        {/* Table Section */}
        <div className="mt-8 p-6">
          <Heading size="lg" as="h2" className="text-center mb-4">
            Data Table
          </Heading>
          <div className="table-container overflow-y-auto max-h-[500px] border border-gray-300 rounded-md">
            <table className="table-auto w-full bg-white border-collapse">
              <thead className="bg-pink-100 sticky top-0 z-10">
                <tr>
                  <th className="w-[10%] text-left p-3">Country</th>
                  <th className="w-[32%] text-left p-3">Name</th>
                  {dynamicFields.map((field) => (
                    <th key={field} className="w-[8%] text-left p-3">
                      {field
                        .replace(/_/g, " ")
                        .split(" ")
                        .map(
                          (word) =>
                            word.charAt(0).toUpperCase() + word.slice(1)
                        )
                        .join(" ")}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => (
                  <tr
                    key={index}
                    className={`${
                      index % 2 === 0 ? "bg-purple-100" : "bg-white"
                    } border-b border-gray-300`}
                  >
                    <td className="p-3">{item.country}</td>
                    <td className="p-3">{item.name}</td>
                    {dynamicFields.map((field) => (
                      <td key={field} className="p-3">
                        {item[field] || ""}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
                  </div>  
                </div>
              </div>
            </Tabs>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}