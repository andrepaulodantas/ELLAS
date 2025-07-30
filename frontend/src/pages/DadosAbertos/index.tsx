import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { Text, Img, Heading, Button } from "../../components";
import { TabPanel, TabList, Tab, Tabs } from "react-tabs";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import { saveAs } from "file-saver";
import { useLanguage } from "../../contexts/LanguageContext";
import "react-tabs/style/react-tabs.css";
import styled from "@emotion/styled";
import { FaFacebook, FaTwitter, FaLinkedin } from "react-icons/fa";
import IconWrapper from "../../components/IconWrapper";

// Styled component for question title (exactly matching BuscaTwo)
const QuestionTitle = styled(Heading)`
  text-align: center;
  color: #4a2b4e;
  font-weight: 600;
  padding-bottom: 16px;
  margin-bottom: 24px;
  border-bottom: 2px solid #e6a17a;
  width: 100%;
  font-size: 24px;
  line-height: 1.3;
  word-wrap: break-word;
  overflow-wrap: break-word;
  hyphens: auto;
  max-width: 95%;

  @media (max-width: 768px) {
    font-size: 16px;
    padding-bottom: 8px;
    margin-bottom: 12px;
    line-height: 1.2;
    border-bottom: 1px solid #e6a17a;
  }

  @media (max-width: 480px) {
    font-size: 14px;
    padding-bottom: 6px;
    margin-bottom: 8px;
    line-height: 1;
    max-width: 100%;
    font-weight: 500;
  }
`;

// Estilos para os ícones sociais - posicionados à direita
const SocialMediaContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  margin: 0;
  position: static;
  z-index: 10;
  
  @media (max-width: 768px) {
    justify-content: center;
  }
`;

const SocialIcon = styled.a`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: white;
  font-size: 16px;
  font-weight: 600;
  transition: all 0.3s ease;
  z-index: 10;

  &:hover {
    transform: translateY(-2px);
  }

  &.facebook {
    background-color: #3b5998;
  }
  &.instagram {
    background: linear-gradient(
      45deg,
      #f09433 0%,
      #e6683c 25%,
      #dc2743 50%,
      #cc2366 75%,
      #bc1888 100%
    );
  }
  &.twitter {
    background-color: #1da1f2;
  }
  &.linkedin {
    background-color: #0077b5;
  }
  &.whatsapp {
    background-color: #25d366;
  }
  &.share {
    background-color: #ff6542;
  }
  &.download {
    background-color: #f8b195;
  }
  &.info {
    background-color: #17a2b8;
    font-family: serif;
    font-style: italic;
  }
`;

// Estilos para as abas superiores
const TopTabsContainer = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  background: #ffe4d9;
  border-radius: 12px 12px 0 0;
  margin: 0;
  padding: 8px 16px;
  width: 100%;
  min-height: 64px;
  gap: 20px;
  
  .tabs-section {
    display: flex;
    align-items: center;
    overflow: hidden;
  }
  
  .social-section {
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 8px;
    padding: 12px 8px;
    
    .tabs-section {
      width: 100%;
    }
    
    .social-section {
      justify-content: center;
    }
  }
`;

