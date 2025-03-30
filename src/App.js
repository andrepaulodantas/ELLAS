import React from "react";
import MapSection from "./components/MapSection";
import LatinAmericaSection from "./components/LatinAmericaSection";
import "./styles.css"; // Global styles
import { useLanguage } from "../frontend/src/contexts/LanguageContext";

function App() {
  const { translations } = useLanguage();

  return (
    <div className="app">
      <LatinAmericaSection />
      <MapSection />
      <section className="start-section">
        <div className="container">
          <h2>{translations.featuredQuestions.title}</h2>
          <p className="subtitle">{translations.featuredQuestions.subtitle}</p>
          {/* Rest of your existing cards content */}
        </div>
      </section>
    </div>
  );
}

export default App;
