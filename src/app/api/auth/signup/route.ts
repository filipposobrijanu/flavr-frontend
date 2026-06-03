// src/app/api/auth/signup/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs"; // 👈 Κάνουμε import το bcrypt

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, role, username, password } = body; // 👈 Τραβάμε και το password από το request body

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

    // 1. Check if the user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    // 2. If they ALREADY exist, throw an error! 🛑
    if (existingUser) {
      return NextResponse.json(
        { message: "Username or Email already taken!" },
        { status: 409 }, // 409 Conflict
      );
    }

    // 3. Hash the password 🔐
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. Create the new account with the hashed password ✅
    const newUser = await prisma.user.create({
      data: {
        email,
        username,
        role: role || "VISITOR",
        passwordHash: hashedPassword, // 👈 Αποθήκευση του πραγματικού κρυπτογραφημένου κωδικού
      },
    });

    // Αφαιρούμε το passwordHash από το object πριν το στείλουμε πίσω για λόγους ασφαλείας
    const { passwordHash: _, ...userWithoutPassword } = newUser;

    return NextResponse.json(userWithoutPassword, { status: 201 }); // 201 Created
  } catch (error) {
    console.error("Signup Error:", error);
    return NextResponse.json(
      { message: "Σφάλμα κατά την εγγραφή. Δοκιμάστε ξανά!" },
      { status: 500 },
    );
  }
}
