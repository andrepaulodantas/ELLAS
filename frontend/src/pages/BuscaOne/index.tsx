import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { Text, Img, Heading, Button, SelectBox } from "../../components";
import { TabPanel, TabList, Tab, Tabs } from "react-tabs";
import { useNavigate, useLocation } from "react-router-dom";
import GoogleMapComponent from "../../components/GoogleMap";
import { questionFunctions } from "../../services/apiService";
import { saveAs } from "file-saver";
import Header from "../../components/Header";
import DataTable from "components/DataTable";
import { SelectOption } from "../../components/SelectBox";
import { questionQueries, timeRelatedQuestions } from "../../utils/questions";
import { useLanguage } from "../../contexts/LanguageContext";

interface DropDownOption extends SelectOption {
  value: string;
  label: string;
}

interface BuscaOneProps {
  onSearch: (params: {
    category: string | null;
    question: string | null;
    time?: string | null;
  }) => void;
}

const BuscaOne: React.FC<BuscaOneProps> = ({ onSearch }) => {
  const { translations, language } = useLanguage();
  const [selectedCategory, setSelectedCategory] =
    useState<DropDownOption | null>(null);
  const [selectedQuestion, setSelectedQuestion] =
    useState<DropDownOption | null>(null);
  const [selectedTime, setSelectedTime] = useState<DropDownOption | null>(null);
  const [data, setData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [years, setYears] = useState<string[]>([]);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [dynamicFields, setDynamicFields] = useState<string[]>([]);
  const [selectedVisualization, setSelectedVisualization] =
    useState<string>("map");

  const navigate = useNavigate();
  const location = useLocation();

  const isTimeDropdownEnabled = Boolean(
    selectedQuestion &&
      timeRelatedQuestions.includes(selectedQuestion.value.trim().toLowerCase())
  );

  const getTabClass = (pathname: string, tabPath: string) => {
    return pathname === tabPath ? "text-gray-700 font-medium" : "text-gray-500";
  };

  useEffect(() => {
    const fetchData = async () => {
      if (selectedCategory && selectedQuestion) {
        const fetchFunction = questionFunctions[selectedQuestion.value];
        if (fetchFunction) {
          try {
            const response = await fetchFunction();
            if (response?.results?.bindings.length > 0) {
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

              const countries = formattedData
                .map((item) => item.countryName)
                .filter(
                  (country) =>
                    typeof country === "string" && country.trim() !== ""
                );

              setSelectedCountries(countries);

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

  useEffect(() => {
    if (selectedTime) {
      const selectedYear =
        selectedTime.value !== "all" ? parseInt(selectedTime.value, 10) : null;

      const filtered = data.filter((item) => {
        const startYear = item.startDate
          ? new Date(item.startDate).getFullYear()
          : null;
        const finishYear = item.finishDate
          ? new Date(item.finishDate).getFullYear()
          : null;
        return (
          selectedYear === null ||
          startYear === selectedYear ||
          finishYear === selectedYear
        );
      });

      setFilteredData(filtered);
      const countries = filtered
        .map((item) => item.countryName)
        .filter((country) => typeof country === "string");
      setSelectedCountries(countries);
    }
  }, [selectedTime, data]);

  const handleReset = () => {
    setSelectedCategory(null);
    setSelectedQuestion(null);
    setSelectedTime(null);
    setData([]);
    setFilteredData([]);
    setSelectedCountries([]);
    setYears([]);
    setDynamicFields([]);
    const newUrl = window.location.pathname;
    window.history.pushState({}, "", newUrl);
  };

  const handleCategoryChange = (option: DropDownOption | null) => {
    setSelectedCategory(option);
    setSelectedQuestion(null);
    setSelectedTime(null);
  };

  const handleQuestionChange = (option: DropDownOption | null) => {
    setSelectedQuestion(option);
    setSelectedTime(null);
  };

  const handleTimeChange = (option: DropDownOption | null) => {
    setSelectedTime(option);
  };

  const handleSearch = () => {
    onSearch({
      category: selectedCategory?.value || null,
      question: selectedQuestion?.value || null,
      time: selectedTime?.value || null,
    });
  };

  const exportTableDataToCSV = (data: any[], fields: string[]) => {
    if (!data || data.length === 0) {
      alert("No data available to export!");
      return;
    }

    const headers = ["Country", "Name", ...fields].join(",");
    const rows = data.map((item) =>
      [
        item.countryName || "N/A",
        item.name || "N/A",
        ...fields.map((field) => item[field] || "N/A"),
      ].join(",")
    );
    const csvContent = [headers, ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "data_table.csv");
  };

  const handleVisualizationChange = (visualization: string) => {
    setSelectedVisualization(visualization);
  };

  return (
    <>
      <Helmet>
        <title>ELLAS - Busca</title>
        <meta
          name="description"
          content="Web site created using create-react-app"
        />
      </Helmet>
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex-grow">
          <div className="flex flex-col items-center justify-start w-full bg-white-A700">
            <div className="flex flex-col items-center justify-start w-full">
              {/* Header Section */}
              <div className="flex flex-row justify-center items-center w-full p-6 sm:p-5 border-b-2 border-deep_orange-200 bg-gray-50">
                <Heading size="2xl" as="h1" className="text-center">
                  {translations.table.title}
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
                    {translations.buttons.reset}
                  </Button>
                  <div className="flex flex-col gap-6">
                    {/* Category Selection */}
                    <div>
                      <Text size="3xl" as="p" className="mb-2">
                        {translations.labels.category}
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
                        value={selectedCategory}
                        onChange={handleCategoryChange}
                        className="w-full border-gray-300_01 border rounded-md"
                      />
                    </div>

                    {/* Question Selection */}
                    <div>
                      <Text size="3xl" as="p" className="mb-2">
                        {translations.labels.question}
                      </Text>
                      <SelectBox
                        shape="round"
                        name="pergunta"
                        placeholder="Select Question"
                        options={
                          selectedCategory
                            ? questionQueries[selectedCategory.value].map(
                                (question) => ({
                                  label: question,
                                  value: question,
                                })
                              )
                            : []
                        }
                        value={selectedQuestion}
                        onChange={handleQuestionChange}
                        className="w-full border-gray-300_01 border rounded-md"
                      />
                    </div>

                    {/* Time Selection */}
                    {isTimeDropdownEnabled && (
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
                            ...years.map((year) => ({
                              label: year,
                              value: year,
                            })),
                          ]}
                          value={selectedTime}
                          onChange={handleTimeChange}
                          className="w-full border-gray-300_01 border rounded-md"
                          isDisabled={years.length === 0}
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Main Content Area */}
                <div className="flex flex-col w-[70%] md:w-full">
                  <Tabs
                    className="w-full"
                    selectedTabClassName="!text-[#4A2B5C] font-medium border-[#4A2B5C] border-b-2 bg-white"
                  >
                    <TabList className="flex flex-row gap-4 border-b border-gray-200">
                      <Tab
                        className="p-4 flex items-center gap-2 cursor-pointer outline-none"
                        selectedClassName="!text-[#4A2B5C] border-b-2 border-[#4A2B5C]"
                      >
                        <Text as="p">{translations.visualization.map}</Text>
                        <Img src="images/img_iconx18_9.svg" alt="Map Icon" />
                      </Tab>
                      <Tab
                        className="p-4 flex items-center gap-2 cursor-pointer outline-none"
                        selectedClassName="!text-[#4A2B5C] border-b-2 border-[#4A2B5C]"
                        onClick={() => navigate("/buscatwo")}
                      >
                        <Text as="p">{translations.visualization.bars}</Text>
                        <Img src="images/img_iconx18_11.svg" alt="Bars Icon" />
                      </Tab>
                      <Tab
                        className="p-4 flex items-center gap-2 cursor-pointer outline-none"
                        selectedClassName="!text-[#4A2B5C] border-b-2 border-[#4A2B5C]"
                        onClick={() => navigate("/buscatwoone")}
                      >
                        <Text as="p">{translations.visualization.lines}</Text>
                        <Img src="images/img_iconx18_12.svg" alt="Lines Icon" />
                      </Tab>
                    </TabList>

                    {/* Map Content */}
                    <TabPanel className="mt-6">
                      <Text size="3xl" as="p" className="text-center mb-4">
                        {selectedQuestion?.value ||
                          "Select a question to see results"}
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
                    className="mb-12"
                    key={language}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BuscaOne;
