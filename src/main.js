import { jsx as _jsx } from "react/jsx-runtime";
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { AppWrapper } from '@tailadmin/ui';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from '@tailadmin/utils';
createRoot(document.getElementById('root')).render(_jsx(StrictMode, { children: _jsx(ThemeProvider, { children: _jsx(LanguageProvider, { children: _jsx(AppWrapper, { children: _jsx(App, {}) }) }) }) }));
