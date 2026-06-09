import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { restaurantId } = await request.json();

    if (!restaurantId) {
      return NextResponse.json(
        { error: "Missing restaurantId" },
        { status: 400 },
      );
    }

    const existingFavorite = await prisma.favorite.findUnique({
      where: {
        userId_restaurantId: { userId, restaurantId },
      },
    });

    if (existingFavorite) {
      await prisma.favorite.delete({
        where: {
          userId_restaurantId: { userId, restaurantId },
        },
      });
      return NextResponse.json({ isFavorite: false });
    } else {
      await prisma.favorite.create({
        data: { userId, restaurantId },
      });
      return NextResponse.json({ isFavorite: true });
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
