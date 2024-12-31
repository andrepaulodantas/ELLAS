import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import {
  Text,
  Img,
  Heading,
  Button,
  RadioGroup,
  SelectBox,
} from "../../components";
import { TabPanel, TabList, Tab, Tabs } from "react-tabs";
import { useNavigate, useLocation } from "react-router-dom";
import GoogleMapComponent from "../../components/GoogleMap";
import { questionFunctions } from "../../services/apiService";
import { getTabClass } from "../../utils/tabUtils";

// Definindo o tipo DropDownOption
type DropDownOption = {
  label: string;
  value: string;
};

// Definindo as queries e questões
const questionQueries: { [key: string]: string[] } = {
  policies: [
    "In which countries the policy was applied?",
    "What types of gender policies/processes/practices exist in Latin America?",
    "How policies identified/analyzed are promoting women's participation in STEM fields?",
    "What types of gender policies/processes/practices have been implemented in Bolivia, Brazil and Peru since 2015?",
  ],
  initiatives: [
    "Which/How many initiatives are carried out in Brazil?",
    "What data source are used for initiative?",
    "What is the initiative's social network(s)?",
    "How many initiatives are of program?",
    "Are these initiatives public or private?",
    "How many initiatives are coordinated by individuals?",
    "What is the social gender of the people who are responsible for the initiatives?",
    "What is the OBJECTIVE of the initiative?",
    "Which initiative modality are used for the actives/actions?",
    "What initiatives serve girls or adolescents?",
    "What is the social gender of the target audience served by the initiative?",
    "What initiatives serve black women?",
    "What initiatives are being developed at a given school level?",
    "What initiatives serve a certain vulnerable group?",
    "Do the initiatives involve the School community?",
    "Which/How many initiatives are carried out in a given city?",
    "What/How many initiatives are carried out in a given state?",
    "What/How many initiatives are carried out in a given area?",
    "What/How many initiatives are carried out in a given region?",
    "Which/How many initiatives have a given reach?",
    "Are the initiatives funded?",
    "What is the sector of the organization(s) that finance(s) the initiative?",
    "What initiatives are active?",
    "Have the initiatives already been implemented or are they still in the design phase?",
    "Which initiatives are already finished?",
    "What is the initiative's website (URL)?",
    "How many initiatives are part of communities?",
  ],
  factors: [
    "What are the positive CONTEXTUAL FACTORS in COUNTRIES ANALYZED?",
    "What are the negative CONTEXTUAL FACTORS in activities in Institution X in COUNTRIES ANALYZED?",
    "Which CONTEXTUAL FACTORS are related to the TYPE of Educational FACTOR?",
    "What are the CONTEXTUAL FACTORS that impact Positively/Negatively the GENDER Female?",
    "What are the IMPACTS of CONTEXTUAL FACTOR X?",
    "Which are the IMPACT TYPES of the CONTEXTUAL FACTOR Y in Latin American INSTITUTIONS?",
    "What are the CONTEXTUAL FACTORS that impact Positively/Negatively on IMPACT (IMPACT=Leadership, permanence, motivation, others) in the country X?",
  ],
};

