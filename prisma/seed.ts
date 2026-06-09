import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database with mock data for Flavr...");

  const owner = await prisma.user.upsert({
    where: { email: "gordon@flavr.com" },
    update: {},
    create: {
      email: "gordon@flavr.com",
      username: "ChefGordon",
      role: "OWNER",
      passwordHash: "mock_hash_123",
    },
  });

  const reviewer1 = await prisma.user.upsert({
    where: { email: "foodie_john@gmail.com" },
    update: {},
    create: {
      email: "foodie_john@gmail.com",
      username: "JohnTheFoodie",
      role: "REVIEWER",
      passwordHash: "mock_hash_123",
    },
  });

  const reviewer2 = await prisma.user.upsert({
    where: { email: "maria_eats@yahoo.com" },
    update: {},
    create: {
      email: "maria_eats@yahoo.com",
      username: "MariaEats",
      role: "REVIEWER",
      passwordHash: "mock_hash_123",
    },
  });

  const restaurant1 = await prisma.restaurant.create({
    data: {
      name: "Luigi's Pasta House",
      description:
        "Authentic handmade pasta and wood-fired pizzas in a cozy environment.",
      cuisineType: "Italian",
      address: "Kolonaki Square 12",
      priceRange: "$$",
      area: "Central Athens",
      status: "APPROVED",
      views: 120,
      globalBayesianScore: 4.5,
      imageUrl:
        "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80",
      ownerId: owner.id,
    },
  });

  const restaurant2 = await prisma.restaurant.create({
    data: {
      name: "Smokey Bear BBQ",
      description: "Texas-style slow-cooked brisket, ribs, and pulled pork.",
      cuisineType: "American BBQ",
      address: "Poseidonos Ave 45",
      priceRange: "$$$",
      area: "Glyfada",
      status: "APPROVED",
      views: 350,
      globalBayesianScore: 4.8,
      imageUrl:
        "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=800&q=80",
      ownerId: owner.id,
    },
  });

  const restaurant3 = await prisma.restaurant.create({
    data: {
      name: "Sushi Zen",
      description:
        "Premium sushi rolls and fresh sashimi prepared by master chefs.",
      cuisineType: "Japanese",
      address: "Kifisias 102",
      priceRange: "$$$$",
      area: "Kifisia",
      status: "APPROVED",
      views: 85,
      globalBayesianScore: 4.2,
      imageUrl:
        "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&q=80",
      ownerId: owner.id,
    },
  });

  await prisma.review.create({
    data: {
      rating: 5,
      text: "The best pasta I've had outside of Italy! The carbonara was perfectly creamy.",
      atmosphereRating: 4,
      foodRating: 5,
      serviceRating: 5,
      vfmRating: 4,
      simpleAverage: 4.5,
      restaurantId: restaurant1.id,
      userId: reviewer1.id,
      upvotes: 12,
    },
  });

  await prisma.review.create({
    data: {
      rating: 4,
      text: "Great brisket, melts in your mouth. Service was a bit slow though.",
      atmosphereRating: 5,
      foodRating: 5,
      serviceRating: 3,
      vfmRating: 4,
      simpleAverage: 4.25,
      restaurantId: restaurant2.id,
      userId: reviewer2.id,
      upvotes: 5,
    },
  });

  await prisma.review.create({
    data: {
      rating: 3,
      text: "Good sushi but extremely overpriced for the portion sizes.",
      atmosphereRating: 4,
      foodRating: 4,
      serviceRating: 4,
      vfmRating: 2,
      simpleAverage: 3.5,
      restaurantId: restaurant3.id,
      userId: reviewer1.id,
      upvotes: 2,
    },
  });

  console.log("✅ Seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
