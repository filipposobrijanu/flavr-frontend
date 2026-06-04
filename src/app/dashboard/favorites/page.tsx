import { prisma } from "@/lib/db";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import FavoritesClient from "./FavoritesClient";

export default async function MyFavoritesPage() {
  // 1. Παίρνουμε το userId με ασφάλεια στον Server από τα cookies
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;

  // 2. Αν δεν είναι συνδεδεμένος, redirect στο login
  if (!userId) {
    redirect("/login");
  }

  // 3. Τραβάμε τα αγαπημένα εστιατόρια του χρήστη
  const userFavorites = await prisma.favorite.findMany({
    where: { userId },
    include: {
      restaurant: {
        include: {
          favorites: {
            where: { userId }, // Για να ξέρει το FavoriteButton αν είναι true
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // 4. Περνάμε τα καθαρά δεδομένα στο Client Component
  return <FavoritesClient initialFavorites={userFavorites} />;
}
