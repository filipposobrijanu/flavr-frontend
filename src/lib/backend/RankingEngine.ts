import { prisma } from "../db";
import { Review } from "@prisma/client";

export class RankingEngine {
  private static readonly MIN_REVIEWS_THRESHOLD = 5;

  public static async calculateAndUpdateBayesianRoute(
    restaurantId: string,
  ): Promise<number> {
    const restaurantReviews = await prisma.review.findMany({
      where: { restaurantId },
    });
    const v = restaurantReviews.length;

    if (v === 0) return 0.0;

    const sumOfAverages = restaurantReviews.reduce(
      (acc, rev) => acc + (rev.simpleAverage || 0),
      0,
    );
    const R = sumOfAverages / v;

    const allReviews = await prisma.review.findMany();
    if (allReviews.length === 0) return R;

    const globalSum = allReviews.reduce(
      (acc: number, rev: Review) => acc + rev.simpleAverage,
      0,
    );
    const C = globalSum / allReviews.length;

    const m = RankingEngine.MIN_REVIEWS_THRESHOLD;

    const weightedRating = (R * v + C * m) / (v + m);
    const finalScore = Math.round(weightedRating * 100) / 100;

    await prisma.restaurant.update({
      where: { id: restaurantId },
      data: { globalBayesianScore: finalScore },
    });

    return finalScore;
  }
}
