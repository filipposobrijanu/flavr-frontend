// src/app/api/auth/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, username, password } = body;

    if ((!email && !username) || !password) {
      return NextResponse.json(
        { message: "Λείπουν τα στοιχεία σύνδεσης (email/username ή κωδικός)" },
        { status: 400 },
      );
    }

    // 1. Βρίσκουμε τον χρήστη είτε με email είτε με username
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email: email || "" }, { username: username || "" }],
      },
    });

    // 1.5 Ελέγχουμε αν υπάρχει ο χρήστης ΚΑΙ αν έχει αποθηκευμένο κωδικό
    if (!user || !user.passwordHash) {
      return NextResponse.json(
        { message: "Λάθος στοιχεία σύνδεσης" },
        { status: 401 },
      );
    }

    // 2. Ελέγχουμε αν ο κωδικός ταιριάζει (πλέον το TS ξέρει ότι το passwordHash είναι 100% string)
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Λάθος στοιχεία σύνδεσης" },
        { status: 401 },
      );
    }

    // 3. Αποθηκεύουμε το userId στα Cookies (απαραίτητο για το Dashboard)
    const cookieStore = await cookies();
    cookieStore.set("userId", user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // Το cookie λήγει σε 7 μέρες
    });

    // 4. Επιστρέφουμε τα στοιχεία του χρήστη (ΧΩΡΙΣ τον κωδικό για ασφάλεια)
    const { passwordHash: _, ...safeUser } = user;

    return NextResponse.json(safeUser, { status: 200 });
  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json(
      { message: "Σφάλμα διακομιστή κατά την είσοδο" },
      { status: 500 },
    );
  }
}
