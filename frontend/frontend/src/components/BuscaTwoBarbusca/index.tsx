import React from "react";
import { Img, Text } from "./..";

interface Props {
  className?: string;
  brasil?: string;
  peru?: string;
  bolivia?: string;
  argentina?: string;
  zero?: string;
  five?: string;
  ten?: string;
  fifteen?: string;
  twenty?: string;
  seventeen?: string;
  thirteen?: string;
  six?: string;
  four?: string;
  fonteinep?: string;
}

export default function BuscaTwoBarbusca({
  brasil = "Brasil",
  peru = "Peru",
  bolivia = "Bolivia",
  argentina = "Argentina",
  zero = "0",
  five = "05",
  ten = "10",
  fifteen = "15",
  twenty = "20",
  seventeen = "17",
  thirteen = "13",
  six = "06",
  four = "04",
  fonteinep = "Fonte: INEP, UNESCO e Dados Secundários da plataforma ELLAS",
  ...props
}: Props) {
  return (
    <div {...props}>
      <div className="flex flex-row justify-end w-[99%] md:w-full mr-[7px]">
        <div className="flex flex-row md:flex-col justify-end items-end w-full md:gap-5">
          <div className="flex flex-col items-end justify-start w-[7%] md:w-full mb-[5px] gap-10">
            <Text size="xl" as="p" className="text-right">
              {brasil}
            </Text>
            <Text size="xl" as="p" className="text-right">
              {peru}
            </Text>
            <Text size="xl" as="p" className="text-right">
              {bolivia}
            </Text>
            <Text size="xl" as="p" className="text-right">
              {argentina}
            </Text>
          </div>
          <div className="h-[218px] w-px md:w-full md:h-px ml-3 md:ml-0 z-[1] bg-blue_gray-100_01" />
          <div className="flex flex-col items-start justify-start w-[93%] md:w-full ml-[-1px] md:ml-0">
            <div className="flex flex-row justify-between w-[88%] md:w-full">
              <Text size="md" as="p">
                {zero}
              </Text>
              <Text size="md" as="p" className="h-[12px]">
                {five}
              </Text>
              <Text size="md" as="p" className="h-[12px]">
                {ten}
              </Text>
              <Text size="md" as="p" className="h-[12px]">
                {fifteen}
              </Text>
              <Text size="md" as="p" className="h-[12px]">
                {twenty}
              </Text>
            </div>
            <div className="h-px w-full mt-[7px] rotate-[-180deg] bg-blue_gray-100_01" />
            <div className="flex flex-row md:flex-col justify-start items-center w-[81%] md:w-full mt-[22px] gap-2 md:gap-5">
              <div className="h-[30px] w-[97%] bg-deep_purple-200" />
              <Text size="xl" as="p">
                {seventeen}
              </Text>
            </div>
            <div className="flex flex-row sm:flex-col justify-start items-center w-[60%] md:w-full mt-[25px] gap-3 sm:gap-5">
              <div className="h-[30px] w-[95%] bg-deep_purple-200" />
              <Text size="xl" as="p">
                {thirteen}
              </Text>
            </div>
            <div className="flex flex-row justify-start items-center w-[32%] md:w-full mt-[25px] gap-3">
              <div className="h-[30px] w-[91%] bg-deep_purple-200" />
              <Text size="xl" as="p">
                {six}
              </Text>
            </div>
            <div className="flex flex-row justify-start items-center w-[20%] md:w-full mt-[25px] gap-3">
              <div className="h-[30px] w-[84%] bg-deep_purple-200" />
              <Text size="xl" as="p" className="h-[15px]">
                {four}
              </Text>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-row justify-start items-center w-[30%] md:w-full gap-1">
        <Text size="s" as="p" className="!text-blue_gray-300_01 text-right">
          {fonteinep}
        </Text>
        <Img src="images/img_iconx18_15.svg" alt="iconxeighteen" className="h-[18px] w-[18px]" />
      </div>
    </div>
  );
}
