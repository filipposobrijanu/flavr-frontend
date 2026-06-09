import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { RestaurantService } from "@/lib/backend/RestaurantService";
import { cookies } from "next/headers";

const restaurantService = new RestaurantService();

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
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
          mode: "insensitive",
        },
        ...(cuisine ? { cuisineType: cuisine } : {}),
      },
      include: {
        favorites: {
          where: {
            userId: userId,
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
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Restaurant ID is required" },
        { status: 400 },
      );
    }

    await prisma.restaurant.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting restaurant:", error);
    return NextResponse.json(
      { error: "Failed to delete restaurant" },
      { status: 500 },
    );
  }
}
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
