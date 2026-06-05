import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { cookies } from "next/headers";

export async function DELETE() {
  try {
    // 1. Παίρνουμε το userId από τα cookies
    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value;

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // 2. Διαγραφή του χρήστη (το Prisma θα διαγράψει και τα reviews αν έχεις cascade delete)
    // Αν δεν έχεις cascade delete στο Prisma schema, πρέπει πρώτα να διαγράψεις τα reviews του χρήστη!
    await prisma.review.deleteMany({
      where: { userId: userId },
    });

    await prisma.user.delete({
      where: { id: userId },
    });

    // 3. Διαγραφή του cookie για να αποσυνδεθεί ο χρήστης
    cookieStore.delete("userId");

    return NextResponse.json(
      { message: "Account deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Delete Account Error:", error);
    return NextResponse.json(
      { message: "Σφάλμα κατά τη διαγραφή λογαριασμού" },
      { status: 500 },
    );
  }
}
