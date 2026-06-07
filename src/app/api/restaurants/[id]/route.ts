import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// 1. Ορίζουμε στο TypeScript ότι το params είναι Promise
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    // 2. Προσθέτουμε το `await` πριν κάνουμε destructuring το id
    const { id } = await params;

    // Φέρνουμε το εστιατόριο με το σωστό φώλιασμα (nesting)
    const restaurant = await prisma.restaurant.findUnique({
      where: { id },
      include: {
        reviews: {
          include: {
            // 👈 ΔΙΟΡΘΩΣΗ 1: Φέρνουμε τον χρήστη που έγραψε το REVIEW (για το Badge)
            user: {
              include: {
                _count: {
                  select: { reviews: true },
                },
              },
            },
            // 👈 ΔΙΟΡΘΩΣΗ 2: Παράλληλα, φέρνουμε τα σχόλια του review
            comments: {
              include: {
                user: {
                  select: { username: true }, // Φέρνουμε το username αυτού που σχολίασε
                },
              },
              orderBy: { createdAt: "asc" }, // Τα σχόλια καλό είναι να φαίνονται από το παλαιότερο στο νεότερο
            },
            ownerReply: true,
          },
          orderBy: { createdAt: "desc" }, // Τα reviews από το νεότερο στο παλαιότερο
        },
      },
    });

    if (!restaurant) {
      return NextResponse.json(
        { error: "Το εστιατόριο δεν βρέθηκε" },
        { status: 404 },
      );
    }

    return NextResponse.json(restaurant);
  } catch (error) {
    console.error("🚨 Error in GET /restaurants/[id]:", error);
    return NextResponse.json(
      { error: "Εσωτερικό σφάλμα διακομιστή" },
      { status: 500 },
    );
  }
}
