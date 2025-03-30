// Dados de percentuais fictícios para cada país da América do Sul
export const countryPercentages: { [key: string]: number } = {
  // Porcentagem para cada país (código do país: percentual)
  BRA: 85, // Brasil
  ARG: 65, // Argentina
  BOL: 45, // Bolívia
  CHL: 55, // Chile
  COL: 75, // Colômbia
  ECU: 35, // Equador
  PRY: 25, // Paraguai
  PER: 40, // Peru
  URY: 70, // Uruguai
  VEN: 30, // Venezuela
  GUY: 15, // Guiana
  SUR: 20, // Suriname
  GUF: 10, // Guiana Francesa
};

// Função para obter o padrão de visualização com base na porcentagem
export const getCountryPattern = (percentage: number | undefined): string => {
  if (!percentage) return "no-data";
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
