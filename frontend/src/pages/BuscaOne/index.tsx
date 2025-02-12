import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { Text, Img, Heading, Button, SelectBox } from "../../components";
import { TabPanel, TabList, Tab, Tabs } from "react-tabs";
import { useNavigate, useLocation } from "react-router-dom";
import GoogleMapComponent from "../../components/GoogleMap";
import { questionFunctions } from "../../services/apiService";
import { saveAs } from "file-saver";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

import { questionQueries, timeRelatedQuestions } from "../../utils/questions";
import DataTable from "components/DataTable";

// Definindo o tipo DropDownOption
type DropDownOption = {
  label: string;
  value: string;
};

const BuscaOnePage = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>("ambos");
  const [selectedVisualization, setSelectedVisualization] =
    useState<string>("paises");
  const [data, setData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [years, setYears] = useState<string[]>([]);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [dynamicFields, setDynamicFields] = useState<string[]>([]);

  const isTimeDropdownEnabled = Boolean(
    selectedQuestion &&
      timeRelatedQuestions.includes(selectedQuestion.trim().toLowerCase())
  );

  const getTabClass = (pathname: string, tabPath: string) => {
    return pathname === tabPath ? "text-gray-700 font-medium" : "text-gray-500";
  };

  const handleSupportClick = () => {
    window.location.href = "https://ellas.ufmt.br/support-ellas/"; // Redirecionamento Externo
  };

  const handleAboutClick = () => {
    window.location.href = "https://ellas.ufmt.br/about"; // Redirecionamento Externo
  };

  const navigate = useNavigate();
  const location = useLocation();

  // Monitorar mudanças na pergunta selecionada
  useEffect(() => {
    console.log("Selected Question:", selectedQuestion);
    console.log("Is Time Dropdown Enabled:", isTimeDropdownEnabled);
  }, [selectedQuestion, isTimeDropdownEnabled]);

  // Atualizar dados com base na categoria e pergunta selecionadas
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
                  country: item.countryName?.value || null,
                  name:
                    item.policyName?.value ||
                    item.initiativeName?.value ||
                    null,
                  startDate:
                    item.startDate?.value || item.start_date?.value || null,
                  finishDate:
                    item.finishDate?.value || item.finish_date?.value || null,
                  ...fields.reduce((acc, field) => {
                    acc[field] = item[field]?.value || "";
                    return acc;
                  }, {}),
                })
              );

              setData(formattedData);
              setFilteredData(formattedData);

              // Atualizar lista de países destacados
              const countries = formattedData
                .map((item) => item.country)
                .filter(
                  (country) =>
                    typeof country === "string" && country.trim() !== ""
                );

              setSelectedCountries(countries);

              // Atualizar lista de anos (se necessário)
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
  }, [selectedCategory, selectedQuestion]);

  // Atualizar lista de países destacados após alterações no filtro de tempo
  useEffect(() => {
    if (selectedTime) {
      const selectedYear =
        selectedTime !== "all" ? parseInt(selectedTime, 10) : null;

      const filtered = data.filter((item) => {
        const startYear = item.startDate
          ? new Date(item.startDate).getFullYear()
          : null;
        const finishYear = item.finishDate
          ? new Date(item.finishDate).getFullYear()
          : null;

        // Filtrar apenas se o ano for igual ao selecionado
        return (
          selectedYear === null ||
          startYear === selectedYear ||
          finishYear === selectedYear
        );
      });

      setFilteredData(filtered);

      // Atualizar os países destacados para o mapa
      const countries = filtered
        .map((item) => item.country)
        .filter((country) => typeof country === "string");
      setSelectedCountries(countries);

      console.log("Dados filtrados:", filtered);
      console.log("Países destacados:", countries);
    }
  }, [selectedTime, data]);

  // Atualizar países destacados ao redefinir filtros
  const handleReset = () => {
    setSelectedCategory(null);
    setSelectedQuestion(null);
    setSelectedTime(null);
    setSelectedStatus("ambos");
    setSelectedVisualization("paises");
    setData([]);
    setFilteredData([]);
    setSelectedCountries([]);
    setYears([]);
  };

  const handleCategoryChange = (option: DropDownOption) => {
    setSelectedCategory(option.value);
    setSelectedQuestion(null); // Resetar pergunta ao mudar categoria
    setSelectedTime(null); // Resetar tempo ao mudar categoria
  };

  const handleQuestionChange = (option: DropDownOption) => {
    setSelectedQuestion(option.value);
    setSelectedTime(null); // Resetar tempo ao mudar pergunta
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedStatus(e.target.value);
  };

  const handleVisualizationChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSelectedVisualization(e.target.value);
  };

  const handleNavigation = (path: string) => () => {
    navigate(path);
  };

  const exportTableDataToCSV = (data: any[], fields: string[]) => {
    if (!data || data.length === 0) {
      alert("No data available to export!");
      return;
    }

    // Cabeçalho do CSV
    const headers = ["Country", "Name", ...fields].join(",");

    // Linhas de dados
    const rows = data.map((item) =>
      [
        item.country || "N/A",
        item.name || "N/A",
        ...fields.map((field) => item[field] || "N/A"),
      ].join(",")
    );

    // Conteúdo do CSV
    const csvContent = [headers, ...rows].join("\n");

    // Criar blob e acionar o download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "data_table.csv"); // Nome do arquivo
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
          <div className="flex flex-col items-center justify-start w-full">
            {/* Header Section */}
            <div className="flex flex-row justify-center items-center w-full p-6 sm:p-5 border-b-2 border-deep_orange-200 bg-gray-50">
              <Heading size="2xl" as="h1" className="text-center">
                Data Table
              </Heading>
            </div>

            {/* Main Content Section */}
            <div className="flex flex-row md:flex-col justify-between items-start w-full gap-10 px-6 sm:px-4 max-w-[1331px]">
              {/* Sidebar Section */}
              <div className="h-auto w-[29%] md:w-full bg-white-A700 shadow-md p-6 sm:p-4">
                <Button
                  size="xs"
                  variant="outline"
                  className="mb-4 gap-2.5 w-full rounded-[35px]"
                  onClick={handleReset}
                >
                  Restart
                </Button>
                <div className="flex flex-col gap-6">
                  {/* Category Selection */}
                  <div>
                    <Text size="3xl" as="p" className="mb-2">
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
                  </div>

                  {/* Question Selection */}
                  <div>
                    <Text size="3xl" as="p" className="mb-2">
                      Question
                    </Text>
                    <SelectBox
                      shape="round"
                      name="pergunta"
                      placeholder="Select Question"
                      options={
                        selectedCategory
                          ? questionQueries[selectedCategory].map(
                              (question) => ({
                                label: question,
                                value: question,
                              })
                            )
                          : []
                      }
                      value={
                        selectedQuestion
                          ? { label: selectedQuestion, value: selectedQuestion }
                          : null
                      }
                      onChange={handleQuestionChange}
                      className="w-full border-gray-300_01 border rounded-md"
                    />
                  </div>

                  {/* Time Selection */}
                  <div>
                    <Text size="3xl" as="p" className="mb-2">
                      Time
                    </Text>
                    <SelectBox
                      shape="round"
                      name="tempo"
                      placeholder="Select Time"
                      options={[
                        { label: "All Years", value: "all" },
                        ...years.map((year) => ({ label: year, value: year })),
                      ]}
                      value={
                        selectedTime
                          ? { label: selectedTime, value: selectedTime }
                          : null
                      }
                      onChange={(option) =>
                        setSelectedTime(option?.value || null)
                      }
                      className="w-full border-gray-300_01 border rounded-md"
                      disabled={years.length === 0}
                    />
                  </div>
                </div>
              </div>

              {/* Tabs Section */}
              <div className="flex flex-col w-[70%] md:w-full">
                <Tabs
                  className="w-full"
                  selectedTabClassName="!text-gray-700 font-medium border-gray-700 border-b-2 bg-white-A700"
                  selectedTabPanelClassName="mt-4"
                >
                  <TabList className="flex flex-row gap-4 border-b">
                    <Tab className="p-2 flex items-center gap-2">
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

                  {/* Map Content */}
                  <TabPanel className="mt-6">
                    <Text size="3xl" as="p" className="text-center mb-4">
                      {selectedQuestion || "Select a question to see results"}
                    </Text>
                    <div className="relative w-full h-[352px] overflow-hidden rounded-lg">
                      <GoogleMapComponent
                        initiatives={filteredData}
                        selectedCountries={selectedCountries}
                      />
                    </div>
                  </TabPanel>
                </Tabs>

                {/* Data Table Section */}
                <DataTable
                  data={filteredData}
                  dynamicFields={dynamicFields}
                  exportTableDataToCSV={exportTableDataToCSV}
                />
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default BuscaOnePage;
