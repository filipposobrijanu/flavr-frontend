import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, role, username } = body;

    // Έλεγχος αν υπάρχει ήδη ο χρήστης
    let user = await prisma.user.findUnique({ where: { email } });

    // Αν δεν υπάρχει, τον δημιουργούμε αυτόματα με τον ρόλο που επιλέχθηκε
    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          username,
          role,
          passwordHash: "mocked_password", // Απλό password hash για την εργασία
        },
      });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Σφάλμα κατά την αυθεντικοποίηση" },
      { status: 500 },
    );
  }
}
