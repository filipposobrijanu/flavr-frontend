"use client";

import { useLocale } from "@/context/LocaleContext";

export default function UserActivityFeed({
  activities,
}: {
  activities: any[];
}) {
  const { t } = useLocale();
  if (activities.length === 0) {
    return (
      <div className="text-center py-12 border-4 border-dashed border-black rounded-2xl bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <p className="font-black text-black text-xl">
          {t("activity_feed.empty")}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border-4 border-black p-8 rounded-2xl shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
      <div className="flex justify-between items-center mb-8 border-b-4 border-black pb-4">
        <h3 className="text-3xl font-black uppercase text-black tracking-tighter">
          {t("activity_feed.title")}
        </h3>
        <span className="bg-black text-white px-3 py-1 font-black text-xs uppercase rotate-2 rounded-lg">
          {t("activity_feed.system")}
        </span>
      </div>

      <ul className="space-y-6">
        {activities.map((act) => (
          <li key={act.id} className="group flex gap-4 items-start">
            <div className="mt-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-black group-hover:bg-yellow-400 transition-colors" />
            <div className="flex-1">
              <p className="font-bold text-black text-lg leading-tight">
                {t("activity_feed.you_reviewed")}{" "}
                <span className="underline decoration-2 decoration-blue-500 underline-offset-4">
                  {act.restaurant.name}
                </span>
              </p>
              <p className="text-xs font-black text-gray-500 uppercase mt-1">
                {new Date(act.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
                <span className="mx-2">•</span>
                <span className="text-blue-600">
                  {t("activity_feed.id")} {act.id.slice(0, 8)}
                </span>
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
