import React from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import "./StartSection.css";

const StartSection: React.FC = () => {
  const navigate = useNavigate();
  const { translations } = useLanguage();

  const questions = [
    {
      category: "Políticas",
      question:
        "Que tipos de políticas de gênero foram implementadas nos países em determinado ano?",
    },
    {
      category: "Iniciativas",
      question: "Que iniciativas são desenvolvidas por nível de escolar?",
    },
    {
      category: "Políticas",
      question:
        "Como as políticas identificadas/analisadas estão promovendo a participação das mulheres nas áreas STEM?",
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
  ];

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
  );
};

export default StartSection;
 