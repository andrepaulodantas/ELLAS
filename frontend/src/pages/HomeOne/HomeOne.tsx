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

const HomeOnePage = () => {
  const [sliderState, setSliderState] = React.useState(0);
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

  const handleAboutClick = () => {
    navigate("/about");
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
        <div className="flex-grow">
          <div className="flex flex-col items-center justify-start w-full bg-white-A700">
            <DataChart />
            <div className="flex flex-col items-center justify-start w-full mt-[60px] gap-[60px]">
              <DataCards />
            </div>

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

            {/* Featured Questions Carousel */}
            <div className="w-full py-16 bg-red-50">
              <div className="container mx-auto px-4">
                <Heading size="2xl" as="h2" className="text-center mb-8">
                  Featured Questions
                </Heading>
                <Text as="p" className="text-center mb-12">
                  Select one of these featured questions to explore our data
                </Text>
                <Carousel
                  autoPlay
                  autoPlayInterval={5000}
                  responsive={{
                    0: { items: 1 },
                    768: { items: 2 },
                    1024: { items: 3 },
                  }}
                  className="w-full"
                >
                  {[
                    {
                      title: "What are the most common impact factors?",
                      description:
                        "Discover the key factors influencing women's leadership in technology",
                      image: "images/carousel_impact_factors.jpg",
                      link: "/buscaone?category=factors&question=impact_factors",
                    },
                    {
                      title: "How many initiatives support women in STEM?",
                      description:
                        "Explore initiatives supporting women in STEM across Latin America",
                      image: "images/carousel_initiatives.jpg",
                      link: "/buscaone?category=initiatives&question=stem_support",
                    },
                    {
                      title: "What policies promote gender equity?",
                      description:
                        "Learn about policies promoting gender equity in technology",
                      image: "images/carousel_policies.jpg",
                      link: "/buscaone?category=policies&question=gender_equity",
                    },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-[20px] shadow-md p-6 m-2 transition-transform hover:scale-105"
                      onClick={() => navigate(item.link)}
                      role="button"
                      tabIndex={0}
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
                      <Button
                        className="mt-4"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(item.link);
                        }}
                      >
                        Explore Data
                      </Button>
                    </div>
                  ))}
                </Carousel>
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
