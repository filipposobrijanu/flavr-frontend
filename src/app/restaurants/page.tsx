"use client";

import Image from "next/image";
import rest_Image from "../../assets/ideativas-tlm-kitchen-10152789_1920.png";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Metadata } from "next";
import { useLocale } from "@/context/LocaleContext";
import FavoriteButton from "@/components/FavoriteButton";
import SearchBar from "@/components/SearchBar";
import { useMemo } from "react";
import gmap_icon from "../../assets/gmap_icon.png";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};
const cardVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
} as const;
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
  openTime: string;
  closeTime: string;
}

export default function RestaurantsPage() {
  const { t } = useLocale();
  const [sortBy, setSortBy] = useState("rating");

  const [visibleCount, setVisibleCount] = useState(6);

  const [isLoading, setIsLoading] = useState(true);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [search, setSearch] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [price, setPrice] = useState("");
  const [area, setArea] = useState("");

  const [isOpenNow, setIsOpenNow] = useState(false);
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

  const filteredRestaurants = useMemo(() => {
    let filtered = restaurants.filter((res) => {
      const matchCuisine = cuisine ? res.cuisineType === cuisine : true;
      const matchPrice = price ? res.priceRange === price : true;
      const matchArea = area
        ? res.area === area || res.address.includes(area)
        : true;

      const matchOpenNow = isOpenNow
        ? isRestaurantOpen(res.openTime, res.closeTime)
        : true;

      return matchCuisine && matchPrice && matchArea && matchOpenNow;
    });

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case "rating_high":
          return b.globalBayesianScore - a.globalBayesianScore;
        case "rating_low":
          return a.globalBayesianScore - b.globalBayesianScore;
        case "views_high":
          return b.views - a.views;
        case "views_low":
          return a.views - b.views;
        case "new":
          return Number(b.id) - Number(a.id);
        case "old":
          return Number(a.id) - Number(b.id);
        default:
          return 0;
      }
    });
  }, [restaurants, cuisine, price, area, sortBy, isOpenNow]);

  useEffect(() => {
    const getRestaurants = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/restaurants?search=&cuisine=");
        const data = await res.json();
        if (res.ok && Array.isArray(data)) {
          setRestaurants(data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    getRestaurants();
  }, [search, cuisine]);
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-[calc(80vh-4rem)] p-6 md:p-12 text-black"
    >
      <title>Discover Restaurants | Flavr</title>
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl text-white items-center inline-flex gap-3 [-webkit-text-stroke:5px_black] [paint-order:stroke_fill] tracking-tight uppercase">
          <Image
            priority
            src={rest_Image}
            alt="Banana Illustration"
            className="object-contain border-2 w-16 h-16 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rounded-2xl bg-blue-400 p-1"
          />
          {t("restaurants_page.title")}
        </h2>

        <div className="flex flex-col md:flex-row sm:flex-wrap gap-4 mt-4 mb-12 lg:items-center items-start">
          <SearchBar restaurants={restaurants} />
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 font-black text-sm uppercase bg-white border-2 border-black rounded-xl cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:translate-x-[1px] focus:translate-y-[1px] focus:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all appearance-none pr-8"
            >
              <option value="rating_high">{t("filters.rating_high")}</option>
              <option value="rating_low">{t("filters.rating_low")}</option>
              <option value="views_high">{t("filters.views_high")}</option>
              <option value="views_low">{t("filters.views_low")}</option>
              <option value="new">{t("filters.new")}</option>
              <option value="old">{t("filters.old")}</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex text-sm items-center px-3 text-black font-black">
              ▼
            </div>
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            <button
              onClick={() => setIsOpenNow(!isOpenNow)}
              className={`px-3 py-2 font-black text-sm uppercase border-2 border-black rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center gap-1 cursor-pointer hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] ${
                isOpenNow ? "bg-green-400 text-black" : "bg-white text-black"
              }`}
            >
              <span
                className={`w-2.5 h-2.5 rounded-full border border-black ${isOpenNow ? "bg-white animate-pulse" : "bg-gray-300"}`}
              ></span>
              {t("filters.open_now")}
            </button>
            <div className="relative">
              <select
                value={cuisine}
                onChange={(e) => setCuisine(e.target.value)}
                className="px-3 py-2 font-black text-sm uppercase bg-white border-2 border-black rounded-xl cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:translate-x-[1px] focus:translate-y-[1px] focus:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all appearance-none pr-8"
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
              <div className="pointer-events-none absolute inset-y-0 right-0 flex text-sm items-center px-3 text-black font-black">
                ▼
              </div>
            </div>

            {(cuisine ||
              price ||
              area ||
              isOpenNow ||
              sortBy !== "rating_high") && (
              <button
                onClick={() => {
                  setCuisine("");
                  setPrice("");
                  setArea("");
                  setIsOpenNow(false);
                  setSortBy("rating_high");
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white border-2 border-b-4 border-black p-6 rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] w-full flex flex-col justify-between"
              >
                <div className="animate-pulse space-y-4">
                  <div className="flex justify-between items-start gap-2">
                    <div className="h-8 bg-gray-200 rounded-lg w-2/3"></div>
                    <div className="h-8 bg-gray-200 rounded-lg w-12"></div>
                  </div>
                  <div className="h-4 bg-gray-200 rounded-md w-1/3"></div>

                  <div className="space-y-2 pt-2">
                    <div className="h-4 bg-gray-200 rounded-md w-full"></div>
                    <div className="h-4 bg-gray-200 rounded-md w-full"></div>
                    <div className="h-4 bg-gray-200 rounded-md w-3/4"></div>
                  </div>
                </div>

                <div className="mt-8 h-12 bg-gray-200 rounded-xl w-full animate-pulse border-2 border-black"></div>
              </div>
            ))}
          </div>
        ) : restaurants.length === 0 ? (
          <div className="text-center py-12 border-4 border-dashed border-black rounded-2xl bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <p className="font-black text-xl">
              {t("restaurants_page.no_results")}
            </p>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid  grid-cols-1 md:grid-cols-3 gap-8"
          >
            {filteredRestaurants.slice(0, visibleCount).map((res) => {
              const isFavorite = (res.favorites?.length ?? 0) > 0;

              const isOpen = isRestaurantOpen(res.openTime, res.closeTime);
              return (
                <motion.div
                  key={res.id}
                  variants={cardVariants}
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

                        <span
                          className={`absolute top-2 left-2 px-2 py-0.5 text-[10px] font-black uppercase border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] z-10 ${
                            isOpen
                              ? "bg-green-400 text-black"
                              : "bg-red-400 text-black"
                          }`}
                        >
                          {isOpen ? t("filters.open") : t("filters.closed")}
                        </span>
                      </div>
                    )}
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

                    <p className="text-xs font-black uppercase tracking-wider text-blue-500 mb-4">
                      {res.cuisineType} •{" "}
                      <span className="text-gray-600 normal-case font-bold">
                        {res.address}
                      </span>
                    </p>

                    <p className="text-sm font-medium text-black line-clamp-3 leading-relaxed mb-6">
                      {res.description}
                    </p>
                  </div>
                  <div className="w-full flex flex-col items-center gap-3">
                    <Link
                      href={`/restaurants/${res.id}`}
                      className="w-full h-full"
                    >
                      <button className="w-full h-full button-main">
                        <span
                          style={{ backgroundColor: "#50A2FF" }}
                          className="button_top px-3 py-2 h-full flex items-center justify-center"
                        >
                          {t("restaurants_page.view_btn")}
                        </span>
                      </button>
                    </Link>

                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(res.address)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full h-full inline-flex items-center justify-center gap-1 bg-white text-black px-2 py-2 rounded-xl font-black border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                    >
                      <Image
                        src={gmap_icon}
                        alt="Google Maps Icon"
                        className="w-5 h-5 object-contain"
                      />
                      {t("restaurants_page.googleMaps")}
                    </a>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
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
    </motion.div>
  );
}
