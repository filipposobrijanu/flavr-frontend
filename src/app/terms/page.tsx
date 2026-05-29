"use client";

import Link from "next/link";

export default function TermsOfServicePage() {
  return (
    <div className="min-h-[calc(80vh-4rem)] p-6 md:p-12 text-black">
      <title>Terms of Service | Flavr</title>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Κουμπί Επιστροφής */}
        <Link
          href="/"
          className="inline-block font-black inline-flex gap-2 text-md uppercase tracking-wider border-2 border-black bg-gray-200 px-4 py-2 rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
        >
          Back to Home
        </Link>

        {/* 📜 Κεντρικός Τίτλος */}
        <div className="bg-blue-400 border-4 border-black p-6 rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-black">
            Terms of Service
          </h1>
          <p className="text-sm font-black uppercase tracking-wider text-black mt-2 opacity-90">
            • Last updated: May 2026
          </p>
        </div>

        {/* Εισαγωγή */}
        <p className="text-md font-bold leading-relaxed text-black pl-2 ">
          Welcome to Flavr! Accessing and using our platform requires that you
          agree and accept the following simple but important rules for
          operating our community.
        </p>

        {/* Sections με Neobrutalist Cards */}
        <div className="space-y-6">
          {/* Section 1 */}
          <div className="bg-white p-6 border-2 border-black rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-3">
            <h2 className="text-2xl font-black uppercase tracking-tight flex items-center gap-2 text-black">
              <span className="bg-yellow-400 border-2 border-black px-2 py-0.5 rounded text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                01
              </span>
              Acceptance of the Terms
            </h2>
            <p className="text-sm font-medium text-black border-t-2 border-black pt-3 leading-relaxed">
              By creating an account or submitting reviews on Flavr, you are
              agreeing to these terms. If you do not agree to any of them, you
              are unfortunately unable to use the platform's review services.
            </p>
          </div>

          {/* Section 2 */}
          <div className="bg-white p-6 border-2 border-black rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-3">
            <h2 className="text-2xl font-black uppercase tracking-tight flex items-center gap-2 text-black">
              <span className="bg-pink-400 border-2 border-black px-2 py-0.5 rounded text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                02
              </span>
              Community Rules
            </h2>
            <div className="text-sm font-medium text-black space-y-2 border-t-2 border-black pt-3">
              <p>
                We want Flavr to be a place with{" "}
                <span className="underline decoration-pink-400 decoration-2 font-black">
                  real and objective
                </span>{" "}
                opinions. It is strictly prohibited:
              </p>
              <ul className="list-disc pl-5 space-y-1 font-semibold">
                <li>
                  Submitting fake or manipulated reviews with the purpose of
                  deliberately lowering or increasing a restaurant's rating.
                </li>
                <li>
                  The use of offensive, abusive or racist language in comments.
                </li>
                <li>
                  Advertising other products or services through the context of
                  reviews.
                </li>
              </ul>
              <p className="text-xs font-black text-red-600 uppercase mt-2">
                Reviews that violate the above will be immediately deleted by
                the administrators without warning.
              </p>
            </div>
          </div>

          {/* Section 3 */}
          <div className="bg-white p-6 border-2 border-black rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-3">
            <h2 className="text-2xl font-black uppercase tracking-tight flex items-center gap-2 text-black">
              <span className="bg-green-400 border-2 border-black px-2 py-0.5 rounded text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                03
              </span>
              User Accounts and Roles
            </h2>
            <p className="text-sm font-medium text-black border-t-2 border-black pt-3 leading-relaxed">
              Users with a role <strong className="font-black">Reviewer</strong>{" "}
              are solely responsible for maintaining the confidentiality of
              their login details and for any activity that occurs through their
              account. Flavr reserves the right to suspend accounts that exhibit
              suspicious or malicious activity (e.g. spamming).
            </p>
          </div>

          {/* Section 4 */}
          <div className="bg-white p-6 border-2 border-black rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-3">
            <h2 className="text-2xl font-black uppercase tracking-tight flex items-center gap-2 text-black">
              <span className="bg-purple-400 border-2 border-black px-2 py-0.5 rounded text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                04
              </span>
              Limitation of Liability
            </h2>
            <p className="text-sm font-medium text-black border-t-2 border-black pt-3 leading-relaxed">
              Reviews express solely the personal opinions of the users who
              write them and not Flavr. Flavr bears no responsibility for the
              content, accuracy or validity of the reviews published by the
              community, nor for any temporary malfunctions of its live
              calculation service.{" "}
              <span className="font-black">Bayesian Score</span>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
