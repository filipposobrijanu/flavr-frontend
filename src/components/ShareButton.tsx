"use client";

import { useState } from "react";
import { useLocale } from "@/context/LocaleContext";

interface ShareButtonProps {
  restaurantName: string;
}

export default function ShareButton({ restaurantName }: ShareButtonProps) {
  const { t } = useLocale();
  const [isCopied, setIsCopied] = useState(false);

  const handleShare = async () => {
    const templateText =
      t("restaurant.share_text") || "Check out {name} on Flavr! 🍕";
    const localizedText = templateText.replace("{name}", restaurantName);

    const shareData = {
      title: `Flavr | ${restaurantName}`,
      text: localizedText,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.log("User cancelled or share failed", error);
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      } catch (err) {
        console.error("Could not copy text: ", err);
      }
    }
  };

  return (
    <button
      onClick={handleShare}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-black border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] cursor-pointer text-black ${
        isCopied ? "bg-green-400" : "bg-yellow-300"
      }`}
    >
      <span>
        {isCopied ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            fill="black"
            className="bi bi-check-circle"
            viewBox="0 0 16 16"
          >
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
            <path d="m10.97 4.97-.02.022-3.473 4.425-2.093-2.094a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            fill="black"
            className="bi bi-arrow-up-right-circle"
            viewBox="0 0 16 16"
          >
            <path
              fill-rule="evenodd"
              d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8m15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.854 10.803a.5.5 0 1 1-.708-.707L9.243 6H6.475a.5.5 0 1 1 0-1h3.975a.5.5 0 0 1 .5.5v3.975a.5.5 0 1 1-1 0V6.707z"
            />
          </svg>
        )}
      </span>
      <span className="text-md uppercase tracking-wider">
        {isCopied ? t("restaurant.copied") : t("restaurant.share")}
      </span>
    </button>
  );
}
