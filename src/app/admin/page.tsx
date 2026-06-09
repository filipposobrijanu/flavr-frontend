"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import person_Img from "../../assets/ideativas-tlm-kitchen-10152776_1920.png";
import { useLocale } from "@/context/LocaleContext";
import { motion, AnimatePresence } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};
interface Restaurant {
  id: string;
  name: string;
  description: string;
  cuisineType: string;
  address: string;
  status: string;
  owner: {
    username: string;
    email: string;
  };
}

export default function AdminDashboard() {
  const { t } = useLocale();

  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [activeTab, setActiveTab] = useState<"PENDING" | "MANAGE">("PENDING");

  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const showNotification = (message: string, type: "success" | "error") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.push("/login");
      return;
    }
    const user = JSON.parse(storedUser);
    if (user.role !== "ADMIN") {
      showNotification(t("admin.no_access") || "No Access", "error");
      router.push("/restaurants");
      return;
    }
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    setLoading(true);
    const res = await fetch("/api/admin", {
      cache: "no-store",
    });
    if (res.ok) {
      const data = await res.json();
      setRestaurants(data);
    }
    setLoading(false);
  };

  const handleAction = async (
    restaurantId: string,
    status: "APPROVED" | "REJECTED" | "HIDDEN",
  ) => {
    const res = await fetch("/api/admin", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ restaurantId, status }),
    });

    if (res.ok) {
      let msg = "";
      if (status === "APPROVED")
        msg = t("admin.update_approved") || "Approved!";
      if (status === "REJECTED")
        msg = t("admin.update_declined") || "Declined!";
      if (status === "HIDDEN") msg = t("admin.update_hidden") || "Hidden!";

      showNotification(msg, "success");
      fetchRestaurants();
    } else {
      showNotification(t("admin.update_error") || "Error", "error");
    }
  };

  const handleDelete = async (restaurantId: string) => {
    if (
      !window.confirm(
        "Είσαι σίγουρος ότι θέλεις να διαγράψεις οριστικά αυτό το εστιατόριο;",
      )
    )
      return;

    const res = await fetch(`/api/admin?id=${restaurantId}`, {
      method: "DELETE",
    });

    if (res.ok) {
      showNotification(
        t("admin.delete_success") || "Deleted successfully!",
        "success",
      );
      fetchRestaurants();
    } else {
      showNotification(t("admin.delete_error") || "Failed to delete", "error");
    }
  };

  const pendingList = restaurants.filter((r) => r.status === "PENDING");
  const manageList = restaurants.filter((r) =>
    ["APPROVED", "HIDDEN"].includes(r.status),
  );
  const displayList = activeTab === "PENDING" ? pendingList : manageList;

  if (loading) {
    return (
      <div className="min-h-[calc(80vh-4rem)] p-6 md:p-12 max-w-6xl mx-auto animate-pulse">
        <title>Loading Admin Panel... | Flavr</title>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-5 pb-6">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="w-16 h-16 bg-gray-300 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rounded-2xl shrink-0"></div>
            <div className="space-y-2 flex-1 sm:flex-initial">
              <div className="h-10 w-56 bg-gray-300 rounded-lg"></div>
              <div className="h-4 w-40 bg-gray-200 rounded"></div>
            </div>
          </div>
          <div className="h-8 w-36 bg-gray-300 border-2 border-black rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"></div>
        </div>

        <div className="flex flex-wrap gap-4 mb-8">
          <div className="h-12 w-44 bg-gray-200 border-2 border-black rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"></div>
          <div className="h-12 w-48 bg-gray-200 border-2 border-black rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"></div>
        </div>

        <div className="space-y-6">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-2xl border-2 border-b-4 border-black flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
            >
              <div className="space-y-3 flex-1 w-full">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="h-8 w-48 bg-gray-300 rounded-lg"></div>
                  <div className="h-6 w-20 bg-gray-200 border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"></div>
                </div>

                <div className="h-4 w-32 bg-gray-200 rounded"></div>

                <div className="space-y-2">
                  <div className="h-4 w-full bg-gray-200 rounded"></div>
                  <div className="h-4 w-5/6 bg-gray-200 rounded"></div>
                </div>

                <div className="pt-3 border-t border-black/10 mt-3 flex items-center gap-2">
                  <div className="h-4 w-64 bg-gray-200 rounded"></div>
                </div>
              </div>

              <div className="flex flex-wrap sm:flex-row lg:flex-col xl:flex-row gap-3 w-full lg:w-auto shrink-0 border-t-2 border-dashed border-black/10 lg:border-t-0 pt-4 lg:pt-0">
                <div className="h-10 w-24 bg-gray-300 border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"></div>
                <div className="h-10 w-24 bg-gray-300 border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-[calc(80vh-4rem)] p-6 md:p-12 text-black"
    >
      {notification && (
        <div
          className={`fixed bottom-20 right-6 z-50 p-4 border-4 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-black ${
            notification.type === "success"
              ? "bg-green-500  text-black"
              : "bg-red-500  text-white"
          }`}
        >
          {notification.message}
        </div>
      )}
      <title>Admin Dashboard | Flavr</title>
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-5 border-black pb-6">
          <div>
            <h2 className="text-4xl md:text-5xl text-white items-center inline-flex gap-3 [-webkit-text-stroke:5px_black] [paint-order:stroke_fill] tracking-tight uppercase">
              <Image
                priority
                src={person_Img}
                alt="Banana Illustration"
                className="object-contain border-2 w-16 h-16 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rounded-2xl bg-green-400 p-1"
              />
              {t("admin.page_title")}
            </h2>
            <p className="text-sm text-black  mt-1">{t("admin.subtitle")}</p>
          </div>
          <span className="bg-purple-500 border-2 border-black text-white text-xs font-black px-4 py-2 rounded-xl uppercase tracking-wider shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] whitespace-nowrap">
            {t("admin.badge_overseer")}
          </span>
        </div>

        <div className="flex flex-wrap gap-4 mb-8">
          <button
            onClick={() => setActiveTab("PENDING")}
            className={`px-6 py-3 cursor-pointer border-2 border-black font-black uppercase tracking-wider rounded-xl transition-all ${
              activeTab === "PENDING"
                ? "bg-yellow-400 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] translate-x-[-2px] translate-y-[-2px]"
                : "bg-white text-gray-500 hover:bg-gray-100 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
            }`}
          >
            {t("admin.pending_apps")} ({pendingList.length})
          </button>
          <button
            onClick={() => setActiveTab("MANAGE")}
            className={`px-6 py-3 cursor-pointer border-2 border-black font-black uppercase tracking-wider rounded-xl transition-all ${
              activeTab === "MANAGE"
                ? "bg-blue-400 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] translate-x-[-2px] translate-y-[-2px]"
                : "bg-white text-gray-500 hover:bg-gray-100 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
            }`}
          >
            {t("admin.manage_restaurants") || "Manage Active"} (
            {manageList.length})
          </button>
        </div>

        {displayList.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl border-4 border-dashed border-black text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <p className="font-black text-xl text-black">
              {activeTab === "PENDING"
                ? t("admin.all_clear")
                : "No active restaurants yet."}
            </p>
            {activeTab === "PENDING" && (
              <p className="text-sm text-gray-500 font-bold mt-1">
                {t("admin.no_pending")}
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {displayList.map((res) => (
              <motion.div
                key={res.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className={`bg-white p-6 rounded-2xl border-2 border-b-4 border-black flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all ${
                  res.status === "HIDDEN"
                    ? "opacity-60 bg-gray-50 grayscale"
                    : ""
                }`}
              >
                <div className="space-y-2 flex-1 w-full">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-2xl truncate font-black tracking-tight text-black">
                      {res.name}
                    </h3>
                    <span className="bg-blue-400 border-2 border-black text-black text-xs font-black px-2.5 py-0.5 rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] uppercase">
                      {res.cuisineType}
                    </span>
                    {res.status === "HIDDEN" && (
                      <span className="bg-gray-800 border-2 border-black text-white text-xs font-black px-2.5 py-0.5 rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] uppercase">
                        HIDDEN
                      </span>
                    )}
                  </div>

                  <p className="text-xs font-black uppercase tracking-wider text-[#3a8bd6]">
                    {res.address}
                  </p>

                  <p className="text-sm font-medium text-gray-700 leading-relaxed line-clamp-2">
                    {res.description}
                  </p>

                  <div className="pt-3 flex items-center gap-2 text-xs font-bold text-black border-t border-black/10 mt-3">
                    <span>
                      {t("admin.submitted_by")}{" "}
                      <strong className="text-gray underline underline-offset-2">
                        {res.owner?.username || "N/A"}
                      </strong>{" "}
                      ({res.owner?.email})
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap sm:flex-row lg:flex-col xl:flex-row gap-3 w-full lg:w-auto shrink-0 border-t-2 border-dashed border-black/10 lg:border-t-0 pt-4 lg:pt-0">
                  {activeTab === "PENDING" ? (
                    <>
                      <button
                        onClick={() => handleAction(res.id, "APPROVED")}
                        className="button-main"
                      >
                        <span
                          style={{ backgroundColor: "#05DF72" }}
                          className="button_top px-3 py-2"
                        >
                          {t("admin.btn_approve")}
                        </span>
                      </button>
                      <button
                        onClick={() => handleAction(res.id, "REJECTED")}
                        className="button-main"
                      >
                        <span
                          style={{ backgroundColor: "#ec3030", color: "white" }}
                          className="button_top px-3 py-2"
                        >
                          {t("admin.btn_decline")}
                        </span>
                      </button>
                    </>
                  ) : (
                    <>
                      {res.status === "APPROVED" ? (
                        <button
                          onClick={() => handleAction(res.id, "HIDDEN")}
                          className="button-main"
                        >
                          <span
                            style={{
                              backgroundColor: "#fbbf24",
                              color: "black",
                            }}
                            className="button_top px-3 py-2"
                          >
                            {t("admin.btn_hide") || "Hide"}
                          </span>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleAction(res.id, "APPROVED")}
                          className="button-main"
                        >
                          <span
                            style={{
                              backgroundColor: "#60a5fa",
                              color: "black",
                            }}
                            className="button_top px-3 py-2"
                          >
                            {t("admin.btn_unhide") || "Unhide"}
                          </span>
                        </button>
                      )}

                      <button
                        onClick={() => handleDelete(res.id)}
                        className="button-main"
                      >
                        <span
                          style={{ backgroundColor: "#ec3030", color: "white" }}
                          className="button_top px-3 py-2"
                        >
                          {t("admin.btn_delete") || "Delete"}
                        </span>
                      </button>
                    </>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
