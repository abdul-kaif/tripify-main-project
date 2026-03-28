import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "../locales/en/translation.json";
import hi from "../locales/hi/translation.json";
import doi from "../locales/doi/translation.json";
import ne from "../locales/ne/translation.json";
import ta from "../locales/ta/translation.json";
import sp from "../locales/sp/translation.json";

i18n.use(initReactI18next).init({
    resources: {
        en: { translation: en },
        hi: { translation: hi },
        ne: { translation: ne },
        doi: { translation: doi },
        ta: { translation: ta },
        sp : {translation: sp}
    },
      returnObjects: true,
    lng: "en",       // default language
    fallbackLng: "en",
    interpolation: {
        escapeValue: false
    }
});

export default i18n;
