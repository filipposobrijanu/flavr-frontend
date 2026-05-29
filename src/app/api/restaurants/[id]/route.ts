import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// 1. Ορίζουμε στο TypeScript ότι το params είναι Promise
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    // 2. Προσθέτουμε το `await` πριν κάνουμε destructuring το id
    const { id } = await params;

    // Από εδώ και κάτω ο κώδικάς σου συνεχίζει κανονικά...
    // Φέρνουμε το εστιατόριο και κάνουμε include (join) τις κριτικές
    const restaurant = await prisma.restaurant.findUnique({
      where: { id },
      include: {
        reviews: {
          include: {
            user: true,
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!restaurant) {
      return NextResponse.json(
        { error: "Το εστιατόριο δεν βρέθηκε" },
        { status: 404 },
      );
    }

    return NextResponse.json(restaurant);
  } catch (error) {
    console.error("🚨 Error in GET /restaurants/[id]:", error);
    return NextResponse.json(
      { error: "Εσωτερικό σφάλμα διακομιστή" },
      { status: 500 },
    );
  }
}
