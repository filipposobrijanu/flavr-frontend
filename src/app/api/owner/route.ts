import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
export const dynamic = "force-dynamic";
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const ownerId = searchParams.get("ownerId");

  if (!ownerId) {
    return NextResponse.json({ error: "Δεν δόθηκε ownerId" }, { status: 400 });
  }

  const myRestaurants = await prisma.restaurant.findMany({
    where: { ownerId: ownerId },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(myRestaurants);
}
