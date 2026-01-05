import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Helmet } from "react-helmet";
import { Heading } from "../../components";
import { useNavigate, useLocation } from "react-router-dom";
import GoogleMapComponent from "../../components/GoogleMap";
import {
  questionFunctions,
  getEnglishQuestionKey,
} from "../../services/apiService";
import { saveAs } from "file-saver";
import Header from "../../components/Header";
import DataTable from "components/DataTable";
import { SelectOption } from "../../components/SelectBox";
import { useLanguage } from "../../contexts/LanguageContext";
import Sidebar from "../../components/Sidebar";
import styled from "@emotion/styled";
// Social media icons commented out as not currently used
// import { FaFacebook, FaTwitter, FaLinkedin, FaWhatsapp } from "react-icons/fa";
// import IconWrapper from "../../components/IconWrapper";
import { generatePDF, organizeFields } from "../../utils/exportUtils";
import SurveyDownload from "../../components/SurveyDownload";

interface DropDownOption extends SelectOption {
  value: string;
  label: string;
}

interface BuscaOneProps {
  onSearch: (params: {
    category: string | null;
    question: string | null;
    time?: string | null;
  }) => void;
}

// Add styled component
const QuestionTitle = styled(Heading)`
  text-align: center;
  color: #4a2b4e;
  font-weight: 600;
  padding-bottom: 16px;
  margin-bottom: 24px;
  border-bottom: 2px solid #e6a17a;
  width: 100%;
  font-size: 24px;
`;

// Adicione os estilos para o cabeçalho de Dados Abertos
const DadosAbertosHeader = styled.div`
  background-color: #f2fbff;
  padding: 1rem 2rem;
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  border-bottom: 2px solid #f8b195;
`;

const DadosAbertosTitle = styled.h1`
  color: #4a2b4e;
  font-weight: 600;
  font-size: 28px;
  margin: 0;
`;

// Estilos para as abas superiores
const TopTabsContainer = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #ffe4d9;
  border-radius: 12px 12px 0 0;
  margin: 0;
  padding: 8px 16px;
  width: 100%;
  min-height: 64px;
  
  .tabs-section {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
  }
  
  .social-section {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    min-width: 150px;
    justify-content: flex-end;
  }
  
  @media (max-width: 600px) {
    flex-direction: column;
    align-items: center;
    min-height: unset;
    padding-bottom: 0.5rem;
    
    .tabs-section {
      width: 100%;
      justify-content: center;
    }
    
    .social-section {
      min-width: auto;
      justify-content: center;
    }
  }
`;

const TopTabsListWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  
  @media (max-width: 600px) {
    width: 100%;
    justify-content: center;
    margin-bottom: 0.5rem;
  }
`;

const TopTabsList = styled.div`
  display: flex;
  gap: 0;
`;

