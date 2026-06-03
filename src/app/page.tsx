"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import food from "../assets/ideativas-tlm-food-8029158_1920.png";
import { useEffect, useState } from "react";
import burger from "../assets/ideativas-tlm-hamburger-6402790_1920.png";
import Image from "next/image";
import { useLocale } from "@/context/LocaleContext";
export default function Home() {
  const [user, setUser] = useState<any>(null);
  const { t, setLang } = useLocale();
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);
  const router = useRouter();
  return (
    <>
      <div className="w-full min-h-[calc(100vh-4rem)] md:min-h-[calc(90vh-4rem)] lg:min-h-[calc(70vh-4rem)]   flex items-center justify-center px-6 text-black overflow-hidden">
        {/* 2. ΝΕΟ INNER CONTAINER: Αυτό ορίζει πόσο "μέσα" θα έρθουν οι εικόνες (π.χ. max-w-5xl) */}
        <div className="relative w-full max-w-7xl mx-auto flex flex-col items-center justify-center">
          {/* ΑΡΙΣΤΕΡΗ ΕΙΚΟΝΑ - Τώρα με left-0 ή left-4 κάθεται στην άκρη του 5xl container, δηλαδή πιο μέσα! */}
          <div className="hidden lg:block absolute left-0 xl:left-3 top-1/2 -translate-y-1/2 w-55 h-55 xl:w-65 xl:h-65 z-0 transform -rotate-12 transition-transform hover:scale-110">
            <Image
              priority
              src={burger}
              alt="Burger Illustration"
              className="object-contain border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rounded-2xl bg-yellow-400 p-2"
            />
          </div>

          {/* Κείμενο & Κουμπιά (z-10 για να είναι πάντα από πάνω) */}
          <div className="max-w-2xl text-center space-y-6 z-10 px-4">
            <div className="flex justify-center items-center w-full">
              <div className="flex lg:hidden justify-center items-center  mb-2 mt-10 w-55 h-55 transform -rotate-8 transition-transform hover:scale-110">
                <Image
                  priority
                  src={burger}
                  alt="Burger Illustration"
                  className="object-contain border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rounded-2xl bg-yellow-400 p-2"
                />
              </div>
            </div>
            <div className="flex justify-center items-center w-full">
              <div className="hidden lg:block absolute right-0 xl:right-3 top-1/2 -translate-y-1/2 w-55 h-55 xl:w-65 xl:h-65 z-0 transform rotate-12 transition-transform hover:scale-110">
                <Image
                  priority
                  src={food}
                  alt="Pizza Illustration"
                  className="object-contain border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rounded-2xl bg-orange-400 p-2"
                />
              </div>
            </div>
            <span
              style={{ backgroundColor: "#ffffff" }}
              className="border-2 border-b-4 border-black font-bold px-4 py-1.5 rounded-xl text-sm uppercase tracking-wider mb-3 inline-block"
            >
              {t("home.badge")}
            </span>

            <h1 className="text-5xl mt-6 mb-8 md:mb-5 md:text-6xl text-white [-webkit-text-stroke:6px_black] [paint-order:stroke_fill] tracking-tight leading-none">
              {t("home.title")}
            </h1>

            <p className="text-md text-black max-w-lg mx-auto">
              {t("home.desc")}
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
              <button
                onClick={() => router.push("restaurants")}
                className="button-main"
              >
                <span
                  style={{ backgroundColor: "#ffffff" }}
                  className="button_top px-3 py-2"
                >
                  {t("home.btnExploration")}
                </span>
              </button>
              {!user ? (
                <button
                  onClick={() => router.push("login")}
                  className="button-main"
                >
                  <span className="button_top px-3 py-2">
                    {t("home.btnLogin")}
                  </span>
                </button>
              ) : null}
            </div>
            <div className="flex justify-center items-center w-full">
              <div className="flex lg:hidden justify-center items-center  mb-16 mt-8  w-55 h-55 transform rotate-8 transition-transform hover:scale-110">
                <Image
                  priority
                  src={food}
                  alt="Pizza Illustration"
                  className="object-contain border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rounded-2xl bg-orange-400 p-2"
                />
              </div>
            </div>
          </div>

          {/* ΔΕΞΙΑ ΕΙΚΟΝΑ - Αντίστοιχα με right-0 ή right-4 */}
          <div className="hidden lg:block absolute right-0 xl:right-3 top-1/2 -translate-y-1/2 w-55 h-55 xl:w-65 xl:h-65 z-0 transform rotate-12 transition-transform hover:scale-110">
            <Image
              priority
              src={food}
              alt="Pizza Illustration"
              className="object-contain border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rounded-2xl bg-orange-400 p-2"
            />
          </div>
        </div>
      </div>
      <div
        style={{ backgroundColor: "rgb(255, 209, 11)" }}
        // 1. Το εξωτερικό div έγινε flex-col για να μπει ο τίτλος πάνω και οι κάρτες από κάτω
        className="w-full  border-t-4 border-black py-12 md:py-16 px-6 text-black flex flex-col items-center justify-center"
      >
        {/* 👑 ΝΕΟ ΚΕΙΜΕΝΟ ΑΠΟ ΠΑΝΩ (Section Header) */}
        <div className="text-center mb-8 md:mb-12 space-y-3">
          <h2 className="text-3xl md:text-5xl font-black text-white [-webkit-text-stroke:5px_black] [paint-order:stroke_fill] tracking-tight">
            {t("home.featuresTitle")}
          </h2>
          <p className="text-base max-w-md mx-auto text-black">
            {t("home.featuresDesc")}
          </p>
        </div>

        {/* 📊 ΤΟ GRID ΜΕ ΤΙΣ ΚΑΡΤΕΣ */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl justify-items-center">
          {/* Κάρτα 1 */}
          <div
            style={{ backgroundColor: "#3a8bd6" }}
            // 2. Προσθέσαμε max-w-[290px] για να είναι πιο μικρό το πλάτος τους
            className="bg-white transition-transform hover:scale-108 border-2 border-b-4 border-black p-6 rounded-xl w-full max-w-[290px] min-h-[200px] flex flex-col justify-between shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
          >
            <div>
              <h3 className="inline-flex gap-2 font-black text-2xl text-white mb-3 [-webkit-text-stroke:4px_black] [paint-order:stroke_fill] tracking-tight">
                {t("home.roleBased")}
              </h3>
              <p className="text-sm  text-white leading-relaxed font-medium">
                {t("home.roleBasedDesc")}
              </p>
            </div>
          </div>

          {/* Κάρτα 2 */}
          <div
            style={{ backgroundColor: "#3a8bd6" }}
            className="bg-white transition-transform hover:scale-108 border-2 border-b-4 border-black p-6 rounded-xl w-full max-w-[290px] min-h-[200px] flex flex-col justify-between shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
          >
            <div>
              <h3 className="inline-flex gap-2 font-black text-2xl text-white mb-3 [-webkit-text-stroke:4px_black] [paint-order:stroke_fill] tracking-tight">
                {t("home.bayesian")}
              </h3>
              <p className="text-sm text-white leading-relaxed font-medium">
                {t("home.bayesianDesc")}
              </p>
            </div>
          </div>

          {/* Κάρτα 3 */}
          <div
            style={{ backgroundColor: "#3a8bd6" }}
            className="bg-white transition-transform hover:scale-108 border-2 border-b-4 border-black p-6 rounded-xl w-full max-w-[290px] min-h-[200px] flex flex-col justify-between shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
          >
            <div>
              <h3 className="inline-flex gap-2 font-black text-2xl text-white mb-3 [-webkit-text-stroke:4px_black] [paint-order:stroke_fill] tracking-tight">
                {t("home.transparent")}
              </h3>
              <p className="text-sm  text-white  leading-relaxed font-medium">
                {t("home.transparentDesc")}
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* 🚀 ΝΕΟ SECTION: FLAVR WORKFLOW */}
      <div
        style={{ backgroundColor: "#FF8904" }}
        // 1. Το εξωτερικό div έγινε flex-col για να μπει ο τίτλος πάνω και οι κάρτες από κάτω
        className="w-full  border-t-4 border-black py-12 md:py-16 px-6 text-black flex flex-col items-center justify-center"
      >
        <div className="text-center mb-8 md:mb-12 space-y-3">
          <h2 className="text-3xl md:text-5xl font-black text-white [-webkit-text-stroke:5px_black] [paint-order:stroke_fill] tracking-tight">
            {t("home.workflow")}
          </h2>
        </div>
        <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
          {[
            {
              step: "1",
              title: t("home.step1"),
              desc: t("home.step1Desc"),
            },
            {
              step: "2",
              title: t("home.step2"),
              desc: t("home.step2Desc"),
            },
            {
              step: "3",
              title: t("home.step3"),
              desc: t("home.step3Desc"),
            },
            { step: "4", title: t("home.step4"), desc: t("home.step4Desc") },
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center w-full md:w-1/4">
              <div className=" hover:scale-105 transition-transform w-22 h-22 bg-white border-2 border-b-4 border-black rounded-full flex  items-center justify-center font-black text-4xl mb-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                {item.step}
              </div>
              <h4 className="font-bold uppercase tracking-widest text-xl">
                {item.title}
              </h4>
              <p className="text-sm mt-2 opacity-80">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
      {/* 🏁 FINAL CTA SECTION */}
      <div
        // 1. Το εξωτερικό div έγινε flex-col για να μπει ο τίτλος πάνω και οι κάρτες από κάτω
        className="w-full  border-t-4 border-black py-12 md:py-16 px-6 text-black flex flex-col items-center justify-center"
      >
        <div className="max-w-2xl bg-white border-4 border-black p-10 rounded-3xl shadow-[10px_10px_0px_0px_black] transform hover:-rotate-1 transition-transform">
          <h2 className="text-3xl md:text-4xl font-black mb-6 text-black tracking-tight">
            {t("home.cta")}
          </h2>
          <p className="text-lg text-gray-700 mb-8 font-medium">
            {t("home.ctaSub")}
          </p>

          <button
            onClick={() => router.push("/restaurants")}
            className="button-main bg-[#FE2120] "
          >
            <span
              style={{ backgroundColor: "#FE2120", color: "white" }}
              className="button_top px-3 py-2 py-3 px-6 text-lg inline-flex items-center justify-center"
            >
              {t("home.ctaBtn")}
            </span>
          </button>
        </div>
      </div>
    </>
  );
}
