import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Χρήση του global instance

export async function POST(request: Request) {
  try {
    const {
      text,
      foodRating,
      serviceRating,
      atmosphereRating,
      vfmRating,
      restaurantId,
      userId,
    } = await request.json();

    if (!restaurantId || !userId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // 🎯 Υπολογισμός του simpleAverage για τη συγκεκριμένη κριτική
    const calculatedAverage =
      (Number(foodRating) +
        Number(serviceRating) +
        Number(atmosphereRating) +
        Number(vfmRating)) /
      4;

    // 1. Αποθήκευση της νέας κριτικής στη βάση με τα αληθινά σου πεδία
    const newReview = await prisma.review.create({
      data: {
        text, // 👈 text αντί για comment
        foodRating: Number(foodRating),
        serviceRating: Number(serviceRating),
        atmosphereRating: Number(atmosphereRating),
        vfmRating: Number(vfmRating),
        simpleAverage: calculatedAverage, // 👈 Αποθήκευση του μέσου όρου της κριτικής
        restaurantId,
        userId,
      },
    });

    // 2. ΥΠΟΛΟΓΙΣΜΟΣ BAYESIAN SCORE (Βασισμένο στο ολοκαίνουριο simpleAverage)

    // Α. Βρες τον μέσο όρο (C) όλων των simpleAverage παγκοσμίως στη βάση
    const allReviewsAggregate = await prisma.review.aggregate({
      _avg: { simpleAverage: true },
    });
    // Χρήση optional chaining (?.) για να μην παραπονιέται το TS αν είναι undefined
    const C = allReviewsAggregate._avg?.simpleAverage || 3.0;

    // Β. Βρες τον αριθμό κριτικών (v) του συγκεκριμένου εστιατορίου
    // Το σπάμε σε ξεχωριστό .count() για να αποφύγουμε το TS bug του aggregate count!
    const v = await prisma.review.count({
      where: { restaurantId },
    });

    // Γ. Βρες τον μέσο όρο (R) των simpleAverage του συγκεκριμένου εστιατορίου
    const thisRestAggregate = await prisma.review.aggregate({
      where: { restaurantId },
      _avg: { simpleAverage: true },
    });
    const R = thisRestAggregate._avg?.simpleAverage || 0;

    const m = 1.0; // Ελάχιστο όριο κριτικών

    // Δ. Εφαρμογή του τύπου Bayesian Average
    const bayesianScore = (v * R + m * C) / (v + m);

    // 3. Ενημέρωση του πεδίου στο Restaurant μοντέλο
    await prisma.restaurant.update({
      where: { id: restaurantId },
      data: { globalBayesianScore: bayesianScore },
    });

    return NextResponse.json(newReview, { status: 201 });
  } catch (error) {
    console.error("Review Error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
