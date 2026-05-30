"use client";
import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

interface Review {
  id: string;
  text: string;
  foodRating: number;
  serviceRating: number;
  atmosphereRating: number;
  vfmRating: number;
  simpleAverage: number;
  createdAt: string;
  user: {
    username: string;
  };
}

interface Restaurant {
  id: string;
  name: string;
  description: string;
  cuisineType: string;
  address: string;
  globalBayesianScore: number;
  reviews: Review[];
}

export default function RestaurantDetailsPage() {
  const { id } = useParams();
  const router = useRouter();

  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);

  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const showNotification = (message: string, type: "success" | "error") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // Form State για την κριτική
  const [text, setText] = useState("");
  const [foodRating, setFoodRating] = useState(5);
  const [serviceRating, setServiceRating] = useState(5);
  const [atmosphereRating, setAtmosphereRating] = useState(5);
  const [vfmRating, setVfmRating] = useState(5);

  // Φόρτωση δεδομένων εστιατορίου
  const fetchRestaurantData = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/restaurants/${id}`);
    if (res.ok) {
      const data = await res.json();
      setRestaurant(data);
    }
    setLoading(false);
  }, [id]);

  useEffect(() => {
    // Διάβασμα συνδεδεμένου χρήστη
    const storedUser = localStorage.getItem("user");
    if (storedUser) setCurrentUser(JSON.parse(storedUser));

    fetchRestaurantData();
  }, [fetchRestaurantData]);

  // Υποβολή Κριτικής
  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text)
      return showNotification("Please write a review comment!", "error");
    if (!currentUser)
      return showNotification("You must be logged in to review!", "error");

    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text,
        foodRating,
        serviceRating,
        atmosphereRating,
        vfmRating,
        userId: currentUser.id,
        restaurantId: id,
      }),
    });

    if (res.ok) {
      showNotification(
        "Your review has been submitted! Bayesian Score recalculated live!",
        "success",
      );
      setText("");
      setFoodRating(5);
      setServiceRating(5);
      setAtmosphereRating(5);
      setVfmRating(5);
      fetchRestaurantData();
    } else {
      showNotification("Review submission failed.", "error");
    }
  };

  if (loading)
    return (
      <div className="min-h-[calc(80vh-4rem)] p-6 md:p-12 text-black animate-pulse">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Back Button Skeleton */}
          <div className="h-10 w-40 bg-gray-200 rounded-xl border-2 border-black"></div>

          {/* Hero Card Skeleton */}
          <div className="bg-white p-6 md:p-8 border-4 border-black rounded-2xl flex flex-col md:flex-row justify-between items-start gap-6">
            <div className="space-y-4 flex-1">
              <div className="h-6 w-24 bg-gray-200 rounded-lg"></div>{" "}
              {/* Cuisine tag */}
              <div className="h-12 w-3/4 bg-gray-200 rounded-lg"></div>{" "}
              {/* Title */}
              <div className="h-4 w-1/3 bg-gray-200 rounded-md"></div>{" "}
              {/* Address */}
              <div className="space-y-2 pt-4 border-t-2 border-black border-dashed">
                <div className="h-4 w-full bg-gray-200 rounded"></div>
                <div className="h-4 w-full bg-gray-200 rounded"></div>
                <div className="h-4 w-2/3 bg-gray-200 rounded"></div>
              </div>
            </div>
            {/* Score Badge Skeleton */}
            <div className="h-32 w-full md:w-[180px] bg-gray-200 border-4 border-black rounded-2xl"></div>
          </div>

          {/* Form & Reviews Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Sidebar Form Skeleton */}
            <div className="h-[400px] w-full bg-white border-4 border-black rounded-2xl p-6">
              <div className="h-8 w-1/2 bg-gray-200 rounded mb-6"></div>
              <div className="space-y-6">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-10 w-full bg-gray-200 rounded-lg"
                  ></div>
                ))}
              </div>
            </div>

            {/* Reviews List Skeleton */}
            <div className="lg:col-span-2 space-y-4">
              <div className="h-8 w-48 bg-gray-200 rounded-lg"></div>
              <div
                key={1}
                className="h-40 w-full bg-white border-2 border-b-4 border-black rounded-2xl p-5 space-y-4"
              >
                <div className="flex justify-between">
                  <div className="h-6 w-32 bg-gray-200 rounded"></div>
                  <div className="h-6 w-20 bg-gray-200 rounded"></div>
                </div>
                <div className="h-16 w-full bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );

  if (!restaurant)
    return (
      <div className="min-h-[calc(80vh-4rem)] flex flex-col items-center justify-center text-black gap-4">
        <title>Restaurant | Flavr</title>
        <p className="font-black text-2xl text-red-500">
          Το εστιατόριο δεν βρέθηκε!
        </p>
        <Link
          href="/restaurants"
          className="border-2 border-black bg-yellow-400 px-4 py-2 font-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
        >
          GO BACK
        </Link>
      </div>
    );

  return (
    <div className="min-h-[calc(80vh-4rem)] p-6 md:p-12 text-black">
      {notification && (
        <div
          className={`fixed bottom-20 right-6 z-50 p-4 border-4 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-black ${
            notification.type === "success"
              ? "bg-green-500  text-black"
              : "bg-red-500  text-white"
          }`}
        >
          {notification.message}
        </div>
      )}
      <title>Restaurant | Flavr</title>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Πίσω στις αναζητήσεις */}

        <Link
          href="/restaurants"
          className="inline-block font-black inline-flex gap-2 text-md uppercase tracking-wider border-2 border-black bg-gray-200 px-4 py-2 rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
        >
          Back to Restaurants
        </Link>

        {/* 🏛️ Κεντρικό Card Εστιατορίου */}
        <div className="bg-white p-6 md:p-8 border-4 border-black rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col md:flex-row justify-between items-start gap-6">
          <div className="space-y-3 flex-1">
            <span className="bg-blue-400 text-black text-xs font-black px-3 py-1 border-2 border-black rounded-lg uppercase tracking-wide inline-block shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              {restaurant.cuisineType}
            </span>
            <h1 className="text-3xl md:text-5xl font-black text-black uppercase tracking-tight">
              {restaurant.name}
            </h1>
            <p className="text-gray-600 font-bold text-sm">
              {restaurant.address}
            </p>
            <p className="text-gray-800 pt-2 font-medium leading-relaxed max-w-3xl border-t-2 border-black border-dashed">
              {restaurant.description}
            </p>
          </div>

          {/* 📊 Μεγάλο Bayesian Score Sticker */}
          <div className="bg-yellow-400 border-4 border-black p-6 rounded-2xl text-center shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] min-w-[180px] w-full md:w-auto shrink-0">
            <p className="text-xs font-black uppercase tracking-wider text-black">
              Bayesian Score
            </p>
            <p className="text-4xl font-black mt-1 text-black flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
                fill="black"
                className="bi bi-star"
                viewBox="0 0 16 16"
              >
                <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.56.56 0 0 0-.163-.505L1.71 6.745l4.052-.576a.53.53 0 0 0 .393-.288L8 2.223l1.847 3.658a.53.53 0 0 0 .393.288l4.052.575-2.906 2.77a.56.56 0 0 0-.163.506l.694 3.957-3.686-1.894a.5.5 0 0 0-.461 0z" />
              </svg>{" "}
              {restaurant.globalBayesianScore > 0
                ? Number(restaurant.globalBayesianScore).toFixed(1)
                : "NEW"}
            </p>
            <div className="text-[11px] mt-3 font-black uppercase border-t border-black pt-2 text-black opacity-90">
              {restaurant.reviews.length} reviews
            </div>
          </div>
        </div>

        {/* Κάτω Πλέγμα: Φόρμα & Κριτικές */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* ✍️ Φόρμα Κριτικής */}
          <div className="lg:col-span-1">
            {currentUser?.role === "REVIEWER" ? (
              <div className="bg-white p-6 border-4 border-black rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] sticky top-6">
                <h2 className="text-xl font-black uppercase tracking-tight mb-4 text-black border-b-2 border-black pb-2">
                  Write a Review
                </h2>
                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  {/* Multi-Criteria Σύρτες */}
                  {[
                    { label: "Food", val: foodRating, set: setFoodRating },
                    {
                      label: "Service",
                      val: serviceRating,
                      set: setServiceRating,
                    },
                    {
                      label: "Atmosphere",
                      val: atmosphereRating,
                      set: setAtmosphereRating,
                    },
                    {
                      label: "Value for Money",
                      val: vfmRating,
                      set: setVfmRating,
                    },
                  ].map((item, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-xs font-black uppercase text-black">
                        <span>{item.label}</span>
                        <span className="bg-blue-400 border-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] border-black px-1.5 py-0.5 rounded text-xs">
                          {item.val}/5
                        </span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="5"
                        className="w-full accent-black cursor-pointer"
                        value={item.val}
                        onChange={(e) => item.set(Number(e.target.value))}
                      />
                    </div>
                  ))}

                  {/* Textarea Σχολίου */}
                  <div className="space-y-1 pt-2">
                    <label className="block text-xs font-black uppercase text-black">
                      Comment / Experience
                    </label>
                    <textarea
                      className="w-full p-3 border-2 border-black rounded-xl font-bold bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:translate-x-[1px] focus:translate-y-[1px] focus:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all placeholder:text-gray-400 text-black h-24 resize-none text-sm"
                      placeholder="How was your experience?"
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                    />
                  </div>

                  {/* Neobrutalist Submit Button */}
                  <button type="submit" className="w-full button-main">
                    <span
                      style={{ backgroundColor: "#50A2FF" }}
                      className="button_top block px-3 py-2.5 text-center font-black uppercase"
                    >
                      Submit a Review
                    </span>
                  </button>
                </form>
              </div>
            ) : (
              <div className="bg-white p-6 border-4 border-dashed border-black rounded-2xl text-center font-black text-sm text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                {currentUser
                  ? "Only users with the Reviewer role can submit reviews."
                  : "Log in as a Reviewer to write a review."}
              </div>
            )}
          </div>

          {/* 💬 Λίστα Κριτικών */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-2xl font-black text-white uppercase tracking-tight [-webkit-text-stroke:4px_black] [paint-order:stroke_fill] text-left">
              Reviews ({restaurant.reviews.length})
            </h2>

            {restaurant.reviews.length === 0 ? (
              <div className="text-center py-12 border-4 border-dashed border-black rounded-2xl bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <p className="font-black text-xl">
                  There are no reviews yet...
                </p>
                <p className="text-sm text-gray-500 font-bold mt-1">
                  Be the first to write a review for this store!
                </p>
              </div>
            ) : (
              restaurant.reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="bg-white p-5 border-2 border-b-4 border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-3"
                >
                  <div className="flex justify-between items-start border-b-2 border-black pb-2 gap-2">
                    <div>
                      <span className="font-black text-gray-900 block text-base">
                        {rev.user.username}
                      </span>
                      <span className="text-xs text-gray-500 font-bold">
                        {new Date(rev.createdAt).toLocaleDateString("el-GR")}
                      </span>
                    </div>
                    <span className="bg-blue-400 border-2 border-black text-black text-xs font-black px-2.5 py-1 rounded-lg shrink-0 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                      Average {rev.simpleAverage.toFixed(1)}/5
                    </span>
                  </div>

                  {/* Sub-ratings Badges */}
                  <div className="flex flex-wrap gap-2 text-[11px] font-black uppercase">
                    <span className="bg-blue-200 border-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] border-black px-2 py-0.5 rounded-lg">
                      Food: {rev.foodRating}
                    </span>
                    <span className="bg-blue-200 border-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] border-black px-2 py-0.5 rounded-lg">
                      Service: {rev.serviceRating}
                    </span>
                    <span className="bg-blue-200 border-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] border-black px-2 py-0.5 rounded-lg">
                      Atmosphere: {rev.atmosphereRating}
                    </span>
                    <span className="bg-blue-200 border-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] border-black px-2 py-0.5 rounded-lg">
                      VFM: {rev.vfmRating}
                    </span>
                  </div>

                  <p className="text-sm font-medium text-gray-800 leading-relaxed pt-1">
                    {rev.text}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
