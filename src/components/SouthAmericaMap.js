import React from "react";

const SouthAmericaMap = () => {
  return (
    <svg
      viewBox="0 0 400 500"
      preserveAspectRatio="xMidYMid meet"
      className="south-america-map"
    >
      <defs>
        {/* Dots pattern */}
        <pattern
          id="pattern-dots"
          width="4"
          height="4"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(45)"
        >
          <circle cx="2" cy="2" r="1" fill="#ff6666" />
        </pattern>

        {/* Lines pattern */}
        <pattern
          id="pattern-lines"
          width="8"
          height="8"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(45)"
        >
          <line x1="0" y1="0" x2="0" y2="8" stroke="#ff9999" strokeWidth="2" />
        </pattern>

        {/* Grid pattern */}
        <pattern
          id="pattern-grid"
          width="8"
          height="8"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M 8 0 L 0 0 0 8"
            fill="none"
            stroke="#ffcccc"
            strokeWidth="1"
          />
        </pattern>
      </defs>

      {/* Brazil */}
      <path
        className="country brazil"
        d="M280,120 L310,130 L320,150 L330,180 L325,220 L315,260 L300,290 L280,310 L250,320 L220,325 L190,320 L170,310 L160,290 L155,260 L160,230 L170,200 L180,180 L200,160 L230,140 L260,130 L280,120"
      />

      {/* Bolivia */}
      <path
        className="country bolivia"
        d="M180,200 L200,210 L220,215 L240,220 L250,230 L245,250 L235,260 L220,265 L200,260 L190,250 L185,235 L180,220 L180,200"
      />

      {/* Peru */}
      <path
        className="country peru"
        d="M160,180 L180,190 L200,195 L220,190 L230,180 L225,160 L215,150 L200,145 L180,150 L170,160 L160,180"
      />

      {/* Other countries (grey) */}
      <path
        className="country no-data"
        d="M150,100 L170,110 L180,130 L175,150 L165,160 L150,155 L140,145 L135,130 L140,115 L150,100"
      />
    </svg>
  );
};

export default SouthAmericaMap;
