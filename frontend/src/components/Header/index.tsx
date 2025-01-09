import React from "react";
import { Heading, Img, Button } from "../../components";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  const handleSupportClick = () => {
    window.location.href = "https://ellas.ufmt.br/support-ellas/";
  };

  const handleAboutClick = () => {
    window.location.href = "https://ellas.ufmt.br/about";
  };

  return (
    <header className="flex justify-center items-center w-full">
      <div className="flex flex-row justify-center w-full p-3 bg-white-A700 shadow-xs">
        <div className="flex flex-row justify-between items-center w-full max-w-[1023px]">
          <Img
            src="images/img_logo_ellas_portal_prancheta.png"
            alt="Logo ELLAS Portal"
            className="w-[30%] object-cover"
          />
          <ul className="flex flex-row gap-5">
            <li>
              <button
                onClick={() => navigate("/")}
                className="cursor-pointer hover:text-gray-700 hover:font-bold"
              >
                <Heading as="p">Home</Heading>
              </button>
            </li>
            <li>
              <button
                onClick={handleAboutClick}
                className="cursor-pointer hover:text-gray-700 hover:font-bold"
              >
                <Heading as="p">About</Heading>
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate("/buscaone")}
                className="cursor-pointer hover:text-gray-700 hover:font-bold"
              >
                <Heading as="p">Open Data</Heading>
              </button>
            </li>
            <li>
              <button
                onClick={handleSupportClick}
                className="cursor-pointer hover:text-gray-700 hover:font-bold"
              >
                <Heading as="p">Support ELLAS</Heading>
              </button>
            </li>
          </ul>
          <Button
            size="sm"
            shape="round"
            rightIcon={
              <Img
                src="images/img_iconx18_white_a700.svg"
                alt="Ícone de login"
              />
            }
            onClick={() => navigate("/fazerloginone")}
          >
            Login
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
