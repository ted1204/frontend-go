import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { AppWrapper } from '@tailadmin/ui';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from '@tailadmin/utils';

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
