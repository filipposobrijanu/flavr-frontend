import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const restaurant = await prisma.restaurant.findUnique({
      where: { id },
      include: {
        reviews: {
          include: {
            user: {
              include: {
                _count: {
                  select: { reviews: true },
                },
              },
            },
            comments: {
              include: {
                user: {
                  select: { username: true },
                },
              },
              orderBy: { createdAt: "asc" },
            },
            ownerReply: true,
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
