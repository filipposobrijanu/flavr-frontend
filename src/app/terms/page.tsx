"use client";

import Link from "next/link";
import { useLocale } from "@/context/LocaleContext";

export default function TermsOfServicePage() {
  const { t } = useLocale();
  return (
    <div className="min-h-[calc(80vh-4rem)] p-6 md:p-12 text-black">
      <title>Terms of Service | Flavr</title>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Κουμπί Επιστροφής */}
        <Link
          href="/"
          className="inline-block font-black inline-flex gap-2 text-md uppercase tracking-wider border-2 border-black bg-gray-200 px-4 py-2 rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
        >
          {t("terms.back")}
        </Link>

        {/* 📜 Κεντρικός Τίτλος */}
        <div className="bg-blue-400 border-4 border-black p-6 rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-black">
            {t("terms.title")}
          </h1>
          <p className="text-sm font-black uppercase tracking-wider text-black mt-2 opacity-90">
            • {t("terms.updated")}
          </p>
        </div>

        {/* Εισαγωγή */}
        <p className="text-md font-bold leading-relaxed text-black pl-2 ">
          {t("terms.intro")}
        </p>

        {/* Sections με Neobrutalist Cards */}
        <div className="space-y-6">
          {/* Section 1 */}
          <div className="bg-white p-6 border-2 border-black rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-3">
            <h2 className="text-2xl font-black uppercase tracking-tight flex items-center gap-2 text-black">
              <span className="bg-yellow-400 border-2 border-black px-2 py-0.5 rounded text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                01
              </span>
              {t("terms.s1_title")}
            </h2>
            <p className="text-sm font-medium text-black border-t-2 border-black pt-3 leading-relaxed">
              {t("terms.s1_text")}
            </p>
          </div>

          {/* Section 2 */}
          <div className="bg-white p-6 border-2 border-black rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-3">
            <h2 className="text-2xl font-black uppercase tracking-tight flex items-center gap-2 text-black">
              <span className="bg-pink-400 border-2 border-black px-2 py-0.5 rounded text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                02
              </span>
              {t("terms.s2_title")}
            </h2>
            <div className="text-sm font-medium text-black space-y-2 border-t-2 border-black pt-3">
              <p>
                {t("terms.s2_text1")}{" "}
                <span className="underline decoration-pink-400 decoration-2 font-black">
                  {t("terms.s2_text2")}
                </span>{" "}
                {t("terms.s2_text3")}
              </p>
              <ul className="list-disc pl-5 space-y-1 font-semibold">
                <li>{t(`terms.s2_list1`)}</li>
                <li>{t(`terms.s2_list2`)}</li>
                <li>{t(`terms.s2_list3`)}</li>
              </ul>
              <p className="text-xs font-black text-red-600 uppercase mt-2">
                {t(`terms.warning`)}
              </p>
            </div>
          </div>

          {/* Section 3 */}
          <div className="bg-white p-6 border-2 border-black rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-3">
            <h2 className="text-2xl font-black uppercase tracking-tight flex items-center gap-2 text-black">
              <span className="bg-green-400 border-2 border-black px-2 py-0.5 rounded text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                03
              </span>
              {t("terms.s3_title")}
            </h2>
            <p className="text-sm font-medium text-black border-t-2 border-black pt-3 leading-relaxed">
              {t(`terms.s3_text`)}
            </p>
          </div>

          {/* Section 4 */}
          <div className="bg-white p-6 border-2 border-black rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-3">
            <h2 className="text-2xl font-black uppercase tracking-tight flex items-center gap-2 text-black">
              <span className="bg-purple-400 border-2 border-black px-2 py-0.5 rounded text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                04
              </span>
              {t("terms.s4_title")}
            </h2>
            <p className="text-sm font-medium text-black border-t-2 border-black pt-3 leading-relaxed">
              {t("terms.s4_text")}
              <span className="font-black">Bayesian Score</span>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
