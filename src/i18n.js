import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
// import en from "@/utils/translation/en.json";
import pt from "@/utils/translation/pt.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      // en: { translation: en },
      pt: { translation: pt },
    },
    debug: true,
    fallbackLng: "pt",
    // lag: "en",
    nonExplicitSupportedLngs: true,
    interpolation: {
      escapeValue: false,
    },
    detection: {
      //order: ['path', 'cookie', 'htmlTag'],
      caches: ["cookie"],
    },
  });
