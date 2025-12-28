import { jsx as _jsx } from 'react/jsx-runtime';
import React from 'react';
import { LanguageContext } from './LanguageContextCore';
export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = React.useState('en');
  console.log('[LanguageProvider] render, language =', language);
  return _jsx(LanguageContext.Provider, { value: { language, setLanguage }, children: children });
};
export const useLanguage = () => {
  return React.useContext(LanguageContext);
};
export default LanguageContext;
