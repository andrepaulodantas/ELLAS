import React, { useState, useEffect } from "react";
import { styled } from "@mui/material";
import { useLanguage } from "../../contexts/LanguageContext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

const CarouselContainer = styled("div")`
  width: 300%;
  max-width: 1000px;
  margin: 0 auto;
  padding: 0;
  position: relative;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 100px;
  margin-left: -300px;
`;

const CarouselWrapper = styled("div")`
  width: 100%;
  overflow: hidden;
  position: relative;
`;

const CarouselTrack = styled("div")<{ $currentIndex: number }>`
  display: flex;
  gap: 32px;
  transition: transform 0.5s ease-in-out;
  transform: translateX(calc(-${(props) => props.$currentIndex} * (100% / 3)));
`;

const Card = styled("div")`
  flex: 0 0 280px;
  height: 320px;
  padding: 32px 24px;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
  gap: 16px;
  color: white;
  cursor: pointer;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

const CardIcon = styled("div")`
  width: 48px;
  height: 48px;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 100%;
    height: 100%;
  }
`;

const CardTitle = styled("h3")`
  font-size: 24px;
  font-weight: 600;
  margin: 0;
  color: white;
`;

const CardDescription = styled("p")`
  font-size: 16px;
  line-height: 1.5;
  color: white;
  opacity: 0.9;
  margin: 0;
`;

const NavigationButton = styled("button")`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 60px;
  height: 40px;
  border-radius: 50%;
  background: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 2;

  &:hover {
    background: #f8f8f8;
  }

  &.prev {
    left: -20px;
  }

  &.next {
    right: -20px;
  }

  svg {
    color: #4a2b4e;
    font-size: 24px;
  }
`;

const ExploreCards = () => {
  const { translations } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);

  const cards = [
    {
      icon: "/images/policy-icon.svg",
      title: "Políticas",
      description:
        "Legislações e decretos que promovem a participação de mulheres nas áreas STEM",
      background: "#FF4081",
    },
    {
      icon: "/images/initiatives-icon.svg",
      title: "Iniciativas",
      description:
        "Eventos, programas e outras ações para inserção e permanência de mulheres nas carreiras de tecnologia",
      background: "#FFA07A",
    },
    {
      icon: "/images/factors-icon.svg",
      title: "Fatores",
      description:
        "Dados coletados pela equipe ELLAS para identificar fatores que afetam a presença de mulheres em STEM na América do Sul",
      background: "#FF69B4",
    },
    {
      icon: "/images/other-data-icon.svg",
      title: "Outros Dados",
      description:
        "Dados secundários de outras bases de dados associadas ao projeto ELLAS",
      background: "#9370DB",
    },
  ];

  // Rolar automaticamente a cada 3 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev < cards.length - 1 ? prev + 1 : 0));
    }, 3000);

    return () => clearInterval(interval);
  }, [cards.length]);

  const handlePrevClick = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNextClick = () => {
    setCurrentIndex((prev) => Math.min(cards.length - 1, prev + 1));
  };

  return (
    <CarouselContainer>
      <NavigationButton
        className="prev"
        onClick={handlePrevClick}
        style={{ visibility: currentIndex <= 0 ? "hidden" : "visible" }}
      >
        <NavigateBeforeIcon />
      </NavigationButton>

      <CarouselWrapper>
        <CarouselTrack $currentIndex={currentIndex}>
          {cards.map((card, index) => (
            <Card key={index} style={{ backgroundColor: card.background }}>
              <CardIcon>
                <img src={card.icon} alt={card.title} />
              </CardIcon>
              <CardTitle>{card.title}</CardTitle>
              <CardDescription>{card.description}</CardDescription>
            </Card>
          ))}
        </CarouselTrack>
      </CarouselWrapper>

      <NavigationButton
        className="next"
        onClick={handleNextClick}
        style={{
          visibility: currentIndex >= cards.length - 1 ? "hidden" : "visible",
        }}
      >
        <NavigateNextIcon />
      </NavigationButton>
    </CarouselContainer>
  );
};

export default ExploreCards;
