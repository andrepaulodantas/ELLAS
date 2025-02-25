import React, { createContext, useContext, useState } from "react";

type Language = "pt" | "en" | "es";

interface Translations {
  home: string;
  explore: string;
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
  table: {
    title: string;
    noData: string;
    loading: string;
    search: string;
    rowsPerPage: string;
    of: string;
    next: string;
    previous: string;
  };
  visualization: {
    table: string;
    map: string;
    chart: string;
    bars: string;
    lines: string;
    description: string;
  };
  labels: {
    category: string;
    question: string;
    selectCategory: string;
    selectQuestion: string;
  };
  contact: string;
  categories: {
    policies: string;
    initiatives: string;
    factors: string;
    otherData: string;
  };
  filters: {
    filterBy: string;
    all: string;
    country: string;
    year: string;
    type: string;
  };
  buttons: {
    reset: string;
    apply: string;
    share: string;
    export: string;
    viewAll: string;
  };
  footer: {
    contacts: string;
    connect: string;
    usefulLinks: string;
    accessibility: string;
    terms: string;
    privacy: string;
    rights: string;
  };
  faq: {
    title: string;
    description: string;
    participation: string;
  };
  countries: {
    brasil: string;
    peru: string;
    bolivia: string;
    argentina: string;
  };
  source: {
    inep: string;
  };
}

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  translations: Translations;
}

