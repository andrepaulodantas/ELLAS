// Dados de percentuais para cada país da América do Sul
export const countryPercentages: { [key: string]: number | null } = {
  // Porcentagem para cada país (código do país: percentual)
  BRA: 80, // Brasil (26-50%)
  ARG: 55, // Argentina (76-100%)
  BOL: 32, // Bolívia (51-75%)
  CHL: null, // Chile (No data available)
  COL: null, // Colômbia (No data available)
  ECU: null, // Equador (No data available)
  PRY: null, // Paraguai (No data available)
  PER: 18, // Peru (01-25%)
  URY: null, // Uruguai (No data available)
  VEN: null, // Venezuela (No data available)
  GUY: null, // Guiana (No data available)
  SUR: null, // Suriname (No data available)
  GUF: null, // Guiana Francesa (No data available)
};

// Função para obter o padrão de visualização com base na porcentagem
export const getCountryPattern = (percentage: number | undefined | null): string => {
  if (percentage === null || percentage === undefined) return "no-data";
  if (percentage <= 25) return "pattern-grid";
  if (percentage <= 50) return "pattern-lines";
  if (percentage <= 75) return "pattern-dots";
  return "pattern-4";
};

// Lista dos países da América do Sul para carregamento do GeoJSON
export const southAmericaCountries = [
  "BRA",
  "ARG",
  "BOL",
  "CHL",
  "COL",
  "ECU",
  "PRY",
  "PER",
  "URY",
  "VEN",
  "GUY",
  "SUR",
  "GUF",
];

// Configurações do mapa
export const mapConfig = {
  center: [-15.7801, -47.9292], // Centro do Brasil
  zoom: 3,
};
