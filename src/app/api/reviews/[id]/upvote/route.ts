import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const isReverting = body.action === "revert";

    // 1. Βρίσκουμε πρώτα την κριτική στη βάση
    const review = await prisma.review.findUnique({
      where: { id },
    });

    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    // 2. Αν το upvotes είναι null στη βάση, το κάνουμε 0. Αλλιώς κρατάμε την τιμή του.
    const currentUpvotes = review.upvotes ?? 0;

    // 3. Υπολογίζουμε το νέο σύνολο (χωρίς να επιτρέπουμε να πέσει κάτω από το 0)
    const newUpvotes = isReverting
      ? Math.max(0, currentUpvotes - 1)
      : currentUpvotes + 1;

    // 4. Αποθηκεύουμε τη νέα καθαρή τιμή
    const updatedReview = await prisma.review.update({
      where: { id },
      data: { upvotes: newUpvotes },
    });

    console.log(
      `[UPVOTE API] Review ${id} updated. Action: ${body.action}, New upvotes: ${updatedReview.upvotes}`,
    );

    return NextResponse.json({ success: true, upvotes: updatedReview.upvotes });
  } catch (error) {
    console.error("[UPVOTE API ERROR]:", error);
    return NextResponse.json(
      { error: "Failed to modify upvote" },
      { status: 500 },
    );
  }
}
