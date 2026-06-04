"use client";

import { useState } from "react";
import { useLocale } from "@/context/LocaleContext";

interface ReviewImageGalleryProps {
  images: string[];
}

export default function ReviewImageGallery({
  images,
}: ReviewImageGalleryProps) {
  const { t } = useLocale();
  const [activeImage, setActiveImage] = useState<string | null>(null);

  if (!images || images.length === 0) return null;

  return (
    <div className="mt-4">
      {/* Φωτογραφίες σε Grid στυλ */}
      <div className="flex flex-wrap gap-3">
        {images.map((url, idx) => (
          <div
            key={idx}
            onClick={() => setActiveImage(url)}
            className="cursor-pointer border-2 border-black rounded-xl overflow-hidden w-24 h-24 md:w-28 md:h-28 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all bg-white"
          >
            <img
              src={url}
              alt={t("restaurant_details.review_image_alt")}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
            />
          </div>
        ))}
      </div>

      {/* 🌌 LIGHTBOX MODAL: Ανοίγει σε full screen όταν πατάς μια φωτό */}
      {activeImage && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fadeIn"
          onClick={() => setActiveImage(null)}
        >
          <div
            className="bg-white border-4 border-black p-2 rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] max-w-3xl max-h-[85vh] relative overflow-hidden"
            onClick={(e) => e.stopPropagation()} // Σταματάει το κλείσιμο αν πατήσεις πάνω στη φωτό
          >
            <img
              src={activeImage}
              alt={t("restaurant_details.fullscreen_image_alt")}
              className="max-w-full max-h-[75vh] rounded-2xl object-contain border-2 border-black"
            />
            {/* Κλείσιμο Κουμπί */}
            <button
              onClick={() => setActiveImage(null)}
              className="absolute cursor-pointer top-4 right-4 bg-red-500 border-2 border-black text-black px-3 py-1 font-black rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:bg-red-600 transition-all text-sm"
            >
              {t("restaurant_details.close_button")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
