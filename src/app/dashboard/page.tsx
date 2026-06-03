// src/app/dashboard/page.tsx
"use client";

import { prisma } from "@/lib/db";
import UserActivityFeed from "@/components/UserActivityFeed";
import Image from "next/image";
import rest_Image from "../../assets/ideativas-tlm-waffles-8748848_1920.png";

import { useLocale } from "@/context/LocaleContext";

export default async function DashboardPage() {
  const { t } = useLocale();
  const userId = "f36ea3c9-e024-4fbb-ae41-5a69932a05e8";

  const [activities, totalReviews] = await Promise.all([
    prisma.review.findMany({
      where: { userId },
      include: { restaurant: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.review.count({ where: { userId } }),
  ]);

  return (
    <main className="p-6 md:p-12 max-w-6xl mx-auto  min-h-[calc(80vh-4rem)]">
      <div className="mb-6  pb-8">
        <h2 className="text-4xl md:text-5xl text-white items-center inline-flex gap-3 [-webkit-text-stroke:5px_black] [paint-order:stroke_fill] tracking-tight uppercase">
          <Image
            priority
            src={rest_Image}
            alt="Banana Illustration"
            className="object-contain border-2 w-16 h-16 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rounded-2xl bg-orange-400 p-1"
          />
          {t("dashboard.title")}
        </h2>
        <div className="flex gap-4 mt-4">
          <div className="bg-yellow-400 border-2 text-black border-black px-4 py-2 font-black rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            {totalReviews} {t("dashboard.reviews_posted")}
          </div>
          <div className="bg-blue-400 border-2 border-black px-4 py-2 font-black text-black rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ">
            {t("dashboard.trust_score")}
          </div>
        </div>
      </div>

      <UserActivityFeed activities={activities} />
    </main>
  );
}
