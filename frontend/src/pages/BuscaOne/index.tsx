import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { Text, Img, Heading, Button, GoogleMap, RadioGroup, SelectBox } from "../../components";
import { OptionProps } from "react-select";
import { TabPanel, TabList, Tab, Tabs } from "react-tabs";
import { Link } from "react-router-dom"; // Import Link

// Defina um tipo para as opções de dropdown
type DropDownOption = {
  label: string;
  value: string;
};

// Opções de dropdown
const dropDownOptions: DropDownOption[] = [
  { label: "Option 1", value: "option1" },
  { label: "Option 2", value: "option2" },
  { label: "Option 3", value: "option3" },
];

export default function BuscaOnePage() {
  // Estados para armazenar os valores selecionados
  const [selectedVisualization, setSelectedVisualization] = useState("paises");
  const [selectedStatus, setSelectedStatus] = useState("ambos");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const handleVisualizationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedVisualization(e.target.value);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedStatus(e.target.value);
  };

   const handleCategoryChange = (option: DropDownOption | null) => {
    if (option) {
      setSelectedCategory(option.value);
    } else {
      setSelectedCategory(null);
    }
  };

  const handleQuestionChange = (option: DropDownOption | null) => {
    if (option) {
      setSelectedQuestion(option.value);
    } else {
      setSelectedQuestion(null);
    }
  };

  const handleTimeChange = (option: DropDownOption | null) => {
    if (option) {
      setSelectedTime(option.value);
    } else {
      setSelectedTime(null);
    }
  };

  const handleReset = () => {
    setSelectedVisualization("paises");
    setSelectedStatus("ambos");
    setSelectedCategory(null);
    setSelectedQuestion(null);
    setSelectedTime(null);
  };

  return (
    <>
      <Helmet>
        <title>ELLAS</title>
        <meta name="description" content="Web site created using create-react-app" />
      </Helmet>
      <div className="flex flex-col items-center justify-start w-full bg-red-50_01">
        <header className="flex justify-center items-center w-full">
          <div className="flex flex-row justify-center w-full p-3 bg-white-A700 shadow-xs">
            <div className="flex flex-row md:flex-col justify-between items-center w-full md:gap-10 md:px-5 max-w-[1023px]">
              <Img
                src="images/img_logo_ellas_portal_prancheta.png"
                alt="logoellas_one"
                className="w-[13%] md:w-full md:h-[55px] object-cover"
              />
              <div className="flex flex-row md:flex-col justify-between items-center w-[69%] md:w-full md:gap-10">
                <div className="flex flex-row sm:flex-col justify-between items-center w-auto sm:gap-10">
                  <a href="#">
                    <Heading as="p">Início</Heading>
                  </a>
                  <Link to="/sobre" className="cursor-pointer hover:text-gray-700 hover:font-bold">
                    <Heading as="p">Sobre</Heading>
                  </Link>
                  <a href="#">
                    <Text />
                  </a>
                  <a href="#">
                    <Heading as="p">Apoie ELLAS</Heading>
                  </a>
                  <a href="#">
                    <Text />
                  </a>
                </div>
                <Button
                  size="sm"
                  shape="round"
                  rightIcon={<Img src="images/img_iconx18.svg" alt="iconx18" />}
                  className="gap-2.5 font-medium min-w-[106px]"
                >
                  Entrar
                </Button>
              </div>
            </div>
          </div>
        </header>
        <div className="flex flex-col items-center justify-start w-full">
          <div className="flex flex-col items-center justify-start w-full">
            <div className="flex flex-col items-center justify-start w-full">
              <div className="flex flex-row justify-start w-full p-6 sm:p-5 border-deep_orange-200 border-b-2 border-solid bg-gray-50">
                <div className="flex flex-row justify-start w-[17%] mb-[3px] ml-[142px] md:ml-5">
                  <Heading size="2xl" as="h1" className="text-center">
                    Dados Abertos
                  </Heading>
                </div>
              </div>
              <div className="flex flex-row md:flex-col justify-start items-center w-full gap-[35px] md:gap-5 md:px-5 max-w-[1331px]">
                <div className="h-[1087px] w-[29%] md:w-full pt-7 sm:pt-5 bg-white-A700 shadow-md relative">
                  <div className="flex flex-col items-center justify-start w-full z-[1]">
                    <div className="flex flex-col items-center justify-start w-full z-[1]">
                      <div className="flex flex-row justify-center w-full">
                        <div className="flex flex-col items-center justify-start w-full">
                          <div className="flex flex-row sm:flex-col justify-center w-full sm:gap-5">
                            <Button
                              color="white_A700"
                              size="lg"
                              shape="square"
                              rightIcon={<Img src="images/img_iconx18_gray_700.svg" alt="iconx18" />}
                              className="gap-2.5 sm:px-5 font-medium border-gray-700 border-b-2 border-solid min-w-[187px]"
                            >
                              Dados
                            </Button>
                            <Button
                              color="white_A700"
                              size="lg"
                              shape="square"
                              rightIcon={<Img src="images/img_iconx18_gray_700_18x18.svg" alt="iconx18" />}
                              className="gap-2.5 sm:px-5 font-medium border-gray-700 border-b-2 border-solid min-w-[186px]"
                            >
                              Detalhes
                            </Button>
                          </div>
                          <div className="h-[2px] w-full bg-gray-700" />
                        </div>
                      </div>
                      <Button
                        size="lg"
                        variant="outline"
                        rightIcon={<Img src="images/img_iconx18_5.svg" alt="iconx18" />}
                        className="mt-[12px] gap-2.5 min-w-[95px] rounded-[55px] sm:min-w-full"
                        onClick={handleReset} // Add reset functionality here
                      >
                        Reiniciar
                      </Button>
                      <div className="flex flex-col items-start justify-start w-[78%] md:w-full mt-3.5">
                        <div className="flex flex-col items-start justify-start w-full">
                          <div className="flex flex-col items-start justify-start w-full gap-3">
                            <Text size="3xl" as="p">
                              Categoria
                            </Text>
                            <SelectBox
                              shape="round"
                              indicator={<Img src="images/img_iconx18_7.svg" alt="iconx18" />}
                              getOptionLabel={(e: DropDownOption) => (
                                <>
                                  <div className="flex items-center">
                                    <Img src="images/img_iconx18_6.svg" alt="iconx18" />
                                    <span>{e.label}</span>
                                  </div>
                                </>
                              )}
                              name="iniciativas"
                              placeholder="Iniciativas"
                              options={dropDownOptions}
                              value={dropDownOptions.find(option => option.value === selectedCategory) || null}
                              onChange={handleCategoryChange}
                              className="w-full border-gray-300_01 border border-solid"
                            />
                          </div>
                          <Text size="3xl" as="p" className="mt-[22px]">
                            Pergunta
                          </Text>
                          <SelectBox
                            shape="round"
                            indicator={<Img src="images/img_iconx18_7.svg" alt="iconx18" />}
                            getOptionLabel={(e: DropDownOption) => (
                              <>
                                <div className="flex items-center">
                                  <Img src="images/img_iconx18_8.svg" alt="iconx18" />
                                  <span>{e.label}</span>
                                </div>
                              </>
                            )}
                            name="item"
                            placeholder="Quais e quantas iniciativas..."
                            options={dropDownOptions}
                            value={dropDownOptions.find(option => option.value === selectedQuestion) || null}
                            onChange={handleQuestionChange}
                            className="w-full mt-3 border-blue_gray-100 border border-solid"
                          />
                        </div>
                        <Text size="3xl" as="p" className="mt-5">
                          Tempo
                        </Text>
                        <SelectBox
                          shape="round"
                          indicator={<Img src="images/img_iconx18_7.svg" alt="iconx18" />}
                          getOptionLabel={(e: DropDownOption) => (
                            <>
                              <div className="flex items-center">
                                <Img src="images/img_iconx18_9.svg" alt="iconx18" />
                                <span>{e.label}</span>
                              </div>
                            </>
                          )}
                          name="item_one"
                          placeholder="Mais recente disponível"
                          options={dropDownOptions}
                          value={dropDownOptions.find(option => option.value === selectedTime) || null}
                          onChange={handleTimeChange}
                          className="w-full mt-3 border-blue_gray-100 border border-solid"
                        />
                        <Text size="3xl" as="p" className="mt-[22px]">
                          Status
                        </Text>
                        <RadioGroup name="status" className="w-full mt-3 flex flex-col gap-4">
                          <label className="flex items-center gap-2 py-2 px-4 rounded-lg cursor-pointer border border-blue_gray-300_01 hover:bg-blue_gray-50 transition-all duration-200">
                            <input
                              type="radio"
                              name="status"
                              value="ambos"
                              checked={selectedStatus === "ambos"}
                              onChange={handleStatusChange}
                              className="appearance-none border border-blue_gray-300_01 rounded-full w-4 h-4 checked:bg-blue-600 checked:border-transparent focus:outline-none"
                            />
                            <span className="text-blue_gray-300_01">Ambos</span>
                          </label>
                          <label className="flex items-center gap-2 py-2 px-4 rounded-lg cursor-pointer border border-blue_gray-300_01 hover:bg-blue_gray-50 transition-all duration-200">
                            <input
                              type="radio"
                              name="status"
                              value="ativo"
                              checked={selectedStatus === "ativo"}
                              onChange={handleStatusChange}
                              className="appearance-none border border-blue_gray-300_01 rounded-full w-4 h-4 checked:bg-blue-600 checked:border-transparent focus:outline-none"
                            />
                            <span className="text-blue_gray-300_01">Ativo</span>
                          </label>
                          <label className="flex items-center gap-2 py-2 px-4 rounded-lg cursor-pointer border border-blue_gray-300_01 hover:bg-blue_gray-50 transition-all duration-200">
                            <input
                              type="radio"
                              name="status"
                              value="inativo"
                              checked={selectedStatus === "inativo"}
                              onChange={handleStatusChange}
                              className="appearance-none border border-blue_gray-300_01 rounded-full w-4 h-4 checked:bg-blue-600 checked:border-transparent focus:outline-none"
                            />
                            <span className="text-blue_gray-300_01">Inativo</span>
                          </label>
                        </RadioGroup>
                        <Text size="3xl" as="p" className="mt-[22px]">
                          Visualização
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
                            />
                            <span className="text-blue_gray-300_01">Países</span>
                          </label>
                          <label className="flex items-center gap-2 py-2 px-4 rounded-lg cursor-pointer border border-blue_gray-300_01 hover:bg-blue_gray-50 transition-all duration-200">
                            <input
                              type="radio"
                              name="visualizacao"
                              value="regioes"
                              checked={selectedVisualization === "regioes"}
                              onChange={handleVisualizationChange}
                              className="appearance-none border border-blue_gray-300_01 rounded-full w-4 h-4 checked:bg-blue-600 checked:border-transparent focus:outline-none"
                            />
                            <span className="text-blue_gray-300_01">Regiões</span>
                          </label>
                          <label className="flex items-center gap-2 py-2 px-4 rounded-lg cursor-pointer border border-blue_gray-300_01 hover:bg-blue_gray-50 transition-all duration-200">
                            <input
                              type="radio"
                              name="visualizacao"
                              value="global"
                              checked={selectedVisualization === "global"}
                              onChange={handleVisualizationChange}
                              className="appearance-none border border-blue_gray-300_01 rounded-full w-4 h-4 checked:bg-blue-600 checked:border-transparent focus:outline-none"
                            />
                            <span className="text-blue_gray-300_01">Global</span>
                          </label>
                        </RadioGroup>
                      </div>
                      </div>
                      </div>
                      </div>
                <Tabs
                  className="flex flex-col items-center justify-start w-[70%] md:w-full"
                  selectedTabClassName="!text-gray-700 font-medium text-sm border-gray-700 border-b-2 bg-white-A700"
                  selectedTabPanelClassName="mt-[-2px] relative tab-panel--selected"
                >
                  <div className="flex flex-row md:flex-col justify-between items-start w-full md:gap-10">
                    <TabList className="flex flex-row sm:flex-col justify-start w-[46%] md:w-full gap-2.5 sm:gap-2.5">
                      <Tab className="flex flex-row justify-center items-center w-[32%] md:w-full md:h-auto gap-2.5 p-[17px] border-gray-700 border-b-2 border-solid bg-white-A700">
                        <Text as="p" className="text-center !font-medium">
                          Mapa
                        </Text>
                        <Img src="images/img_iconx18_10.svg" alt="iconxeighteen" className="h-[18px] w-[18px]" />
                      </Tab>
                      <Tab className="flex flex-row justify-center items-center w-[32%] md:w-full md:h-auto gap-2.5 p-[18px] border-deep_orange-200 border-b-2 border-solid bg-red-100_02">
                        <Text as="p" className="text-center !font-medium">
                          Barras
                        </Text>
                        <Img src="images/img_iconx18_11.svg" alt="iconxeighteen" className="h-[18px] w-[18px]" />
                      </Tab>
                      <Tab className="flex flex-row justify-center items-center w-[32%] md:w-full md:h-auto gap-2.5 p-[18px] border-deep_orange-200 border-b-2 border-solid bg-red-100_02">
                        <Text as="p" className="text-center !font-medium">
                          Linhas
                        </Text>
                        <Img src="images/img_iconx18_12.svg" alt="iconxeighteen" className="h-[18px] w-[18px]" />
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
                  {[...Array(3)].map((_, index) => (
                    <TabPanel key={`tab-panel${index}`} className="items-center w-full absolute">
                      <div className="flex flex-col items-center justify-start w-full mt-[-2px]">
                        <div className="flex flex-col items-center justify-start w-full mb-[22px] gap-[23px]">
                          <div className="h-[2px] w-full bg-deep_orange-200" />
                          <div className="flex flex-col items-start justify-start w-[95%] md:w-full gap-[17px]">
                            <Text size="3xl" as="p" className="text-center">
                              Quais e quantas iniciativas são realizadas por país?
                            </Text>
                            <GoogleMap showMarker={false} className="h-[352px] w-full" />
                          </div>
                        </div>
                      </div>
                    </TabPanel>
                  ))}
                  <div className="flex flex-row justify-between items-start w-[99%] md:w-full mt-[26px]">
                    <Heading size="xl" as="h2" className="mt-[3px] text-center">
                      Tabela de Dados
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
                  <div className="flex flex-row justify-center w-[99%] md:w-full mt-[13px] bg-white-A700">
                    <div className="flex flex-row md:flex-col justify-center w-full md:gap-5 overflow-y-auto max-h-[500px]"> {/* Add overflow-y and max-height here */}
                      <div className="flex flex-col items-center justify-start w-[99%] md:w-full">
                        <div className="flex flex-row justify-center w-full">
                          <div className="flex flex-row md:flex-col justify-start w-full gap-[74px] p-[9px] md:gap-10 bg-purple-100">
                            <div className="flex flex-row justify-start items-center w-[10%] md:w-full ml-[9px] gap-[13px] md:ml-0">
                              <Text as="p" className="!text-gray-900">
                                Country
                              </Text>
                              <Img src="images/img_iconx18_13.svg" alt="iconxeighteen" className="h-[18px] w-[18px]" />
                            </div>
                            <div className="flex flex-row w-[32%] md:w-full gap-[142px] md:gap-10">
                              <div className="flex flex-row justify-start items-center w-[24%] gap-[9px]">
                                <Text as="p" className="!text-gray-900">
                                  Name
                                </Text>
                                <Img src="images/img_iconx18_13.svg" alt="name_two" className="h-[18px] w-[18px]" />
                              </div>
                              <div className="flex flex-row justify-start items-center w-[24%] gap-1.5">
                                <Text as="p" className="!text-gray-900">
                                  Status
                                </Text>
                                <Img src="images/img_iconx18_13.svg" alt="iconxeighteen" className="h-[18px] w-[18px]" />
                              </div>
                            </div>
                            <div className="flex flex-row justify-between w-[27%] md:w-full">
                              <div className="flex flex-row justify-start items-center gap-[7px]">
                                <Text as="p" className="!text-gray-900">
                                  Start date
                                </Text>
                                <Img src="images/img_iconx18_13.svg" alt="iconxeighteen" className="h-[18px] w-[18px]" />
                              </div>
                              <div className="flex flex-row justify-start items-center gap-2.5">
                                <Text as="p" className="!text-gray-900">
                                  Finish date
                                </Text>
                                <Img src="images/img_iconx18_13.svg" alt="iconxeighteen" className="h-[18px] w-[18px]" />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-row justify-center w-full">
                          <div className="flex flex-col items-center justify-start w-full">
                            <div className="h-[410px] w-full relative">
                              <div className="flex flex-col items-center justify-start w-full gap-[41px] top-0 right-0 left-0 m-auto absolute">
                                <div className="h-[41px] w-full bg-deep_purple-200_26" />
                                <div className="h-[41px] w-full bg-deep_purple-200_26" />
                                <div className="h-[41px] w-full bg-deep_purple-200_26" />
                                <div className="h-[41px] w-full bg-deep_purple-200_26" />
                                <div className="h-[41px] w-full bg-deep_purple-200_26" />
                              </div>
                              <Text as="p" className="w-[13%] h-full left-[2%] bottom-0 top-0 m-auto !leading-[41px] absolute">
                                <>
                                  Peru
                                  <br />
                                  Peru
                                  <br />
                                  Peru
                                  <br />
                                  Peru
                                  <br />
                                  Peru
                                  <br />
                                  Peru
                                  <br />
                                  Brasil
                                  <br />
                                  Brasil
                                  <br />
                                  Brasil
                                  <br />
                                  Brasil
                                  <br />
                                  Brasil
                                  <br />
                                  Bolivia
                                  <br />
                                  Bolivia
                                  <br />
                                  Bolivia
                                  <br />
                                  Argentina
                                  <br />
                                  Argentina
                                  <br />
                                  <br />
                                </>
                              </Text>
                              <Text as="p" className="w-[19%] h-full left-[19%] bottom-0 top-0 m-auto !leading-[41px] absolute">
                                <>
                                  AgileGirls-Peru
                                  <br />
                                  Alianza
                                  <br />
                                  Niñas en Ciencia
                                  <br />
                                  Clubes de Ciencia Perú
                                  <br />
                                  DigiGirlz
                                  <br />
                                  Enseña Perú
                                  <br />
                                  Girls In Tech & Science
                                  <br />
                                  IEEE Women
                                  <br />
                                  Meninas Digitais
                                  <br />
                                  Include Meninas
                                  <br />
                                  Story Girl
                                  <br />
                                  Bolivianas
                                  <br />
                                  IC LaPaz
                                  <br />
                                  MujerComp
                                  <br />
                                  DevComp
                                  <br />
                                  BuenasProg
                                  <br />
                                  <br />
                                </>
                              </Text>
                              <Text as="p" className="w-[7%] h-full left-[43%] bottom-0 top-0 m-auto !leading-[41px] absolute">
                                <>
                                  Active
                                  <br />
                                  Active
                                  <br />
                                  Active
                                  <br />
                                  Active
                                  <br />
                                  Inactive
                                  <br />
                                  Active
                                  <br />
                                  Active
                                  <br />
                                  Active
                                  <br />
                                  Active
                                  <br />
                                  Active
                                  <br />
                                  Active
                                  <br />
                                  Inactive
                                  <br />
                                  Active
                                  <br />
                                  Active
                                  <br />
                                  Active
                                  <br />
                                  Active
                                </>
                              </Text>
                              <Text as="p" className="w-[7%] h-full right-[35%] bottom-0 top-0 m-auto !leading-[41px] absolute">
                                <>
                                  2012
                                  <br />
                                  2022
                                  <br />
                                  2016
                                  <br />
                                  2022
                                  <br />
                                  2015
                                  <br />
                                  2010
                                  <br />
                                  2020
                                  <br />
                                  2021
                                  <br />
                                  2020
                                  <br />
                                  2014
                                  <br />
                                  2018
                                  <br />
                                  2022
                                  <br />
                                  2020
                                  <br />
                                  2021
                                  <br />
                                  2018
                                  <br />
                                  2020
                                </>
                              </Text>
                              <Text as="p" className="w-[7%] h-full right-[20%] bottom-0 top-0 m-auto !leading-[41px] absolute">
                                <>
                                  <br />
                                  2022
                                  <br />
                                  2020
                                  <br />
                                  <br />
                                  2021
                                  <br />
                                  <br />
                                  <br />
                                  2023
                                  <br />
                                  <br />
                                  2020
                                  <br />
                                  <br />
                                  <br />
                                  <br />
                                  2023
                                  <br />
                                  <br />
                                  2022
                                </>
                              </Text>
                            </div>
                          </div>
                        </div>
                        <div className="h-px w-full mt-[82px] bg-deep_purple-200_26" />
                        <div className="h-px w-full mt-[164px] bg-deep_purple-200_26" />
                      </div>
                    </div>
                  </div>
                </Tabs>
              </div>
              <div className="flex flex-row justify-center w-full">
                <div className="flex flex-col items-center justify-start w-full">
                  <Img src="images/img_group_22.svg" alt="image" className="h-[19px] z-[1]" />
                  <div className="flex flex-row justify-center w-full mt-[-18px] px-14 py-[65px] md:p-5 bg-gray-800_02">
                    <div className="flex flex-row md:flex-col justify-between items-center w-full md:gap-10 max-w-[1021px]">
                      <div className="flex flex-col items-start justify-start w-[19%] md:w-full">
                        <Text as="p" className="!text-deep_orange-200 text-right !font-medium">
                          Contatos
                        </Text>
                        <Text size="xl" as="p" className="w-[87%] mt-2.5 !text-white-A700 !leading-5">
                          <>
                            www.ellas.ufmt.br
                            <br />
                            @Ellas.network
                            <br />
                            ellas.latinamerica@gmail.com
                          </>
                        </Text>
                        <Text as="p" className="mt-[30px] ml-[3px] md:ml-0 !text-deep_orange-200 !font-medium">
                          Conecte-se ao ELLAS
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
                            <Heading size="s" as="h3" className="!text-white-A700 text-center">
                              Patrocínio
                            </Heading>
                            <Img
                              src="images/img_idrc_logo_branca.png"
                              alt="idrclogo_one"
                              className="w-full md:h-auto sm:w-full mt-[3px] object-cover"
                            />
                            <Heading size="s" as="h4" className="mt-[27px] !text-white-A700 text-center">
                              Instituições Participantes
                            </Heading>
                          </div>
                          <div className="flex flex-col items-end justify-start w-[24%] mt-[5px] gap-[3px]">
                            <Text as="p" className="!text-deep_orange-200 text-right !font-medium">
                              Links Úteis
                            </Text>
                            <Text
                              size="xl"
                              as="p"
                              className="w-[88%] !text-white-A700 text-right !font-medium !leading-[29px]"
                            >
                              <>
                                Acessibilidade na Web
                                <br />
                                Termos de Uso
                                <br />
                                Política de Privacidade
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
                          <Text size="xl" as="p" className="w-[21%] !text-deep_orange-200 text-right">
                            <>
                              Todos os direitos reservados
                              <br />© 2024 ELLAS
                            </>
                          </Text>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
