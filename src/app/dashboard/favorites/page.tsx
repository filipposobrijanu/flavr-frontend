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
          favorites: {
            where: { userId },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return <FavoritesClient initialFavorites={userFavorites} />;
}
