import React from "react";
import { Helmet } from "react-helmet";
import { Text, Img, Heading, Button, Slider } from "../../components";
import AliceCarousel, { EventObject, DotsItem } from "react-alice-carousel";

export default function HomeOnePage() {
  const [sliderState, setSliderState] = React.useState(0);
  const sliderRef = React.useRef<AliceCarousel>(null);
  const [sliderState1, setSliderState1] = React.useState(0);
  const sliderRef1 = React.useRef<AliceCarousel>(null);
  const [sliderState2, setSliderState2] = React.useState(0);
  const sliderRef2 = React.useRef<AliceCarousel>(null);

  return (
    <>
      <Helmet>
        <title>ELLAS</title>
        <meta name="description" content="Web site created using create-react-app" />
      </Helmet>
      <div className="flex flex-col items-center justify-start w-full bg-white-A700">
        <header className="flex justify-center items-center w-full">
          <div className="flex flex-row justify-center w-full p-3 bg-white-A700 shadow-xs">
            <div className="flex flex-row md:flex-col justify-between items-center w-full md:gap-10 md:px-5 max-w-[1023px]">
              <Img
                src="images/img_logo_ellas_portal_prancheta.png"
                alt="logoellas_one"
                className="w-[13%] md:w-full md:h-[55px] object-cover"
              />
              <div className="flex flex-row md:flex-col justify-between items-center w-[69%] md:w-full md:gap-10">
                <ul className="flex flex-row justify-between items-center w-[60%] md:w-full gap-5">
                  <li>
                    <button onClick={(e) => e.preventDefault()} className="cursor-pointer">
                      <Heading as="p">Início</Heading>
                    </button>
                  </li>
                  <li>
                    <button onClick={(e) => e.preventDefault()} className="cursor-pointer">
                      <Heading as="p">Sobre</Heading>
                    </button>
                  </li>
                  <li>
                    <button onClick={(e) => e.preventDefault()} className="cursor-pointer">
                      <Heading as="p">Apoie ELLAS</Heading>
                    </button>
                  </li>
                  <li>
                    <button onClick={(e) => e.preventDefault()} className="cursor-pointer">
                      <Heading as="p">Contato</Heading>
                    </button>
                  </li>
                  <li>
                    <button onClick={(e) => e.preventDefault()} className="cursor-pointer">
                      <Heading as="p">FAQ</Heading>
                    </button>
                  </li>
                </ul>
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
              <div className="h-[476px] w-full relative">
                <Img
                  src="images/img_fundo_home_1.png"
                  alt="fundohomeone"
                  className="justify-center h-[475px] w-full left-0 bottom-0 right-0 top-0 m-auto object-cover absolute"
                />
                <div className="flex flex-row justify-start w-[89%] h-full left-0 bottom-0 top-0 p-[37px] m-auto sm:p-5 bg-gradient absolute">
                  <div className="flex flex-col items-end justify-start w-[60%] mt-[49px] ml-[3px]">
                    <Heading size="2xl" as="h1" className="w-[73%] mr-[120px] md:mr-5 !leading-10">
                      Dados abertos para Equidade de Gênero em Ciências e Tecnologia na América Latina
                      <Button
                        size="sm"
                        shape="round"
                        rightIcon={<Img src="images/img_iconx18_white_a700.svg" alt="iconx18" />}
                        className="mt-3.5 gap-2.5 font-medium min-w-[38px]"
                      >
                        Saiba mais
                      </Button>
                      <div className="flex flex-row justify-start w-full mx-2.5 md:px-5 max-w-[723px]">
                          <div className="flex flex-row md:flex-col justify-start items-center w-full gap-2.5 p-0 md:gap-5 bg-white-A700 rounded-[29px] m-3">
                            <div className="flex flex-row sm:flex-col justify-start items-center w-[80%] md:w-full gap-2 sm:gap-5">
                              <div className="flex flex-row justify-start items-center w-[45%] sm:w-full gap-5 p-[11px]">
                                <Img
                                  src="images/img_iconx18_1.svg"
                                  alt="iconxeighteen"
                                  className="h-[18px] w-[18px] ml-[3px]"
                                />
                                <Text as="p" className="!text-blue_gray-300_01">
                                  Escolha uma Categoria
                                </Text>
                                <Img
                                  src="images/img_iconx18_2.svg"
                                  alt="iconxeighteen"
                                  className="h-[18px] w-[18px] mr-[3px]"
                                />
                              </div>
                              <Text size="5xl" as="p" className="!text-blue_gray-300_01 !font-normal">
                                |
                              </Text>
                              <div className="flex flex-row justify-start items-center w-[52%] sm:w-full gap-[21px] p-[11px]">
                                <Text as="p" className="ml-[3px] !text-blue_gray-300_01">
                                  O que deseja perguntar aos dados?
                                </Text>
                                <Img
                                  src="images/img_iconx18_2.svg"
                                  alt="iconxeighteen"
                                  className="h-[18px] w-[18px] mr-[3px]"
                                />
                              </div>
                            </div>
                            <Button
                              color="red_300_03"
                              size="sm"
                              shape="round"
                              rightIcon={<Img src="images/img_iconx18_white_a700_18x18.svg" alt="iconx18" />}
                              className="mr-1 gap-2.5 font-medium min-w-[131px]"
                            >
                              Pesquisar
                            </Button>
                          </div>
                        </div> 
                    </Heading>                    
                    <div className="flex flex-row justify-between w-[50%] md:w-full mr-[-800px] md:mr-0">
                      <Button color="white_A700_9" shape="circle" className="w-[508px] mt-[-100px] md:mt-0">
                        <Img src="images/img_women_home01_1.png" />
                      </Button>                      
                    </div> 
                  </div>                  
                </div>
                {/* <div className="w-[100%]">
                  <Slider
                    autoPlay
                    autoPlayInterval={2000}
                    responsive={{ "0": { items: 1 }, "550": { items: 1 }, "1050": { items: 3 } }}
                    renderDotsItem={(props: DotsItem) => {
                      return props?.isActive ? (
                        <div className="h-[10px] w-[10px] mr-3.5 bg-gray-700" />
                      ) : (
                        <div className="h-[10px] w-[10px] mr-3.5 bg-white-A700_99" />
                      );
                    }}
                    activeIndex={sliderState2}
                    onSlideChanged={(e: EventObject) => {
                      setSliderState2(e?.item);
                    }}
                    ref={sliderRef2}
                    className="right-[3%] bottom-0 top-0 m-auto absolute"
                    items={[...Array(3)].map(() => (
                      <React.Fragment key={Math.random()}>
                        <div className="flex flex-row justify-start w-full mx-2.5 md:px-5 max-w-[723px]">
                          <div className="flex flex-row md:flex-col justify-start items-center w-full gap-2.5 p-2 md:gap-5 bg-white-A700 rounded-[29px]">
                            <div className="flex flex-row sm:flex-col justify-start items-center w-[80%] md:w-full gap-2 sm:gap-5">
                              <div className="flex flex-row justify-start items-center w-[45%] sm:w-full gap-5 p-[11px]">
                                <Img
                                  src="images/img_iconx18_1.svg"
                                  alt="iconxeighteen"
                                  className="h-[18px] w-[18px] ml-[3px]"
                                />
                                <Text as="p" className="!text-blue_gray-300_01">
                                  Escolha uma Categoria
                                </Text>
                                <Img
                                  src="images/img_iconx18_2.svg"
                                  alt="iconxeighteen"
                                  className="h-[18px] w-[18px] mr-[3px]"
                                />
                              </div>
                              <Text size="5xl" as="p" className="!text-blue_gray-300_01 !font-normal">
                                |
                              </Text>
                              <div className="flex flex-row justify-start items-center w-[52%] sm:w-full gap-[21px] p-[11px]">
                                <Text as="p" className="ml-[3px] !text-blue_gray-300_01">
                                  O que deseja perguntar aos dados?
                                </Text>
                                <Img
                                  src="images/img_iconx18_2.svg"
                                  alt="iconxeighteen"
                                  className="h-[18px] w-[18px] mr-[3px]"
                                />
                              </div>
                            </div>
                            <Button
                              color="red_300_03"
                              size="sm"
                              shape="round"
                              rightIcon={<Img src="images/img_iconx18_white_a700_18x18.svg" alt="iconx18" />}
                              className="mr-1 gap-2.5 font-medium min-w-[131px]"
                            >
                              Pesquisar
                            </Button>
                          </div>
                        </div>
                      </React.Fragment>
                    ))}
                  />
                </div> */}
              </div>
              <Heading size="2xl" as="h2" className="mt-[47px] text-center">
                Explore os dados
              </Heading>
              <Text as="p" className="mt-3.5 !text-gray-900">
                Clique em um das categorias para encontrar dados relacionados a elas.
              </Text>
              <div className="flex flex-row md:flex-col justify-between items-end w-full mt-[38px] md:gap-10 md:px-5 max-w-[1285px]">
                <Button color="teal_50" shape="circle" className="w-[38px] mb-[116px]">
                  <Img src="images/img_botao_icone_38px.svg" />
                </Button>
                <div className="flex flex-row md:flex-col justify-start w-[80%] md:w-full gap-[46px] md:gap-5">
                  <div className="h-[290px] w-[22%] md:w-full relative">
                    <div className="flex flex-col items-start justify-start w-[73%] top-[3%] right-0 left-0 m-auto absolute">
                      <div className="flex flex-col h-[24px] w-[24px] gap-px">
                        <Img
                          src="images/img_elementos_white_a700.svg"
                          alt="elementos_one"
                          className="h-[24px] w-full"
                        />
                      </div>
                      <Heading size="xl" as="h3" className="mt-2 !text-white-A700 text-center">
                        Políticas
                      </Heading>
                      <Text as="p" className="mt-[27px] !text-white-A700 !leading-5">
                        Legislações e decretos que promovem a participação de mulheres nas áreas STEM
                      </Text>
                    </div>
                    <div className="flex flex-col items-start justify-center w-full h-full gap-[22px] left-0 bottom-0 right-0 top-0 p-[30px] m-auto sm:p-5 bg-red-300_03 absolute rounded-[20px]">
                      <Img src="images/img_iconx24.svg" alt="iconxtwentyfour" className="h-[24px] w-[24px] mt-2.5" />
                      <Heading size="xl" as="h4" className="!text-white-A700">
                        Políticas
                      </Heading>
                      <Text as="p" className="mb-[52px] !text-white-A700 !leading-5">
                        Legislações e decretos que promovem a participação de mulheres nas áreas STEM
                      </Text>
                    </div>
                  </div>
                  <div className="w-[74%]">
                    <Slider
                      autoPlay
                      autoPlayInterval={2000}
                      responsive={{ "0": { items: 1 }, "550": { items: 2 }, "1050": { items: 3 } }}
                      renderDotsItem={(props: DotsItem) => {
                        return props?.isActive ? (
                          <div className="h-[10px] w-[10px] mr-3.5 bg-gray-700" />
                        ) : (
                          <div className="h-[10px] w-[10px] mr-3.5 bg-teal-50" />
                        );
                      }}
                      activeIndex={sliderState1}
                      onSlideChanged={(e: EventObject) => {
                        setSliderState1(e?.item);
                      }}
                      ref={sliderRef1}
                      className="flex gap-[46px] mx-[23px] md:ml-0"
                      items={[...Array(9)].map(() => (
                        <React.Fragment key={Math.random()}>
                          <div className="flex flex-col items-start justify-start gap-[22px] p-[30px] mx-[23px] sm:p-5 sm:mx-5 bg-deep_orange-200 rounded-[20px]">
                            <Img
                              src="images/img_iconx24_white_a700.svg"
                              alt="iconxtwentyfour"
                              className="h-[24px] w-[24px] mt-2.5"
                            />
                            <Heading size="xl" as="h5" className="!text-white-A700">
                              Iniciativas
                            </Heading>
                            <Text as="p" className="mb-[52px] !text-white-A700 !leading-5">
                              Eventos, programas, e outras ações para inserção e permanência de mulheres nas carreiras
                              de tecnologia
                            </Text>
                          </div>
                        </React.Fragment>
                      ))}
                    />
                  </div>
                </div>
                <Button color="teal_50" shape="circle" className="w-[38px] mb-[116px]">
                  <Img src="images/img_botao_icone_38px.svg" />
                </Button>
              </div>
              <div className="h-[1332px] w-full mt-[47px] relative">
                <div className="flex flex-col items-center justify-center w-full h-full left-0 bottom-0 right-0 top-0 m-auto absolute">
                  <div className="flex flex-col items-end justify-start w-full">
                    <div className="flex flex-row justify-center w-full px-14 py-[62px] md:p-5 z-[1] bg-gray-50">
                      <div className="flex flex-col items-start justify-start w-[82%] mb-[21px] gap-[22px]">
                        <Heading size="2xl" as="h2" className="text-center">
                          Não sabe por onde começar?
                        </Heading>
                        <Text as="p" className="w-[41%] ml-[3px] md:ml-0 !text-gray-900 !leading-5">
                          Selecione uma das perguntas mais pesquisadas para começar.
                        </Text>
                        <div className="w-full gap-12 grid-cols-2 md:grid-cols-1 md:gap-5 grid">
                          <div className="flex flex-col items-start justify-start w-full sm:w-full gap-2.5 p-5 bg-white-A700 shadow-sm rounded-[20px]">
                            <div className="flex flex-row justify-start items-center gap-[13px]">
                              <Img
                                src="images/img_iconx18_red_300_03.svg"
                                alt="políticas_one"
                                className="h-[18px] w-[18px]"
                              />
                              <Heading as="p" className="!text-red-300_03">
                                Políticas
                              </Heading>
                            </div>
                            <Text as="p" className="!text-gray-900 !leading-5">
                              Que tipos de políticas, processos ou práticas de gênero existem na América Latina?
                            </Text>
                          </div>
                          <div className="flex flex-col items-start justify-start w-full sm:w-full gap-2.5 p-5 bg-white-A700 shadow-sm rounded-[20px]">
                            <div className="flex flex-row justify-start items-center gap-[13px]">
                              <Img
                                src="images/img_iconx18_deep_orange_200.svg"
                                alt="iconxeighteen"
                                className="h-[18px] w-[18px]"
                              />
                              <Heading as="p" className="!text-deep_orange-200">
                                Iniciativas
                              </Heading>
                            </div>
                            <Text as="p" className="!text-gray-900 !leading-5">
                              Qual o gênero social do público-alvo atendido pelas iniciativas na América Latina?
                            </Text>
                          </div>
                          <div className="flex flex-col items-start justify-start w-full sm:w-full gap-2.5 p-5 bg-white-A700 shadow-sm rounded-[20px]">
                            <div className="flex flex-row justify-start items-center gap-[13px]">
                              <Img
                                src="images/img_iconx18_red_300_03.svg"
                                alt="iconxeighteen"
                                className="h-[18px] w-[18px]"
                              />
                              <Heading as="p" className="!text-red-300_03">
                                Políticas
                              </Heading>
                            </div>
                            <Text as="p" className="!text-gray-900 !leading-5">
                              Como as políticas identificadas/analisadas estão promovendo a participação das mulheres
                              nas áreas STEM?
                            </Text>
                          </div>
                          <div className="flex flex-col items-start justify-start w-full sm:w-full gap-2.5 p-5 bg-white-A700 shadow-sm rounded-[20px]">
                            <div className="flex flex-row justify-start items-center gap-[13px]">
                              <Img
                                src="images/img_iconx18_pink_300.svg"
                                alt="iconxeighteen"
                                className="h-[18px] w-[18px]"
                              />
                              <Heading as="p" className="!text-pink-300">
                                Fatores
                              </Heading>
                            </div>
                            <Text as="p" className="!text-gray-900 !leading-5">
                              Quais são os tipos de impacto dos fatores contextuais nas instituições Latino-Americanas?
                            </Text>
                          </div>
                          <div className="flex flex-col items-start justify-start w-full sm:w-full gap-2.5 p-5 bg-white-A700 shadow-sm rounded-[20px]">
                            <div className="flex flex-row justify-start items-center gap-[13px]">
                              <Img
                                src="images/img_iconx18_deep_orange_200.svg"
                                alt="iconxeighteen"
                                className="h-[18px] w-[18px]"
                              />
                              <Heading as="p" className="!text-deep_orange-200">
                                Iniciativas
                              </Heading>
                            </div>
                            <Text as="p" className="!text-gray-900 !leading-5">
                              Quais iniciativas já foram implementadas ou ainda estão em fase de concepção?
                            </Text>
                          </div>
                          <div className="flex flex-col items-start justify-start w-full sm:w-full gap-2.5 p-5 bg-white-A700 shadow-sm rounded-[20px]">
                            <div className="flex flex-row justify-start items-center gap-[13px]">
                              <Img
                                src="images/img_iconx18_pink_300.svg"
                                alt="iconxeighteen"
                                className="h-[18px] w-[18px]"
                              />
                              <Heading as="p" className="!text-pink-300">
                                Fatores
                              </Heading>
                            </div>
                            <Text as="p" className="!text-gray-900 !leading-5">
                              Quais são os fatores contextuais negativos nas atividades das instituições nos países
                              analisados?
                            </Text>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="h-[404px] w-[60%] md:w-full mt-[-72px] relative">
                      <Img
                        src="images/img_vector.svg"
                        alt="vector_one"
                        className="justify-center h-[404px] left-0 bottom-0 right-0 top-0 m-auto absolute"
                      />
                      <Heading
                        size="2xl"
                        as="h2"
                        className="w-[61%] bottom-[33%] right-0 left-0 m-auto !leading-[45px] absolute"
                      >
                        Encontre a informação que precisa no Portal ELLAS
                      </Heading>
                    </div>
                  </div>
                  <div className="flex flex-row md:flex-col justify-start items-end w-full mt-[-332px] pl-[150px] pr-14 gap-[68px] py-[150px] md:gap-10 md:p-5 z-[1] bg-purple-50">
                    <div className="flex flex-row sm:flex-col justify-start items-center w-[35%] md:w-full mb-3 ml-[87px] gap-2 md:ml-5 sm:gap-5">
                      <div className="flex flex-row justify-start w-[70%] sm:w-full gap-2">
                        <div className="flex flex-row justify-start items-start w-[21%] gap-[3px]">
                          <div className="h-[14px] w-[14px] bg-pink-400 rounded-[50%]" />
                          <Text size="s" as="p" className="mt-0.5 !text-black-900">
                            Políticas
                          </Text>
                        </div>
                        <div className="flex flex-row justify-start items-start w-[19%] gap-1">
                          <div className="h-[14px] w-[14px] bg-orange-A700 rounded-[50%]" />
                          <Text size="s" as="p" className="mt-0.5 !text-black-900">
                            Fatores
                          </Text>
                        </div>
                        <div className="flex flex-row justify-start items-start w-[24%] gap-1">
                          <div className="h-[14px] w-[14px] bg-deep_purple-A200 rounded-[50%]" />
                          <Text size="s" as="p" className="mt-0.5 !text-black-900">
                            Inicitativas
                          </Text>
                        </div>
                        <div className="flex flex-row justify-start items-start w-[27%] gap-[3px]">
                          <div className="h-[14px] w-[14px] bg-amber-600 rounded-[50%]" />
                          <Text size="s" as="p" className="mt-0.5 !text-black-900">
                            Secundários
                          </Text>
                        </div>
                      </div>
                      <div className="flex flex-row justify-start items-start w-[29%] sm:w-full gap-1">
                        <Text size="s" as="p" className="w-[82%] !text-blue_gray-300_01 text-right">
                          Fonte: Portal ELLAS
                        </Text>
                        <Img src="images/img_mask_group.png" alt="elementos_one" className="h-[16px] w-[16px] mt-0.5" />
                      </div>
                    </div>
                    <Button
                      size="sm"
                      shape="round"
                      rightIcon={<Img src="images/img_iconx18_white_a700.svg" alt="iconx18" />}
                      className="mt-96 gap-2.5 md:mt-0 font-medium min-w-[138px]"
                    >
                      Saiba mais
                    </Button>
                  </div>
                </div>
                <Text as="p" className="w-[36%] bottom-[16%] right-[13%] m-auto !leading-5 absolute">
                  <span className="text-gray-700">
                    <>
                      A falta de dados recentes e confiáveis ​​é parcialmente responsável pelas diferenças de gênero em
                      ciência, tecnologia, engenharia e matemática (STEM) na América Latina. 
                      <br />
                      <br />O portal ELLAS contribui para a geração de dados abertos ​​entre países sobretudo, mas não
                      somente:
                      <br />
                      <br />
                    </>
                  </span>
                  <span className="text-gray-700 font-bold">
                    Avaliar políticas e intervenções de redução da diferença de gênero em STEM
                  </span>
                  <span className="text-gray-700">
                    <>
                      , especialmente aumentando o número de mulheres líderes em universidades, indústrias e
                      instituições públicas.
                      <br />
                      <br />
                    </>
                  </span>
                  <span className="text-gray-700 font-bold">
                    Mapear fatores que influenciam o desenvolvimento da carreira das mulheres em STEM, documentando e
                    analisando as iniciativas sucedidas ou não para identificar lições aprendidas. 
                  </span>
                </Text>
                <Img
                  src="images/img_pie_chart_prancheta.svg"
                  alt="piechart_one"
                  className="h-[374px] w-[375px] bottom-[17%] left-[17%] m-auto absolute"
                />
                <div className="h-[722px] w-[37%] sm:w-full bottom-0 left-0 m-auto absolute">
                  <Img
                    src="images/img_group.svg"
                    alt="image"
                    className="justify-center h-[722px] left-0 bottom-0 right-0 top-0 m-auto absolute"
                  />
                  <Heading size="lg" as="h6" className="w-[27%] right-[4%] top-[39%] m-auto text-center absolute">
                    <>
                      Categorias de
                      <br />
                      Dados no ELLAS
                    </>
                  </Heading>
                </div>
              </div>
              <div className="flex flex-row md:flex-col justify-start items-start w-full mt-[67px] gap-12 md:gap-5 md:px-5 max-w-[1026px]">
                <div className="flex flex-col items-start justify-start w-[48%] md:w-full mt-[22px] md:mt-0">
                  <Heading size="2xl" as="h2" className="text-center">
                    América Latina em foco!
                  </Heading>
                  <Text as="p" className="mt-[31px] !leading-5">
                    O portal ELLAS gera e divulga dados abertos conectados como foco em países da América Latina. Ele
                    surgiu a partir da união de instituições do Brasil, Bolívia e Peru.
                  </Text>
                  <Text as="p" className="mt-3.5 !leading-5">
                    Em uma infraestrutura de dados abertos é possível mapear informações, visualizar dados e melhorar a
                    colaboração entre os setores de educação, governo e indústria que buscam reduzir a diferença de
                    gênero STEM na América Latina.
                  </Text>
                  <Button
                    size="sm"
                    shape="round"
                    rightIcon={<Img src="images/img_iconx18_white_a700.svg" alt="iconx18" />}
                    className="mt-6 gap-2.5 font-medium min-w-[138px] sm:min-w-full"
                  >
                    Saiba mais
                  </Button>
                </div>
                <div className="flex flex-col items-center justify-start w-[48%] md:w-full p-3.5 bg-white-A700">
                  <div className="flex flex-col items-center justify-start w-[99%] md:w-full mt-[5px] gap-[9px]">
                    <div className="flex flex-row sm:flex-col justify-between items-start w-[99%] md:w-full sm:gap-10">
                      <Img src="images/img_map_latin_america.svg" alt="maplatin_one" className="h-[461px]" />
                      <div className="flex flex-col items-center justify-start w-[4%] sm:w-full mt-1 sm:mt-0">
                        <div className="flex flex-col items-center justify-center w-full rounded-tl-[50%] rounded-tr-[50%] border-blue_gray-100_02 border border-solid">
                          <Img
                            src="images/img_elementos_blue_gray_100_02.svg"
                            alt="elementos_three"
                            className="h-[14px] w-[14px] mt-1 mb-[3px]"
                          />
                        </div>
                        <div className="flex flex-col items-center justify-center w-full mt-[-1px] rounded-tl-[50%] rounded-tr-[50%] border-blue_gray-100_02 border border-solid">
                          <Img
                            src="images/img_elementos_blue_gray_100_02_14x14.svg"
                            alt="elementos_five"
                            className="h-[14px] w-[14px] mt-[3px] mb-1"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-row justify-between items-center w-full">
                      <div className="flex flex-row justify-start w-[52%] gap-2">
                        <div className="flex flex-row justify-start items-start w-[17%] gap-[3px]">
                          <div className="h-[12px] w-[12px] bg-red-50_02 rounded-[50%]" />
                          <Text size="xs" as="p" className="mt-0.5 !text-gray-900">
                            01-25%
                          </Text>
                        </div>
                        <div className="flex flex-row justify-start items-start w-[16%] gap-1">
                          <div className="h-[12px] w-[12px] bg-red-100_01 rounded-[50%]" />
                          <Text size="xs" as="p" className="mt-0.5 !text-gray-900">
                            26-50%
                          </Text>
                        </div>
                        <div className="flex flex-row justify-start items-start w-[16%] gap-[3px]">
                          <div className="h-[12px] w-[12px] bg-red-200 rounded-[50%]" />
                          <Text size="xs" as="p" className="mt-0.5 !text-gray-900">
                            51-75%
                          </Text>
                        </div>
                        <div className="flex flex-row justify-start items-start w-[18%] gap-1">
                          <div className="h-[12px] w-[12px] bg-red-300_03 rounded-[50%]" />
                          <Text size="xs" as="p" className="mt-0.5 !text-gray-900">
                            76-100%
                          </Text>
                        </div>
                        <div className="flex flex-row justify-start items-start w-[21%] gap-1">
                          <div className="h-[12px] w-[12px] bg-gray-400_01 rounded-[50%]" />
                          <Text size="xs" as="p" className="mt-0.5 !text-gray-900">
                            Sem dados
                          </Text>
                        </div>
                      </div>
                      <div className="flex flex-row justify-start items-center w-[21%] gap-1">
                        <Text size="s" as="p" className="w-[81%] !text-blue_gray-300_01 text-right">
                          Fonte: Portal ELLAS
                        </Text>
                        <Img src="images/img_elementos.svg" alt="elementos_seven" className="h-[14px] w-[14px]" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-row justify-center w-full mt-[61px] pt-5 bg-red-50">
                <div className="h-[702px] w-full relative">
                  <Img
                    src="images/img_fundo_ink_1.png"
                    alt="fundoinkone_one"
                    className="justify-center h-[702px] w-full left-0 bottom-0 right-0 top-0 m-auto object-cover absolute"
                  />
                  <div className="flex flex-col items-center justify-center w-full h-full gap-[43px] left-0 bottom-0 right-0 top-0 m-auto absolute">
                    <div className="flex flex-col items-start justify-start w-[33%] md:w-full gap-[23px]">
                      <Heading size="2xl" as="h2" className="text-center">
                        Dados em destaque
                      </Heading>
                      <Text as="p" className="!text-gray-900 !leading-5">
                        Selecione uma das perguntas mais pesquisadas para começar.
                      </Text>
                    </div>
                    <div className="flex flex-row md:flex-col justify-between items-start w-full md:gap-10">
                      <Button color="red_300_03" shape="circle" className="w-[38px] mt-[184px] md:mt-0">
                        <Img src="images/img_iconx18_white_a700.svg" />
                      </Button>
                      <div className="w-[80%]">
                        <Slider
                          autoPlay
                          autoPlayInterval={2000}
                          responsive={{ "0": { items: 1 }, "550": { items: 1 }, "1050": { items: 3 } }}
                          renderDotsItem={(props: DotsItem) => {
                            return props?.isActive ? (
                              <div className="h-[10px] w-[10px] mr-3.5 bg-gray-700" />
                            ) : (
                              <div className="h-[10px] w-[10px] mr-3.5 bg-white-A700" />
                            );
                          }}
                          activeIndex={sliderState}
                          onSlideChanged={(e: EventObject) => {
                            setSliderState(e?.item);
                          }}
                          ref={sliderRef}
                          className="flex gap-[47px] mx-[23.5px] md:ml-0"
                          items={[...Array(9)].map(() => (
                            <React.Fragment key={Math.random()}>
                              <div className="flex flex-col items-center justify-start pb-[21px] gap-[19px] mx-[23.5px] sm:pb-5 sm:mx-5 bg-white-A700 shadow-sm rounded-[20px]">
                                <Img
                                  src="images/img_mask_group.png"
                                  alt="image"
                                  className="w-full md:h-[203px] rounded-tl-[20px] rounded-tr-[20px] object-cover"
                                />
                                <div className="flex flex-col items-center justify-start w-[84%] md:w-full gap-[17px]">
                                  <Text size="3xl" as="p" className="!leading-5">
                                    Fatores de impacto nas lideranças femininas
                                  </Text>
                                  <Text as="p" className="!leading-5">
                                    Conheça os principais fatores que impactam as lideranças femininas na América
                                    Latina...
                                  </Text>
                                </div>
                                <Button
                                  size="sm"
                                  shape="round"
                                  rightIcon={<Img src="images/img_iconx18_white_a700.svg" alt="iconx18" />}
                                  className="gap-2.5 sm:px-5 font-medium min-w-[269px] sm:min-w-full"
                                >
                                  Saiba mais
                                </Button>
                              </div>
                            </React.Fragment>
                          ))}
                        />
                      </div>
                      <Button color="red_300_03" shape="circle" className="w-[38px] mt-[184px] md:mt-0">
                        <Img src="images/img_iconx18_white_a700.svg" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-row justify-center w-full">
                <div className="flex flex-col items-center justify-start w-full">
                  <Img src="images/img_group_22.svg" alt="image_one" className="h-[19px] z-[1]" />
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
                          alt="image_two"
                          className="h-[26px] mt-[15px] ml-1 md:ml-0"
                        />
                      </div>
                      <div className="flex flex-col items-end justify-start w-[74%] md:w-full mb-1">
                        <div className="flex flex-row justify-between items-start w-[81%] md:w-full">
                          <div className="flex flex-col items-center justify-start">
                            <Heading size="s" as="p" className="!text-white-A700 text-center">
                              Patrocínio
                            </Heading>
                            <Img
                              src="images/img_idrc_logo_branca.png"
                              alt="idrclogo_one"
                              className="w-full md:h-auto sm:w-full mt-[3px] object-cover"
                            />
                            <Heading size="s" as="p" className="mt-[27px] !text-white-A700 text-center">
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
