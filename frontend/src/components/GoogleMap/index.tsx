// src/components/GoogleMapComponent.tsx

import React, { useEffect, useState, useMemo } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { LatLngTuple } from "leaflet";

// Define the type for an initiative
type Initiative = {
  initiativeName: string;
  countryName: string;
};

// Define the props for GoogleMapComponent
interface GoogleMapProps {
  initiatives: Initiative[];
  selectedCategory?: string | null;
  selectedQuestion?: string | null;
  selectedTime?: string | null;
}

const mapContainerStyle = {
  width: "100%",
  height: "100%",
};

const center: LatLngTuple = [-15, -60]; // Centro aproximado para visualizar América do Sul

const GoogleMapComponent: React.FC<GoogleMapProps> = ({
  initiatives,
  selectedCategory = null,
  selectedQuestion = null,
  selectedTime = null,
}) => {
  const [countriesData, setCountriesData] = useState<any[]>([]);

  useEffect(() => {
    // Função para buscar dados GeoJSON de cada país
    const fetchGeoJson = async () => {
      try {
        const responseBrazil = await fetch("/brasil.geojson");
        const responseArgentina = await fetch("/argentina.geojson");
        // Adicione mais países conforme necessário

        const brazilData = await responseBrazil.json();
        const argentinaData = await responseArgentina.json();

        setCountriesData([
          { countryName: "Brazil", data: brazilData },
          { countryName: "Argentina", data: argentinaData },
          // Adicione mais países conforme necessário
        ]);
      } catch (error) {
        console.error("Erro ao buscar dados GeoJSON", error);
      }
    };

    fetchGeoJson();
  }, []);

  // Função para contar iniciativas por país
  const countryInitiativeCount = useMemo(() => {
    const counts: { [key: string]: number } = {};

    // Filter initiatives based on selected criteria
    const filteredInitiatives = initiatives.filter((initiative) => {
      // Ensure the properties are defined before using includes method
      return (
        (selectedCategory ? initiative.countryName?.includes(selectedCategory) : true) &&
        (selectedQuestion ? initiative.initiativeName?.includes(selectedQuestion) : true) &&
        (selectedTime ? initiative.initiativeName?.includes(selectedTime) : true)
      );
    });

    // Conta as iniciativas por país
    filteredInitiatives.forEach((initiative) => {
      if (counts[initiative.countryName]) {
        counts[initiative.countryName] += 1;
      } else {
        counts[initiative.countryName] = 1;
      }
    });

    return counts;
  }, [initiatives, selectedCategory, selectedQuestion, selectedTime]);

  // Função para definir o estilo com base na quantidade
  const getStyle = (countryName: string) => {
    const quantidade = countryInitiativeCount[countryName] || 0;

    if (quantidade <= 5) {
      return {
        color: "#ffffff", // Cor de borda
        weight: 1,
        fillColor: "url(#texture1)", // Textura para 0-5
        fillOpacity: 1,
      };
    } else if (quantidade <= 10) {
      return {
        color: "#ffffff",
        weight: 1,
        fillColor: "url(#texture2)", // Textura para 6-10
        fillOpacity: 1,
      };
    } else if (quantidade <= 15) {
      return {
        color: "#ffffff",
        weight: 1,
        fillColor: "url(#texture3)", // Textura para 11-15
        fillOpacity: 1,
      };
    } else {
      return {
        color: "#ffffff",
        weight: 1,
        fillColor: "url(#texture4)", // Textura para 16+
        fillOpacity: 1,
      };
    }
  };

  return (
    <MapContainer
      style={mapContainerStyle}
      center={center}
      zoom={4}
      scrollWheelZoom={true}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <svg width="0" height="0">
        {/* Define texturas como padrões de preenchimento em SVG */}
        <defs>
          <pattern
            id="texture1"
            patternUnits="userSpaceOnUse"
            width="10"
            height="10"
          >
            <rect width="10" height="10" fill="#ffcccc" />
            <line
              x1="0"
              y1="0"
              x2="10"
              y2="10"
              stroke="#ff6666"
              strokeWidth="1"
            />
          </pattern>
          <pattern
            id="texture2"
            patternUnits="userSpaceOnUse"
            width="10"
            height="10"
          >
            <circle cx="5" cy="5" r="4" fill="#ff6666" />
          </pattern>
          <pattern
            id="texture3"
            patternUnits="userSpaceOnUse"
            width="10"
            height="10"
          >
            <rect width="10" height="10" fill="#ff6666" />
            <line
              x1="0"
              y1="10"
              x2="10"
              y2="0"
              stroke="#cc3333"
              strokeWidth="1"
            />
          </pattern>
          <pattern
            id="texture4"
            patternUnits="userSpaceOnUse"
            width="10"
            height="10"
          >
            <rect width="10" height="10" fill="#cc3333" />
            <line
              x1="0"
              y1="5"
              x2="10"
              y2="5"
              stroke="#990000"
              strokeWidth="1"
            />
            <line
              x1="5"
              y1="0"
              x2="5"
              y2="10"
              stroke="#990000"
              strokeWidth="1"
            />
          </pattern>
        </defs>
      </svg>
      {countriesData.map((country, index) => (
        <GeoJSON
          key={index}
          data={country.data}
          style={getStyle(country.countryName)}
        />
      ))}
    </MapContainer>
  );
};

export default GoogleMapComponent;
