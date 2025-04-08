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

import { questionQueries, timeRelatedQuestions } from "../../utils/questions";
import DataTable from "components/DataTable";

type SelectOption = { value: string; label: string };

const BuscaTwoPage = () => {
  const { translations, language } = useLanguage();
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

  // Year options
  const yearOptions = useMemo(
    () => [
      { label: translations.filters?.all || "All", value: "all" },
      { label: "2015", value: "2015" },
      { label: "2016", value: "2016" },
      { label: "2017", value: "2017" },
      { label: "2018", value: "2018" },
      { label: "2019", value: "2019" },
      { label: "2020", value: "2020" },
      { label: "2021", value: "2021" },
      { label: "2022", value: "2022" },
      { label: "2023", value: "2023" },
    ],
    [translations]
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
    if (countryParam) {
      const countryOption = countryOptions.find(
        (option) => option.value === countryParam
      );
      if (countryOption) {
        setSelectedCountry(countryOption);
      }
    }

    // Set year filter if provided
    if (yearParam) {
      const yearOption = yearOptions.find(
        (option) => option.value === yearParam
      );
      if (yearOption) {
        setSelectedYear(yearOption);
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
    saveAs(blob, "table_data.csv");
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

  // Apply filters to data whenever filter values change
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
        // Check country field with various formats
        const itemCountry = item.countryName || item.country || "";
        // Handle special case for USA/United States
        if (
          (itemCountry === "USA" || itemCountry === "United States") &&
          (selectedCountry.value === "USA" ||
            selectedCountry.value === "United States")
        ) {
          return true;
        }
        return itemCountry.includes(selectedCountry.value);
      });
    }

    // Apply year filter
    if (selectedYear && selectedYear.value && selectedYear.value !== "all") {
      const year = selectedYear.value;
      filtered = filtered.filter((item) => {
        // Check if startDate exists and matches the year
        if (item.startDate) {
          try {
            const startDateYear = new Date(item.startDate)
              .getFullYear()
              .toString();
            if (startDateYear === year) return true;
          } catch (e) {
            // Handle invalid date format
            if (item.startDate.includes(year)) return true;
          }
        }

        // Check if finishDate exists and matches the year
        if (item.finishDate) {
          try {
            const finishDateYear = new Date(item.finishDate)
              .getFullYear()
              .toString();
            if (finishDateYear === year) return true;
          } catch (e) {
            // Handle invalid date format
            if (item.finishDate.includes(year)) return true;
          }
        }

        // Check if start_date exists and matches the year (alternative field name)
        if (item.start_date) {
          try {
            const startDateYear = new Date(item.start_date)
              .getFullYear()
              .toString();
            if (startDateYear === year) return true;
          } catch (e) {
            // Try direct matching for formats like "2015"
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

        // Case-insensitive match for status
        const itemStatus = item.status.toLowerCase();
        const selectedStatusValue = selectedStatusFilter.value.toLowerCase();

        // Direct match
        if (itemStatus === selectedStatusValue) return true;

        // Check for partial matches
        if (itemStatus.includes(selectedStatusValue)) return true;

        // Check for initiative_status field as well (alternative field name)
        if (
          item.initiative_status &&
          item.initiative_status.toLowerCase().includes(selectedStatusValue)
        ) {
          return true;
        }

        return false;
      });
    }

    // Update filtered data for display
    setFilteredData(filtered);

    // Update countryCounts based on filtered data
    const countryCountMap: { [key: string]: number } = {};
    filtered.forEach((item) => {
      if (item.countryName) {
        countryCountMap[item.countryName] =
          (countryCountMap[item.countryName] || 0) + 1;
      }
    });
    setCountryCounts(countryCountMap);

    // Update selected countries for map highlighting
    const countries = Object.keys(countryCountMap);
    setSelectedCountries(countries);
  }, [data, selectedCountry, selectedYear, selectedStatusFilter]);

  const handleCategoryChange = (option: SelectOption | null) => {
    setSelectedCategory(option ? option.value : null);
    setSelectedQuestion(null); // Reset question when category changes

    // Don't reset filters when changing category
    // This allows filters to persist across category changes
  };

  const handleReset = () => {
    setSelectedCategory(null);
    setSelectedQuestion(null);
    setSelectedCountry(null);
    setSelectedYear(null);
    setSelectedStatusFilter(null);
    setData([]);
    setFilteredData([]);
    setDynamicFields([]);
    setCountryCounts({});
    setSelectedCountries([]);
    setYears([]);

    // Clear URL params on reset
    navigate("/buscatwo", { replace: true });
  };

  const handleQuestionChange = (option: SelectOption | null) => {
    setSelectedQuestion(option ? option.value : null);
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

  return (
    <>
      <Helmet>
        <title>ELLAS - Busca Avançada</title>
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
                        placeholder={translations.labels.selectCategory}
                        options={[
                          {
                            label: translations.categories.initiatives,
                            value: "initiatives",
                          },
                          {
                            label: translations.categories.policies,
                            value: "policies",
                          },
                          {
                            label: translations.categories.factors,
                            value: "factors",
                          },
                        ]}
                        value={
                          selectedCategory
                            ? {
                                label:
                                  translations.categories[selectedCategory] ||
                                  selectedCategory,
                                value: selectedCategory,
                              }
                            : null
                        }
                        onChange={handleCategoryChange}
                        className="w-full border-gray-300_01 border rounded-md"
                      />
                    </div>

                    {/* Question Selection */}
                    {selectedCategory && (
                      <div>
                        <Text size="3xl" as="p" className="mb-2">
                          {translations.labels.question}
                        </Text>
                        <SelectBox
                          shape="round"
                          name="pergunta"
                          placeholder={translations.labels.selectQuestion}
                          options={
                            questionQueries[selectedCategory]?.[language]?.map(
                              (q) => ({
                                label: q,
                                value: q,
                              })
                            ) || []
                          }
                          value={
                            selectedQuestion
                              ? {
                                  label: selectedQuestion,
                                  value: selectedQuestion,
                                }
                              : null
                          }
                          onChange={handleQuestionChange}
                          className="w-full border-gray-300_01 border rounded-md"
                        />
                      </div>
                    )}

                    {/* Added Filters Section */}
                    {selectedCategory && (
                      <div className="flex flex-col gap-4">
                        <Text size="2xl" as="p" className="font-medium">
                          {translations.labels.filters}
                        </Text>

                        {/* Country Filter */}
                        <div>
                          <Text size="md" as="p" className="mb-1">
                            {translations.filters.country}
                          </Text>
                          <SelectBox
                            shape="round"
                            name="country"
                            placeholder={translations.labels.selectCountry}
                            options={countryOptions}
                            value={selectedCountry}
                            onChange={(option) => setSelectedCountry(option)}
                            className="w-full border-gray-300_01 border rounded-md"
                          />
                        </div>

                        {/* Year Filter */}
                        <div>
                          <Text size="md" as="p" className="mb-1">
                            {translations.filters.startYear}
                          </Text>
                          <SelectBox
                            shape="round"
                            name="year"
                            placeholder={translations.labels.selectYear}
                            options={yearOptions}
                            value={selectedYear}
                            onChange={(option) => setSelectedYear(option)}
                            className="w-full border-gray-300_01 border rounded-md"
                          />
                        </div>

                        {/* Status Filter */}
                        <div>
                          <Text size="md" as="p" className="mb-1">
                            {translations.filters.status}
                          </Text>
                          <SelectBox
                            shape="round"
                            name="status"
                            placeholder={translations.labels.selectStatus}
                            options={statusOptions}
                            value={selectedStatusFilter}
                            onChange={(option) =>
                              setSelectedStatusFilter(option)
                            }
                            className="w-full border-gray-300_01 border rounded-md"
                          />
                        </div>
                      </div>
                    )}
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
                        className="p-4 flex items-center gap-2 cursor-pointer outline-none"
                        selectedClassName="!text-[#4A2B5C] border-b-2 border-[#4A2B5C]"
                        onClick={handleNavigation("/buscaone")}
                      >
                        <Text as="p">{translations.visualization.map}</Text>
                        <Img src="images/img_iconx18_9.svg" alt="Map Icon" />
                      </Tab>
                      <Tab
                        className="p-4 flex items-center gap-2 cursor-pointer outline-none"
                        selectedClassName="!text-[#4A2B5C] border-b-2 border-[#4A2B5C]"
                      >
                        <Text as="p">{translations.visualization.bars}</Text>
                        <Img src="images/img_iconx18_11.svg" alt="Bars Icon" />
                      </Tab>
                      <Tab
                        className="p-4 flex items-center gap-2 cursor-pointer outline-none"
                        selectedClassName="!text-[#4A2B5C] border-b-2 border-[#4A2B5C]"
                        onClick={handleNavigation("/buscatwoone")}
                      >
                        <Text as="p">{translations.visualization.lines}</Text>
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
                                : translations.labels.selectQuestion}
                            </Text>
                            <div className="flex flex-col items-center justify-start w-[100%] md:w-full">
                              <table className="w-full">
                                <thead className="border-b-6 border-gray-700">
                                  <tr>
                                    <th className="text-center pl-0">
                                      {translations.filters.country}
                                    </th>
                                    <th className="text-center pl-20">
                                      {translations.categories.initiatives}
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {Object.keys(countryCounts).length > 0 ? (
                                    Object.entries(countryCounts).map(
                                      ([country, count]) => (
                                        <tr key={country}>
                                          <td className="text-left pl-0">
                                            {translations.countries[
                                              country.toLowerCase() as keyof typeof translations.countries
                                            ] || country}
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
                                        {translations.filters.noData}
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

export default BuscaTwoPage;
