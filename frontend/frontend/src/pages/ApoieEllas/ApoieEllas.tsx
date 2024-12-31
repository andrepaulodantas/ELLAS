import React from "react";
import { Link } from "react-router-dom";
import { Text, Img, Heading, Button, Slider } from "../../components";

const ApoieEllasPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <header className="w-full p-3 bg-white-A700 shadow-xs fixed top-0 left-0 z-10">
        <div className="container mx-auto flex justify-between items-center">
          <Img
            src="images/img_logo_ellas_portal_prancheta.png"
            alt="Logo"
            className="h-12"
          />
          <nav>
            <ul className="flex items-center space-x-4">
              <li>
                <Link to="/" className="text-blue-700 hover:text-blue-900">
                  <Heading as="p">Início</Heading>
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>
      <main className="pt-20 p-5 w-full flex flex-col items-center justify-start text-center">
        <Heading as="h1" size="xl" className="text-2xl font-bold my-5">
          Apoie Ellas
        </Heading>
        <Text className="mb-5">
          Saiba como você pode ajudar a promover a equidade de gênero na
          tecnologia.
        </Text>
        <Text className="mb-5">
          Contribua com doações, participe de eventos, ou torne-se um
          voluntário.
        </Text>
      </main>
      <footer className="w-full p-5 bg-gray-200 text-center">
        <Text>© 2024 Your Website</Text>
      </footer>
      <div className="flex flex-row justify-center w-full">
        <div className="flex flex-col items-center justify-start w-full">
          <Img
            src="images/img_group_22.svg"
            alt="image_one"
            className="h-[19px] z-[1]"
          />
          <div className="flex flex-row justify-center w-full mt-[-18px] px-14 py-[65px] md:p-5 bg-gray-800_02">
            <div className="flex flex-row md:flex-col justify-between items-center w-full md:gap-10 max-w-[1021px]">
              <div className="flex flex-col items-start justify-start w-[19%] md:w-full">
                <Text
                  as="p"
                  className="!text-deep_orange-200 text-right !font-medium"
                >
                  Contatos
                </Text>
                <Text
                  size="xl"
                  as="p"
                  className="w-[87%] mt-2.5 !text-white-A700 !leading-5"
                >
                  <>
                    www.ellas.ufmt.br
                    <br />
                    @Ellas.network
                    <br />
                    ellas.latinamerica@gmail.com
                  </>
                </Text>
                <Text
                  as="p"
                  className="mt-[30px] ml-[3px] md:ml-0 !text-deep_orange-200 !font-medium"
                >
                  Conecte-se ao ELLAS
                </Text>
                <Img
                  src="images/img_group_24.svg"
                  alt="image_two"
                  className="h-[26px] mt-[15px] ml-1 md:ml-0"
                />
              </div>
              <div className="flex flex-col items-end justify-start w-[74%] md:w-full mb-1">
                <div className="flex flex-row justify-between items-start w-[81%] md:w-full">
                  <div className="flex flex-col items-center justify-start">
                    <Heading
                      size="s"
                      as="p"
                      className="!text-white-A700 text-center"
                    >
                      Patrocínio
                    </Heading>
                    <Img
                      src="images/img_idrc_logo_branca.png"
                      alt="idrclogo_one"
                      className="w-full md:h-auto sm:w-full mt-[3px] object-cover"
                    />
                    <Heading
                      size="s"
                      as="p"
                      className="mt-[27px] !text-white-A700 text-center"
                    >
                      Instituições Participantes
                    </Heading>
                  </div>
                  <div className="flex flex-col items-end justify-start w-[24%] mt-[5px] gap-[3px]">
                    <Text
                      as="p"
                      className="!text-deep_orange-200 text-right !font-medium"
                    >
                      Links Úteis
                    </Text>
                    <Text
                      size="xl"
                      as="p"
                      className="w-[88%] !text-white-A700 text-right !font-medium !leading-[29px]"
                    >
                      <>
                        Acessibilidade na Web
                        <br />
                        Termos de Uso
                        <br />
                        Política de Privacidade
                      </>
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
                  <Text
                    size="xl"
                    as="p"
                    className="w-[21%] !text-deep_orange-200 text-right"
                  >
                    <>
                      Todos os direitos reservados
                      <br />© 2024 ELLAS
                    </>
                  </Text>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApoieEllasPage;
