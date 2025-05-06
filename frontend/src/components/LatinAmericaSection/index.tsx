import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../contexts/LanguageContext";
import {
  countryPercentages,
  getCountryPattern,
  southAmericaCountries,
  mapConfig,
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

  const getCountryStyle = (feature: any) => {
    const percentage = feature.properties.percentage;
    const pattern = getCountryPattern(percentage);

    return {
      fillColor: "transparent",
      weight: 1.5,
      opacity: 1,
      color: "#fff",
      fillOpacity: 1,
      className: pattern,
    };
  };

  const onEachFeature = (feature: any, layer: any) => {
    if (feature.properties) {
      const { name, percentage } = feature.properties;
      const countryName = translations.countries[name?.toLowerCase()] || name;
      const percentageText = percentage !== null && percentage !== undefined
        ? `${percentage}%`
        : translations.filters.noData;

      layer.bindPopup(`<strong>${countryName}</strong>: ${percentageText}`);

      layer.on({
        click: () => {
          const countryId = feature.id || name;
          if (countryId) {
            navigate(
              `/buscaone?category=initiatives&question=country_initiatives&country=${countryName}`
            );
          }
        },
        mouseover: (e: any) => {
          const layer = e.target;
          layer.setStyle({
            weight: 2,
            color: "#553c9a",
          });
          layer.bringToFront();
        },
        mouseout: (e: any) => {
          const layer = e.target;
          layer.setStyle({
            weight: 1.5,
            color: "#fff",
          });
        },
      });
    }
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
                <span>{translations.filters.noData}</span>
              </div>
              <div className="legend-source">
                {translations.source?.inep || "INEP"}
              </div>
            </div>
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
