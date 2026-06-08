import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./locales/en.json";
import ur from "./locales/ur.json";
import ru from "./locales/ru.json";

const savedLng = localStorage.getItem("lng") || "en";

// Apply RTL + Nastaliq immediately (before React mounts) to avoid flash
const applyLangToDOM = (lng) => {
    const html = document.documentElement;
    if (lng === "ur") {
        html.setAttribute("dir", "rtl");
        html.setAttribute("lang", "ur");
        html.classList.add("lang-ur");
    } else {
        html.setAttribute("dir", "ltr");
        html.setAttribute("lang", lng || "en");
        html.classList.remove("lang-ur");
    }
};

applyLangToDOM(savedLng);

i18n
    .use(initReactI18next)
    .init({
        resources: {
            en: { translation: en },
            ur: { translation: ur },
            ru: { translation: ru },
        },
        lng: savedLng,
        fallbackLng: "en",
        interpolation: {
            escapeValue: false,
        },
    });

// Also apply whenever language changes programmatically
i18n.on("languageChanged", applyLangToDOM);

export default i18n;
