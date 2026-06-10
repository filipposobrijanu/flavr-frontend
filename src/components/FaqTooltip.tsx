"use client";
import { useState } from "react";
import { useLocale } from "@/context/LocaleContext";
import { motion, AnimatePresence } from "framer-motion";

export default function FaqTooltip() {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useLocale();

  const faqs = [
    { q: t("faq.questions.q1"), a: t("faq.questions.a1") },
    { q: t("faq.questions.q2"), a: t("faq.questions.a2") },
    { q: t("faq.questions.q3"), a: t("faq.questions.a3") },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="tooltip"
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{
              type: "tween",
              duration: 0.2,
              ease: [0.23, 1, 0.32, 1],
            }}
            className="mb-4 w-72 bg-white border-3 border-black p-5 rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] animate-in fade-in zoom-in duration-200"
          >
            <h3 className="font-black text-black text-lg mb-3 uppercase tracking-wider flex items-center gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-lightbulb"
                viewBox="0 0 16 16"
              >
                <path d="M2 6a6 6 0 1 1 10.174 4.31c-.203.196-.359.4-.453.619l-.762 1.769A.5.5 0 0 1 10.5 13a.5.5 0 0 1 0 1 .5.5 0 0 1 0 1l-.224.447a1 1 0 0 1-.894.553H6.618a1 1 0 0 1-.894-.553L5.5 15a.5.5 0 0 1 0-1 .5.5 0 0 1 0-1 .5.5 0 0 1-.46-.302l-.761-1.77a2 2 0 0 0-.453-.618A5.98 5.98 0 0 1 2 6m6-5a5 5 0 0 0-3.479 8.592c.263.254.514.564.676.941L5.83 12h4.342l.632-1.467c.162-.377.413-.687.676-.941A5 5 0 0 0 8 1" />
              </svg>
              {t("faq.title")}
            </h3>
            <div className="space-y-4">
              {faqs.map((item, i) => (
                <div
                  key={i}
                  className="border-b border-black/10 pb-2 last:border-0"
                >
                  <p className="font-black text-sm text-blue-500 mb-1">
                    {item.q}
                  </p>
                  <p className="text-xs font-bold text-gray-700 leading-tight">
                    {item.a}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Trigger Button */}
      <motion.button
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.96 }}
        onClick={() => setIsOpen(!isOpen)}
        className={` ${isOpen ? "bg-red-500" : "bg-gray-200"} cursor-pointer text-black px-3 py-2 font-black rounded-2xl border-2 border-black shadow-[3px_3px_0px_0px_black] hover:translate-y-[-2px] transition-all`}
      >
        {isOpen ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="white"
            className="bi bi-x-circle"
            viewBox="0 0 16 16"
          >
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="black"
            className="bi bi-question-circle-fill"
            viewBox="0 0 16 16"
          >
            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.496 6.033h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286a.237.237 0 0 0 .241.247m2.325 6.443c.61 0 1.029-.394 1.029-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94 0 .533.425.927 1.01.927z" />
          </svg>
        )}
      </motion.button>
    </div>
  );
}
