import React from "react";
import { Text } from "../Text";
import { useLanguage } from "../../contexts/LanguageContext";

interface Props {
  className?: string;
}

export default function BuscaTwoBarbusca({ className = "", ...props }: Props) {
  const { translations } = useLanguage();

  return (
    <div
      className={`flex flex-col items-center justify-start w-full ${className}`}
    >
      <div className="flex flex-col items-start justify-start w-full">
        <div className="flex flex-row md:flex-col justify-start items-start w-full gap-[18px]">
          <div className="flex flex-col items-start justify-start w-[7%] md:w-full gap-[25px]">
            <Text size="xl" as="p">
              {translations.countries?.brasil || "Brasil"}
            </Text>
            <Text size="xl" as="p">
              {translations.countries?.peru || "Peru"}
            </Text>
            <Text size="xl" as="p">
              {translations.countries?.bolivia || "Bolivia"}
            </Text>
            <Text size="xl" as="p">
              {translations.countries?.argentina || "Argentina"}
            </Text>
          </div>
          <div className="flex flex-col items-start justify-start w-[93%] md:w-full ml-[-1px] md:ml-0">
            <div className="flex flex-row justify-between w-[88%] md:w-full">
              <Text size="md" as="p">
                0
              </Text>
              <Text size="md" as="p" className="h-[12px]">
                05
              </Text>
              <Text size="md" as="p" className="h-[12px]">
                10
              </Text>
              <Text size="md" as="p" className="h-[12px]">
                15
              </Text>
              <Text size="md" as="p" className="h-[12px]">
                20
              </Text>
            </div>
            <div className="h-px w-full mt-[7px] rotate-[-180deg] bg-blue_gray-100_01" />
            <div className="flex flex-row md:flex-col justify-start items-center w-[81%] md:w-full mt-[22px] gap-2 md:gap-5">
              <div className="h-[30px] w-[97%] bg-deep_purple-200" />
              <Text size="xl" as="p">
                17
              </Text>
            </div>
            <div className="flex flex-row sm:flex-col justify-start items-center w-[60%] md:w-full mt-[25px] gap-3 sm:gap-5">
              <div className="h-[30px] w-[95%] bg-deep_purple-200" />
              <Text size="xl" as="p">
                13
              </Text>
            </div>
            <div className="flex flex-row justify-start items-center w-[32%] md:w-full mt-[25px] gap-3">
              <div className="h-[30px] w-[91%] bg-deep_purple-200" />
              <Text size="xl" as="p">
                06
              </Text>
            </div>
            <div className="flex flex-row justify-start items-center w-[20%] md:w-full mt-[25px] gap-3">
              <div className="h-[30px] w-[84%] bg-deep_purple-200" />
              <Text size="xl" as="p" className="h-[15px]">
                04
              </Text>
            </div>
          </div>
        </div>
        <Text size="xs" as="p" className="mt-[15px] ml-[25px] md:ml-5">
          {translations.source?.inep ||
            "Fonte: INEP, UNESCO e Dados Secundários da plataforma ELLAS"}
        </Text>
      </div>
    </div>
  );
}
