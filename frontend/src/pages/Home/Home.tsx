import React, { useEffect, useState } from "react";
import { Button, Img, Heading, Text, Slider } from "../../components";
import Header from "../../components/Header";
import { motion } from "framer-motion";
import { fetchInitiativesByCountry } from "../../services/apiService";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import { FaFacebook, FaTwitter, FaLinkedin, FaWhatsapp } from "react-icons/fa";
import SocialMediaLink from "../../components/SocialMediaLink";
import IconWrapper from "../../components/IconWrapper";

const HomePage: React.FC = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);

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
      t("share.text") || "ELLAS - Mulheres Latino-americanas nas Artes";
    window.open(
      `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
      "_blank"
    );
  };

  const shareOnLinkedin = () => {
    const url = window.location.href;
    const title =
      t("share.text") || "ELLAS - Mulheres Latino-americanas nas Artes";
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${url}&title=${title}`,
      "_blank"
    );
  };

  const shareOnWhatsapp = () => {
    const url = window.location.href;
    const text =
      t("share.text") || "ELLAS - Mulheres Latino-americanas nas Artes";
    window.open(`https://api.whatsapp.com/send?text=${text} ${url}`, "_blank");
  };

  useEffect(() => {
    fetchInitiativesByCountry("Brazil")
      .then((data) => {
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);

  const categories = [
    {
      title: t("categories.policies"),
      description: {
        pt: "Legislações e decretos que promovem a participação de mulheres nas áreas STEM",
        es: "Legislaciones y decretos que promueven la participación de mujeres en las áreas STEM",
        en: "Legislation and decrees that promote the participation of women in STEM fields",
      },
      icon: "images/img_iconx24_white_a700.svg",
      bgColor: "bg-red-300",
    },
    {
      title: t("categories.initiatives"),
      description: {
        pt: "Eventos, programas e outras ações para inserção e permanência de mulheres nas carreiras de tecnologia",
        es: "Eventos, programas y otras acciones para la inserción y permanencia de mujeres en carreras de tecnología",
        en: "Events, programs and other actions for the inclusion and retention of women in technology careers",
      },
      icon: "images/img_iconx24_white_a700.svg",
      bgColor: "bg-deep_orange-200",
    },
    {
      title: t("categories.factors"),
      description: {
        pt: "Dados coletados pela equipe ELLAS para identificar fatores que afetam a presença de mulheres em STEM na América do Sul",
        es: "Datos recopilados por el equipo ELLAS para identificar factores que afectan la presencia de mujeres en STEM en América del Sur",
        en: "Data collected by the ELLAS team to identify factors affecting the presence of women in STEM in South America",
      },
      icon: "images/img_iconx24_white_a700.svg",
      bgColor: "bg-pink-300",
    },
    {
      title: t("categories.otherData"),
      description: {
        pt: "Dados secundários de outras bases de dados associadas ao projeto ELLAS",
        es: "Datos secundarios de otras bases de datos asociadas al proyecto ELLAS",
        en: "Secondary data from other databases associated with the ELLAS project",
      },
      icon: "images/img_iconx24_white_a700.svg",
      bgColor: "bg-purple-300",
    },
  ];

  const featuredData = [
    {
      title: t("featured.impactFactors.title"),
      description: t("featured.impactFactors.description"),
      image: "images/img_mask_group.png",
    },
    {
      title: t("featured.initiatives.title"),
      description: t("featured.initiatives.description"),
      image: "images/img_mask_group.png",
    },
    {
      title: t("featured.essentialData.title"),
      description: t("featured.essentialData.description"),
      image: "images/img_mask_group.png",
    },
  ];

  if (loading) {
    return <div>{t("common.loading")}</div>;
  }

  // Get the current language
  const currentLanguage = localStorage.getItem("i18nextLng") || "pt";

  return (
    <>
      <Helmet>
        <title>ELLAS - {t("common.home")}</title>
        <meta name="description" content={t("meta.description")} />
      </Helmet>
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex-grow">
          {/* Hero Section */}
          <section className="relative w-full h-[500px] bg-gradient-to-r from-pink-100 to-purple-100">
            <div className="container mx-auto px-4 h-full flex items-center">
              <div className="w-1/2 pr-8">
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-4xl font-bold mb-4"
                >
                  {t("home.title")}
                </motion.h1>
                <Button
                  className="mt-6"
                  shape="round"
                  size="lg"
                  onClick={() => (window.location.href = "#explore")}
                >
                  {t("buttons.explore")}
                </Button>
              </div>
              <div className="w-1/2">
                <Img
                  src="images/img_hero_image.png"
                  alt={t("alt.hero")}
                  className="w-full h-auto"
                />
              </div>
            </div>
          </section>

          {/* Explore Categories Section */}
          <section id="explore" className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">
              <Heading size="2xl" as="h2" className="text-center mb-12">
                {t("home.exploreData")}
              </Heading>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {categories.map((category, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    className={`${category.bgColor} rounded-[20px] p-6 text-white h-[290px] flex flex-col justify-between`}
                  >
                    <Img
                      src={category.icon}
                      alt={category.title}
                      className="w-6 h-6"
                    />
                    <div>
                      <Heading
                        size="xl"
                        as="h3"
                        className="!text-white-A700 mb-4"
                      >
                        {category.title}
                      </Heading>
                      <Text as="p" className="!text-white-A700">
                        {category.description[currentLanguage] ||
                          category.description.pt}
                      </Text>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Featured Data Section */}
          <section className="py-16 bg-red-50">
            <div className="container mx-auto px-4">
              <Heading size="2xl" as="h2" className="text-center mb-12">
                {t("home.featuredData")}
              </Heading>
              <Text as="p" className="text-center mb-8">
                {t("home.selectFeaturedQuestion")}
              </Text>
              <Slider
                autoPlay
                autoPlayInterval={3000}
                responsive={{
                  0: { items: 1 },
                  768: { items: 2 },
                  1024: { items: 3 },
                }}
                className="w-full"
              >
                {featuredData.map((item, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    className="bg-white rounded-[20px] shadow-md p-6 m-2"
                  >
                    <Img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-48 object-cover rounded-t-lg mb-4"
                    />
                    <Heading size="lg" as="h3" className="mb-2">
                      {item.title}
                    </Heading>
                    <Text as="p" className="text-gray-600">
                      {item.description}
                    </Text>
                  </motion.div>
                ))}
              </Slider>
            </div>
          </section>

          {/* Latin America Map Section */}
          <section className="py-16">
            <div className="container mx-auto px-4">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="w-full md:w-1/2">
                  <Heading size="2xl" as="h2" className="mb-6">
                    {t("home.latinAmerica.title")}
                  </Heading>
                  <Text as="p" className="mb-6">
                    {t("home.latinAmerica.description1")}
                  </Text>
                  <Text as="p" className="mb-6">
                    {t("home.latinAmerica.description2")}
                  </Text>
                  <Button
                    shape="round"
                    size="lg"
                    onClick={() =>
                      (window.location.href =
                        "https://ellas.ufmt.br/pt/sobre-nos/o-projeto/")
                    }
                  >
                    {t("buttons.learnMore")}
                  </Button>
                </div>
                <div className="w-full md:w-1/2">
                  <Img
                    src="images/map_south_america.svg"
                    alt={t("alt.latinAmericaMap")}
                    className="w-full h-auto"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Botões de compartilhamento em redes sociais */}
          <section className="py-8 bg-gray-50">
            <div className="container mx-auto px-4">
              <div className="flex flex-col items-center">
                <Heading size="lg" as="h3" className="mb-4">
                  {t("share.title") || "Compartilhe esse conteúdo"}
                </Heading>
                <div className="flex items-center justify-center space-x-4">
                  <SocialMediaLink
                    onClick={shareOnFacebook}
                    aria-label="Facebook"
                    className="facebook"
                  >
                    <IconWrapper icon={FaFacebook} size={28} />
                  </SocialMediaLink>
                  <SocialMediaLink
                    onClick={shareOnTwitter}
                    aria-label="Twitter"
                    className="twitter"
                  >
                    <IconWrapper icon={FaTwitter} size={28} />
                  </SocialMediaLink>
                  <SocialMediaLink
                    onClick={shareOnLinkedin}
                    aria-label="LinkedIn"
                    className="linkedin"
                  >
                    <IconWrapper icon={FaLinkedin} size={28} />
                  </SocialMediaLink>
                  <SocialMediaLink
                    onClick={shareOnWhatsapp}
                    aria-label="WhatsApp"
                    className="whatsapp"
                  >
                    <IconWrapper icon={FaWhatsapp} size={28} />
                  </SocialMediaLink>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default HomePage;
