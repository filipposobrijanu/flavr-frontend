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
  openTime: string;
  closeTime: string;
}

interface SearchBarProps {
  restaurants: Restaurant[];
}

export default function SearchBar({ restaurants }: SearchBarProps) {
  const isRestaurantOpen = (openTime: string, closeTime: string) => {
    if (!openTime || !closeTime) return true;

    const now = new Date();
    const currentTotalMinutes = now.getHours() * 60 + now.getMinutes();

    const [openH, openM] = openTime.split(":").map(Number);
    const openTotalMinutes = openH * 60 + openM;

    const [closeH, closeM] = closeTime.split(":").map(Number);
    const closeTotalMinutes = closeH * 60 + closeM;

    if (closeTotalMinutes < openTotalMinutes) {
      return (
        currentTotalMinutes >= openTotalMinutes ||
        currentTotalMinutes <= closeTotalMinutes
      );
    }

    return (
      currentTotalMinutes >= openTotalMinutes &&
      currentTotalMinutes <= closeTotalMinutes
    );
  };

  const { t } = useLocale();
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Restaurant[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const fuse = useMemo(() => {
    return new Fuse(restaurants, {
      keys: ["name", "cuisineType", "address"],
      threshold: 0.3,
      includeScore: true,
    });
  }, [restaurants]);

  useEffect(() => {
    if (query.trim() === "") {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const searchResults = fuse.search(query).map((result) => result.item);
    setResults(searchResults.slice(0, 5));
    setIsOpen(true);
  }, [query, fuse]);

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
          {results.map((restaurant) => {
            const isOpen = isRestaurantOpen(
              restaurant.openTime,
              restaurant.closeTime,
            );
            return (
              <div
                key={restaurant.id}
                onClick={() => {
                  setIsOpen(false);
                  setQuery("");
                  router.push(`/restaurants/${restaurant.id}`);
                }}
                className="flex items-center gap-4 p-4 border-b-2 border-black last:border-b-0 hover:bg-yellow-100 cursor-pointer transition-colors"
              >
                <div className="flex-1 ">
                  <div className="inline-flex gap-2 items-center">
                    <h3 className="font-black truncate max-w-[80px] sm:max-w-[100%] text-black text-lg leading-tight">
                      {restaurant.name}sssssssssssssssssssssssss
                    </h3>
                    <span className="bg-blue-400 px-2 text-xs py-0.5 border-[1.5]  rounded-lg border-black text-black rounded shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] uppercase">
                      {restaurant.cuisineType}
                    </span>{" "}
                    <span
                      className={` px-2 py-0.5 text-[10px] font-black uppercase border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] z-10 ${
                        isOpen
                          ? "bg-green-400 text-black"
                          : "bg-red-400 text-black"
                      }`}
                    >
                      {isOpen ? t("filters.open") : t("filters.closed")}
                    </span>
                  </div>
                  <div className="text-xs font-bold text-gray-600 flex gap-2">
                    <span className="truncate">{restaurant.address}</span>
                  </div>
                </div>

                <div className="flex items-center justify-center bg-yellow-400 border-2 gap-1 border-black font-black text-sm px-2 py-1 text-sm rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    fill="black"
                    className="bi bi-star"
                    viewBox="0 0 16 16"
                  >
                    <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.56.56 0 0 0-.163-.505L1.71 6.745l4.052-.576a.53.53 0 0 0 .393-.288L8 2.223l1.847 3.658a.53.53 0 0 0 .393.288l4.052.575-2.906 2.77a.56.56 0 0 0-.163.506l.694 3.957-3.686-1.894a.5.5 0 0 0-.461 0z" />
                  </svg>
                  {restaurant.globalBayesianScore > 0
                    ? Number(restaurant.globalBayesianScore).toFixed(1)
                    : t("search.new")}
                </div>
              </div>
            );
          })}
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
