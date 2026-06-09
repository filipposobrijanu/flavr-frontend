import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const updatedRestaurant = await prisma.restaurant.update({
      where: { id: id },
      data: { views: { increment: 1 } },
    });

    return NextResponse.json({ views: updatedRestaurant.views });
  } catch (error: any) {
    console.error("DEBUG - Prisma Error:", error.message);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 },
    );
  }
}
