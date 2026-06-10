import { prisma } from "@/lib/db";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import FavoritesClient from "./FavoritesClient";

export default async function MyFavoritesPage() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;

  if (!userId) {
    redirect("/login");
  }

  const userFavorites = await prisma.favorite.findMany({
    where: { userId },
    include: {
      restaurant: {
        include: {
          favorites: { where: { userId } },
          reviews: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const allApproved = await prisma.restaurant.findMany({
    where: { status: "APPROVED" },
    include: { reviews: true },
  });

  let totalStars = 0;
  let totalReviews = 0;
  allApproved.forEach((res) => {
    res.reviews?.forEach((rev) => {
      totalStars += rev.rating;
      totalReviews++;
    });
  });

  const C = totalReviews > 0 ? totalStars / totalReviews : 3.5;
  const m = 3;

  const favoritesWithScore = userFavorites.map((fav) => {
    const res = fav.restaurant;
    const v = res.reviews?.length || 0;
    const R =
      v > 0 ? res.reviews.reduce((acc, rev) => acc + rev.rating, 0) / v : 0;

    const bayesianScore = (v / (v + m)) * R + (m / (v + m)) * C;

    return {
      ...fav,
      restaurant: {
        ...res,
        globalBayesianScore: v > 0 ? bayesianScore : 0,
      },
    };
  });

  return <FavoritesClient initialFavorites={favoritesWithScore} />;
}
