import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, GeoJSON, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Button, Text } from "../../components";

interface Initiative {
  country: string;
  name: string;
  [key: string]: any;
}

interface MapComponentProps {
  initiatives: Initiative[];
  selectedCountries: string[];
}

const MapComponent: React.FC<MapComponentProps> = ({
  initiatives,
  selectedCountries,
}) => {
  const navigate = useNavigate();
  const [geoJsonData, setGeoJsonData] = useState<{ [key: string]: any }>({});

  useEffect(() => {
    const loadGeoJsonData = async () => {
      const loadedData: { [key: string]: any } = {};

      for (const country of selectedCountries) {
        const countryCode = getCountryCode(country);
        if (countryCode) {
          try {
            const response = await fetch(`/${countryCode}.geo.json`);
            const data = await response.json();
            loadedData[country] = data;
          } catch (error) {
            console.error(`Error loading GeoJSON for ${country}:`, error);
          }
        }
      }

      setGeoJsonData(loadedData);
    };

    loadGeoJsonData();
  }, [selectedCountries]);

  const handleViewAllData = () => {
    navigate("/buscaone?category=initiatives&question=all_initiatives");
  };

  const getCountryStyle = (country: string) => {
    const isSelected = selectedCountries.includes(country);
    return {
      fillColor: isSelected ? "#FF4081" : "#cccccc",
      fillOpacity: isSelected ? 0.6 : 0.3,
      color: "white",
      weight: 1,
    };
  };

  const handleCountryClick = (country: string) => {
    navigate(
      `/buscaone?category=initiatives&question=country_initiatives&country=${country}`
    );
  };

  // Função auxiliar para obter o código do país
  const getCountryCode = (country: string): string => {
    const countryMap: { [key: string]: string } = {
      Brazil: "BRA",
      Argentina: "ARG",
      Chile: "CHL",
      Peru: "PER",
      Bolivia: "BOL",
      Colombia: "COL",
    };
    return countryMap[country] || "";
  };

  return (
    <div className="relative w-full h-full">
      <div className="absolute top-0 left-0 z-10 p-4 bg-white/90 rounded-lg m-4 max-w-md">
        <Text size="md" className="font-semibold mb-2">
          Initiatives by Country
        </Text>
        <Text size="md" className="mb-4">
          Explore initiatives supporting women in STEM across Latin America
        </Text>
        <Button
          size="sm"
          variant="outline"
          onClick={handleViewAllData}
          className="text-sm"
        >
          View All Data
        </Button>
      </div>

      <MapContainer
        center={[-15.7801, -47.9292]} // Center on Brazil
        zoom={4}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {Object.entries(geoJsonData).map(([country, data]) => (
          <GeoJSON
            key={country}
            data={data}
            style={() => getCountryStyle(country)}
            onEachFeature={(feature, layer) => {
              layer.on({
                click: () => handleCountryClick(country),
                mouseover: (e) => {
                  const layer = e.target;
                  layer.setStyle({
                    fillOpacity: 0.8,
                  });
                },
                mouseout: (e) => {
                  const layer = e.target;
                  layer.setStyle(getCountryStyle(country));
                },
              });

              const initiativesCount = initiatives.filter(
                (i) => i.country === country
              ).length;

              layer.bindPopup(`
                <strong>${country}</strong><br/>
                Initiatives: ${initiativesCount}
              `);
            }}
          />
        ))}
      </MapContainer>
    </div>
  );
};

export default MapComponent;
