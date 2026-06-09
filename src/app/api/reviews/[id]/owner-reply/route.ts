import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const { text, userId } = await req.json();

    if (!text || text.trim() === "") {
      return NextResponse.json(
        { error: "Reply text is required" },
        { status: 400 },
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || user.role !== "OWNER") {
      return NextResponse.json(
        { error: "Unauthorized. Only owners can reply officially." },
        { status: 403 },
      );
    }

    const reply = await prisma.ownerReply.create({
      data: {
        text,
        reviewId: id,
        userId: userId,
      },
    });

    return NextResponse.json(reply, { status: 201 });
  } catch (error) {
    console.error("Owner Reply API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
