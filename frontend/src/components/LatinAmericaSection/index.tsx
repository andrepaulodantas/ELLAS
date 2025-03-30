import React from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../contexts/LanguageContext";
import SouthAmericaMap from "../SouthAmericaMap";
import "./styles.css";

const LatinAmericaSection: React.FC = () => {
  const { translations } = useLanguage();
  const navigate = useNavigate();

  const handleLearnMoreClick = () => {
    navigate("/sobre");
  };

  return (
    <section className="latin-america-section">
      <div className="content-container">
        <div className="text-content">
          <h2>{translations.latinAmerica.title}</h2>
          <p>{translations.latinAmerica.description}</p>
        </div>
        <div className="map-interaction-container">
          <div className="map-container">
            <SouthAmericaMap />
          </div>
          <div className="interaction-content">
            <p>{translations.latinAmerica.interaction}</p>
            <button className="learn-more-btn" onClick={handleLearnMoreClick}>
              {translations.latinAmerica.learnMore}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LatinAmericaSection;
