import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { RestaurantService } from "@/lib/backend/RestaurantService";
import { cookies } from "next/headers"; // 👈 1. ΠΡΟΣΘΗΚΗ: Εισαγωγή των cookies για το Auth check

const restaurantService = new RestaurantService();

export const dynamic = "force-dynamic";

// GET: Φέρνει τα εγκεκριμένα εστιατόρια με φίλτρα ΚΑΙ τα favorites του χρήστη
export async function GET(request: Request) {
  try {
    // 2. ΠΡΟΣΘΗΚΗ: Διαβάζουμε το userId από τα cookies
    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value || "";

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const cuisine = searchParams.get("cuisine") || "";

    const restaurants = await prisma.restaurant.findMany({
      where: {
        status: "APPROVED",
        name: {
          contains: search,
          mode: "insensitive", // 👈 Τώρα στην PostgreSQL παίζει τέλεια!
        },
        ...(cuisine ? { cuisineType: cuisine } : {}),
      },
      // 3. ΔΙΟΡΘΩΣΗ: Κάνουμε include τα favorites ΜΟΝΟ για αυτόν τον χρήστη
      include: {
        favorites: {
          where: {
            userId: userId, // Αν το έχει κάνει favorite, το array θα έχει 1 στοιχείο, αλλιώς []
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(restaurants);
  } catch (error) {
    console.error("🚨 Error in GET /api/restaurants:", error);
    return NextResponse.json(
      { error: "Αποτυχία ανάκτησης εστιατορίων" },
      { status: 500 },
    );
  }
}

// POST: Δημιουργία νέας αίτησης από Owner (Το αφήνουμε όπως είναι, παίζει μια χαρά)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, cuisineType, address, ownerId, imageUrl } = body;

    if (
      !name ||
      !description ||
      !cuisineType ||
      !address ||
      !ownerId ||
      !imageUrl
    ) {
      return NextResponse.json(
        { error: "Όλα τα πεδία είναι υποχρεωτικά!" },
        { status: 400 },
      );
    }

    const newRestaurant = await restaurantService.createRestaurant({
      name,
      description,
      cuisineType,
      address,
      ownerId,
      imageUrl,
    });

    return NextResponse.json(newRestaurant, { status: 201 });
  } catch (error) {
    console.error("🚨 Error in POST /api/restaurants:", error);
    return NextResponse.json(
      { error: "Αποτυχία δημιουργίας εστιατορίου" },
      { status: 500 },
    );
  }
}
