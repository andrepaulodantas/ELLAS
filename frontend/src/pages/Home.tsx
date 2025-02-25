import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Img, Heading, Text, Slider } from "../components";
import Header from "../components/Header";
import { motion } from "framer-motion";
import { fetchInitiativesByCountry } from "../services/apiService";
import { Helmet } from "react-helmet";

const HomePage: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [initiatives, setInitiatives] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);

    fetchInitiativesByCountry("Brazil")
      .then((data) => {
        setInitiatives(data.results.bindings);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };

  const categories = [
    {
      title: "Políticas",
      description:
        "Políticas e medidas implementadas nos países da América Latina para inclusão de mulheres na STEM",
      icon: "images/img_iconx24_white_a700.svg",
      bgColor: "bg-red-300",
    },
    {
      title: "Iniciativas",
      description:
        "Eventos, programas e outras ações para a inserção e retenção de mulheres em carreiras tecnológicas",
      icon: "images/img_iconx24_white_a700.svg",
      bgColor: "bg-deep_orange-200",
    },
    {
      title: "Fatores",
      description:
        "Descubra os principais fatores que impactam a liderança feminina na América Latina",
      icon: "images/img_iconx24_white_a700.svg",
      bgColor: "bg-pink-300",
    },
  ];

  const featuredData = [
    {
      title: "Fatores de impacto mais recorrentes",
      description:
        "Conheça os principais fatores que influenciam na liderança feminina na tecnologia",
      image: "images/img_mask_group.png",
    },
    {
      title: "Aumento de iniciativas para mulheres no Brasil",
      description: "Entenda como tem evoluído o apoio às mulheres em STEM",
      image: "images/img_mask_group.png",
    },
    {
      title: "Dados essenciais sobre equidade de gênero",
      description:
        "O portal reúne quantidade de dados por país sobre equidade de gênero",
      image: "images/img_mask_group.png",
    },
  ];

  if (loading) {
    return <div>Loading...</div>;
  }

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
          {/* Hero Section */}
          <section className="relative w-full h-[500px] bg-gradient-to-r from-pink-100 to-purple-100">
            <div className="container mx-auto px-4 h-full flex items-center">
              <div className="w-1/2 pr-8">
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-4xl font-bold mb-4"
                >
                  Dados abertos para Equidade de Gênero em Ciência e Tecnologia
                  na América Latina
                </motion.h1>
                <Button
                  className="mt-6"
                  shape="round"
                  size="lg"
                  onClick={() => (window.location.href = "#explore")}
                >
                  Explorar
                </Button>
              </div>
              <div className="w-1/2">
                <Img
                  src="images/img_hero_image.png"
                  alt="Hero"
                  className="w-full h-auto"
                />
              </div>
            </div>
          </section>

          {/* Explore Categories Section */}
          <section id="explore" className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">
              <Heading size="2xl" as="h2" className="text-center mb-12">
                Explore os dados
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
                        {category.description}
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
                Dados em destaque
              </Heading>
              <Text as="p" className="text-center mb-8">
                Selecione uma das perguntas mais pesquisadas para começar.
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
                    América Latina em foco!
                  </Heading>
                  <Text as="p" className="mb-6">
                    O portal ELLAS para divulgação aberta concentra dados sobre
                    fatores de gênero na América Latina. De origem a coleta de
                    dados de iniciativas de até 10 anos de atuação.
                  </Text>
                  <Text as="p" className="mb-6">
                    Um país representado no mapa abaixo é possível mapear e
                    mensurar dados e informações, resultados obtidos e
                    conclusões a correlação em mais setores de educação STEM na
                    América do Sul.
                  </Text>
                  <Button shape="round" size="lg">
                    Saiba mais
                  </Button>
                </div>
                <div className="w-full md:w-1/2">
                  <Img
                    src="images/map_south_america.svg"
                    alt="Mapa da América Latina"
                    className="w-full h-auto"
                  />
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
