import React from "react";
import { SelectBox, Img, Text } from "./..";
import { OptionProps } from "react-select";

const dropDownOptions = [
  { label: "Option1", value: "option1" },
  { label: "Option2", value: "option2" },
  { label: "Option3", value: "option3" },
];
interface Props {
  className?: string;
  categoria?: string;
  pergunta?: string;
}

export default function BuscaOneMenubusca({ categoria = "Categoria", pergunta = "Pergunta", ...props }: Props) {
  return (
    <div {...props}>
      <div className="flex flex-col items-start justify-start w-full gap-3">
        <Text size="3xl" as="p">
          {categoria}
        </Text>
        <SelectBox
          shape="round"
          indicator={<Img src="images/img_iconx18_7.svg" alt="iconx18" />}
          getOptionLabel={(e: OptionProps) => (
            <>
              <div className="flex items-center">
                <Img src="images/img_iconx18_6.svg" alt="iconx18" />
                <span>{e.label}</span>
              </div>
            </>
          )}
          name="iniciativas"
          placeholder="Iniciativas"
          options={dropDownOptions}
          className="w-full border-gray-300_01 border border-solid"
        />
      </div>
      <Text size="3xl" as="p" className="mt-[22px]">
        {pergunta}
      </Text>
      <SelectBox
        shape="round"
        indicator={<Img src="images/img_iconx18_7.svg" alt="iconx18" />}
        getOptionLabel={(e: OptionProps) => (
          <>
            <div className="flex items-center">
              <Img src="images/img_iconx18_8.svg" alt="iconx18" />
              <span>{e.label}</span>
            </div>
          </>
        )}
        name="item"
        placeholder="Quais e quantas iniciativas..."
        options={dropDownOptions}
        className="w-full mt-3 border-blue_gray-100 border border-solid"
      />
    </div>
  );
}
