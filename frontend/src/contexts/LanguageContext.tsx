import React, { createContext, useContext, useState, useCallback } from 'react';
import { getFullTranslations } from '../services/apiService';

interface LanguageContextType {
  language: string;
  translations: any;
  setLanguage: (lang: string) => Promise<void>;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState('en');
  const [translations, setTranslations] = useState({});

  const setLanguage = useCallback(async (lang: string) => {
    const newTranslations = await getFullTranslations(lang);
    setLanguageState(lang);
    setTranslations(newTranslations);
  }, []);

  return (
    <LanguageContext.Provider value={{ language, translations, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}; 