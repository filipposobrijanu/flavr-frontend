"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import banana from "../../assets/ideativas-tlm-banana-6631298_1920.png";
import fish from "../../assets/ideativas-tlm-fish-6600570_1920.png";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);

  // 🛠️ State για errors ανά input field
  const [errors, setErrors] = useState({
    username: "",
    email: "",
    general: "",
  });
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Reset errors
    let hasErrors = false;
    const newErrors = { username: "", email: "", general: "" };

    if (!username.trim()) {
      newErrors.username = "Username is required!";
      hasErrors = true;
    }
    if (!email.trim()) {
      newErrors.email = "Email address is required!";
      hasErrors = true;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email!";
      hasErrors = true;
    }

    if (hasErrors) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setErrors({ username: "", email: "", general: "" });

    try {
      // Στέλνουμε μόνο email και username στο API
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, username }),
      });

      if (res.ok) {
        const loggedInUser = await res.json();

        // Ο χρήστης έρχεται από τη βάση μαζί με τον ρόλο του (loggedInUser.role)
        login(loggedInUser);

        if (loggedInUser.role === "ADMIN") router.push("/admin");
        else if (loggedInUser.role === "OWNER") router.push("/owner");
        else router.push("/restaurants");
        router.push(redirect as string);
      } else {
        newErrors.general = "Invalid credentials or user does not exist!";
        setErrors(newErrors);
      }
    } catch (error) {
      console.error(error);
      newErrors.general = "Something went wrong. Try again!";
      setErrors(newErrors);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" min-h-[calc(80vh-4rem)] md:min-h-[calc(75vh-4rem)] mb-10 flex flex-col gap-4 items-center justify-center text-center p-6 text-black">
      <title>Login | Flavr</title>
      <div className="relative w-full max-w-6xl mx-auto flex flex-col items-center justify-center">
        {/* 🍌 Μπανάνα */}
        <div className="hidden lg:block absolute left-0 xl:left-4 top-1/2 -translate-y-1/2 w-48 h-48 xl:w-56 xl:h-56 z-0 transform -rotate-12 transition-transform hover:scale-110">
          <Image
            priority
            src={banana}
            alt="Banana Illustration"
            className="object-contain border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rounded-2xl bg-blue-400 p-2"
          />
        </div>
        <div className="flex justify-center items-center w-full">
          <div className="flex lg:hidden justify-center items-center  mb-8 mt-2 w-44 h-44 transform rotate-8 transition-transform hover:scale-110">
            <Image
              priority
              src={banana}
              alt="Burger Illustration"
              className="object-contain border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rounded-2xl bg-blue-400 p-2"
            />
          </div>
        </div>

        <h2 className="text-4xl md:text-5xl font-black text-white [-webkit-text-stroke:5px_black] [paint-order:stroke_fill] tracking-tight mb-4 uppercase z-10">
          Welcome Back
        </h2>

        {/* 📦 Κάρτα */}
        <div className="bg-white p-8 rounded-2xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] w-full max-w-md transition-all z-10">
          {/* General Global Error Box */}
          {errors.general && (
            <div className="mb-4 p-3 bg-red-200 border-2 border-black rounded-xl font-bold text-xs uppercase text-red-700 tracking-wide text-left shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              {errors.general}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Username Input */}
            <div className="text-left">
              <label className="block text-xs font-black uppercase tracking-wider mb-1.5 text-black">
                User name
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setErrors({ ...errors, username: "" });
                }}
                placeholder="e.g. john_doe"
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
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrors({ ...errors, email: "" });
                }}
                placeholder="name@example.com"
                className={`w-full px-3 py-2 border-2 border-black rounded-xl font-bold bg-gray-50 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] focus:bg-white focus:outline-none transition-all placeholder:text-gray-400 ${errors.email ? "bg-red-50 border-red-500" : ""}`}
              />
              {errors.email && (
                <p className="text-red-600 font-black text-[10px] uppercase tracking-wide mt-1 ml-1">
                  * {errors.email}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full button-main"
            >
              <span
                style={{ backgroundColor: "#0199ff", color: "white" }}
                className="button_top px-3 py-2 font-black tracking-wider"
              >
                {loading ? "LOGGING IN..." : "LOGIN"}
              </span>
            </button>
          </form>

          <p className="mt-6 text-xs font-bold text-gray-600">
            New to Flavr?{" "}
            <Link
              href="/signup"
              style={{ color: "#0199ff" }}
              className="text-blue-600 underline font-black uppercase ml-1 hover:opacity-60"
            >
              Create an account
            </Link>
          </p>
        </div>

        {/* 🐟 Ψάρι */}
        <div className="hidden lg:block absolute right-0 xl:right-4 top-1/2 -translate-y-1/2 w-48 h-48 xl:w-56 xl:h-56 z-0 transform rotate-12 transition-transform hover:scale-110">
          <Image
            priority
            src={fish}
            alt="Fish Illustration"
            className="object-contain border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rounded-2xl bg-green-400 p-2"
          />
        </div>
        <div className="flex justify-center items-center w-full">
          <div className="flex lg:hidden justify-center items-center  mb-2 mt-10 w-44 h-44 transform -rotate-8 transition-transform hover:scale-110">
            <Image
              priority
              src={fish}
              alt="Burger Illustration"
              className="object-contain border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rounded-2xl bg-green-400 p-2"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
