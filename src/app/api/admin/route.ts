import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { RestaurantService } from "@/lib/backend/RestaurantService";

const restaurantService = new RestaurantService();

// GET: Φέρνει όλα τα εκκρεμή (PENDING) εστιατόρια για να τα ελέγξει ο Admin
export async function GET() {
  try {
    const pendingRestaurants = await prisma.restaurant.findMany({
      where: { status: "PENDING" },
      include: { owner: true }, // Κάνουμε join τον πίνακα User για να δούμε τα στοιχεία του ιδιοκτήτη
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(pendingRestaurants);
  } catch (error) {
    return NextResponse.json(
      { error: "Αποτυχία ανάκτησης αιτήσεων" },
      { status: 500 },
    );
  }
}

// PUT: Αλλάζει την κατάσταση της αίτησης (Έγκριση ή Απόρριψη)
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { restaurantId, status } = body; // Το status πρέπει να είναι 'APPROVED' ή 'REJECTED'

    if (!restaurantId || !["APPROVED", "REJECTED"].includes(status)) {
      return NextResponse.json(
        { error: "Μη έγκυρα δεδομένα" },
        { status: 400 },
      );
    }

    // Κλήση της μεθόδου changeStatus του RestaurantService (OOP Logic)
    const updatedRestaurant = await restaurantService.changeStatus(
      restaurantId,
      status,
    );
    return NextResponse.json(updatedRestaurant);
  } catch (error) {
    return NextResponse.json(
      { error: "Αποτυχία ενημέρωσης κατάστασης" },
      { status: 400 },
    );
  }
}
