"use client";

import Image from "next/image";
import rest_Image from "../../assets/ideativas-tlm-kitchen-10152789_1920.png";
import { useState, useEffect } from "react";
import Link from "next/link"; // 👈 1. ΠΡΟΣΘΗΚΗ: Εισαγωγή του Link για την πλοήγηση
import { Metadata } from "next";
import { useLocale } from "@/context/LocaleContext";
import FavoriteButton from "@/components/FavoriteButton";
import SearchBar from "@/components/SearchBar";
import { useMemo } from "react";

interface Restaurant {
  id: string;
  name: string;
  description: string;
  cuisineType: string;
  globalBayesianScore: number;
  address: string;
  area?: string;
  priceRange?: string;
  views: number;
  imageUrl?: string;
  favorites: { userId: string }[];
}

export default function RestaurantsPage() {
  const { t } = useLocale();

  const [visibleCount, setVisibleCount] = useState(6);

  const [isLoading, setIsLoading] = useState(true);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [search, setSearch] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [price, setPrice] = useState("");
  const [area, setArea] = useState("");

  const filteredRestaurants = useMemo(() => {
    return restaurants.filter((res) => {
      const matchCuisine = cuisine ? res.cuisineType === cuisine : true;
      const matchPrice = price ? res.priceRange === price : true;
      const matchArea = area
        ? res.area === area || res.address.includes(area)
        : true;
      return matchCuisine && matchPrice && matchArea;
    });
  }, [restaurants, cuisine, price, area]);

  useEffect(() => {
    const getRestaurants = async () => {
      setIsLoading(true); // Ξεκινάει το loading
      try {
        const res = await fetch("/api/restaurants?search=&cuisine=");
        const data = await res.json();
        if (res.ok && Array.isArray(data)) {
          setRestaurants(data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false); // Σταματάει το loading είτε πετύχει είτε όχι
      }
    };
    getRestaurants();
  }, [search, cuisine]);
  return (
    <div className="min-h-[calc(80vh-4rem)] p-6 md:p-12 text-black">
      <title>Discover Restaurants | Flavr</title>
      <div className="max-w-6xl mx-auto">
        {/* 🌐 Τίτλος Σελίδας με Stroke Εφέ */}
        <h2 className="text-4xl md:text-5xl text-white items-center inline-flex gap-3 [-webkit-text-stroke:5px_black] [paint-order:stroke_fill] tracking-tight uppercase">
          <Image
            priority
            src={rest_Image}
            alt="Banana Illustration"
            className="object-contain border-2 w-16 h-16 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rounded-2xl bg-blue-400 p-1"
          />
          {t("restaurants_page.title")}
        </h2>

        {/* 🔍 Φίλτρα Αναζήτησης με Neobrutalist Στυλ */}
        <div className="flex flex-col sm:flex-row gap-4 mt-4 mb-12 items-center">
          {/* Input Αναζήτησης */}

          <SearchBar restaurants={restaurants} />

          {/* Dropdown Επιλογής Κουζίνας */}
          <div className="flex flex-wrap gap-4 items-center">
            {/* Κουζίνα (Blue) */}
            <div className="relative">
              <select
                value={cuisine}
                onChange={(e) => setCuisine(e.target.value)}
                className="px-3 py-2 font-black text-sm uppercase bg-white border-2 border-black rounded-xl cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:translate-x-[1px] focus:translate-y-[1px] focus:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all appearance-none pr-10"
              >
                <option value="">{t("filters.all_cuisines")}</option>
                <option value="ITALIAN">
                  {t("restaurants_page.cuisines.italian")}
                </option>
                <option value="GREEK">
                  {t("restaurants_page.cuisines.greek")}
                </option>
                <option value="MEXICAN">
                  {t("restaurants_page.cuisines.mexican")}
                </option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-black font-black">
                ▼
              </div>
            </div>

            {/* Clear Button (Red - με το ίδιο hover/active style των κουμπιών σου) */}
            {(cuisine || price || area) && (
              <button
                onClick={() => {
                  setCuisine("");
                  setPrice("");
                  setArea("");
                }}
                className="px-3 cursor-pointer py-2 bg-red-500 text-white font-black text-sm uppercase border-2 border-black rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)]"
              >
                ✖
              </button>
            )}
          </div>
          <Link href="/dashboard/favorites">
            <button
              className={`px-3 py-1 rounded-xl flex gap-1 items-center cursor-pointer border-2 border-black font-black text-xl transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] 
                  bg-white hover:bg-red-500 text-black"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                fill="currentColor"
                className="bi bi-heart-fill"
                viewBox="0 0 16 16"
              >
                <path
                  fill-rule="evenodd"
                  d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314"
                />
              </svg>
              {t("restaurants_page.favorites")}
            </button>
          </Link>
        </div>
        {isLoading ? (
          /* ⏳ IMPROVED LOADING SKELETON */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white border-2 border-b-4 border-black p-6 rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] w-full flex flex-col justify-between"
              >
                <div className="animate-pulse space-y-4">
                  {/* Header Skeleton */}
                  <div className="flex justify-between items-start gap-2">
                    <div className="h-8 bg-gray-200 rounded-lg w-2/3"></div>
                    <div className="h-8 bg-gray-200 rounded-lg w-12"></div>
                  </div>

                  {/* Metadata Skeleton */}
                  <div className="h-4 bg-gray-200 rounded-md w-1/3"></div>

                  {/* Description Lines Skeleton */}
                  <div className="space-y-2 pt-2">
                    <div className="h-4 bg-gray-200 rounded-md w-full"></div>
                    <div className="h-4 bg-gray-200 rounded-md w-full"></div>
                    <div className="h-4 bg-gray-200 rounded-md w-3/4"></div>
                  </div>
                </div>

                {/* Button Skeleton */}
                <div className="mt-8 h-12 bg-gray-200 rounded-xl w-full animate-pulse border-2 border-black"></div>
              </div>
            ))}
          </div>
        ) : restaurants.length === 0 ? (
          /* EMPTY STATE */
          <div className="text-center py-12 border-4 border-dashed border-black rounded-2xl bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <p className="font-black text-xl">
              {t("restaurants_page.no_results")}
            </p>
          </div>
        ) : (
          <div className="grid  grid-cols-1 md:grid-cols-3 gap-8">
            {filteredRestaurants.slice(0, visibleCount).map((res) => {
              const isFavorite = (res.favorites?.length ?? 0) > 0;
              return (
                <div
                  key={res.id}
                  className="bg-white relative border-2 border-b-4 border-black p-6 rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all"
                >
                  <div>
                    {res.imageUrl && (
                      <div className="w-full h-40 mb-4 overflow-hidden rounded-xl border-2 border-black">
                        <img
                          src={res.imageUrl}
                          alt={res.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    {/* Header Κάρτας: Όνομα & Σκορ */}
                    <div className="flex justify-between items-start gap-2 mb-3">
                      <h2 className="text-2xl font-black tracking-tight text-black line-clamp-1">
                        {res.name}
                      </h2>
                      <div className="flex items-center justify-center  gap-2">
                        <div className="text-sm font-bold text-gray-700 flex gap-1 items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                            fill="currentColor"
                            className="bi bi-eye"
                            viewBox="0 0 16 16"
                          >
                            <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z" />
                            <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0" />
                          </svg>{" "}
                          {res.views}
                        </div>
                        {/* Badge Σκορ σαν Sticker */}
                        <span className="bg-yellow-400 border-2 border-black font-black px-2.5 py-1 rounded-lg text-xs tracking-wide shrink-0 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center gap-1">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="12"
                            height="12"
                            fill="black"
                            className="bi bi-star"
                            viewBox="0 0 16 16"
                          >
                            <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.56.56 0 0 0-.163-.505L1.71 6.745l4.052-.576a.53.53 0 0 0 .393-.288L8 2.223l1.847 3.658a.53.53 0 0 0 .393.288l4.052.575-2.906 2.77a.56.56 0 0 0-.163.506l.694 3.957-3.686-1.894a.5.5 0 0 0-.461 0z" />
                          </svg>{" "}
                          {res.globalBayesianScore > 0
                            ? Number(res.globalBayesianScore).toFixed(1)
                            : t("restaurant_details.new")}
                        </span>
                        <div className="">
                          <FavoriteButton
                            restaurantId={res.id}
                            initialIsFavorite={isFavorite}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Subtitle: Κουζίνα & Διεύθυνση */}
                    <p className="text-xs font-black uppercase tracking-wider text-blue-500 mb-4">
                      {res.cuisineType} •{" "}
                      <span className="text-gray-600 normal-case font-bold">
                        {res.address}
                      </span>
                    </p>

                    {/* Περιγραφή με περιορισμό 3 γραμμών */}
                    <p className="text-sm font-medium text-black line-clamp-3 leading-relaxed mb-6">
                      {res.description}
                    </p>
                  </div>

                  {/* 👈 2. ΔΙΟΡΘΩΣΗ: Προσθήκη Link γύρω από το Neobrutalist κουμπί */}
                  <Link
                    href={`/restaurants/${res.id}`}
                    className="w-full block"
                  >
                    <button className="w-full button-main">
                      <span
                        style={{ backgroundColor: "#50A2FF" }}
                        className="button_top px-3 py-2"
                      >
                        {t("restaurants_page.view_btn")}
                      </span>
                    </button>
                  </Link>
                </div>
              );
            })}
          </div>
        )}
        {visibleCount < filteredRestaurants.length && (
          <div className="flex justify-center mt-12">
            <button
              onClick={() => setVisibleCount((prev) => prev + 6)}
              className="px-4 cursor-pointer py-2 bg-orange-400 border-3 border-black font-black text-lg uppercase rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all"
            >
              {t("restaurants_page.load_more")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
