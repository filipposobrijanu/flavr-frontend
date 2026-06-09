"use client";

import Link from "next/link";
import { useLocale } from "@/context/LocaleContext";
import { motion } from "framer-motion";
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
} as const;
export default function AboutPage() {
  const { t } = useLocale();
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-[calc(80vh-4rem)] p-6 md:p-12 text-black"
    >
      <title>About | Flavr</title>
      <motion.div
        variants={itemVariants}
        className="max-w-4xl mx-auto space-y-12"
      >
        {/* Κουμπί Επιστροφής */}
        <Link
          href="/"
          className="inline-block font-black inline-flex gap-2 text-md uppercase tracking-wider border-2 border-black bg-gray-200 px-4 py-2 rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
        >
          {t("about.back")}
        </Link>

        {/* 🍕 Κεντρικό Hero Section */}
        <div
          style={{ backgroundColor: "#FE2120" }}
          className="relative border-4 border-black p-6 rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
        >
          <div className="absolute right-4 bottom-0 text-4xl opacity-20 pointer-events-none font-black select-none hidden sm:block">
            {t("about.hero_watermark")}
          </div>
          <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-white">
            {t("about.hero_title")}
          </h1>
        </div>

        {/* 🎯 Η Φιλοσοφία μας (Problem & Solution) */}
        <div className="bg-white p-6 md:p-8 border-2 border-black rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-4">
          <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-black">
            {t("about.phil_title")}
          </h2>
          <div className="text-sm md:text-base font-medium text-gray-800 space-y-4 border-t-2 border-black pt-4 leading-relaxed">
            <p>
              {t("about.phil_p1_1")}{" "}
              <span className="font-black bg-yellow-300 px-1">
                {t("about.phil_p1_h1")}
              </span>{" "}
              {t("about.phil_p1_2")}{" "}
              <span className="font-black bg-red-300 px-1">
                {t("about.phil_p1_h2")}
              </span>
              {t("about.phil_p1_3")}
            </p>
            <p>
              {t("about.phil_p2_1")}{" "}
              <strong className="font-black text-black uppercase">
                {t("about.phil_p2_strong")}
              </strong>
              {t("about.phil_p2_2")}
            </p>
          </div>
        </div>

        {/* 🛠️ Core Features Grid */}
        <div className="space-y-4">
          <h3 className="text-2xl font-black text-white uppercase tracking-tight [-webkit-text-stroke:4px_black] [paint-order:stroke_fill]">
            {t("about.hiw_title")}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Feature 1 */}
            <div className="bg-white p-6 border-2 border-black rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-2">
              <h4 className="text-xl font-black uppercase tracking-tight">
                Global Bayesian Score
              </h4>
              <p className="text-sm text-gray-700 font-medium leading-relaxed">
                {t("about.f1_text")}
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-6 border-2 border-black rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-2">
              <h4 className="text-xl font-black uppercase tracking-tight">
                {t("about.f2_title")}
              </h4>
              <p className="text-sm text-gray-700 font-medium leading-relaxed">
                {t("about.f2_text")}
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-6 border-2 border-black rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-2">
              <h4 className="text-xl font-black uppercase tracking-tight">
                {t("about.f3_title")}
              </h4>
              <p className="text-sm text-gray-700 font-medium leading-relaxed">
                {t("about.f3_text")}
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white p-6 border-2 border-black rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-2">
              <h4 className="text-xl font-black uppercase tracking-tight">
                {t("about.f4_title")}
              </h4>
              <p className="text-sm text-gray-700 font-medium leading-relaxed">
                {t("about.f4_text")}
              </p>
            </div>
          </div>
        </div>

        {/* 💻 Tech Stack Sticker */}
        <div className="bg-yellow-400 border-2 border-black p-6 rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-center space-y-2">
          <p className="text-xs font-black uppercase tracking-wider text-black">
            {t("about.tech_p1")}
          </p>
          <p className="text-sm md:text-base font-black text-black tracking-wide uppercase">
            {t("about.tech_p2")}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
