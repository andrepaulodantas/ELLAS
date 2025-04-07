import React from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import "./StartSection.css";

const StartSection: React.FC = () => {
  const navigate = useNavigate();
  const { translations, language } = useLanguage();

  // Define questions for each language
  const questionsData = {
    pt: [
      {
        category: "Políticas",
        question:
          "Que tipos de políticas de gênero foram implementadas nos países em determinado ano?",
      },
      {
        category: "Políticas",
        question:
          "Como as políticas identificadas/analisadas estão promovendo a participação das mulheres nas áreas STEM?",
      },
      {
        category: "Iniciativas",
        question: "Que iniciativas são desenvolvidas por nível de escolar?",
      },
      {
        category: "Iniciativas",
        question: "Que iniciativas atendem às mulheres negras?",
      },
      {
        category: "Fatores",
        question:
          "Quais são os fatores contextuais que impactam positiva ou negativamente o gênero feminino?",
      },
      {
        category: "Fatores",
        question:
          "Quais são os fatores contextuais que impactam positiva ou negativamente na liderança, motivação, etc. em cada país?",
      },
    ],
    en: [
      {
        category: "Policies",
        question:
          "What types of gender policies were implemented in countries in a given year?",
      },
      {
        category: "Policies",
        question:
          "How are the identified/analyzed policies promoting women's participation in STEM fields?",
      },
      {
        category: "Initiatives",
        question: "What initiatives are developed by school level?",
      },
      {
        category: "Initiatives",
        question: "What initiatives serve Black women?",
      },
      {
        category: "Factors",
        question:
          "What are the contextual factors that positively or negatively impact the female gender?",
      },
      {
        category: "Factors",
        question:
          "What are the contextual factors that positively or negatively impact leadership, motivation, etc. in each country?",
      },
    ],
    es: [
      {
        category: "Políticas",
        question:
          "¿Qué tipos de políticas de género se implementaron en los países en un año determinado?",
      },
      {
        category: "Políticas",
        question:
          "¿Cómo están promoviendo las políticas identificadas/analizadas la participación de las mujeres en las áreas STEM?",
      },
      {
        category: "Iniciativas",
        question: "¿Qué iniciativas se desarrollan por nivel escolar?",
      },
      {
        category: "Iniciativas",
        question: "¿Qué iniciativas atienden a las mujeres negras?",
      },
      {
        category: "Factores",
        question:
          "¿Cuáles son los factores contextuales que impactan positiva o negativamente al género femenino?",
      },
      {
        category: "Factores",
        question:
          "¿Cuáles son los factores contextuales que impactan positiva o negativamente en el liderazgo, la motivación, etc. en cada país?",
      },
    ],
  };

  // Use questions based on current language
  const questions = questionsData[language] || questionsData.pt;

  return (
    <section className="start-section">
      <div className="container">
        <h2>{translations.featuredQuestions.title}</h2>
        <p className="subtitle">{translations.featuredQuestions.subtitle}</p>

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
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  {(item.category === "Políticas" ||
                    item.category === "Policies") && (
                    <path
                      d="M12 3L20 7V17L12 21L4 17V7L12 3Z"
                      stroke="#6B46C1"
                      strokeWidth="2"
                    />
                  )}
                  {(item.category === "Iniciativas" ||
                    item.category === "Initiatives") && (
                    <path
                      d="M3 12H21M3 6H21M3 18H21"
                      stroke="#6B46C1"
                      strokeWidth="2"
                    />
                  )}
                  {(item.category === "Fatores" ||
                    item.category === "Factors" ||
                    item.category === "Factores") && (
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
  );
};

export default StartSection;
