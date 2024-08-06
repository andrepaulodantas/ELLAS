import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Img, Heading, Text } from "../components"; // Ajuste esses imports conforme a estrutura do seu projeto
import { fetchInitiatives } from '../services/apiService';

const HomePage: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [initiatives, setInitiatives] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);

    fetchInitiatives()
      .then((data) => {
        setInitiatives(data.results.bindings);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <header className="w-full p-3 bg-white-A700 shadow-xs fixed top-0 left-0 z-10">
        <div className="container mx-auto flex justify-between items-center">
          <Img src="images/img_logo_ellas_portal_prancheta.png" alt="Logo" className="h-12"/>
          <nav>
            <ul className="flex items-center space-x-4">
              <li><Link to="/" className="text-blue-700 hover:text-blue-900"><Heading as="p">Início</Heading></Link></li>
              {isLoggedIn ? (
                <li><Button onClick={handleLogout} className="bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded">Logout</Button></li>
              ) : (
                <li><Link to="/login"><Button className="bg-green-500 hover:bg-green-700 text-white py-2 px-4 rounded">Login</Button></Link></li>
              )}
            </ul>
          </nav>
        </div>
      </header>
      <main className="pt-20 p-5 w-full flex flex-col items-center justify-start">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-10">
          <Link to="/buscaone" className="p-6 bg-blue-100 hover:bg-blue-200 transition duration-300 ease-in-out rounded-lg shadow-lg text-center">
            <Heading as="h3">Busca One</Heading>
            <Text>Descrição da Busca One.</Text>
          </Link>
          <Link to="/buscatwo" className="p-6 bg-green-100 hover:bg-green-200 transition duration-300 ease-in-out rounded-lg shadow-lg text-center">
            <Heading as="h3">Busca Two</Heading>
            <Text>Descrição da Busca Two.</Text>
          </Link>
          <Link to="/buscatwoone" className="p-6 bg-red-100 hover:bg-red-200 transition duration-300 ease-in-out rounded-lg shadow-lg text-center">
            <Heading as="h3">Busca Two One</Heading>
            <Text>Descrição da Busca Two One.</Text>
          </Link>
        </div>        
      </main>
      <div className="flex flex-row justify-center w-full">
        <div className="flex flex-col items-center justify-start w-full">
          <Img src="images/img_group_22.svg" alt="image_one" className="h-[19px] z-[1]" />
          <div className="flex flex-row justify-center w-full mt-[-18px] px-14 py-[65px] md:p-5 bg-gray-800_02">
            <div className="flex flex-row md:flex-col justify-between items-center w-full md:gap-10 max-w-[1021px]">
              <div className="flex flex-col items-start justify-start w-[19%] md:w-full">
                <Text as="p" className="!text-deep_orange-200 text-right !font-medium">
                  Contatos
                </Text>
                <Text size="xl" as="p" className="w-[87%] mt-2.5 !text-white-A700 !leading-5">
                  <>
                    www.ellas.ufmt.br
                    <br />
                    @Ellas.network
                    <br />
                    ellas.latinamerica@gmail.com
                  </>
                </Text>
                <Text as="p" className="mt-[30px] ml-[3px] md:ml-0 !text-deep_orange-200 !font-medium">
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
                    <Heading size="s" as="p" className="!text-white-A700 text-center">
                      Patrocínio
                    </Heading>
                    <Img
                      src="images/img_idrc_logo_branca.png"
                      alt="idrclogo_one"
                      className="w-full md:h-auto sm:w-full mt-[3px] object-cover"
                    />
                    <Heading size="s" as="p" className="mt-[27px] !text-white-A700 text-center">
                      Instituições Participantes
                    </Heading>
                  </div>
                  <div className="flex flex-col items-end justify-start w-[24%] mt-[5px] gap-[3px]">
                    <Text as="p" className="!text-deep_orange-200 text-right !font-medium">
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
                  <Text size="xl" as="p" className="w-[21%] !text-deep_orange-200 text-right">
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

export default HomePage;
