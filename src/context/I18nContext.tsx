import React, { createContext, useContext, useState, useEffect } from 'react';
import { SupportedLanguage, LANGUAGES, TRANSLATIONS, LanguageInfo } from '../data/translations';

interface I18nContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (key: string, defaultText?: string) => string;
  languages: LanguageInfo[];
  currentLangInfo: LanguageInfo;
  isRTL: boolean;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<SupportedLanguage>(() => {
    const saved = localStorage.getItem('refeir_language') as SupportedLanguage;
    return saved && LANGUAGES.some(l => l.code === saved) ? saved : 'en';
  });

  const currentLangInfo = LANGUAGES.find(l => l.code === language) || LANGUAGES[0];
  const isRTL = currentLangInfo.dir === 'rtl';

  useEffect(() => {
    localStorage.setItem('refeir_language', language);
    document.documentElement.lang = language;
    document.documentElement.dir = currentLangInfo.dir;
  }, [language, currentLangInfo]);

  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang);
  };

  const t = (key: string, defaultText?: string): string => {
    const langDict = TRANSLATIONS[language];
    if (langDict && langDict[key]) {
      return langDict[key];
    }
    const enDict = TRANSLATIONS['en'];
    if (enDict && enDict[key]) {
      return enDict[key];
    }
    return defaultText || key;
  };

  return (
    <I18nContext.Provider
      value={{
        language,
        setLanguage,
        t,
        languages: LANGUAGES,
        currentLangInfo,
        isRTL
      }}
    >
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) throw new Error('useI18n must be used within an I18nProvider');
  return context;
};
