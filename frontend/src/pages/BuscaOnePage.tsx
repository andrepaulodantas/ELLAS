import React, { useEffect } from "react";
import {
  Tabs,
  TabList,
  Tab,
  TabPanel,
  tabStyles,
} from "../components/TabsConfig";
import { useLanguage } from "../contexts/LanguageContext";
import { FaFacebook, FaTwitter, FaLinkedin, FaWhatsapp } from "react-icons/fa";
import IconWrapper from "../components/IconWrapper";

const BuscaOnePage: React.FC = () => {
  const { translations } = useLanguage();

  // Funções de compartilhamento em redes sociais
  const shareOnFacebook = () => {
    const url = window.location.href;
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      "_blank"
    );
  };

  const shareOnTwitter = () => {
    const url = window.location.href;
    const text =
      translations.shareText || "ELLAS - Mulheres Latino-americanas nas Artes";
    window.open(
      `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
      "_blank"
    );
  };

  const shareOnLinkedin = () => {
    const url = window.location.href;
    const title =
      translations.shareText || "ELLAS - Mulheres Latino-americanas nas Artes";
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${url}&title=${title}`,
      "_blank"
    );
  };

  const shareOnWhatsapp = () => {
    const url = window.location.href;
    const text =
      translations.shareText || "ELLAS - Mulheres Latino-americanas nas Artes";
    window.open(`https://api.whatsapp.com/send?text=${text} ${url}`, "_blank");
  };

  return (
    <div className={tabStyles.container}>
      <div className={tabStyles.content}>
        <div className={tabStyles.header}>
          <h1 className={tabStyles.title}>{translations.openData}</h1>
        </div>

        <Tabs>
          <TabList>
            <Tab className={tabStyles.tab}>
              <span className="hidden md:inline">
                {translations.visualization.table}
              </span>
              <span className="md:hidden">
                {translations.visualization.table}
              </span>
            </Tab>
            <Tab className={tabStyles.tab}>
              <span className="hidden md:inline">
                {translations.visualization.map}
              </span>
              <span className="md:hidden">
                {translations.visualization.map}
              </span>
            </Tab>
            <Tab className={tabStyles.tab}>
              <span className="hidden md:inline">
                {translations.visualization.chart}
              </span>
              <span className="md:hidden">
                {translations.visualization.chart}
              </span>
            </Tab>
          </TabList>

          <TabPanel>
            <div className="min-w-full overflow-x-auto">
              <div className="min-h-[400px]">
                <h2 className="text-xl font-semibold mb-4">
                  {translations.visualization.table}
                </h2>
                {/* Add your table component here */}
              </div>
            </div>
          </TabPanel>

          <TabPanel>
            <div className="min-h-[400px]">
              <h2 className="text-xl font-semibold mb-4">
                {translations.visualization.map}
              </h2>
              {/* Add your map component here */}
            </div>
          </TabPanel>

          <TabPanel>
            <div className="min-h-[400px]">
              <h2 className="text-xl font-semibold mb-4">
                {translations.visualization.chart}
              </h2>
              {/* Add your chart component here */}
            </div>
          </TabPanel>
        </Tabs>

        {/* Botões de compartilhamento em redes sociais */}
        <div className="flex items-center justify-center mt-6 space-x-4">
          <p className="text-sm font-medium text-gray-700">
            {translations.share || "Compartilhe"}:
          </p>
          <div className="flex space-x-4">
            <button
              onClick={shareOnFacebook}
              className="text-blue-600 hover:text-blue-800 transition-colors"
              aria-label="Compartilhar no Facebook"
            >
              <IconWrapper icon={FaFacebook} size={24} />
            </button>
            <button
              onClick={shareOnTwitter}
              className="text-blue-400 hover:text-blue-600 transition-colors"
              aria-label="Compartilhar no Twitter"
            >
              <IconWrapper icon={FaTwitter} size={24} />
            </button>
            <button
              onClick={shareOnLinkedin}
              className="text-blue-700 hover:text-blue-900 transition-colors"
              aria-label="Compartilhar no LinkedIn"
            >
              <IconWrapper icon={FaLinkedin} size={24} />
            </button>
            <button
              onClick={shareOnWhatsapp}
              className="text-green-500 hover:text-green-700 transition-colors"
              aria-label="Compartilhar no WhatsApp"
            >
              <IconWrapper icon={FaWhatsapp} size={24} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuscaOnePage;
