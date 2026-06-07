"use client";

import { useState } from "react";
import { useLocale } from "@/context/LocaleContext";

interface Comment {
  id: string;
  text: string;
  createdAt: string;
  user: {
    username: string;
  };
}

interface ReviewCommentsProps {
  reviewId: string;
  initialComments: Comment[];
  currentUserId: string; // Χρειάζεται για να ξέρουμε ποιος γράφει το σχόλιο
}

export default function ReviewComments({
  reviewId,
  initialComments,
  currentUserId,
}: ReviewCommentsProps) {
  const { t } = useLocale();
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showComments, setShowComments] = useState(false); // Toggle για να μην πιάνουν χώρο

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/reviews/${reviewId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: newComment, userId: currentUserId }),
      });

      if (res.ok) {
        const addedComment = await res.json();
        setComments((prev) => [...prev, addedComment]); // Άμεσο update στο UI (Optimistic/State update)
        setNewComment("");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-4 pt-4 border-t-2 border-dashed border-gray-200">
      {/* Κουμπί Toggle Σχολίων */}
      <button
        onClick={() => setShowComments(!showComments)}
        className="text-xs font-black uppercase tracking-wider text-gray-600 hover:text-black flex items-center gap-1 cursor-pointer"
      >
        💬 {t("reviews.comments_title")} ({comments.length}){" "}
        {showComments ? "▲" : "▼"}
      </button>

      {showComments && (
        <div className="mt-4 space-y-3 pl-4 md:pl-6 border-l-4 border-black">
          {/* Λίστα Σχολίων */}
          {comments.length === 0 ? (
            <p className="text-xs text-gray-500 font-medium italic">
              {t("reviews.no_comments")}
            </p>
          ) : (
            comments.map((comment) => (
              <div
                key={comment.id}
                className="bg-gray-50 border-2 border-black p-3 rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-black text-black">
                    @{comment.user.username}
                  </span>
                  <span className="text-[10px] text-gray-500 font-bold">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm font-medium text-gray-800">
                  {comment.text}
                </p>
              </div>
            ))
          )}

          {/* Φόρμα Υποβολής */}
          <form
            onSubmit={handleSubmit}
            className="flex gap-2 pt-2 items-center"
          >
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder={t("reviews.write_comment")}
              className="flex-1 px-3 py-2 text-sm bg-white border-2 border-black rounded-xl focus:outline-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-medium"
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-yellow-400 border-2 border-black rounded-xl font-black text-xs uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] disabled:opacity-50 cursor-pointer text-black"
            >
              {isSubmitting ? "..." : t("reviews.post_btn")}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
