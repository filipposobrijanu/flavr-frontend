import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const { accessToken, role } = await request.json();

    if (!accessToken) {
      return NextResponse.json({ message: "Λείπει το Token" }, { status: 400 });
    }

    const googleRes = await fetch(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      },
    );

    if (!googleRes.ok) {
      return NextResponse.json(
        { message: "Μη έγκυρο Google Token" },
        { status: 400 },
      );
    }

    const payload = await googleRes.json();
    const email = payload.email;
    const name = payload.name || email.split("@")[0];

    let user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      let baseUsername = name.replace(/\s+/g, "").toLowerCase();
      let uniqueUsername = baseUsername;
      let counter = 1;

      while (
        await prisma.user.findUnique({ where: { username: uniqueUsername } })
      ) {
        uniqueUsername = `${baseUsername}${counter}`;
        counter++;
      }

      user = await prisma.user.create({
        data: {
          email,
          username: uniqueUsername,
          role: role || "REVIEWER",
          passwordHash: null,
        },
      });
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
    console.error("Google Auth Error:", error);
    return NextResponse.json(
      { message: "Σφάλμα κατά τη σύνδεση με Google" },
      { status: 500 },
    );
  }
}
