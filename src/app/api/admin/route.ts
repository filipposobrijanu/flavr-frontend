import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { RestaurantService } from "@/lib/backend/RestaurantService";

const restaurantService = new RestaurantService();

export async function GET() {
  try {
    const allRestaurants = await prisma.restaurant.findMany({
      where: {
        status: { in: ["PENDING", "APPROVED", "HIDDEN"] },
      },
      include: { owner: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(allRestaurants);
  } catch (error) {
    return NextResponse.json(
      { error: "Αποτυχία ανάκτησης δεδομένων" },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { restaurantId, status } = body;

    if (
      !restaurantId ||
      !["APPROVED", "REJECTED", "HIDDEN", "PENDING"].includes(status)
    ) {
      return NextResponse.json(
        { error: "Μη έγκυρα δεδομένα" },
        { status: 400 },
      );
    }

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

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const restaurantId = searchParams.get("id");

    if (!restaurantId) {
      return NextResponse.json(
        { error: "Το ID του εστιατορίου είναι υποχρεωτικό" },
        { status: 400 },
      );
    }

    await prisma.restaurant.delete({
      where: { id: restaurantId },
    });

    return NextResponse.json({
      success: true,
      message: "Το εστιατόριο διαγράφηκε",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Αποτυχία διαγραφής εστιατορίου" },
      { status: 500 },
    );
  }
}
