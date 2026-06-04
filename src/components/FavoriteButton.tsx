"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface FavoriteButtonProps {
  restaurantId: string;
  initialIsFavorite: boolean;
}

export default function FavoriteButton({
  restaurantId,
  initialIsFavorite,
}: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault(); // Για να μην κάνει trigger τυχόν Link γύρω από την κάρτα
    if (loading) return;

    setLoading(true);
    try {
      const res = await fetch("/api/restaurants/favorite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ restaurantId }),
      });

      if (res.status === 401) {
        // Αν δεν είναι συνδεδεμένος, τον στέλνουμε login
        router.push("/login");
        return;
      }

      if (res.ok) {
        const data = await res.json();
        setIsFavorite(data.isFavorite);
        router.refresh(); // Ανανέωση των server δεδομένων στο παρασκήνιο
      }
    } catch (error) {
      console.error("Failed to toggle favorite", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`p-2 rounded-xl cursor-pointer border-2 border-black font-black text-xl transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] ${
        isFavorite
          ? "bg-red-500 hover:bg-red-400 text-black"
          : "bg-white text-black hover:bg-gray-200"
      }`}
    >
      {isFavorite ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          fill="currentColor"
          className="bi bi-heart"
          viewBox="0 0 16 16"
        >
          <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143q.09.083.176.171a3 3 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15" />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          fill="currentColor"
          className="bi bi-heart"
          viewBox="0 0 16 16"
        >
          <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143q.09.083.176.171a3 3 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15" />
        </svg>
      )}
    </button>
  );
}
