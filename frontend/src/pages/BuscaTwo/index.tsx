import React, { useState, useEffect, ChangeEvent } from "react";
import { Helmet } from "react-helmet";
import { Text, Img, Heading, Button, SelectBox } from "../../components";
import { TabPanel, TabList, Tab, Tabs } from "react-tabs";
import { useNavigate, useLocation } from "react-router-dom";
import GoogleMapComponent from "../../components/GoogleMap";
import { questionFunctions } from "../../services/apiService";
import { saveAs } from "file-saver";
import Header from "components/Header";
import Footer from "components/Footer";

import { questionQueries, timeRelatedQuestions } from "../../utils/questions";
import DataTable from "components/DataTable";

// Definindo o tipo DropDownOption
type DropDownOption = {
  label: string;
  value: string;
};

const BuscaTwoPage = () => {
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
  const [countryCounts, setCountryCounts] = useState<{ [key: string]: number }>(
    {}
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

              // Update `countryCounts`
              const countryCountMap: { [key: string]: number } = {};
              formattedData.forEach((item) => {
                if (item.country) {
                  countryCountMap[item.country] =
                    (countryCountMap[item.country] || 0) + 1;
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
  }, [selectedCategory, selectedQuestion]);

  const handleCategoryChange = (option: DropDownOption) => {
    setSelectedCategory(option.value);
    setSelectedQuestion(null); // Resetar pergunta ao mudar categoria
    setSelectedTime(null); // Resetar tempo ao mudar categoria
  };

  const handleReset = () => {
    setSelectedCategory(null);
    setSelectedQuestion(null);
    setData([]);
    setDynamicFields([]);
    setCountryCounts({});
  };

  const handleQuestionChange = (option: DropDownOption) => {
    setSelectedQuestion(option.value);
    setSelectedTime(null); // Resetar tempo ao mudar pergunta
  };

  const handleStatusChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSelectedStatus(event.target.value);
  };

  const handleVisualizationChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSelectedVisualization(e.target.value);
  };

  const handleNavigation = (path: string) => () => {
    navigate(path);
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
                    <Tab
                      className={`flex justify-center items-center gap-2.5 p-4 border-b-2 ${getTabClass(
                        location.pathname,
                        "/buscaone"
                      )}`}
                      onClick={() => navigate("/buscaone")}
                    >
                      <Text as="p">Map</Text>
                      <Img src="images/img_iconx18_11.svg" alt="Bars Icon" />
                    </Tab>
                    <Tab className="p-2 flex items-center gap-2">
                      <Text as="p">Bars</Text>
                      <Img src="images/img_iconx18_9.svg" alt="Map Icon" />
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

                  <TabPanel className="flex flex-col items-center justify-center w-full mt-0">
                    <div className="flex flex-col items-center justify-center w-full mt-[-2px]">
                      <div className="flex flex-col items-center justify-center w-full mb-[22px] gap-[23px]">
                        <div className="h-[2px] w-full bg-deep_orange-200" />
                        <div className="flex flex-col items-center justify-center w-[100%] md:w-full gap-[15px]">
                          <Text size="3xl" as="p" className="text-center">
                            {selectedQuestion
                              ? selectedQuestion
                              : "Select a question to see results"}
                          </Text>
                          <div className="flex flex-col items-center justify-start w-[100%] md:w-full">
                            <table className="w-full">
                              <thead className="border-b-6 border-gray-700">
                                <tr>
                                  <th className="text-center pl-0">Country</th>
                                  <th className="text-center pl-20">Count</th>
                                </tr>
                              </thead>
                              <tbody>
                                {Object.keys(countryCounts).length > 0 ? (
                                  Object.entries(countryCounts).map(
                                    ([country, count]) => (
                                      <tr key={country}>
                                        <td className="text-left pl-0">
                                          {country}
                                        </td>
                                        <td className="text-left pl-0">
                                          <div
                                            className="flex items-center"
                                            style={{
                                              width: `${
                                                (count /
                                                  Math.max(
                                                    ...Object.values(
                                                      countryCounts
                                                    ),
                                                    1
                                                  )) *
                                                100
                                              }%`,
                                              backgroundColor: "#cf9bcc",
                                              height: "20px",
                                              maxWidth: "100%",
                                              color: "white",
                                              fontWeight: "bold",
                                            }}
                                          >
                                            {count}
                                          </div>
                                        </td>
                                      </tr>
                                    )
                                  )
                                ) : (
                                  <tr>
                                    <td
                                      colSpan={2}
                                      className="text-center text-gray-500 py-4"
                                    >
                                      No data available. Please select a
                                      category and question.
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
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

export default BuscaTwoPage;
