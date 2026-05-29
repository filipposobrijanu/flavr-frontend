"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import banana from "../../assets/ideativas-tlm-banana-6631298_1920.png";
import fish from "../../assets/ideativas-tlm-fish-6600570_1920.png";
import { useAuth } from "@/context/AuthContext";

export default function SignUpPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("REVIEWER");
  const [loading, setLoading] = useState(false);

  // 🛠️ State για errors ανά input field στο signup
  const [errors, setErrors] = useState({
    username: "",
    email: "",
    general: "",
  });
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    let hasErrors = false;
    const newErrors = { username: "", email: "", general: "" };

    if (!username.trim()) {
      newErrors.username = "Choose a clean username!";
      hasErrors = true;
    }
    if (!email.trim()) {
      newErrors.email = "Email is required for verification!";
      hasErrors = true;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "This email looks fake!";
      hasErrors = true;
    }

    if (hasErrors) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setErrors({ username: "", email: "", general: "" });

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, username, role }),
      });

      if (res.ok) {
        const newUser = await res.json();
        login(newUser);

        if (newUser.role === "ADMIN") router.push("/admin");
        else if (newUser.role === "OWNER") router.push("/owner");
        else router.push("/restaurants");
      } else {
        const errorData = await res.json();
        newErrors.general =
          errorData.message || "Username or Email already taken!";
        setErrors(newErrors);
      }
    } catch (error) {
      console.error(error);
      newErrors.general = "Connection lost. Try again!";
      setErrors(newErrors);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(80vh-4rem)] md:min-h-[calc(75vh-4rem)] mb-10 flex flex-col gap-4 items-center justify-center text-center p-6 text-black">
      <title>Sign Up | Flavr</title>
      <div className="relative w-full max-w-6xl mx-auto flex flex-col items-center justify-center">
        {/* 🍌 Μπανάνα */}
        <div className="hidden lg:block absolute left-0 xl:left-4 top-1/2 -translate-y-1/2 w-48 h-48 xl:w-56 xl:h-56 z-0 transform -rotate-6 transition-transform hover:scale-110">
          <Image
            priority
            src={banana}
            alt="Banana Illustration"
            className="object-contain border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rounded-2xl bg-yellow-400 p-2"
          />
        </div>
        <div className="flex justify-center items-center w-full">
          <div className="flex lg:hidden justify-center items-center  mb-8 mt-2 w-44 h-44 transform rotate-8 transition-transform hover:scale-110">
            <Image
              priority
              src={banana}
              alt="Burger Illustration"
              className="object-contain border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rounded-2xl bg-yellow-400 p-2"
            />
          </div>
        </div>

        <h2 className="text-4xl md:text-5xl font-black text-white [-webkit-text-stroke:5px_black] [paint-order:stroke_fill] tracking-tight mb-4 uppercase z-10">
          Join the club
        </h2>

        {/* 📦 Κάρτα */}
        <div className="bg-white p-8 rounded-2xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] w-full max-w-md transition-all z-10">
          {/* General Global Error Box */}
          {errors.general && (
            <div className="mb-4 p-3 bg-red-200 border-2 border-black rounded-xl font-bold text-xs uppercase text-red-700 tracking-wide text-left shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSignUp} className="space-y-5">
            {/* Username Input */}
            <div className="text-left">
              <label className="block text-xs font-black uppercase tracking-wider mb-1.5 text-black">
                Choose Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setErrors({ ...errors, username: "" });
                }}
                placeholder="e.g. food_critic_99"
                className={`w-full px-3 py-2 border-2 border-black rounded-xl font-bold bg-gray-50 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] focus:bg-white focus:outline-none transition-all placeholder:text-gray-400 ${errors.username ? "bg-red-50 border-red-500" : ""}`}
              />
              {errors.username && (
                <p className="text-red-600 font-black text-[10px] uppercase tracking-wide mt-1 ml-1">
                  * {errors.username}
                </p>
              )}
            </div>

            {/* Email Input */}
            <div className="text-left">
              <label className="block text-xs font-black uppercase tracking-wider mb-1.5 text-black">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrors({ ...errors, email: "" });
                }}
                placeholder="yourmail@domain.com"
                className={`w-full px-3 py-2 border-2 border-black rounded-xl font-bold bg-gray-50 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] focus:bg-white focus:outline-none transition-all placeholder:text-gray-400 ${errors.email ? "bg-red-50 border-red-500" : ""}`}
              />
              {errors.email && (
                <p className="text-red-600 font-black text-[10px] uppercase tracking-wide mt-1 ml-1">
                  * {errors.email}
                </p>
              )}
            </div>

            {/* 👑 Role Selector (Με όλους τους 4 ρόλους πλέον!) */}
            <div className="text-left">
              <label className="block text-xs font-black uppercase tracking-wider mb-1.5 text-black">
                I am a...
              </label>
              <div className="relative">
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3 py-2 border-2 border-black rounded-xl font-black bg-gray-50 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] focus:bg-white focus:outline-none appearance-none cursor-pointer text-sm"
                >
                  <option value="VISITOR">
                    CASUAL VISITOR (JUST BROWSING)
                  </option>
                  <option value="REVIEWER">REVIEWER (WRITING REVIEWS)</option>
                  <option value="OWNER">RESTAURANT OWNER</option>
                  <option value="ADMIN">SYSTEM ADMIN (ADMIN)</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-black font-bold">
                  ▼
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full button-main "
            >
              <span
                style={{ backgroundColor: "#ff5c00", color: "white" }}
                className="button_top px-3 py-2 font-black tracking-wider"
              >
                {loading ? "CREATING ACCOUNT..." : "CREATE ACCOUNT"}
              </span>
            </button>
          </form>

          <p className="mt-6 text-xs font-bold text-gray-600">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-orange-600 underline font-black uppercase ml-1 hover:text-orange-800"
            >
              Login here
            </Link>
          </p>
        </div>

        {/* 🐟 Ψάρι */}
        <div className="hidden lg:block absolute right-0 xl:right-4 top-1/2 -translate-y-1/2 w-48 h-48 xl:w-56 xl:h-56 z-0 transform rotate-6 transition-transform hover:scale-110">
          <Image
            priority
            src={fish}
            alt="Fish Illustration"
            className="object-contain border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rounded-2xl bg-purple-400 p-2"
          />
        </div>
        <div className="flex justify-center items-center w-full">
          <div className="flex lg:hidden justify-center items-center  mb-2 mt-10 w-44 h-44 transform -rotate-8 transition-transform hover:scale-110">
            <Image
              priority
              src={fish}
              alt="Burger Illustration"
              className="object-contain border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rounded-2xl bg-purple-400 p-2"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
