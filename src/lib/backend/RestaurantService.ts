import { prisma } from "@/lib/db";

export class RestaurantService {
  // 1. Δημιουργία Νέου Εστιατορίου (Αίτηση από Owner)
  async createRestaurant(data: {
    name: string;
    description: string;
    cuisineType: string;
    address: string;
    ownerId: string;
    imageUrl: string;
  }) {
    return await prisma.restaurant.create({
      data: {
        name: data.name,
        description: data.description,
        cuisineType: data.cuisineType,
        address: data.address,
        ownerId: data.ownerId,
        imageUrl: data.imageUrl,
        status: "PENDING",
        globalBayesianScore: 0.0,
        createdAt: new Date(), // <--- Προσθήκη εδώ
      },
    });
  }

  // 2. Αλλαγή Κατάστασης (Έγκριση/Απόρριψη από Admin)
  async changeStatus(restaurantId: string, status: "APPROVED" | "REJECTED") {
    return await prisma.restaurant.update({
      where: { id: restaurantId },
      data: { status },
    });
  }
}
