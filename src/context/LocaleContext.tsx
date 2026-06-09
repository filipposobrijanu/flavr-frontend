"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { translations } from "../i18n/locales";

const LocaleContext = createContext<any>(null);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("preferred_lang") || "en";
    }
    return "en";
  });

  useEffect(() => {
    localStorage.setItem("preferred_lang", lang);

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
    return current || path;
  };

  return (
    <LocaleContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LocaleContext.Provider>
  );
}

export const useLocale = () => useContext(LocaleContext);
