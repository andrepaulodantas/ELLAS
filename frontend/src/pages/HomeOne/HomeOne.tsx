import React, { useEffect } from "react";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Text,
  Img,
  Heading,
  Button,
  Slider,
  DataChart,
} from "../../components";
import LatinAmericaSection from "../../components/LatinAmericaSection";
import Header from "../../components/Header";
import { useLanguage } from "../../contexts/LanguageContext";
import ExploreCards from "../../components/ExploreCards";
import StartSection from "../../components/StartSection";
import "./HomeOne.css";

const HomeOnePage = () => {
  const navigate = useNavigate();
  const { translations, language } = useLanguage();
  const { t } = useTranslation();

  const handleCardClick = (queryType: string) => {
    const params = new URLSearchParams();

    switch (queryType) {
      case "femaleLeadership":
        params.append("category", "factors");
        params.append(
          "queryType",
          encodeURIComponent(t("homeQueries.femaleLeadership"))
        );
        break;
      case "blackWomenBrazil":
        params.append("category", "initiatives");
        params.append(
          "queryType",
          encodeURIComponent(t("homeQueries.blackWomenBrazil"))
        );
        break;
      case "genderEquality":
        params.append("category", "policies");
        params.append(
          "queryType",
          encodeURIComponent(t("homeQueries.genderEquality"))
        );
        break;
    }

    navigate(`/open-data/1?${params.toString()}`);
  };

  // Definindo textos dos cards destacados baseados no idioma
  const featuredCardsData = {
    pt: [
      {
        title: "Fatores de impacto nas lideranças femininas",
        description:
          "Conheça os principais fatores que impactam as lideranças femininas na América Latina...",
        image: "images/img_mask_group.png",
        alt: "Fatores de impacto",
      },
      {
        title: "Aumento de iniciativas para mulheres negras no Brasil",
        description:
          "Iniciativas para mulheres negras dobraram no Brasil a partir de 2018...",
        image: "images/img_mask_group2.png",
        alt: "Iniciativas para mulheres negras",
      },
      {
        title: "Dados essenciais sobre igualdade de gênero",
        description:
          "Gráficos sobre igualdade de gênero na América Latina que todos deveriam conhecer...",
        image: "images/img_mask_group3.png",
        alt: "Dados essenciais",
      },
    ],
    en: [
      {
        title: "Impact factors on female leadership",
        description:
          "Learn about the main factors impacting female leadership in Latin America...",
        image: "images/img_mask_group.png",
        alt: "Impact factors",
      },
      {
        title: "Increase in initiatives for Black women in Brazil",
        description:
          "Initiatives for Black women doubled in Brazil since 2018...",
        image: "images/img_mask_group2.png",
        alt: "Initiatives for Black women",
      },
      {
        title: "Essential data on gender equality",
        description:
          "Charts on gender equality in Latin America that everyone should know...",
        image: "images/img_mask_group3.png",
        alt: "Essential data",
      },
    ],
    es: [
      {
        title: "Factores de impacto en liderazgos femeninos",
        description:
          "Conozca los principales factores que impactan los liderazgos femeninos en América Latina...",
        image: "images/img_mask_group.png",
        alt: "Factores de impacto",
      },
      {
        title: "Aumento de iniciativas para mujeres negras en Brasil",
        description:
          "Las iniciativas para mujeres negras se duplicaron en Brasil desde 2018...",
        image: "images/img_mask_group2.png",
        alt: "Iniciativas para mujeres negras",
      },
      {
        title: "Datos esenciales sobre igualdad de género",
        description:
          "Gráficos sobre igualdad de género en América Latina que todos deberían conocer...",
        image: "images/img_mask_group3.png",
        alt: "Datos esenciales",
      },
    ],
  };

  // Usar cards destacados baseados no idioma atual
  const currentFeaturedCards =
    featuredCardsData[language as keyof typeof featuredCardsData] ||
    featuredCardsData.pt;

  // Unused variables commented out to remove warnings
  // const percentages = [
  //   { range: "01-25%", color: "bg-red-300" },
  //   { range: "26-50%", color: "bg-red-400" },
  //   { range: "51-75%", color: "bg-red-500" },
  //   { range: "76-100%", color: "bg-red-600" },
  //   { range: translations?.filters?.noData || "No data", color: "bg-gray-300" },
  // ];

  // const handleAboutClick = () => {
  //   window.location.href = "https://ellas.ufmt.br/pt/sobre-nos/o-projeto/";
  // };

  useEffect(() => {
    // Map data fetch commented out as variables are not used
    /*
    const fetchData = async () => {
      const fetchFunction =
        questionFunctions["What data source are used for initiative?"];
      if (fetchFunction) {
        try {
          const response = await fetchFunction();
          if (response?.results?.bindings.length > 0) {
            const formattedData = response.results.bindings.map(
              (item: any) => ({
                country: item.countryName?.value || null,
                name:
                  item.policyName?.value || item.initiativeName?.value || null,
              })
            );

            // setMapData(formattedData);
            const countries = formattedData
              .map((item) => item.country)
              .filter(
                (country) =>
                  typeof country === "string" && country.trim() !== ""
              );
            // setHighlightedCountries(countries);
          }
        } catch (error) {
          console.error("Error fetching map data:", error);
        }
      }
    };

    fetchData();
    */
  }, []);

  return (
    <>
      <Helmet>
        <title>ELLAS</title>
        <meta
          name="description"
          content="Web site created using create-react-app"
        />
      </Helmet>
      <div className="flex flex-col min-h-screen">
        <Header />

        {/* Seção de Explorar */}
        <section className="py-16 md:py-20 bg-gray-50">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="text-center mb-8 md:mb-12">
              <Heading size="xl" as="h2" className="mb-3 md:mb-4">
                {translations?.explore || "Explore"}
              </Heading>
              <Text as="p" className="text-gray-600 max-w-2xl mx-auto px-2">
                {translations?.exploreDescription || "Explore the ELLAS portal"}
              </Text>
            </div>
            <ExploreCards />
          </div>
        </section>

        <div className="flex-grow">
          <div className="flex flex-col items-center justify-start w-full bg-white-A700">
            {/* Featured Questions Section */}
            <StartSection />

            <DataChart />

            {/* Latin America Section */}
            <div className="py-16 md:py-20">
              <LatinAmericaSection />
            </div>

            {/* Slider Section */}
            <div className="w-full py-16 md:py-20 bg-pink-50">
              <div className="relative w-full h-[500px] md:h-[600px] lg:h-[702px]">
                <Img
                  src="images/img_fundo_ink_1.png"
                  alt="Fundo Ink"
                  className="absolute w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-[43px]">
                  <Heading
                    size="2xl"
                    as="h2"
                    className="text-center text-purple-800"
                  >
                    {translations?.home?.featuredData || "Featured Data"}
                  </Heading>
                  <Text
                    as="p"
                    className="!text-gray-900 !leading-5 text-center"
                  >
                    {translations?.featuredQuestions?.subtitle ||
                      "Select one of the most searched questions to begin."}
                  </Text>
                  <Slider
                    autoPlay
                    autoPlayInterval={3000}
                    responsive={{
                      "0": { items: 1 },
                      "550": { items: 2 },
                      "1050": { items: 3 },
                    }}
                    className="w-[80%]"
                  >
                    {currentFeaturedCards.map((card, index) => (
                      <div
                        key={index}
                        className="bg-white-A700 rounded-[20px] shadow-md p-5 flex flex-col justify-between h-[400px] mx-4"
                      >
                        <Img
                          src={card.image}
                          alt={card.alt}
                          className="h-[200px] w-full object-cover rounded-t-[20px]"
                        />
                        <Heading
                          size="lg"
                          as="h3"
                          className="!text-purple-800 mt-4"
                        >
                          {card.title}
                        </Heading>
                        <Text as="p" className="!text-gray-700 mt-2">
                          {card.description}
                        </Text>
                        <Button
                          size="sm"
                          shape="round"
                          className="mt-4 self-start"
                          onClick={() => {
                            const queryType =
                              index === 0
                                ? "femaleLeadership"
                                : index === 1
                                ? "blackWomenBrazil"
                                : "genderEquality";
                            handleCardClick(queryType);
                          }}
                        >
                          {translations?.common?.learnMore || "Learn More"}
                        </Button>
                      </div>
                    ))}
                  </Slider>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomeOnePage;
