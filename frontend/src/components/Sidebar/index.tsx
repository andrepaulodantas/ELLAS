import React, { useEffect } from "react";
import { Text, Button, SelectBox } from "..";
import { useLanguage } from "../../contexts/LanguageContext";
import { questionQueries, timeRelatedQuestions } from "../../utils/questions";

interface SidebarProps {
  selectedCategory: string | null;
  selectedQuestion: string | null;
  selectedCountries: string[];
  selectedYears: string[];
  selectedStatuses: string[];
  countryOptions: Array<{ value: string; label: string }>;
  yearOptions: string[];
  statusOptions: Array<{ value: string; label: string }>;
  onCategoryChange: (option: { value: string; label: string } | null) => void;
  onQuestionChange: (option: { value: string; label: string } | null) => void;
  onCountryChange: (country: string) => void;
  onYearChange: (year: string) => void;
  onStatusChange: (status: string) => void;
  onReset: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  selectedCategory,
  selectedQuestion,
  selectedCountries,
  selectedYears,
  selectedStatuses,
  countryOptions,
  yearOptions,
  statusOptions,
  onCategoryChange,
  onQuestionChange,
  onCountryChange,
  onYearChange,
  onStatusChange,
  onReset,
}) => {
  const { translations, language } = useLanguage();

  const categoryOptions = [
    {
      label: translations?.categories?.initiatives || "Iniciativas",
      value: "initiatives",
    },
    {
      label: translations?.categories?.policies || "Políticas",
      value: "policies",
    },
    { label: translations?.categories?.factors || "Fatores", value: "factors" },
  ];

  // Check if the current question uses year filter
  const showYearFilter =
    selectedQuestion &&
    (timeRelatedQuestions.includes(selectedQuestion.toLowerCase()) ||
      selectedQuestion.toLowerCase().includes("since") ||
      selectedQuestion.toLowerCase().includes("implemented") ||
      selectedQuestion.toLowerCase().includes("finished") ||
      selectedQuestion.toLowerCase().includes("active"));

  // Check if the current question uses status filter
  const showStatusFilter =
    selectedQuestion &&
    (selectedQuestion.toLowerCase().includes("active") ||
      selectedQuestion.toLowerCase().includes("finished") ||
      selectedQuestion.toLowerCase().includes("design") ||
      selectedQuestion.toLowerCase().includes("implemented") ||
      selectedQuestion.toLowerCase().includes("status"));

  // Parse country data - to handle cases where multiple countries are listed in one field
  const parseCountryString = (countryString: string) => {
    if (!countryString) return [];
    // Handle common separators like "and", "&", ",", "y", etc.
    const countries = countryString.split(/\s+and\s+|\s*[,&]\s*|\s+y\s+/);
    return countries.map((country) => country.trim()).filter(Boolean);
  };

  // Check if a country is selected (either directly or as part of a multi-country entry)
  const isCountrySelected = (countryValue: string) => {
    return selectedCountries.some((selectedCountry) => {
      const countries = parseCountryString(selectedCountry);
      return countries.some(
        (c) => c.toLowerCase() === countryValue.toLowerCase()
      );
    });
  };

  // Get question options based on selected category
  const getQuestionOptions = () => {
    if (!selectedCategory) return [];

    const options =
      questionQueries[selectedCategory]?.[language]?.map((q) => ({
        label: q,
        value: q,
      })) || [];

    // Make sure the currently selected question is in the options
    if (
      selectedQuestion &&
      !options.some((opt) => opt.value === selectedQuestion)
    ) {
      options.unshift({
        label: selectedQuestion,
        value: selectedQuestion,
      });
    }

    return options;
  };

  // Force dropdown to show when component mounts if question is already selected
  useEffect(() => {
    // Show all dropdown elements if they have values selected
    if (selectedQuestion || selectedCountries.length > 0) {
      const countryDropdown = document.getElementById("countryDropdown");
      if (countryDropdown) {
        countryDropdown.style.display = "block";
      }
    }

    if (showYearFilter || selectedYears.length > 0) {
      const yearDropdown = document.getElementById("yearDropdown");
      if (yearDropdown) {
        yearDropdown.style.display = "block";
      }
    }

    if (showStatusFilter || selectedStatuses.length > 0) {
      const statusDropdown = document.getElementById("statusDropdown");
      if (statusDropdown) {
        statusDropdown.style.display = "block";
      }
    }
  }, [
    selectedQuestion,
    showYearFilter,
    showStatusFilter,
    selectedCountries,
    selectedYears,
    selectedStatuses,
  ]);

  return (
    <div className="h-auto w-[29%] md:w-full lg:w-full bg-white-A700 shadow-md p-6 sm:p-4 sm:mb-4">
      <Button
        size="xs"
        variant="outline"
        className="mb-4 gap-2.5 w-full rounded-[35px]"
        onClick={onReset}
      >
        {translations?.buttons?.reset || "Reiniciar"}
      </Button>

      <div className="flex flex-col gap-6">
        {/* Category Selection */}
        <div>
          <Text
            size="3xl"
            as="p"
            className="mb-2 text-gray-700 font-medium sm:text-xl"
          >
            {translations?.labels?.category || "Categoria"}
          </Text>
          <SelectBox
            shape="round"
            name="categoria"
            placeholder={
              translations?.labels?.selectCategory || "Selecione uma categoria"
            }
            options={categoryOptions}
            value={
              selectedCategory
                ? {
                    label:
                      categoryOptions.find(
                        (opt) => opt.value === selectedCategory
                      )?.label || selectedCategory,
                    value: selectedCategory,
                  }
                : null
            }
            onChange={onCategoryChange}
            className="w-full text-gray-700 font-medium border-gray-300_01 border rounded-md"
          />
        </div>

        {/* Question Selection */}
        {selectedCategory && (
          <div>
            <Text
              size="3xl"
              as="p"
              className="mb-2 text-gray-700 font-medium sm:text-xl"
            >
              {translations?.labels?.question || "Pergunta"}
            </Text>
            <SelectBox
              shape="round"
              name="pergunta"
              placeholder={
                translations?.labels?.selectQuestion || "Selecione uma pergunta"
              }
              options={getQuestionOptions()}
              value={
                selectedQuestion
                  ? {
                      label: selectedQuestion,
                      value: selectedQuestion,
                    }
                  : null
              }
              onChange={onQuestionChange}
              className="w-full text-gray-700 font-medium border-gray-300_01 border rounded-md"
            />
          </div>
        )}

        {/* Filters Section */}
        {selectedCategory && (
          <div className="flex flex-col gap-4">
            <Text
              size="3xl"
              as="p"
              className="mb-2 text-gray-700 font-medium sm:text-xl"
            >
              {translations?.labels?.filters || "Filtros"}
            </Text>

            {/* Country Filter */}
            <div className="flex flex-col gap-2">
              <div
                className="flex justify-between items-center p-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
                onClick={() => {
                  const element = document.getElementById("countryDropdown");
                  if (element) {
                    element.style.display =
                      element.style.display === "none" ? "block" : "none";
                  }
                }}
              >
                <Text
                  size="3xl"
                  as="p"
                  className="text-gray-700 font-medium sm:text-xl"
                >
                  {translations?.filters?.country || "País"}
                </Text>
                <svg
                  className="w-5 h-5 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
              <div id="countryDropdown" className="hidden">
                <div className="flex flex-col gap-2 max-h-[200px] sm:max-h-[150px] overflow-y-auto border border-gray-300 rounded-md p-2 bg-white shadow-sm">
                  {countryOptions.map((country) => (
                    <label
                      key={country.value}
                      className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded"
                    >
                      <input
                        type="checkbox"
                        checked={isCountrySelected(country.value)}
                        onChange={() => onCountryChange(country.value)}
                        className="w-4 h-4 text-deep_orange-200 border-gray-300 rounded focus:ring-deep_orange-200"
                      />
                      <Text
                        size="md"
                        as="span"
                        className="text-gray-700 sm:text-sm"
                      >
                        {country.label}
                      </Text>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Year Filter - Only show if the question uses year */}
            {showYearFilter && (
              <div className="flex flex-col gap-2">
                <div
                  className="flex justify-between items-center p-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
                  onClick={() => {
                    const element = document.getElementById("yearDropdown");
                    if (element) {
                      element.style.display =
                        element.style.display === "none" ? "block" : "none";
                    }
                  }}
                >
                  <Text size="3xl" as="p" className="text-gray-700 font-medium">
                    {translations?.filters?.startDate || "Data de Início"}
                  </Text>
                  <svg
                    className="w-5 h-5 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
                <div id="yearDropdown" className="hidden">
                  <div className="flex flex-col gap-2 max-h-[200px] overflow-y-auto border border-gray-300 rounded-md p-2 bg-white shadow-sm">
                    {yearOptions.map((year) => (
                      <label
                        key={year}
                        className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded"
                      >
                        <input
                          type="checkbox"
                          checked={selectedYears.includes(year)}
                          onChange={() => onYearChange(year)}
                          className="w-4 h-4 text-deep_orange-200 border-gray-300 rounded focus:ring-deep_orange-200"
                        />
                        <Text size="md" as="span" className="text-gray-700">
                          {year}
                        </Text>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Status Filter - Only show if the question uses status */}
            {showStatusFilter && (
              <div className="flex flex-col gap-2">
                <div
                  className="flex justify-between items-center p-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
                  onClick={() => {
                    const element = document.getElementById("statusDropdown");
                    if (element) {
                      element.style.display =
                        element.style.display === "none" ? "block" : "none";
                    }
                  }}
                >
                  <Text size="3xl" as="p" className="text-gray-700 font-medium">
                    {translations?.filters?.statuses || "Status"}
                  </Text>
                  <svg
                    className="w-5 h-5 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
                <div id="statusDropdown" className="hidden">
                  <div className="flex flex-col gap-2 max-h-[200px] overflow-y-auto border border-gray-300 rounded-md p-2 bg-white shadow-sm">
                    {statusOptions.map((status) => (
                      <label
                        key={status.value}
                        className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded"
                      >
                        <input
                          type="checkbox"
                          checked={selectedStatuses.includes(status.value)}
                          onChange={() => onStatusChange(status.value)}
                          className="w-4 h-4 text-deep_orange-200 border-gray-300 rounded focus:ring-deep_orange-200"
                        />
                        <Text size="md" as="span" className="text-gray-700">
                          {status.label}
                        </Text>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
