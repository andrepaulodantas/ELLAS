import React from "react";
import { Img, Text } from "./..";

interface Props {
  className?: string;
  p01twentyfive?: string;
  p26fifty?: string;
  p51seventyfive?: string;
  seventysixthousandonehundred?: string;
  semdados?: string;
  fonteportalOne?: string;
}

export default function HomeOneMapdados({
  p01twentyfive = "01-25%",
  p26fifty = "26-50%",
  p51seventyfive = "51-75%",
  seventysixthousandonehundred = "76-100%",
  semdados = "Sem dados",
  fonteportalOne = "Fonte: Portal ELLAS",
  ...props
}: Props) {
  return (
    <div {...props}>
      <div className="flex flex-col items-center justify-start w-full mt-[5px] gap-[9px] md:px-5 max-w-[455px]">
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
                {p01twentyfive}
              </Text>
            </div>
            <div className="flex flex-row justify-start items-start w-[16%] gap-1">
              <div className="h-[12px] w-[12px] bg-red-100_01 rounded-[50%]" />
              <Text size="xs" as="p" className="mt-0.5 !text-gray-900">
                {p26fifty}
              </Text>
            </div>
            <div className="flex flex-row justify-start items-start w-[16%] gap-[3px]">
              <div className="h-[12px] w-[12px] bg-red-200 rounded-[50%]" />
              <Text size="xs" as="p" className="mt-0.5 !text-gray-900">
                {p51seventyfive}
              </Text>
            </div>
            <div className="flex flex-row justify-start items-start w-[18%] gap-1">
              <div className="h-[12px] w-[12px] bg-red-300_03 rounded-[50%]" />
              <Text size="xs" as="p" className="mt-0.5 !text-gray-900">
                {seventysixthousandonehundred}
              </Text>
            </div>
            <div className="flex flex-row justify-start items-start w-[21%] gap-1">
              <div className="h-[12px] w-[12px] bg-gray-400_01 rounded-[50%]" />
              <Text size="xs" as="p" className="mt-0.5 !text-gray-900">
                {semdados}
              </Text>
            </div>
          </div>
          <div className="flex flex-row justify-start items-center w-[21%] gap-1">
            <Text size="s" as="p" className="w-[81%] !text-blue_gray-300_01 text-right">
              {fonteportalOne}
            </Text>
            <Img src="images/img_elementos.svg" alt="elementos_seven" className="h-[14px] w-[14px]" />
          </div>
        </div>
      </div>
    </div>
  );
}
