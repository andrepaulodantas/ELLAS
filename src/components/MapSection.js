import React from "react";
import { MapContainer, TileLayer, GeoJSON, ZoomControl } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./MapSection.css";
import { southAmericaData } from "../data/southAmerica";
import { useLanguage } from "../../frontend/src/contexts/LanguageContext";

const MapSection = () => {
  const { translations } = useLanguage();
  const center = [-15.7801, -47.9292]; // Coordinates for Brazil
  const zoom = 4;

  const getCountryPattern = (percentage) => {
    if (!percentage) return "no-data";
    if (percentage <= 25) return "pattern-grid";
    if (percentage <= 50) return "pattern-lines";
    if (percentage <= 75) return "pattern-dots";
    return "pattern-4";
  };

  const getCountryStyle = (feature) => {
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

  const onEachFeature = (feature, layer) => {
    if (feature.properties) {
      const { name, percentage } = feature.properties;
      const countryName = translations.countries[name.toLowerCase()] || name;
      const percentageText = percentage
        ? `${percentage}%`
        : translations.filters.noData;

      layer.bindPopup(`<strong>${countryName}</strong>: ${percentageText}`);

      layer.on({
        mouseover: (e) => {
          const layer = e.target;
          layer.setStyle({
            weight: 2,
            color: "#553c9a",
          });
          layer.bringToFront();
        },
        mouseout: (e) => {
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
    <section className="map-section">
      <div className="map-content">
        <h1>{translations.latinAmerica.title}</h1>
        <p className="description">{translations.latinAmerica.description}</p>
        <p className="sub-description">
          {translations.latinAmerica.interaction}
        </p>
        <button className="saiba-mais">
          {translations.latinAmerica.learnMore}
        </button>
      </div>
      <div className="map-container">
        <div className="map">
          <MapContainer
            center={center}
            zoom={zoom}
            zoomControl={false}
            scrollWheelZoom={true}
            style={{ height: "100%", width: "100%" }}
          >
            <ZoomControl position="topright" />
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              opacity={0.3}
            />
            <GeoJSON
              data={southAmericaData}
              style={getCountryStyle}
              onEachFeature={onEachFeature}
            />
          </MapContainer>
        </div>
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
          <div className="legend-source">{translations.source.inep}</div>
        </div>
      </div>
    </section>
  );
};

export default MapSection;
