import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { Text, Img, Heading, Button, RadioGroup, SelectBox } from "../../components";
import { TabPanel, TabList, Tab, Tabs } from "react-tabs";
import { Link } from "react-router-dom";
import GoogleMapComponent from "../../components/GoogleMap";
import {
  fetchInitiatives,
  fetchPolicies,
  fetchPolicyTypes,
  fetchPolicyResults,
  fetchPoliciesByCountryAndDate,
} from "../../services/apiService";

// Definindo o tipo DropDownOption
type DropDownOption = {
  label: string;
  value: string;
};

// Definindo as queries e questões
const questionQueries: { [key: string]: { question: string; query: string }[] } = {
  policies: [
    // Questões e queries aqui
  ],
  initiatives: [
    {
      question: "Which/How many initiatives are carried out in Brazil?",
      query: `
        PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        SELECT ?initiativeName ?countryName WHERE {
          ?initiative a Ellas:Initiative.
          ?initiative rdfs:label ?initiativeName.
          ?initiative Ellas:created_in ?country.
          ?country rdfs:label ?countryName.
          FILTER(?countryName="Brazil"@en).
        }
      `,
    },
  ],
};

const BuscaOnePage = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>("ambos");
  const [selectedVisualization, setSelectedVisualization] = useState<string>("paises");
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (selectedCategory && selectedQuestion) {
        const selectedQuery = questionQueries[selectedCategory].find(
          (q) => q.question === selectedQuestion
        )?.query;
        if (selectedQuery) {
          try {
            let response;
            if (selectedCategory === "policies") {
              response = await fetchPolicies(selectedQuery);
            } else if (selectedCategory === "initiatives") {
              response = await fetchInitiatives(selectedQuery);
            }
            if (response) {
              const formattedData = response.results.bindings.map(
                (item: any) => ({
                  country: item.countryName?.value,
                  name: item.policyName?.value || item.initiativeName?.value,
                  status: item.policyType?.value,
                  startDate: item.start_date?.value,
                  finishDate: item.finish_date?.value,
                })
              );
              setData(formattedData);
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
  };

  const handleQuestionChange = (option: DropDownOption | null) => {
    setSelectedQuestion(option ? option.value : null);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedStatus(e.target.value);
  };

  const handleVisualizationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedVisualization(e.target.value);
  };

  const handleReset = () => {
    setSelectedCategory(null);
    setSelectedQuestion(null);
    setSelectedTime(null);
    setSelectedStatus("ambos");
    setSelectedVisualization("paises");
    setData([]);
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
                            onClick={handleReset} // Adiciona funcionalidade de reiniciar aqui
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
                                  name="categoria"
                                  placeholder="Categoria"
                                  options={[
                                    { label: "Initiatives", value: "initiatives" },
                                    { label: "Policies", value: "policies" },
                                  ]}
                                  value={
                                    selectedCategory
                                      ? { label: selectedCategory, value: selectedCategory }
                                      : null
                                  }
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
                                name="pergunta"
                                placeholder="Pergunta"
                                options={
                                  selectedCategory
                                    ? questionQueries[selectedCategory].map(q => ({
                                        label: q.question,
                                        value: q.question,
                                      }))
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
                                name="tempo"
                                placeholder="Mais recente disponível"
                                options={[]} // No options for Tempo
                                value={null} // No value for Tempo
                                onChange={() => {}} // No-op for Tempo
                                className="w-full mt-3 border-blue_gray-100 border border-solid"
                              />
                              <Text size="3xl" as="p" className="mt-[22px]">
                                Tipo
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
                    </div>
                    <Tabs
                      className="flex flex-col items-center justify-start w-[70%] md:w-full"
                      selectedTabClassName="!text-gray-700 font-medium text-sm border-gray-700 border-b-2 bg-white-A700"
                      selectedTabPanelClassName="mt-[-2px] relative tab-panel--selected"
                      defaultIndex={0} // Usa o parâmetro padrão JavaScript para definir o índice padrão
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
                      <TabPanel className="flex flex-col items-center justify-center w-full">
                        <div className="flex flex-col items-center justify-center w-full mt-[-2px]">
                          <div className="flex flex-col items-center justify-center w-full mb-[22px] gap-[23px]">
                            <div className="h-[2px] w-full bg-deep_orange-200" />
                            <div className="flex flex-col items-center justify-center w-[95%] md:w-full gap-[17px]">
                              <Text size="3xl" as="p" className="text-center">
                                Quais e quantas iniciativas são realizadas por país?
                              </Text>
                              <div className="relative w-full h-[352px] overflow-hidden rounded-lg">
                                <GoogleMapComponent
                                  initiatives={data}
                                  selectedCountry={data.length > 0 ? data[0].country : null}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </TabPanel>
              <TabPanel className="items-center w-full absolute">
                {/* Conteúdo para o gráfico de barras */}
              </TabPanel>
              <TabPanel className="items-center w-full absolute">
                {/* Conteúdo para o gráfico de linhas */}
              </TabPanel>
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
                <div className="flex flex-row md:flex-col justify-center w-full md:gap-5 overflow-y-auto max-h-[500px]">
                  <div className="flex flex-col items-center justify-start w-[99%] md:w-full">
                    <div className="flex flex-row justify-center w-full">
                      <table className="w-full bg-white-A700">
                        <thead>
                          <tr className="flex flex-row justify-between p-[9px]">
                            <th className="w-[10%] text-left !text-gray-900">Country</th>
                            <th className="w-[32%] text-left !text-gray-900">Name</th>
                            <th className="w-[7%] text-left !text-gray-900">Status</th>
                            <th className="w-[7%] text-left !text-gray-900">Start date</th>
                            <th className="w-[7%] text-left !text-gray-900">Finish date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {data.map((item, index) => (
                            <tr key={index} className="flex flex-row justify-between p-[9px]">
                              <td className="w-[10%]">{item.country}</td>
                              <td className="w-[32%]">{item.name}</td>
                              <td className="w-[7%]">{item.status || ''}</td>
                              <td className="w-[7%]">{item.startDate || ''}</td>
                              <td className="w-[7%]">{item.finishDate || ''}</td>
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
        <footer className="flex flex-row justify-center w-full">
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
        </footer>
       </div>
      </div>
     </div>
    </>
  );
}

export default BuscaOnePage;