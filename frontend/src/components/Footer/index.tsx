import React from "react";
import { Img, Text, Heading } from "../../components";

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
    <footer className="bg-gray-800_02 p-6 overflow-x-auto">
      {/* 
        min-w-[900px]: força a largura mínima do conteúdo 
        grid-cols-4: sempre 4 colunas 
      */}
      <div className="container mx-auto min-w-[900px] grid grid-cols-4 gap-6">
        
        {/* Coluna 1: Logo e Contacts */}
        <div>
          <div className="flex justify-center mb-4">
            <Img
              src="images/img_group_22.svg"
              alt="ELLAS Logo"
              className="h-[19px]"
            />
          </div>
          <Text
            as="p"
            className="!text-deep_orange-200 !font-medium text-lg mb-2"
          >
            Contacts
          </Text>
          <Text className="!text-white-A700 text-base leading-5">
            www.ellas.ufmt.br
            <br />
            @Ellas.network
            <br />
            ellas.latinamerica@gmail.com
          </Text>
        </div>

        {/* Coluna 2: Useful Links */}
        <div>
          <Text
            as="p"
            className="!text-deep_orange-200 !font-medium text-lg mb-2"
          >
            Useful Links
          </Text>
          <Text className="!text-white-A700 text-base leading-5">
            Web Accessibility
            <br />
            Terms of Use
            <br />
            Privacy Policy
          </Text>
        </div>

        {/* Coluna 3: Connect to ELLAS */}
        <div>
          <Text
            as="p"
            className="!text-deep_orange-200 !font-medium text-lg mb-2"
          >
            Connect to ELLAS
          </Text>
          <div>
            <Img
              src="images/img_group_24.svg"
              alt="Social Media"
              className="h-[26px] w-auto"
            />
          </div>
        </div>

        {/* Coluna 4: Sponsorship + Institutions */}
        <div className="text-center flex flex-col items-center">
          <Heading as="h3" size="s" className="!text-white-A700 text-lg">
            Sponsorship
          </Heading>
          <Img
            src="images/img_idrc_logo_branca.png"
            alt="IDRC"
            className="h-[45px] w-auto object-contain mx-auto my-2"
          />
          <Heading
            as="h4"
            size="s"
            className="!text-white-A700 text-lg mt-2"
          >
            Participating Institutions
          </Heading>
          <div className="flex flex-wrap justify-center items-center gap-2 mt-2">
            {institutionLogos.map((src, index) => (
              <Img
                key={index}
                src={`images/${src}`}
                alt={`Institution ${index + 1}`}
                className="h-[35px] w-auto object-contain"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Sessão Separada p/ Copyright */}
      <div className="container mx-auto min-w-[900px] mt-4">
        <Text
          className="!text-deep_orange-200 !font-medium text-base text-center"
        >
          © 2024 ELLAS
        </Text>
      </div>
    </footer>
  );
};

export default Footer;
