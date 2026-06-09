import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { cookies } from "next/headers";

export async function DELETE() {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value;

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await prisma.review.deleteMany({
      where: { userId: userId },
    });

    await prisma.user.delete({
      where: { id: userId },
    });

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
