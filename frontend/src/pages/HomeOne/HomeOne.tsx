import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import {
  Text,
  Img,
  Heading,
  Button,
  Slider,
  DataChart,
  DataCards,
  Carousel,
} from "../../components";
import LatinAmericaSection from "../../components/LatinAmericaSection";
import GoogleMapComponent from "../../components/GoogleMap";
import Header from "../../components/Header";
import { questionFunctions } from "../../services/apiService";
import { useLanguage } from "../../contexts/LanguageContext";
import ExploreCards from "../../components/ExploreCards";
import "./HomeOne.css";

const HomeOnePage = () => {
  const navigate = useNavigate();
  const { translations, language } = useLanguage();

  const [mapData, setMapData] = useState<any[]>([]);
  const [highlightedCountries, setHighlightedCountries] = useState<string[]>(
    []
  );

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
    featuredCardsData[language] || featuredCardsData.pt;

  const percentages = [
    { range: "01-25%", color: "bg-red-300" },
    { range: "26-50%", color: "bg-red-400" },
    { range: "51-75%", color: "bg-red-500" },
    { range: "76-100%", color: "bg-red-600" },
    { range: translations.filters.noData || "No data", color: "bg-gray-300" },
  ];

  // Define the questions array based on current language
  const questionsData = {
    pt: [
      {
        category: "Políticas",
        question:
          "Que tipos de políticas de gênero foram implementadas nos países em determinado ano?",
        icon: "images/policy-icon.svg",
      },
      {
        category: "Políticas",
        question:
          "Como as políticas identificadas/analisadas estão promovendo a participação das mulheres nas áreas STEM?",
        icon: "images/policy-icon.svg",
      },
      {
        category: "Iniciativas",
        question: "Que iniciativas são desenvolvidas por nível de escolar?",
        icon: "images/initiatives-icon.svg",
      },
      {
        category: "Iniciativas",
        question: "Que iniciativas atendem às mulheres negras?",
        icon: "images/initiatives-icon.svg",
      },
      {
        category: "Fatores",
        question:
          "Quais são os fatores contextuais que impactam positiva ou negativamente o gênero feminino?",
        icon: "images/factors-icon.svg",
      },
      {
        category: "Fatores",
        question:
          "Quais são os fatores contextuais que impactam positiva ou negativamente na liderança, motivação, etc. em cada país?",
        icon: "images/factors-icon.svg",
      },
    ],
    en: [
      {
        category: "Policies",
        question:
          "What types of gender policies were implemented in countries in a given year?",
        icon: "images/policy-icon.svg",
      },
      {
        category: "Policies",
        question:
          "How are the identified/analyzed policies promoting women's participation in STEM fields?",
        icon: "images/policy-icon.svg",
      },
      {
        category: "Initiatives",
        question: "What initiatives are developed by school level?",
        icon: "images/initiatives-icon.svg",
      },
      {
        category: "Initiatives",
        question: "What initiatives serve Black women?",
        icon: "images/initiatives-icon.svg",
      },
      {
        category: "Factors",
        question:
          "What are the contextual factors that positively or negatively impact the female gender?",
        icon: "images/factors-icon.svg",
      },
      {
        category: "Factors",
        question:
          "What are the contextual factors that positively or negatively impact leadership, motivation, etc. in each country?",
        icon: "images/factors-icon.svg",
      },
    ],
    es: [
      {
        category: "Políticas",
        question:
          "¿Qué tipos de políticas de género se implementaron en los países en un año determinado?",
        icon: "images/policy-icon.svg",
      },
      {
        category: "Políticas",
        question:
          "¿Cómo están promoviendo las políticas identificadas/analizadas la participación de las mujeres en las áreas STEM?",
        icon: "images/policy-icon.svg",
      },
      {
        category: "Iniciativas",
        question: "¿Qué iniciativas se desarrollan por nivel escolar?",
        icon: "images/initiatives-icon.svg",
      },
      {
        category: "Iniciativas",
        question: "¿Qué iniciativas atienden a las mujeres negras?",
        icon: "images/initiatives-icon.svg",
      },
      {
        category: "Factores",
        question:
          "¿Cuáles son los factores contextuales que impactan positiva o negativamente al género femenino?",
        icon: "images/factors-icon.svg",
      },
      {
        category: "Factores",
        question:
          "¿Cuáles son los factores contextuales que impactan positiva o negativamente en el liderazgo, la motivación, etc. en cada país?",
        icon: "images/factors-icon.svg",
      },
    ],
  };

  // Use questions based on current language
  const questions = questionsData[language] || questionsData.pt;

  const handleAboutClick = () => {
    window.location.href = "https://ellas.ufmt.br/pt/sobre-nos/o-projeto/";
  };

  useEffect(() => {
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

            setMapData(formattedData);
            const countries = formattedData
              .map((item) => item.country)
              .filter(
                (country) =>
                  typeof country === "string" && country.trim() !== ""
              );
            setHighlightedCountries(countries);
          }
        } catch (error) {
          console.error("Error fetching map data:", error);
        }
      }
    };

    fetchData();
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
                {translations.explore}
              </Heading>
              <Text as="p" className="text-gray-600 max-w-2xl mx-auto px-2">
                {translations.exploreDescription}
              </Text>
            </div>
            <ExploreCards />
          </div>
        </section>

        <div className="flex-grow">
          <div className="flex flex-col items-center justify-start w-full bg-white-A700">
            {/* Featured Questions Section */}
            <section className="start-section py-16 md:py-20">
              <div className="container">
                <h2>{translations.featuredQuestions.title}</h2>
                <p className="subtitle">
                  {translations.featuredQuestions.subtitle}
                </p>

                <div className="cards-grid">
                  {questions.map((item, index) => (
                    <div
                      key={index}
                      className="card"
                      onClick={() =>
                        navigate(
                          `/buscaone?category=${item.category.toLowerCase()}&question=${encodeURIComponent(
                            item.question
                          )}`
                        )
                      }
                    >
                      <div className="card-icon">
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          {item.category === "Políticas" && (
                            <path
                              d="M12 3L20 7V17L12 21L4 17V7L12 3Z"
                              stroke="#6B46C1"
                              strokeWidth="2"
                            />
                          )}
                          {item.category === "Iniciativas" && (
                            <path
                              d="M3 12H21M3 6H21M3 18H21"
                              stroke="#6B46C1"
                              strokeWidth="2"
                            />
                          )}
                          {item.category === "Fatores" && (
                            <path
                              d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                              stroke="#6B46C1"
                              strokeWidth="2"
                            />
                          )}
                        </svg>
                      </div>
                      <h3>{item.category}</h3>
                      <p>{item.question}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

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
                    {translations.featuredData}
                  </Heading>
                  <Text
                    as="p"
                    className="!text-gray-900 !leading-5 text-center"
                  >
                    {translations.featuredQuestions.subtitle}
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
                          onClick={() => navigate("/sobre")}
                        >
                          {translations.learnMore}
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
