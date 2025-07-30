import React from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { Text, Img, Heading } from "../../components";
import Header from "../../components/Header";
import { useLanguage } from "../../contexts/LanguageContext";

const Home = () => {
  const navigate = useNavigate();
  const { translations } = useLanguage();

  const handleCardClick = (queryType: string) => {
    const params = new URLSearchParams();

    switch (queryType) {
      case "blackWomenBrazil":
        params.append("category", "initiatives");
        params.append(
          "queryType",
          encodeURIComponent("What initiatives serve black women?")
        );
        params.append("country", "Brazil");
        break;
      case "genderEquality":
        params.append("category", "policies");
        params.append(
          "queryType",
          encodeURIComponent(
            "What types of gender policies/processes/practices exist in Latin America?"
          )
        );
        break;
      case "femaleLeadership":
        params.append("category", "factors");
        params.append(
          "queryType",
          encodeURIComponent(
            "What are the CONTEXTUAL FACTORS that impact Positively/Negatively on IMPACT (IMPACT=Leadership, permanence, motivation, others)?"
          )
        );
        break;
    }

    navigate(`/open-data/1?${params.toString()}`);
  };

  return (
    <>
      <Helmet>
        <title>ELLAS - Home</title>
        <meta
          name="description"
          content="Web site created using create-react-app"
        />
      </Helmet>
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex-grow">
          <div className="flex flex-col items-center justify-start w-full bg-white-A700">
            <div className="flex flex-col items-center justify-start w-full">
              <div className="flex flex-col items-center justify-start w-full max-w-[1331px] p-6">
                <Heading size="2xl" as="h1" className="text-center mb-4">
                  {translations?.home?.featuredData || "Featured Data"}
                </Heading>
                <Text size="md" as="p" className="text-center mb-8">
                  {translations?.home?.selectQuestion ||
                    "Select one of the most searched questions to begin."}
                </Text>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                  {/* Card 1 - Black Women in Brazil */}
                  <div
                    className="rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer bg-white"
                    onClick={() => handleCardClick("blackWomenBrazil")}
                  >
                    <div className="aspect-w-16 aspect-h-9 bg-pink-100">
                      <img
                        src="/images/img_graph.png"
                        alt="Graph"
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="p-4">
                      <Heading
                        size="lg"
                        as="h2"
                        className="mb-2 text-purple-800"
                      >
                        {translations.home?.cards?.blackWomen?.title ||
                          "Increase in initiatives for Black women in Brazil"}
                      </Heading>
                      <Text size="md" as="p" className="text-gray-600">
                        {translations.home?.cards?.blackWomen?.description ||
                          "Initiatives for Black women doubled in Brazil since 2018..."}
                      </Text>
                      <button className="mt-4 text-purple-800 font-medium hover:text-purple-900">
                        {translations.common?.learnMore || "Learn More"}
                      </button>
                    </div>
                  </div>

                  {/* Card 2 - Gender Equality */}
                  <div
                    className="rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer bg-white"
                    onClick={() => handleCardClick("genderEquality")}
                  >
                    <div className="aspect-w-16 aspect-h-9">
                      <img
                        src="/images/img_gender_equality.png"
                        alt="Gender Equality"
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="p-4">
                      <Heading
                        size="lg"
                        as="h2"
                        className="mb-2 text-purple-800"
                      >
                        {translations.home?.cards?.genderEquality?.title ||
                          "Essential data on gender equality"}
                      </Heading>
                      <Text size="md" as="p" className="text-gray-600">
                        {translations.home?.cards?.genderEquality
                          ?.description ||
                          "Charts on gender equality in Latin America that everyone should know..."}
                      </Text>
                      <button className="mt-4 text-purple-800 font-medium hover:text-purple-900">
                        {translations.common?.learnMore || "Learn More"}
                      </button>
                    </div>
                  </div>

                  {/* Card 3 - Female Leadership */}
                  <div
                    className="rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer bg-white"
                    onClick={() => handleCardClick("femaleLeadership")}
                  >
                    <div className="aspect-w-16 aspect-h-9">
                      <img
                        src="/images/img_leadership.png"
                        alt="Leadership"
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="p-4">
                      <Heading
                        size="lg"
                        as="h2"
                        className="mb-2 text-purple-800"
                      >
                        {translations.home?.cards?.femaleLeadership?.title ||
                          "Impact factors on female leadership"}
                      </Heading>
                      <Text size="md" as="p" className="text-gray-600">
                        {translations.home?.cards?.femaleLeadership
                          ?.description ||
                          "Learn about the main factors impacting female leadership in Latin America..."}
                      </Text>
                      <button className="mt-4 text-purple-800 font-medium hover:text-purple-900">
                        {translations.common?.learnMore || "Learn More"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
