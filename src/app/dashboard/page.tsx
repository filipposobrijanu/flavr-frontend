// src/app/dashboard/page.tsx
import { prisma } from "@/lib/db";
import DashboardClient from "./DashboardClient";
import { cookies } from "next/headers";
import { redirect } from "next/navigation"; // 👈 Το χρησιμοποιούμε για redirect αν δεν είναι logged in

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;

  if (!userId) redirect("/login");

  // Τραβάμε όλα τα reviews για να υπολογίσουμε τα stats
  const reviews = await prisma.review.findMany({
    where: { userId },
    include: { restaurant: { select: { cuisineType: true } } },
  });

  const totalReviews = reviews.length;

  // Υπολογισμός Μέσου Όρου
  const avgRating =
    totalReviews > 0
      ? (reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(
          1,
        )
      : "0.0";

  // Υπολογισμός Αγαπημένης Κουζίνας (απλό logic)
  const cuisineCounts: Record<string, number> = {};
  reviews.forEach((r) => {
    const type = r.restaurant.cuisineType;
    cuisineCounts[type] = (cuisineCounts[type] || 0) + 1;
  });
  const favoriteCuisine =
    Object.entries(cuisineCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";

  return (
    <DashboardClient
      activities={reviews.slice(0, 5)}
      totalReviews={totalReviews}
      avgRating={avgRating}
      favoriteCuisine={favoriteCuisine}
    />
  );
}
