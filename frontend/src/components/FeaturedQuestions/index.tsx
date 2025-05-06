import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import './styles.css';

interface FeaturedQuestionsProps {
  className?: string;
}

const FeaturedQuestions: React.FC<FeaturedQuestionsProps> = ({ className = '' }) => {
  const { translations } = useLanguage();
  const navigate = useNavigate();

  // Updated questions to match available fetch functions in questionFunctions
  const questions = {
    initiatives: [
      'Which/How many initiatives are carried out in countries?',
      'What initiatives serve Black women?',
      'What initiatives are active?',
      'What data source are used for initiative?',
      'What initiatives are funded?'
    ],
    policies: [
      'In which countries the policy was applied?',
      'What types of gender policies/processes/practices exist in Latin America?',
      'How policies identified/analyzed are promoting women\'s participation in STEM fields?',
      'What types of gender policies/processes/practices have been implemented in Bolivia, Brazil and Peru since 2015?',
      'Which countries have implemented gender policies?'
    ],
    factors: [
      'What are the positive contextual factors?',
      'What are the CONTEXTUAL FACTORS that impact Positively/Negatively the GENDER Female?',
      'What are the IMPACTS of CONTEXTUAL FACTOR X?',
      'Which are the IMPACT TYPES of the CONTEXTUAL FACTOR Y in Latin American INSTITUTIONS?',
      'What are the negative contextual factors?'
    ]
  };

  const handleQuestionClick = (category: string, question: string) => {
    const params = new URLSearchParams();
    params.append('category', category);
    params.append('queryType', encodeURIComponent(question));
    navigate(`/buscaone?${params.toString()}`);
  };

  return (
    <div className={`featured-questions-container ${className}`}>
      <h2 className="featured-questions-title">
        {translations.featuredQuestions?.title || 'Featured Questions'}
      </h2>
      <p className="featured-questions-subtitle">
        {translations.featuredQuestions?.subtitle || 'Explore our data with these popular queries'}
      </p>

      <div className="featured-questions-grid">
        {Object.entries(questions).map(([category, questionList]) => (
          <div key={category} className="featured-questions-category">
            <h3 className="category-title">
              {translations.categories?.[category as keyof typeof translations.categories] || category}
            </h3>
            <ul className="question-list">
              {questionList.map((question, index) => (
                <li key={index} className="question-item">
                  <button 
                    className="question-button"
                    onClick={() => handleQuestionClick(category, question)}
                  >
                    {question}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedQuestions; 