import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs"; // Χρειάζεσαι το bcryptjs για να ελέγξεις/φτιάξεις τον κωδικό

export async function PUT(request: Request) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value;

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { message: "Both passwords are required" },
        { status: 400 },
      );
    }

    // Βρίσκουμε τον χρήστη
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.passwordHash) {
      return NextResponse.json(
        { message: "User not found or no password set" },
        { status: 404 },
      );
    }

    // Ελέγχουμε αν ο τωρινός κωδικός είναι σωστός
    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.passwordHash,
    );
    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Incorrect current password" },
        { status: 401 },
      );
    }

    // Κρυπτογραφούμε τον νέο κωδικό
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Αποθηκεύουμε τον νέο κωδικό
    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash: hashedNewPassword },
    });

    return NextResponse.json(
      { message: "Password updated successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Update Password Error:", error);
    return NextResponse.json(
      { message: "Server error during password update" },
      { status: 500 },
    );
  }
}
