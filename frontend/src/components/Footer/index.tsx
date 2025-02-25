import React from "react";
import { Img, Text } from "../../components";

const Footer = () => {
  const institutionLogos = [
    "img_ufmt_oficial_branca.png",
    "img_uftpr_branca.png",
    "img_vertical_extens.png",
    "img_logouff_vertica.png",
    "img_200px_universid.png",
    "img_negro_horizontal_nac_branca.png",
    "img_blancopeq.png",
  ];

  return (
    <footer className="bg-[#4A2B5C] py-8 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            <div>
              <Text className="text-[#E6A17A] font-medium text-lg mb-2">
                Contatos
              </Text>
              <div className="space-y-1 text-base">
                <a
                  href="https://www.ellas.ufmt.br"
                  className="block text-[#FFFFFF] hover:opacity-80 transition-opacity"
                >
                  www.ellas.ufmt.br
                </a>
                <a
                  href="#"
                  className="block text-[#FFFFFF] hover:opacity-80 transition-opacity"
                >
                  @ellas.network
                </a>
                <a
                  href="mailto:ellas.latinamerica@gmail.com"
                  className="block text-[#FFFFFF] hover:opacity-80 transition-opacity"
                >
                  ellas.latinamerica@gmail.com
                </a>
              </div>
            </div>

            <div>
              <Text className="text-[#E6A17A] font-medium text-lg mb-2">
                Conecte-se ao ELLAS
              </Text>
              <div className="flex gap-2">
                <a
                  href="#"
                  className="block text-[#FFFFFF] hover:opacity-80 transition-opacity"
                >
                  <Img
                    src="images/img_group_24.svg"
                    alt="Social Media Icons"
                    className="h-[26px] w-auto"
                  />
                </a>
              </div>
            </div>
          </div>

          {/* Center Column */}
          <div className="flex flex-col items-center">
            <Text className="text-[#E6A17A] font-medium text-lg mb-4">
              Agência Financiadora
            </Text>
            <Img
              src="images/img_idrc_logo_branca.png"
              alt="IDRC"
              className="h-16 w-auto mb-8"
            />
            <Text className="text-[#E6A17A] font-medium text-lg mb-4">
              Instituições Participantes
            </Text>
            <div className="flex flex-wrap justify-center gap-4">
              {institutionLogos.map((src, index) => (
                <Img
                  key={index}
                  src={`images/${src}`}
                  alt={`Institution ${index + 1}`}
                  className="h-8 w-auto"
                />
              ))}
            </div>
          </div>

          {/* Right Column */}
          <div className="text-right">
            <Text className="text-[#E6A17A] font-medium text-lg mb-2">
              Links Úteis
            </Text>
            <div className="space-y-1 text-base">
              <a
                href="/accessibility"
                className="block text-[#FFFFFF] hover:opacity-80 transition-opacity"
              >
                Acessibilidade na Web
              </a>
              <a
                href="/terms"
                className="block text-[#FFFFFF] hover:opacity-80 transition-opacity"
              >
                Termos de Uso
              </a>
              <a
                href="/privacy"
                className="block text-[#FFFFFF] hover:opacity-80 transition-opacity"
              >
                Política de Privacidade
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="container mx-auto max-w-7xl mt-8 pt-4 text-center">
        <Text className="text-[#FFFFFF] text-sm">
          Todos os direitos reservados © 2024 ELLAS
        </Text>
      </div>
    </footer>
  );
};

export default Footer;