const timeRelatedQuestions = [
  "What is the initiative's social network(s)?",
  "What initiatives are being developed at a given school level?",
  "Have the initiatives already been implemented or are they still in the design phase?",
  "Which initiatives are already finished?",
  "What types of gender policies/processes/practices have been implemented in Bolivia, Brazil and Peru since 2015?",
].map((q) => q.trim().toLowerCase());

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
              // Extract dynamic fields and set to state
              const fields = Object.keys(response.results.bindings[0]).filter(
                (key) =>
                  !["countryName", "policyName", "initiativeName"].includes(key)
              );
              setDynamicFields(fields);

              const formattedData = response.results.bindings.map(
                (item: any) => {
                  const dynamicData = fields.reduce(
                    (acc: any, field: string) => {
                      acc[field] = item[field]?.value || null;
                      return acc;
                    },
                    {}
                  );

                  return {
                    country: item.countryName?.value as string,
                    name: item.policyName?.value || item.initiativeName?.value,
                    ...dynamicData, // Include dynamic fields
                  };
                }
              );

              setData(formattedData);
              setFilteredData(formattedData);

              // Update highlighted countries
              const countries = formattedData
                .map((item) => item.country)
                .filter((country) => typeof country === "string");
              setSelectedCountries(countries);

              // Update years list
              const uniqueYears = Array.from(
                new Set(
                  formattedData.flatMap((item) => [
                    item.startDate
                      ? new Date(item.startDate).getFullYear()
                      : null,
                    item.finishDate
                      ? new Date(item.finishDate).getFullYear()
                      : null,
                  ])
                )
              )
                .filter(Boolean)
                .sort((a, b) => Number(a) - Number(b))
                .map(String);
              setYears(uniqueYears);
            } else {
              setData([]);
              setFilteredData([]);
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
      let filtered = data;

      if (selectedTime !== "all") {
        const selectedYear = parseInt(selectedTime, 10);
        filtered = data.filter((item) => {
          const startYear = item.startDate
            ? new Date(item.startDate).getFullYear()
            : null;
          const finishYear = item.finishDate
            ? new Date(item.finishDate).getFullYear()
            : null;

          return startYear === selectedYear || finishYear === selectedYear;
        });
      }

      setFilteredData(filtered);

      // Atualizar países destacados com base no filtro de tempo
      const countries = filtered
        .map((item) => item.country)
        .filter((country) => typeof country === "string");
      setSelectedCountries(countries);
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

  const handleTimeChange = (option: DropDownOption) => {
    setSelectedTime(option.value); // Atualizar o tempo selecionado
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
        <header className="flex justify-center items-center w-full">
          <div className="flex flex-row justify-center w-full p-3 bg-white-A700 shadow-xs">
            <div className="flex flex-row md:flex-col justify-between items-center w-full md:gap-20 md:px-5 max-w-[1023px]">
              <Img
                src="images/img_logo_ellas_portal_prancheta.png"
                alt="Logo ELLAS Portal"
                className="w-[30%] md:w-full md:h-[0px] object-cover"
              />
              <div className="flex flex-row md:flex-col justify-between items-center w-[100%] md:w-full md:gap-0">
                <ul className="flex flex-row justify-between items-center w-[70%] md:w-full gap-5">
                  <li>
                    <button
                      onClick={handleNavigation("/")}
                      className="cursor-pointer hover:text-gray-700 hover:font-bold"
                    >
                      <Heading as="p">Home</Heading>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={handleAboutClick}
                      className="cursor-pointer hover:text-gray-700 hover:font-bold"
                    >
                      <Heading as="p">About</Heading>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={handleNavigation("/buscaone")}
                      className="cursor-pointer hover:text-gray-700 hover:font-bold"
                    >
                      <Heading as="p">Open Data</Heading>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={handleSupportClick}
                      className="cursor-pointer hover:text-gray-700 hover:font-bold"
                    >
                      <Heading as="p">Support ELLAS</Heading>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={handleNavigation("/contato")}
                      className="cursor-pointer hover:text-gray-700 hover:font-bold"
                    >
                      <Heading as="p">Contact</Heading>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={handleNavigation("/faq")}
                      className="cursor-pointer hover:text-gray-700 hover:font-bold"
                    >
                      <Heading as="p">FAQ</Heading>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={handleNavigation("/graph-view")}
                      className="cursor-pointer hover:text-gray-700 hover:font-bold"
                    >
                      <Heading as="p">Graph View</Heading>
                    </button>
                  </li>
                </ul>
                <Button
                  size="sm"
                  shape="round"
                  rightIcon={
                    <Img
                      src="images/img_iconx18_white_a700.svg"
                      alt="Ícone de login"
                    />
                  }
                  onClick={handleNavigation("/fazerloginone")}
                >
                  Login
                </Button>
              </div>
            </div>
          </div>
        </header>
        <div className="flex flex-col items-center justify-start w-full">
          <div className="flex flex-col items-center justify-start w-full">
            <div className="flex flex-col items-center justify-start w-full">
              <div className="flex flex-row justify-start w-full p-6 sm:p-5 border-deep_orange-200 border-b-2 border-solid bg-gray-50">
                <div className="flex flex-row justify-start w-[17%] mb-[3px] ml-[142px] md:ml-5 mt-0">
                  <Heading size="2xl" as="h1" className="text-center">
                    Data Table
                  </Heading>
                </div>
              </div>
              <div className="flex flex-row md:flex-col justify-start items-center w-full gap-[35px] md:gap-5 md:px-5 max-w-[1331px] mt-0">
                <div className="h-[1050px] w-[29%] md:w-full pt-7 sm:pt-5 bg-white-A700 shadow-md mt-0">
                  <div className="flex flex-col items-center justify-start w-full z-[1] -mt-5">
                    <div className="flex flex-col items-center justify-start w-full z-[1] overflow-y-auto max-h-[950px] mt-0">
                      <div className="flex flex-row justify-center w-full mt-0">
                        <div className="flex flex-col items-center justify-start w-full mt-0">
                          <div className="flex flex-row sm:flex-col justify-center w-full sm:gap-5 mt-0">
                            <Button
                              color="white_A700"
                              size="lg"
                              shape="square"
                              rightIcon={
                                <Img
                                  src="images/img_iconx18_gray_700.svg"
                                  alt="iconx18"
                                />
                              }
                              className="gap-2.5 sm:px-5 font-medium border-gray-700 border-b-2 border-solid min-w-[187px]"
                            >
                              Data
                            </Button>
                            <Button
                              color="white_A700"
                              size="lg"
                              shape="square"
                              rightIcon={
                                <Img
                                  src="images/img_iconx18_gray_700_18x18.svg"
                                  alt="iconx18"
                                />
                              }
                              className="gap-2.5 sm:px-5 font-medium border-gray-700 border-b-2 border-solid min-w-[186px]"
                            >
                              Details
                            </Button>
                          </div>
                          <div className="h-[2px] w-full bg-gray-700" />
                        </div>
                      </div>
                      <Button
                        size="xs"
                        variant="outline"
                        rightIcon={
                          <Img src="images/img_iconx18_5.svg" alt="iconx18" />
                        }
                        className="mt-[22px] gap-2.5 min-w-[95px] rounded-[35px] sm:min-w-full"
                        onClick={handleReset}
                      >
                        Restart
                      </Button>
                      <div className="flex flex-col items-start justify-start w-[78%] md:w-full mt-2.5">
                        <div className="flex flex-col items-start justify-start w-full">
                          <div className="flex flex-col items-start justify-start w-full gap-3">
                            <Text size="3xl" as="p">
                              Category
                            </Text>
                            <SelectBox
                              shape="round"
                              indicator={
                                <Img
                                  src="images/img_iconx18_7.svg"
                                  alt="iconx18"
                                />
                              }
                              getOptionLabel={(e: DropDownOption) => (
                                <div className="flex items-center">
                                  <Img
                                    src="images/img_iconx18_6.svg"
                                    alt="iconx18"
                                  />
                                  <span>{e.label}</span>
                                </div>
                              )}
                              name="categoria"
                              placeholder="Category"
                              options={[
                                { label: "Initiatives", value: "initiatives" },
                                { label: "Policies", value: "policies" },
                                { label: "Factors", value: "factors" }, // Add Factors here
                              ]}
                              value={
                                selectedCategory
                                  ? {
                                      label: selectedCategory,
                                      value: selectedCategory,
                                    }
                                  : null
                              }
                              onChange={handleCategoryChange}
                              className="w-full border-gray-300_01 border border-solid"
                            />
                          </div>
                          <Text size="3xl" as="p" className="mt-[22px]">
                            Question
                          </Text>
                          <SelectBox
                            shape="round"
                            indicator={
                              <Img
                                src="images/img_iconx18_7.svg"
                                alt="iconx18"
                              />
                            }
                            getOptionLabel={(e: DropDownOption) => (
                              <div className="flex items-center">
                                <Img
                                  src="images/img_iconx18_8.svg"
                                  alt="iconx18"
                                />
                                <span>{e.label}</span>
                              </div>
                            )}
                            name="pergunta"
                            placeholder="Question"
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
                                ? {
                                    label: selectedQuestion,
                                    value: selectedQuestion,
                                  }
                                : null
                            }
                            onChange={handleQuestionChange}
                            className="w-full mt-3 border-blue_gray-100 border border-solid"
                          />

                          <Text size="3xl" as="p" className="mt-5">
                            Time
                          </Text>
                          <SelectBox
                            shape="round"
                            indicator={
                              <Img
                                src="images/img_iconx18_7.svg"
                                alt="iconx18"
                              />
                            }
                            name="tempo"
                            placeholder="Select Time"
                            options={[
                              { label: "Todos os anos", value: "all" },
                              ...years.map((year) => ({
                                label: year,
                                value: year,
                              })), // Gerar opções dinamicamente
                            ]}
                            value={
                              selectedTime
                                ? { label: selectedTime, value: selectedTime }
                                : null
                            }
                            onChange={handleTimeChange}
                            className={`w-full mt-3 border-blue_gray-100 border border-solid ${
                              isTimeDropdownEnabled
                                ? ""
                                : "opacity-50 pointer-events-none"
                            }`}
                            disabled={!isTimeDropdownEnabled}
                          />

                          <Text size="3xl" as="p" className="mt-[22px]">
                            Type
                          </Text>
                          <RadioGroup
                            name="status"
                            className="w-full mt-3 flex flex-col gap-4"
                          >
                            <label className="flex items-center gap-2 py-2 px-4 rounded-lg cursor-pointer border border-blue_gray-300_01 hover:bg-blue_gray-50 transition-all duration-200">
                              <input
                                type="radio"
                                name="status"
                                value="ambos"
                                checked={selectedStatus === "ambos"}
                                onChange={handleStatusChange}
                                className="appearance-none border border-blue_gray-300_01 rounded-full w-4 h-4 checked:bg-blue-600 checked:border-transparent focus:outline-none"
                                disabled={
                                  !selectedCategory || !selectedQuestion
                                } // Condição para desabilitar
                              />
                              <span className="text-blue_gray-300_01">
                                Both
                              </span>
                            </label>
                            <label className="flex items-center gap-2 py-2 px-4 rounded-lg cursor-pointer border border-blue_gray-300_01 hover:bg-blue_gray-50 transition-all duration-200">
                              <input
                                type="radio"
                                name="status"
                                value="ativo"
                                checked={selectedStatus === "ativo"}
                                onChange={handleStatusChange}
                                className="appearance-none border border-blue_gray-300_01 rounded-full w-4 h-4 checked:bg-blue-600 checked:border-transparent focus:outline-none"
                                disabled={
                                  !selectedCategory || !selectedQuestion
                                } // Condição para desabilitar
                              />
                              <span className="text-blue_gray-300_01">
                                Active
                              </span>
                            </label>
                            <label className="flex items-center gap-2 py-2 px-4 rounded-lg cursor-pointer border border-blue_gray-300_01 hover:bg-blue_gray-50 transition-all duration-200">
                              <input
                                type="radio"
                                name="status"
                                value="inativo"
                                checked={selectedStatus === "inativo"}
                                onChange={handleStatusChange}
                                className="appearance-none border border-blue_gray-300_01 rounded-full w-4 h-4 checked:bg-blue-600 checked:border-transparent focus:outline-none"
                                disabled={
                                  !selectedCategory || !selectedQuestion
                                } // Condição para desabilitar
                              />
                              <span className="text-blue_gray-300_01">
                                Inactive
                              </span>
                            </label>
                          </RadioGroup>

                          <Text size="3xl" as="p" className="mt-[22px]">
                            Visualization
                          </Text>
                          <RadioGroup
                            name="visualizacao"
                            className="w-full mt-3 flex flex-col gap-4"
                          >
                            <label className="flex items-center gap-2 py-2 px-4 rounded-lg cursor-pointer border border-blue_gray-300_01 hover:bg-blue_gray-50 transition-all duration-200">
                              <input
                                type="radio"
                                name="visualizacao"
                                value="paises"
                                checked={selectedVisualization === "paises"}
                                onChange={handleVisualizationChange}
                                className="appearance-none border border-blue_gray-300_01 rounded-full w-4 h-4 checked:bg-blue-600 checked:border-transparent focus:outline-none"
                                disabled={
                                  !selectedCategory || !selectedQuestion
                                } // Condição para desabilitar
                              />
                              <span className="text-blue_gray-300_01">
                                Countries
                              </span>
                            </label>
                            <label className="flex items-center gap-2 py-2 px-4 rounded-lg cursor-pointer border border-blue_gray-300_01 hover:bg-blue_gray-50 transition-all duration-200">
                              <input
                                type="radio"
                                name="visualizacao"
                                value="regioes"
                                checked={selectedVisualization === "regioes"}
                                onChange={handleVisualizationChange}
                                className="appearance-none border border-blue_gray-300_01 rounded-full w-4 h-4 checked:bg-blue-600 checked:border-transparent focus:outline-none"
                                disabled={
                                  !selectedCategory || !selectedQuestion
                                } // Condição para desabilitar
                              />
                              <span className="text-blue_gray-300_01">
                                Regions
                              </span>
                            </label>
                            <label className="flex items-center gap-2 py-2 px-4 rounded-lg cursor-pointer border border-blue_gray-300_01 hover:bg-blue_gray-50 transition-all duration-200">
                              <input
                                type="radio"
                                name="visualizacao"
                                value="global"
                                checked={selectedVisualization === "global"}
                                onChange={handleVisualizationChange}
                                className="appearance-none border border-blue_gray-300_01 rounded-full w-4 h-4 checked:bg-blue-600 checked:border-transparent focus:outline-none"
                                disabled={
                                  !selectedCategory || !selectedQuestion
                                } // Condição para desabilitar
                              />
                              <span className="text-blue_gray-300_01">
                                Global
                              </span>
                            </label>
                          </RadioGroup>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
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
                    <div className="flex flex-row justify-start gap-0.5">
                      <Button shape="square" className="w-[38px]">
                        <Img src="images/img_botao_icone_30px.svg" />
                      </Button>
                      <Button shape="square" className="w-[38px]">
                        <Img src="images/img_botao_icone_30px_white_a700.svg" />
                      </Button>
                      <Button shape="square" className="w-[38px]">
                        <Img src="images/img_botao_icone_30px_white_a700_38x38.svg" />
                      </Button>
                      <Button shape="square" className="w-[38px]">
                        <Img src="images/img_botao_icone_30px_38x38.svg" />
                      </Button>
                      <Button shape="square" className="w-[38px]">
                        <Img src="images/img_botao_icone_30px_1.svg" />
                      </Button>
                      <Button shape="square" className="w-[38px]">
                        <Img src="images/img_botao_icone_30px_2.svg" />
                      </Button>
                      <Button shape="square" className="w-[38px]">
                        <Img src="images/img_botao_icone_30px_3.svg" />
                      </Button>
                    </div>
                  </div>
                  <TabPanel className="flex flex-col items-center justify-center w-full">
                    <div className="flex flex-col items-center justify-center w-full mt-[-2px]">
                      <div className="flex flex-col items-center justify-center w-full mb-[22px] gap-[23px]">
                        <div className="h-[2px] w-full bg-deep_orange-200" />
                        <div className="flex flex-col items-center justify-center w-[95%] md:w-full gap-[17px]">
                          <Text size="3xl" as="p" className="text-center">
                            What and how many initiatives are carried out per
                            country?
                          </Text>
                          <div className="relative w-full h-[352px] overflow-hidden rounded-lg">
                            <GoogleMapComponent
                              initiatives={filteredData} // Passe os dados filtrados
                              selectedCountries={selectedCountries} // Passe os países selecionados
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabPanel>

                  <div className="flex flex-row justify-between items-start w-[99%] md:w-full mt-[0px]">
                    <Heading size="xl" as="h2" className="mt-[3px] text-center">
                      Data Table
                    </Heading>
                    <div className="flex flex-row justify-start gap-0.5">
                      <Button shape="square" className="w-[38px]">
                        <Img src="images/img_botao_icone_30px_1.svg" />
                      </Button>
                      <Button shape="square" className="w-[38px]">
                        <Img src="images/img_botao_icone_30px_4.svg" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex flex-row justify-center w-[99%] md:w-full mt-[10px] bg-white-A700">
                    <div className="flex flex-row md:flex-col justify-center w-full md:gap-5 overflow-y-auto max-h-[500px]">
                      <div className="flex flex-col items-center justify-start w-[99%] md:w-full">
                        <div className="flex-row justify-center w-full">
                          <table className="flex-row w-full bg-white-A700">
                            <thead className="bg-pink-100">
                              <tr className="flex-row justify-between p-[9px] bg-pink-100">
                                <th className="w-[10%] text-left !text-gray-900">
                                  Country
                                </th>
                                <th className="w-[32%] text-left !text-gray-900">
                                  Name
                                </th>
                                {dynamicFields.map((field) => (
                                  <th
                                    key={field}
                                    className="w-[8%] text-left !text-gray-900"
                                  >
                                    {field}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {data.map((item, index) => (
                                <tr
                                  key={index}
                                  className={`flex-row justify-between p-[9px] ${
                                    index % 2 === 0
                                      ? "bg-purple-100"
                                      : "bg-white"
                                  }`}
                                >
                                  <td className="w-[10%]">{item.country}</td>
                                  <td className="w-[32%]">{item.name}</td>
                                  {dynamicFields.map((field) => (
                                    <td key={field} className="w-[7%]">
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
                  </div>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
        <footer className="flex flex-row justify-center w-full">
          <div className="flex flex-col items-center justify-start w-full">
            <Img
              src="images/img_group_22.svg"
              alt="image"
              className="h-[19px] z-[1]"
            />
            <div className="flex flex-row justify-center w-full mt-[-18px] px-14 py-[65px] md:p-5 bg-gray-800_02">
              <div className="flex flex-row md:flex-col justify-between items-center w-full md:gap-10 max-w-[1021px]">
                <div className="flex flex-col items-start justify-start w-[19%] md:w-full">
                  <Text
                    as="p"
                    className="!text-deep_orange-200 text-right !font-medium"
                  >
                    Contacts
                  </Text>
                  <Text
                    size="xl"
                    as="p"
                    className="w-[87%] mt-2.5 !text-white-A700 !leading-5"
                  >
                    <>
                      www.ellas.ufmt.br
                      <br />
                      @Ellas.network
                      <br />
                      ellas.latinamerica@gmail.com
                    </>
                  </Text>
                  <Text
                    as="p"
                    className="mt-[30px] ml-[3px] md:ml-0 !text-deep_orange-200 !font-medium"
                  >
                    Connect to ELLAS
                  </Text>
                  <Img
                    src="images/img_group_24.svg"
                    alt="image_one"
                    className="h-[26px] mt-[15px] ml-1 md:ml-0"
                  />
                </div>
                <div className="flex flex-col items-end justify-start w-[74%] md:w-full mb-1">
                  <div className="flex flex-row justify-between items-start w-[81%] md:w-full">
                    <div className="flex flex-col items-center justify-start">
                      <Heading
                        size="s"
                        as="h3"
                        className="!text-white-A700 text-center"
                      >
                        Sponsorship
                      </Heading>
                      <Img
                        src="images/img_idrc_logo_branca.png"
                        alt="idrclogo_one"
                        className="w-full md:h-auto sm:w-full mt-[3px] object-cover"
                      />
                      <Heading
                        size="s"
                        as="h4"
                        className="mt-[27px] !text-white-A700 text-center"
                      >
                        Participating Institutions
                      </Heading>
                    </div>
                    <div className="flex flex-col items-end justify-start w-[24%] mt-[5px] gap-[3px]">
                      <Text
                        as="p"
                        className="!text-deep_orange-200 text-right !font-medium"
                      >
                        Useful Links
                      </Text>
                      <Text
                        size="xl"
                        as="p"
                        className="w-[88%] !text-white-A700 text-right !font-medium !leading-[29px]"
                      >
                        <>
                          Web Accessibility
                          <br />
                          Terms of Use
                          <br />
                          Privacy Policy
                        </>
                      </Text>
                    </div>
                  </div>
                  <div className="flex flex-row md:flex-col justify-between items-center w-full mt-[-2px] md:gap-10">
                    <div className="flex flex-row sm:flex-col justify-start items-center gap-2.5 sm:gap-5">
                      <Img
                        src="images/img_ufmt_oficial_branca.png"
                        alt="ufmtoficial_one"
                        className="w-[17%] md:h-auto sm:w-full object-cover"
                      />
                      <Img
                        src="images/img_uftpr_branca.png"
                        alt="uftprbranca_one"
                        className="w-[14%] md:h-auto sm:w-full object-cover"
                      />
                      <Img
                        src="images/img_vertical_extens.png"
                        alt="verticalextens"
                        className="w-[11%] md:h-auto sm:w-full object-cover"
                      />
                      <Img
                        src="images/img_logouff_vertica.png"
                        alt="logouffvertica"
                        className="w-[39px] md:h-auto sm:w-full object-cover"
                      />
                      <Img
                        src="images/img_200px_universid.png"
                        alt="200pxuniversid"
                        className="w-[48px] md:h-auto sm:w-full object-cover"
                      />
                      <Img
                        src="images/img_negro_horizontal_nac_branca.png"
                        alt="negro_one"
                        className="w-[23%] md:h-auto sm:w-full object-cover"
                      />
                      <Img
                        src="images/img_blancopeq.png"
                        alt="blancopeq_one"
                        className="w-[8%] md:h-auto sm:w-full object-cover"
                      />
                    </div>
                    <Text
                      size="xl"
                      as="p"
                      className="w-[21%] !text-deep_orange-200 text-right"
                    >
                      <>
                        All rights reserved
                        <br />© 2024 ELLAS
                      </>
                    </Text>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default BuscaOnePage;
