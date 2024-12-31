import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { LatLngTuple } from "leaflet";

// Define o tipo para uma iniciativa
type Initiative = {
  initiativeName: string;
  countryName: string;
};

// Define as propriedades do componente GoogleMapComponent
interface GoogleMapProps {
  initiatives: Initiative[];
  selectedCountries?: string[]; // Aceita uma lista de países selecionados
}

const mapContainerStyle = {
  width: "100%",
  height: "100%",
};

// Centro aproximado para visualizar América do Sul
const center: LatLngTuple = [-15, -60];

const GoogleMapComponent: React.FC<GoogleMapProps> = ({
  initiatives,
  selectedCountries,
}) => {
  const [countriesData, setCountriesData] = useState<any[]>([]);

  useEffect(() => {
    // Função para buscar os dados GeoJSON de cada país
    const fetchGeoJson = async () => {
      try {
        const countries = [
          { name: "Brazil", url: "/BRA.geo.json" },
          { name: "Argentina", url: "/ARG.geo.json" },
          { name: "Peru", url: "/PER.geo.json" },
          { name: "Colombia", url: "/COL.geo.json" },
          { name: "Chile", url: "/CHL.geo.json" },
          { name: "Uruguay", url: "/URY.geo.json" },
          { name: "Paraguay", url: "/PRY.geo.json" },
          { name: "Bolivia", url: "/BOL.geo.json" },
          { name: "Venezuela", url: "/VEN.geo.json" },
          { name: "Ecuador", url: "/ECU.geo.json" },
          { name: "Guyana", url: "/GUY.geo.json" },
          { name: "Suriname", url: "/SUR.geo.json" },
          { name: "French Guiana", url: "/GUF.geo.json" },
          { name: "United States", url: "/USA.geo.json" },
          { name: "Canada", url: "/CAN.geo.json" },
          { name: "Mexico", url: "/MEX.geo.json" },
          // Adicione mais países conforme necessário
        ];

        const geoJsonData = await Promise.all(
          countries.map(async (country) => {
            const response = await fetch(country.url);
            const data = await response.json();
            return { countryName: country.name, data };
          })
        );

        setCountriesData(geoJsonData);
      } catch (error) {
        console.error("Erro ao buscar dados GeoJSON", error);
      }
    };

    fetchGeoJson();
  }, []);

  // Função para definir o estilo de cada país
  const getStyle = (countryName: string) => {
    if (selectedCountries?.includes(countryName)) {
      return {
        color: "#ff0000", // Borda vermelha para os países selecionados
        weight: 2,
        fillColor: "#ffcccc", // Preenchimento vermelho claro
        fillOpacity: 1,
      };
    } else {
      return {
        color: "#000000", // Borda preta para países não selecionados
        weight: 1,
        fillColor: "none", // Sem preenchimento
        fillOpacity: 0,
      };
    }
  };

  return (
    <MapContainer style={mapContainerStyle} center={center} zoom={4} scrollWheelZoom={true}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {countriesData.map((country, index) => (
        <GeoJSON key={index} data={country.data} style={() => getStyle(country.countryName)} />
      ))}
    </MapContainer>
  );
};

export default GoogleMapComponent;
