"use client";

import { useLocale } from "@/context/LocaleContext";
import { getUserBadge } from "@/utils/badges";

interface UserBadgeProps {
  reviewCount: number;
}

export default function UserBadge({ reviewCount }: UserBadgeProps) {
  const { t } = useLocale();
  const badge = getUserBadge(reviewCount);

  if (!badge) return null; // Αν δεν έχει reviews, δεν δείχνουμε badge

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider border-2 border-black rounded-lg shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] text-black select-none shrink-0 ${badge.color}`}
    >
      <span>{t(badge.nameKey)}</span>
    </span>
  );
}
