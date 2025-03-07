import React, { useEffect, useState } from "react";
import "./styles.css";
import GoogleMapComponent from "../GoogleMap";
import { questionFunctions } from "../../services/apiService";
import { useLanguage } from "../../contexts/LanguageContext";

const LatinAmericaSection: React.FC = () => {
  const { translations } = useLanguage();
  const [mapData, setMapData] = useState<any[]>([]);
  const [highlightedCountries, setHighlightedCountries] = useState<string[]>(
    []
  );

  useEffect(() => {
    const fetchData = async () => {
      const fetchFunction =
        questionFunctions["What data source are used for initiative?"];
      if (fetchFunction) {
        try {
          const response = await fetchFunction();
          if (response?.results?.bindings.length > 0) {
            const formattedData = response.results.bindings.map(
              (item: any) => ({
                country: item.countryName?.value || null,
                name:
                  item.policyName?.value || item.initiativeName?.value || null,
              })
            );

            setMapData(formattedData);
            const countries = formattedData
              .map((item) => item.country)
              .filter(
                (country) =>
                  typeof country === "string" && country.trim() !== ""
              );
            setHighlightedCountries(countries);
          }
        } catch (error) {
          console.error("Error fetching map data:", error);
        }
      }
    };

    fetchData();
  }, []);

  return (
    <section className="latin-america-section">
      <div className="content-container">
        <div className="text-content">
          <h2>{translations.latinAmerica.title}</h2>
          <p>{translations.latinAmerica.description}</p>
        </div>
        <div className="map-interaction-container">
          <div className="map-container">
            <GoogleMapComponent
              initiatives={mapData}
              selectedCountries={highlightedCountries}
            />
          </div>
          <div className="interaction-content">
            <p>{translations.latinAmerica.interaction}</p>
            <button
              onClick={() =>
                (window.location.href =
                  "https://ellas.ufmt.br/pt/sobre-nos/o-projeto/")
              }
              className="learn-more-btn"
            >
              {translations.latinAmerica.learnMore}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LatinAmericaSection;
