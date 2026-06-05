"use client";
import { useState } from "react";
import Image from "next/image";
import rest_Image from "../../assets/ideativas-tlm-hot-dog-sandwich-6402792_1920.png";
import { useAuth } from "@/context/AuthContext";

export default function SettingsPage() {
  const [loading, setLoading] = useState(false);
  const { logout } = useAuth();
  const handleDeleteAccount = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/user/delete", { method: "DELETE" });
      if (res.ok) {
        logout();
        window.location.href = "/";
      } else {
        alert("Failed to delete account.");
      }
    } catch (err) {
      alert("An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-6 md:p-12 max-w-6xl mx-auto min-h-[calc(80vh-4rem)]">
      {/* Title Styling */}
      <div className="mb-6 pb-8">
        <h2 className="text-4xl mb-6 md:text-5xl text-white items-center inline-flex gap-3 [-webkit-text-stroke:5px_black] [paint-order:stroke_fill] tracking-tight uppercase">
          <Image
            priority
            src={rest_Image}
            alt="Waffle Illustration"
            className="object-contain border-2 w-16 h-16 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rounded-2xl bg-orange-400 p-1"
          />
          Account Settings
        </h2>

        <div className="space-y-8">
          {/* Danger Zone Card */}
          <div className="bg-red-500 border-2 border-black p-6 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <h3 className="text-xl font-black mb-2 text-black uppercase">
              Danger Zone
            </h3>
            <p className="text-sm font-bold text-black opacity-80 mb-6">
              Once you delete your account, there is no going back. All your
              data will be wiped.
            </p>
            <button
              onClick={handleDeleteAccount}
              disabled={loading}
              className="bg-black cursor-pointer text-white px-6 py-3 font-black rounded-xl border-2 border-white shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:translate-y-[-2px] disabled:opacity-50 transition-all"
            >
              {loading ? "PROCESSING..." : "DELETE ACCOUNT"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