const TopTab = styled.div<{ selected?: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: 600;
  color: ${(props) => (props.selected ? "#4A2B4E" : "#4A2B4E")};
  background: ${(props) => (props.selected ? "#fff" : "transparent")};
  border-bottom: 4px solid
    ${(props) => (props.selected ? "#4A2B4E" : "transparent")};
  border-radius: 12px 12px 0 0;
  padding: 18px 36px 12px 36px;
  cursor: pointer;
  transition: background 0.2s, border 0.2s;
  svg,
  img {
    width: 22px;
    height: 22px;
  }
`;

// Estilos para os ícones sociais - centralizados
const SocialMediaContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  margin: 0;
  position: static;
  
  @media (max-width: 600px) {
    margin-top: 0.5rem;
    width: 100%;
    justify-content: center;
    order: 2;
  }
`;

const SocialIcon = styled.a`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: white;
  font-size: 16px;
  font-weight: 600;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
  }

  &.facebook {
    background-color: #3b5998;
  }
  &.instagram {
    background: linear-gradient(
      45deg,
      #f09433 0%,
      #e6683c 25%,
      #dc2743 50%,
      #cc2366 75%,
      #bc1888 100%
    );
  }
  &.twitter {
    background-color: #1da1f2;
  }
  &.linkedin {
    background-color: #0077b5;
  }
  &.share {
    background-color: #ff6542;
  }
  &.download {
    background-color: #f8b195;
  }
  &.info {
    background-color: #17a2b8;
    font-family: serif;
    font-style: italic;
  }
`;

// Adicionar o styled component DownloadIcon
const DownloadIcon = styled.div`
  width: 18px;
  height: 18px;
  margin-left: 5px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 16px;
    height: 16px;
    fill: #888;
  }

  &:hover svg {
    fill: #4a2b4e;
  }
`;

// Adicione estas funções para compartilhar em redes sociais
const shareOnFacebook = () => {
  const url = window.location.href;
  const title = document.title;
  window.open(
    `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      url
    )}&t=${encodeURIComponent(title)}`,
    "_blank"
  );
};

const shareOnTwitter = () => {
  const url = window.location.href;
  const title = document.title;
  window.open(
    `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      title
    )}&url=${encodeURIComponent(url)}`,
    "_blank"
  );
};

const shareOnLinkedin = () => {
  const url = window.location.href;
  const title = document.title;
  window.open(
    `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      url
    )}`,
    "_blank"
  );
};

const shareOnWhatsapp = () => {
  const url = window.location.href;
  const title = document.title;
  window.open(
    `https://api.whatsapp.com/send?text=${encodeURIComponent(
      title + " " + url
    )}`,
    "_blank"
  );
};

const BuscaOne: React.FC<BuscaOneProps> = ({ onSearch }) => {
  const { translations, language } = useLanguage();
  const [selectedCategory, setSelectedCategory] =
    useState<DropDownOption | null>(null);
  const [selectedQuestion, setSelectedQuestion] =
    useState<DropDownOption | null>(null);
  const [selectedTime, setSelectedTime] = useState<DropDownOption | null>(null);
  const [data, setData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [years, setYears] = useState<string[]>([]);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [dynamicFields, setDynamicFields] = useState<string[]>([]);
  const [countryCounts, setCountryCounts] = useState<{ [key: string]: number }>(
    {}
  );
  const [isLoading, setIsLoading] = useState(false);

  // New filter states
  const [selectedCountry, setSelectedCountry] = useState<DropDownOption | null>(
    null
  );
  const [selectedPolicyType, setPolicyType] = useState<DropDownOption | null>(
    null
  );
  const [selectedYear, setSelectedYear] = useState<DropDownOption | null>(null);
  const [selectedAudienceGender, setSelectedAudienceGender] =
    useState<DropDownOption | null>(null);
  const [selectedAudienceAge, setSelectedAudienceAge] =
    useState<DropDownOption | null>(null);
  const [selectedLocation, setSelectedLocation] =
    useState<DropDownOption | null>(null);
  const [selectedLocationType, setSelectedLocationType] =
    useState<DropDownOption | null>(null);
  const [selectedEducationalLevel, setSelectedEducationalLevel] =
    useState<DropDownOption | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<DropDownOption | null>(
    null
  );
  const [selectedImpactType, setSelectedImpactType] =
    useState<DropDownOption | null>(null);
  const [selectedContextType, setSelectedContextType] =
    useState<DropDownOption | null>(null);
  const [selectedFactor, setSelectedFactor] = useState<DropDownOption | null>(
    null
  );

  // State for selected query
  const [selectedQueryType, setSelectedQueryType] =
    useState<DropDownOption | null>(null);

  // Add state declarations for multi-select filters
  const [selectedYears, setSelectedYears] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);

  const navigate = useNavigate();
  const location = useLocation();

  // Wrap options in useMemo to prevent dependency changes on every render
  const countryOptions = useMemo(
    () => [
      { label: translations.filters?.all || "All", value: "all" },
      { label: translations.countries?.brasil || "Brazil", value: "Brazil" },
      { label: translations.countries?.peru || "Peru", value: "Peru" },
      { label: translations.countries?.bolivia || "Bolivia", value: "Bolivia" },
      {
        label: translations.countries?.argentina || "Argentina",
        value: "Argentina",
      },
      {
        label: translations.countries?.colombia || "Colombia",
        value: "Colombia",
      },
      { label: translations.countries?.chile || "Chile", value: "Chile" },
      { label: translations.countries?.mexico || "Mexico", value: "Mexico" },
      {
        label: translations.countries?.unitedStates || "United States",
        value: "United States",
      },
      { label: translations.countries?.canada || "Canada", value: "Canada" },
      { label: translations.countries?.ecuador || "Ecuador", value: "Ecuador" },
      {
        label: translations.countries?.venezuela || "Venezuela",
        value: "Venezuela",
      },
      {
        label: translations.countries?.paraguay || "Paraguay",
        value: "Paraguay",
      },
      { label: translations.countries?.uruguay || "Uruguay", value: "Uruguay" },
      { label: translations.countries?.guyana || "Guyana", value: "Guyana" },
      {
        label: translations.countries?.suriname || "Suriname",
        value: "Suriname",
      },
      {
        label: translations.countries?.frenchGuiana || "French Guiana",
        value: "French Guiana",
      },
      { label: translations.countries?.panama || "Panama", value: "Panama" },
      {
        label: translations.countries?.costaRica || "Costa Rica",
        value: "Costa Rica",
      },
      {
        label: translations.countries?.nicaragua || "Nicaragua",
        value: "Nicaragua",
      },
      {
        label: translations.countries?.honduras || "Honduras",
        value: "Honduras",
      },
      {
        label: translations.countries?.elSalvador || "El Salvador",
        value: "El Salvador",
      },
      {
        label: translations.countries?.guatemala || "Guatemala",
        value: "Guatemala",
      },
      { label: translations.countries?.belize || "Belize", value: "Belize" },
      { label: translations.countries?.cuba || "Cuba", value: "Cuba" },
      { label: translations.countries?.jamaica || "Jamaica", value: "Jamaica" },
      { label: translations.countries?.haiti || "Haiti", value: "Haiti" },
      {
        label:
          translations.countries?.dominicanRepublic || "Dominican Republic",
        value: "Dominican Republic",
      },
      {
        label: translations.countries?.puertoRico || "Puerto Rico",
        value: "Puerto Rico",
      },
      { label: translations.countries?.bahamas || "Bahamas", value: "Bahamas" },
      {
        label:
          translations.countries?.trinidadAndTobago || "Trinidad and Tobago",
        value: "Trinidad and Tobago",
      },
    ],
    [translations]
  );

  // Policy type options
  const policyTypeOptions = [
    { label: translations.filters?.all || "All", value: "all" },
    {
      label: translations.filters?.policyTypes?.educational || "Educational",
      value: "Educational",
    },
    {
      label: translations.filters?.policyTypes?.legislation || "Legislation",
      value: "Legislation",
    },
    {
      label: translations.filters?.policyTypes?.program || "Program",
      value: "Program",
    },
  ];

  // Year options
  const yearOptions = useMemo(
    () => [
      "2015",
      "2016",
      "2017",
      "2018",
      "2019",
      "2020",
      "2021",
      "2022",
      "2023",
      "2024",
    ],
    []
  );

  // Audience gender options
  const audienceGenderOptions = [
    { label: translations.filters?.all || "All", value: "all" },
    {
      label: translations.filters?.genders?.female || "Female",
      value: "Female",
    },
    { label: translations.filters?.genders?.male || "Male", value: "Male" },
    { label: translations.filters?.genders?.all || "All", value: "All" },
  ];

  // Audience age options
  const audienceAgeOptions = [
    { label: translations.filters?.all || "All", value: "all" },
    {
      label: translations.filters?.ages?.children || "Children",
      value: "Children",
    },
    {
      label: translations.filters?.ages?.teenagers || "Teenagers",
      value: "Teenagers",
    },
    { label: translations.filters?.ages?.adults || "Adults", value: "Adults" },
  ];

  // Location type options
  const locationTypeOptions = [
    { label: translations.filters?.all || "All", value: "all" },
    {
      label: translations.filters?.locationTypes?.city || "City",
      value: "City",
    },
    {
      label: translations.filters?.locationTypes?.state || "State",
      value: "State",
    },
    {
      label: translations.filters?.locationTypes?.region || "Region",
      value: "Region",
    },
    {
      label: translations.filters?.locationTypes?.area || "Area",
      value: "Area",
    },
  ];

  // Educational level options
  const educationalLevelOptions = [
    { label: translations.filters?.all || "All", value: "all" },
    {
      label: translations.filters?.educationLevels?.elementary || "Elementary",
      value: "Elementary",
    },
    {
      label: translations.filters?.educationLevels?.highSchool || "High School",
      value: "High School",
    },
    {
      label:
        translations.filters?.educationLevels?.undergraduate || "Undergraduate",
      value: "Undergraduate",
    },
    {
      label: translations.filters?.educationLevels?.graduate || "Graduate",
      value: "Graduate",
    },
  ];

  // Status options
  const statusOptions = useMemo(
    () => [
      { label: translations.filters?.all || "All", value: "all" },
      {
        label: translations.filters?.statuses?.active || "Active",
        value: "Active",
      },
      {
        label: translations.filters?.statuses?.finished || "Finished",
        value: "Finished",
      },
      {
        label: translations.filters?.statuses?.design || "Design",
        value: "Design",
      },
    ],
    [translations]
  );

  // Impact type options
  const impactTypeOptions = [
    { label: translations.filters?.all || "All", value: "all" },
    {
      label: translations.filters?.impactTypes?.positive || "Positive",
      value: "Positive",
    },
    {
      label: translations.filters?.impactTypes?.negative || "Negative",
      value: "Negative",
    },
  ];

  // Context type options
  const contextTypeOptions = [
    { label: translations.filters?.all || "All", value: "all" },
    {
      label: translations.filters?.contextTypes?.university || "University",
      value: "University",
    },
    {
      label: translations.filters?.contextTypes?.society || "Society",
      value: "Society",
    },
    {
      label: translations.filters?.contextTypes?.workplace || "Workplace",
      value: "Workplace",
    },
  ];

  // Factor options
  const factorOptions = [
    { label: translations.filters?.all || "All", value: "all" },
    {
      label: translations.filters?.factors?.educational || "Educational",
      value: "Educational",
    },
    {
      label: translations.filters?.factors?.social || "Social",
      value: "Social",
    },
    {
      label:
        translations.filters?.factors?.genderStereotypes ||
        "Gender stereotypes",
      value: "Gender stereotypes",
    },
  ];

  // Wrap getQueriesByCategory in useCallback to prevent it from changing on every render
  const getQueriesByCategory = useCallback(
    (category: string) => {
      if (category === "policies") {
        return [
          { value: "all", label: translations.filters?.all || "All" },
          {
            value: "countries-applied",
            label:
              translations.queries?.policies?.countriesApplied ||
              "In which countries the policy was applied?",
          },
          {
            value: "gender-policy-types",
            label:
              translations.queries?.policies?.genderPolicyTypes ||
              "What types of gender policies/processes/practices exist in Latin America?",
          },
          {
            value: "women-participation",
            label:
              translations.queries?.policies?.womenParticipation ||
              "How policies identified/analyzed are promoting women's participation in STEM fields?",
          },
          {
            value: "since-2015",
            label:
              translations.queries?.policies?.since2015 ||
              "What types of gender policies/processes/practices have been implemented in Bolivia, Brazil and Peru since 2015?",
          },
        ];
      } else if (category === "initiatives") {
        return [
          { value: "all", label: translations.filters?.all || "All" },
          {
            value: "by-countries",
            label:
              translations.queries?.initiatives?.byCountries ||
              "Which/How many initiatives are carried out in countries?",
          },
          {
            value: "data-source",
            label:
              translations.queries?.initiatives?.dataSource ||
              "What data source are used for initiative?",
          },
          {
            value: "social-networks",
            label:
              translations.queries?.initiatives?.socialNetworks ||
              "What is the initiative's social network(s)?",
          },
          {
            value: "program-initiatives",
            label:
              translations.queries?.initiatives?.programInitiatives ||
              "How many initiatives are of program?",
          },
          {
            value: "public-private",
            label:
              translations.queries?.initiatives?.publicPrivate ||
              "Are these initiatives public or private?",
          },
          {
            value: "coordinated-individuals",
            label:
              translations.queries?.initiatives?.coordinatedIndividuals ||
              "How many initiatives are coordinated by individuals?",
          },
          {
            value: "responsible-gender",
            label:
              translations.queries?.initiatives?.responsibleGender ||
              "What is the social gender of the people who are responsible for the initiatives?",
          },
          {
            value: "initiative-objective",
            label:
              translations.queries?.initiatives?.objective ||
              "What is the OBJECTIVE of the initiative?",
          },
          {
            value: "initiative-modality",
            label:
              translations.queries?.initiatives?.modality ||
              "Which initiative modality are used for the actives/actions?",
          },
          {
            value: "girls-adolescents",
            label:
              translations.queries?.initiatives?.girlsAdolescents ||
              "What initiatives serve girls or adolescents?",
          },
          {
            value: "target-gender",
            label:
              translations.queries?.initiatives?.targetGender ||
              "What is the social gender of the target audience served by the initiative?",
          },
          {
            value: "black-women",
            label:
              translations.queries?.initiatives?.blackWomen ||
              "What initiatives serve black women?",
          },
          {
            value: "school-level",
            label:
              translations.queries?.initiatives?.schoolLevel ||
              "What initiatives are being developed at a given school level?",
          },
          {
            value: "vulnerable-group",
            label:
              translations.queries?.initiatives?.vulnerableGroup ||
              "What initiatives serve a certain vulnerable group?",
          },
          {
            value: "school-community",
            label:
              translations.queries?.initiatives?.schoolCommunity ||
              "Do the initiatives involve the School community?",
          },
          {
            value: "city-initiatives",
            label:
              translations.queries?.initiatives?.cityInitiatives ||
              "Which/How many initiatives are carried out in a given city?",
          },
          {
            value: "state-initiatives",
            label:
              translations.queries?.initiatives?.stateInitiatives ||
              "What/How many initiatives are carried out in a given state?",
          },
          {
            value: "area-initiatives",
            label:
              translations.queries?.initiatives?.areaInitiatives ||
              "What/How many initiatives are carried out in a given area?",
          },
          {
            value: "region-initiatives",
            label:
              translations.queries?.initiatives?.regionInitiatives ||
              "What/How many initiatives are carried out in a given region?",
          },
          {
            value: "initiative-reach",
            label:
              translations.queries?.initiatives?.initiativeReach ||
              "Which/How many initiatives have a given reach?",
          },
          {
            value: "initiative-funded",
            label:
              translations.queries?.initiatives?.initiativeFunded ||
              "Are the initiatives funded?",
          },
          {
            value: "funding-sector",
            label:
              translations.queries?.initiatives?.fundingSector ||
              "What is the sector of the organization(s) that finance(s) the initiative?",
          },
          {
            value: "active-initiatives",
            label:
              translations.queries?.initiatives?.activeInitiatives ||
              "What initiatives are active?",
          },
          {
            value: "design-phase",
            label:
              translations.queries?.initiatives?.designPhase ||
              "Have the initiatives already been implemented or are they still in the design phase?",
          },
          {
            value: "finished-initiatives",
            label:
              translations.queries?.initiatives?.finishedInitiatives ||
              "Which initiatives are already finished?",
          },
          {
            value: "initiative-website",
            label:
              translations.queries?.initiatives?.initiativeWebsite ||
              "What is the initiative's website (URL)?",
          },
          {
            value: "community-initiatives",
            label:
              translations.queries?.initiatives?.communityInitiatives ||
              "How many initiatives are part of communities?",
          },
        ];
      } else if (category === "factors") {
        return [
          { value: "all", label: translations.filters?.all || "All" },
          {
            value: "positive-contextual",
            label:
              translations.queries?.factors?.positiveContextual ||
              "What are the positive CONTEXTUAL FACTORS in COUNTRIES ANALYZED?",
          },
          {
            value: "negative-contextual",
            label:
              translations.queries?.factors?.negativeContextual ||
              "What are the negative CONTEXTUAL FACTORS in activities in Institution X in COUNTRIES ANALYZED?",
          },
          {
            value: "educational-factors",
            label:
              translations.queries?.factors?.educationalFactors ||
              "Which CONTEXTUAL FACTORS are related to the TYPE of Educational FACTOR?",
          },
          {
            value: "gender-impact",
            label:
              translations.queries?.factors?.genderImpact ||
              "What are the CONTEXTUAL FACTORS that impact Positively/Negatively the GENDER Female?",
          },
          {
            value: "factor-impacts",
            label:
              translations.queries?.factors?.factorImpacts ||
              "What are the IMPACTS of CONTEXTUAL FACTOR X?",
          },
          {
            value: "impact-types",
            label:
              translations.queries?.factors?.impactTypes ||
              "Which are the IMPACT TYPES of the CONTEXTUAL FACTOR Y in Latin American INSTITUTIONS?",
          },
          {
            value: "impact-factors",
            label:
              translations.queries?.factors?.impactFactors ||
              "What are the CONTEXTUAL FACTORS that impact Positively/Negatively on IMPACT (IMPACT=Leadership, permanence, motivation, others) in the country X?",
          },
        ];
      } else if (category === "indicators") {
        return [
          { value: "all", label: translations.filters?.all || "All" },
          {
            value: "gender-equality-metrics",
            label:
              translations.queries?.indicators?.genderEqualityMetrics ||
              "What gender equality indicators are available in Latin America?",
          },
          {
            value: "stem-participation",
            label:
              translations.queries?.indicators?.stemParticipation ||
              "What are the STEM participation indicators for women?",
          },
          {
            value: "education-indicators",
            label:
              translations.queries?.indicators?.educationIndicators ||
              "What education indicators show gender gaps in STEM?",
          },
          {
            value: "leadership-metrics",
            label:
              translations.queries?.indicators?.leadershipMetrics ||
              "What indicators measure women's leadership in STEM?",
          },
          {
            value: "progress-metrics",
            label:
              translations.queries?.indicators?.progressMetrics ||
              "What indicators track progress in gender equality in STEM?",
          },
        ];
      }
      return [];
    },
    [translations]
  );

  // Wrap buildDynamicQuery in useCallback to prevent it from changing on every render
  const buildDynamicQuery = useCallback(() => {
    if (selectedQueryType && selectedQueryType.value !== "all") {
      return selectedQueryType.label;
    }

    // Default initial query
    let baseQuery =
      "What types of gender policies/processes/practices exist in Latin America?";

    if (selectedCategory) {
      const categoryValue = selectedCategory.value;

      // Handle category-specific queries
      if (categoryValue === "policies") {
        if (selectedCountry && selectedCountry.value !== "all") {
          baseQuery = `What types of gender policies/processes/practices have been implemented in ${selectedCountry.value}?`;
        } else {
          baseQuery =
            "What types of gender policies/processes/practices exist in Latin America?";
        }

        if (selectedYear && selectedYear.value !== "all") {
          baseQuery = `What types of gender policies/processes/practices have been implemented since ${selectedYear.value}?`;
        }

        if (
          selectedCountry &&
          selectedCountry.value !== "all" &&
          selectedYear &&
          selectedYear.value !== "all"
        ) {
          baseQuery = `What types of gender policies/processes/practices have been implemented in ${selectedCountry.value} since ${selectedYear.value}?`;
        }
      } else if (categoryValue === "initiatives") {
        if (selectedCountry && selectedCountry.value !== "all") {
          baseQuery = `Which/How many initiatives are carried out in ${selectedCountry.value}?`;
        } else {
          baseQuery =
            "Which/How many initiatives are carried out in countries?";
        }

        if (selectedStatus && selectedStatus.value !== "all") {
          if (selectedStatus.value === "Active") {
            baseQuery = "What initiatives are active?";
          } else if (selectedStatus.value === "Finished") {
            baseQuery = "Which initiatives are already finished?";
          } else if (selectedStatus.value === "Design") {
            baseQuery =
              "Have the initiatives already been implemented or are they still in the design phase?";
          }
        }
      } else if (categoryValue === "factors") {
        if (selectedCountry && selectedCountry.value !== "all") {
          baseQuery = `What are the positive CONTEXTUAL FACTORS in ${selectedCountry.value}?`;
        } else {
          baseQuery =
            "What are the positive CONTEXTUAL FACTORS in COUNTRIES ANALYZED?";
        }
      } else if (categoryValue === "indicators") {
        if (selectedCountry && selectedCountry.value !== "all") {
          baseQuery = `What gender equality indicators are available for ${selectedCountry.value}?`;
        } else {
          baseQuery =
            "What gender equality indicators are available in Latin America?";
        }
      }
    }

    return baseQuery;
  }, [
    selectedCategory,
    selectedCountry,
    selectedYear,
    selectedStatus,
    selectedQueryType,
  ]);

  // Parse country data - to handle cases where multiple countries are listed in one field
  const parseCountryString = (countryString: string) => {
    // Handle common separators like "and", "&", "," etc.
    const countries = countryString.split(/\s+and\s+|\s*[,&]\s*|\s+y\s+/);
    return countries.map((country) => country.trim());
  };

  // Apply all filters to the data
  const applyFilters = (data: any[]) => {
    let filtered = [...data];

    // Filter by country
    if (
      selectedCountry &&
      selectedCountry.value &&
      selectedCountry.value !== "all"
    ) {
      // Handle USA/United States special case
      if (
        selectedCountry.value === "USA" ||
        selectedCountry.value === "United States"
      ) {
        filtered = filtered.filter((item) => {
          if (!item.countryName) return false;

          // Parse the country string for multiple countries
          const countries = parseCountryString(item.countryName);

          // Check if any of the parsed countries matches USA or United States
          return countries.some(
            (country) =>
              country.toLowerCase() === "united states" ||
              country.toLowerCase() === "usa"
          );
        });
      } else {
        filtered = filtered.filter((item) => {
          if (!item.countryName) return false;

          // Parse the country string for multiple countries
          const countries = parseCountryString(item.countryName);

          // Check if any of the parsed countries matches the selected country
          return countries.some(
            (country) =>
              country.toLowerCase() === selectedCountry.value.toLowerCase()
          );
        });
      }
    }

    // Filter by policy type
    if (
      selectedPolicyType &&
      selectedPolicyType.value &&
      selectedPolicyType.value !== "all"
    ) {
      filtered = filtered.filter(
        (item) =>
          item.policyType &&
          item.policyType
            .toLowerCase()
            .includes(selectedPolicyType.value.toLowerCase())
      );
    }

    // Filter by year
    if (selectedYear && selectedYear.value && selectedYear.value !== "all") {
      const year = selectedYear.value;
      filtered = filtered.filter((item) => {
        // Check if startDate exists and matches the year
        if (item.startDate) {
          try {
            const startDateYear = new Date(item.startDate)
              .getFullYear()
              .toString();
            if (startDateYear === year) return true;
          } catch (e) {
            // Handle invalid date format
            if (item.startDate.includes(year)) return true;
          }
        }

        // Check if finishDate exists and matches the year
        if (item.finishDate) {
          try {
            const finishDateYear = new Date(item.finishDate)
              .getFullYear()
              .toString();
            if (finishDateYear === year) return true;
          } catch (e) {
            // Handle invalid date format
            if (item.finishDate.includes(year)) return true;
          }
        }

        // Check if start_date exists and matches the year (alternative field name)
        if (item.start_date) {
          try {
            const startDateYear = new Date(item.start_date)
              .getFullYear()
              .toString();
            if (startDateYear === year) return true;
          } catch (e) {
            // Try direct matching for formats like "2015"
            if (item.start_date.includes(year)) return true;
          }
        }

        return false;
      });
    }

    // Filter by audience gender
    if (
      selectedAudienceGender &&
      selectedAudienceGender.value &&
      selectedAudienceGender.value !== "all"
    ) {
      filtered = filtered.filter(
        (item) =>
          item.audienceGender &&
          item.audienceGender
            .toLowerCase()
            .includes(selectedAudienceGender.value.toLowerCase())
      );
    }

    // Filter by audience age
    if (
      selectedAudienceAge &&
      selectedAudienceAge.value &&
      selectedAudienceAge.value !== "all"
    ) {
      filtered = filtered.filter(
        (item) =>
          item.audienceAge &&
          item.audienceAge
            .toLowerCase()
            .includes(selectedAudienceAge.value.toLowerCase())
      );
    }

    // Filter by location type and location
    if (
      selectedLocationType &&
      selectedLocationType.value &&
      selectedLocationType.value !== "all"
    ) {
      filtered = filtered.filter(
        (item) =>
          item.locationType &&
          item.locationType
            .toLowerCase()
            .includes(selectedLocationType.value.toLowerCase())
      );

      if (
        selectedLocation &&
        selectedLocation.value &&
        selectedLocation.value !== "all"
      ) {
        filtered = filtered.filter(
          (item) =>
            item.locationName &&
            item.locationName
              .toLowerCase()
              .includes(selectedLocation.value.toLowerCase())
        );
      }
    }

    // Filter by educational level
    if (
      selectedEducationalLevel &&
      selectedEducationalLevel.value &&
      selectedEducationalLevel.value !== "all"
    ) {
      filtered = filtered.filter(
        (item) =>
          item.educationalLevel &&
          item.educationalLevel
            .toLowerCase()
            .includes(selectedEducationalLevel.value.toLowerCase())
      );
    }

    // Filter by status
    if (
      selectedStatus &&
      selectedStatus.value &&
      selectedStatus.value !== "all"
    ) {
      filtered = filtered.filter((item) => {
        if (!item.status) return false;

        // Case-insensitive match for status
        const itemStatus = item.status.toLowerCase();
        const selectedStatusValue = selectedStatus.value.toLowerCase();

        // Direct match
        if (itemStatus === selectedStatusValue) return true;

        // Check for partial matches
        if (itemStatus.includes(selectedStatusValue)) return true;

        // Check for initiative_status field as well (alternative field name)
        if (
          item.initiative_status &&
          item.initiative_status.toLowerCase().includes(selectedStatusValue)
        ) {
          return true;
        }

        return false;
      });
    }

    // Filter by impact type
    if (
      selectedImpactType &&
      selectedImpactType.value &&
      selectedImpactType.value !== "all"
    ) {
      filtered = filtered.filter(
        (item) =>
          item.impactType &&
          item.impactType
            .toLowerCase()
            .includes(selectedImpactType.value.toLowerCase())
      );
    }

    // Filter by context type
    if (
      selectedContextType &&
      selectedContextType.value &&
      selectedContextType.value !== "all"
    ) {
      filtered = filtered.filter(
        (item) =>
          item.contextType &&
          item.contextType
            .toLowerCase()
            .includes(selectedContextType.value.toLowerCase())
      );
    }

    // Filter by factor
    if (
      selectedFactor &&
      selectedFactor.value &&
      selectedFactor.value !== "all"
    ) {
      filtered = filtered.filter(
        (item) =>
          item.factor &&
          item.factor.toLowerCase().includes(selectedFactor.value.toLowerCase())
      );
    }

    return filtered;
  };

  // Update the useEffect for fetching data
  useEffect(() => {
    if (!selectedCategory) return;

    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Get the query string from buildDynamicQuery
        const dynamicQuestion = buildDynamicQuery();

        // Normalize the question for better matching
        const normalizedQuestion = dynamicQuestion.trim().toLowerCase();

        // Convert the question to its English equivalent for lookup in API
        let englishQuestion =
          getEnglishQuestionKey(dynamicQuestion, language) || "";

        // Special case handling for certain queries
        if (
          normalizedQuestion.includes("impact") &&
          normalizedQuestion.includes("leadership")
        ) {
          englishQuestion = "What factors impact leadership?";
        }

        // Get country-specific query for initiatives if needed
        let customQuery: string | undefined = undefined;
        if (
          normalizedQuestion.includes("initiatives") &&
          normalizedQuestion.includes("carried out in") &&
          selectedCountry &&
          selectedCountry.value !== "all"
        ) {
          customQuery = `
            PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>
            PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
            SELECT ?initiativeName ?countryName ?startDate ?status
            WHERE {
              ?initiative a Ellas:Initiative.
              ?initiative rdfs:label ?initiativeName.
              ?initiative Ellas:created_in ?country.
              ?country rdfs:label ?countryName.
              OPTIONAL { ?initiative Ellas:startDate ?startDate }
              OPTIONAL { ?initiative Ellas:initiative_status ?status }
              FILTER(?countryName="${selectedCountry.value}"@en)
            }
          `;
          // Use base question for initiatives in countries
          englishQuestion =
            "Which/How many initiatives are carried out in countries?";
        }

        const fetchFunction = englishQuestion
          ? questionFunctions[englishQuestion]
          : undefined;

        if (fetchFunction && typeof fetchFunction === "function") {
          // Pass the custom query if we have one
          const response = customQuery
            ? await (fetchFunction as (query?: string) => Promise<any>)(
                customQuery
              )
            : await fetchFunction();

          if (
            response?.results?.bindings &&
            response.results.bindings.length > 0
          ) {
            // Get all fields from the response
            const fields = Object.keys(response.results.bindings[0] || {});
            setDynamicFields(fields);

            // Format the data
            const formattedData = response.results.bindings.map((item: any) => {
              const formattedItem: { [key: string]: any } = {};
              fields.forEach((field) => {
                formattedItem[field] = item[field]?.value || "";
              });
              return formattedItem;
            });

            // Set raw data
            setData(formattedData);
            setFilteredData(formattedData);

            // Update selected countries for the map
            const countries = formattedData.reduce((acc: string[], item) => {
              const country = item.countryName || item.country || "";
              if (country && !acc.includes(country)) {
                acc.push(country);
              }
              return acc;
            }, []);
            setSelectedCountries(countries);
          } else {
            setData([]);
            setFilteredData([]);
            setSelectedCountries([]);
          }
        } else {
          setData([]);
          setFilteredData([]);
          setSelectedCountries([]);
        }
      } catch (error) {
        setData([]);
        setFilteredData([]);
        setSelectedCountries([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedCategory, selectedQueryType, language, buildDynamicQuery]);

  // Update the useEffect for data filtering
  useEffect(() => {
    if (!data || data.length === 0) return;

    let filtered = [...data];

    // Apply country filter with improved logic
    if (
      selectedCountry &&
      selectedCountry.value &&
      selectedCountry.value !== "all"
    ) {
      // Use the same logic as applyFilters function for consistency
      if (
        selectedCountry.value === "USA" ||
        selectedCountry.value === "United States"
      ) {
        filtered = filtered.filter((item) => {
          if (!item.countryName) return false;

          // Parse the country string for multiple countries
          const countries = parseCountryString(item.countryName);

          // Check if any of the parsed countries matches USA or United States
          return countries.some(
            (country) =>
              country.toLowerCase() === "united states" ||
              country.toLowerCase() === "usa"
          );
        });
      } else {
        filtered = filtered.filter((item) => {
          if (!item.countryName) return false;

          // Parse the country string for multiple countries
          const countries = parseCountryString(item.countryName);

          // Check if any of the parsed countries matches the selected country
          return countries.some(
            (country) =>
              country.toLowerCase() === selectedCountry.value.toLowerCase()
          );
        });
      }
    }

    // Apply year filter
    if (selectedYear && selectedYear.value && selectedYear.value !== "all") {
      const year = selectedYear.value;
      filtered = filtered.filter((item) => {
        // Check startDate
        if (item.startDate) {
          try {
            const startDateYear = new Date(item.startDate)
              .getFullYear()
              .toString();
            if (startDateYear === year) return true;
          } catch (e) {
            if (item.startDate.includes(year)) return true;
          }
        }

        // Check finishDate
        if (item.finishDate) {
          try {
            const finishDateYear = new Date(item.finishDate)
              .getFullYear()
              .toString();
            if (finishDateYear === year) return true;
          } catch (e) {
            if (item.finishDate.includes(year)) return true;
          }
        }

        // Check start_date (alternative field name)
        if (item.start_date) {
          try {
            const startDateYear = new Date(item.start_date)
              .getFullYear()
              .toString();
            if (startDateYear === year) return true;
          } catch (e) {
            if (item.start_date.includes(year)) return true;
          }
        }

        return false;
      });
    }

    // Apply status filter
    if (
      selectedStatus &&
      selectedStatus.value &&
      selectedStatus.value !== "all"
    ) {
      filtered = filtered.filter((item) => {
        if (!item.status) return false;
        const itemStatus = item.status.toLowerCase();
        const selectedStatusValue = selectedStatus.value.toLowerCase();
        return itemStatus.includes(selectedStatusValue);
      });
    }

    // Update filtered data
    setFilteredData(filtered);

    // Update map countries based on filtered results
    const countries = filtered.reduce((acc: string[], item) => {
      const country = item.countryName || item.country || "";
      if (country && !acc.includes(country)) {
        acc.push(country);
      }
      return acc;
    }, []);

    setSelectedCountries(countries);
  }, [data, selectedCountry, selectedYear, selectedStatus]);

  // Additional useEffect to refetch data when country filter changes
  // This handles the case when user selects only category (no specific question)
  // and then changes country filter - we need to fetch new data for that country
  useEffect(() => {
    // Only trigger if we have a category but no specific question selected
    // and we have a country selected
    if (
      selectedCategory &&
      !selectedQuestion &&
      (!selectedQueryType || selectedQueryType.value === "all") &&
      selectedCountry &&
      selectedCountry.value !== "all" &&
      data.length > 0 // Only if we already have some data loaded
    ) {
      // Small delay to avoid too many rapid requests
      const timeoutId = setTimeout(() => {
        // Force a data refetch by triggering the main useEffect
        // We do this by temporarily setting isLoading to true and then letting
        // the main useEffect handle the data fetching
        setIsLoading(true);
      }, 300);

      return () => clearTimeout(timeoutId);
    }
  }, [
    selectedCountry,
    selectedCategory,
    selectedQuestion,
    selectedQueryType,
    data.length,
  ]);

  // Clear all filters
  const handleReset = () => {
    // Reset all state variables
    setSelectedCategory(null);
    setSelectedQueryType(null);
    setSelectedQuestion(null);
    setSelectedCountry(null);
    setPolicyType(null);
    setSelectedYear(null);
    setSelectedAudienceGender(null);
    setSelectedAudienceAge(null);
    setSelectedLocation(null);
    setSelectedLocationType(null);
    setSelectedEducationalLevel(null);
    setSelectedStatus(null);
    setSelectedImpactType(null);
    setSelectedContextType(null);
    setSelectedFactor(null);
    setData([]);
    setFilteredData([]);
    setSelectedCountries([]);
    setDynamicFields([]);
    setCountryCounts({});
    setYears([]);

    // Clear URL params on reset
    navigate("/open-data/1", { replace: true });
  };

  const handleCategoryChange = (option: DropDownOption | null) => {
    setSelectedCategory(option);

    // Reset query type and question when category changes
    setSelectedQueryType(null);
    setSelectedQuestion(null);

    // Reset filters
    setSelectedCountry(null);
    setSelectedYear(null);
    setSelectedStatus(null);

    // Clear data
    setData([]);
    setFilteredData([]);
    setSelectedCountries([]);
  };

  // Função para converter os dados em CSV
  const exportTableDataToCSV = (data, fields) => {
    if (!data || data.length === 0) return;

    // Cabeçalho do CSV
    const headers = ["Country", "Name", ...fields].join(",");

    // Linhas de dados
    const rows = data.map((item) =>
      [
        item.country || "",
        item.name || "",
        ...fields.map((field) => item[field] || ""),
      ].join(",")
    );

    // Juntar tudo no formato CSV
    const csvContent = [headers, ...rows].join("\n");

    // Criar blob e acionar o download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "ellas_data.csv");
  };

  // Função para exportar o mapa como imagem PNG
  const exportMapAsPNG = async () => {
    try {
      // Aguardar um pequeno delay para garantir que o mapa esteja renderizado
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Encontrar o elemento do mapa - tentar diferentes seletores
      const mapElement = document.querySelector(
        "#map-container .leaflet-container"
      ) as HTMLElement;
      if (!mapElement) {
        alert(
          translations.errors?.exportImage || "Elemento do mapa não encontrado"
        );
        return;
      }

      // Importar html2canvas dinamicamente
      const html2canvas = (await import("html2canvas")).default;

      // Configurar opções do html2canvas
      const options = {
        scale: 2, // Aumentar a qualidade da imagem
        useCORS: true, // Permitir carregamento de imagens cross-origin
        logging: false, // Desabilitar logs
        backgroundColor: "#ffffff", // Fundo branco
        allowTaint: true, // Permitir imagens de diferentes origens
        foreignObjectRendering: true, // Melhor renderização de elementos SVG
        removeContainer: true, // Remover container temporário após a captura
        onclone: (clonedDoc) => {
          // Garantir que o mapa esteja visível no clone
          const clonedMap = clonedDoc.querySelector(
            "#map-container .leaflet-container"
          );
          if (clonedMap) {
            (clonedMap as HTMLElement).style.visibility = "visible";
            (clonedMap as HTMLElement).style.opacity = "1";
          }
        },
      };

      // Capturar o elemento como canvas
      const canvas = await html2canvas(mapElement, options);

      // Converter para blob
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            alert(translations.errors?.exportImage || "Erro ao gerar imagem");
            return;
          }

          // Criar URL do blob
          const url = URL.createObjectURL(blob);

          // Criar link de download
          const link = document.createElement("a");
          link.href = url;
          link.download = "ellas_map.png";

          // Simular clique e limpar
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        },
        "image/png",
        1.0
      ); // Usar qualidade máxima
    } catch (error) {
      console.error("Erro ao exportar imagem:", error);
      alert(translations.errors?.exportImage || "Erro ao exportar imagem");
    }
  };

  // Função para exportar os dados como PDF
  const exportDataAsPDF = () => {
    try {
              const title = selectedQuestion
                ? typeof selectedQuestion === "string"
                  ? selectedQuestion
                  : selectedQuestion.label
                : "ELLAS - Dados";
      
      const fields = organizeFields(dynamicFields);
      
      generatePDF(filteredData, fields, title, translations);
    } catch (error) {
      console.error("Erro ao exportar PDF:", error);
      alert(translations.errors?.exportPDF || "Erro ao exportar PDF");
    }
  };

  // Read URL parameters when component mounts
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);

    // Get category from URL
    const categoryParam = queryParams.get("category");
    if (categoryParam) {
      const categoryLabel =
        translations.categories &&
        translations.categories[
          categoryParam as keyof typeof translations.categories
        ]
          ? String(
              translations.categories[
                categoryParam as keyof typeof translations.categories
              ]
            )
          : categoryParam;

      const categoryOption: DropDownOption = {
        value: categoryParam,
        label: categoryLabel,
      };
      setSelectedCategory(categoryOption);
    }

    // Get question from URL
    const queryTypeParam = queryParams.get("queryType");
    const questionTitleParam = queryParams.get("questionTitle");

    // Preferir questionTitle se disponível, senão usar queryType
    const questionText = questionTitleParam
      ? decodeURIComponent(questionTitleParam)
      : queryTypeParam
      ? decodeURIComponent(queryTypeParam)
      : null;

    if (questionText) {
      const questionOption: DropDownOption = {
        value: questionText,
        label: questionText,
      };
      setSelectedQueryType(questionOption);
      setSelectedQuestion(questionOption);
    }

    // Get country from URL
    const countryParam = queryParams.get("country");
    if (countryParam) {
      const countryOption = countryOptions.find(
        (option) => option.value === countryParam
      );
      if (countryOption) {
        setSelectedCountry(countryOption);
      }
    }

    // Get preselect parameter (for highlighting multiple countries)
    const preselectParam = queryParams.get("preselect");
    if (preselectParam) {
      const countries = preselectParam.split(",").map((c) => c.trim());
      setSelectedCountries(countries);
    }

    // Get year from URL
    const yearParam = queryParams.get("year");
    if (yearParam) {
      // Abordagem simplificada: criar uma nova opção de ano independente de yearOptions
      const yearOption: DropDownOption = {
        value: yearParam,
        label: yearParam,
      };
      setSelectedYear(yearOption);
    }

    // Get status from URL
    const statusParam = queryParams.get("status");
    if (statusParam) {
      const statusOption = statusOptions.find(
        (option) => option.value === statusParam
      );
      if (statusOption) {
        setSelectedStatus(statusOption);
      }
    }
  }, [
    translations,
    getQueriesByCategory,
    countryOptions,
    yearOptions,
    statusOptions,
  ]);

  const getCountryValue = (country: DropDownOption | null): string => {
    return country && country.value ? country.value : "all";
  };

  const getYearValue = (year: DropDownOption | null): string => {
    return year && year.value ? year.value : "all";
  };

  const getStatusValue = (status: DropDownOption | null): string => {
    return status && status.value ? status.value : "all";
  };

  // Update the handlers to properly set the state
  const handleCountryChange = (country: string) => {
    const option = countryOptions.find((opt) => opt.value === country);
    setSelectedCountry(option || null);
  };

  const handleYearChange = (year: string) => {
    const option = { label: year, value: year };
    setSelectedYear(option);
  };

  const handleStatusChange = (status: string) => {
    const option = statusOptions.find((opt) => opt.value === status);
    setSelectedStatus(option || null);
  };

  // Update the handleQuestionChange function
  const handleQuestionChange = (option: SelectOption | null) => {
    setSelectedQueryType(option as DropDownOption | null);
    setSelectedQuestion(option as DropDownOption | null);
  };

  const exportTableAsPNG = async () => {
    try {
      const tableElement = document.querySelector(
        ".table-image-container"
      ) as HTMLElement;
      if (!tableElement) {
        alert(translations.errors?.exportImage || "Tabela não encontrada");
        return;
      }
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(tableElement, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#fff",
      });
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            alert(translations.errors?.exportImage || "Erro ao gerar imagem");
            return;
          }
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = "ellas_tabela.png";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        },
        "image/png",
        1.0
      );
    } catch (error) {
      alert(translations.errors?.exportImage || "Erro ao exportar imagem");
    }
  };

  return (
    <>
      <Helmet>
        <title>ELLAS - Dados Abertos</title>
        <meta name="description" content="Dados Abertos - Portal ELLAS" />
      </Helmet>
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex-grow">
          <div className="flex flex-col items-center justify-start w-full bg-[#FFF8F5]">
            <div className="flex flex-col items-center justify-start w-full">
              {/* Header Section with title */}
              <DadosAbertosHeader>
                <DadosAbertosTitle>
                  {translations.busca?.dadosAbertos || "Dados Abertos"}
                </DadosAbertosTitle>
              </DadosAbertosHeader>

              {/* Survey Data Download Section */}
              <div style={{ width: '100%', padding: '16px 24px', background: '#f8f9fa' }}>
                <SurveyDownload />
              </div>

              <TopTabsContainer>
                <div className="tabs-section">
                  <TopTabsListWrapper>
                    <TopTabsList>
                      <TopTab selected>
                        {translations.visualization?.map || "Mapas"}{" "}
                        <img src="/images/img_iconx18_9.svg" alt="Map Icon" />
                      </TopTab>
                      <TopTab
                        onClick={() => {
                          const params = new URLSearchParams();
                          if (selectedCategory)
                            params.append("category", selectedCategory.value);
                          if (
                            selectedQueryType &&
                            selectedQueryType.value !== "all"
                          ) {
                            params.append(
                              "queryType",
                              encodeURIComponent(selectedQueryType.value)
                            );
                            params.append(
                              "questionTitle",
                              encodeURIComponent(selectedQueryType.label)
                            );
                          }
                          if (selectedCountry && selectedCountry.value !== "all")
                            params.append("country", selectedCountry.value);
                          if (selectedYear && selectedYear.value !== "all")
                            params.append("year", selectedYear.value);
                          if (selectedStatus && selectedStatus.value !== "all")
                            params.append("status", selectedStatus.value);

                          navigate(`/open-data/2?${params.toString()}`);
                        }}
                      >
                        {translations.visualization?.bars || "Barras"}{" "}
                        <img src="/images/img_iconx18_11.svg" alt="Bars Icon" />
                      </TopTab>
                      <TopTab
                        onClick={() => {
                          const params = new URLSearchParams();
                          if (selectedCategory)
                            params.append("category", selectedCategory.value);
                          if (
                            selectedQueryType &&
                            selectedQueryType.value !== "all"
                          ) {
                            params.append(
                              "queryType",
                              encodeURIComponent(selectedQueryType.value)
                            );
                            params.append(
                              "questionTitle",
                              encodeURIComponent(selectedQueryType.label)
                            );
                          }
                          if (selectedCountry && selectedCountry.value !== "all")
                            params.append("country", selectedCountry.value);
                          if (selectedYear && selectedYear.value !== "all")
                            params.append("year", selectedYear.value);
                          if (selectedStatus && selectedStatus.value !== "all")
                            params.append("status", selectedStatus.value);

                          navigate(`/open-data/3?${params.toString()}`);
                        }}
                      >
                        {translations.visualization?.lines || "Linhas"}{" "}
                        <img src="/images/img_iconx18_12.svg" alt="Lines Icon" />
                      </TopTab>
                    </TopTabsList>
                  </TopTabsListWrapper>
                </div>
                <div className="social-section">
                  <SocialMediaContainer>
                    {/* Redes Sociais Reais */}
                    <SocialIcon
                      href="https://www.facebook.com/ellasac.lat"
                      target="_blank"
                      className="facebook"
                      title="Facebook"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 320 512"
                        fill="currentColor"
                      >
                        <path d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z" />
                      </svg>
                    </SocialIcon>
                    <SocialIcon
                      href="https://twitter.com/ellasac_lat"
                      target="_blank"
                      className="twitter"
                      title="Twitter"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 512 512"
                        fill="currentColor"
                      >
                        <path d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z" />
                      </svg>
                    </SocialIcon>
                    <SocialIcon
                      href="https://www.instagram.com/ellas.network/"
                      target="_blank"
                      className="instagram"
                      title="Instagram"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 448 512"
                        fill="currentColor"
                      >
                        <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" />
                      </svg>
                    </SocialIcon>
                    <SocialIcon
                      href="https://www.linkedin.com/company/ellasnetwork/"
                      target="_blank"
                      className="linkedin"
                      title="LinkedIn"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 448 512"
                        fill="currentColor"
                      >
                        <path d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z" />
                      </svg>
                    </SocialIcon>
                  </SocialMediaContainer>
                </div>
              </TopTabsContainer>

              {/* Main Content Section */}
              <div className="flex flex-row md:flex-col justify-between items-start w-full px-0 max-w-[1331px]">
                {/* Sidebar Section */}
                <Sidebar
                  selectedCategory={selectedCategory?.value || null}
                  selectedQuestion={selectedQueryType?.value || null}
                  selectedCountries={selectedCountries}
                  selectedYears={selectedYears}
                  selectedStatuses={selectedStatuses}
                  countryOptions={countryOptions}
                  yearOptions={yearOptions}
                  statusOptions={statusOptions}
                  onCategoryChange={handleCategoryChange}
                  onQuestionChange={handleQuestionChange}
                  onCountryChange={handleCountryChange}
                  onYearChange={handleYearChange}
                  onStatusChange={handleStatusChange}
                  onReset={handleReset}
                />

                {/* Main Content Area */}
                <div className="flex flex-col w-[70%] md:w-full">
                  <div className="bg-white rounded-lg p-6 mb-6">
                    {selectedQueryType && (
                      <QuestionTitle size="2xl" as="h2">
                        {selectedQueryType.label}
                        {selectedCountry && selectedCountry.value !== "all" && (
                          <span className="font-normal">
                            {" "}
                            - {selectedCountry.label}
                          </span>
                        )}
                      </QuestionTitle>
                    )}

                    <div className="flex flex-col w-full">
                      <div
                        id="map-container"
                        className="relative w-full h-[352px] overflow-hidden rounded-lg"
                      >
                        <GoogleMapComponent
                          initiatives={filteredData}
                          selectedCountries={selectedCountries}
                          questionTitle={selectedQueryType?.label || ""}
                        />
                      </div>
                      <div className="text-right text-sm text-gray-600 mt-2 pr-2 w-full">
                        {translations.source?.inep ||
                          "Fonte: INEP, UNESCO e Dados Secundários da plataforma ELLAS"}
                        <DownloadIcon
                          onClick={() =>
                            exportTableDataToCSV(filteredData, dynamicFields)
                          }
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                          >
                            <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
                          </svg>
                        </DownloadIcon>
                      </div>
                    </div>
                  </div>

                  {/* Data Table Section */}
                  <div className="bg-white rounded-lg p-6">
                    <Heading as="h3" size="xl" className="mb-4">
                      {translations.busca?.tabelaDeDados || "Tabela de Dados"}
                    </Heading>
                    <div className="flex items-center justify-end gap-2 mb-2">
                      <DownloadIcon
                        onClick={() => exportDataAsPDF()}
                        title={translations.download?.pdf || "Baixar PDF"}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                        >
                          <path d="M20 2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8.5 7.5c0 .83-.67 1.5-1.5 1.5H9v1.25c0 .41-.34.75-.75.75s-.75-.34-.75-.75V8c0-.55.45-1 1-1H10c.83 0 1.5.67 1.5 1.5v1zm5 2c0 .83-.67 1.5-1.5 1.5h-2c-.28 0-.5-.22-.5-.5v-5c0-.28.22-.5.5-.5h2c.83 0 1.5.67 1.5 1.5v3zm4-3.75c0 .41-.34.75-.75.75H19v1h.75c.41 0 .75.34.75.75s-.34.75-.75.75H19v1.25c0 .41-.34.75-.75.75s-.75-.34-.75-.75V8c0-.55.45-1 1-1h1.25c.41 0 .75.34.75.75zM9 9.5h1v-1H9v1zM3 6c-.55 0-1 .45-1 1v13c0 1.1.9 2 2 2h13c.55 0 1-.45 1-1s-.45-1-1-1H5c-.55 0-1-.45-1-1V7c0-.55-.45-1-1-1zm11 5.5h1v-3h-1v3z" />
                        </svg>
                      </DownloadIcon>
                      <DownloadIcon
                        onClick={() =>
                          exportTableDataToCSV(filteredData, dynamicFields)
                        }
                        title={translations.download?.csv || "Baixar CSV"}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                        >
                          <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm-1 7V3.5L18.5 9H13z" />
                          <path d="M5 13h3v-3H5v3zm0 4h3v-3H5v3zm4-4h3v-3H9v3z" />
                        </svg>
                      </DownloadIcon>
                      <DownloadIcon
                        onClick={() => exportTableAsPNG()}
                        title={translations.download?.image || "Baixar Imagem"}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                        >
                          <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
                        </svg>
                      </DownloadIcon>
                    </div>
                    <div className="table-image-container">
                      <DataTable
                        data={filteredData}
                        dynamicFields={dynamicFields}
                        exportTableDataToCSV={exportTableDataToCSV}
                        className="mb-6"
                        key={language}
                        category={selectedCategory?.value || undefined}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BuscaOne;
