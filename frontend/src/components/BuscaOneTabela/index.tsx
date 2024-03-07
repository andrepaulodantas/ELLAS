import React from "react";
import { Img, Text } from "./..";

interface Props {
  className?: string;
  country?: string;
  name?: string;
  status?: string;
  startdate?: string;
  finishdate?: string;
  description?: React.ReactNode | string;
  description1?: React.ReactNode | string;
  description2?: React.ReactNode | string;
  description3?: React.ReactNode | string;
  p202220202021?: React.ReactNode | string;
}

export default function BuscaOneTabela({
  country = "Country",
  name = "Name",
  status = "Status",
  startdate = "Start date",
  finishdate = "Finish date",
  description = (
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
  ),
  description1 = (
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
  ),
  description2 = (
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
  ),
  description3 = (
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
  ),
  p202220202021 = (
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
  ),
  ...props
}: Props) {
  return (
    <div {...props}>
      <div className="flex flex-row md:flex-col justify-center w-full md:gap-5">
        <div className="flex flex-col items-center justify-start w-[99%] md:w-full">
          <div className="flex flex-row justify-center w-full">
            <div className="flex flex-row md:flex-col justify-start w-full gap-[74px] p-[9px] md:gap-10 bg-purple-100">
              <div className="flex flex-row justify-start items-center w-[10%] md:w-full ml-[9px] gap-[13px] md:ml-0">
                <Text as="p" className="!text-gray-900">
                  {country}
                </Text>
                <Img src="images/img_iconx18_13.svg" alt="iconxeighteen" className="h-[18px] w-[18px]" />
              </div>
              <div className="flex flex-row w-[32%] md:w-full gap-[142px] md:gap-10">
                <div className="flex flex-row justify-start items-center w-[24%] gap-[9px]">
                  <Text as="p" className="!text-gray-900">
                    {name}
                  </Text>
                  <Img src="images/img_iconx18_13.svg" alt="name_two" className="h-[18px] w-[18px]" />
                </div>
                <div className="flex flex-row justify-start items-center w-[24%] gap-1.5">
                  <Text as="p" className="!text-gray-900">
                    {status}
                  </Text>
                  <Img src="images/img_iconx18_13.svg" alt="iconxeighteen" className="h-[18px] w-[18px]" />
                </div>
              </div>
              <div className="flex flex-row justify-between w-[27%] md:w-full">
                <div className="flex flex-row justify-start items-center gap-[7px]">
                  <Text as="p" className="!text-gray-900">
                    {startdate}
                  </Text>
                  <Img src="images/img_iconx18_13.svg" alt="iconxeighteen" className="h-[18px] w-[18px]" />
                </div>
                <div className="flex flex-row justify-start items-center gap-2.5">
                  <Text as="p" className="!text-gray-900">
                    {finishdate}
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
                  {description}
                </Text>
                <Text as="p" className="w-[19%] h-full left-[19%] bottom-0 top-0 m-auto !leading-[41px] absolute">
                  {description1}
                </Text>
                <Text as="p" className="w-[7%] h-full left-[43%] bottom-0 top-0 m-auto !leading-[41px] absolute">
                  {description2}
                </Text>
                <Text as="p" className="w-[7%] h-full right-[35%] bottom-0 top-0 m-auto !leading-[41px] absolute">
                  {description3}
                </Text>
                <Text as="p" className="w-[7%] h-full right-[20%] bottom-0 top-0 m-auto !leading-[41px] absolute">
                  {p202220202021}
                </Text>
              </div>
              <div className="h-px w-full bg-deep_purple-200_26" />
            </div>
          </div>
          <div className="h-px w-full mt-[82px] bg-deep_purple-200_26" />
          <div className="h-px w-full mt-[164px] bg-deep_purple-200_26" />
        </div>
        <div className="flex flex-col items-center justify-start w-[2%] md:w-full">
          <div className="flex flex-col items-center justify-start w-full bg-blue_gray-50">
            <Img src="images/img_iconx18_gray_400.svg" alt="iconxeighteen" className="h-[22px]" />
            <div className="h-[64px] w-[56%] mt-0.5 bg-gray-400 rounded-[50%]" />
            <Img src="images/img_iconx18_gray_400_22x18.svg" alt="iconxeighteen" className="h-[22px] mt-[339px]" />
          </div>
        </div>
      </div>
    </div>
  );
}
