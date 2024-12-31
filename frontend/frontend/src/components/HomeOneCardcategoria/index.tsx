import React from "react";
import { Text, Heading, Img } from "./..";

interface Props {
  className?: string;
  iconxtwentyfour?: string;
  polticasOne?: string;
  legislaeseOne?: string;
}

export default function HomeOneCardcategoria({
  iconxtwentyfour = "images/img_iconx24.svg",
  polticasOne = "Políticas",
  legislaeseOne = "Legislações e decretos que promovem a participação de mulheres nas áreas STEM",
  ...props
}: Props) {
  return (
    <div {...props}>
      <Img src={iconxtwentyfour} alt="iconxtwentyfour" className="h-[24px] w-[24px] mt-2.5" />
      <Heading size="xl" as="h1" className="!text-white-A700">
        {polticasOne}
      </Heading>
      <Text as="p" className="mb-[52px] !text-white-A700 !leading-5">
        {legislaeseOne}
      </Text>
    </div>
  );
}
