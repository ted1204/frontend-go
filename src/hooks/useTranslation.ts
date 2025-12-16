import { useLanguage } from '../context/LanguageContext';
import { t as translate, LocaleKey } from '../i18n';

export const useTranslation = () => {
  const { language } = useLanguage();
  const t = (key: LocaleKey, vars?: Record<string, string | number>) =>
    translate(language, key, vars);
  return { t, lang: language } as const;
};

export default useTranslation;
