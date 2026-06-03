"use client";
import { usePathname, useRouter } from "next/navigation";

export function LanguageSwitcher() {
  const pathname = usePathname();
  const router = useRouter();

  const changeLanguage = (newLocale: string) => {
    // Αφαιρούμε το παλιό locale από το path (π.χ. /el/dashboard -> /dashboard)
    const segments = pathname.split("/");
    segments[1] = newLocale; // Αντικαθιστούμε το locale
    router.push(segments.join("/"));
  };

  return (
    <select
      onChange={(e) => changeLanguage(e.target.value)}
      value={pathname.split("/")[1]}
      className="bg-white border-2 border-black rounded-lg px-2 py-1 font-bold cursor-pointer"
    >
      <option value="el">EL</option>
      <option value="en">EN</option>
    </select>
  );
}
