import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, role, username, password } = body;

    if (!email || !username || !password) {
      return NextResponse.json(
        {
          message: "Όλα τα πεδία (email, username, password) είναι υποχρεωτικά",
        },
        { status: 400 },
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { message: "Ο κωδικός πρέπει να είναι τουλάχιστον 6 χαρακτήρες" },
        { status: 400 },
      );
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "Username or Email already taken!" },
        { status: 409 },
      );
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await prisma.user.create({
      data: {
        email,
        username,
        role: role || "VISITOR",
        passwordHash: hashedPassword,
      },
    });

    const { passwordHash: _, ...userWithoutPassword } = newUser;

    return NextResponse.json(userWithoutPassword, { status: 201 });
  } catch (error) {
    console.error("Signup Error:", error);
    return NextResponse.json(
      { message: "Σφάλμα κατά την εγγραφή. Δοκιμάστε ξανά!" },
      { status: 500 },
    );
  }
}
