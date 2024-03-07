import React from "react";
import { Text, Img, Heading } from "./..";

interface Props {
  className?: string;
  contatos?: string;
  description?: React.ReactNode | string;
  conecteseao?: string;
  patrocnio?: string;
  instituies?: string;
  linksteis?: string;
  description1?: React.ReactNode | string;
  todosos?: React.ReactNode | string;
}

export default function HomeOneRodap({
  contatos = "Contatos",
  description = (
    <>
      www.ellas.ufmt.br
      <br />
      @Ellas.network
      <br />
      ellas.latinamerica@gmail.com
    </>
  ),
  conecteseao = "Conecte-se ao ELLAS",
  patrocnio = "Patrocínio",
  instituies = "Instituições Participantes",
  linksteis = "Links Úteis",
  description1 = (
    <>
      Acessibilidade na Web
      <br />
      Termos de Uso
      <br />
      Política de Privacidade
    </>
  ),
  todosos = (
    <>
      Todos os direitos reservados
      <br />© 2024 ELLAS
    </>
  ),
  ...props
}: Props) {
  return (
    <div {...props}>
      <div className="flex flex-col items-center justify-start w-full">
        <Img src="images/img_group_22.svg" alt="image_one" className="h-[19px] z-[1]" />
        <div className="flex flex-row justify-center w-full mt-[-18px] px-14 py-[65px] md:p-5 bg-gray-800_02">
          <div className="flex flex-row md:flex-col justify-between items-center w-full md:gap-10 max-w-[1021px]">
            <div className="flex flex-col items-start justify-start w-[19%] md:w-full">
              <Text as="p" className="!text-deep_orange-200 text-right !font-medium">
                {contatos}
              </Text>
              <Text size="xl" as="p" className="w-[87%] mt-2.5 !text-white-A700 !leading-5">
                {description}
              </Text>
              <Text as="p" className="mt-[30px] ml-[3px] md:ml-0 !text-deep_orange-200 !font-medium">
                {conecteseao}
              </Text>
              <Img src="images/img_group_24.svg" alt="image_two" className="h-[26px] mt-[15px] ml-1 md:ml-0" />
            </div>
            <div className="flex flex-col items-end justify-start w-[74%] md:w-full mb-1">
              <div className="flex flex-row justify-between items-start w-[81%] md:w-full">
                <div className="flex flex-col items-center justify-start">
                  <Heading size="s" as="h1" className="!text-white-A700 text-center">
                    {patrocnio}
                  </Heading>
                  <Img
                    src="images/img_idrc_logo_branca.png"
                    alt="idrclogo_one"
                    className="w-full md:h-auto sm:w-full mt-[3px] object-cover"
                  />
                  <Heading size="s" as="h2" className="mt-[27px] !text-white-A700 text-center">
                    {instituies}
                  </Heading>
                </div>
                <div className="flex flex-col items-end justify-start w-[24%] mt-[5px] gap-[3px]">
                  <Text as="p" className="!text-deep_orange-200 text-right !font-medium">
                    {linksteis}
                  </Text>
                  <Text size="xl" as="p" className="w-[88%] !text-white-A700 text-right !font-medium !leading-[29px]">
                    {description1}
                  </Text>
                </div>
              </div>
              <div className="flex flex-row md:flex-col justify-between items-center w-full mt-[-2px] md:gap-10">
                <div className="flex flex-row sm:flex-col justify-start items-center gap-2.5 sm:gap-5">
                  <Img
                    src="images/img_ufmt_oficial_branca.png"
                    alt="ufmtoficial_one"
                    className="w-[17%] md:h-auto sm:w-full object-cover"
                  />
                  <Img
                    src="images/img_uftpr_branca.png"
                    alt="uftprbranca_one"
                    className="w-[14%] md:h-auto sm:w-full object-cover"
                  />
                  <Img
                    src="images/img_vertical_extens.png"
                    alt="verticalextens"
                    className="w-[11%] md:h-auto sm:w-full object-cover"
                  />
                  <Img
                    src="images/img_logouff_vertica.png"
                    alt="logouffvertica"
                    className="w-[39px] md:h-auto sm:w-full object-cover"
                  />
                  <Img
                    src="images/img_200px_universid.png"
                    alt="200pxuniversid"
                    className="w-[48px] md:h-auto sm:w-full object-cover"
                  />
                  <Img
                    src="images/img_negro_horizontal_nac_branca.png"
                    alt="negro_one"
                    className="w-[23%] md:h-auto sm:w-full object-cover"
                  />
                  <Img
                    src="images/img_blancopeq.png"
                    alt="blancopeq_one"
                    className="w-[8%] md:h-auto sm:w-full object-cover"
                  />
                </div>
                <Text size="xl" as="p" className="w-[21%] !text-deep_orange-200 text-right">
                  {todosos}
                </Text>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
