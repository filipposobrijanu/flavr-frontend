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
        reviews: true,
      },
      orderBy: { createdAt: "desc" },
    });

    let totalStarsAcrossPlatform = 0;
    let totalReviewsAcrossPlatform = 0;

    restaurants.forEach((res) => {
      res.reviews?.forEach((rev) => {
        totalStarsAcrossPlatform += rev.rating;
        totalReviewsAcrossPlatform++;
      });
    });

    const C =
      totalReviewsAcrossPlatform > 0
        ? totalStarsAcrossPlatform / totalReviewsAcrossPlatform
        : 3.5;

    const m = 3;

    const calculatedRestaurants = restaurants.map((res) => {
      const v = res.reviews?.length || 0;

      const R =
        v > 0 ? res.reviews.reduce((acc, rev) => acc + rev.rating, 0) / v : 0;

      const bayesianScore = (v / (v + m)) * R + (m / (v + m)) * C;

      const { reviews, ...restaurantData } = res;

      return {
        ...restaurantData,
        globalBayesianScore: v > 0 ? bayesianScore : 0,
      };
    });

    return NextResponse.json(calculatedRestaurants);
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
