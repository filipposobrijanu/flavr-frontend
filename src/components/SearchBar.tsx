"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import Fuse from "fuse.js";
import { useLocale } from "@/context/LocaleContext";

interface Restaurant {
  id: string;
  name: string;
  cuisineType: string;
  address: string;
  imageUrl?: string;
  globalBayesianScore: number;
}

interface SearchBarProps {
  restaurants: Restaurant[];
}

export default function SearchBar({ restaurants }: SearchBarProps) {
  const { t } = useLocale();
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Restaurant[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Ρύθμιση του Fuse.js
  const fuse = useMemo(() => {
    return new Fuse(restaurants, {
      keys: ["name", "cuisineType", "address"], // Ψάχνει σε αυτά τα πεδία
      threshold: 0.3, // Πόσο "αυστηρό" είναι στα ορθογραφικά (0 = ακριβές, 1 = χαλαρό)
      includeScore: true,
    });
  }, [restaurants]);

  // Εκτέλεση αναζήτησης όταν αλλάζει το query
  useEffect(() => {
    if (query.trim() === "") {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const searchResults = fuse.search(query).map((result) => result.item);
    setResults(searchResults.slice(0, 5)); // Δείχνουμε μόνο τα 5 καλύτερα αποτελέσματα
    setIsOpen(true);
  }, [query, fuse]);

  // Κλείσιμο του dropdown αν ο χρήστης κάνει κλικ έξω από αυτό
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={wrapperRef} className="relative w-full flex-1 mx-auto z-40">
      {/* 🔍 Input Field */}

      <input
        type="text"
        className="flex-1 px-3 w-full  py-2 text-md border-2 border-black rounded-xl font-bold bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:translate-x-[1px] focus:translate-y-[1px] focus:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all placeholder:text-gray-400 text-black"
        placeholder={t("search.placeholder")}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => {
          if (results.length > 0) setIsOpen(true);
        }}
      />

      {/* ⚡ Auto-complete Dropdown */}
      {isOpen && results.length > 0 && (
        <div className="absolute w-full mt-3 bg-white border-2 border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden flex flex-col">
          {results.map((restaurant) => (
            <div
              key={restaurant.id}
              onClick={() => {
                setIsOpen(false);
                setQuery(""); // Καθαρίζουμε την αναζήτηση μετά το κλικ
                router.push(`/restaurants/${restaurant.id}`);
              }}
              className="flex items-center gap-4 p-4 border-b-2 border-black last:border-b-0 hover:bg-yellow-100 cursor-pointer transition-colors"
            >
              {/* Εικόνα ή Placeholder */}

              {/* Πληροφορίες */}
              <div className="flex-1">
                <h3 className="font-black text-black text-lg uppercase leading-tight">
                  {restaurant.name}
                </h3>
                <div className="text-xs font-bold text-gray-600 flex gap-2">
                  <span className="bg-blue-400 px-2 py-0.5 border-[1.5]  rounded-lg border-black text-black rounded shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] uppercase">
                    {restaurant.cuisineType}
                  </span>
                  <span className="truncate">{restaurant.address}</span>
                </div>
              </div>

              {/* Score */}
              <div className="flex items-center justify-center bg-yellow-400 border-2 border-black font-black text-sm px-2 py-1 rounded shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                ⭐{" "}
                {restaurant.globalBayesianScore > 0
                  ? Number(restaurant.globalBayesianScore).toFixed(1)
                  : t("search.new")}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 🚫 No Results State */}
      {isOpen && query.length > 0 && results.length === 0 && (
        <div className="absolute w-full mt-3 bg-white border-2 border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-6 text-center font-black text-gray-500">
          {t("search.no_results")}
        </div>
      )}
    </div>
  );
}
