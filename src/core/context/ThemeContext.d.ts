import type React from 'react';
type Theme = 'light' | 'dark';
type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
};
declare const ThemeContext: React.Context<ThemeContextType | undefined>;
export declare const ThemeProvider: React.FC<{
  children: React.ReactNode;
}>;
export default ThemeContext;
//# sourceMappingURL=ThemeContext.d.ts.map
