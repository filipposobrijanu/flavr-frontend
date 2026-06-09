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

    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email: email || "" }, { username: username || "" }],
      },
    });

    if (!user || !user.passwordHash) {
      return NextResponse.json(
        { message: "Λάθος στοιχεία σύνδεσης" },
        { status: 401 },
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Λάθος στοιχεία σύνδεσης" },
        { status: 401 },
      );
    }

    const cookieStore = await cookies();
    cookieStore.set("userId", user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

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
