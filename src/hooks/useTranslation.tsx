import { h, createContext, FunctionComponent } from "preact";
import { useContext, useEffect, useState } from "preact/hooks";
import {
  defaultLocale,
  getInitialLocale,
  Locale,
  TranslationKey,
  translations,
} from "../i18n";

export type LocaleDescriptor = Locale;
export const TranslationContext = createContext({
  locale: "en" as LocaleDescriptor,
  setLocale: (() => null) as (locale: LocaleDescriptor) => void,
});

export default function useTranslation() {
  const { locale } = useContext(TranslationContext);

  function t(key: keyof TranslationKey) {
    if (!translations[locale][key]) {
      console.warn(`Translation '${key}' for locale '${locale}' not found.`);
    }
    return translations[locale][key] || translations[defaultLocale][key] || "";
  }

  return {
    t,
    locale,
  };
}

export const TranslationProvider: FunctionComponent = ({ children }) => {
  const [locale, setLocale] = useState(getInitialLocale());
  useEffect(() => {
    if (locale !== localStorage.getItem("locale")) {
      localStorage.setItem("locale", locale);
    }
  }, [locale]);

  return (
    <TranslationContext.Provider value={{ locale, setLocale }}>
      {children}
    </TranslationContext.Provider>
  );
};
