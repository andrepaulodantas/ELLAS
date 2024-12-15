import React from "react";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import { Text, Img, Heading, Button, Slider } from "../../components";
import AliceCarousel, { EventObject, DotsItem } from "react-alice-carousel";

export default function HomeOnePage() {
  // Slider states and refs for controlling the carousels
  const [sliderState, setSliderState] = React.useState(0);
  const sliderRef = React.useRef<AliceCarousel>(null);
  const [sliderState1, setSliderState1] = React.useState(0);
  const sliderRef1 = React.useRef<AliceCarousel>(null);
  const navigate = useNavigate();

  // Handles navigation to a given path
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
                      onClick={handleNavigation("/sobre")}
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
                      onClick={handleNavigation("/apoie-ellas")}
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
            <div className="h-[476px] w-full relative">
              <Img
                src="images/img_fundo_home_1.png"
                alt="Fundo Home One"
                className="justify-center h-[475px] w-full left-0 bottom-0 right-0 top-0 m-auto object-cover absolute"
              />
              <div className="flex flex-row justify-start w-[89%] h-full left-0 bottom-0 top-0 p-[37px] m-auto sm:p-5 bg-gradient absolute">
                <div className="flex flex-col items-end justify-start w-[60%] mt-[49px] ml-[3px]">
                  <Heading
                    size="2xl"
                    as="h1"
                    className="w-[73%] mr-[120px] md:mr-5 !leading-10"
                  >
                    Open Data for Gender Equity in Science and Technology in
                    Latin America
                  </Heading>
                  <Button
                    size="sm"
                    shape="round"
                    rightIcon={
                      <Img
                        src="images/img_iconx18_white_a700.svg"
                        alt="iconx18"
                      />
                    }
                    className="mt-3.5 gap-2.5 font-medium min-w-[38px]"
                    onClick={handleNavigation("/sobre")}
                  >
                    Learn more
                  </Button>
                  <div className="flex flex-row justify-start w-full mx-2.5 md:px-5 max-w-[723px]">
                    <div className="flex flex-row md:flex-col justify-start items-center w-full gap-2.5 p-0 md:gap-5 bg-white-A700 rounded-[29px] m-3">
                      <div className="flex flex-row sm:flex-col justify-start items-center w-[80%] md:w-full gap-2 sm:gap-5">
                        <div className="flex flex-row justify-start items-center w-[45%] sm:w-full gap-5 p-[11px]">
                          <Img
                            src="images/img_iconx18_1.svg"
                            alt="Ícone"
                            className="h-[18px] w-[18px] ml-[3px]"
                          />
                          <Text as="p" className="!text-blue_gray-300_01">
                            Choose a Category
                          </Text>
                          <Img
                            src="images/img_iconx18_2.svg"
                            alt="Ícone"
                            className="h-[18px] w-[18px] mr-[3px]"
                          />
                        </div>
                        <Text
                          size="5xl"
                          as="p"
                          className="!text-blue_gray-300_01 !font-normal"
                        >
                          |
                        </Text>
                        <div className="flex flex-row justify-start items-center w-[52%] sm:w-full gap-[21px] p-[11px]">
                          <Text
                            as="p"
                            className="ml-[3px] !text-blue_gray-300_01"
                          >
                            What do you want to ask the data?
                          </Text>
                          <Img
                            src="images/img_iconx18_2.svg"
                            alt="Ícone"
                            className="h-[18px] w-[18px] mr-[3px]"
                          />
                        </div>
                      </div>
                      <Button
                        color="red_300_03"
                        size="sm"
                        shape="round"
                        rightIcon={
                          <Img
                            src="images/img_iconx18_white_a700_18x18.svg"
                            alt="iconx18"
                          />
                        }
                        className="mr-1 gap-2.5 font-medium min-w-[131px]"
                      >
                        Resechar
                      </Button>
                    </div>
                  </div>
                  <div className="flex flex-row justify-between w-[50%] md:w-full mr-[-800px] md:mr-0">
                    <Button
                      color="white_A700_99"
                      shape="circle"
                      className="w-[508px] mt-[-100px] md:mt-0"
                    >
                      <Img
                        src="images/img_women_home01_1.png"
                        alt="Mulher Home 01"
                      />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <Heading size="2xl" as="h2" className="mt-[47px] text-center">
              Explore the data
            </Heading>
            <Text as="p" className="mt-3.5 !text-gray-900">
              Click on one of the categories to find data related to them.
            </Text>
            <div className="flex flex-row md:flex-col justify-between items-end w-full mt-[38px] md:gap-10 md:px-5 max-w-[1285px]">
              <Button
                color="teal_50"
                shape="circle"
                className="w-[38px] mb-[116px]"
              >
                <Img src="images/img_botao_icone_38px.svg" alt="Botão Ícone" />
              </Button>
              <div className="flex flex-row md:flex-col justify-start w-[80%] md:w-full gap-[46px] md:gap-5">
                <div className="h-[290px] w-[22%] md:w-full relative">
                  <div className="flex flex-col items-start justify-start w-[73%] top-[3%] right-0 left-0 m-auto absolute">
                    <div className="flex flex-col h-[24px] w-[24px] gap-px">
                      <Img
                        src="images/img_elementos_white_a700.svg"
                        alt="Elementos"
                        className="h-[24px] w-full"
                      />
                    </div>
                    <Heading
                      size="xl"
                      as="h3"
                      className="mt-2 !text-white-A700 text-center"
                    >
                      Policies
                    </Heading>
                    <Text
                      as="p"
                      className="mt-[27px] !text-white-A700 !leading-5"
                    >
                      Legislation and decrees that promote the participation of
                      women in STEM fields
                    </Text>
                  </div>
                  <div className="flex flex-col items-start justify-center w-full h-full gap-[22px] left-0 bottom-0 right-0 top-0 p-[30px] m-auto sm:p-5 bg-red-300_03 absolute rounded-[20px]">
                    <Img
                      src="images/img_iconx24.svg"
                      alt="Ícone"
                      className="h-[24px] w-[24px] mt-2.5"
                    />
                    <Heading size="xl" as="h4" className="!text-white-A700">
                      Policies
                    </Heading>
                    <Text
                      as="p"
                      className="mb-[52px] !text-white-A700 !leading-5"
                    >
                      Legislation and decrees that promote the participation of
                      women in STEM fields
                    </Text>
                  </div>
                </div>
                <div className="w-[74%]">
                  <Slider
                    autoPlay
                    autoPlayInterval={2000}
                    responsive={{
                      "0": { items: 1 },
                      "550": { items: 2 },
                      "1050": { items: 3 },
                    }}
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
                            alt="Ícone"
                            className="h-[24px] w-[24px] mt-2.5"
                          />
                          <Heading
                            size="xl"
                            as="h5"
                            className="!text-white-A700"
                          >
                            Iniciativas
                          </Heading>
                          <Text
                            as="p"
                            className="mb-[52px] !text-white-A700 !leading-5"
                          >
                            Events, programs, and other actions for the
                            insertion and retention of women in technology
                            careers
                          </Text>
                        </div>
                      </React.Fragment>
                    ))}
                  />
                </div>
              </div>
              <Button
                color="teal_50"
                shape="circle"
                className="w-[38px] mb-[116px]"
              >
                <Img src="images/img_botao_icone_38px.svg" alt="Botão Ícone" />
              </Button>
            </div>

            <div className="h-[1332px] w-full mt-[47px] relative">
              <div className="flex flex-col items-center justify-center w-full h-full left-0 bottom-0 right-0 top-0 m-auto absolute">
                <div className="flex flex-col items-end justify-start w-full">
                  <div className="flex flex-row justify-center w-full px-14 py-[62px] md:p-5 z-[1] bg-gray-50">
                    <div className="flex flex-col items-start justify-start w-[82%] mb-[21px] gap-[22px]">
                      <Heading size="2xl" as="h2" className="text-center">
                        Don't know where to start?{" "}
                      </Heading>
                      <Text
                        as="p"
                        className="w-[41%] ml-[3px] md:ml-0 !text-gray-900 !leading-5"
                      >
                        Select one of the most searched questions to get
                        started.
                      </Text>
                      <div className="w-full gap-12 grid-cols-2 md:grid-cols-1 md:gap-5 grid">
                        <div className="flex flex-col items-start justify-start w-full sm:w-full gap-2.5 p-5 bg-white-A700 shadow-sm rounded-[20px]">
                          <div className="flex flex-row justify-start items-center gap-[13px]">
                            <Img
                              src="images/img_iconx18_red_300_03.svg"
                              alt="Políticas"
                              className="h-[18px] w-[18px]"
                            />
                            <Heading as="p" className="!text-red-300_03">
                              Policies
                            </Heading>
                          </div>
                          <Text as="p" className="!text-gray-900 !leading-5">
                            What types of gender policies, processes or
                            practices exist in Latin America?
                          </Text>
                        </div>
                        <div className="flex flex-col items-start justify-start w-full sm:w-full gap-2.5 p-5 bg-white-A700 shadow-sm rounded-[20px]">
                          <div className="flex flex-row justify-start items-center gap-[13px]">
                            <Img
                              src="images/img_iconx18_deep_orange_200.svg"
                              alt="Iniciativas"
                              className="h-[18px] w-[18px]"
                            />
                            <Heading as="p" className="!text-deep_orange-200">
                              Initiatives
                            </Heading>
                          </div>
                          <Text as="p" className="!text-gray-900 !leading-5">
                            What is the social gender of the target audience
                            served by the initiatives in Latin America?
                          </Text>
                        </div>
                        <div className="flex flex-col items-start justify-start w-full sm:w-full gap-2.5 p-5 bg-white-A700 shadow-sm rounded-[20px]">
                          <div className="flex flex-row justify-start items-center gap-[13px]">
                            <Img
                              src="images/img_iconx18_red_300_03.svg"
                              alt="Políticas"
                              className="h-[18px] w-[18px]"
                            />
                            <Heading as="p" className="!text-red-300_03">
                              Policies
                            </Heading>
                          </div>
                          <Text as="p" className="!text-gray-900 !leading-5">
                            How are the identified/analyzed policies promoting
                            women's participation in STEM fields?
                          </Text>
                        </div>
                        <div className="flex flex-col items-start justify-start w-full sm:w-full gap-2.5 p-5 bg-white-A700 shadow-sm rounded-[20px]">
                          <div className="flex flex-row justify-start items-center gap-[13px]">
                            <Img
                              src="images/img_iconx18_pink_300.svg"
                              alt="Fatores"
                              className="h-[18px] w-[18px]"
                            />
                            <Heading as="p" className="!text-pink-300">
                              Factors
                            </Heading>
                          </div>
                          <Text as="p" className="!text-gray-900 !leading-5">
                            What are the types of impact of contextual factors
                            on Latin American institutions?
                          </Text>
                        </div>
                        <div className="flex flex-col items-start justify-start w-full sm:w-full gap-2.5 p-5 bg-white-A700 shadow-sm rounded-[20px]">
                          <div className="flex flex-row justify-start items-center gap-[13px]">
                            <Img
                              src="images/img_iconx18_deep_orange_200.svg"
                              alt="Iniciativas"
                              className="h-[18px] w-[18px]"
                            />
                            <Heading as="p" className="!text-deep_orange-200">
                              Initiatives
                            </Heading>
                          </div>
                          <Text as="p" className="!text-gray-900 !leading-5">
                            What initiatives have already been implemented or
                            are still in the design phase?
                          </Text>
                        </div>
                        <div className="flex flex-col items-start justify-start w-full sm:w-full gap-2.5 p-5 bg-white-A700 shadow-sm rounded-[20px]">
                          <div className="flex flex-row justify-start items-center gap-[13px]">
                            <Img
                              src="images/img_iconx18_pink_300.svg"
                              alt="Fatores"
                              className="h-[18px] w-[18px]"
                            />
                            <Heading as="p" className="!text-pink-300">
                              Factors
                            </Heading>
                          </div>
                          <Text as="p" className="!text-gray-900 !leading-5">
                            What are the negative contextual factors in the
                            activities of institutions in the countries
                            analyzed?
                          </Text>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="h-[404px] w-[60%] md:w-full mt-[-72px] relative">
                    <Img
                      src="images/img_vector.svg"
                      alt="Vector"
                      className="justify-center h-[404px] left-0 bottom-0 right-0 top-0 m-auto absolute"
                    />
                    <Heading
                      size="2xl"
                      as="h2"
                      className="w-[61%] bottom-[33%] right-0 left-0 m-auto !leading-[45px] absolute text-center"
                    >
                      Find the information you need on the ELLAS Portal{" "}
                    </Heading>
                  </div>
                </div>
                <div className="flex flex-row md:flex-col justify-start items-end w-full mt-[-332px] pl-[150px] pr-14 gap-[68px] py-[150px] md:gap-10 md:p-5 z-[1] bg-purple-50">
                  <div className="flex flex-row sm:flex-col justify-start items-center w-[35%] md:w-full mb-3 ml-[87px] gap-2 md:ml-5 sm:gap-5">
                    <div className="flex flex-row justify-start w-[70%] sm:w-full gap-2">
                      <div className="flex flex-row justify-start items-start w-[21%] gap-[3px]">
                        <div className="h-[14px] w-[14px] bg-pink-400 rounded-[50%]" />
                        <Text
                          size="s"
                          as="p"
                          className="mt-0.5 !text-black-900"
                        >
                          Policies
                        </Text>
                      </div>
                      <div className="flex flex-row justify-start items-start w-[19%] gap-1">
                        <div className="h-[14px] w-[14px] bg-orange-A700 rounded-[50%]" />
                        <Text
                          size="s"
                          as="p"
                          className="mt-0.5 !text-black-900"
                        >
                          Factors
                        </Text>
                      </div>
                      <div className="flex flex-row justify-start items-start w-[24%] gap-1">
                        <div className="h-[14px] w-[14px] bg-deep_purple-A200 rounded-[50%]" />
                        <Text
                          size="s"
                          as="p"
                          className="mt-0.5 !text-black-900"
                        >
                          Initiatives
                        </Text>
                      </div>
                      <div className="flex flex-row justify-start items-start w-[27%] gap-[3px]">
                        <div className="h-[14px] w-[14px] bg-amber-600 rounded-[50%]" />
                        <Text
                          size="s"
                          as="p"
                          className="mt-0.5 !text-black-900"
                        >
                          Secondary
                        </Text>
                      </div>
                    </div>
                    <div className="flex flex-row justify-start items-start w-[29%] sm:w-full gap-1">
                      <Text
                        size="s"
                        as="p"
                        className="w-[82%] !text-blue_gray-300_01 text-right"
                      >
                        Source: ELLAS Portal
                      </Text>
                      <Img
                        src="images/img_mask_group.png"
                        alt="Elementos"
                        className="h-[16px] w-[16px] mt-0.5"
                      />
                    </div>
                  </div>
                  <Button
                    size="sm"
                    shape="round"
                    rightIcon={
                      <Img
                        src="images/img_iconx18_white_a700.svg"
                        alt="iconx18"
                      />
                    }
                    className="mt-96 gap-2.5 md:mt-0 font-medium min-w-[138px]"
                  >
                    Learn more
                  </Button>
                </div>
              </div>
              <Text
                as="p"
                className="w-[36%] bottom-[16%] right-[13%] m-auto !leading-5 absolute"
              >
                <span className="text-gray-700">
                  <>
                    The lack of recent and reliable data is partly responsible
                    for gender gaps in science, technology, engineering and
                    mathematics (STEM) in Latin America. 
                    <br />
                    <br />
                    The ELLAS portal contributes to the generation of open data
                    between countries, especially but not limited to:
                    <br />
                    <br />
                  </>
                </span>
                <span className="text-gray-700 font-bold">
                  Evaluate policies and interventions to reduce the gender gap
                  in STEM
                </span>
                <span className="text-gray-700">
                  <>
                    , especially by increasing the number of women leaders in
                    universities, industries and public institutions.
                    <br />
                    <br />
                  </>
                </span>
                <span className="text-gray-700 font-bold">
                  Map factors that influence the career development of women in
                  STEM, documenting and analyzing successful and unsuccessful
                  initiatives to identify lessons learned.
                </span>
              </Text>
              <Img
                src="images/img_pie_chart_prancheta.svg"
                alt="Gráfico de Pizza"
                className="h-[374px] w-[375px] bottom-[17%] left-[17%] m-auto absolute"
              />
              <div className="h-[722px] w-[37%] sm:w-full bottom-0 left-0 m-auto absolute">
                <Img
                  src="images/img_group.svg"
                  alt="Imagem"
                  className="justify-center h-[722px] left-0 bottom-0 right-0 top-0 m-auto absolute"
                />
                <Heading
                  size="lg"
                  as="h6"
                  className="w-[27%] right-[4%] top-[39%] m-auto text-center absolute"
                >
                  <>
                    Categories of
                    <br />
                    Data in ELLAS
                  </>
                </Heading>
              </div>
            </div>
            <div className="flex flex-row md:flex-col justify-start items-start w-full mt-[67px] gap-12 md:gap-5 md:px-5 max-w-[1026px]">
              <div className="flex flex-col items-start justify-start w-[48%] md:w-full mt-[22px] md:mt-0">
                <Heading size="2xl" as="h2" className="text-center">
                  Latin America in focus!{" "}
                </Heading>
                <Text as="p" className="mt-[31px] !leading-5">
                  The ELLAS portal generates and disseminates open data
                  connected with a focus on Latin American countries. It emerged
                  from the union of institutions from Brazil, Bolivia and Peru.
                </Text>
                <Text as="p" className="mt-3.5 !leading-5">
                  An open data infrastructure makes it possible to map
                  information, visualize data, and improve collaboration between
                  education, government, and industry sectors seeking to reduce
                  the STEM gender gap in Latin America.
                </Text>
                <Button
                  size="sm"
                  shape="round"
                  rightIcon={
                    <Img
                      src="images/img_iconx18_white_a700.svg"
                      alt="iconx18"
                    />
                  }
                  className="mt-6 gap-2.5 font-medium min-w-[138px] sm:min-w-full"
                  onClick={handleNavigation("/sobre")}
                >
                  Learn more
                </Button>
              </div>
              <div className="flex flex-col items-center justify-start w-[48%] md:w-full p-3.5 bg-white-A700">
                <div className="flex flex-col items-center justify-start w-[99%] md:w-full mt-[5px] gap-[9px]">
                  <div className="flex flex-row sm:flex-col justify-between items-start w-[99%] md:w-full sm:gap-10">
                    <Img
                      src="images/img_map_latin_america.svg"
                      alt="Mapa América Latina"
                      className="h-[461px]"
                    />
                    <div className="flex flex-col items-center justify-start w-[4%] sm:w-full mt-1 sm:mt-0">
                      <div className="flex flex-col items-center justify-center w-full rounded-tl-[50%] rounded-tr-[50%] border-blue_gray-100_02 border border-solid">
                        <Img
                          src="images/img_elementos_blue_gray_100_02.svg"
                          alt="Elementos"
                          className="h-[14px] w-[14px] mt-1 mb-[3px]"
                        />
                      </div>
                      <div className="flex flex-col items-center justify-center w-full mt-[-1px] rounded-tl-[50%] rounded-tr-[50%] border-blue_gray-100_02 border border-solid">
                        <Img
                          src="images/img_elementos_blue_gray_100_02_14x14.svg"
                          alt="Elementos"
                          className="h-[14px] w-[14px] mt-[3px] mb-1"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-row justify-between items-center w-full">
                    <div className="flex flex-row justify-start w-[52%] gap-2">
                      <div className="flex flex-row justify-start items-start w-[17%] gap-[3px]">
                        <div className="h-[12px] w-[12px] bg-red-50_02 rounded-[50%]" />
                        <Text
                          size="xs"
                          as="p"
                          className="mt-0.5 !text-gray-900"
                        >
                          01-25%
                        </Text>
                      </div>
                      <div className="flex flex-row justify-start items-start w-[16%] gap-1">
                        <div className="h-[12px] w-[12px] bg-red-100_01 rounded-[50%]" />
                        <Text
                          size="xs"
                          as="p"
                          className="mt-0.5 !text-gray-900"
                        >
                          26-50%
                        </Text>
                      </div>
                      <div className="flex flex-row justify-start items-start w-[16%] gap-[3px]">
                        <div className="h-[12px] w-[12px] bg-red-200 rounded-[50%]" />
                        <Text
                          size="xs"
                          as="p"
                          className="mt-0.5 !text-gray-900"
                        >
                          51-75%
                        </Text>
                      </div>
                      <div className="flex flex-row justify-start items-start w-[18%] gap-1">
                        <div className="h-[12px] w-[12px] bg-red-300_03 rounded-[50%]" />
                        <Text
                          size="xs"
                          as="p"
                          className="mt-0.5 !text-gray-900"
                        >
                          76-100%
                        </Text>
                      </div>
                      <div className="flex flex-row justify-start items-start w-[21%] gap-1">
                        <div className="h-[12px] w-[12px] bg-gray-400_01 rounded-[50%]" />
                        <Text
                          size="xs"
                          as="p"
                          className="mt-0.5 !text-gray-900"
                        >
                          No data
                        </Text>
                      </div>
                    </div>
                    <div className="flex flex-row justify-start items-center w-[21%] gap-1">
                      <Text
                        size="s"
                        as="p"
                        className="w-[81%] !text-blue_gray-300_01 text-right"
                      >
                        Source: ELLAS Portal
                      </Text>
                      <Img
                        src="images/img_elementos.svg"
                        alt="Elementos"
                        className="h-[14px] w-[14px]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-row justify-center w-full mt-[61px] pt-5 bg-red-50">
              <div className="h-[702px] w-full relative">
                <Img
                  src="images/img_fundo_ink_1.png"
                  alt="Fundo Ink"
                  className="justify-center h-[702px] w-full left-0 bottom-0 right-0 top-0 m-auto object-cover absolute"
                />
                <div className="flex flex-col items-center justify-center w-full h-full gap-[43px] left-0 bottom-0 right-0 top-0 m-auto absolute">
                  <div className="flex flex-col items-start justify-start w-[33%] md:w-full gap-[23px]">
                    <Heading size="2xl" as="h2" className="text-center">
                      Featured Data{" "}
                    </Heading>
                    <Text as="p" className="!text-gray-900 !leading-5">
                      Select one of the most searched questions to get started.
                    </Text>
                  </div>
                  <div className="flex flex-row md:flex-col justify-between items-start w-full md:gap-10">
                    <Button
                      color="red_300_03"
                      shape="circle"
                      className="w-[38px] mt-[184px] md:mt-0"
                    >
                      <Img
                        src="images/img_iconx18_white_a700.svg"
                        alt="Ícone"
                      />
                    </Button>
                    <div className="w-[80%]">
                      <Slider
                        autoPlay
                        autoPlayInterval={2000}
                        responsive={{
                          "0": { items: 1 },
                          "550": { items: 1 },
                          "1050": { items: 3 },
                        }}
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
                                alt="Imagem"
                                className="w-full md:h-[203px] rounded-tl-[20px] rounded-tr-[20px] object-cover"
                              />
                              <div className="flex flex-col items-center justify-start w-[84%] md:w-full gap-[17px]">
                                <Text size="3xl" as="p" className="!leading-5">
                                  Impact factors on female leadership{" "}
                                </Text>
                                <Text as="p" className="!leading-5">
                                  Discover the main factors that impact female
                                  leadership in Latin America...
                                </Text>
                              </div>
                              <Button
                                size="sm"
                                shape="round"
                                rightIcon={
                                  <Img
                                    src="images/img_iconx18_white_a700.svg"
                                    alt="iconx18"
                                  />
                                }
                                className="gap-2.5 sm:px-5 font-medium min-w-[269px] sm:min-w-full"
                              >
                                Saiba mais
                              </Button>
                            </div>
                          </React.Fragment>
                        ))}
                      />
                    </div>
                    <Button
                      color="red_300_03"
                      shape="circle"
                      className="w-[38px] mt-[184px] md:mt-0"
                    >
                      <Img
                        src="images/img_iconx18_white_a700.svg"
                        alt="Ícone"
                      />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

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
          </div>
        </div>
      </div>
    </>
  );
}
