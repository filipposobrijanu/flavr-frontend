import { prisma } from "../db";
import { Review } from "@prisma/client"; // Κάνουμε import το έτοιμο μοντέλο-τύπο

export class RankingEngine {
  private static readonly MIN_REVIEWS_THRESHOLD = 5;

  public static async calculateAndUpdateBayesianRoute(
    restaurantId: string,
  ): Promise<number> {
    // 1. Βρες τις κριτικές του συγκεκριμένου εστιατορίου
    const restaurantReviews = await prisma.review.findMany({
      where: { restaurantId },
    });
    const v = restaurantReviews.length;

    if (v === 0) return 0.0;

    // ΔΙΟΡΘΩΣΗ: Ορίζουμε acc: number και rev: Review
    const sumOfAverages = restaurantReviews.reduce(
      (acc: number, rev: Review) => acc + rev.simpleAverage,
      0,
    );
    const R = sumOfAverages / v;

    // 2. Βρες τον γενικό μέσο όρο (C) όλων των κριτικών στην πλατφόρμα
    const allReviews = await prisma.review.findMany();
    if (allReviews.length === 0) return R;

    // ΔΙΟΡΘΩΣΗ: Ορίζουμε acc: number και rev: Review
    const globalSum = allReviews.reduce(
      (acc: number, rev: Review) => acc + rev.simpleAverage,
      0,
    );
    const C = globalSum / allReviews.length;

    const m = RankingEngine.MIN_REVIEWS_THRESHOLD;

    // 3. Εφαρμογή του Bayesian Μαθηματικού Τύπου
    const weightedRating = (R * v + C * m) / (v + m);
    const finalScore = Math.round(weightedRating * 100) / 100;

    // 4. Ενημέρωση της βάσης
    await prisma.restaurant.update({
      where: { id: restaurantId },
      data: { globalBayesianScore: finalScore },
    });

    return finalScore;
  }
}
