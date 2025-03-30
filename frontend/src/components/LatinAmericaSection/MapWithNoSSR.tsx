import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, GeoJSON, ZoomControl } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../contexts/LanguageContext";
import { getCountryPattern, mapConfig } from "../../data/southAmericaData";

interface MapWithNoSSRProps {
  geoJsonData: any;
}

const MapWithNoSSR: React.FC<MapWithNoSSRProps> = ({ geoJsonData }) => {
  const [isMounted, setIsMounted] = useState(false);
  const navigate = useNavigate();
  const { translations } = useLanguage();

  // Evitar renderização no servidor
  useEffect(() => {
    setIsMounted(true);
  }, []);

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
      const percentageText = percentage
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

  if (!isMounted) return null;

  return (
    <div className="map">
      <MapContainer
        center={mapConfig.center as [number, number]}
        zoom={mapConfig.zoom}
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
          data={geoJsonData}
          style={getCountryStyle}
          onEachFeature={onEachFeature}
        />
      </MapContainer>
    </div>
  );
};

export default MapWithNoSSR;
