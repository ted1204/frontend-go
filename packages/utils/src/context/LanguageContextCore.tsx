import React, { createContext } from 'react';
import type { Locale } from '../i18n';

export const LanguageContext = createContext<{
  language: Locale;
  setLanguage: React.Dispatch<React.SetStateAction<Locale>>;
  toggleLanguage: () => void;
}>({
  language: 'en',
  setLanguage: (() => {}) as React.Dispatch<React.SetStateAction<Locale>>,
  toggleLanguage: () => {},
});

export default LanguageContext;
