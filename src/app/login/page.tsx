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

function LoginContent() {
  const { t } = useLocale();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
    general: "",
  });
  const router = useRouter();
  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const res = await fetch("/api/auth/google", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ accessToken: tokenResponse.access_token }),
        });

        if (res.ok) {
          const user = await res.json();
          login(user);
          if (user.role === "ADMIN") router.push("/admin");
          else router.push("/restaurants");
        } else {
          setErrors({ ...errors, general: "Αποτυχία σύνδεσης με Google" });
        }
      } catch (error) {
        setErrors({ ...errors, general: "Σφάλμα δικτύου" });
      }
    },
    onError: () => setErrors({ ...errors, general: "Το Google Login απέτυχε" }),
  });
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    let hasErrors = false;
    const newErrors = { username: "", email: "", password: "", general: "" };

    if (!username.trim()) {
      newErrors.username = t("login.err_username_req");
      hasErrors = true;
    }
    if (!email.trim()) {
      newErrors.email = t("login.err_email_req");
      hasErrors = true;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = t("login.err_email_invalid");
      hasErrors = true;
    }
    if (!password.trim()) {
      newErrors.password = t("login.err_password_req");
      hasErrors = true;
    }

    if (hasErrors) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setErrors({ username: "", email: "", password: "", general: "" });

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, username, password }),
      });

      if (res.ok) {
        const loggedInUser = await res.json();
        login(loggedInUser);

        if (loggedInUser.role === "ADMIN") router.push("/admin");
        else if (loggedInUser.role === "OWNER") router.push("/owner");
        else router.push("/restaurants");
      } else {
        newErrors.general = t("login.err_invalid_creds");
        setErrors(newErrors);
      }
    } catch (error) {
      console.error(error);
      newErrors.general = t("login.err_general");
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
      className=" min-h-[calc(80vh-4rem)] md:min-h-[calc(75vh-4rem)] mb-10 flex flex-col gap-4 items-center justify-center text-center p-6 text-black"
    >
      <title>Login | Flavr</title>
      <div className="relative w-full max-w-6xl mx-auto flex flex-col items-center justify-center">
        {/* 🍌 Μπανάνα */}
        <motion.div
          variants={itemVariants}
          className="hidden lg:block absolute left-0 xl:left-4 top-1/2 -translate-y-1/2 w-48 h-48 xl:w-56 xl:h-56 z-0 transform -rotate-12 transition-transform hover:scale-110"
        >
          <Image
            priority
            src={banana}
            alt="Banana Illustration"
            className="object-contain border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rounded-2xl bg-blue-400 p-2"
          />
        </motion.div>

        <motion.h2
          variants={itemVariants}
          className="text-4xl md:text-5xl font-black text-white [-webkit-text-stroke:5px_black] [paint-order:stroke_fill] tracking-tight mb-4 uppercase z-10"
        >
          {t("login.welcome")}
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

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Username Input */}
            <div className="text-left">
              <label className="block text-xs font-black uppercase tracking-wider mb-1.5 text-black">
                {t("login.username_label")}
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setErrors({ ...errors, username: "" });
                }}
                placeholder={t("login.username_ph")}
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
                {t("login.email_label")}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrors({ ...errors, email: "" });
                }}
                placeholder={t("login.email_ph")}
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
                {t("login.password_label")}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrors({ ...errors, password: "" });
                }}
                placeholder={t("login.password_ph")}
                className={`w-full px-3 py-2 border-2 border-black rounded-xl font-bold bg-gray-50 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] focus:bg-white focus:outline-none transition-all placeholder:text-gray-400 ${errors.password ? "bg-red-50 border-red-500" : ""}`}
              />
              {errors.password && (
                <p className="text-red-600 font-black text-[10px] uppercase tracking-wide mt-1 ml-1">
                  * {errors.password}
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
                {loading ? t("login.btn_loading") : t("login.btn_login")}
              </span>
            </button>
          </form>
          <div className="my-6 flex items-center justify-center relative">
            <hr className="w-full border-black border-1" />
          </div>

          {/* 👇 Και αμέσως μετά ακολουθεί το κουμπί της Google που ήδη έχεις */}
          <button
            type="button"
            onClick={() => googleLogin()}
            className="w-full flex items-center justify-center gap-3 px-4 py-2.5 bg-white border-2 border-black rounded-xl font-black uppercase text-md shadow-[0px_4px_0px_0px_rgba(0,0,0,1)] cursor-pointer hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google Logo"
              className="w-5 h-5"
            />
            {t("login.continue_with_google") || "Continue with Google"}
          </button>
          <p className="mt-6 text-xs font-bold text-gray-600">
            {t("login.new_user")}{" "}
            <Link
              href="/signup"
              style={{ color: "#0199ff" }}
              className="text-blue-600 underline font-black uppercase ml-1 hover:opacity-60"
            >
              {t("login.create_account")}
            </Link>
          </p>
        </motion.div>

        {/* 🐟 Ψάρι */}
        <motion.div
          variants={itemVariants}
          className="hidden lg:block absolute right-0 xl:right-4 top-1/2 -translate-y-1/2 w-48 h-48 xl:w-56 xl:h-56 z-0 transform rotate-12 transition-transform hover:scale-110"
        >
          <Image
            priority
            src={fish}
            alt="Fish Illustration"
            className="object-contain border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rounded-2xl bg-green-400 p-2"
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
              className="object-contain border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rounded-2xl bg-green-400 p-2"
            />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
export default function LoginPage() {
  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
      <title>Login | Flavr</title>
      <LoginContent />
    </GoogleOAuthProvider>
  );
}
