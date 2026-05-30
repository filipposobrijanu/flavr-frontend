import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, username } = body;

    // 1. Search for the user by email
    const user = await prisma.user.findUnique({ where: { email } });

    // 2. If user DOES NOT exist, throw an error! 🛑
    if (!user) {
      return NextResponse.json(
        { message: "Invalid credentials or user does not exist!" },
        { status: 401 }, // 401 Unauthorized
      );
    }

    // 3. (Optional but recommended) Check if the username matches
    if (user.username !== username) {
      return NextResponse.json(
        { message: "Invalid credentials!" },
        { status: 401 },
      );
    }

    // 4. If everything is good, log them in ✅
    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Σφάλμα κατά την αυθεντικοποίηση" },
      { status: 500 },
    );
  }
}