const translations: Record<Language, Translations> = {
  pt: {
    home: "Home",
    explore: "Explorar",
    about: "Sobre",
    openData: "Dados Abertos",
    support: "Apoie ELLAS",
    login: "Entrar",
    search: "Pesquisar",
    chooseCategory: "Escolha uma Categoria",
    askData: "O que deseja perguntar aos dados?",
    learnMore: "Saiba mais",
    project: "O Projeto",
    team: "A Equipe",
    partners: "Parceiros",
    visualizations: "Visualizações",
    download: "Download",
    api: "API",
    visualization: {
      table: "Visualização em Tabela",
      map: "Iniciativas por País",
      chart: "Visualização em Gráfico",
      bars: "Barras",
      lines: "Linhas",
      description:
        "Explore iniciativas que apoiam mulheres em STEM na América Latina",
    },
    contact: "Contato",
    categories: {
      policies: "Políticas",
      initiatives: "Iniciativas",
      factors: "Fatores",
      otherData: "Outros Dados",
    },
    filters: {
      filterBy: "Filtrar por",
      all: "Todos",
      country: "País",
      year: "Ano",
      type: "Tipo",
    },
    buttons: {
      reset: "Reiniciar",
      apply: "Aplicar",
      share: "Compartilhar",
      export: "Exportar",
      viewAll: "Ver Todos os Dados",
    },
    footer: {
      contacts: "Contatos",
      connect: "Conecte-se ao ELLAS",
      usefulLinks: "Links Úteis",
      accessibility: "Acessibilidade na Web",
      terms: "Termos de Uso",
      privacy: "Política de Privacidade",
      rights: "Todos os direitos reservados",
    },
    faq: {
      title: "Perguntas Frequentes",
      description:
        "Aqui estão algumas perguntas frequentes para ajudar você a entender melhor nossos serviços e iniciativas.",
      participation:
        "Q: Como posso participar? A: Você pode participar através de doações, voluntariado, ou participando de eventos.",
    },
    countries: {
      brasil: "Brasil",
      peru: "Peru",
      bolivia: "Bolívia",
      argentina: "Argentina",
    },
    source: {
      inep: "Fonte: INEP, UNESCO e Dados Secundários da plataforma ELLAS",
    },
    table: {
      title: "Tabela de Dados",
      noData: "Nenhum dado disponível",
      loading: "Carregando dados...",
      search: "Buscar",
      rowsPerPage: "Linhas por página",
      of: "de",
      next: "Próximo",
      previous: "Anterior",
    },
    labels: {
      category: "Categoria",
      question: "Pergunta",
      selectCategory: "Selecione uma Categoria",
      selectQuestion: "Selecione uma Pergunta",
    },
  },
  en: {
    home: "Home",
    explore: "Explore",
    about: "About",
    openData: "Open Data",
    support: "Support ELLAS",
    login: "Login",
    search: "Search",
    chooseCategory: "Choose a Category",
    askData: "What would you like to ask the data?",
    learnMore: "Learn More",
    project: "The Project",
    team: "The Team",
    partners: "Partners",
    visualizations: "Visualizations",
    download: "Download",
    api: "API",
    visualization: {
      table: "Table View",
      map: "Initiatives by Country",
      chart: "Chart View",
      bars: "Bars",
      lines: "Lines",
      description:
        "Explore initiatives supporting women in STEM across Latin America",
    },
    contact: "Contact",
    categories: {
      policies: "Policies",
      initiatives: "Initiatives",
      factors: "Factors",
      otherData: "Other Data",
    },
    filters: {
      filterBy: "Filter by",
      all: "All",
      country: "Country",
      year: "Year",
      type: "Type",
    },
    buttons: {
      reset: "Reset",
      apply: "Apply",
      share: "Share",
      export: "Export",
      viewAll: "View All Data",
    },
    footer: {
      contacts: "Contacts",
      connect: "Connect with ELLAS",
      usefulLinks: "Useful Links",
      accessibility: "Web Accessibility",
      terms: "Terms of Use",
      privacy: "Privacy Policy",
      rights: "All rights reserved",
    },
    faq: {
      title: "Frequently Asked Questions",
      description:
        "Here are some frequently asked questions to help you better understand our services and initiatives.",
      participation:
        "Q: How can I participate? A: You can participate through donations, volunteering, or attending events.",
    },
    countries: {
      brasil: "Brazil",
      peru: "Peru",
      bolivia: "Bolivia",
      argentina: "Argentina",
    },
    source: {
      inep: "Source: INEP, UNESCO and Secondary Data from ELLAS platform",
    },
    table: {
      title: "Data Table",
      noData: "No data available",
      loading: "Loading data...",
      search: "Search",
      rowsPerPage: "Rows per page",
      of: "of",
      next: "Next",
      previous: "Previous",
    },
    labels: {
      category: "Category",
      question: "Question",
      selectCategory: "Select Category",
      selectQuestion: "Select Question",
    },
  },
  es: {
    home: "Home",
    explore: "Explorar",
    about: "Sobre",
    openData: "Datos Abiertos",
    support: "Apoya ELLAS",
    login: "Ingresar",
    search: "Buscar",
    chooseCategory: "Elige una Categoría",
    askData: "¿Qué quieres preguntar a los datos?",
    learnMore: "Saber más",
    project: "El Proyecto",
    team: "El Equipo",
    partners: "Socios",
    visualizations: "Visualizaciones",
    download: "Descargar",
    api: "API",
    visualization: {
      table: "Vista de Tabla",
      map: "Iniciativas por País",
      chart: "Vista de Gráfico",
      bars: "Barras",
      lines: "Líneas",
      description:
        "Explore iniciativas que apoyan a mujeres en STEM en América Latina",
    },
    contact: "Contacto",
    categories: {
      policies: "Políticas",
      initiatives: "Iniciativas",
      factors: "Factores",
      otherData: "Otros Datos",
    },
    filters: {
      filterBy: "Filtrar por",
      all: "Todos",
      country: "País",
      year: "Año",
      type: "Tipo",
    },
    buttons: {
      reset: "Reiniciar",
      apply: "Aplicar",
      share: "Compartir",
      export: "Exportar",
      viewAll: "Ver Todos los Datos",
    },
    footer: {
      contacts: "Contactos",
      connect: "Conéctate con ELLAS",
      usefulLinks: "Enlaces Útiles",
      accessibility: "Accesibilidad Web",
      terms: "Términos de Uso",
      privacy: "Política de Privacidad",
      rights: "Todos los derechos reservados",
    },
    faq: {
      title: "Preguntas Frecuentes",
      description:
        "Aquí hay algunas preguntas frecuentes para ayudarte a comprender mejor nuestros servicios e iniciativas.",
      participation:
        "P: ¿Cómo puedo participar? R: Puedes participar a través de donaciones, voluntariado o asistiendo a eventos.",
    },
    countries: {
      brasil: "Brasil",
      peru: "Perú",
      bolivia: "Bolivia",
      argentina: "Argentina",
    },
    source: {
      inep: "Fuente: INEP, UNESCO y Datos Secundarios de la plataforma ELLAS",
    },
    table: {
      title: "Tabla de Datos",
      noData: "No hay datos disponibles",
      loading: "Cargando datos...",
      search: "Buscar",
      rowsPerPage: "Filas por página",
      of: "de",
      next: "Siguiente",
      previous: "Anterior",
    },
    labels: {
      category: "Categoría",
      question: "Pregunta",
      selectCategory: "Seleccione una Categoría",
      selectQuestion: "Seleccione una Pregunta",
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
