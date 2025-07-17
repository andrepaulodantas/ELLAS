import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Button, Text } from "../../components";
import { useLanguage } from "../../contexts/LanguageContext";

interface Initiative {
  country: string;
  name: string;
  [key: string]: any;
}

interface MapComponentProps {
  initiatives: Initiative[];
  selectedCountries: string[];
  questionTitle?: string;
}

const MapComponent: React.FC<MapComponentProps> = ({
  initiatives,
  selectedCountries,
  questionTitle,
}) => {
  const navigate = useNavigate();
  const { translations, language } = useLanguage();
  const [geoJsonData, setGeoJsonData] = useState<{ [key: string]: any }>({});

  // Load all country GeoJSON data when the component mounts to prevent flickering
  useEffect(() => {
    const loadGeoJsonData = async () => {
      const loadedData: { [key: string]: any } = {};
      // Array of all possible countries we might need to render
      const allPossibleCountries = [
        "Brazil",
        "Argentina",
        "Chile",
        "Peru",
        "Bolivia",
        "Colombia",
        "Mexico",
        "United States",
        "Canada",
        "Ecuador",
        "Venezuela",
        "Paraguay",
        "Uruguay",
        "Guyana",
        "Suriname",
        "French Guiana",
        "Panama",
        "Costa Rica",
        "Nicaragua",
        "Honduras",
        "El Salvador",
        "Guatemala",
        "Belize",
        "Cuba",
        "Jamaica",
        "Haiti",
        "Dominican Republic",
        "Puerto Rico",
        "Bahamas",
        "Trinidad and Tobago",
      ];

      for (const country of allPossibleCountries) {
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
  }, []);

  const handleViewAllData = () => {
    navigate("/buscaone?category=initiatives&question=all_initiatives");
  };

  // Parse country data - to handle cases where multiple countries are listed in one field
  const parseCountryString = (countryString: string) => {
    if (!countryString) return [];
    // Handle common separators like "and", "&", ",", "y", etc.
    const countries = countryString.split(/\s+and\s+|\s*[,&]\s*|\s+y\s+/);
    return countries.map((country) => country.trim()).filter(Boolean);
  };

  const getCountryStyle = (country: string) => {
    // Check if the country is selected either directly or as part of a multi-country entry
    const isSelected = selectedCountries.some((selectedCountry) => {
      const countries = parseCountryString(selectedCountry);
      return countries.some((c) => c.toLowerCase() === country.toLowerCase());
    });

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
    // Normalize country names for both USA and United States
    let normalizedCountry = country;
    if (country === "USA" || country === "United States") {
      normalizedCountry = "United States";
    }

    const countryMap: { [key: string]: string } = {
      Brazil: "BRA",
      Argentina: "ARG",
      Chile: "CHL",
      Peru: "PER",
      Bolivia: "BOL",
      Colombia: "COL",
      Mexico: "MEX",
      "United States": "USA",
      USA: "USA",
      Canada: "CAN",
      Ecuador: "ECU",
      Venezuela: "VEN",
      Paraguay: "PRY",
      Uruguay: "URY",
      Guyana: "GUY",
      Suriname: "SUR",
      "French Guiana": "GUF",
      Panama: "PAN",
      "Costa Rica": "CRI",
      Nicaragua: "NIC",
      Honduras: "HND",
      "El Salvador": "SLV",
      Guatemala: "GTM",
      Belize: "BLZ",
      Cuba: "CUB",
      Jamaica: "JAM",
      Haiti: "HTI",
      "Dominican Republic": "DOM",
      "Puerto Rico": "PRI",
      Bahamas: "BHS",
      "Trinidad and Tobago": "TTO",
    };
    return countryMap[normalizedCountry] || "";
  };

  // Get translated country name
  const getTranslatedCountryName = (country: string): string => {
    // Handle USA/United States special case
    if (country === "USA" || country === "United States") {
      return translations.countries.unitedStates || "United States";
    }

    // Try to get from translations based on country key
    const countryKey = Object.keys(translations.countries).find(
      (key) =>
        translations.countries[
          key as keyof typeof translations.countries
        ]?.toLowerCase() === country.toLowerCase()
    );

    if (countryKey) {
      return translations.countries[
        countryKey as keyof typeof translations.countries
      ];
    }

    // Fallback to the original name
    return country;
  };

  // Verificação de segurança para evitar renderização com traduções incompletas
  if (!translations || !translations.buttons) {
    return <div>Carregando mapa...</div>;
  }

  return (
    <div className="relative w-full h-full">
      <div className="absolute top-0 left-0 z-10 p-4 bg-white/90 rounded-lg m-4 max-w-md">
        <Text size="md" className="font-semibold mb-2">
          {translations?.visualization?.map ||
            translations?.tables?.map ||
            "Mapa"}
        </Text>
        <Text size="md" className="mb-4">
          {translations?.visualization?.description ||
            translations?.tables?.description ||
            "Explore iniciativas que apoiam mulheres em STEM na América Latina"}
        </Text>
        <Button
          size="sm"
          variant="outline"
          onClick={handleViewAllData}
          className="text-sm"
        >
          {translations?.buttons?.viewAll || "Ver Todos os Dados"}
        </Button>
      </div>

      <MapContainer
        center={[-15.7801, -47.9292]} // Center on Brazil
        zoom={4}
        style={{ height: "100%", width: "100%" }}
        key={language}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {Object.entries(geoJsonData).map(([country, data]) => {
          // Check if the country should be rendered based on selected countries
          const shouldRender = selectedCountries.some((selectedCountry) => {
            const countries = parseCountryString(selectedCountry);
            return countries.some(
              (c) => c.toLowerCase() === country.toLowerCase()
            );
          });

          if (!shouldRender) return null;

          return (
            <GeoJSON
              key={country}
              data={data}
              style={() => getCountryStyle(country)}
              onEachFeature={(feature, layer) => {
                layer.on({
                  click: () => handleCountryClick(country),
                });

                const initiativesCount = initiatives.filter((i) => {
                  const itemCountry = i.countryName || i.country || "";
                  const countries = parseCountryString(itemCountry);
                  return countries.some(
                    (c) => c.trim().toLowerCase() === country.toLowerCase()
                  );
                }).length;

                layer.bindPopup(`
                  <strong>${getTranslatedCountryName(country)}</strong><br/>
                  ${translations.categories.initiatives}: ${initiativesCount}
                `);
              }}
            />
          );
        })}
      </MapContainer>
    </div>
  );
};

export default MapComponent;
