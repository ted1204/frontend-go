import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'zh' | 'en';

interface LanguageContextValue {
  language: Language;
  toggleLanguage: () => void;
  setLanguage: (l: Language) => void;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const initial = ((): Language => {
    try {
      const v = localStorage.getItem('app_language');
      if (v === 'zh' || v === 'en') return v;
    } catch (error) {
      console.warn('Language init error', error);
    }
    return 'zh';
  })();

  const [language, setLanguageState] = useState<Language>(initial);

  const setLanguage = (l: Language) => {
    setLanguageState(l);
    try {
      localStorage.setItem('app_language', l);
    } catch (error) {
      console.warn('Language set error', error);
    }
  };

  const toggleLanguage = () => setLanguage(language === 'zh' ? 'en' : 'zh');

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
};

export default LanguageContext;
