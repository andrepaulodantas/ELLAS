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
import GoogleMapComponent from "../../components/GoogleMap";
import Header from "../../components/Header";
import { questionFunctions } from "../../services/apiService";
import { useLanguage } from "../../contexts/LanguageContext";
import ExploreCards from "../../components/ExploreCards";
import NavigateBefore from "@mui/icons-material/NavigateBefore";
import NavigateNext from "@mui/icons-material/NavigateNext";

const HomeOnePage = () => {
  const navigate = useNavigate();
  const { translations } = useLanguage();

  const [mapData, setMapData] = useState<any[]>([]);
  const [highlightedCountries, setHighlightedCountries] = useState<string[]>(
    []
  );

  const percentages = [
    { range: "01-25%", color: "bg-red-300" },
    { range: "26-50%", color: "bg-red-400" },
    { range: "51-75%", color: "bg-red-500" },
    { range: "76-100%", color: "bg-red-600" },
    { range: "No data", color: "bg-gray-300" },
  ];

  // Define the questions array
  const questions = [
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
  ];

  const handleAboutClick = () => {
    navigate("/sobre");
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
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <Heading size="xl" as="h2" className="mb-4">
                Explorar
              </Heading>
              <Text as="p" className="text-gray-600 max-w-2xl mx-auto">
                Descubra dados e informações sobre iniciativas e políticas para
                equidade de gênero na América Latina
              </Text>
            </div>
            <ExploreCards />
          </div>
        </section>
        <div className="flex-grow">
          <div className="flex flex-col items-center justify-start w-full bg-white-A700">
            <DataChart />
            <div className="flex flex-col items-center justify-start w-full mt-[60px] gap-[60px]"></div>

            {/* Map and Text Section */}
            <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between w-full px-6 lg:px-12 py-10 gap-10 bg-white">
              {/* Text Section */}
              <div className="flex-1 lg:max-w-[40%]">
                <Heading size="2xl" as="h1" className="text-purple-700">
                  {translations.home}
                </Heading>
                <Text as="p" className="mt-4 text-gray-700 leading-relaxed">
                  {translations.openData}
                </Text>
                <Button
                  size="sm"
                  shape="round"
                  className="mt-6"
                  onClick={handleAboutClick}
                >
                  {translations.learnMore}
                </Button>
              </div>

              {/* Map Section */}
              <div className="flex-1 lg:max-w-[60%]">
                <div className="relative w-full h-[500px] border rounded-lg">
                  <GoogleMapComponent
                    initiatives={mapData}
                    selectedCountries={highlightedCountries}
                  />
                </div>

                {/* Legend Section */}
                <div className="flex flex-row justify-center items-center gap-4 mt-6">
                  {percentages.map((item, index) => (
                    <div
                      key={index}
                      className="flex flex-row items-center gap-2 text-sm"
                    >
                      <div
                        className={`w-4 h-4 ${item.color} rounded-full border border-gray-400`}
                      ></div>
                      <Text as="span" className="text-gray-700">
                        {item.range}
                      </Text>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Featured Questions Section */}
            <div className="w-full py-16 bg-gray-50">
              <div className="container mx-auto px-4">
                <Heading
                  size="2xl"
                  as="h2"
                  className="text-purple-800 text-center mb-4"
                >
                  Não sabe por onde começar?
                </Heading>
                <Text as="p" className="text-center mb-12">
                  Selecione uma das perguntas mais pesquisadas para começar.
                </Text>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                  {questions.map((item, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() =>
                        navigate(
                          `/buscaone?category=${item.category.toLowerCase()}&question=${encodeURIComponent(
                            item.question
                          )}`
                        )
                      }
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                          <img
                            src={item.icon}
                            alt={item.category}
                            className="w-5 h-5"
                          />
                        </div>
                        <div>
                          <Text
                            size="lg"
                            as="h3"
                            className="font-medium text-purple-800 mb-2"
                          >
                            {item.category}
                          </Text>
                          <Text as="p" className="text-gray-700">
                            {item.question}
                          </Text>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Slider Section */}
            <div className="w-full mt-[61px] pt-5 bg-red-50">
              <div className="relative w-full h-[702px]">
                <Img
                  src="images/img_fundo_ink_1.png"
                  alt="Fundo Ink"
                  className="absolute w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-[43px]">
                  <Heading size="2xl" as="h2" className="text-center">
                    Featured Data
                  </Heading>
                  <Text
                    as="p"
                    className="!text-gray-900 !leading-5 text-center"
                  >
                    Select one of the most searched questions to get started.
                  </Text>
                  <Slider
                    autoPlay
                    autoPlayInterval={1000}
                    responsive={{
                      "0": { items: 1 },
                      "550": { items: 1 },
                      "1050": { items: 3 },
                    }}
                    className="w-[80%]"
                  >
                    {[...Array(5)].map(() => (
                      <div
                        key={Math.random()}
                        className="bg-white-A700 rounded-[20px] shadow-md p-5 flex flex-col justify-between h-[300px]"
                      >
                        <Img
                          src="images/img_mask_group.png"
                          alt="Featured Image"
                          className="h-[150px] w-full object-cover rounded-t-[20px]"
                        />
                        <Heading size="lg" as="h3" className="!text-gray-900">
                          Title Example
                        </Heading>
                        <Text as="p" className="!text-gray-700">
                          Brief description of the featured data or topic.
                        </Text>
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
