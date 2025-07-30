import React from "react";
import { styled } from "@mui/material";
import { useLanguage } from "../../contexts/LanguageContext";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const CarouselContainer = styled(motion.div)`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 30px;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 25px;
  }

  @media (max-width: 992px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 25px;
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 20px;
    padding: 0 16px;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 16px;
    padding: 0 16px;
  }
`;

const Card = styled(motion.div)`
  flex: 1;
  min-width: 240px;
  height: 320px;
  padding: 32px 24px;
  border-radius: 16px;
  background-color: ${(props) => props.color || "#4A2B5C"};
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    height: 300px;
    padding: 24px 20px;
  }

  @media (max-width: 480px) {
    height: auto;
    min-height: 280px;
  }
`;

const CardIcon = styled(motion.div)`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
`;

const CardTitle = styled(motion.h3)`
  color: white;
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 16px;

  @media (max-width: 768px) {
    font-size: 22px;
  }
`;

const CardDescription = styled(motion.p)`
  color: rgba(255, 255, 255, 0.9);
  font-size: 16px;
  line-height: 1.5;

  @media (max-width: 768px) {
    font-size: 15px;
  }
`;

const ExploreCards = () => {
  const { translations } = useLanguage();
  const navigate = useNavigate();

  const cards = [
    {
      title: translations.categories?.policies || "Políticas",
      description:
        translations.categories?.descriptions?.policies ||
        "Legislações e decretos que promovem a participação de mulheres nas áreas STEM",
      icon: "/images/policy-icon.svg",
      color: "#FF6B8B",
      path: "/open-data/1?category=policies",
    },
    {
      title: translations.categories?.initiatives || "Iniciativas",
      description:
        translations.categories?.descriptions?.initiatives ||
        "Eventos, programas e outras ações para inserção e permanência de mulheres nas carreiras de tecnologia",
      icon: "/images/initiatives-icon.svg",
      color: "#FFA07A",
      path: "/open-data/1?category=initiatives",
    },
    {
      title: translations.categories?.factors || "Fatores",
      description:
        translations.categories?.descriptions?.factors ||
        "Dados coletados pela equipe ELLAS para identificar fatores que afetam a presença de mulheres em STEM na América do Sul",
      icon: "/images/factors-icon.svg",
      color: "#E57FB3",
      path: "/open-data/1?category=factors",
    },
    {
      title: translations.categories?.otherData || "Outros Dados",
      description:
        translations.categories?.descriptions?.otherData ||
        "Dados secundários de outras bases de dados associadas ao projeto ELLAS",
      icon: "/images/other-data-icon.svg",
      color: "#B19CD9",
      path: "/open-data/1?category=otherData",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
    hover: {
      scale: 1.05,
      y: -5,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10,
      },
    },
  };

  const iconVariants = {
    hover: {
      rotate: 360,
      scale: 1.2,
      transition: {
        duration: 0.8,
        ease: "easeInOut",
      },
    },
  };

  const handleCardClick = (path) => {
    navigate(path);
  };

  return (
    <CarouselContainer
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {cards.map((card, index) => (
        <Card
          key={index}
          color={card.color}
          variants={cardVariants}
          whileHover="hover"
          onClick={() => handleCardClick(card.path)}
        >
          <CardIcon variants={iconVariants}>
            <motion.img
              src={card.icon}
              alt={card.title}
              width="24"
              height="24"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.2 + 0.5 }}
            />
          </CardIcon>
          <CardTitle>{card.title}</CardTitle>
          <CardDescription
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.2 + 0.7 }}
          >
            {card.description}
          </CardDescription>
        </Card>
      ))}
    </CarouselContainer>
  );
};

export default ExploreCards;
