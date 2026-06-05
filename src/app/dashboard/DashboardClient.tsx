"use client";

import Image from "next/image";
import UserActivityFeed from "@/components/UserActivityFeed";
import rest_Image from "../../assets/ideativas-tlm-waffles-8748848_1920.png";
import { useLocale } from "@/context/LocaleContext";

interface DashboardClientProps {
  activities: any[];
  totalReviews: number;
  avgRating: string; // 🆕
  favoriteCuisine: string; // 🆕
}

export default function DashboardClient({
  activities,
  totalReviews,
  avgRating,
  favoriteCuisine,
}: DashboardClientProps) {
  const { t } = useLocale();

  return (
    <main className="p-6 md:p-12 max-w-6xl mx-auto min-h-[calc(80vh-4rem)]">
      {/* Παλιό Header Styling */}
      <div className="mb-6 pb-8">
        <h2 className="text-4xl md:text-5xl text-white items-center inline-flex gap-3 [-webkit-text-stroke:5px_black] [paint-order:stroke_fill] tracking-tight uppercase">
          <Image
            priority
            src={rest_Image}
            alt="Waffle Illustration"
            className="object-contain border-2 w-16 h-16 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rounded-2xl bg-orange-400 p-1"
          />
          {t("dashboard.title")}
        </h2>

        {/* 🆕 Stats Grid που ταιριάζει με το στυλ σου */}
        <div className="grid text-black grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <div className="bg-yellow-400 border-2 border-black px-4 py-3 font-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <p className="text-xs opacity-70 uppercase">
              {t("dashboard.reviews_posted")}
            </p>
            <p className="text-2xl">{totalReviews}</p>
          </div>
          <div className="bg-green-400 border-2 border-black px-4 py-3 font-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <p className="text-xs opacity-70">Avg Rating</p>
            <p className="text-2xl">{avgRating}</p>
          </div>
          <div className="bg-purple-400 border-2 border-black px-4 py-3 font-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <p className="text-xs opacity-70">Top Cuisine</p>
            <p className="text-2xl uppercase">{favoriteCuisine}</p>
          </div>
          <div className="bg-blue-400 border-2 border-black px-4 py-3 font-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <p className="text-xs opacity-70">{t("dashboard.trust_score")}</p>
            <p className="text-2xl">98%</p>
          </div>
        </div>
      </div>

      <UserActivityFeed activities={activities} />
    </main>
  );
}
