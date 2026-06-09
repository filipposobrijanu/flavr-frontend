"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import banana from "../../assets/ideativas-tlm-banana-6631298_1920.png";
import fish from "../../assets/ideativas-tlm-fish-6600570_1920.png";
import { useAuth } from "@/context/AuthContext";
import { useLocale } from "@/context/LocaleContext";
import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";
import { motion } from "framer-motion";
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
} as const;

function SignUpContent() {
  const { t } = useLocale();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("REVIEWER");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
    general: "",
  });
  const router = useRouter();
  const googleSignUp = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      try {
        const res = await fetch("/api/auth/google", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            accessToken: tokenResponse.access_token,
            role: role,
          }),
        });

        if (res.ok) {
          const newUser = await res.json();
          login(newUser);

          if (newUser.role === "ADMIN") router.push("/admin");
          else if (newUser.role === "OWNER") router.push("/owner");
          else router.push("/restaurants");
        } else {
          const errorData = await res.json();
          setErrors({
            ...errors,
            general: errorData.message || "Google Sign-Up failed",
          });
        }
      } catch (error) {
        setErrors({ ...errors, general: "Network error" });
      } finally {
        setLoading(false);
      }
    },
    onError: () => setErrors({ ...errors, general: "Το Google Auth απέτυχε" }),
  });
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    let hasErrors = false;
    const newErrors = { username: "", email: "", password: "", general: "" };

    if (!username.trim()) {
      newErrors.username = t("signup.errors.username");
      hasErrors = true;
    }
    if (!email.trim()) {
      newErrors.email = t("signup.errors.email_required");
      hasErrors = true;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = t("signup.errors.email_invalid");
      hasErrors = true;
    }
    if (!password.trim()) {
      newErrors.password = t("signup.errors.password_required");
      hasErrors = true;
    } else if (password.length < 6) {
      newErrors.password = t("signup.errors.password_short");
      hasErrors = true;
    }

    if (hasErrors) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setErrors({ username: "", email: "", password: "", general: "" });

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, username, password, role }),
      });

      if (res.ok) {
        const newUser = await res.json();
        login(newUser);

        if (newUser.role === "ADMIN") router.push("/admin");
        else if (newUser.role === "OWNER") router.push("/owner");
        else router.push("/restaurants");
      } else {
        const errorData = await res.json();
        newErrors.general = errorData.message || t("signup.errors.general");
        setErrors(newErrors);
      }
    } catch (error) {
      console.error(error);
      newErrors.general = t("signup.errors.connection");
      setErrors(newErrors);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-[calc(80vh-4rem)] md:min-h-[calc(75vh-4rem)] mb-10 flex flex-col gap-4 items-center justify-center text-center p-6 text-black"
    >
      <title>Sign Up | Flavr</title>
      <div className="relative w-full max-w-6xl mx-auto flex flex-col items-center justify-center">
        {/* 🍌 Μπανάνα */}
        <motion.div
          variants={itemVariants}
          className="hidden lg:block absolute left-0 xl:left-4 top-1/2 -translate-y-1/2 w-48 h-48 xl:w-56 xl:h-56 z-0 transform -rotate-6 transition-transform hover:scale-110"
        >
          <Image
            priority
            src={banana}
            alt="Banana Illustration"
            className="object-contain border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rounded-2xl bg-yellow-400 p-2"
          />
        </motion.div>

        <motion.h2
          variants={itemVariants}
          className="text-4xl md:text-5xl font-black text-white [-webkit-text-stroke:5px_black] [paint-order:stroke_fill] tracking-tight mb-4 uppercase z-10"
        >
          {t("signup.title")}
        </motion.h2>

        {/* 📦 Κάρτα */}
        <motion.div
          variants={itemVariants}
          className="bg-white p-8 rounded-2xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] w-full max-w-md transition-all z-10"
        >
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
                {t("signup.username_label")}
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setErrors({ ...errors, username: "" });
                }}
                placeholder={t("signup.username_placeholder")}
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
                {t("signup.email_label")}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrors({ ...errors, email: "" });
                }}
                placeholder={t("signup.email_placeholder")}
                className={`w-full px-3 py-2 border-2 border-black rounded-xl font-bold bg-gray-50 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] focus:bg-white focus:outline-none transition-all placeholder:text-gray-400 ${errors.email ? "bg-red-50 border-red-500" : ""}`}
              />
              {errors.email && (
                <p className="text-red-600 font-black text-[10px] uppercase tracking-wide mt-1 ml-1">
                  * {errors.email}
                </p>
              )}
            </div>
            <div className="text-left">
              <label className="block text-xs font-black uppercase tracking-wider mb-1.5 text-black">
                {t("signup.password_label")}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrors({ ...errors, password: "" });
                }}
                placeholder={t("signup.password_placeholder")}
                className={`w-full px-3 py-2 border-2 border-black rounded-xl font-bold bg-gray-50 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] focus:bg-white focus:outline-none transition-all placeholder:text-gray-400 ${errors.password ? "bg-red-50 border-red-500" : ""}`}
              />
              {errors.password && (
                <p className="text-red-600 font-black text-[10px] uppercase tracking-wide mt-1 ml-1">
                  * {errors.password}
                </p>
              )}
            </div>

            {/* 👑 Role Selector (Με όλους τους 4 ρόλους πλέον!) */}
            <div className="text-left">
              <label className="block text-xs font-black uppercase tracking-wider mb-1.5 text-black">
                {t("signup.role_label")}
              </label>
              <div className="relative">
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3 py-2 border-2 border-black rounded-xl font-black bg-gray-50 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] focus:bg-white focus:outline-none appearance-none cursor-pointer text-sm"
                >
                  <option value="VISITOR">{t("signup.roles.visitor")}</option>
                  <option value="REVIEWER">{t("signup.roles.reviewer")}</option>
                  <option value="OWNER">{t("signup.roles.owner")}</option>
                  <option value="ADMIN">{t("signup.roles.admin")}</option>
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
                {loading ? t("signup.loading") : t("signup.btn")}
              </span>
            </button>
          </form>
          <div className="my-6 flex items-center justify-center relative">
            <hr className="w-full border-black border-1" />
          </div>

          <button
            type="button"
            onClick={() => {
              if (!role) {
                setErrors({
                  ...errors,
                  general: "Παρακαλώ επιλέξτε έναν ρόλο πρώτα!",
                });
                return;
              }
              googleSignUp();
            }}
            className="w-full flex items-center justify-center gap-3 px-4 cursor-pointer  py-2.5 bg-white border-2 border-black rounded-xl font-black uppercase text-md shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google Logo"
              className="w-5 h-5"
            />
            {t("signup.continue_with_google") || "Sign up with Google"}
          </button>

          <p className="mt-6 text-xs font-bold text-gray-600">
            {t("signup.login_prompt")}{" "}
            <Link
              href="/login"
              className="text-orange-600 underline font-black uppercase ml-1 hover:text-orange-800"
            >
              {t("signup.login_link")}
            </Link>
          </p>
        </motion.div>

        {/* 🐟 Ψάρι */}
        <motion.div
          variants={itemVariants}
          className="hidden lg:block absolute right-0 xl:right-4 top-1/2 -translate-y-1/2 w-48 h-48 xl:w-56 xl:h-56 z-0 transform rotate-6 transition-transform hover:scale-110"
        >
          <Image
            priority
            src={fish}
            alt="Fish Illustration"
            className="object-contain border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rounded-2xl bg-purple-400 p-2"
          />
        </motion.div>
        <div className="flex justify-center items-center w-full">
          <motion.div
            variants={itemVariants}
            className="flex lg:hidden justify-center items-center  mb-2 mt-10 w-44 h-44 transform -rotate-8 transition-transform hover:scale-110"
          >
            <Image
              priority
              src={fish}
              alt="Burger Illustration"
              className="object-contain border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rounded-2xl bg-purple-400 p-2"
            />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
export default function SignUpPage() {
  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
      <title>Sign Up | Flavr</title>
      <SignUpContent />
    </GoogleOAuthProvider>
  );
}