const DadosAbertosPage = () => {
  const { translations, language } = useLanguage();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
  };

  const handleReset = () => {
    setSelectedCategory(null);
  };

  const handleNavigation = (path: string) => () => {
    navigate(path);
  };

  const exportData = () => {
    const csvContent = "No data available";
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "dados_abertos.csv");
  };

  // Funções de compartilhamento em redes sociais
  const shareOnFacebook = () => {
    const url = window.location.href;
    const title = document.title;
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        url
      )}&t=${encodeURIComponent(title)}`,
      "_blank"
    );
  };

  const shareOnTwitter = () => {
    const url = window.location.href;
    const title = document.title;
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        title
      )}&url=${encodeURIComponent(url)}`,
      "_blank"
    );
  };

  const shareOnLinkedin = () => {
    const url = window.location.href;
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
        url
      )}`,
      "_blank"
    );
  };

  return (
    <>
      <Helmet>
        <title>ELLAS - Dados Abertos</title>
        <meta name="description" content="Dados Abertos - Portal ELLAS" />
      </Helmet>
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex-grow">
          <div className="flex flex-col items-center justify-start w-full bg-white-A700">
            <div className="flex flex-col items-center justify-start w-full">
              {/* Header Section */}
              <div className="flex flex-row justify-center items-center w-full p-8 sm:p-6 border-b-2 border-deep_orange-200 bg-gray-50">
                <Heading
                  size="2xl"
                  as="h1"
                  className="text-center text-gray-800 font-semibold"
                >
                  Dados Abertos
                </Heading>
              </div>

              {/* Main Content Section */}
              <div className="flex flex-row md:flex-col justify-between items-start w-full gap-10 px-6 sm:px-4 max-w-[1331px]">
                {/* Sidebar / Filters Section */}
                <div className="flex flex-col w-[25%] md:w-full p-4 border-r border-gray-200 md:border-r-0">
                  <div className="flex flex-col gap-5">
                    <Button
                      onClick={handleReset}
                      className="w-full text-center py-2 border border-gray-300 rounded-md"
                    >
                      Reiniciar
                    </Button>

                    <div className="flex flex-col gap-2">
                      <Heading as="h3" size="md">
                        Categoria
                      </Heading>
                      <select
                        value={selectedCategory || ""}
                        onChange={handleCategoryChange}
                        className="p-2 border border-gray-300 rounded-md w-full"
                      >
                        <option value="">Selecione uma Categoria</option>
                        <option value="initiatives">Iniciativas</option>
                        <option value="policies">Políticas</option>
                        <option value="factors">Fatores</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Content Section */}
                <div className="flex flex-col w-[70%] md:w-full">
                  {/* Tabs Section */}
                  <TopTabsContainer>
                    <div className="tabs-section">
                      <Tabs
                        className="w-auto"
                        selectedTabClassName="!text-[#4A2B5C] border-b-2 border-[#4A2B5C] bg-white-A700"
                      >
                        <TabList className="flex flex-row gap-4 w-auto flex-shrink-0 max-w-full">
                          <Tab
                            className="p-4 flex items-center gap-2 cursor-pointer outline-none flex-shrink-0 whitespace-nowrap"
                            selectedClassName="!text-[#4A2B5C] border-b-2 border-[#4A2B5C]"
                          >
                            <Text as="p">Mapas</Text>
                            <Img src="images/img_iconx18_9.svg" alt="Map Icon" />
                          </Tab>
                          <Tab
                            className="p-4 flex items-center gap-2 cursor-pointer outline-none flex-shrink-0 whitespace-nowrap"
                            selectedClassName="!text-[#4A2B5C] border-b-2 border-[#4A2B5C]"
                          >
                            <Text as="p">Barras</Text>
                            <Img
                              src="images/img_iconx18_11.svg"
                              alt="Bars Icon"
                            />
                          </Tab>
                          <Tab
                            className="p-4 flex items-center gap-2 cursor-pointer outline-none flex-shrink-0 whitespace-nowrap"
                            selectedClassName="!text-[#4A2B5C] border-b-2 border-[#4A2B5C]"
                          >
                            <Text as="p">Linhas</Text>
                            <Img
                              src="images/img_iconx18_12.svg"
                              alt="Lines Icon"
                            />
                          </Tab>
                        </TabList>
                      </Tabs>
                    </div>

                    {/* Social Media Icons - posicionados à direita */}
                    <div className="social-section">
                      <SocialIcon
                        onClick={shareOnFacebook}
                        className="facebook"
                        title="Compartilhar no Facebook"
                      >
                        <IconWrapper icon={FaFacebook} size={16} />
                      </SocialIcon>
                      <SocialIcon 
                        onClick={shareOnTwitter} 
                        className="twitter"
                        title="Compartilhar no Twitter"
                      >
                        <IconWrapper icon={FaTwitter} size={16} />
                      </SocialIcon>
                      <SocialIcon 
                        onClick={shareOnLinkedin} 
                        className="linkedin"
                        title="Compartilhar no LinkedIn"
                      >
                        <IconWrapper icon={FaLinkedin} size={16} />
                      </SocialIcon>
                    </div>
                  </TopTabsContainer>

                  {/* Tab Panels */}
                  <TabPanel className="flex flex-col items-center justify-center w-full mt-0">
                    <div className="flex flex-col items-center justify-center w-full max-w-[650px] mx-auto">
                      <div className="flex flex-col items-center justify-center w-full mb-4">
                        <div className="flex px-4 py-6 flex-col items-center justify-center w-full">
                          <QuestionTitle as="h2">
                            {translations?.labels?.selectQuestion ||
                              "Selecione uma Pergunta"}
                          </QuestionTitle>
                          <div className="flex flex-col gap-3 w-full">
                            <div className="flex flex-col gap-1">
                              <Text as="span" className="text-sm text-gray-700">
                                buscaone
                              </Text>
                              <input
                                type="text"
                                className="p-2 border border-gray-300 rounded-md w-full"
                                placeholder="Buscar..."
                              />
                            </div>
                            <div className="flex flex-col gap-1">
                              <Text as="span" className="text-sm text-gray-700">
                                buscatwo
                              </Text>
                              <input
                                type="text"
                                className="p-2 border border-gray-300 rounded-md w-full"
                                placeholder="Filtrar..."
                              />
                            </div>
                          </div>
                          <div className="text-center text-gray-600 p-3 mt-4 w-full">
                            Nenhum dado disponível para exibição
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabPanel>

                  <TabPanel className="flex flex-col items-center justify-center w-full mt-0">
                    <div className="flex flex-col items-center justify-center w-full max-w-[650px] mx-auto">
                      <div className="flex flex-col items-center justify-center w-full mb-4">
                        <div className="flex px-4 py-6 flex-col items-center justify-center w-full">
                          <QuestionTitle as="h2">
                            {translations?.labels?.selectQuestion ||
                              "Selecione uma Pergunta"}
                          </QuestionTitle>
                          <div className="text-center text-gray-600 p-3 w-full">
                            Nenhum dado disponível para exibição
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabPanel>

                  <TabPanel className="flex flex-col items-center justify-center w-full mt-0">
                    <div className="flex flex-col items-center justify-center w-full max-w-[650px] mx-auto">
                      <div className="flex flex-col items-center justify-center w-full mb-4">
                        <div className="flex px-4 py-6 flex-col items-center justify-center w-full">
                          <QuestionTitle as="h2">
                            {translations?.labels?.selectQuestion ||
                              "Selecione uma Pergunta"}
                          </QuestionTitle>
                          <div className="text-center text-gray-600 p-3 w-full">
                            Nenhum dado disponível para exibição
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabPanel>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DadosAbertosPage;
