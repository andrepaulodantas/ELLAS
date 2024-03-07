import React from "react";
import { Text } from "./..";

interface Props {
  className?: string;
  description?: React.ReactNode | string;
  description1?: React.ReactNode | string;
}

export default function BuscaTwoOneSliderano({
  description = (
    <>
      2012
      <br />
      2013
      <br />
      2014
      <br />
      2015
      <br />
      2016
      <br />
      2017
      <br />
      2018
      <br />
      2019
      <br />
      2020
      <br />
      2021
      <br />
      2022
      <br />
      2023
    </>
  ),
  description1 = (
    <>
      2012
      <br />
      2013
      <br />
      2014
      <br />
      2015
      <br />
      2016
      <br />
      2017
      <br />
      2018
      <br />
      2019
      <br />
      2020
      <br />
      2021
      <br />
      2022
      <br />
      2023
    </>
  ),
  ...props
}: Props) {
  return (
    <div {...props}>
      <div className="h-[10px] w-[97%] bottom-[16%] right-0 left-0 m-auto bg-gray-300 absolute" />
      <div className="flex flex-row justify-between w-full h-full left-0 bottom-0 right-0 top-0 m-auto absolute">
        <div className="flex flex-col items-center justify-start w-[12%] gap-[5px]">
          <div className="flex flex-row justify-center w-full">
            <Text as="p" className="!text-blue_gray-300_01 text-center !leading-[21px]">
              {description}
            </Text>
          </div>
          <div className="h-[29px] w-[29px] bg-blue_gray-300_01 rounded-[14px]" />
        </div>
        <div className="flex flex-col items-center justify-start w-[12%] gap-[5px]">
          <div className="flex flex-row justify-center w-full">
            <Text as="p" className="!text-blue_gray-300_01 text-center !leading-[21px]">
              {description1}
            </Text>
          </div>
          <div className="h-[29px] w-[29px] bg-blue_gray-300_01 rounded-[14px]" />
        </div>
      </div>
    </div>
  );
}
