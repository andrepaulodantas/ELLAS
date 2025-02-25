import React, { createContext, useContext, useState } from "react";

type Language = "pt" | "en" | "es";

interface Translations {
  home: string;
  about: string;
  openData: string;
  support: string;
  login: string;
  search: string;
  chooseCategory: string;
  askData: string;
  learnMore: string;
  project: string;
  team: string;
  partners: string;
  visualizations: string;
  download: string;
  api: string;
  visualization: {
    table: string;
    map: string;
    chart: string;
  };
}

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  translations: Translations;
}

const translations: Record<Language, Translations> = {
  pt: {
    home: "Início",
    about: "Sobre",
    openData: "Dados Abertos",
    support: "Apoie ELLAS",
    login: "Entrar",
    search: "Pesquisar",
    chooseCategory: "Escolha uma Categoria",
    askData: "O que deseja perguntar aos dados?",
    learnMore: "Saiba mais",
    project: "O Projeto",
    team: "Equipe",
    partners: "Parceiros",
    visualizations: "Visualizações",
    download: "Download",
    api: "API",
    visualization: {
      table: "Visualização em Tabela",
      map: "Visualização em Mapa",
      chart: "Visualização em Gráfico",
    },
  },
  en: {
    home: "Home",
    about: "About",
    openData: "Open Data",
    support: "Support ELLAS",
    login: "Login",
    search: "Search",
    chooseCategory: "Choose a Category",
    askData: "What would you like to ask the data?",
    learnMore: "Learn More",
    project: "The Project",
    team: "Team",
    partners: "Partners",
    visualizations: "Visualizations",
    download: "Download",
    api: "API",
    visualization: {
      table: "Table View",
      map: "Map View",
      chart: "Chart View",
    },
  },
  es: {
    home: "Inicio",
    about: "Sobre",
    openData: "Datos Abiertos",
    support: "Apoya ELLAS",
    login: "Entrar",
    search: "Buscar",
    chooseCategory: "Elige una Categoría",
    askData: "¿Qué quieres preguntar a los datos?",
    learnMore: "Saber más",
    project: "El Proyecto",
    team: "Equipo",
    partners: "Socios",
    visualizations: "Visualizaciones",
    download: "Descargar",
    api: "API",
    visualization: {
      table: "Vista de Tabla",
      map: "Vista de Mapa",
      chart: "Vista de Gráfico",
    },
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [language, setLanguage] = useState<Language>("pt");

  const value = {
    language,
    setLanguage,
    translations: translations[language],
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
