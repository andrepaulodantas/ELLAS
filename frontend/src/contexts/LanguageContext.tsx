import React, { createContext, useContext, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import i18n from "../i18n";

type Language = "pt" | "en" | "es";

interface Translations {
  home: string;
  explore: string;
  exploreDescription: string;
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
  institutions: string;
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
    descriptions: {
      policies: string;
      initiatives: string;
      factors: string;
      otherData: string;
    };
  };
  filters: {
    filterBy: string;
    all: string;
    country: string;
    year: string;
    type: string;
    noData: string;
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
  featuredQuestions: {
    title: string;
    subtitle: string;
  };
  countries: {
    brasil: string;
    peru: string;
    bolivia: string;
    argentina: string;
  };
  latinAmerica: {
    title: string;
    description: string;
    interaction: string;
    learnMore: string;
  };
  source: {
    inep: string;
  };
  dataChart: {
    centerText1: string;
    centerText2: string;
    title: string;
    description1: string;
    description2: string;
    listItem1: string;
    listItem2: string;
    categories: {
      policies: string;
      factors: string;
      initiatives: string;
      secondary: string;
    };
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
    exploreDescription:
      "O portal ELLAS gera e divulga dados abertos conectados como foco em países da América Latina. Ele surgiu a partir da união de instituições do Brasil, Bolívia e Peru.",
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
    institutions: "Instituições",
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
      descriptions: {
        policies: "Descrição das políticas",
        initiatives: "Descrição das iniciativas",
        factors: "Descrição dos fatores",
        otherData: "Descrição dos outros dados",
      },
    },
    filters: {
      filterBy: "Filtrar por",
      all: "Todos",
      country: "País",
      year: "Ano",
      type: "Tipo",
      noData: "Nenhum dado disponível",
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
    featuredQuestions: {
      title: "Não sabe por onde começar?",
      subtitle: "Selecione uma das perguntas mais pesquisadas para começar.",
    },
    countries: {
      brasil: "Brasil",
      peru: "Peru",
      bolivia: "Bolívia",
      argentina: "Argentina",
    },
    latinAmerica: {
      title: "América Latina em foco!",
      description:
        "O portal ELLAS gera e divulga dados abertos conectados como foco em países da América Latina. Ele surgiu a partir da união de instituições do Brasil, Bolívia e Peru.",
      interaction:
        "Em uma infraestrutura de dados abertos é possível mapear informações, visualizar dados e melhorar a colaboração entre os setores de educação, governo e indústria que buscam reduzir a diferença de gênero STEM na América Latina.",
      learnMore: "Saiba mais",
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
    dataChart: {
      centerText1: "Categorias de",
      centerText2: "Dados no ELLAS",
      title: "Encontre a informação que precisa no Portal ELLAS",
      description1:
        "A falta de dados recentes e confiáveis é parcialmente responsável pelas diferenças de gênero em ciência, tecnologia, engenharia e matemática (STEM) na América Latina.",
      description2:
        "O Portal ELLAS reúne dados de diversas fontes para ajudar pesquisadores, formuladores de políticas e educadores a entender melhor os desafios e oportunidades para mulheres em STEM.",
      listItem1:
        "Avaliar políticas e intervenções de redução da diferença de gênero em STEM, especialmente aumentando o número de mulheres líderes em universidades, indústrias e instituições públicas.",
      listItem2:
        "Mapear fatores que influenciam o desenvolvimento da carreira das mulheres em STEM, documentando e analisando as iniciativas sucedidas ou não para identificar lições aprendidas.",
      categories: {
        policies: "Políticas",
        factors: "Fatores",
        initiatives: "Iniciativas",
        secondary: "Secundários",
      },
    },
  },
  en: {
    home: "Home",
    explore: "Explore",
    exploreDescription:
      "The ELLAS portal generates and disseminates connected open data focusing on Latin American countries. It emerged from the union of institutions from Brazil, Bolivia, and Peru.",
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
    institutions: "Institutions",
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
      descriptions: {
        policies: "Description of policies",
        initiatives: "Description of initiatives",
        factors: "Description of factors",
        otherData: "Description of other data",
      },
    },
    filters: {
      filterBy: "Filter by",
      all: "All",
      country: "Country",
      year: "Year",
      type: "Type",
      noData: "No data available",
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
    featuredQuestions: {
      title: "Not sure where to start?",
      subtitle: "Select one of the most searched questions to begin.",
    },
    countries: {
      brasil: "Brazil",
      peru: "Peru",
      bolivia: "Bolivia",
      argentina: "Argentina",
    },
    latinAmerica: {
      title: "Latin America in focus!",
      description:
        "The ELLAS portal generates and disseminates connected open data focusing on Latin American countries. It emerged from the union of institutions from Brazil, Bolivia, and Peru.",
      interaction:
        "In an open data infrastructure, it is possible to map information, visualize data, and improve collaboration between education, government, and industry sectors seeking to reduce the STEM gender gap in Latin America.",
      learnMore: "Learn more",
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
    dataChart: {
      centerText1: "Data Categories",
      centerText2: "in ELLAS",
      title: "Find the information you need in the ELLAS Portal",
      description1:
        "The lack of recent and reliable data is partially responsible for gender gaps in science, technology, engineering, and mathematics (STEM) in Latin America.",
      description2:
        "The ELLAS Portal gathers data from various sources to help researchers, policy makers, and educators better understand the challenges and opportunities for women in STEM.",
      listItem1:
        "Evaluate policies and interventions to reduce the gender gap in STEM, especially by increasing the number of women leaders in universities, industries, and public institutions.",
      listItem2:
        "Map factors that influence the career development of women in STEM, documenting and analyzing successful and unsuccessful initiatives to identify lessons learned.",
      categories: {
        policies: "Policies",
        factors: "Factors",
        initiatives: "Initiatives",
        secondary: "Secondary",
      },
    },
  },
  es: {
    home: "Home",
    explore: "Explorar",
    exploreDescription:
      "El portal ELLAS genera y difunde datos abiertos conectados con enfoque en países de América Latina. Surgió de la unión de instituciones de Brasil, Bolivia y Perú.",
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
    institutions: "Instituciones",
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
      descriptions: {
        policies: "Descripción de las políticas",
        initiatives: "Descripción de las iniciativas",
        factors: "Descripción de los factores",
        otherData: "Descripción de otros datos",
      },
    },
    filters: {
      filterBy: "Filtrar por",
      all: "Todos",
      country: "País",
      year: "Año",
      type: "Tipo",
      noData: "No hay datos disponibles",
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
    featuredQuestions: {
      title: "¿No sabes por dónde empezar?",
      subtitle: "Selecciona una de las preguntas más buscadas para comenzar.",
    },
    countries: {
      brasil: "Brasil",
      peru: "Perú",
      bolivia: "Bolivia",
      argentina: "Argentina",
    },
    latinAmerica: {
      title: "¡América Latina en foco!",
      description:
        "El portal ELLAS genera y difunde datos abiertos conectados con enfoque en países de América Latina. Surgió de la unión de instituciones de Brasil, Bolivia y Perú.",
      interaction:
        "En una infraestructura de datos abiertos, es posible mapear información, visualizar datos y mejorar la colaboración entre los sectores de educación, gobierno e industria que buscan reducir la brecha de género STEM en América Latina.",
      learnMore: "Saber más",
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
    dataChart: {
      centerText1: "Categorías de",
      centerText2: "Datos en ELLAS",
      title: "Encuentra la información que necesitas en el Portal ELLAS",
      description1:
        "La falta de datos recientes y confiables es parcialmente responsable de las brechas de género en ciencia, tecnología, ingeniería y matemáticas (STEM) en América Latina.",
      description2:
        "El Portal ELLAS reúne datos de diversas fuentes para ayudar a investigadores, formuladores de políticas y educadores a comprender mejor los desafíos y oportunidades para las mujeres en STEM.",
      listItem1:
        "Evaluar políticas e intervenciones para reducir la brecha de género en STEM, especialmente aumentando el número de mujeres líderes en universidades, industrias e instituciones públicas.",
      listItem2:
        "Mapear factores que influyen en el desarrollo de la carrera de las mujeres en STEM, documentando y analizando iniciativas exitosas y no exitosas para identificar lecciones aprendidas.",
      categories: {
        policies: "Políticas",
        factors: "Factores",
        initiatives: "Iniciativas",
        secondary: "Secundarios",
      },
    },
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Get language from localStorage or default to Portuguese
  const [language, setLanguageState] = useState<Language>(() => {
    const savedLanguage = localStorage.getItem("language") as Language;
    return savedLanguage && ["pt", "en", "es"].includes(savedLanguage)
      ? savedLanguage
      : "pt";
  });

  // Initialize i18next with the saved language
  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language]);

  // Update language and save to localStorage
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("language", lang);
    document.documentElement.lang = lang;
    i18n.changeLanguage(lang);
  };

  // Set the document language on initial load
  useEffect(() => {
    document.documentElement.lang = language;
  }, []);

  return (
    <LanguageContext.Provider
      value={{ language, setLanguage, translations: translations[language] }}
    >
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
