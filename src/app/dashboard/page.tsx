// src/app/dashboard/page.tsx
import { prisma } from "@/lib/db";
import DashboardClient from "./DashboardClient";
import { cookies } from "next/headers";
import { redirect } from "next/navigation"; // 👈 Το χρησιμοποιούμε για redirect αν δεν είναι logged in

export default async function DashboardPage() {
  // 1. Παίρνουμε τα cookies με ασφάλεια στον Server
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;

  // 2. Αν δεν υπάρχει userId (ο χρήστης δεν είναι συνδεδεμένος), τον στέλνουμε στο /login
  if (!userId) {
    redirect("/login");
  }

  // 3. Αφού είμαστε σίγουροι ότι έχουμε userId, τραβάμε τα δεδομένα
  const [activities, totalReviews] = await Promise.all([
    prisma.review.findMany({
      where: { userId }, // Χρησιμοποιούμε το δυναμικό userId!
      include: { restaurant: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.review.count({ where: { userId } }),
  ]);

  // 4. Περνάμε τα δεδομένα στο Client Component
  return (
    <DashboardClient activities={activities} totalReviews={totalReviews} />
  );
}
