import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { AppWrapper } from './components/common/PageMeta.tsx';
import { ThemeProvider } from './context/ThemeContext.tsx';
import { LanguageProvider } from './context/LanguageContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <LanguageProvider>
        <AppWrapper>
          <App />
        </AppWrapper>
      </LanguageProvider>
    </ThemeProvider>
  </StrictMode>,
);
