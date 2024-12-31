import React from "react";
import { Img, Text } from "./..";

interface Props {
  className?: string;
  twentyfive?: string;
  twenty?: string;
  fifteen?: string;
  ten?: string;
  five?: string;
  zero?: string;
  zipcode?: string;
  zipcode1?: string;
  zipcode2?: string;
  zipcode3?: string;
  zipcode4?: string;
  zipcode5?: string;
  zipcode6?: string;
  zipcode7?: string;
  zipcode8?: string;
  zipcode9?: string;
  zipcode10?: string;
  zipcode11?: string;
  bolivia?: string;
  peru?: string;
  brasil?: string;
  argentina?: string;
  fonteinep?: string;
}

export default function BuscaTwoOneLinebusca({
  twentyfive = "25",
  twenty = "20",
  fifteen = "15",
  ten = "10",
  five = "5",
  zero = "0",
  zipcode = "2012",
  zipcode1 = "2013",
  zipcode2 = "2014",
  zipcode3 = "2015",
  zipcode4 = "2016",
  zipcode5 = "2017",
  zipcode6 = "2018",
  zipcode7 = "2019",
  zipcode8 = "2020",
  zipcode9 = "2021",
  zipcode10 = "2022",
  zipcode11 = "2023",
  bolivia = "Bolivia",
  peru = "Peru",
  brasil = "Brasil",
  argentina = "Argentina",
  fonteinep = "Fonte: INEP, UNESCO e Dados Secundários da plataforma ELLAS",
  ...props
}: Props) {
  return (
    <div {...props}>
      <div className="flex flex-col items-center justify-start w-full gap-[18px]">
        <div className="flex flex-row justify-center w-full md:px-5 max-w-[858px]">
          <div className="flex flex-row md:flex-col justify-start items-center w-full gap-[7px] md:gap-5">
            <div className="flex flex-col items-end justify-start w-[2%] md:w-full gap-9">
              <Text size="md" as="p" className="h-[12px] text-right">
                {twentyfive}
              </Text>
              <Text size="md" as="p" className="h-[12px] text-right">
                {twenty}
              </Text>
              <Text size="md" as="p" className="h-[12px] text-right">
                {fifteen}
              </Text>
              <Text size="md" as="p" className="h-[12px] text-right">
                {ten}
              </Text>
              <Text size="md" as="p" className="text-right">
                {five}
              </Text>
              <Text size="md" as="p" className="text-right">
                {zero}
              </Text>
            </div>
            <div className="flex flex-col items-center justify-start w-[98%] md:w-full">
              <div className="flex flex-row md:flex-col justify-start items-center w-full gap-[15px] md:gap-5">
                <div className="h-[286px] w-px md:w-full md:h-px mb-px bg-blue_gray-100_01" />
                <div className="h-[209px] w-[98%] md:w-full relative">
                  <div className="flex flex-col items-center justify-start w-full bottom-0 right-0 left-0 m-auto absolute">
                    <div className="flex flex-col items-end justify-start w-full z-[1]">
                      <div className="h-[9px] w-[9px] mr-36 md:mr-5 z-[1] bg-blue-A200 rounded" />
                      <div className="flex flex-row md:flex-col justify-end items-center w-full mt-[-8px] md:gap-5">
                        <div className="h-[9px] w-[9px] z-[1] bg-blue-A200 rounded" />
                        <div className="h-[127px] w-full ml-[-2px] md:ml-0 relative">
                          <Img
                            src="images/img_vector_8.svg"
                            alt="vectoreight_one"
                            className="justify-center h-[127px] left-0 bottom-0 right-0 top-0 m-auto absolute"
                          />
                          <div className="flex flex-col items-center justify-start w-[38%] gap-0.5 right-[9%] top-[6%] m-auto absolute">
                            <div className="flex flex-row justify-between w-full">
                              <div className="h-[9px] w-[9px] mt-[7px] mb-[5px] bg-blue-A200 rounded" />
                              <div className="h-[9px] w-[9px] mb-[5px] bg-blue-A200 rounded" />
                              <div className="h-[9px] w-[9px] mb-[5px] bg-blue-A200 rounded" />
                              <div className="h-[9px] w-[9px] bg-orange-A700 rounded" />
                              <div className="h-[9px] w-[9px] mb-3 bg-orange-A700 rounded" />
                            </div>
                            <div className="h-[9px] w-[9px] bg-orange-A700 rounded" />
                            <div className="flex flex-row justify-between w-[27%] md:w-full">
                              <div className="h-[9px] w-[9px] mt-px bg-orange-A700 rounded" />
                              <div className="h-[9px] w-[9px] bg-orange-A700 rounded" />
                            </div>
                          </div>
                          <div className="flex flex-col items-center justify-start w-[2%] left-[45%] top-[33%] m-auto absolute">
                            <div className="h-[9px] w-[9px] bg-orange-A700 rounded" />
                            <div className="h-[9px] w-[9px] mt-[-6px] bg-blue-A200 rounded" />
                          </div>
                          <div className="flex flex-col items-end justify-start w-[29%] bottom-[7%] left-[8%] m-auto absolute">
                            <div className="h-[9px] w-[9px] bg-orange-A700 rounded" />
                            <div className="h-[9px] w-[9px] mt-[17px] mr-[77px] md:mr-5 z-[1] bg-orange-A700 rounded" />
                            <div className="flex flex-col items-start justify-start w-full mt-[-4px]">
                              <div className="flex flex-row justify-between w-full">
                                <div className="h-[9px] w-[9px] bg-blue-A200 rounded" />
                                <div className="h-[9px] w-[9px] bg-blue-A200 rounded" />
                                <div className="h-[9px] w-[9px] bg-blue-A200 rounded" />
                                <div className="h-[9px] w-[9px] bg-blue-A200 rounded" />
                              </div>
                              <div className="h-[9px] w-[9px] mt-2.5 ml-[69px] md:ml-5 bg-orange-A700 rounded" />
                              <div className="h-[9px] w-[9px] mt-[5px] bg-orange-A700 rounded" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-center justify-start w-full mt-[-64px]">
                      <div className="h-[112px] w-full z-[1] relative">
                        <Img
                          src="images/img_vector_5.svg"
                          alt="vectorfive_one"
                          className="justify-center h-[112px] left-0 bottom-0 right-0 top-0 m-auto absolute"
                        />
                        <div className="flex flex-row justify-between w-[29%] h-max left-[17%] bottom-0 top-0 m-auto absolute">
                          <div className="h-[9px] w-[9px] bg-pink-400 rounded" />
                          <div className="h-[9px] w-[9px] bg-pink-400 rounded" />
                          <div className="h-[9px] w-[9px] bg-pink-400 rounded" />
                          <div className="h-[9px] w-[9px] bg-pink-400 rounded" />
                        </div>
                        <div className="h-[9px] w-[9px] right-[45%] top-[29%] m-auto bg-pink-400 absolute rounded" />
                      </div>
                      <div className="flex flex-row md:flex-col justify-center items-center w-full mt-[-52px] md:gap-5">
                        <div className="flex flex-col items-center justify-start w-[2%] md:w-full gap-[38px]">
                          <div className="h-[9px] w-[9px] bg-orange-A700 rounded" />
                          <div className="h-[9px] w-[9px] bg-amber-600 rounded" />
                        </div>
                        <div className="h-[46px] w-full ml-[-4px] md:ml-0 relative">
                          <Img
                            src="images/img_vector_7.svg"
                            alt="vectorseven_one"
                            className="justify-center h-[46px] left-0 bottom-0 right-0 top-0 m-auto absolute"
                          />
                          <div className="flex flex-col items-start justify-start w-[47%] gap-[5px] left-[9%] top-[4%] m-auto absolute">
                            <div className="flex flex-row justify-between w-full">
                              <div className="h-[9px] w-[9px] mt-[11px] bg-pink-400 rounded" />
                              <div className="h-[9px] w-[9px] bg-amber-600 rounded" />
                              <div className="h-[9px] w-[9px] bg-amber-600 rounded" />
                              <div className="h-[9px] w-[9px] bg-amber-600 rounded" />
                              <div className="h-[9px] w-[9px] mb-[5px] bg-amber-600 rounded" />
                              <div className="h-[9px] w-[9px] mb-3 bg-amber-600 rounded" />
                            </div>
                            <div className="h-[9px] w-[9px] bg-amber-600 rounded" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end justify-start w-full top-0 right-0 left-0 m-auto absolute">
                    <div className="flex flex-col items-end justify-start w-full">
                      <div className="flex flex-col items-center justify-start w-[2%] md:w-full gap-4 z-[1]">
                        <div className="h-[9px] w-[9px] bg-blue-A200 rounded" />
                        <div className="h-[9px] w-[9px] bg-orange-A700 rounded" />
                      </div>
                      <div className="flex flex-row md:flex-col justify-end items-center w-full mt-[-30px] md:gap-5">
                        <div className="h-[106px] w-full relative">
                          <Img
                            src="images/img_vector_6.svg"
                            alt="vectorsix_one"
                            className="justify-center h-[106px] left-0 bottom-0 right-0 top-0 m-auto absolute"
                          />
                          <div className="flex flex-col items-end justify-start w-[20%] h-max gap-[65px] right-[8%] bottom-0 top-0 m-auto absolute">
                            <div className="h-[9px] w-[9px] bg-blue-A200 rounded" />
                            <div className="flex flex-row justify-between w-full">
                              <div className="h-[9px] w-[9px] mt-[7px] bg-pink-400 rounded" />
                              <div className="h-[9px] w-[9px] bg-pink-400 rounded" />
                              <div className="h-[9px] w-[9px] bg-pink-400 rounded" />
                            </div>
                          </div>
                        </div>
                        <div className="h-[9px] w-[9px] ml-[-6px] md:ml-0 z-[1] bg-pink-400 rounded" />
                      </div>
                    </div>
                    <div className="h-[9px] w-[9px] mt-[-6px] mr-[295px] md:mr-5 z-[1] bg-pink-400 rounded" />
                  </div>
                  <div className="flex flex-row justify-between w-[38%] bottom-[20%] right-0 m-auto absolute">
                    <div className="h-[9px] w-[9px] bg-amber-600 rounded" />
                    <div className="h-[9px] w-[9px] bg-amber-600 rounded" />
                    <div className="h-[9px] w-[9px] bg-amber-600 rounded" />
                    <div className="h-[9px] w-[9px] bg-amber-600 rounded" />
                    <div className="h-[9px] w-[9px] bg-amber-600 rounded" />
                  </div>
                </div>
              </div>
              <div className="h-px w-full mt-[-2px] z-[1] rotate-[-180deg] bg-blue_gray-100_01" />
              <div className="flex flex-row justify-between w-[99%] md:w-full mt-[9px]">
                <Text size="md" as="p">
                  {zipcode}
                </Text>
                <Text size="md" as="p">
                  {zipcode1}
                </Text>
                <Text size="md" as="p">
                  {zipcode2}
                </Text>
                <Text size="md" as="p">
                  {zipcode3}
                </Text>
                <Text size="md" as="p">
                  {zipcode4}
                </Text>
                <Text size="md" as="p">
                  {zipcode5}
                </Text>
                <Text size="md" as="p">
                  {zipcode6}
                </Text>
                <Text size="md" as="p">
                  {zipcode7}
                </Text>
                <Text size="md" as="p">
                  {zipcode8}
                </Text>
                <Text size="md" as="p">
                  {zipcode9}
                </Text>
                <Text size="md" as="p">
                  {zipcode10}
                </Text>
                <Text size="md" as="p">
                  {zipcode11}
                </Text>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-row sm:flex-col justify-between items-center w-full sm:gap-10">
          <div className="flex flex-row justify-between w-[39%] sm:w-full">
            <div className="flex flex-row justify-start items-start w-[15%] gap-[5px]">
              <div className="h-[19px] w-[19px] bg-pink-400 rounded-[9px]" />
              <Text size="s" as="p" className="mt-1 !text-black-900">
                {bolivia}
              </Text>
            </div>
            <div className="flex flex-row justify-start items-start w-[13%] gap-1.5">
              <div className="h-[19px] w-[19px] bg-orange-A700 rounded-[9px]" />
              <Text size="s" as="p" className="mt-1 !text-black-900">
                {peru}
              </Text>
            </div>
            <div className="flex flex-row justify-start items-start w-[14%] gap-1.5">
              <div className="h-[19px] w-[19px] bg-blue-A200 rounded-[9px]" />
              <Text size="s" as="p" className="mt-1 !text-black-900">
                {brasil}
              </Text>
            </div>
            <div className="flex flex-row justify-start items-center w-[18%] gap-1.5">
              <div className="h-[19px] w-[19px] bg-amber-600 rounded-[9px]" />
              <Text size="s" as="p" className="!text-black-900">
                {argentina}
              </Text>
            </div>
          </div>
          <div className="flex flex-row justify-start items-center gap-1">
            <Text size="s" as="p" className="!text-blue_gray-300_01 text-right">
              {fonteinep}
            </Text>
            <Img src="images/img_iconx18_15.svg" alt="iconxeighteen" className="h-[18px] w-[18px]" />
          </div>
        </div>
      </div>
    </div>
  );
}
