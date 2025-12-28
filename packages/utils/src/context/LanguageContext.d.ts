import React from 'react';
declare const LanguageContext: React.Context<{
  language: string;
  setLanguage: (l: string) => void;
}>;
export declare const LanguageProvider: React.FC<{
  children: React.ReactNode;
}>;
export declare const useLanguage: () => {
  language: string;
  setLanguage: (l: string) => void;
};
export default LanguageContext;
//# sourceMappingURL=LanguageContext.d.ts.map
