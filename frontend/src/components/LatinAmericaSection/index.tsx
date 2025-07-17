import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../contexts/LanguageContext";
import {
  countryPercentages,
  southAmericaCountries,
} from "../../data/southAmericaData";
import MapWithNoSSR from "./MapWithNoSSR";
import "./styles.css";

const LatinAmericaSection: React.FC = () => {
  const { translations } = useLanguage();
  const navigate = useNavigate();
  const [geoJsonData, setGeoJsonData] = useState<any>(null);

  useEffect(() => {
    const loadGeoJsonData = async () => {
      try {
        const features: any[] = [];

        for (const countryCode of southAmericaCountries) {
          try {
            const response = await fetch(`/${countryCode}.geo.json`);
            const data = await response.json();

            // Adicionar dados de porcentagem para cada país
            if (data.features && data.features.length > 0) {
              // Usar null diretamente quando não há dados disponíveis
              const percentage = countryPercentages[countryCode];
              data.features[0].properties.percentage = percentage;
              features.push(data.features[0]);
            }
          } catch (error) {
            console.error(
              `Erro ao carregar GeoJSON para ${countryCode}:`,
              error
            );
          }
        }

        setGeoJsonData({
          type: "FeatureCollection",
          features: features,
        });
      } catch (error) {
        console.error("Erro ao carregar dados GeoJSON:", error);
      }
    };

    loadGeoJsonData();
  }, []);

  const handleLearnMoreClick = () => {
    navigate("/buscaone");
  };

  return (
    <section className="latin-america-section">
      <div className="content-container">
        <div className="text-content">
          <h2>
            {translations?.latinAmerica?.title || "¡América Latina en foco!"}
          </h2>
          <p>
            {translations?.latinAmerica?.description ||
              "El portal ELLAS genera y difunde datos abiertos conectados con enfoque en países de América Latina."}
          </p>
        </div>
        <div className="map-interaction-container">
          <div className="map-container">
            {geoJsonData && <MapWithNoSSR geoJsonData={geoJsonData} />}
            <div className="map-legend">
              <div className="legend-item">
                <div className="legend-color pattern-grid"></div>
                <span>01-25%</span>
              </div>
              <div className="legend-item">
                <div className="legend-color pattern-lines"></div>
                <span>26-50%</span>
              </div>
              <div className="legend-item">
                <div className="legend-color pattern-dots"></div>
                <span>51-75%</span>
              </div>
              <div className="legend-item">
                <div className="legend-color pattern-4"></div>
                <span>76-100%</span>
              </div>
              <div className="legend-item">
                <div className="legend-color no-data"></div>
                <span>{translations?.filters?.noData || "No data"}</span>
              </div>
              <div className="legend-source">
                {translations?.source?.inep || "INEP"}
              </div>
            </div>
          </div>
          <div className="interaction-content">
            <p>
              {translations?.latinAmerica?.interaction ||
                "En una infraestructura de datos abiertos es posible mapear información, visualizar datos y mejorar la colaboración entre los sectores."}
            </p>
            <button className="learn-more-btn" onClick={handleLearnMoreClick}>
              {translations?.latinAmerica?.learnMore || "Saber más"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LatinAmericaSection;
