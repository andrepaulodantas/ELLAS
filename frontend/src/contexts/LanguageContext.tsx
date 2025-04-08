import React, { createContext, useContext, useState, useEffect } from "react";
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
  featuredData: string;
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
    selectCountry: string;
    selectYear: string;
    selectPolicyType: string;
    selectGender: string;
    selectAge: string;
    selectLocationType: string;
    enterLocationName: string;
    selectEducationalLevel: string;
    selectStatus: string;
    selectImpactType: string;
    selectContextType: string;
    selectFactor: string;
    filters: string;
    currentQuery: string;
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
    policyType: string;
    startYear: string;
    audienceGender: string;
    audienceAge: string;
    locationType: string;
    locationName: string;
    educationalLevel: string;
    status: string;
    impactType: string;
    contextType: string;
    factor: string;
    policyTypes: {
      educational: string;
      legislation: string;
      program: string;
    };
    genders: {
      female: string;
      male: string;
      all: string;
    };
    ages: {
      children: string;
      teenagers: string;
      adults: string;
    };
    locationTypes: {
      city: string;
      state: string;
      region: string;
      area: string;
    };
    educationLevels: {
      elementary: string;
      highSchool: string;
      undergraduate: string;
      graduate: string;
    };
    statuses: {
      active: string;
      finished: string;
      design: string;
    };
    impactTypes: {
      positive: string;
      negative: string;
    };
    contextTypes: {
      university: string;
      society: string;
      workplace: string;
    };
    factors: {
      educational: string;
      social: string;
      genderStereotypes: string;
    };
  };
  queries: {
    policies: {
      countriesApplied: string;
      genderPolicyTypes: string;
      womenParticipation: string;
      since2015: string;
    };
    initiatives: {
      byCountries: string;
      dataSource: string;
      socialNetworks: string;
      programInitiatives: string;
      publicPrivate: string;
      coordinatedIndividuals: string;
      responsibleGender: string;
      objective: string;
      modality: string;
      girlsAdolescents: string;
      targetGender: string;
      blackWomen: string;
      schoolLevel: string;
      vulnerableGroup: string;
      schoolCommunity: string;
      cityInitiatives: string;
      stateInitiatives: string;
      areaInitiatives: string;
      regionInitiatives: string;
      initiativeReach: string;
      initiativeFunded: string;
      fundingSector: string;
      activeInitiatives: string;
      designPhase: string;
      finishedInitiatives: string;
      initiativeWebsite: string;
      communityInitiatives: string;
    };
    factors: {
      positiveContextual: string;
      negativeContextual: string;
      educationalFactors: string;
      genderImpact: string;
      factorImpacts: string;
      impactTypes: string;
      impactFactors: string;
    };
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
    colombia: string;
    chile: string;
    mexico: string;
    unitedStates: string;
    canada: string;
    ecuador: string;
    venezuela: string;
    paraguay: string;
    uruguay: string;
    guyana: string;
    suriname: string;
    frenchGuiana: string;
    panama: string;
    costaRica: string;
    nicaragua: string;
    honduras: string;
    elSalvador: string;
    guatemala: string;
    belize: string;
    cuba: string;
    jamaica: string;
    haiti: string;
    dominicanRepublic: string;
    puertoRico: string;
    bahamas: string;
    trinidadAndTobago: string;
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

export const translations: Record<Language, Translations> = {
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
      policyType: "Tipo de Política",
      startYear: "Ano de Início",
      audienceGender: "Gênero do Público",
      audienceAge: "Idade do Público",
      locationType: "Tipo de Localização",
      locationName: "Nome da Localização",
      educationalLevel: "Nível Educacional",
      status: "Status",
      impactType: "Tipo de Impacto",
      contextType: "Tipo de Contexto",
      factor: "Fator",
      policyTypes: {
        educational: "Educacional",
        legislation: "Legislação",
        program: "Programa",
      },
      genders: {
        female: "Feminino",
        male: "Masculino",
        all: "Todos",
      },
      ages: {
        children: "Crianças",
        teenagers: "Adolescentes",
        adults: "Adultos",
      },
      locationTypes: {
        city: "Cidade",
        state: "Estado",
        region: "Região",
        area: "Área",
      },
      educationLevels: {
        elementary: "Ensino Fundamental",
        highSchool: "Ensino Médio",
        undergraduate: "Graduação",
        graduate: "Pós-Graduação",
      },
      statuses: {
        active: "Ativo",
        finished: "Finalizado",
        design: "Em planejamento",
      },
      impactTypes: {
        positive: "Positivo",
        negative: "Negativo",
      },
      contextTypes: {
        university: "Universidade",
        society: "Sociedade",
        workplace: "Ambiente de Trabalho",
      },
      factors: {
        educational: "Educacional",
        social: "Social",
        genderStereotypes: "Estereótipos de Gênero",
      },
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
      colombia: "Colômbia",
      chile: "Chile",
      mexico: "México",
      unitedStates: "Estados Unidos",
      canada: "Canadá",
      ecuador: "Equador",
      venezuela: "Venezuela",
      paraguay: "Paraguai",
      uruguay: "Uruguai",
      guyana: "Guiana",
      suriname: "Suriname",
      frenchGuiana: "Guiana Francesa",
      panama: "Panamá",
      costaRica: "Costa Rica",
      nicaragua: "Nicarágua",
      honduras: "Honduras",
      elSalvador: "El Salvador",
      guatemala: "Guatemala",
      belize: "Belize",
      cuba: "Cuba",
      jamaica: "Jamaica",
      haiti: "Haiti",
      dominicanRepublic: "República Dominicana",
      puertoRico: "Porto Rico",
      bahamas: "Bahamas",
      trinidadAndTobago: "Trinidad e Tobago",
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
      selectCountry: "Selecione um País",
      selectYear: "Selecione um Ano",
      selectPolicyType: "Selecione Tipo de Política",
      selectGender: "Selecione um Gênero",
      selectAge: "Selecione Idade",
      selectLocationType: "Selecione Tipo de Localização",
      enterLocationName: "Digite Nome da Localização",
      selectEducationalLevel: "Selecione Nível Educacional",
      selectStatus: "Selecione Status",
      selectImpactType: "Selecione Tipo de Impacto",
      selectContextType: "Selecione Tipo de Contexto",
      selectFactor: "Selecione Fator",
      filters: "Filtros",
      currentQuery: "Consulta atual",
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
    featuredData: "Dados Destacados",
    queries: {
      policies: {
        countriesApplied:
          "Em quais países da América Latina políticas de incentivo para mulheres na ciência são aplicadas?",
        genderPolicyTypes:
          "Quais são os tipos de políticas de gênero aplicadas na América Latina?",
        womenParticipation:
          "Quais políticas promovem a participação de mulheres em STEM?",
        since2015:
          "Quais políticas foram implementadas nos países da América Latina desde 2015?",
      },
      initiatives: {
        byCountries: "Quais são as iniciativas de incentivo por país?",
        dataSource: "Quais são as fontes de dados para as iniciativas?",
        socialNetworks: "Quais são as redes sociais das iniciativas?",
        programInitiatives: "Quantas iniciativas são do tipo programa?",
        publicPrivate:
          "Quantas iniciativas são públicas e quantas são privadas?",
        coordinatedIndividuals:
          "Quantas iniciativas são coordenadas por indivíduos?",
        responsibleGender: "Qual o gênero do responsável pela iniciativa?",
        objective: "Qual o objetivo da iniciativa?",
        modality: "Qual a modalidade da iniciativa?",
        girlsAdolescents:
          "A iniciativa é voltada para meninas ou adolescentes?",
        targetGender: "Qual o gênero do público-alvo da iniciativa?",
        blackWomen: "A iniciativa é voltada para mulheres negras?",
        schoolLevel: "Qual o nível escolar da iniciativa?",
        vulnerableGroup: "A iniciativa é voltada para grupos vulneráveis?",
        schoolCommunity: "A iniciativa envolve a comunidade escolar?",
        cityInitiatives: "Quantas iniciativas existem por cidade?",
        stateInitiatives: "Quantas iniciativas existem por estado?",
        areaInitiatives: "Quantas iniciativas existem por área?",
        regionInitiatives: "Quantas iniciativas existem por região?",
        initiativeReach: "Qual o alcance da iniciativa?",
        initiativeFunded: "A iniciativa é financiada?",
        fundingSector: "Qual o setor de financiamento da iniciativa?",
        activeInitiatives: "Quantas iniciativas estão ativas?",
        designPhase: "Quantas iniciativas estão em fase de concepção?",
        finishedInitiatives: "Quantas iniciativas foram concluídas?",
        initiativeWebsite: "Qual o website da iniciativa?",
        communityInitiatives: "Quantas iniciativas existem na comunidade?",
      },
      factors: {
        positiveContextual: "Quais são os fatores contextuais positivos?",
        negativeContextual:
          "Quais são os fatores contextuais negativos na instituição?",
        educationalFactors:
          "Quais são os fatores contextuais por tipo de educação?",
        genderImpact:
          "Quais fatores contextuais impactam as pessoas do gênero feminino?",
        factorImpacts: "Quais são os impactos do fator contextual?",
        impactTypes: "Quais são os tipos de impacto dos fatores contextuais?",
        impactFactors:
          "Quais fatores contextuais impactam impactos específicos?",
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
      policyType: "Policy Type",
      startYear: "Start Year",
      audienceGender: "Audience Gender",
      audienceAge: "Audience Age",
      locationType: "Location Type",
      locationName: "Location Name",
      educationalLevel: "Educational Level",
      status: "Status",
      impactType: "Impact Type",
      contextType: "Context Type",
      factor: "Factor",
      policyTypes: {
        educational: "Educational",
        legislation: "Legislation",
        program: "Program",
      },
      genders: {
        female: "Female",
        male: "Male",
        all: "All",
      },
      ages: {
        children: "Children",
        teenagers: "Teenagers",
        adults: "Adults",
      },
      locationTypes: {
        city: "City",
        state: "State",
        region: "Region",
        area: "Area",
      },
      educationLevels: {
        elementary: "Elementary",
        highSchool: "High School",
        undergraduate: "Undergraduate",
        graduate: "Graduate",
      },
      statuses: {
        active: "Active",
        finished: "Finished",
        design: "Design Phase",
      },
      impactTypes: {
        positive: "Positive",
        negative: "Negative",
      },
      contextTypes: {
        university: "University",
        society: "Society",
        workplace: "Workplace",
      },
      factors: {
        educational: "Educational",
        social: "Social",
        genderStereotypes: "Gender Stereotypes",
      },
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
      colombia: "Colombia",
      chile: "Chile",
      mexico: "Mexico",
      unitedStates: "United States",
      canada: "Canada",
      ecuador: "Ecuador",
      venezuela: "Venezuela",
      paraguay: "Paraguay",
      uruguay: "Uruguay",
      guyana: "Guyana",
      suriname: "Suriname",
      frenchGuiana: "French Guiana",
      panama: "Panama",
      costaRica: "Costa Rica",
      nicaragua: "Nicaragua",
      honduras: "Honduras",
      elSalvador: "El Salvador",
      guatemala: "Guatemala",
      belize: "Belize",
      cuba: "Cuba",
      jamaica: "Jamaica",
      haiti: "Haiti",
      dominicanRepublic: "Dominican Republic",
      puertoRico: "Puerto Rico",
      bahamas: "Bahamas",
      trinidadAndTobago: "Trinidad and Tobago",
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
      selectCountry: "Select Country",
      selectYear: "Select Year",
      selectPolicyType: "Select Policy Type",
      selectGender: "Select Gender",
      selectAge: "Select Age",
      selectLocationType: "Select Location Type",
      enterLocationName: "Enter Location Name",
      selectEducationalLevel: "Select Educational Level",
      selectStatus: "Select Status",
      selectImpactType: "Select Impact Type",
      selectContextType: "Select Context Type",
      selectFactor: "Select Factor",
      filters: "Filters",
      currentQuery: "Current Query",
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
    featuredData: "Featured Data",
    queries: {
      policies: {
        countriesApplied:
          "In which Latin American countries are policies to encourage women in science applied?",
        genderPolicyTypes:
          "What types of gender policies are applied in Latin America?",
        womenParticipation:
          "Which policies promote women's participation in STEM?",
        since2015:
          "Which policies have been implemented in Latin American countries since 2015?",
      },
      initiatives: {
        byCountries: "What are the incentive initiatives by country?",
        dataSource: "What are the data sources for the initiatives?",
        socialNetworks: "What are the social networks of the initiatives?",
        programInitiatives: "How many initiatives are of the program type?",
        publicPrivate:
          "How many initiatives are public and how many are private?",
        coordinatedIndividuals:
          "How many initiatives are coordinated by individuals?",
        responsibleGender:
          "What is the gender of the person responsible for the initiative?",
        objective: "What is the objective of the initiative?",
        modality: "What is the modality of the initiative?",
        girlsAdolescents: "Is the initiative aimed at girls or adolescents?",
        targetGender:
          "What is the gender of the target audience of the initiative?",
        blackWomen: "Is the initiative aimed at black women?",
        schoolLevel: "What is the educational level of the initiative?",
        vulnerableGroup: "Is the initiative aimed at vulnerable groups?",
        schoolCommunity: "Does the initiative involve the school community?",
        cityInitiatives: "How many initiatives exist per city?",
        stateInitiatives: "How many initiatives exist per state?",
        areaInitiatives: "How many initiatives exist per area?",
        regionInitiatives: "How many initiatives exist per region?",
        initiativeReach: "What is the reach of the initiative?",
        initiativeFunded: "Is the initiative funded?",
        fundingSector: "What is the funding sector of the initiative?",
        activeInitiatives: "How many initiatives are active?",
        designPhase: "How many initiatives are in the design phase?",
        finishedInitiatives: "How many initiatives have been completed?",
        initiativeWebsite: "What is the website of the initiative?",
        communityInitiatives: "How many initiatives exist in the community?",
      },
      factors: {
        positiveContextual: "What are the positive contextual factors?",
        negativeContextual:
          "What are the negative contextual factors in the institution?",
        educationalFactors:
          "What are the contextual factors by type of education?",
        genderImpact:
          "Which contextual factors impact people of the female gender?",
        factorImpacts: "What are the impacts of the contextual factor?",
        impactTypes: "What are the types of impact of contextual factors?",
        impactFactors: "Which contextual factors impact specific impacts?",
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
      policyType: "Tipo de Política",
      startYear: "Año de Inicio",
      audienceGender: "Género del Público",
      audienceAge: "Edad del Público",
      locationType: "Tipo de Ubicación",
      locationName: "Nombre de Ubicación",
      educationalLevel: "Nivel Educativo",
      status: "Estado",
      impactType: "Tipo de Impacto",
      contextType: "Tipo de Contexto",
      factor: "Factor",
      policyTypes: {
        educational: "Educativo",
        legislation: "Legislación",
        program: "Programa",
      },
      genders: {
        female: "Femenino",
        male: "Masculino",
        all: "Todos",
      },
      ages: {
        children: "Niños",
        teenagers: "Adolescentes",
        adults: "Adultos",
      },
      locationTypes: {
        city: "Ciudad",
        state: "Estado",
        region: "Región",
        area: "Área",
      },
      educationLevels: {
        elementary: "Primaria",
        highSchool: "Secundaria",
        undergraduate: "Pregrado",
        graduate: "Posgrado",
      },
      statuses: {
        active: "Activo",
        finished: "Finalizado",
        design: "En diseño",
      },
      impactTypes: {
        positive: "Positivo",
        negative: "Negativo",
      },
      contextTypes: {
        university: "Universidad",
        society: "Sociedad",
        workplace: "Lugar de trabajo",
      },
      factors: {
        educational: "Educativo",
        social: "Social",
        genderStereotypes: "Estereotipos de Género",
      },
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
      colombia: "Colombia",
      chile: "Chile",
      mexico: "México",
      unitedStates: "Estados Unidos",
      canada: "Canadá",
      ecuador: "Equador",
      venezuela: "Venezuela",
      paraguay: "Paraguai",
      uruguay: "Uruguai",
      guyana: "Guayana",
      suriname: "Surinam",
      frenchGuiana: "Guayana Francesa",
      panama: "Panamá",
      costaRica: "Costa Rica",
      nicaragua: "Nicaragua",
      honduras: "Honduras",
      elSalvador: "El Salvador",
      guatemala: "Guatemala",
      belize: "Belice",
      cuba: "Cuba",
      jamaica: "Jamaica",
      haiti: "Haití",
      dominicanRepublic: "República Dominicana",
      puertoRico: "Puerto Rico",
      bahamas: "Bahamas",
      trinidadAndTobago: "Trinidad y Tobago",
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
      selectCategory: "Seleccionar Categoría",
      selectQuestion: "Seleccionar Pregunta",
      selectCountry: "Seleccionar País",
      selectYear: "Seleccionar Año",
      selectPolicyType: "Seleccionar Tipo de Política",
      selectGender: "Seleccionar Género",
      selectAge: "Seleccionar Edad",
      selectLocationType: "Seleccionar Tipo de Ubicación",
      enterLocationName: "Ingresar Nombre de Ubicación",
      selectEducationalLevel: "Seleccionar Nivel Educativo",
      selectStatus: "Seleccionar Estado",
      selectImpactType: "Seleccionar Tipo de Impacto",
      selectContextType: "Seleccionar Tipo de Contexto",
      selectFactor: "Seleccionar Factor",
      filters: "Filtros",
      currentQuery: "Consulta actual",
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
    featuredData: "Datos Destacados",
    queries: {
      policies: {
        countriesApplied:
          "¿En qué países de América Latina se aplican políticas para incentivar a las mujeres en la ciencia?",
        genderPolicyTypes:
          "¿Qué tipos de políticas de género se aplican en América Latina?",
        womenParticipation:
          "¿Qué políticas promueven la participación de las mujeres en STEM?",
        since2015:
          "¿Qué políticas se han implementado en los países de América Latina desde 2015?",
      },
      initiatives: {
        byCountries: "¿Cuáles son las iniciativas de incentivo por país?",
        dataSource: "¿Cuáles son las fuentes de datos para las iniciativas?",
        socialNetworks: "¿Cuáles son las redes sociales de las iniciativas?",
        programInitiatives: "¿Cuántas iniciativas son del tipo programa?",
        publicPrivate:
          "¿Cuántas iniciativas son públicas y cuántas son privadas?",
        coordinatedIndividuals:
          "¿Cuántas iniciativas son coordinadas por individuos?",
        responsibleGender:
          "¿Cuál es el género del responsable de la iniciativa?",
        objective: "¿Cuál es el objetivo de la iniciativa?",
        modality: "¿Cuál es la modalidad de la iniciativa?",
        girlsAdolescents:
          "¿La iniciativa está dirigida a niñas o adolescentes?",
        targetGender:
          "¿Cuál es el género del público objetivo de la iniciativa?",
        blackWomen: "¿La iniciativa está dirigida a mujeres negras?",
        schoolLevel: "¿Cuál es el nivel educativo de la iniciativa?",
        vulnerableGroup: "¿La iniciativa está dirigida a grupos vulnerables?",
        schoolCommunity: "¿La iniciativa involucra a la comunidad escolar?",
        cityInitiatives: "¿Cuántas iniciativas existen por ciudad?",
        stateInitiatives: "¿Cuántas iniciativas existen por estado?",
        areaInitiatives: "¿Cuántas iniciativas existen por área?",
        regionInitiatives: "¿Cuántas iniciativas existen por región?",
        initiativeReach: "¿Cuál es el alcance de la iniciativa?",
        initiativeFunded: "¿La iniciativa está financiada?",
        fundingSector: "¿Cuál es el sector de financiamiento de la iniciativa?",
        activeInitiatives: "¿Cuántas iniciativas están activas?",
        designPhase: "¿Cuántas iniciativas están en fase de diseño?",
        finishedInitiatives: "¿Cuántas iniciativas se han completado?",
        initiativeWebsite: "¿Cuál es el sitio web de la iniciativa?",
        communityInitiatives: "¿Cuántas iniciativas existen en la comunidad?",
      },
      factors: {
        positiveContextual: "¿Cuáles son los factores contextuales positivos?",
        negativeContextual:
          "¿Cuáles son los factores contextuales negativos en la institución?",
        educationalFactors:
          "¿Cuáles son los factores contextuales por tipo de educación?",
        genderImpact:
          "¿Qué factores contextuales impactan a las personas del género femenino?",
        factorImpacts: "¿Cuáles son los impactos del factor contextual?",
        impactTypes:
          "¿Cuáles son los tipos de impacto de los factores contextuales?",
        impactFactors:
          "¿Qué factores contextuales impactan impactos específicos?",
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
  }, [language]);

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
