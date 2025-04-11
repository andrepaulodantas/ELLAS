import React from "react";
import { styled } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../contexts/LanguageContext";

const InfoSection = () => {
  const { translations } = useLanguage();
  const navigate = useNavigate();

  const handleSaibaMaisClick = (e) => {
    e.preventDefault();
    navigate("/buscaone");
  };

  return (
    <section className="info-section">
      <div className="info-container">
        <div className="chart-container">
          <svg viewBox="0 0 100 100" width="100%" height="100%">
            {/* Donut chart segments */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="#E53E3E"
              strokeWidth="20"
              strokeDasharray="188.5 251.3"
            />
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="#805AD5"
              strokeWidth="20"
              strokeDasharray="62.8 377"
              transform="rotate(-75 50 50)"
            />
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="#ED8936"
              strokeWidth="20"
              strokeDasharray="94.2 345.6"
              transform="rotate(113 50 50)"
            />
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="#F6AD55"
              strokeWidth="20"
              strokeDasharray="31.4 408.4"
              transform="rotate(207 50 50)"
            />
          </svg>
          <div className="chart-center-text">
            {translations.dataChart.centerText1}
            <br />
            {translations.dataChart.centerText2}
          </div>
        </div>

        <div className="content-container">
          <h2>{translations.dataChart.title}</h2>
          <p className="info-description">
            {translations.dataChart.description1}
          </p>
          <p className="info-description">
            {translations.dataChart.description2}
          </p>
          <ul className="info-list">
            <li>{translations.dataChart.listItem1}</li>
            <li>{translations.dataChart.listItem2}</li>
          </ul>

          <div className="legend-container">
            <div className="legend-item">
              <div className="legend-color politicas"></div>
              <span>{translations.dataChart.categories.policies}</span>
            </div>
            <div className="legend-item">
              <div className="legend-color fatores"></div>
              <span>{translations.dataChart.categories.factors}</span>
            </div>
            <div className="legend-item">
              <div className="legend-color iniciativas"></div>
              <span>{translations.dataChart.categories.initiatives}</span>
            </div>
            <div className="legend-item">
              <div className="legend-color secundarios"></div>
              <span>{translations.dataChart.categories.secondary}</span>
            </div>
          </div>

          <button
            onClick={handleSaibaMaisClick}
            className="saiba-mais-button"
          >
            {translations.latinAmerica.learnMore}
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default InfoSection;
