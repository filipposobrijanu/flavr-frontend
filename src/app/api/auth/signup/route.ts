import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, role, username } = body;

    if (!email || !username) {
      return NextResponse.json(
        { message: "Το email και το username είναι υποχρεωτικά" },
        { status: 400 },
      );
    }

    // 1. Check if the user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });

    // 2. If they ALREADY exist, throw an error! 🛑
    if (existingUser) {
      return NextResponse.json(
        { message: "Username or Email already taken!" },
        { status: 409 }, // 409 Conflict
      );
    }

    // 3. If they don't exist, create the new account ✅
    const newUser = await prisma.user.create({
      data: {
        email,
        username,
        role: role || "VISITOR",
        passwordHash: "mocked_password", // Απλό password για την εργασία
      },
    });

    return NextResponse.json(newUser, { status: 201 }); // 201 Created
  } catch (error) {
    console.error("Signup Error:", error);
    return NextResponse.json(
      { message: "Σφάλμα κατά την εγγραφή. Δοκιμάστε ξανά!" },
      { status: 500 },
    );
  }
}
