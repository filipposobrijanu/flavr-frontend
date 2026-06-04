"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { translations } from "../i18n/locales";

const LocaleContext = createContext<any>(null);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  // 1. Αρχικοποίηση: Διαβάζουμε από το localStorage αν υπάρχει, αλλιώς "el"
  const [lang, setLang] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("preferred_lang") || "el";
    }
    return "el";
  });

  // 2. Όταν αλλάζει το lang, το αποθηκεύουμε στο localStorage
  useEffect(() => {
    localStorage.setItem("preferred_lang", lang);

    // Εδώ παραμένει ο κώδικάς σου για τις γραμματοσειρές
    document.body.classList.remove("font-ranchers", "font-carlito");
    if (lang === "el") {
      document.body.classList.add("font-carlito");
    } else {
      document.body.classList.add("font-ranchers");
    }
  }, [lang]);

  const t = (path: string) => {
    const keys = path.split(".");
    let current: any = translations[lang as keyof typeof translations];
    keys.forEach((k) => {
      if (current) current = current[k];
    });
    return current || path; // Επιστρέφει το path αν δεν βρει μετάφραση
  };

  return (
    <LocaleContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LocaleContext.Provider>
  );
}

export const useLocale = () => useContext(LocaleContext);
