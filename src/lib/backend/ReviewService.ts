import { prisma } from "../db";
import { RankingEngine } from "./RankingEngine";

export class ReviewService {
  public async createReview(data: {
    text: string;
    foodRating: number;
    serviceRating: number;
    atmosphereRating: number;
    vfmRating: number;
    userId: string;
    restaurantId: string;
  }) {
    // Υπολογισμός απλού μέσου όρου για την τρέχουσα κριτική
    const simpleAvg =
      (data.foodRating +
        data.serviceRating +
        data.atmosphereRating +
        data.vfmRating) /
      4;

    // Αποθήκευση στη βάση
    const newReview = await prisma.review.create({
      data: {
        text: data.text,
        foodRating: data.foodRating,
        serviceRating: data.serviceRating,
        atmosphereRating: data.atmosphereRating,
        vfmRating: data.vfmRating,
        simpleAverage: simpleAvg,
        userId: data.userId,
        restaurantId: data.restaurantId,
      },
    });

    // Πυροδότηση του Bayesian αλγορίθμου για ανανέωση της κατάταξης του εστιατορίου
    await RankingEngine.calculateAndUpdateBayesianRoute(data.restaurantId);

    return newReview;
  }

  public async deleteReview(reviewId: string, restaurantId: string) {
    await prisma.review.delete({ where: { id: reviewId } });
    // Επαναϋπολογισμός μετά τη διαγραφή
    await RankingEngine.calculateAndUpdateBayesianRoute(restaurantId);
  }
}
