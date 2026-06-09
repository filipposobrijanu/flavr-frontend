import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: Request) {
  const userId = request.headers.get("X-User-Id");

  const activity = await prisma.review.findMany({
    where: { userId: userId || "" },
    include: { restaurant: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  return NextResponse.json(activity);
}
