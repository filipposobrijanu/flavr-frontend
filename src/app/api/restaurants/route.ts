import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { RestaurantService } from "@/lib/backend/RestaurantService";

const restaurantService = new RestaurantService();

export const dynamic = "force-dynamic";

// GET: Φέρνει τα εγκεκριμένα εστιατόρια με φίλτρα
export async function GET(request: Request) {
  try {
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
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(restaurants);
  } catch (error) {
    // Αυτό θα μας τυπώσει το πραγματικό σφάλμα στο τερματικό του VS Code
    console.error("🚨 Error in GET /api/restaurants:", error);
    return NextResponse.json(
      { error: "Αποτυχία ανάκτησης εστιατορίων" },
      { status: 500 },
    );
  }
}

// POST: Δημιουργία νέας αίτησης από Owner
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
