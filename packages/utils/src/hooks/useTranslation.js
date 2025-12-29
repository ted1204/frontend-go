import { useLanguage } from '../context/LanguageContext';
import { t as translate } from '../i18n';
import { useCallback } from 'react';
export const useTranslation = () => {
    const { language } = useLanguage();
    const t = useCallback((key, vars) => {
        // DEBUG: 印出目前語言與 key
        console.log('[useTranslation] lang:', language, 'key:', key, 'vars:', vars);
        return translate(language, key, vars);
    }, [language]);
    return { t, lang: language };
};
export default useTranslation;
