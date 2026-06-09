"use client";

import { useState } from "react";
import Image from "next/image";
import { useLocale } from "@/context/LocaleContext";

interface ImageUploadWidgetProps {
  onImagesSelected: (files: File[]) => void;
}

export default function ImageUploadWidget({
  onImagesSelected,
}: ImageUploadWidgetProps) {
  const { t } = useLocale();
  const [previews, setPreviews] = useState<string[]>([]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const files = Array.from(e.target.files);

    onImagesSelected(files);

    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setPreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeImage = (indexToRemove: number) => {
    setPreviews((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  return (
    <div className="space-y-4">
      <label className="block  font-black uppercase tracking-tight text-black flex gap-2 items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          className="bi bi-card-image"
          viewBox="0 0 16 16"
        >
          <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0" />
          <path d="M1.5 2A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2zm13 1a.5.5 0 0 1 .5.5v6l-3.775-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12v.54L1 12.5v-9a.5.5 0 0 1 .5-.5z" />
        </svg>{" "}
        {t("restaurant_details.add_images")}
      </label>

      <div className="flex flex-wrap gap-4 mb-8 items-center">
        {/* Neobrutalist Κουμπί Επιλογής */}
        <label className="cursor-pointer bg-orange-400 border-2 border-black px-3 py-2 font-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] transition-all inline-flex items-center gap-2 text-sm text-black">
          <span>{t("restaurant_details.select_images")}</span>
          <input
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
        </label>

        <div className="flex flex-wrap gap-3">
          {previews.map((src, index) => (
            <div
              key={index}
              className="relative w-20 h-20 border-2 border-black rounded-xl overflow-hidden shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] bg-white group"
            >
              <img
                src={src}
                alt={`Preview ${index}`}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-1 cursor-pointer right-1 bg-red-500 text-white border border-black rounded-md w-5 h-5 flex items-center justify-center font-black text-xs shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:bg-red-600"
              >
                X
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
