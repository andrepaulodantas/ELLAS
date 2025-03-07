import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Import translations directly
import translationEN from "./locales/en/translation.json";
import translationPT from "./locales/pt/translation.json";
import translationES from "./locales/es/translation.json";

// the translations
const resources = {
  en: {
    translation: translationEN,
  },
  pt: {
    translation: translationPT,
  },
  es: {
    translation: translationES,
  },
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: localStorage.getItem("language") || "pt", // default language
    fallbackLng: "pt",

    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
