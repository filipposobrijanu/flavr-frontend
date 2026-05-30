"use client";

import Image from "next/image";
import rest_Image from "../../assets/ideativas-tlm-kitchen-10152789_1920.png";
import { useState, useEffect } from "react";
import Link from "next/link"; // 👈 1. ΠΡΟΣΘΗΚΗ: Εισαγωγή του Link για την πλοήγηση
import { Metadata } from "next";

interface Restaurant {
  id: string;
  name: string;
  description: string;
  cuisineType: string;
  globalBayesianScore: number;
  address: string;
}

export default function RestaurantsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [search, setSearch] = useState("");
  const [cuisine, setCuisine] = useState("");

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
  }, []);
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
          Discover Restaurants
        </h2>

        {/* 🔍 Φίλτρα Αναζήτησης με Neobrutalist Στυλ */}
        <div className="flex flex-col sm:flex-row gap-4 mt-4 mb-12">
          {/* Input Αναζήτησης */}
          <input
            type="text"
            placeholder="Search by name..."
            className="flex-1 px-3 py-2 text-md border-2 border-black rounded-xl font-bold bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:translate-x-[1px] focus:translate-y-[1px] focus:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all placeholder:text-gray-400 text-black"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {/* Dropdown Επιλογής Κουζίνας */}
          <div className="relative min-w-[200px]">
            <select
              className="w-full px-3 py-2 border-2 border-black rounded-xl font-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none appearance-none cursor-pointer text-sm text-black"
              value={cuisine}
              onChange={(e) => setCuisine(e.target.value)}
            >
              <option value="">ALL CUISINES</option>
              <option value="ITALIAN">ITALIAN</option>
              <option value="GREEK">GREEK</option>
              <option value="MEXICAN">MEXICAN</option>
            </select>
            {/* Custom Βέλος */}
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-black font-bold">
              ▼
            </div>
          </div>
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
            <p className="font-black text-xl">No restaurants found...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {restaurants.map((res) => (
              <div
                key={res.id}
                className="bg-white border-2 border-b-4 border-black p-6 rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all"
              >
                <div>
                  {/* Header Κάρτας: Όνομα & Σκορ */}
                  <div className="flex justify-between items-start gap-2 mb-3">
                    <h2 className="text-2xl font-black tracking-tight text-black line-clamp-1">
                      {res.name}
                    </h2>
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
                        : "NEW"}
                    </span>
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
                <Link href={`/restaurants/${res.id}`} className="w-full block">
                  <button className="w-full button-main">
                    <span
                      style={{ backgroundColor: "#50A2FF" }}
                      className="button_top px-3 py-2"
                    >
                      VIEW & REVIEWS
                    </span>
                  </button>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
