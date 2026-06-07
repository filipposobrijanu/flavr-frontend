import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // 👈 Σιγουρέψου ότι το path είναι σωστό (π.χ. @/lib/db ή @/lib/prisma)

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }, // 👈 1. Ορίζουμε το params ως Promise
) {
  try {
    // 2. Κάνουμε await τα params για να πάρουμε το id με ασφάλεια
    const { id } = await params;

    const { text, userId } = await req.json();

    if (!text || text.trim() === "") {
      return NextResponse.json(
        { error: "Comment text is required" },
        { status: 400 },
      );
    }

    const newComment = await prisma.comment.create({
      data: {
        text,
        reviewId: id, // 👈 3. Χρήση του ξετυλιγμένου id εδώ
        userId: userId,
      },
      include: {
        user: {
          select: { username: true },
        },
      },
    });

    return NextResponse.json(newComment, { status: 201 });
  } catch (error) {
    console.error("Comment API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
