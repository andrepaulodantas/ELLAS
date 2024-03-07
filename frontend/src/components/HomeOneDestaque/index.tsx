import React from "react";
import { Text, Heading, Img } from "./..";

interface Props {
  className?: string;
  polTicasOne?: string;
  polticas?: string;
  quetiposde?: string;
}

export default function HomeOneDestaque({
  polTicasOne = "images/img_iconx18_red_300_03.svg",
  polticas = "Políticas",
  quetiposde = "Que tipos de políticas, processos ou práticas de gênero existem na América Latina?",
  ...props
}: Props) {
  return (
    <div {...props}>
      <div className="flex flex-row justify-start items-center gap-[13px]">
        <Img src={polTicasOne} alt="políticas_one" className="h-[18px] w-[18px]" />
        <Heading as="h1" className="!text-red-300_03">
          {polticas}
        </Heading>
      </div>
      <Text as="p" className="!text-gray-900 !leading-5">
        {quetiposde}
      </Text>
    </div>
  );
}
