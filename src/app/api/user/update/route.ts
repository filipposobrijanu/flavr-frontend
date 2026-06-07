import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { cookies } from "next/headers";

export async function PUT(request: Request) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value;

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { username } = body;

    if (!username) {
      return NextResponse.json(
        { message: "Username is required" },
        { status: 400 },
      );
    }

    // Έλεγχος αν το username υπάρχει ήδη σε άλλον χρήστη
    const existingUser = await prisma.user.findFirst({
      where: {
        username: username,
        NOT: { id: userId }, // Εξαιρούμε τον τρέχοντα χρήστη
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "Username is already taken" },
        { status: 409 },
      );
    }

    // Ενημέρωση του χρήστη
    await prisma.user.update({
      where: { id: userId },
      data: { username },
    });

    return NextResponse.json(
      { message: "Profile updated successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Update Profile Error:", error);
    return NextResponse.json(
      { message: "Server error during update" },
      { status: 500 },
    );
  }
}
