import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "../locales/en.json";
import ar from "../locales/ar.json";
import hi from "../locales/hi.json";
import zh from "../locales/zh.json";
import ko from "../locales/ko.json";
import fa from "../locales/fa.json";

export const SUPPORTED_LANGUAGES = [
  { code: "en", label: "English", nativeLabel: "English", dir: "ltr" as const },
  { code: "ar", label: "Arabic", nativeLabel: "العربية", dir: "rtl" as const },
  { code: "hi", label: "Hindi", nativeLabel: "हिन्दी", dir: "ltr" as const },
  { code: "zh", label: "Chinese", nativeLabel: "中文", dir: "ltr" as const },
  { code: "ko", label: "Korean", nativeLabel: "한국어", dir: "ltr" as const },
  { code: "fa", label: "Farsi", nativeLabel: "فارسی", dir: "rtl" as const },
];

export const DEFAULT_LANGUAGE = "en";
export const RTL_LANGUAGES = new Set(
  SUPPORTED_LANGUAGES.filter((l) => l.dir === "rtl").map((l) => l.code)
);

function getInitialLanguage(): string {
  if (typeof window === "undefined") return DEFAULT_LANGUAGE;
  try {
    const saved = window.localStorage.getItem("lang");
    if (saved && SUPPORTED_LANGUAGES.some((l) => l.code === saved)) return saved;
  } catch {
    /* ignore */
  }
  return DEFAULT_LANGUAGE;
}

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources: {
      en: { translation: en },
      ar: { translation: ar },
      hi: { translation: hi },
      zh: { translation: zh },
      ko: { translation: ko },
      fa: { translation: fa },
    },
    lng: getInitialLanguage(),
    fallbackLng: DEFAULT_LANGUAGE,
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
  });
}

export function applyLanguageSideEffects(lang: string) {
  if (typeof document === "undefined") return;
  const dir = RTL_LANGUAGES.has(lang) ? "rtl" : "ltr";
  document.documentElement.setAttribute("lang", lang);
  document.documentElement.setAttribute("dir", dir);
  try {
    window.localStorage.setItem("lang", lang);
  } catch {
    /* ignore */
  }
}

if (typeof window !== "undefined") {
  applyLanguageSideEffects(i18n.language || DEFAULT_LANGUAGE);
}

export default i18n;
