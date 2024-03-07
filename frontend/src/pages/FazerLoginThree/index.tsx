import React from "react";
import { Helmet } from "react-helmet";
import { Button, Img, Text, Heading, Input } from "../../components";

export default function FazerLoginThreePage() {
  return (
    <>
      <Helmet>
        <title>ELLAS</title>
        <meta name="description" content="Web site created using create-react-app" />
      </Helmet>
      <div className="flex flex-col items-center justify-start w-full bg-white-A700">
        <header className="flex justify-center items-center w-full">
          <div className="flex flex-row justify-center w-full p-3 bg-white-A700 shadow-sm">
            <div className="flex flex-row md:flex-col justify-between items-center w-full md:gap-10 md:px-5 max-w-[1023px]">
              <Img
                src="images/img_logo_ellas_portal_prancheta.png"
                alt="logoellas_one"
                className="w-[13%] md:w-full md:h-[55px] object-cover"
              />
              <div className="flex flex-row md:flex-col justify-between items-center w-[69%] md:w-full md:gap-10">
                <ul className="flex flex-row sm:flex-col justify-between items-center w-auto sm:gap-10">
                  <li>
                    <a href="#">
                      <Heading as="p">Início</Heading>
                    </a>
                  </li>
                  <li>
                    <a href="#" className="cursor-pointer hover:text-gray-700 hover:font-bold">
                      <Text />
                    </a>
                  </li>
                  <li>
                    <a href="#" className="cursor-pointer hover:text-gray-700 hover:font-bold">
                      <Text />
                    </a>
                  </li>
                  <li>
                    <a href="#">
                      <Heading as="p">Apoie ELLAS</Heading>
                    </a>
                  </li>
                  <li>
                    <a href="#" className="cursor-pointer hover:text-gray-700 hover:font-bold">
                      <Text />
                    </a>
                  </li>
                </ul>
                <Button
                  size="sm"
                  shape="round"
                  rightIcon={<Img src="images/img_iconx18.svg" alt="iconx18" />}
                  className="gap-2.5 font-medium min-w-[106px]"
                >
                  Entrar
                </Button>
              </div>
            </div>
          </div>
        </header>
        <div className="flex flex-row justify-center w-full">
          <div className="h-[688px] w-full relative">
            <Img
              src="images/img_fundo_login_logo_688x1365.png"
              alt="fundologin_one"
              className="justify-center h-[688px] w-full sm:w-full left-0 bottom-0 right-0 top-0 m-auto object-cover absolute"
            />
            <div className="flex flex-col items-center justify-center w-full h-full left-0 bottom-0 right-0 top-0 p-[34px] m-auto sm:p-5 bg-white-A700_99 shadow-md absolute rounded-[20px]">
              <div className="flex flex-col items-center justify-start w-full mb-[11px] md:px-5 max-w-[289px]">
                <Heading size="xl" as="h1" className="text-center">
                  Entrar
                </Heading>
                <Text as="p" className="w-[61%] mt-2.5 !text-gray-900 text-center !leading-5">
                  Olá, insira seus dados para entrar em sua conta
                </Text>
                <div className="flex flex-col items-center justify-start w-full mt-[22px]">
                  <Input
                    shape="round"
                    name="email"
                    placeholder="E-mail"
                    prefix={<Img src="images/img_iconx18_3.svg" alt="iconx18" />}
                    suffix={<Img src="images/img_iconx18_red_300_03_18x18.svg" alt="iconx18" />}
                    className="w-full sm:w-full gap-[15px] !text-red-300_03 border-red-300_03"
                  />
                  <Input
                    shape="round"
                    name="formsenha_one"
                    placeholder="Senha"
                    prefix={<Img src="images/img_iconx18_4.svg" alt="iconx18" />}
                    suffix={<Img src="images/img_iconx18_red_300_03_18x18.svg" alt="iconx18" />}
                    className="w-full sm:w-full mt-[26px] gap-[15px] !text-red-300_03 border-red-300_03"
                  />
                  <Heading size="xs" as="h2" className="mt-[7px] !text-red-300_03">
                    Senha ou e-mail incorretos!
                  </Heading>
                  <Text size="xl" as="p" className="mt-[9px] !text-red-300_03 text-center">
                    Esqueci minha senha
                  </Text>
                  <div className="flex flex-row justify-start w-full mt-6 gap-5">
                    <Button
                      size="sm"
                      shape="round"
                      rightIcon={<Img src="images/img_iconx18_white_a700.svg" alt="iconx18" />}
                      className="mb-px gap-2.5 sm:px-5 font-medium min-w-[166px]"
                    >
                      Entrar
                    </Button>
                    <Button size="sm" variant="outline" shape="round" className="min-w-[102px]">
                      Cadastre-se
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
