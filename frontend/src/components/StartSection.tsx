import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import { questionQueries } from "../utils/questions";
import "./StartSection.css";

// Define an interface for the question items
interface QuestionItem {
  category: string;
  question: string;
  apiCategory: string;
}

const StartSection: React.FC = () => {
  const navigate = useNavigate();
  const { translations, language } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);
  const [filteredQuestions, setFilteredQuestions] = useState<string[]>([]);
  
  // Track window width for responsive display
  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Map UI categories to API categories
  const categoryMap: { [key: string]: string } = {
    Iniciativas: "initiatives",
    Políticas: "policies",
    Fatores: "factors"
  };

  // Get API category from UI category
  const getApiCategory = (uiCategory: string | null): string => {
    if (!uiCategory) return "";
    return categoryMap[uiCategory] || uiCategory.toLowerCase();
  };

  // Update filtered questions when category changes
  useEffect(() => {
    if (selectedCategory) {
      const apiCategory = getApiCategory(selectedCategory);
      const currentLang = language as "pt" | "en" | "es";
      
      // Get questions from the questions.ts file
      const questions = questionQueries[apiCategory]?.[currentLang] || [];
      setFilteredQuestions(questions);
    } else {
      setFilteredQuestions([]);
    }
    setSelectedQuestion(null);
  }, [selectedCategory, language]);

  // Get sample cards for display
  const getSampleQuestions = (): QuestionItem[] => {
    const result: QuestionItem[] = [];
    const currentLang = language as "pt" | "en" | "es";
    
    // For each category, get a couple of questions
    const categories = ["policies", "initiatives", "factors"];
    
    for (const category of categories) {
      // Get questions for this category in current language
      const questions = questionQueries[category]?.[currentLang] || [];
      
      // Take first two questions or as many as available
      // On mobile, just show one question per category to save space
      const questionsPerCategory = windowWidth < 768 ? 1 : 2;
      const count = Math.min(questionsPerCategory, questions.length);
      
      for (let i = 0; i < count; i++) {
        // Get UI category name based on language and API category
        let uiCategory = category;
        if (language === "pt") {
          if (category === "initiatives") uiCategory = "Iniciativas";
          else if (category === "policies") uiCategory = "Políticas";
          else if (category === "factors") uiCategory = "Fatores";
        } else if (language === "en") {
          if (category === "initiatives") uiCategory = "Initiatives";
          else if (category === "policies") uiCategory = "Policies";
          else if (category === "factors") uiCategory = "Factors";
        } else if (language === "es") {
          if (category === "initiatives") uiCategory = "Iniciativas";
          else if (category === "policies") uiCategory = "Políticas";
          else if (category === "factors") uiCategory = "Factores";
        }
        
        result.push({
          category: uiCategory,
          question: questions[i],
          apiCategory: category
        });
      }
    }
    
    return result;
  };

  // Memoize sample questions to avoid recalculation on every render
  const sampleQuestions = useMemo(() => getSampleQuestions(), [language, windowWidth]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    const params = new URLSearchParams();
    
    // Add category to URL if selected
    if (selectedCategory) {
      const categoryValue = getApiCategory(selectedCategory);
      params.append("category", categoryValue);
      
      // For any category, pre-select all countries if no specific question
      if (!selectedQuestion) {
        params.append("preselect", "Argentina,Bolivia,Brazil,Chile,Colombia,Mexico,Peru");
      }
    }
    
    // Add query if selected
    if (selectedQuestion) {
      params.append("queryType", encodeURIComponent(selectedQuestion));
      
      // Adiciona o parâmetro questionTitle para exibir o texto da pergunta na interface
      params.append("questionTitle", encodeURIComponent(selectedQuestion));
    }
    
    // Navigate to search page with parameters
    navigate(`/buscaone?${params.toString()}`);
  };

  return (
    <section className="start-section">
      <div className="container">
        <h2>{translations.featuredQuestions?.title}</h2>
        <p className="subtitle">{translations.featuredQuestions?.subtitle}</p>

        <div className="cards-grid">
          {sampleQuestions.map((item, index) => (
            <div
              key={index}
              className="card"
              onClick={() =>
                navigate(
                  `/buscaone?category=${item.apiCategory}&queryType=${encodeURIComponent(
                    item.question
                  )}&questionTitle=${encodeURIComponent(item.question)}`
                )
              }
            >
              <div className="card-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  {(item.category === "Políticas" ||
                    item.category === "Policies") && (
                    <path
                      d="M12 3L20 7V17L12 21L4 17V7L12 3Z"
                      stroke="#6B46C1"
                      strokeWidth="2"
                    />
                  )}
                  {(item.category === "Iniciativas" ||
                    item.category === "Initiatives") && (
                    <path
                      d="M3 12H21M3 6H21M3 18H21"
                      stroke="#6B46C1"
                      strokeWidth="2"
                    />
                  )}
                  {(item.category === "Fatores" ||
                    item.category === "Factors" ||
                    item.category === "Factores") && (
                    <path
                      d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                      stroke="#6B46C1"
                      strokeWidth="2"
                    />
                  )}
                </svg>
              </div>
              <h3>{item.category}</h3>
              <p>{item.question}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StartSection;
