import React, { ReactNode } from 'react';
type Language = 'zh' | 'en';
interface LanguageContextValue {
  language: Language;
  toggleLanguage: () => void;
  setLanguage: (l: Language) => void;
}
declare const LanguageContext: React.Context<LanguageContextValue | undefined>;
export declare const LanguageProvider: ({
  children,
}: {
  children: ReactNode;
}) => import('react/jsx-runtime').JSX.Element;
export declare const useLanguage: () => LanguageContextValue;
export default LanguageContext;
//# sourceMappingURL=LanguageContext.d.ts.map
