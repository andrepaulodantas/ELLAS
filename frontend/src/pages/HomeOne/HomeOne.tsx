import React from "react";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import { Text, Img, Heading, Button, Slider } from "../../components";
import AliceCarousel, { EventObject, DotsItem } from "react-alice-carousel";
import Header from "components/Header";
import Footer from "components/Footer";

export default function HomeOnePage() {
  // Slider states and refs for controlling the carousels
  const [sliderState, setSliderState] = React.useState(0);
  const sliderRef = React.useRef<AliceCarousel>(null);
  const [sliderState1, setSliderState1] = React.useState(0);
  const sliderRef1 = React.useRef<AliceCarousel>(null);
  const navigate = useNavigate();

  // Handles navigation to a given path
  const handleNavigation = (path: string) => () => {
    navigate(path);
  };

  const handleSupportClick = () => {
    window.location.href = "https://ellas.ufmt.br/support-ellas/"; // Redirecionamento Externo
  };

  const handleAboutClick = () => {
    window.location.href = "https://ellas.ufmt.br/about"; // Redirecionamento Externo
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
      <div className="flex flex-col items-center justify-start w-full bg-white-A700">
        <Header />
        {/* Hero Section */}
        <div
          className="relative w-full h-[475px] bg-cover"
          style={{
            backgroundImage: "url('/images/img_fundo_login_logo_688x1365.png')",
          }}
        >
          <div className="flex flex-row items-center justify-between px-8 py-16 w-full h-full bg-gradient-to-r from-black/50 to-transparent">
            <div className="text-left">
              <Heading size="2xl" as="h1" className="text-white">
                Open Data for Gender Equity in Science and Technology in Latin
                America
              </Heading>
              <Button
                size="sm"
                shape="round"
                className="mt-4"
                onClick={handleNavigation("/sobre")}
              >
                Learn more
              </Button>
            </div>
            <Img
              src="/images/img_women_home01_1.png"
              alt="Woman smiling"
              className="h-[300px] w-auto"
            />
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
              Legislation and decrees that promote the participation of women in STEM fields
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
              Events, programs, and other actions for the insertion and retention of women in technology careers
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
              Discover the main factors that impact female leadership in Latin America
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
                autoPlayInterval={2000}
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

        {/* Footer Section */}
        <Footer />
        </div>
      </div>
    </>
  );
}