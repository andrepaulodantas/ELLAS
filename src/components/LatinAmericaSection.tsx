import React from "react";
import "./LatinAmericaSection.css";
import SouthAmericaMap from "./SouthAmericaMap";

const LatinAmericaSection: React.FC = () => {
  return (
    <section className="latin-america-section">
      <div className="content-container">
        <div className="text-content">
          <h2>América Latina em foco!</h2>
          <p>
            O portal ELLAS gera e divulga dados abertos conectados como foco em
            países da América Latina. Ele surgiu a partir da união de
            instituições do Brasil, Bolívia e Peru.
          </p>
        </div>
        <div className="map-interaction-container">
          <div className="map-container">
            <SouthAmericaMap />
          </div>
          <div className="interaction-content">
            <p>
              Em uma infraestrutura de dados abertos é possível mapear
              informações, visualizar dados e melhorar a colaboração entre os
              setores de educação, governo e indústria que buscam reduzir a
              diferença de gênero STEM na América Latina.
            </p>
            <button className="learn-more-btn">Saiba mais</button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LatinAmericaSection;
