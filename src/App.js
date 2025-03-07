import React from "react";
import MapSection from "./components/MapSection";
import LatinAmericaSection from "./components/LatinAmericaSection";
import "./styles.css"; // Global styles

function App() {
  return (
    <div className="app">
      <LatinAmericaSection />
      <MapSection />
      <section className="start-section">
        <div className="container">
          <h2>Não sabe por onde começar?</h2>
          <p className="subtitle">
            Selecione uma das perguntas mais pesquisadas para começar.
          </p>
          {/* Rest of your existing cards content */}
        </div>
      </section>
    </div>
  );
}

export default App;
