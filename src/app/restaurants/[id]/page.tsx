"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useLocale } from "@/context/LocaleContext";
import ImageUploadWidget from "@/components/ImageUploadWidget";
import ReviewImageGallery from "@/components/ReviewImageGallery";
import UserBadge from "@/components/UserBadge";
import ReviewComments from "@/components/ReviewComments";
import OwnerResponse from "@/components/OwnerResponse";
import { motion } from "framer-motion";
import ShareButton from "@/components/ShareButton";

interface Review {
  id: string;
  text: string;
  foodRating: number;
  serviceRating: number;
  atmosphereRating: number;
  vfmRating: number;
  images: string[];
  simpleAverage: number;
  upvotes: number;
  createdAt: string;
  ownerReply: {
    id: string;
    text: string;
    createdAt: string;
  } | null;
  comments: {
    id: string;
    text: string;
    createdAt: string;
    user: { username: string };
  }[];
  user: {
    username: string;
    _count?: {
      reviews: number;
    };
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
  imageUrl?: string;
  views: number;
  ownerId: string;
  openTime: string;
  closeTime: string;
}

export default function RestaurantDetailsPage() {
  const { t } = useLocale();
  const { id } = useParams();
  const router = useRouter();

  const [isMainImgOpen, setIsMainImgOpen] = useState(false);

  useEffect(() => {
    if (!isMainImgOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsMainImgOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMainImgOpen]);

  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);

  const [visibleReviews, setVisibleReviews] = useState(5);
  const [upvotedReviews, setUpvotedReviews] = useState<Set<string>>(new Set());
  const isOwner = currentUser?.role === "OWNER";

  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const showNotification = (message: string, type: "success" | "error") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const [text, setText] = useState("");
  const [foodRating, setFoodRating] = useState(5);
  const [serviceRating, setServiceRating] = useState(5);
  const [atmosphereRating, setAtmosphereRating] = useState(5);
  const [vfmRating, setVfmRating] = useState(5);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

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
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setCurrentUser(user);

      const savedUpvotes = localStorage.getItem(`upvoted_reviews_${user.id}`);
      if (savedUpvotes) {
        setUpvotedReviews(new Set(JSON.parse(savedUpvotes)));
      }
    }
    fetchRestaurantData();
  }, [fetchRestaurantData]);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text)
      return showNotification(
        t("restaurant_details.errors.empty_comment"),
        "error",
      );
    if (!currentUser)
      return showNotification(
        t("restaurant_details.errors.login_required"),
        "error",
      );

    try {
      let uploadedImageUrls: string[] = [];

      if (selectedFiles.length > 0) {
        const formData = new FormData();
        selectedFiles.forEach((file) => formData.append("files", file));

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (uploadRes.ok) {
          const imageUrls = await uploadRes.json();
          uploadedImageUrls = imageUrls;
        } else {
          showNotification("Αποτυχία ανεβάσματος εικόνων", "error");
          return;
        }
      }

      // Υποβολή του Review μαζί με τα images URLs
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
          images: uploadedImageUrls,
        }),
      });

      if (res.ok) {
        showNotification(t("restaurant_details.success_msg"), "success");
        setText("");
        setFoodRating(5);
        setServiceRating(5);
        setAtmosphereRating(5);
        setVfmRating(5);
        setSelectedFiles([]);
        fetchRestaurantData();
      } else {
        showNotification(t("restaurant_details.errors.submit_error"), "error");
      }
    } catch (err) {
      console.error(err);
      showNotification(t("restaurant_details.errors.submit_error"), "error");
    }
  };
  const hasIncremented = useRef(false);

  useEffect(() => {
    if (!id) return;

    const alreadyIncremented = sessionStorage.getItem(`viewed_${id}`);

    if (!alreadyIncremented) {
      const incrementViews = async () => {
        try {
          sessionStorage.setItem(`viewed_${id}`, "true");

          const res = await fetch(`/api/restaurants/${id}/view`, {
            method: "POST",
          });

          if (res.ok) {
            const data = await res.json();
            setRestaurant((prev) =>
              prev ? { ...prev, views: data.views } : null,
            );
          }
        } catch (err) {
          sessionStorage.removeItem(`viewed_${id}`);
          console.error("Failed to track view");
        }
      };

      incrementViews();
    }
  }, [id]);
  const handleUpvote = async (reviewId: string) => {
    if (!currentUser) {
      showNotification(t("restaurant_details.errors.login_required"), "error");
      return;
    }

    const isReverting = upvotedReviews.has(reviewId);

    console.log(
      "👉 CLICKED UPVOTE | reviewId:",
      reviewId,
      "| isReverting:",
      isReverting,
    );

    setRestaurant((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        reviews: prev.reviews.map((r) => {
          if (r.id === reviewId) {
            const currentUpvotes = r.upvotes ?? 0;
            return {
              ...r,
              upvotes: isReverting
                ? Math.max(0, currentUpvotes - 1)
                : currentUpvotes + 1,
            };
          }
          return r;
        }),
      };
    });

    setUpvotedReviews((prev) => {
      const newSet = new Set(prev);
      if (isReverting) {
        newSet.delete(reviewId);
      } else {
        newSet.add(reviewId);
      }

      if (currentUser?.id) {
        localStorage.setItem(
          `upvoted_reviews_${currentUser.id}`,
          JSON.stringify(Array.from(newSet)),
        );
      }
      return newSet;
    });

    try {
      const response = await fetch(`/api/reviews/${reviewId}/upvote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: isReverting ? "revert" : "upvote" }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("✅ SERVER RESPONSE:", data);
    } catch (error) {
      console.error("❌ API CALL FAILED:", error);
    }
  };
  if (loading)
    return (
      <div className="min-h-[calc(80vh-4rem)] p-6 md:p-12 text-black animate-pulse">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Back Button Skeleton */}
          <div className="h-10 w-40 bg-gray-200 rounded-xl border-2 border-black"></div>

          {/* Hero Card Skeleton */}
          <div className="bg-white p-6 md:p-8 border-4 border-black rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col md:flex-row justify-between items-start gap-6">
            <div className="space-y-3 flex-1">
              {/* Image Placeholder */}
              <div className="w-64 h-64 bg-gray-200 rounded-xl border-2 border-black mb-6"></div>
              {/* Cuisine Tag */}
              <div className="h-6 w-24 bg-gray-200 rounded-lg"></div>
              {/* Title */}
              <div className="h-10 w-3/4 bg-gray-200 rounded-lg"></div>
              {/* Address */}
              <div className="h-4 w-1/3 bg-gray-200 rounded-md"></div>
              {/* Description */}
              <div className="space-y-2 pt-4 border-t-2 border-black border-dashed">
                <div className="h-4 w-full bg-gray-200 rounded"></div>
                <div className="h-4 w-2/3 bg-gray-200 rounded"></div>
              </div>
              {/* Hours */}
              <div className="h-10 w-48 bg-gray-200 rounded-xl mt-4"></div>
            </div>

            {/* Sidebar Meta Info (Views/Share) */}
            <div className="flex flex-col gap-4">
              <div className="h-6 w-20 bg-gray-200 rounded"></div>
              <div className="h-10 w-32 bg-gray-200 rounded-xl"></div>
            </div>

            {/* Score Badge Skeleton */}
            <div className="h-[140px] w-full md:w-[180px] bg-gray-200 border-4 border-black rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"></div>
          </div>

          {/* Form & Reviews Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Sidebar Form Skeleton */}
            <div className="h-[450px] w-full bg-white border-4 border-black rounded-2xl p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
              <div className="h-8 w-1/2 bg-gray-200 rounded mb-6"></div>
              <div className="space-y-6">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-12 w-full bg-gray-200 rounded-lg"
                  ></div>
                ))}
              </div>
            </div>

            {/* Reviews List Skeleton */}
            <div className="lg:col-span-2 space-y-4">
              <div className="h-8 w-48 bg-gray-200 rounded-lg"></div>
              <div className="h-40 w-full bg-white border-2 border-b-4 border-black rounded-2xl p-5 space-y-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
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
          {t("restaurant_details.notFound")}
        </p>
        <Link
          href="/restaurants"
          className="border-2 border-black bg-yellow-400 px-4 py-2 font-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
        >
          {t("restaurant_details.back_btn")}
        </Link>
      </div>
    );
  const sortedReviews = [...(restaurant.reviews || [])].sort(
    (a, b) => (b.upvotes || 0) - (a.upvotes || 0),
  );
  const displayedReviews = sortedReviews.slice(0, visibleReviews);
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="min-h-[calc(80vh-4rem)] p-6 md:p-12 text-black"
    >
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
          {t("restaurant_details.back_btn")}
        </Link>

        {/* 🏛️ Κεντρικό Card Εστιατορίου */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="bg-white p-6 md:p-8 border-4 border-black rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col md:flex-row justify-between items-start gap-6"
        >
          <div className="space-y-3 flex-1">
            {restaurant.imageUrl && (
              <>
                <img
                  src={restaurant.imageUrl}
                  alt={restaurant.name}
                  onClick={() => setIsMainImgOpen(true)}
                  className="w-64 h-64 object-cover rounded-xl border-2 border-black mb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all cursor-zoom-in bg-gray-100"
                />

                {isMainImgOpen && (
                  <div className="fixed inset-0 z-[100] h-screen flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-fade-in animate-duration-200">
                    {/* Κουμπί Κλεισίματος */}
                    <button
                      onClick={() => setIsMainImgOpen(false)}
                      className="absolute top-6 right-6 z-[110] bg-red-500 text-black border-2 border-black font-black p-2 rounded-xl text-sm uppercase shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer"
                      title="Close (ESC)"
                    >
                      {t("restaurant_details.close_button")}
                    </button>

                    <div
                      className="relative max-w-4xl max-h-[100vh] flex items-center justify-center border-4 border-black bg-zinc-900 p-2 rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <img
                        src={restaurant.imageUrl}
                        alt={restaurant.name}
                        className="max-w-full max-h-[80vh] object-contain rounded-lg select-none"
                      />
                    </div>

                    <div
                      className="absolute inset-0 w-full h-full -z-10 cursor-zoom-out"
                      onClick={() => setIsMainImgOpen(false)}
                    />
                  </div>
                )}
              </>
            )}
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
            <div className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-xl font-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] w-fit mb-6">
              <span className="text-sm">
                {t("filters.open")} - {t("filters.closed")}
              </span>
              <span className="text-sm">
                {restaurant.openTime} - {restaurant.closeTime}
              </span>
            </div>
          </div>
          <div className="text-md font-bold text-gray-700 mt-2 flex gap-1 items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-eye"
              viewBox="0 0 16 16"
            >
              <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z" />
              <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0" />
            </svg>{" "}
            {restaurant.views}
          </div>
          <ShareButton restaurantName={restaurant.name} />
          <div className="bg-yellow-400 border-4 border-black  p-6 rounded-2xl text-center shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] min-w-[180px] w-full md:w-auto shrink-0">
            <p className="text-xs font-black uppercase tracking-wider text-black">
              Bayesian Score
            </p>
            <p className="text-4xl font-black mt-1 text-black text-center justify-center flex items-center gap-2">
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
                : t("restaurant_details.new")}
            </p>
            <div className="text-[11px] mt-3 font-black uppercase border-t border-black pt-2 text-black opacity-90">
              {restaurant.reviews.length}{" "}
              {t("restaurant_details.reviews_count")}
            </div>
          </div>
        </motion.div>

        {/* Κάτω Πλέγμα: Φόρμα & Κριτικές */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start"
        >
          {/* ✍️ Φόρμα Κριτικής */}
          <div className="lg:col-span-1">
            {currentUser?.role === "REVIEWER" ? (
              <div className="bg-white p-6 border-4 border-black rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] sticky top-6">
                <h2 className="text-xl font-black uppercase tracking-tight mb-4 text-black border-b-2 border-black pb-2">
                  {t("restaurant_details.write_review")}
                </h2>
                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  {/* Multi-Criteria Σύρτες */}
                  {[
                    {
                      label: t("restaurant_details.form.food"),
                      val: foodRating,
                      set: setFoodRating,
                    },
                    {
                      label: t("restaurant_details.form.service"),
                      val: serviceRating,
                      set: setServiceRating,
                    },
                    {
                      label: t("restaurant_details.form.atmosphere"),
                      val: atmosphereRating,
                      set: setAtmosphereRating,
                    },
                    {
                      label: t("restaurant_details.form.vfm_label"),
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
                      {t("restaurant_details.comment")}
                    </label>
                    <textarea
                      className="w-full p-3 border-2 border-black rounded-xl font-bold bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:translate-x-[1px] focus:translate-y-[1px] focus:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all placeholder:text-gray-400 text-black h-24 resize-none text-sm"
                      placeholder="How was your experience?"
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                    />
                  </div>

                  <div className="pt-2">
                    <ImageUploadWidget
                      onImagesSelected={(files) => setSelectedFiles(files)}
                    />
                  </div>
                  {/* Neobrutalist Submit Button */}
                  <button type="submit" className="w-full button-main">
                    <span
                      style={{ backgroundColor: "#50A2FF" }}
                      className="button_top block px-3 py-2.5 text-center font-black uppercase"
                    >
                      {t("restaurant_details.submit_a_review")}
                    </span>
                  </button>
                </form>
              </div>
            ) : (
              <div className="bg-white p-6 border-4 border-dashed border-black rounded-2xl text-center font-black text-sm text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                {currentUser
                  ? t("restaurant_details.only_users")
                  : t("restaurant_details.login_required")}
              </div>
            )}
          </div>

          {/* 💬 Λίστα Κριτικών */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-2xl font-black text-white uppercase tracking-tight [-webkit-text-stroke:4px_black] [paint-order:stroke_fill] text-left">
              {t("restaurant_details.reviews_title")} (
              {restaurant.reviews.length})
            </h2>

            {restaurant.reviews.length === 0 ? (
              <div className="text-center py-12 border-4 px-4 border-dashed border-black rounded-2xl bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <p className="font-black text-xl">
                  {t("restaurant_details.no_reviews")}
                </p>
                <p className="text-sm text-gray-500 font-bold mt-1">
                  {t("restaurant_details.be_the_first")}
                </p>
              </div>
            ) : (
              <>
                {/* Εδώ χρησιμοποιούμε το displayedReviews (που περιλαμβάνει το slice) */}
                {displayedReviews.map((rev) => (
                  <motion.div
                    key={rev.id}
                    initial={{ scale: 0.95, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    className="bg-white p-5 border-2 border-b-4 border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-3"
                  >
                    <div className="flex justify-between items-start border-b-2 border-black pb-2 gap-2">
                      <div>
                        <span className="font-black text-gray-900 block text-base flex items-center gap-2">
                          {rev.user?.username || "Anonymous"}
                          <UserBadge
                            reviewCount={rev.user?._count?.reviews ?? 0}
                          />
                        </span>
                        <span className="text-xs text-gray-500 font-bold">
                          {new Date(rev.createdAt).toLocaleDateString("el-GR")}
                        </span>
                      </div>
                      <span className="bg-blue-400 border-2 border-black text-black text-xs font-black px-2.5 py-1 rounded-lg shrink-0 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                        {t("restaurant_details.avg_label")}{" "}
                        {rev.simpleAverage.toFixed(1)}/5
                      </span>
                    </div>

                    {/* Sub-ratings Badges */}
                    <div className="flex flex-wrap gap-2 text-[11px] font-black uppercase">
                      <span className="bg-blue-200 border-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] border-black px-2 py-0.5 rounded-lg">
                        {t("restaurant_details.form.food")}: {rev.foodRating}
                      </span>
                      <span className="bg-blue-200 border-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] border-black px-2 py-0.5 rounded-lg">
                        {t("restaurant_details.form.service")}:{" "}
                        {rev.serviceRating}
                      </span>
                      <span className="bg-blue-200 border-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] border-black px-2 py-0.5 rounded-lg">
                        {t("restaurant_details.form.atmosphere")}:{" "}
                        {rev.atmosphereRating}
                      </span>
                      <span className="bg-blue-200 border-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] border-black px-2 py-0.5 rounded-lg">
                        {t("restaurant_details.form.vfm_label")}:{" "}
                        {rev.vfmRating}
                      </span>
                    </div>

                    <p className="text-sm font-medium text-gray-800 leading-relaxed pt-1">
                      {rev.text}
                    </p>
                    <ReviewImageGallery images={rev.images} />

                    <div className="pt-3 border-t-2 border-gray-100 flex justify-end">
                      <button
                        onClick={() => handleUpvote(rev.id)}
                        disabled={upvotedReviews.has(rev.id)}
                        className={`flex items-center cursor-pointer gap-1 text-xs flex gap-0 font-black px-3 py-1.5 border-2 border-black rounded-lg transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${
                          upvotedReviews.has(rev.id)
                            ? "bg-green-400 text-black translate-x-[1px] translate-y-[1px] shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
                            : "bg-gray-100 text-gray-700 hover:bg-green-300 hover:-translate-y-0.5"
                        }`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
                          fill="currentColor"
                          className="bi bi-hand-thumbs-up"
                          viewBox="0 0 16 16"
                        >
                          <path d="M8.864.046C7.908-.193 7.02.53 6.956 1.466c-.072 1.051-.23 2.016-.428 2.59-.125.36-.479 1.013-1.04 1.639-.557.623-1.282 1.178-2.131 1.41C2.685 7.288 2 7.87 2 8.72v4.001c0 .845.682 1.464 1.448 1.545 1.07.114 1.564.415 2.068.723l.048.03c.272.165.578.348.97.484.397.136.861.217 1.466.217h3.5c.937 0 1.599-.477 1.934-1.064a1.86 1.86 0 0 0 .254-.912c0-.152-.023-.312-.077-.464.201-.263.38-.578.488-.901.11-.33.172-.762.004-1.149.069-.13.12-.269.159-.403.077-.27.113-.568.113-.857 0-.288-.036-.585-.113-.856a2 2 0 0 0-.138-.362 1.9 1.9 0 0 0 .234-1.734c-.206-.592-.682-1.1-1.2-1.272-.847-.282-1.803-.276-2.516-.211a10 10 0 0 0-.443.05 9.4 9.4 0 0 0-.062-4.509A1.38 1.38 0 0 0 9.125.111zM11.5 14.721H8c-.51 0-.863-.069-1.14-.164-.281-.097-.506-.228-.776-.393l-.04-.024c-.555-.339-1.198-.731-2.49-.868-.333-.036-.554-.29-.554-.55V8.72c0-.254.226-.543.62-.65 1.095-.3 1.977-.996 2.614-1.708.635-.71 1.064-1.475 1.238-1.978.243-.7.407-1.768.482-2.85.025-.362.36-.594.667-.518l.262.066c.16.04.258.143.288.255a8.34 8.34 0 0 1-.145 4.725.5.5 0 0 0 .595.644l.003-.001.014-.003.058-.014a9 9 0 0 1 1.036-.157c.663-.06 1.457-.054 2.11.164.175.058.45.3.57.65.107.308.087.67-.266 1.022l-.353.353.353.354c.043.043.105.141.154.315.048.167.075.37.075.581 0 .212-.027.414-.075.582-.05.174-.111.272-.154.315l-.353.353.353.354c.047.047.109.177.005.488a2.2 2.2 0 0 1-.505.805l-.353.353.353.354c.006.005.041.05.041.17a.9.9 0 0 1-.121.416c-.165.288-.503.56-1.066.56z" />
                        </svg>
                        Helpful ({rev.upvotes || 0})
                      </button>
                    </div>
                    <ReviewComments
                      reviewId={rev.id}
                      initialComments={rev.comments ?? []}
                      currentUserId={currentUser?.id || ""}
                    />
                    {isOwner && restaurant.ownerId === currentUser.id && (
                      <OwnerResponse
                        reviewId={rev.id}
                        initialReply={rev.ownerReply}
                        userRole={currentUser?.role || "USER"} // 👈 Περνάμε το ρόλο του τωρινού χρήστη
                        currentUserId={currentUser?.id || ""}
                      />
                    )}
                  </motion.div>
                ))}

                {/* 🔘 Το Κουμπί Load More ΜΕΣΑ στο col-span-2 */}
                {visibleReviews < restaurant.reviews.length && (
                  <div className="flex justify-center pt-4">
                    <button
                      onClick={() => setVisibleReviews((prev) => prev + 5)}
                      className="bg-yellow-400 border-4 border-black px-6 py-3 font-black text-black uppercase tracking-wider rounded-xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] transition-all"
                    >
                      {t("restaurant_details.load_more_reviews") ||
                        "Load More Reviews"}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
          {/* 👈 ΠΡΟΣΘΗΚΗ: Κουμπί Load More */}
          {visibleReviews < restaurant.reviews.length && (
            <div className="flex justify-center pt-6">
              <button
                onClick={() => setVisibleReviews((prev) => prev + 5)}
                className="bg-yellow-400 border-4 border-black px-6 py-3 font-black text-black uppercase tracking-wider rounded-xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] transition-all"
              >
                Load More Reviews
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
