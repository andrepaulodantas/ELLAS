import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Helmet } from "react-helmet";
import { Text, Img, Heading, Button, SelectBox } from "../../components";
import { TabPanel, TabList, Tab, Tabs } from "react-tabs";
import { useNavigate } from "react-router-dom";
import GoogleMapComponent from "../../components/GoogleMap";
import {
  questionFunctions,
  getEnglishQuestionKey,
} from "../../services/apiService";
import { saveAs } from "file-saver";
import Header from "../../components/Header";
import DataTable from "components/DataTable";
import { SelectOption } from "../../components/SelectBox";
import { timeRelatedQuestions } from "../../utils/questions";
import { useLanguage } from "../../contexts/LanguageContext";
import Sidebar from "../../components/Sidebar";

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
              "Which/How many initiatives are carried out by countries?",
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
            "Which/How many initiatives are carried out by countries?";
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

        // Convert the question to its English equivalent for lookup in API
        const englishQuestion =
          getEnglishQuestionKey(dynamicQuestion, language) || "";

        const fetchFunction = englishQuestion
          ? questionFunctions[englishQuestion]
          : undefined;

        if (fetchFunction && typeof fetchFunction === "function") {
            const response = await fetchFunction();

          if (response?.results?.bindings) {
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

    // Apply country filter
    if (
      selectedCountry &&
      selectedCountry.value &&
      selectedCountry.value !== "all"
    ) {
      filtered = filtered.filter((item) => {
        const itemCountry = item.countryName || item.country || "";
        return itemCountry
          .toLowerCase()
          .includes(selectedCountry.value.toLowerCase());
      });
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
    navigate("/buscaone", { replace: true });
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

  const exportTableDataToCSV = (data: any[], fields: string[]) => {
    if (!data || data.length === 0) {
      alert("No data available to export!");
      return;
    }

    const headers = ["Country", "Name", ...fields].join(",");
    const rows = data.map((item) =>
      [
        item.countryName || "N/A",
        item.name || "N/A",
        ...fields.map((field) => item[field] || "N/A"),
      ].join(",")
    );
    const csvContent = [headers, ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "data_table.csv");
  };

  // Update the useEffect to read URL parameters and set initial state
  useEffect(() => {
    // Read URL parameters
    const params = new URLSearchParams(window.location.search);
    const categoryParam = params.get("category");
    const queryTypeParam = params.get("queryType");
    const countryParam = params.get("country");
    const yearParam = params.get("year");
    const statusParam = params.get("status");

    // Set initial category if provided in URL
    if (categoryParam) {
      const categoryOption = [
        { label: translations.categories.initiatives, value: "initiatives" },
        { label: translations.categories.policies, value: "policies" },
        { label: translations.categories.factors, value: "factors" },
      ].find((option) => option.value === categoryParam);

      if (categoryOption) {
        setSelectedCategory(categoryOption);

        // Load query types based on category
        if (queryTypeParam) {
          try {
            // Try to decode the URL parameter
            const decodedQueryType = decodeURIComponent(queryTypeParam);

            // First check if this is a value from a dropdown (BuscaOne)
            const queryTypes = getQueriesByCategory(categoryParam);

            // Try to find an exact match with the label
            let queryTypeOption = queryTypes.find(
              (option) => option.label === decodedQueryType
            );

            // If no match, try to find one that contains the queryType text
            if (!queryTypeOption) {
              queryTypeOption = queryTypes.find(
                (option) =>
                  decodedQueryType
                    .toLowerCase()
                    .includes(option.label.toLowerCase()) ||
                  option.label
                    .toLowerCase()
                    .includes(decodedQueryType.toLowerCase())
              );
            }

            if (queryTypeOption) {
              setSelectedQueryType(queryTypeOption);
            }
          } catch (error) {
            console.error("Error decoding queryType parameter:", error);
          }
        }
      }
    }

    // Set initial country if provided in URL
    if (countryParam) {
      const countryOption = countryOptions.find(
        (option) => option.value === countryParam
      );
      if (countryOption) {
        setSelectedCountry(countryOption);
      }
    }

    // Set initial year if provided in URL
    if (yearParam) {
      const yearOption = yearOptions.find((option) => option === yearParam);
      if (yearOption) {
        setSelectedYear({ label: yearOption, value: yearOption });
      }
    }

    // Set initial status if provided in URL
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

  return (
    <>
      <Helmet>
        <title>ELLAS - Busca</title>
        <meta
          name="description"
          content="Web site created using create-react-app"
        />
      </Helmet>
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex-grow">
          <div className="flex flex-col items-center justify-start w-full bg-white-A700">
            <div className="flex flex-col items-center justify-start w-full">
              {/* Header Section */}
              <div className="flex flex-row justify-center items-center w-full p-8 sm:p-6 border-b-2 border-deep_orange-200 bg-gray-50">
                <Heading
                  size="2xl"
                  as="h1"
                  className="text-center text-gray-800 font-semibold"
                >
                  {translations.table.title}
                </Heading>
              </div>

              {/* Main Content Section */}
              <div className="flex flex-row md:flex-col justify-between items-start w-full gap-10 px-6 sm:px-4 max-w-[1331px]">
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
                  <Tabs
                    className="w-full"
                    selectedTabClassName="!text-[#4A2B5C] font-medium border-[#4A2B5C] border-b-2 bg-white"
                  >
                    <TabList className="flex flex-row gap-4 border-b border-gray-200">
                      <Tab
                        className="p-4 flex items-center gap-2 cursor-pointer outline-none"
                        selectedClassName="!text-[#4A2B5C] border-b-2 border-[#4A2B5C]"
                      >
                        <Text as="p">{translations.visualization.map}</Text>
                        <Img src="images/img_iconx18_9.svg" alt="Map Icon" />
                      </Tab>
                      <Tab
                        className="p-4 flex items-center gap-2 cursor-pointer outline-none"
                        selectedClassName="!text-[#4A2B5C] border-b-2 border-[#4A2B5C]"
                        onClick={() => {
                          // Preserve search parameters when navigating
                          const params = new URLSearchParams();
                          if (selectedCategory)
                            params.append("category", selectedCategory.value);

                          // For query type, transfer the actual question text if available
                          if (
                            selectedQueryType &&
                            selectedQueryType.value !== "all"
                          ) {
                            // Encode the full question text to handle special characters
                            params.append(
                              "queryType",
                              encodeURIComponent(selectedQueryType.label)
                            );
                          }

                          if (
                            selectedCountry &&
                            selectedCountry.value !== "all"
                          )
                            params.append("country", selectedCountry.value);
                          if (selectedYear && selectedYear.value !== "all")
                            params.append("year", selectedYear.value);
                          if (selectedStatus && selectedStatus.value !== "all")
                            params.append("status", selectedStatus.value);

                          navigate(`/buscatwo?${params.toString()}`);
                        }}
                      >
                        <Text as="p">{translations.visualization.bars}</Text>
                        <Img src="images/img_iconx18_11.svg" alt="Bars Icon" />
                      </Tab>
                      <Tab
                        className="p-4 flex items-center gap-2 cursor-pointer outline-none"
                        selectedClassName="!text-[#4A2B5C] border-b-2 border-[#4A2B5C]"
                        onClick={() => {
                          // Preserve search parameters when navigating
                          const params = new URLSearchParams();
                          if (selectedCategory)
                            params.append("category", selectedCategory.value);

                          // For query type, transfer the actual question text if available
                          if (
                            selectedQueryType &&
                            selectedQueryType.value !== "all"
                          ) {
                            // Encode the full question text to handle special characters
                            params.append(
                              "queryType",
                              encodeURIComponent(selectedQueryType.label)
                            );
                          }

                          if (
                            selectedCountry &&
                            selectedCountry.value !== "all"
                          )
                            params.append("country", selectedCountry.value);
                          if (selectedYear && selectedYear.value !== "all")
                            params.append("year", selectedYear.value);
                          if (selectedStatus && selectedStatus.value !== "all")
                            params.append("status", selectedStatus.value);

                          navigate(`/buscatwoone?${params.toString()}`);
                        }}
                      >
                        <Text as="p">{translations.visualization.lines}</Text>
                        <Img src="images/img_iconx18_12.svg" alt="Lines Icon" />
                      </Tab>
                    </TabList>

                    {/* Map Content */}
                    <TabPanel className="mt-6">
                      <div className="flex flex-col gap-4">
                        {selectedQueryType && (
                          <Text
                            size="xl"
                            as="p"
                            className="mb-4 text-center text-gray-700 font-medium"
                          >
                            {selectedQueryType.label}
                      </Text>
                        )}
                      <div className="relative w-full h-[352px] overflow-hidden rounded-lg">
                        <GoogleMapComponent
                          initiatives={filteredData}
                          selectedCountries={selectedCountries}
                        />
                        </div>
                      </div>
                    </TabPanel>
                  </Tabs>

                  {/* Data Table Section */}
                  <DataTable
                    data={filteredData}
                    dynamicFields={dynamicFields}
                    exportTableDataToCSV={exportTableDataToCSV}
                    className="mb-12"
                    key={language}
                  />
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
