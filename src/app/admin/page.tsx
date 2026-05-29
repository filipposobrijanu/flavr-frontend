"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import person_Img from "../../assets/ideativas-tlm-kitchen-10152776_1920.png";

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
  const [pendingList, setPendingList] = useState<Restaurant[]>([]);
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
      showNotification("You do not have administrator rights!", "error");
      router.push("/restaurants");
      return;
    }
    fetchPendingRestaurants();
  }, []);

  const fetchPendingRestaurants = async () => {
    setLoading(true);
    const res = await fetch("/api/admin", {
      cache: "no-store", // 👈 Forces fresh data fetch
    });
    if (res.ok) {
      const data = await res.json();
      setPendingList(data);
    }
    setLoading(false);
  };

  const handleAction = async (
    restaurantId: string,
    status: "APPROVED" | "REJECTED",
  ) => {
    const res = await fetch("/api/admin", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ restaurantId, status }),
    });

    if (res.ok) {
      showNotification(
        `The application was successfully updated to: ${status === "APPROVED" ? "APPROVED" : "DECLINED"}`,
        "success",
      );
      fetchPendingRestaurants(); // Ανανέωση της λίστας live
    } else {
      showNotification(`Something went wrong during processing.`, "success");
    }
  };

  if (loading) {
    return (
      <div
        style={{ backgroundColor: "rgb(249, 234, 186)" }}
        className="min-h-[calc(80vh-4rem)]  flex items-center justify-center p-8"
      >
        <title>Admin Dashboard | Flavr</title>
        <div className=" border-4 bg-white border-black p-6 rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] font-black text-xl text-black animate-pulse uppercase tracking-wider">
          Loading Admin Panel...
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
              Admin Dashboard
            </h2>
            <p className="text-sm text-black  mt-1">
              New Branch Application Management & Approval Center
            </p>
          </div>
          {/* Badge: System Overseer */}
          <span className="bg-purple-500 border-2 border-black text-white text-xs font-black px-4 py-2 rounded-xl uppercase tracking-wider shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] whitespace-nowrap">
            System Overseer
          </span>
        </div>

        {/* Τίτλος Ενότητας */}
        <h2 className="text-xl md:text-2xl font-black mb-6 text-black uppercase tracking-wide">
          Pending Applications ({pendingList.length})
        </h2>

        {/* Empty State */}
        {pendingList.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl border-4 border-dashed border-black text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <p className="font-black text-xl text-black">All clear!</p>
            <p className="text-sm text-gray-500 font-bold mt-1">
              There are no pending applications for review at this time.
            </p>
          </div>
        ) : (
          /* 📋 Λίστα Αιτήσεων */
          <div className="space-y-6">
            {pendingList.map((res) => (
              <div
                key={res.id}
                className="bg-white p-6 rounded-2xl border-2 border-b-4 border-black flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all"
              >
                {/* Πληροφορίες Αίτησης (Αριστερό Block) */}
                <div className="space-y-2 flex-1 w-full">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-2xl font-black tracking-tight text-black">
                      {res.name}
                    </h3>
                    {/* Badge Κουζίνας */}
                    <span className="bg-yellow-400 border-2 border-black text-black text-xs font-black px-2.5 py-0.5 rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] uppercase">
                      {res.cuisineType}
                    </span>
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
                      Submitted by:{" "}
                      <strong className="text-gray underline underline-offset-2">
                        {res.owner?.username || "N/A"}
                      </strong>{" "}
                      ({res.owner?.email})
                    </span>
                  </div>
                </div>

                {/* Κουμπιά Action (Δεξί Block) */}
                <div className="flex sm:flex-row lg:flex-col xl:flex-row gap-3 w-full lg:w-auto shrink-0 border-t-2 border-dashed border-black/10 lg:border-t-0 pt-4 lg:pt-0">
                  {/* Κουμπί: Έγκριση */}

                  <button
                    onClick={() => handleAction(res.id, "APPROVED")}
                    className="button-main "
                  >
                    <span
                      style={{ backgroundColor: "#05DF72" }}
                      className="button_top px-3 py-2"
                    >
                      APPROVE
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
                      DECLINE
                    </span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
