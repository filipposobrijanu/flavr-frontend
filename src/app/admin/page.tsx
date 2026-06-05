"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import person_Img from "../../assets/ideativas-tlm-kitchen-10152776_1920.png";
import { useLocale } from "@/context/LocaleContext";

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

  // 🆕 ΑΛΛΑΓΗ 1: Το pendingList έγινε restaurants γιατί πλέον φέρνουμε όλα τα εστιατόρια
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  // 🆕 ΑΛΛΑΓΗ 2: Νέο state για να ελέγχουμε ποιο Tab είναι ανοιχτό
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

  // Έλεγχος δικαιωμάτων πρόσβασης (Role Validation)
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
    // 🆕 ΑΛΛΑΓΗ 3: Μετονομασία της κλήσης
    fetchRestaurants();
  }, []);

  // 🆕 ΑΛΛΑΓΗ 4: Μετονομασία της συνάρτησης
  const fetchRestaurants = async () => {
    setLoading(true);
    const res = await fetch("/api/admin", {
      cache: "no-store", // 👈 Forces fresh data fetch
    });
    if (res.ok) {
      const data = await res.json();
      setRestaurants(data); // 🆕 ΑΛΛΑΓΗ 5: Αποθήκευση στο νέο state
    }
    setLoading(false);
  };

  // 🆕 ΑΛΛΑΓΗ 6: Προσθήκη του "HIDDEN" στους αποδεκτούς τύπους status
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
      // 🆕 ΑΛΛΑΓΗ 7: Δυναμικό μήνυμα ανάλογα με την ενέργεια
      let msg = "";
      if (status === "APPROVED")
        msg = t("admin.update_approved") || "Approved!";
      if (status === "REJECTED")
        msg = t("admin.update_declined") || "Declined!";
      if (status === "HIDDEN") msg = t("admin.update_hidden") || "Hidden!";

      showNotification(msg, "success");
      fetchRestaurants(); // Ανανέωση της λίστας live
    } else {
      showNotification(t("admin.update_error") || "Error", "error");
    }
  };

  // 🆕 ΑΛΛΑΓΗ 8: Νέα συνάρτηση για οριστική διαγραφή του εστιατορίου (DELETE)
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

  // 🆕 ΑΛΛΑΓΗ 9: Διαχωρισμός της λίστας ανάλογα με το status
  const pendingList = restaurants.filter((r) => r.status === "PENDING");
  const manageList = restaurants.filter((r) =>
    ["APPROVED", "HIDDEN"].includes(r.status),
  );
  // Αυτή είναι η λίστα που θα γίνει .map() στο HTML
  const displayList = activeTab === "PENDING" ? pendingList : manageList;

  if (loading) {
    return (
      <div className="min-h-[calc(80vh-4rem)] p-6 md:p-12 max-w-5xl mx-auto animate-pulse">
        <title>Loading Admin Panel... | Flavr</title>

        {/* Header Skeleton */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-10">
          <div className="h-16 w-64 bg-gray-200 rounded-2xl"></div>
          <div className="h-10 w-32 bg-gray-200 rounded-xl"></div>
        </div>

        <div className="h-8 w-48 bg-gray-200 rounded-lg mb-6"></div>

        {/* List Skeletons */}
        <div className="space-y-6">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-2xl border-2 border-b-4 border-black flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
            >
              <div className="space-y-3 flex-1 w-full">
                <div className="flex gap-3">
                  <div className="h-8 w-1/3 bg-gray-200 rounded-lg"></div>
                  <div className="h-8 w-20 bg-gray-200 rounded-lg"></div>
                </div>
                <div className="h-4 w-1/4 bg-gray-200 rounded"></div>
                <div className="h-12 w-full bg-gray-200 rounded-lg"></div>
                <div className="pt-3 border-t border-black/10 mt-3 h-4 w-1/2 bg-gray-200 rounded"></div>
              </div>

              {/* Action Buttons Skeleton */}
              <div className="flex gap-3 w-full lg:w-auto">
                <div className="h-10 w-24 bg-gray-200 rounded-lg"></div>
                <div className="h-10 w-24 bg-gray-200 rounded-lg"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(80vh-4rem)] p-6 md:p-12 text-black">
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
        {/* 🛡️ Header Πίνακα Ελέγχου */}
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
          {/* Badge: System Overseer */}
          <span className="bg-purple-500 border-2 border-black text-white text-xs font-black px-4 py-2 rounded-xl uppercase tracking-wider shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] whitespace-nowrap">
            {t("admin.badge_overseer")}
          </span>
        </div>

        {/* 🆕 ΑΛΛΑΓΗ 10: TABS για εναλλαγή προβολής */}
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

        {/* Empty State δυναμικό βάσει του Tab */}
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
          /* 📋 Λίστα Δυναμική */
          <div className="space-y-6">
            {displayList.map((res) => (
              <div
                key={res.id}
                // 🆕 ΑΛΛΑΓΗ 11: Αν το status είναι HIDDEN, δίνουμε εφέ θαμπώματος στην κάρτα
                className={`bg-white p-6 rounded-2xl border-2 border-b-4 border-black flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all ${
                  res.status === "HIDDEN"
                    ? "opacity-60 bg-gray-50 grayscale"
                    : ""
                }`}
              >
                {/* Πληροφορίες Αίτησης (Αριστερό Block) */}
                <div className="space-y-2 flex-1 w-full">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-2xl font-black tracking-tight text-black">
                      {res.name}
                    </h3>
                    {/* Badge Κουζίνας */}
                    <span className="bg-blue-400 border-2 border-black text-black text-xs font-black px-2.5 py-0.5 rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] uppercase">
                      {res.cuisineType}
                    </span>
                    {/* 🆕 ΑΛΛΑΓΗ 12: Ένδειξη HIDDEN δίπλα στον τίτλο */}
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

                  {/* Στοιχεία Ιδιοκτήτη (Footer Κάρτας) */}
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

                {/* 🆕 ΑΛΛΑΓΗ 13: Δυναμικά Κουμπιά Action ανάλογα με το ενεργό Tab */}
                <div className="flex flex-wrap sm:flex-row lg:flex-col xl:flex-row gap-3 w-full lg:w-auto shrink-0 border-t-2 border-dashed border-black/10 lg:border-t-0 pt-4 lg:pt-0">
                  {activeTab === "PENDING" ? (
                    // Κουμπιά για εκκρεμείς αιτήσεις
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
                    // Κουμπιά για διαχείριση εγκεκριμένων (Hide / Unhide / Delete)
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
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
