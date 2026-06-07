"use client";

import { useState } from "react";
import { useLocale } from "@/context/LocaleContext";

interface Reply {
  id: string;
  text: string;
  createdAt: string;
}

interface OwnerResponseProps {
  reviewId: string;
  initialReply: Reply | null;
  userRole: string; // "USER" ή "OWNER"
  currentUserId: string;
}

export default function OwnerResponse({
  reviewId,
  initialReply,
  userRole,
  currentUserId,
}: OwnerResponseProps) {
  const { t } = useLocale();
  const [reply, setReply] = useState<Reply | null>(initialReply);
  const [text, setText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/reviews/${reviewId}/owner-reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, userId: currentUserId }),
      });

      if (res.ok) {
        const data = await res.json();
        setReply(data);
        setText("");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Αν δεν υπάρχει απάντηση και ο χρήστης ΔΕΝ είναι Owner, δεν δείχνουμε τίποτα
  if (!reply && userRole !== "OWNER") return null;

  return (
    <div className="mt-4 pl-4">
      {reply ? (
        // Εμφάνιση της επίσημης απάντησης
        <div className="bg-purple-50 border-2 border-purple-900 p-4 rounded-xl shadow-[4px_4px_0px_0px_rgba(147,51,234,1)]">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-black uppercase tracking-wider text-purple-700 flex items-center gap-1">
              {t("reviews.owner_badge")}
            </span>
            <span className="text-[10px] text-gray-500 font-bold">
              {new Date(reply.createdAt).toLocaleDateString()}
            </span>
          </div>
          <p className="text-sm font-bold text-gray-950 italic">
            "{reply.text}"
          </p>
        </div>
      ) : (
        // Φόρμα απάντησης μόνο για τον Owner
        <form
          onSubmit={handleSubmit}
          className="bg-gray-50 border-2 border-dashed border-black p-3 rounded-xl space-y-2"
        >
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={t("reviews.reply_placeholder")}
            rows={2}
            className="w-full p-2 text-sm bg-white border-2 border-black rounded-lg focus:outline-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-medium"
          />
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-3 py-1.5 bg-purple-400 text-black border-2 border-black rounded-lg font-black text-xs uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? "..." : t("reviews.reply_btn")}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
