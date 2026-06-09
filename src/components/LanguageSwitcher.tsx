"use client";
import { usePathname, useRouter } from "next/navigation";

export function LanguageSwitcher() {
  const pathname = usePathname();
  const router = useRouter();

  const changeLanguage = (newLocale: string) => {
    const segments = pathname.split("/");
    segments[1] = newLocale;
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
