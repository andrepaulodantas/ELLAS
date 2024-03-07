import React from "react";
import { Helmet } from "react-helmet";
import { Button, Img, Heading, Text } from "../../components";

export default function EstilosPage() {
  return (
    <>
      <Helmet>
        <title>ELLAS</title>
        <meta name="description" content="Web site created using create-react-app" />
      </Helmet>
      <div className="flex flex-row justify-start w-full p-[34px] sm:p-5 bg-white-A700">
        <div className="flex flex-col items-start justify-start w-full mb-[25px] mx-auto md:px-5 max-w-[1793px]">
          <div className="flex flex-row md:flex-col justify-between w-[57%] md:w-full md:gap-10">
            <Text size="5xl" as="p" className="mt-px md:mt-0 !text-gray-900">
              Fontes
            </Text>
            <div className="flex flex-row sm:flex-col justify-between w-auto gap-[120px] sm:gap-10">
              <Text size="5xl" as="p" className="!text-gray-900">
                Paleta de Cores
              </Text>
              <Text size="5xl" as="p" className="!text-gray-900">
                Elementos Básicos UI
              </Text>
            </div>
          </div>
          <div className="flex flex-row justify-between w-[50%] md:w-full mt-[15px]">
            <Text as="p" className="mt-1.5 !text-blue_gray-300_01">
              Fonte Principal
            </Text>
            <Text as="p" className="!text-blue_gray-300_01">
              Botão Elementar
            </Text>
          </div>
          <div className="flex flex-row md:flex-col justify-start items-center w-full mt-1 gap-[33px] md:gap-5">
            <div className="flex flex-col items-center justify-start w-[26%] md:w-full gap-[26px]">
              <div className="flex flex-col items-start justify-start w-full">
                <div className="flex flex-row sm:flex-col justify-start items-center w-[85%] md:w-full gap-[11px] sm:gap-5">
                  <Text size="5xl" as="p" className="!text-gray-900 text-center !font-normal">
                    Roboto
                  </Text>
                  <div className="flex flex-row justify-start items-center w-[78%] sm:w-full gap-3 p-2 bg-gray-50 rounded-[17px]">
                    <Img
                      src="images/img_image_1.png"
                      alt="imageone_one"
                      className="w-[7%] md:h-auto sm:w-full ml-[7px] object-cover"
                    />
                    <Text size="xl" as="p" className="mt-0.5 mr-2 !text-blue_gray-300_01">
                      https://fonts.google.com/specimen/Roboto
                    </Text>
                  </div>
                </div>
                <Text size="4xl" as="p" className="w-[73%] mt-5 !text-gray-900">
                  <>
                    ABCDEFGHIJKLMNOPQRSTUVXWYZ
                    <br />
                    abcdefghijklmnopqrstuvxwyz
                    <br />
                    1234567890 $%&*@#!?
                  </>
                </Text>
                <Text as="p" className="mt-[26px] !text-blue_gray-300_01">
                  Fonte Secundária
                </Text>
                <div className="flex flex-row sm:flex-col justify-start items-center w-[99%] md:w-full mt-[18px] gap-3 sm:gap-5">
                  <Text size="5xl" as="p" className="!text-gray-900 !font-opensans text-center !font-normal">
                    Open Sans
                  </Text>
                  <div className="flex flex-row justify-start items-center w-[71%] sm:w-full gap-[11px] p-2 bg-gray-50 rounded-[17px]">
                    <Img
                      src="images/img_image_1.png"
                      alt="imageone_three"
                      className="w-[6%] md:h-auto sm:w-full ml-[7px] object-cover"
                    />
                    <Text size="xl" as="p" className="mt-0.5 mr-1.5 !text-blue_gray-300_01 text-center">
                      https://fonts.google.com/specimen/Open+Sans
                    </Text>
                  </div>
                </div>
                <Text size="4xl" as="p" className="w-[72%] mt-4 !text-gray-900 !font-opensans">
                  <>
                    ABCDEFGHIJKLMNOPQRSTUVXWYZ
                    <br />
                    abcdefghijklmnopqrstuvxwyz
                    <br />
                    1234567890 $%&*@#!?
                  </>
                </Text>
                <Text as="p" className="mt-4 !text-blue_gray-300_01 !font-rubik">
                  Estilos
                </Text>
                <div className="flex flex-col items-start justify-center w-full mt-3.5 gap-[13px] p-[17px] bg-gray-50 rounded-[10px]">
                  <Heading size="xl" as="h1" className="ml-1.5 md:ml-0 !text-gray-900 text-center">
                    Título
                  </Heading>
                  <Text as="p" className="mb-[3px] ml-1 md:ml-0 !text-blue_gray-300_01">
                    font-size: 24 pt | font-weight: 500 | line-height: 20
                  </Text>
                </div>
                <div className="flex flex-col items-start justify-center w-full mt-[26px] gap-[21px] p-[17px] bg-gray-50 rounded-[10px]">
                  <Text size="3xl" as="p" className="ml-1 md:ml-0 !text-gray-900">
                    Subtítulo
                  </Text>
                  <Text as="p" className="mb-[3px] ml-1 md:ml-0 !text-blue_gray-300_01">
                    font-size: 18 pt | font-weight: 500 | line-height: 20
                  </Text>
                </div>
              </div>
              <div className="flex flex-col items-start justify-center w-full gap-[15px] p-5 bg-gray-50 rounded-[10px]">
                <Text as="p" className="ml-0.5 md:ml-0 !text-gray-900">
                  Texto
                </Text>
                <Text as="p" className="ml-0.5 md:ml-0 !text-blue_gray-300_01">
                  font-size: 14 pt | font-weight: 400 | line-height: 20
                </Text>
                <Text as="p" className="ml-0.5 md:ml-0 !text-gray-900 !leading-[21px]">
                  <>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean eu nunc arcu. Aenean id risus sed
                    tortor gravida vehicula.
                    <br />
                    <br />
                    Proin ac elit in neque facilisis congue. Nulla tincidunt luctus ex, nec elementum ex consectetur id.
                    Vivamus in lorem porttitor, tempor nisi dictum, convallis lorem.{" "}
                  </>
                </Text>
              </div>
            </div>
            <div className="flex flex-col items-start justify-start w-[15%] md:w-full gap-[34px]">
              <div className="flex flex-col items-center justify-start w-full">
                <div className="flex flex-col items-center justify-start w-full gap-9">
                  <div className="flex flex-col w-full gap-[23px]">
                    <div className="flex flex-row justify-center items-center w-full">
                      <div className="h-[58px] w-[58px] bg-blue_gray-300" />
                      <Button
                        color="blue_gray_100_02"
                        size="xl"
                        className="!text-black-900 min-w-[80px] rounded-[10px]"
                      >
                        #C5D8E3
                      </Button>
                      <div className="h-[58px] w-[57px] bg-teal-50_01" />
                      <div className="h-[58px] w-[57px] bg-gray-50_01" />
                    </div>
                    <div className="flex flex-row justify-center items-center w-full">
                      <div className="h-[58px] w-[58px] bg-gray-800" />
                      <Button size="xl" className="min-w-[80px] rounded-[10px]">
                        #6C567B
                      </Button>
                      <div className="h-[58px] w-[57px] bg-deep_purple-300" />
                      <div className="h-[58px] w-[57px] bg-deep_purple-200" />
                    </div>
                    <div className="flex flex-row justify-center items-center w-full">
                      <div className="h-[58px] w-[58px] bg-pink-800" />
                      <Button color="red_300_02" size="xl" className="min-w-[80px] rounded-[10px]">
                        #C06C84
                      </Button>
                      <div className="h-[58px] w-[57px] bg-pink-300" />
                      <div className="h-[58px] w-[57px] bg-pink-200" />
                    </div>
                  </div>
                  <div className="flex flex-row justify-center items-center w-full">
                    <div className="h-[57px] w-[58px] bg-red-300_01" />
                    <Button color="red_300_03" size="xl" className="min-w-[80px] rounded-[10px]">
                      #F67280
                    </Button>
                    <div className="h-[57px] w-[57px] bg-pink-200_01" />
                    <div className="h-[57px] w-[58px] bg-red-100_01" />
                  </div>
                  <div className="flex flex-row justify-center items-center w-full">
                    <div className="h-[58px] w-[58px] bg-red-300" />
                    <Button color="deep_orange_200" size="xl" className="min-w-[80px] rounded-[10px]">
                      #F8B195
                    </Button>
                    <div className="h-[58px] w-[57px] bg-red-100" />
                    <div className="h-[58px] w-[57px] bg-red-50" />
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-center justify-start w-[63%] md:w-full">
                <div className="flex flex-col items-start justify-start w-full gap-[9px]">
                  <Text as="p" className="ml-[3px] md:ml-0 !text-blue_gray-300_01">
                    IBM Design - Daltonismo
                  </Text>
                  <div className="flex flex-row justify-start items-center w-[83%] md:w-full gap-[7px]">
                    <Img
                      src="images/img_image_5.png"
                      alt="imagefive_one"
                      className="w-[49%] md:h-auto sm:w-full object-cover"
                    />
                    <div className="flex flex-col items-start justify-start w-[46%] gap-[37px]">
                      <Text as="p" className="!text-blue-A200">
                        #648FFF
                      </Text>
                      <Text as="p" className="!text-deep_purple-A200">
                        #785EF0
                      </Text>
                      <Text as="p" className="!text-pink-400">
                        #DC267F
                      </Text>
                      <Text as="p" className="!text-orange-A700">
                        #FE6100
                      </Text>
                      <Text as="p" className="!text-amber-600">
                        #FFB000
                      </Text>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-start justify-start w-[57%] md:w-full gap-[15px]">
              <Button
                size="sm"
                shape="round"
                rightIcon={<Img src="images/img_iconx18_16.svg" alt="iconx18" />}
                className="ml-1.5 gap-2.5 md:ml-0 font-medium min-w-[96px] sm:min-w-full"
              >
                Text
              </Button>
              <div className="flex flex-col items-center justify-start w-full gap-[9px]">
                <div className="flex flex-row md:flex-col justify-between items-center w-full md:gap-10">
                  <div className="flex flex-row sm:flex-col justify-between w-[53%] md:w-full sm:gap-10">
                    <Text as="p" className="!text-blue_gray-300_01">
                      Botão Primário
                    </Text>
                    <div className="flex flex-row justify-between w-auto gap-[55px]">
                      <Text as="p" className="!text-blue_gray-300_01">
                        Botão Secundário
                      </Text>
                      <Text as="p" className="!text-blue_gray-300_01">
                        Botão Terciário
                      </Text>
                    </div>
                    <Text as="p" className="!text-blue_gray-300_01">
                      Links
                    </Text>
                  </div>
                  <div className="flex flex-row justify-between items-start w-[37%] md:w-full">
                    <Text as="p" className="mt-0.5 !text-blue_gray-300_01">
                      Botão para Abas
                    </Text>
                    <div className="flex flex-row justify-start gap-[9px]">
                      <Text size="lg" as="p" className="!text-blue_gray-300_01">
                        Botão Ícone 38px
                      </Text>
                      <Text size="lg" as="p" className="!text-blue_gray-300_01">
                        Botão Ícone 30px
                      </Text>
                    </div>
                  </div>
                </div>
                <div className="flex flex-row md:flex-col justify-start items-start w-full gap-[21px] md:gap-5">
                  <div className="flex flex-col items-start justify-start w-[48%] md:w-full mt-[3px] md:mt-0">
                    <div className="flex flex-row sm:flex-col w-full gap-[21px]">
                      <div className="flex flex-col items-center justify-start w-[31%] md:w-full gap-5 p-5 border-deep_purple-A200_01 border border-dashed rounded-[5px]">
                        <Button
                          size="sm"
                          shape="round"
                          rightIcon={<Img src="images/img_iconx18_16.svg" alt="iconx18" />}
                          className="w-full gap-2.5 font-medium"
                        >
                          Botão
                        </Button>
                        <Button
                          color="deep_purple_200"
                          size="sm"
                          shape="round"
                          rightIcon={<Img src="images/img_iconx18_16.svg" alt="iconx18" />}
                          className="w-full gap-2.5 font-medium"
                        >
                          Botão
                        </Button>
                        <Button
                          color="pink_800_02"
                          size="sm"
                          shape="round"
                          rightIcon={<Img src="images/img_iconx18_16.svg" alt="iconx18" />}
                          className="w-full gap-2.5 font-medium"
                        >
                          Botão
                        </Button>
                        <Button
                          color="blue_gray_100_02"
                          size="sm"
                          shape="round"
                          rightIcon={<Img src="images/img_iconx18_17.svg" alt="iconx18" />}
                          className="w-full gap-2.5 font-medium"
                        >
                          Botão
                        </Button>
                      </div>
                      <div className="flex flex-col items-center justify-start w-[31%] md:w-full gap-5 p-5 border-deep_purple-A200_01 border border-dashed rounded-[5px]">
                        <Button
                          size="sm"
                          variant="outline"
                          shape="round"
                          rightIcon={<Img src="images/img_iconx18_10.svg" alt="iconx18" />}
                          className="w-full gap-2.5"
                        >
                          Botão
                        </Button>
                        <Button
                          color="deep_purple_200"
                          size="sm"
                          shape="round"
                          rightIcon={<Img src="images/img_iconx18_16.svg" alt="iconx18" />}
                          className="w-full gap-2.5 font-medium"
                        >
                          Botão
                        </Button>
                        <Button
                          color="pink_800_01"
                          size="sm"
                          shape="round"
                          rightIcon={<Img src="images/img_iconx18_16.svg" alt="iconx18" />}
                          className="w-full gap-2.5 font-medium"
                        >
                          Botão
                        </Button>
                        <Button
                          color="blue_gray_100_02"
                          size="sm"
                          shape="round"
                          rightIcon={<Img src="images/img_iconx18_17.svg" alt="iconx18" />}
                          className="w-full gap-2.5 font-medium"
                        >
                          Botão
                        </Button>
                      </div>
                      <div className="flex flex-col items-center justify-start w-[31%] md:w-full gap-5 p-5 border-deep_purple-A200_01 border border-dashed rounded-[5px]">
                        <div className="flex flex-row justify-start items-center w-full gap-2.5 p-2.5">
                          <Text as="p" className="ml-2.5 text-center">
                            Botão
                          </Text>
                          <Img
                            src="images/img_iconx18_10.svg"
                            alt="iconxeighteen"
                            className="h-[18px] w-[18px] mr-2.5"
                          />
                        </div>
                        <Button
                          color="deep_purple_200"
                          size="sm"
                          shape="round"
                          rightIcon={<Img src="images/img_iconx18_16.svg" alt="iconx18" />}
                          className="w-full gap-2.5 font-medium"
                        >
                          Botão
                        </Button>
                        <Button
                          color="pink_800_01"
                          size="sm"
                          shape="round"
                          rightIcon={<Img src="images/img_iconx18_16.svg" alt="iconx18" />}
                          className="w-full gap-2.5 font-medium"
                        >
                          Botão
                        </Button>
                        <Button
                          color="blue_gray_100_02"
                          size="sm"
                          shape="round"
                          rightIcon={<Img src="images/img_iconx18_17.svg" alt="iconx18" />}
                          className="w-full gap-2.5 font-medium"
                        >
                          Botão
                        </Button>
                      </div>
                    </div>
                    <Text size="5xl" as="p" className="mt-[194px] ml-px md:ml-0 !text-gray-800_01">
                      Logo
                    </Text>
                    <Text as="p" className="mt-3.5 ml-px md:ml-0 !text-blue_gray-300_01">
                      Adaptada
                    </Text>
                    <Img
                      src="images/img_logo_ellas_portal_prancheta.png"
                      alt="logoellas_one"
                      className="w-[52%] md:h-auto sm:w-full mt-[5px] ml-px md:ml-0 object-cover"
                    />
                    <Text as="p" className="mt-[9px] ml-px md:ml-0 !text-blue_gray-300_01">
                      Original
                    </Text>
                    <Img
                      src="images/img_ellas_logo_v2_1.png"
                      alt="ellaslogov2one"
                      className="w-[50%] md:h-auto sm:w-full mt-[7px] ml-px md:ml-0 object-cover"
                    />
                  </div>
                  <div className="flex flex-col items-start justify-start w-[13%] md:w-full mt-[3px] gap-[11px] md:mt-0">
                    <div className="flex flex-col items-start justify-start w-full gap-7">
                      <div className="flex flex-col items-center justify-center w-full gap-[21px] p-[18px] border-deep_purple-A200_01 border border-dashed rounded-[5px]">
                        <div className="flex flex-row justify-center w-[96%] md:w-full">
                          <Text as="p" className="!text-deep_purple-200 text-center">
                            Botão de Link
                          </Text>
                        </div>
                        <div className="flex flex-row justify-center w-[96%] md:w-full">
                          <Text as="p" className="!text-red-300_03 text-center underline">
                            Botão de Link
                          </Text>
                        </div>
                        <div className="flex flex-row justify-center w-[96%] md:w-full">
                          <Text as="p" className="!text-red-300_02 text-center">
                            Botão de Link
                          </Text>
                        </div>
                      </div>
                      <Text as="p" className="!text-blue_gray-300_01">
                        Botão do Menu
                      </Text>
                    </div>
                    <div className="flex flex-col items-center justify-start w-[84%] md:w-full gap-5 p-5 border-deep_purple-A200_01 border border-dashed rounded-[5px]">
                      <div className="flex flex-row justify-start items-center w-full gap-[9px]">
                        <Heading as="h2">Menu</Heading>
                        <Img src="images/img_botao_icone_38px.svg" alt="iconxeighteen" className="h-[18px] w-[19px]" />
                      </div>
                      <div className="flex flex-row justify-start items-center w-full gap-[9px]">
                        <Heading as="h3" className="!text-red-300_03">
                          Menu
                        </Heading>
                        <Img
                          src="images/img_iconx18_red_300_03_18x19.svg"
                          alt="iconxeighteen"
                          className="h-[18px] w-[19px]"
                        />
                      </div>
                      <div className="flex flex-row justify-start items-center w-full gap-[9px]">
                        <Heading as="h4" className="!text-red-300_02">
                          Menu
                        </Heading>
                        <Img
                          src="images/img_iconx18_red_300_02.svg"
                          alt="iconxeighteen"
                          className="h-[18px] w-[19px]"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-center justify-start w-[18%] md:w-full mt-[3px] gap-5 p-5 md:mt-0 border-deep_purple-A200_01 border border-dashed rounded-[5px]">
                    <Button
                      color="white_A700"
                      size="lg"
                      shape="square"
                      rightIcon={<Img src="images/img_iconx18_10.svg" alt="iconx18" />}
                      className="w-full gap-2.5 sm:px-5 font-medium border-gray-700 border-b-2 border-solid"
                    >
                      Botão
                    </Button>
                    <Button
                      color="deep_purple_200"
                      size="lg"
                      shape="square"
                      rightIcon={<Img src="images/img_iconx18_16.svg" alt="iconx18" />}
                      className="w-full gap-2.5 sm:px-5 font-medium border-gray-700 border-b-2 border-solid"
                    >
                      Botão
                    </Button>
                    <Button
                      color="red_100_02"
                      size="lg"
                      shape="square"
                      rightIcon={<Img src="images/img_iconx18_10.svg" alt="iconx18" />}
                      className="w-full gap-2.5 sm:px-5 font-medium border-deep_orange-200 border-b-2 border-solid"
                    >
                      Botão
                    </Button>
                    <Button
                      color="teal_50"
                      size="lg"
                      shape="square"
                      rightIcon={<Img src="images/img_iconx18_17.svg" alt="iconx18" />}
                      className="w-full gap-2.5 sm:px-5 text-blue_gray-300_01 font-medium border-blue_gray-300_01 border-b-2 border-solid"
                    >
                      Botão
                    </Button>
                  </div>
                  <div className="flex flex-row w-[18%] md:w-full gap-4">
                    <div className="flex flex-col items-center justify-start w-[46%] gap-5 p-5 border-deep_purple-A200_01 border border-dashed rounded-[5px]">
                      <Button shape="circle" className="w-[38px]">
                        <Img src="images/img_iconx18_16.svg" />
                      </Button>
                      <Button color="deep_purple_200" shape="circle" className="w-[38px]">
                        <Img src="images/img_iconx18_16.svg" />
                      </Button>
                      <Button color="pink_800_01" shape="circle" className="w-[38px]">
                        <Img src="images/img_iconx18_16.svg" />
                      </Button>
                      <Button color="blue_gray_100_02" shape="circle" className="w-[38px]">
                        <Img src="images/img_iconx18_17.svg" />
                      </Button>
                    </div>
                    <div className="flex flex-col items-center justify-start w-[46%] mb-[18px] gap-3.5 p-5 border-deep_purple-A200_01 border border-dashed rounded-[5px]">
                      <Button shape="square" className="w-[38px]">
                        <Img src="images/img_property_1_default.svg" />
                      </Button>
                      <Button shape="square" className="w-[38px]">
                        <Img src="images/img_property_1_default.svg" />
                      </Button>
                      <Button shape="square" className="w-[38px]">
                        <Img src="images/img_property_1_default.svg" />
                      </Button>
                      <Button shape="square" className="w-[38px]">
                        <Img src="images/img_property_1_desabilitado.svg" />
                      </Button>
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
