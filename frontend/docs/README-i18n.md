# Multi-Language Support in ELLAS

This document explains how to use and extend the multi-language support in the ELLAS platform.

## Overview

The ELLAS platform supports multiple languages (Portuguese, English, and Spanish) using the following technologies:

- **react-i18next**: A powerful internationalization framework for React
- **i18next**: The core library that provides the internationalization functionality

## How It Works

1. The application uses a `LanguageContext` to manage the current language and provide translations to all components.
2. Translation files are stored in JSON format in the `src/locales` directory, organized by language code.
3. The `LanguageSwitcher` component allows users to change the language throughout the application.
4. The selected language is stored in localStorage for persistence between sessions.

## Directory Structure

```
frontend/
├── src/
│   ├── locales/
│   │   ├── pt/
│   │   │   └── translation.json
│   │   ├── en/
│   │   │   └── translation.json
│   │   └── es/
│   │       └── translation.json
│   ├── contexts/
│   │   └── LanguageContext.tsx
│   ├── components/
│   │   └── LanguageSwitcher/
│   │       ├── index.tsx
│   │       └── styles.css
│   └── i18n.js
```

## How to Use in Components

### Using the `useLanguage` Hook

```tsx
import { useLanguage } from "../../contexts/LanguageContext";

const MyComponent = () => {
  const { translations, language } = useLanguage();

  return (
    <div>
      <h1>{translations.home}</h1>
      <p>{translations.about}</p>

      {/* For nested translations */}
      <p>{translations.footer.rights}</p>

      {/* Conditional rendering based on language */}
      {language === "pt" && <p>Conteúdo específico em português</p>}
    </div>
  );
};
```

### Using the `useTranslation` Hook (Alternative Method)

```tsx
import { useTranslation } from "react-i18next";

const MyComponent = () => {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t("home")}</h1>
      <p>{t("about")}</p>

      {/* For nested translations */}
      <p>{t("footer.rights")}</p>
    </div>
  );
};
```

## Adding New Translations

1. Add the new text key and value to all language files in `src/locales/*/translation.json`
2. Update the `Translations` interface in `src/contexts/LanguageContext.tsx` to include the new key

Example:

```json
// In all translation.json files
{
  "newFeature": "New Feature Text in appropriate language"
}
```

```tsx
// In LanguageContext.tsx
interface Translations {
  // ... existing translations
  newFeature: string;
}
```

## Adding a New Language

1. Create a new folder in `src/locales/` with the language code (e.g., `fr` for French)
2. Add a `translation.json` file with all the translations
3. Update the `Language` type in `LanguageContext.tsx` to include the new language code
4. Add the new language to the `languages` array in `LanguageSwitcher/index.tsx`
5. Update the resources object in `i18n.js` to include the new language

## Best Practices

1. Always use translation keys instead of hardcoded text
2. Keep translation keys organized and hierarchical for better maintainability
3. Use the same structure across all language files
4. Test the application in all supported languages after making changes
5. Consider using pluralization and formatting for numbers, dates, and currencies

## Troubleshooting

- If translations are not showing up, check the browser console for any errors related to i18next
- Verify that the language code is correctly set in the LanguageContext
- Make sure the translation key exists in all language files
- Check that the language is being correctly set in localStorage
