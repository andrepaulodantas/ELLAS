// src/components/Header/index.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Img, Heading } from "../../components";

interface Props {
  className?: string;
}

const Header: React.FC<Props> = ({ ...props }) => {
  const navigate = useNavigate();

  // Função para navegar para uma rota específica
  const handleNavigation =
    (path: string) =>
    (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      event.preventDefault();
      navigate(path);
    };

  // Função para o clique do botão "Entrar"
  const handleButtonClick = () => {
    navigate("/fazerloginone");
  };

  return (
    <header {...props}>
      <div className="flex flex-row justify-center w-full p-3 bg-white-A700 shadow-xs">
        <div className="flex flex-row md:flex-col justify-between items-center w-full md:gap-10 md:px-5 max-w-[1023px]">
          <Img
            src="images/img_logo_ellas_portal_prancheta.png"
            alt="Logo ELLAS Portal"
            className="w-[13%] md:w-full md:h-[55px] object-cover"
          />
          <div className="flex flex-row md:flex-col justify-between items-center w-[69%] md:w-full md:gap-10">
            <ul className="flex flex-row sm:flex-col justify-between items-center w-auto sm:gap-10">
              <li>
                <a
                  href="/"
                  onClick={handleNavigation("/")}
                  className="cursor-pointer hover:text-gray-700 hover:font-bold"
                >
                  <Heading as="p" className="text-lg">
                    Início
                  </Heading>
                </a>
              </li>
              <li>
                <a
                  href="/sobre"
                  onClick={handleNavigation("/sobre")}
                  className="cursor-pointer hover:text-gray-700 hover:font-bold"
                >
                  <Heading as="p" className="text-lg">
                    Sobre
                  </Heading>
                </a>
              </li>
              <li>
                <a
                  href="/apoie-ellas"
                  onClick={handleNavigation("/apoie-ellas")}
                  className="cursor-pointer hover:text-gray-700 hover:font-bold"
                >
                  <Heading as="p" className="text-lg">
                    Apoie ELLAS
                  </Heading>
                </a>
              </li>
              <li>
                <a
                  href="/contato"
                  onClick={handleNavigation("/contato")}
                  className="cursor-pointer hover:text-gray-700 hover:font-bold"
                >
                  <Heading as="p" className="text-lg">
                    Contato
                  </Heading>
                </a>
              </li>
              <li>
                <a
                  href="/faq"
                  onClick={handleNavigation("/faq")}
                  className="cursor-pointer hover:text-gray-700 hover:font-bold"
                >
                  <Heading as="p" className="text-lg">
                    FAQ
                  </Heading>
                </a>
              </li>
              <li>
                <a
                  href="/graph-view"
                  onClick={handleNavigation("/graph-view")}
                  className="cursor-pointer hover:text-gray-700 hover:font-bold"
                >
                  <Heading as="p" className="text-lg">
                    Graph View
                  </Heading>
                </a>
              </li>
            </ul>
            <Button
              size="sm"
              shape="round"
              rightIcon={
                <Img src="images/img_iconx18.svg" alt="Ícone de login" />
              }
              className="gap-2.5 font-medium min-w-[106px] hover:bg-gray-100"
              onClick={handleButtonClick}
            >
              Entrar
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
