export interface BadgeInfo {
  nameKey: string;
  color: string;
}

export function getUserBadge(reviewCount: number): BadgeInfo | null {
  if (reviewCount === 0) return null;

  if (reviewCount >= 1 && reviewCount <= 3) {
    return {
      nameKey: "badges.newbie",
      color: "bg-cyan-300",
    };
  }

  if (reviewCount >= 4 && reviewCount <= 9) {
    return {
      nameKey: "badges.foodie",
      color: "bg-lime-400",
    };
  }

  if (reviewCount >= 10 && reviewCount <= 19) {
    return {
      nameKey: "badges.connoisseur",
      color: "bg-pink-400",
    };
  }

  return {
    nameKey: "badges.top_reviewer",
    color: "bg-yellow-400",
  };
}
