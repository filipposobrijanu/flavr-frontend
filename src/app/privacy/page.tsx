"use client";

import Link from "next/link";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-[calc(80vh-4rem)] p-6 md:p-12 text-black">
      <title>Privacy Policy | Flavr</title>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Κουμπί Επιστροφής */}
        <Link
          href="/"
          className="inline-block font-black inline-flex gap-2 text-md uppercase tracking-wider border-2 border-black bg-gray-200 px-4 py-2 rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
        >
          Back to Home
        </Link>

        {/* 📄 Κεντρικός Τίτλος */}
        <div className="bg-yellow-400 border-4 border-black p-6 rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-black">
            Privacy Policy
          </h1>
          <p className="text-sm font-black uppercase tracking-wider text-black mt-2 opacity-90">
            • Last updated: May 2026
          </p>
        </div>

        {/* Εισαγωγή */}
        <p className="text-md  leading-relaxed  pl-2 ">
          At Flavr, we respect your data. This page explains in simple, clear
          terms (without confusing legalese) what data we collect, how we use
          it, and how we protect it.
        </p>

        {/* Sections με Neobrutalist Cards */}
        <div className="space-y-6">
          {/* Section 1 */}
          <div className="bg-white p-6 border-2 border-black rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-3">
            <h2 className="text-2xl font-black uppercase tracking-tight flex items-center gap-2 text-black">
              <span className="bg-blue-400 border-2 border-black px-2 py-0.5 rounded text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                01
              </span>
              What data we collect
            </h2>
            <div className="text-sm font-medium text-black space-y-2 border-t-2 border-black pt-3">
              <p>When using the application, we may store:</p>
              <ul className="list-disc pl-5 space-y-1 font-semibold">
                <li>
                  <strong className="font-black">Account Details:</strong> Your
                  username and ID when you log in.
                </li>
                <li>
                  <strong className="font-black">Reviews and Ratings:</strong>{" "}
                  The text of the review, the individual ratings (Food, Service,
                  Atmosphere, VFM) and the timestamp of the submission.
                </li>
              </ul>
            </div>
          </div>

          {/* Section 2 */}
          <div className="bg-white p-6 border-2 border-black rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-3">
            <h2 className="text-2xl font-black uppercase tracking-tight flex items-center gap-2 text-black">
              <span className="bg-green-400 border-2 border-black px-2 py-0.5 rounded text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                02
              </span>
              How We Use Your Data
            </h2>
            <div className="text-sm font-medium text-black space-y-2 border-t-2 border-black pt-3">
              <p>
                We use the information exclusively for the proper operation of
                Flavr:
              </p>
              <ul className="list-disc pl-5 space-y-1 font-semibold">
                <li>
                  To display your reviews anonymously or by name on each
                  restaurant's page.
                </li>
                <li>
                  For the live recalculation of{" "}
                  <span className="underline decoration-yellow-400 decoration-2 font-black">
                    Global Bayesian Score
                  </span>{" "}
                  of the shops.
                </li>
                <li>To keep you logged in to your browser.</li>
              </ul>
            </div>
          </div>

          {/* Section 3 */}
          <div className="bg-white p-6 border-2 border-black rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-3">
            <h2 className="text-2xl font-black uppercase tracking-tight flex items-center gap-2 text-black">
              <span className="bg-purple-400 border-2 border-black px-2 py-0.5 rounded text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                03
              </span>
              Cookies & Local Storage
            </h2>
            <p className="text-sm font-medium text-black border-t-2 border-black pt-3 leading-relaxed">
              We use it <strong className="font-black">Local Storage</strong> of
              the browser We use your data exclusively to store the session
              token or the logged-in user's data
              (`localStorage.getItem("user")`). We do not use tracking cookies
              nor do we share your data with advertising companies.
            </p>
          </div>

          {/* Section 4 */}
          <div className="bg-white p-6 border-2 border-black rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-3">
            <h2 className="text-2xl font-black uppercase tracking-tight flex items-center gap-2 text-black">
              <span className="bg-red-400 border-2 border-black px-2 py-0.5 rounded text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                04
              </span>
              Your Rights
            </h2>
            <p className="text-sm font-medium text-black border-t-2 border-black pt-3 leading-relaxed">
              You have complete control. You can request the deletion of your
              account or the reviews you have submitted at any time, by sending
              a message to the Flavr support team.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
