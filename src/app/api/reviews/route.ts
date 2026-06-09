import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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
      images,
    } = await request.json();

    if (!restaurantId || !userId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const calculatedAverage =
      (Number(foodRating) +
        Number(serviceRating) +
        Number(atmosphereRating) +
        Number(vfmRating)) /
      4;

    const newReview = await prisma.review.create({
      data: {
        text,
        foodRating: Number(foodRating),
        serviceRating: Number(serviceRating),
        atmosphereRating: Number(atmosphereRating),
        vfmRating: Number(vfmRating),
        simpleAverage: calculatedAverage,
        restaurantId,
        images,
        rating: Math.round(calculatedAverage),
        userId,
      },
    });

    const allReviewsAggregate = await prisma.review.aggregate({
      _avg: { simpleAverage: true },
    });
    const C = allReviewsAggregate._avg?.simpleAverage || 3.0;

    const v = await prisma.review.count({
      where: { restaurantId },
    });

    const thisRestAggregate = await prisma.review.aggregate({
      where: { restaurantId },
      _avg: { simpleAverage: true },
    });
    const R = thisRestAggregate._avg?.simpleAverage || 0;

    const m = 1.0;

    const bayesianScore = (v * R + m * C) / (v + m);

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
