"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { translations } from "../i18n/locales";

const LocaleContext = createContext<any>(null);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState("el");

  useEffect(() => {
    // Αφαιρούμε την παλιά κλάση και προσθέτουμε τη νέα
    document.body.classList.remove("font-ranchers", "font-carlito");
    if (lang === "el") {
      document.body.classList.add("font-carlito"); // Ελληνικά
    } else {
      document.body.classList.add("font-ranchers"); // Αγγλικά
    }
  }, [lang]);
  const t = (path: string) => {
    const keys = path.split("."); // π.χ. "navbar.login"
    let current: any = translations[lang as keyof typeof translations];
    keys.forEach((k) => {
      current = current[k];
    });
    return current;
  };

  return (
    <LocaleContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LocaleContext.Provider>
  );
}

export const useLocale = () => useContext(LocaleContext);
