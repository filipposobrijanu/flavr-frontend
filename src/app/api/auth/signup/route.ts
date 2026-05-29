import { NextResponse } from "next/server";
import { prisma } from "@/lib/db"; // Σιγουρέψου ότι το path για το prisma σου είναι σωστό (@/lib/db ή @/lib/prisma)

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, role, username } = body;

    if (!email) {
      return NextResponse.json(
        { error: "Το email είναι υποχρεωτικό" },
        { status: 400 },
      );
    }

    // Έλεγχος αν υπάρχει ήδη ο χρήστης
    let user = await prisma.user.findUnique({ where: { email } });

    // Αν δεν υπάρχει, τον δημιουργούμε αυτόματα
    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          username: username || email.split("@")[0], // Fallback αν το front-end δεν έστειλε username
          role: role || "USER",
          passwordHash: "mocked_password", // Απλό password για την εργασία
        },
      });

      return NextResponse.json(user, { status: 201 }); // 201 = Created
    }

    // Αν υπάρχει ήδη, επιστρέφουμε τον χρήστη (ή σφάλμα ότι υπάρχει ήδη, ό,τι προτιμάς)
    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("Signup Error:", error);
    return NextResponse.json(
      { error: "Σφάλμα κατά την αυθεντικοποίηση" },
      { status: 500 },
    );
  }
}
