"use client";

import Image from "next/image";
import Link from "next/link";
import rest_Image from "../../../assets/ideativas-tlm-orange-juice-8029139_1920.png";
import FavoriteButton from "@/components/FavoriteButton";
import { useLocale } from "@/context/LocaleContext";
import { motion, AnimatePresence } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 100 },
  },
} as const;
interface FavoritesClientProps {
  initialFavorites: any[];
}

export default function FavoritesClient({
  initialFavorites,
}: FavoritesClientProps) {
  const { t } = useLocale();

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-[calc(80vh-4rem)] p-6 md:p-12 text-black"
    >
      <div className="max-w-6xl mx-auto">
        <Link
          href="/restaurants"
          className="inline-block mb-8 font-black inline-flex gap-2 text-md uppercase tracking-wider border-2 border-black bg-gray-200  px-4 py-2 rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
        >
          {t("favorites.back")}
        </Link>
        <div className="mb-8">
          <h2 className="text-4xl md:text-5xl text-white items-center inline-flex gap-3 [-webkit-text-stroke:5px_black] [paint-order:stroke_fill] tracking-tight uppercase ">
            <Image
              priority
              src={rest_Image}
              alt="Orange Juice Illustration"
              className="object-contain border-2 w-16 h-16 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rounded-2xl bg-red-500 p-1"
            />
            {t("favorites.title") || "My Favorites"}
          </h2>
        </div>

        {initialFavorites.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, rotate: -2 }}
            animate={{ opacity: 1, rotate: -1 }}
            className="text-center py-16 px-4 border-4 border-dashed border-black rounded-3xl bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] max-w-xl mx-auto transform -rotate-1"
          >
            <h3 className="font-black text-2xl mb-2 uppercase">
              {t("favorites.no_favorites") || "Δεν βρέθηκαν αγαπημένα"}
            </h3>
            <p className="font-semibold text-gray-600 mb-6 px-4">
              {t("favorites.explore_prompt") ||
                "Εξερεύνησε τα εστιατόρια της κοινότητας και πάτα την καρδιά για να τα δεις εδώ!"}
            </p>
            <Link href="/restaurants">
              <button className="button-main">
                <span
                  style={{ backgroundColor: "#22C55E", color: "black" }}
                  className="button_top px-4 py-2 font-black border-2 border-black rounded-lg"
                >
                  {t("favorites.explore_btn") || "ΕΞΕΡΕΥΝΗΣΗ ΕΣΤΙΑΤΟΡΙΩΝ"}
                </span>
              </button>
            </Link>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {initialFavorites.map(({ restaurant }) => {
              const isFavorite = restaurant.favorites.length > 0;

              return (
                <AnimatePresence>
                  <motion.div
                    key={restaurant.id}
                    variants={cardVariants}
                    whileHover={{ y: -5 }}
                    className="relative bg-white border-2 border-b-4 border-black p-6 rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all"
                  >
                    <div>
                      {restaurant.imageUrl && (
                        <div className="w-full h-40 mb-4 overflow-hidden rounded-xl border-2 border-black">
                          <img
                            src={restaurant.imageUrl}
                            alt={restaurant.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}

                      <div className="flex justify-between items-start gap-2 mb-3">
                        <h2 className="text-2xl font-black tracking-tight text-black line-clamp-1">
                          {restaurant.name}
                        </h2>

                        <div className="flex items-center  gap-2">
                          <span className="bg-yellow-400 border-2 border-black font-black px-2.5 py-1 rounded-lg text-xs tracking-wide shrink-0 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center gap-1">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="12"
                              height="12"
                              fill="black"
                              className="bi bi-star"
                              viewBox="0 0 16 16"
                            >
                              <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.56.56 0 0 0-.163-.505L1.71 6.745l4.052-.576a.53.53 0 0 0 .393-.288L8 2.223l1.847 3.658a.53.53 0 0 0 .393.288l4.052.575-2.906 2.77a.56.56 0 0 0-.163.506l.694 3.957-3.686-1.894a.5.5 0 0 0-.461 0z" />
                            </svg>{" "}
                            {restaurant.globalBayesianScore > 0
                              ? Number(restaurant.globalBayesianScore).toFixed(
                                  1,
                                )
                              : t("restaurant_details.new")}
                          </span>
                          <div className="">
                            <FavoriteButton
                              restaurantId={restaurant.id}
                              initialIsFavorite={isFavorite}
                            />
                          </div>
                        </div>
                      </div>

                      <p className="text-xs font-black uppercase tracking-wider text-blue-500 mb-4">
                        {restaurant.cuisineType} •{" "}
                        <span className="text-gray-600 normal-case font-bold">
                          {restaurant.address}
                        </span>
                      </p>

                      <p className="text-sm font-medium text-black line-clamp-3 leading-relaxed mb-6">
                        {restaurant.description}
                      </p>
                    </div>

                    <Link
                      href={`/restaurants/${restaurant.id}`}
                      className="w-full block"
                    >
                      <button className="w-full button-main">
                        <span
                          style={{ backgroundColor: "#50A2FF" }}
                          className="button_top px-3 py-2 font-black"
                        >
                          {t("favorites.view_btn") || "ΠΡΟΒΟΛΗ ΜΑΓΑΖΙΟΥ"}
                        </span>
                      </button>
                    </Link>
                  </motion.div>
                </AnimatePresence>
              );
            })}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
