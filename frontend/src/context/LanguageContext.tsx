import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

type Language = 'en' | 'hi' | 'te';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (englishText: string, productTranslations?: any, field?: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('en');

  // Helper function to translate text.
  // It checks if the product has translations configured for the selected language.
  const t = (englishText: string, productTranslations?: any, field?: string) => {
    if (language === 'en') return englishText;
    
    if (productTranslations && field && productTranslations[language] && productTranslations[language][field]) {
      return productTranslations[language][field];
    }
    
    // If no specific translation exists, fallback to English
    return englishText;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
