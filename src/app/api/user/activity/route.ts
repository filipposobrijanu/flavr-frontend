import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: Request) {
  // Assume you have a way to verify the user (e.g., from a header or session)
  const userId = request.headers.get("X-User-Id");

  const activity = await prisma.review.findMany({
    where: { userId: userId || "" },
    include: { restaurant: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
    take: 10, // Show the last 10 actions
  });

  return NextResponse.json(activity);
}
