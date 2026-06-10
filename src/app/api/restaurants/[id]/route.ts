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

    const allApproved = await prisma.restaurant.findMany({
      where: { status: "APPROVED" },
      include: { reviews: true },
    });

    let totalStarsAcrossPlatform = 0;
    let totalReviewsAcrossPlatform = 0;

    allApproved.forEach((res) => {
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

    const v = restaurant.reviews.length;
    const R =
      v > 0
        ? restaurant.reviews.reduce((acc, rev) => acc + rev.rating, 0) / v
        : 0;

    const bayesianScore = (v / (v + m)) * R + (m / (v + m)) * C;

    return NextResponse.json({
      ...restaurant,
      globalBayesianScore: v > 0 ? bayesianScore : 0,
    });
  } catch (error) {
    console.error("🚨 Error in GET /restaurants/[id]:", error);
    return NextResponse.json(
      { error: "Εσωτερικό σφάλμα διακομιστή" },
      { status: 500 },
    );
  }
}
