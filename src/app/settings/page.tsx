"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import rest_Image from "../../assets/ideativas-tlm-hot-dog-sandwich-6402792_1920.png";
import { useAuth } from "@/context/AuthContext";
import { useTranslations } from "next-intl"; // <-- Προσάρμοσε αυτό το import ανάλογα το library σου
import { useLocale } from "@/context/LocaleContext";

export default function SettingsPage() {
  const { t } = useLocale();
  const { user, logout } = useAuth();

  // Loading states
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Form states
  const [username, setUsername] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // Notification State
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const showNotification = (message: string, type: "success" | "error") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  useEffect(() => {
    if (user?.username) setUsername(user.username);
  }, [user]);

  // --- Handlers ---

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileLoading(true);
    try {
      const res = await fetch("/api/user/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      });
      const data = await res.json();

      if (res.ok) {
        showNotification(t("SettingsPage.profileUpdated"), "success");

        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          parsedUser.username = username;
          localStorage.setItem("user", JSON.stringify(parsedUser));
        }

        setTimeout(() => window.location.reload(), 1000);
      } else {
        showNotification(
          data.message || t("SettingsPage.profileUpdateFailed"),
          "error",
        );
      }
    } catch (err) {
      showNotification(t("SettingsPage.errorOccurred"), "error");
    } finally {
      setProfileLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordLoading(true);
    try {
      const res = await fetch("/api/user/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        showNotification(t("SettingsPage.passwordUpdated"), "success");
        setCurrentPassword("");
        setNewPassword("");
      } else {
        showNotification(
          data.message || t("SettingsPage.passwordUpdateFailed"),
          "error",
        );
      }
    } catch (err) {
      showNotification(t("SettingsPage.errorOccurred"), "error");
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm(t("SettingsPage.deleteConfirm"))) return;

    setDeleteLoading(true);
    try {
      const res = await fetch("/api/user/delete", { method: "DELETE" });
      if (res.ok) {
        logout();
        window.location.href = "/";
      } else {
        showNotification(t("SettingsPage.deleteFailed"), "error");
      }
    } catch (err) {
      showNotification(t("SettingsPage.errorOccurred"), "error");
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <main className="relative p-6 md:p-12 max-w-4xl mx-auto min-h-[calc(80vh-4rem)]">
      {/* Notification UI */}
      {notification && (
        <div
          className={`fixed bottom-20 right-6 z-50 p-4 border-4 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-black transition-all ${
            notification.type === "success"
              ? "bg-green-500 text-black"
              : "bg-red-500 text-white"
          }`}
        >
          {notification.message}
        </div>
      )}

      <div className="mb-6 pb-8">
        <h2 className="text-4xl mb-6 md:text-5xl text-white items-center inline-flex gap-3 [-webkit-text-stroke:5px_black] [paint-order:stroke_fill] tracking-tight uppercase">
          <Image
            priority
            src={rest_Image}
            alt="Settings Illustration"
            className="object-contain border-2 w-16 h-16 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rounded-2xl bg-orange-400 p-1"
          />
          {t("SettingsPage.title")}
        </h2>

        <div className="space-y-8">
          {/* --- Profile Update Card --- */}
          <div className="bg-yellow-400 border-2 border-black p-6 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <h3 className="text-xl font-black mb-4 text-black uppercase">
              {t("SettingsPage.editProfile")}
            </h3>
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="block font-bold text-gray-800 mb-1">
                  {t("SettingsPage.username")}
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-white border-2 border-black px-4 py-2 font-bold rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-black focus:outline-none focus:translate-y-[2px] focus:shadow-none transition-all"
                  required
                />
              </div>

              <button
                type="submit"
                className="button-main"
                disabled={profileLoading}
              >
                <span
                  style={{ backgroundColor: "white", color: "black" }}
                  className="button_top block px-3 py-2 font-black tracking-wider text-center"
                >
                  {profileLoading
                    ? t("SettingsPage.saving")
                    : t("SettingsPage.saveChanges")}
                </span>
              </button>
            </form>
          </div>

          {/* --- Security Card --- */}
          <div className="bg-blue-400 border-2 border-black p-6 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <h3 className="text-xl font-black mb-4 text-black uppercase">
              {t("SettingsPage.security")}
            </h3>
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div>
                <label className="block font-bold text-gray-800 mb-1">
                  {t("SettingsPage.currentPassword")}
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full bg-white border-2 border-black px-4 py-2 font-bold rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:translate-y-[2px] focus:shadow-none transition-all text-black"
                  required
                />
              </div>
              <div>
                <label className="block font-bold text-gray-800 mb-1">
                  {t("SettingsPage.newPassword")}
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-white border-2 border-black px-4 py-2 font-bold rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:translate-y-[2px] focus:shadow-none transition-all text-black"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={passwordLoading}
                className="button-main"
              >
                <span
                  style={{ backgroundColor: "white", color: "black" }}
                  className="button_top block px-3 py-2 font-black tracking-wider text-center"
                >
                  {passwordLoading
                    ? t("SettingsPage.updating")
                    : t("SettingsPage.updatePassword")}
                </span>
              </button>
            </form>
          </div>

          {/* --- Danger Zone Card --- */}
          <div className="bg-red-500 border-2 border-black p-6 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <h3 className="text-xl font-black mb-2 text-black uppercase">
              {t("SettingsPage.dangerZone")}
            </h3>
            <p className="text-sm font-bold text-black opacity-80 mb-6">
              {t("SettingsPage.dangerWarning")}
            </p>

            <button
              type="button"
              onClick={handleDeleteAccount}
              disabled={deleteLoading}
              className="button-main"
            >
              <span
                style={{ backgroundColor: "black", color: "white" }}
                className="button_top block px-3 py-2 font-black tracking-wider text-center"
              >
                {deleteLoading
                  ? t("SettingsPage.processing")
                  : t("SettingsPage.deleteAccount")}
              </span>
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
