import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { Heading, Img, Button } from "../../components";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSupportClick = () => {
    window.location.href = "https://ellas.ufmt.br/support-ellas/";
  };

  const handleAboutClick = () => {
    window.location.href = "https://ellas.ufmt.br/about";
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
        <div className="flex flex-row justify-center w-full p-3 bg-white-A700 shadow-xs">
          <div className="flex flex-row justify-between items-center w-full max-w-[1023px]">
            <Img
              src="images/img_logo_ellas_portal_prancheta.png"
              alt="Logo ELLAS Portal"
              className="w-[120px] md:w-[150px] object-contain"
            />

            {/* Menu Hambúrguer apenas para Mobile (sm) */}
            <button
              className="sm:block hidden md:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                />
              </svg>
            </button>

            {/* Menu Normal (visível em telas > sm) */}
            <ul className="sm:hidden flex flex-row gap-5">
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

            {/* Login Button (visível em telas > sm) */}
            <div className="sm:hidden flex ml-4">
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
        </div>

        {/* Menu Mobile Dropdown (apenas para sm) */}
        {isMenuOpen && (
          <div className="hidden sm:block w-full bg-white">
            <div className="max-w-[1023px] mx-auto w-full">
              <div className="flex flex-row items-center gap-6 py-3 px-4 overflow-x-auto">
                <button
                  onClick={() => {
                    navigate("/");
                    setIsMenuOpen(false);
                  }}
                  className="text-gray-600 hover:text-gray-900 whitespace-nowrap"
                >
                  <Heading as="p" className="text-sm">Home</Heading>
                </button>
                <button
                  onClick={() => {
                    handleAboutClick();
                    setIsMenuOpen(false);
                  }}
                  className="text-gray-600 hover:text-gray-900 whitespace-nowrap"
                >
                  <Heading as="p" className="text-sm">About</Heading>
                </button>
                <button
                  onClick={() => {
                    navigate("/buscaone");
                    setIsMenuOpen(false);
                  }}
                  className="text-gray-600 hover:text-gray-900 whitespace-nowrap"
                >
                  <Heading as="p" className="text-sm">Open Data</Heading>
                </button>
                <button
                  onClick={() => {
                    handleSupportClick();
                    setIsMenuOpen(false);
                  }}
                  className="text-gray-600 hover:text-gray-900 whitespace-nowrap"
                >
                  <Heading as="p" className="text-sm">Support</Heading>
                </button>
                <Button
                  size="sm"
                  shape="round"
                  rightIcon={
                    <Img
                      src="images/img_iconx18_white_a700.svg"
                      alt="Ícone de login"
                    />
                  }
                  onClick={() => {
                    navigate("/fazerloginone");
                    setIsMenuOpen(false);
                  }}
                >
                  Login
                </Button>
              </div>
            </div>
          </div>
        )}
      </header>
      <div className="h-[48px] sm:h-[56px] md:h-[64px]" />
    </>
  );
};

export default Header;
