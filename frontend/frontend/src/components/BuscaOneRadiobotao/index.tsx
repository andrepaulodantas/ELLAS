import React from "react";
import { Text, Img } from "./..";

interface Props {
  className?: string;
  radioiconOne?: string;
  oporadio?: string;
  radioiconThree?: string;
  oporadioOne?: string;
  radioiconFive?: string;
  oporadioTwo?: string;
}

export default function BuscaOneRadiobotao({
  radioiconOne,
  oporadio,
  radioiconThree,
  oporadioOne,
  radioiconFive,
  oporadioTwo,
  ...props
}: Props) {
  return (
    <div {...props}>
      <div className="flex flex-row justify-start items-center w-full gap-1.5">
        {!!radioiconOne ? <Img src={radioiconOne} alt="radioicon_one" className="h-[24px] w-[24px]" /> : null}
        {!!oporadio ? (
          <Text as="p" className="!text-gray-900">
            {oporadio}
          </Text>
        ) : null}
      </div>
      <div className="flex flex-row justify-start items-center w-full gap-1.5">
        {!!radioiconThree ? <Img src={radioiconThree} alt="radioicon_three" className="h-[24px] w-[24px]" /> : null}
        {!!oporadioOne ? (
          <Text as="p" className="!text-blue_gray-300_01">
            {oporadioOne}
          </Text>
        ) : null}
      </div>
      <div className="flex flex-row justify-start items-center w-full gap-1.5">
        {!!radioiconFive ? <Img src={radioiconFive} alt="radioicon_five" className="h-[24px] w-[24px]" /> : null}
        {!!oporadioTwo ? (
          <Text as="p" className="!text-blue_gray-300_01">
            {oporadioTwo}
          </Text>
        ) : null}
      </div>
    </div>
  );
}
