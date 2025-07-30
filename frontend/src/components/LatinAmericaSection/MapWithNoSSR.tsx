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
    
    // Determinar a cor com base na porcentagem
    if (percentage === null || percentage === undefined) {
      return {
        fillColor: "#e2e8f0", // Cor para 'No data available'
        color: "#fff",
        weight: 1.5,
        opacity: 1,
        fillOpacity: 0.7
      };
    } else if (percentage <= 25) {
      return {
        fillColor: "#ffe6e6", // 01-25%
        color: "#fff",
        weight: 1.5,
        opacity: 1,
        fillOpacity: 0.7
      };
    } else if (percentage <= 50) {
      return {
        fillColor: "#ffcccc", // 26-50%
        color: "#fff",
        weight: 1.5,
        opacity: 1,
        fillOpacity: 0.7
      };
    } else if (percentage <= 75) {
    return {
        fillColor: "#ff9999", // 51-75%
        color: "#fff",
      weight: 1.5,
      opacity: 1,
        fillOpacity: 0.7
      };
    } else {
      return {
        fillColor: "#ff6666", // 76-100%
      color: "#fff",
        weight: 1.5,
        opacity: 1,
        fillOpacity: 0.7
      };
    }
  };

  const getQueryCategory = (percentage: number | null | undefined) => {
    if (percentage === null || percentage === undefined) {
      return null;
    }
    if (percentage <= 25) {
      return "policies"; // Categoria para 01-25%
    } else if (percentage <= 50) {
      return "initiatives"; // Categoria para 26-50%
    } else if (percentage <= 75) {
      return "factors"; // Categoria para 51-75%
    } else {
      return "policies"; // Categoria para 76-100%
    }
  };

  const getQueryType = (percentage: number | null | undefined) => {
    if (percentage === null || percentage === undefined) {
      return null;
    }
    if (percentage <= 25) {
      return "What types of gender policies/processes/practices exist in Latin America?";
    } else if (percentage <= 50) {
      return "Which/How many initiatives are carried out in countries?";
    } else if (percentage <= 75) {
      return "What are the positive contextual factors?";
    } else {
      return "In which countries the policy was applied?";
    }
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
            const category = getQueryCategory(percentage);
            const queryType = getQueryType(percentage);
            
            if (category && queryType) {
              const params = new URLSearchParams();
              params.append('category', category);
              params.append('queryType', encodeURIComponent(queryType));
              
              // Adicionar o país como filtro na consulta
              if (countryName) {
                params.append('country', countryName);
              }
              
              navigate(`/open-data/1?${params.toString()}`);
            } else {
              // Navegação padrão para países sem dados
              navigate('/open-data/1');
            }
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
