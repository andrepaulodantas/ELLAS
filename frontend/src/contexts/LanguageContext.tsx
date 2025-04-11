import React, { createContext, useContext, useState, useEffect } from "react";

interface Card {
  title: string;
  description: string;
}

interface Cards {
  blackWomen: Card;
  genderEquality: Card;
  femaleLeadership: Card;
}

interface Home {
  featuredData: string;
  selectQuestion: string;
  cards: Cards;
  title: string;
}

interface Common {
  learnMore: string;
  chooseCategory: string;
  askData: string;
  search: string;
  searchPlaceholder: string;
}

interface FooterLink {
  text: string;
  url: string;
}

interface Footer {
  contacts: string;
  connect: string;
  usefulLinks: FooterLink;
  accessibility: FooterLink;
  terms: FooterLink;
  privacy: FooterLink;
  rights: string;
  institutions: string;
}

interface Filters {
  filterBy: string;
  all: string;
  country: string;
  year: string;
  type: string;
  noData: string;
  startDate: string;
  policyTypes: {
    educational: string;
    legislation: string;
    program: string;
  };
  statuses: {
    active: string;
    finished: string;
    design: string;
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
}

interface StartSection {
  title: string;
  subtitle: string;
  description: string;
}

interface DataChart {
  title: string;
  description1: string;
  description2: string;
  centerText1: string;
  centerText2: string;
  listItem1: string;
  listItem2: string;
  categories: {
    title: string;
    description: string;
    policies: string;
    factors: string;
    initiatives: string;
    secondary: string;
  };
  data: {
    title: string;
    description: string;
  };
}

interface LatinAmericaSection {
  title: string;
  subtitle: string;
  description: string;
}

interface Navigation {
  home: string;
  about: string;
  openData: string;
  supportELLAS: string;
  contact: string;
}

interface Categories {
  initiatives: string;
  policies: string;
  factors: string;
  otherData: string;
  descriptions: {
    policies: string;
    initiatives: string;
    factors: string;
    otherData: string;
  };
}

export interface Translations {
  home: Home;
  common: Common;
  footer: Footer;
  filters: Filters;
  startSection: StartSection;
  dataChart: DataChart;
  latinAmericaSection: LatinAmericaSection;
  navigation: Navigation;
  categories: Categories;
  [key: string]: any;
}

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  translations: Translations;
  isLoading: boolean;
}

const defaultTranslations: Translations = {
  navigation: {
    home: "Home",
    about: "About",
    openData: "Open Data",
    supportELLAS: "Support ELLAS",
    contact: "Contact",
  },
  home: {
    featuredData: "Featured Data",
    selectQuestion: "Select one of the most searched questions to begin.",
    cards: {
      blackWomen: {
        title: "Black Women in Brazil",
        description: "Initiatives for Black women doubled in Brazil since 2018",
      },
      genderEquality: {
        title: "Gender Equality",
        description: "Essential data on gender equality in Latin America",
      },
      femaleLeadership: {
        title: "Female Leadership",
        description: "Impact factors on female leadership in Latin America",
      },
    },
    title: "Welcome to ELLAS",
  },
  common: {
    learnMore: "Learn More",
    chooseCategory: "Choose Category",
    askData: "Ask Data",
    search: "Search",
    searchPlaceholder: "Search...",
  },
  footer: {
    contacts: "Contacts",
    connect: "Connect with ELLAS",
    usefulLinks: {
      text: "Useful Links",
      url: "https://ellas.ufmt.br/en/useful-links/",
    },
    accessibility: {
      text: "Web Accessibility",
      url: "https://ellas.ufmt.br/en/accessibility/",
    },
    terms: {
      text: "Terms of Use",
      url: "https://ellas.ufmt.br/en/terms-of-use/",
    },
    privacy: {
      text: "Privacy Policy",
      url: "https://ellas.ufmt.br/en/privacy-policy/",
    },
    rights: "All rights reserved",
    institutions: "Institutions",
  },
  filters: {
    filterBy: "Filter by",
    all: "All",
    country: "Country",
    year: "Year",
    type: "Type",
    noData: "No data available",
    startDate: "Start Date",
    policyTypes: {
      educational: "Educational",
      legislation: "Legislation",
      program: "Program",
    },
    statuses: {
      active: "Active",
      finished: "Finished",
      design: "Design",
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
      genderStereotypes: "Gender stereotypes",
    },
  },
  startSection: {
    title: "Welcome to ELLAS",
    subtitle: "Empowering Latin American Women in STEM",
    description:
      "Discover data and insights about women in STEM fields across Latin America",
  },
  dataChart: {
    title: "Data Analysis",
    description1:
      "Our comprehensive analysis of women in STEM across Latin America",
    description2: "Key findings and insights from our research",
    centerText1: "Total",
    centerText2: "Data Points",
    listItem1: "Detailed analysis of policies and initiatives",
    listItem2: "Impact assessment of various factors",
    categories: {
      title: "Data Categories",
      description: "Explore our data through different categories",
      policies: "Policies",
      factors: "Factors",
      initiatives: "Initiatives",
      secondary: "Secondary Data",
    },
    data: {
      title: "Data Analysis",
      description: "View detailed analysis of our collected data",
    },
  },
  latinAmericaSection: {
    title: "Latin America",
    subtitle: "Regional Overview",
    description:
      "Comprehensive data and analysis of women in STEM across Latin America",
  },
  categories: {
    initiatives: "Initiatives",
    policies: "Policies",
    factors: "Factors",
    otherData: "Other Data",
    descriptions: {
      policies: "Policies",
      initiatives: "Initiatives",
      factors: "Factors",
      otherData: "Other Data",
    },
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [language, setLanguage] = useState(
    () => localStorage.getItem("language") || "pt"
  );
  const [translations, setTranslations] =
    useState<Translations>(defaultTranslations);
  const [isLoading, setIsLoading] = useState(true);

  // Save language to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("language", language);
  }, [language]);

  // Load translations based on language
  useEffect(() => {
    const loadTranslations = async () => {
      setIsLoading(true);
      try {
        const response = await import(
          `../locales/${language}/translation.json`
        );
        setTranslations({
          ...defaultTranslations,
          ...response.default,
        });
      } catch (error) {
        console.error("Error loading translations:", error);
        setTranslations(defaultTranslations);
      } finally {
        setIsLoading(false);
      }
    };

    loadTranslations();
  }, [language]);

  if (isLoading) {
    return null;
  }

  return (
    <LanguageContext.Provider
      value={{ language, setLanguage, translations, isLoading }}
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
