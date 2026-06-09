import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const BRUTAL_COLORS = [
  "#9333EA",
  "#22C55E",
  "#EF4444",
  "#3a8bd6",
  "#FF8904",
  "#F59E0B",
  "#EC4899",
];

export async function GET() {
  try {
    const rawUsers = await prisma.user.findMany({
      where: {
        role: "REVIEWER",
      },
      take: 5,
      include: {
        reviews: {
          select: {
            upvotes: true,
          },
        },
        _count: {
          select: {
            reviews: true,
          },
        },
      },
    });

    const topReviewers = rawUsers
      .map((user, index) => {
        const totalUpvotes = user.reviews.reduce(
          (sum, r) => sum + (r.upvotes || 0),
          0,
        );
        const reviewsCount = user._count.reviews;

        const baseScore = 5.0;
        const reviewBonus = Math.min(reviewsCount * 0.2, 4.0);
        const upvoteBonus = Math.min(totalUpvotes * 0.1, 1.0);
        const calculatedTrust = Math.min(
          baseScore + reviewBonus + upvoteBonus,
          10.0,
        ).toFixed(1);

        const assignedColor = BRUTAL_COLORS[index % BRUTAL_COLORS.length];

        const assignedAvatar = `https://api.dicebear.com/7.x/fun-emoji/svg?seed=${encodeURIComponent(user.username)}`;

        return {
          id: user.id,
          name: user.username,
          avatar: assignedAvatar,
          trust: calculatedTrust,
          reviewsCount: reviewsCount,
          color: assignedColor,
        };
      })
      .sort((a, b) => parseFloat(b.trust) - parseFloat(a.trust))
      .slice(0, 3);

    return NextResponse.json(topReviewers, { status: 200 });
  } catch (error) {
    console.error("Error in top-reviewers API:", error);
    return NextResponse.json(
      { error: "Failed to fetch top reviewers from database" },
      { status: 500 },
    );
  }
}
