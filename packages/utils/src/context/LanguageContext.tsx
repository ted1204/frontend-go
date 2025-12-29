import React from 'react';
import { LanguageContext } from './LanguageContextCore';

import type { Locale } from '../i18n';

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = React.useState<Locale>('en');
  const toggleLanguage = () => setLanguage((prev) => (prev === 'zh' ? 'en' : 'zh'));
  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  return React.useContext(LanguageContext as React.Context<any>);
};

export default LanguageContext;
