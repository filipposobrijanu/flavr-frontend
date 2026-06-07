"use client";

import { useState, useEffect } from "react";
import { useLocale } from "@/context/LocaleContext";

interface ReviewImageGalleryProps {
  images: string[];
}

export default function ReviewImageGallery({
  images,
}: ReviewImageGalleryProps) {
  const { t } = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Διαχείριση πλήκτρων (ArrowLeft, ArrowRight, Escape)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, currentIndex]);

  if (!images || images.length === 0) return null;

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setIsOpen(true);
  };

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="mt-4">
      {/* Φωτογραφίες σε Grid στυλ */}
      <div className="flex flex-wrap gap-3">
        {images.map((url, idx) => (
          <div
            key={idx}
            onClick={() => openLightbox(idx)}
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

      {/* 🌌 LIGHTBOX MODAL */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/90 z-[60] flex items-center justify-center p-4 backdrop-blur-sm animate-fadeIn"
          onClick={() => setIsOpen(false)}
        >
          {/* Κουμπί Κλεισίματος */}
          <button
            onClick={() => setIsOpen(false)}
            className="absolute cursor-pointer top-6 right-6 z-[70] bg-red-500 border-2 border-black text-black px-4 py-2 font-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] transition-all"
          >
            {t("restaurant_details.close_button")}
          </button>

          {/* Container Εικόνας & Controls */}
          <div
            className="relative flex items-center justify-center max-w-5xl w-full h-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Βελάκι Αριστερά */}
            {images.length > 1 && (
              <button
                onClick={handlePrev}
                className="absolute left-2 md:left-4 z-[70] bg-white border-2 border-black p-3 rounded-full font-black text-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-yellow-300"
              >
                ◀
              </button>
            )}

            {/* Εικόνα */}
            <div className="bg-white p-2 border-4 border-black rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
              <img
                src={images[currentIndex]}
                alt="Full screen"
                className="max-h-[80vh] max-w-full object-contain rounded-2xl"
              />
              {/* Counter */}
              <div className="text-center font-black mt-2 text-sm uppercase">
                {currentIndex + 1} / {images.length}
              </div>
            </div>

            {/* Βελάκι Δεξιά */}
            {images.length > 1 && (
              <button
                onClick={handleNext}
                className="absolute right-2 md:right-4 z-[70] bg-white border-2 border-black p-3 rounded-full font-black text-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-yellow-300"
              >
                ▶
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
