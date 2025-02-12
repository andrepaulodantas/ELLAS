import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import { Text, Img, Heading, Button, Slider } from "../../components";
import AliceCarousel from "react-alice-carousel";
import GoogleMapComponent from "../../components/GoogleMap";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { questionFunctions } from "../../services/apiService";

const HomeOnePage = () => {
  const [sliderState, setSliderState] = React.useState(0);
  const sliderRef = React.useRef<AliceCarousel>(null);
  const navigate = useNavigate();

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
      window.location.href = "https://ellas.ufmt.br/about";
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

  const handleNavigation = (path: string) => () => {
    navigate(path);
  };

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
        <div className="flex-grow pt-[48px] sm:pt-[56px] md:pt-[64px]">
          <div className="flex flex-col items-center justify-start w-full bg-white-A700">
            <div
              className="relative w-full h-[475px] bg-cover bg-center"
              style={{
                backgroundImage: "url('/images/img_fundo_login_logo_688x1365.png')",
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
              <div className="relative flex flex-col md:flex-row items-center justify-between px-4 sm:px-6 lg:px-8 py-8 md:py-16 w-full h-full max-w-7xl mx-auto">
                <div className="text-left md:max-w-[50%] z-10">
                  <Heading 
                    size="2xl" 
                    as="h1" 
                    className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-tight"
                  >
                    Open Data for Gender Equity in Science and Technology in Latin America
                  </Heading>
                  <Button
                    size="sm"
                    shape="round"
                    className="mt-4 md:mt-6"
                    onClick={handleAboutClick}
                  >
                    Learn more
                  </Button>
                </div>
                <div className="relative md:absolute md:right-[10%] md:bottom-0 mt-6 md:mt-0">
                  <Img
                    src="/images/img_women_home01_1.png"
                    alt="Woman smiling"
                    className="h-[200px] sm:h-[250px] md:h-[300px] w-auto object-contain"
                  />
                </div>
              </div>
            </div>

            {/* Map and Text Section */}
            <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between w-full px-6 lg:px-12 py-10 gap-10 bg-white">
              {/* Text Section */}
              <div className="flex-1 lg:max-w-[40%]">
                <Heading size="2xl" as="h1" className="text-purple-700">
                  Latin America in Focus!
                </Heading>
                <Text as="p" className="mt-4 text-gray-700 leading-relaxed">
                  The ELLAS portal generates and disseminates open data focused on
                  countries in Latin America. It emerged from the union of
                  institutions from Brazil, Bolivia, and Peru.
                </Text>
                <Text as="p" className="mt-4 text-gray-700 leading-relaxed">
                  With an open data infrastructure, it is possible to map
                  information, visualize data, and improve collaboration between the
                  education, government, and industry sectors, aiming to reduce the
                  STEM gender gap in Latin America.
                </Text>
                <Button
                  size="sm"
                  shape="round"
                  className="mt-6"
                  onClick={handleAboutClick}
                >
                  Learn More
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

            <div className="flex flex-col items-center justify-center w-full px-5">
              <Heading size="2xl" as="h2" className="mt-[47px] text-center">
                Explore the data
              </Heading>
              <Text as="p" className="mt-3.5 !text-gray-900 text-center">
                Click on one of the categories to find data related to them.
              </Text>

              {/* Cards Section */}
              <div className="flex flex-row flex-wrap justify-center items-center gap-10 w-full mt-[38px]">
                <div className="h-[290px] w-[300px] relative bg-red-300_03 rounded-[20px] p-5 flex flex-col justify-between">
                  <Img
                    src="images/img_iconx24.svg"
                    alt="Ícone"
                    className="h-[24px] w-[24px]"
                  />
                  <Heading size="xl" as="h3" className="!text-white-A700">
                    Policies
                  </Heading>
                  <Text as="p" className="!text-white-A700 !leading-5">
                    Legislation and decrees that promote the participation of women
                    in STEM fields
                  </Text>
                </div>
                <div className="h-[290px] w-[300px] relative bg-deep_orange-200 rounded-[20px] p-5 flex flex-col justify-between">
                  <Img
                    src="images/img_iconx24_white_a700.svg"
                    alt="Ícone"
                    className="h-[24px] w-[24px]"
                  />
                  <Heading size="xl" as="h3" className="!text-white-A700">
                    Initiatives
                  </Heading>
                  <Text as="p" className="!text-white-A700 !leading-5">
                    Events, programs, and other actions for the insertion and
                    retention of women in technology careers
                  </Text>
                </div>
                <div className="h-[290px] w-[300px] relative bg-pink-300 rounded-[20px] p-5 flex flex-col justify-between">
                  <Img
                    src="images/img_iconx24_white_a700.svg"
                    alt="Ícone"
                    className="h-[24px] w-[24px]"
                  />
                  <Heading size="xl" as="h3" className="!text-white-A700">
                    Factors
                  </Heading>
                  <Text as="p" className="!text-white-A700 !leading-5">
                    Discover the main factors that impact female leadership in Latin
                    America
                  </Text>
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
                    <Text as="p" className="!text-gray-900 !leading-5 text-center">
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
        <Footer />
      </div>
    </>
  );
};

export default HomeOnePage;