"use client";
import { useState } from "react";

export default function BayesianTooltip({
  score,
  reviewCount,
}: {
  score: number;
  reviewCount: number;
}) {
  const [show, setShow] = useState(false);

  return (
    <div className="relative inline-block ml-2">
      <button
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        className="text-[10px] font-black border-2 border-black rounded-full w-4 h-4 bg-yellow-400 flex items-center justify-center cursor-help shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
      >
        i
      </button>
      {show && (
        <div className="absolute z-50 w-56 p-3 mt-2 bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-xl text-[11px] font-medium leading-tight">
          <p className="font-black underline mb-1">How is this calculated?</p>
          <p>
            This score of <strong>{score.toFixed(1)}</strong> uses Bayesian
            averaging across <strong>{reviewCount}</strong> reviews to ensure
            fair, verified rankings.
          </p>
        </div>
      )}
    </div>
  );
}
