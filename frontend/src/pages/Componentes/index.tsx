import React from "react";
import { Helmet } from "react-helmet";
import { Heading, Input, Img, Text } from "../../components";

export default function ComponentesPage() {
  return (
    <>
      <Helmet>
        <title>ELLAS</title>
        <meta name="description" content="Web site created using create-react-app" />
      </Helmet>
      <div className="flex flex-row justify-start w-full p-[50px] md:p-5 bg-white-A700">
        <div className="flex flex-row md:flex-col justify-start items-start w-[52%] mt-5 mb-[307px] gap-9 md:gap-5">
          <div className="flex flex-col w-[27%] md:w-full gap-5 p-5 border-deep_purple-A200_01 border border-dashed rounded-[5px]">
            <div className="flex flex-col items-start justify-center w-full gap-[17px] p-[30px] sm:p-5 bg-red-300_03 rounded-[20px]">
              <Img src="images/img_iconx24.svg" alt="políticas_one" className="h-[24px] w-[24px] mt-2.5" />
              <Heading size="xl" as="h1" className="!text-white-A700">
                Políticas
              </Heading>
              <Text as="p" className="mb-2.5 !text-white-A700 !leading-5">
                Legislações e decretos que promovem a participação de mulheres nas áreas STEM
              </Text>
            </div>
            <div className="flex flex-col items-start justify-center w-full gap-[17px] p-[30px] sm:p-5 bg-red-300_01 rounded-[20px]">
              <Img src="images/img_iconx24.svg" alt="iconxtwentyfour" className="h-[24px] w-[24px] mt-2.5" />
              <Heading size="xl" as="h2" className="!text-white-A700">
                Políticas
              </Heading>
              <Text as="p" className="mb-2.5 !text-white-A700 !leading-5">
                Legislações e decretos que promovem a participação de mulheres nas áreas STEM
              </Text>
            </div>
          </div>
          <div className="flex flex-col items-start justify-start w-[70%] md:w-full gap-9">
            <div className="flex flex-col w-[77%] gap-5 p-5 border-deep_purple-A200_01 border border-dashed rounded-[5px]">
              <div className="flex flex-col items-start justify-center w-full sm:w-full gap-[11px] p-5 bg-white-A700 shadow-xs rounded-[20px]">
                <div className="flex flex-row justify-start items-center gap-[13px]">
                  <Img src="images/img_iconx18_red_300_03.svg" alt="políticas_one" className="h-[18px] w-[18px]" />
                  <Heading as="h2" className="!text-red-300_03">
                    Políticas
                  </Heading>
                </div>
                <Text as="p" className="!text-gray-900 !leading-5">
                  Que tipos de políticas, processos ou práticas de gênero existem na América Latina?
                </Text>
              </div>
              <div className="flex flex-col items-start justify-center w-full sm:w-full gap-[11px] p-5 bg-red-50_01 shadow-xs rounded-[20px]">
                <div className="flex flex-row justify-start items-center gap-[13px]">
                  <Img src="images/img_iconx18_red_300_03.svg" alt="iconxeighteen" className="h-[18px] w-[18px]" />
                  <Heading as="h3" className="!text-red-300_03">
                    Políticas
                  </Heading>
                </div>
                <Text as="p" className="!text-gray-900 !leading-5">
                  Que tipos de políticas, processos ou práticas de gênero existem na América Latina?
                </Text>
              </div>
            </div>
            <div className="flex flex-row md:flex-col justify-between items-start w-full md:gap-10">
              <div className="flex flex-row justify-center w-[48%] md:w-full p-5 border-deep_purple-A200_01 border border-dashed rounded-[5px]">
                <div className="flex flex-col w-full gap-5">
                  <div className="flex flex-row justify-start items-center w-full gap-[15px] p-[11px] border-blue_gray-100_02 border border-solid bg-white-A700 rounded-[10px]">
                    <Img
                      src="images/img_iconx18_blue_gray_300_01.svg"
                      alt="email_one"
                      className="h-[18px] w-[18px] ml-[3px]"
                    />
                    <Text as="p" className="!text-blue_gray-300_01">
                      E-mail
                    </Text>
                  </div>
                  <div className="flex flex-row justify-start items-center w-full gap-[15px] p-[11px] border-gray-700 border border-solid bg-white-A700 rounded-[10px]">
                    <Img
                      src="images/img_iconx18_gray_900.svg"
                      alt="iconxeighteen"
                      className="h-[18px] w-[18px] ml-[3px]"
                    />
                    <Text as="p" className="!text-gray-900">
                      laura.paiva@gmail.com
                    </Text>
                  </div>
                  <div className="flex flex-row justify-between w-full p-[11px] border-red-300_03 border border-solid bg-white-A700 rounded-[10px]">
                    <div className="flex flex-row justify-start items-center ml-1 gap-[15px]">
                      <Img
                        src="images/img_iconx18_blue_gray_300_01.svg"
                        alt="iconxeighteen"
                        className="h-[18px] w-[18px] mt-px"
                      />
                      <Text as="p" className="!text-blue_gray-300_01">
                        E-mail
                      </Text>
                    </div>
                    <Img
                      src="images/img_iconx18_red_300_03_18x18.svg"
                      alt="iconxeighteen"
                      className="h-[18px] w-[18px] mr-1"
                    />
                  </div>
                  <div className="flex flex-row justify-between w-full p-[11px] border-red-300_03 border border-solid bg-white-A700 rounded-[10px]">
                    <div className="flex flex-row justify-start items-center ml-1 gap-[15px]">
                      <Img src="images/img_iconx18_3.svg" alt="iconxeighteen" className="h-[18px] w-[18px] mt-px" />
                      <Text as="p" className="!text-red-300_03">
                        E-mail
                      </Text>
                    </div>
                    <Img
                      src="images/img_iconx18_red_300_03_18x18.svg"
                      alt="iconxeighteen"
                      className="h-[18px] w-[18px] mr-1"
                    />
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-start justify-center w-[48%] md:w-full p-[17px] border-deep_purple-A200_01 border border-dashed rounded-[5px]">
                <Input
                  shape="round"
                  name="propertyone_one"
                  placeholder="Senha"
                  prefix={<Img src="images/img_iconx18_blue_gray_300_01_18x18.svg" alt="iconx18" />}
                  suffix={<Img src="images/img_iconx18_18x18.svg" alt="iconx18" />}
                  className="w-[98%] sm:w-full mt-0.5 ml-0.5 gap-[15px] md:ml-0 border-blue_gray-100_02"
                />
                <div className="flex flex-col items-center justify-start w-[98%] md:w-full mt-5 ml-0.5 gap-5 md:ml-0">
                  <Input
                    size="sm"
                    shape="round"
                    name="propertyone"
                    prefix={<Img src="images/img_elementos_gray_900.svg" alt="elementos" />}
                    suffix={<Img src="images/img_iconx18_gray_900_18x18.svg" alt="iconx18" />}
                    className="w-full sm:w-full gap-[35px] border-gray-900"
                  />
                  <Input
                    shape="round"
                    name="property1nao"
                    placeholder="Senha"
                    prefix={<Img src="images/img_iconx18_blue_gray_300_01_18x18.svg" alt="iconx18" />}
                    suffix={<Img src="images/img_iconx18_red_300_03_18x18.svg" alt="iconx18" />}
                    className="w-full sm:w-full gap-[15px] border-red-300_03"
                  />
                  <div className="flex flex-row justify-center w-full">
                    <Input
                      shape="round"
                      name="iconxEighteen"
                      placeholder="Senha"
                      prefix={<Img src="images/img_iconx18_4.svg" alt="iconx18" />}
                      suffix={<Img src="images/img_iconx18_red_300_03_18x18.svg" alt="iconx18" />}
                      className="w-full sm:w-full gap-[15px] !text-red-300_03 border-red-300_03"
                    />
                  </div>
                </div>
                <Heading size="xs" as="h4" className="mt-[7px] ml-[11px] md:ml-0 !text-red-300_03">
                  Senha ou e-mail incorretos!
                </Heading>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
