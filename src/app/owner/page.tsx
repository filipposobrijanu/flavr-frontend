"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
  globalBayesianScore: number;
  imageUrl?: string;
  openingTime: string;
  closingTime: string;
}

export default function OwnerDashboard() {
  const { t } = useLocale();
  const [image, setImage] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setImage(e.target.files[0]);
  };

  const [openingTime, setOpeningTime] = useState("09:00");
  const [closingTime, setClosingTime] = useState("23:00");

  const uploadToCloudinary = async () => {
    if (!image) return null;

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    console.log("Cloud Name being used:", cloudName);

    const formData = new FormData();
    formData.append("file", image);
    formData.append("upload_preset", "my_flavr_preset");

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        },
      );

      const data = await res.json();

      if (!res.ok) {
        console.error("FULL CLOUDINARY ERROR:", data);
        return null;
      }

      return data.secure_url;
    } catch (error) {
      console.error("Network error during upload:", error);
      return null;
    }
  };

  const [isListLoading, setIsListLoading] = useState(true);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);

  const [restaurantToDelete, setRestaurantToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [cuisineType, setCuisineType] = useState("ITALIAN");
  const [userId, setUserId] = useState<string | null>(null);

  const [errors, setErrors] = useState({
    name: "",
    description: "",
    address: "",
  });

  const router = useRouter();
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const showNotification = (message: string, type: "success" | "error") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const validate = () => {
    let tempErrors = { name: "", description: "", address: "" };
    let isValid = true;

    if (!name.trim()) {
      tempErrors.name = t("owner.err_name");
      isValid = false;
    }
    if (!description.trim()) {
      tempErrors.description = "owner.err_desc";
      isValid = false;
    }
    if (!address.trim()) {
      tempErrors.address = "owner.err_address";
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      showNotification(t("owner.err_form"), "error");
      return;
    }
    console.log("Submitting...");

    const imageUrl = await uploadToCloudinary();
    console.log("Image URL received:", imageUrl);
    const res = await fetch("/api/restaurants", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        description,
        address,
        cuisineType,
        ownerId: userId,
        imageUrl,
        openingTime,
        closingTime,
      }),
    });

    if (res.ok) {
      showNotification(t("owner.success_submit"), "success");
      setName("");
      setDescription("");
      setAddress("");
      if (userId) fetchMyRestaurants(userId);
    } else {
      showNotification(t("owner.fail_submit"), "error");
      const errorData = await res.json();
      console.error("Server Error:", errorData);
    }
  };

  const executeDelete = async () => {
    if (!restaurantToDelete) return;

    try {
      const res = await fetch(`/api/restaurants?id=${restaurantToDelete.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        showNotification(
          t("owner.success_delete") || "Restaurant deleted successfully!",
          "success",
        );
        if (userId) fetchMyRestaurants(userId);
      } else {
        showNotification(
          t("owner.fail_delete") || "Failed to delete restaurant.",
          "error",
        );
      }
    } catch (error) {
      console.error("Error deleting restaurant:", error);
      showNotification(
        t("owner.fail_delete") || "Failed to delete restaurant.",
        "error",
      );
    } finally {
      setRestaurantToDelete(null);
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.push("/login");
      return;
    }
    const user = JSON.parse(storedUser);
    if (user.role !== "OWNER") {
      showNotification(t("owner.no_access"), "error");
      router.push("/restaurants");
      return;
    }
    setUserId(user.id);
    fetchMyRestaurants(user.id);
  }, []);

  const fetchMyRestaurants = async (ownerId: string) => {
    setIsListLoading(true);
    try {
      const res = await fetch(`/api/owner?ownerId=${ownerId}`, {
        cache: "no-store",
      });
      const data = await res.json();
      setRestaurants(data);
    } catch (error) {
      console.error("Error fetching:", error);
    } finally {
      setIsListLoading(false);
    }
  };

  if (!userId) {
    return (
      <div
        style={{ backgroundColor: "rgb(249, 234, 186)" }}
        className="min-h-[calc(90vh-4rem)]  flex items-center justify-center p-8"
      >
        <title>Owner Dashboard | Flavr</title>
        <div className="bg-white border-4 border-black p-6 rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] font-black text-xl text-black animate-pulse uppercase tracking-wider">
          {t("owner.data_control")}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-[calc(90vh-4rem)]  p-6 md:p-12 text-black"
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
      {restaurantToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white border-4 border-black rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 max-w-sm w-full animate-in zoom-in-95 duration-200">
            <h3 className="text-2xl font-black uppercase tracking-tight text-black mb-2">
              {t("owner.modal_title") || "Are you sure?"}
            </h3>
            <p className="text-sm font-bold text-gray-700 mb-6 leading-snug">
              {t("owner.modal_desc_1") || "You are about to delete "}
              <span className="px-1.5 py-0.5 rounded  font-black text-black">
                {restaurantToDelete.name}
              </span>
              {t("owner.modal_desc_2") || ". This action cannot be undone."}
            </p>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setRestaurantToDelete(null)}
                className="flex-1 bg-gray-200 border-2 border-black font-black uppercase text-md py-2 rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer text-black"
              >
                {t("owner.btn_cancel") || "Cancel"}
              </button>
              <button
                type="button"
                onClick={executeDelete}
                className="flex-1 bg-red-500 text-black border-2 border-black font-black uppercase text-md py-2 rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer"
              >
                {t("owner.btn_confirm_delete") || "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
      <title>Owner Dashboard | Flavr</title>
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* 🍳 Φόρμα Υποβολής Νέου Εστιατορίου */}
        <motion.div
          variants={itemVariants}
          className="bg-white p-6 rounded-2xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] h-fit"
        >
          <h2 className="text-3xl text-black mb-6 tracking-tight uppercase">
            {t("owner.new_app")}
          </h2>

          <form onSubmit={handleSubmitApplication} className="space-y-5">
            {/* Όνομα */}
            <div className="text-left">
              <label className="block text-xs font-black uppercase tracking-wider mb-1.5 text-black">
                {t("owner.res_name")}
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border-2 border-black rounded-xl font-bold bg-gray-50 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] focus:bg-white focus:outline-none focus:translate-x-[1px] focus:translate-y-[1px] focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all placeholder:text-gray-400 text-black"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setErrors({ ...errors, name: "" });
                }}
                placeholder="e.g. Pizza Con Amore"
              />
              {errors.name && (
                <p className="text-red-600 text-[10px] font-black mt-1">
                  * {errors.name}
                </p>
              )}
            </div>

            {/* Διεύθυνση */}
            <div className="text-left">
              <label className="block text-xs font-black uppercase tracking-wider mb-1.5 text-black">
                {t("owner.address")}
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border-2 border-black rounded-xl font-bold bg-gray-50 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] focus:bg-white focus:outline-none focus:translate-x-[1px] focus:translate-y-[1px] focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all placeholder:text-gray-400 text-black"
                value={address}
                onChange={(e) => {
                  setAddress(e.target.value);
                  setErrors({ ...errors, address: "" });
                }}
                placeholder="e.g. 12 Panepistimiou, Athens"
              />
              {errors.address && (
                <p className="text-red-600 text-[10px] font-black mt-1">
                  * {errors.address}
                </p>
              )}
            </div>

            {/* Τύπος Κουζίνας */}
            <div className="text-left">
              <label className="block text-xs font-black uppercase tracking-wider mb-1.5 text-black">
                {t("owner.cuisine_type")}
              </label>
              <div className="relative">
                <select
                  className="w-full px-3 py-2 border-2 border-black rounded-xl font-black bg-gray-50 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] focus:bg-white focus:outline-none appearance-none cursor-pointer text-sm text-black"
                  value={cuisineType}
                  onChange={(e) => setCuisineType(e.target.value)}
                >
                  <option value="ITALIAN">ITALIAN</option>
                  <option value="GREEK">GREEK</option>
                  <option value="MEXICAN">MEXICAN</option>
                  <option value="BURGERS">BURGERS</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-black font-bold">
                  ▼
                </div>
              </div>
            </div>
            {/* 🖼️ Image Upload */}
            <div className="text-left">
              <label className="block text-xs font-black uppercase tracking-wider mb-1.5 text-black">
                {t("owner.res_image")}
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full px-3 py-2 border-2 border-black rounded-xl font-bold bg-gray-50 text-sm file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-black file:bg-blue-400 file:text-black hover:file:bg-blue-500 transition-all"
              />
            </div>
            {/* Περιγραφή */}
            <div className="text-left">
              <label className="block text-xs font-black uppercase tracking-wider mb-1.5 text-black">
                {t("owner.description")}
              </label>
              <textarea
                className="w-full px-3 py-2 border-2 border-black rounded-xl font-bold bg-gray-50 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] focus:bg-white focus:outline-none focus:translate-x-[1px] focus:translate-y-[1px] focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all placeholder:text-gray-400 text-black h-24 resize-none"
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  setErrors({ ...errors, description: "" });
                }}
                placeholder="A few words about the menu..."
              />
              {errors.description && (
                <p className="text-red-600 text-[10px] font-black mt-1">
                  * {errors.description}
                </p>
              )}
            </div>
            {/* 🕒 Ώρες Λειτουργίας */}
            <div className="grid grid-cols-2 gap-4">
              <div className="text-left">
                <label className="block text-xs font-black uppercase tracking-wider mb-1.5 text-black">
                  {t("filters.open")}
                </label>
                <input
                  type="time"
                  className="w-full px-3 py-2 border-2 border-black rounded-xl font-bold bg-gray-50 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] focus:bg-white focus:outline-none text-black"
                  value={openingTime}
                  onChange={(e) => setOpeningTime(e.target.value)}
                />
              </div>
              <div className="text-left">
                <label className="block text-xs font-black uppercase tracking-wider mb-1.5 text-black">
                  {t("filters.closed")}
                </label>
                <input
                  type="time"
                  className="w-full px-3 py-2 border-2 border-black rounded-xl font-bold bg-gray-50 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] focus:bg-white focus:outline-none text-black"
                  value={closingTime}
                  onChange={(e) => setClosingTime(e.target.value)}
                />
              </div>
            </div>
            {/* Κουμπί Υποβολής */}
            <button type="submit" className="w-full button-main ">
              <span
                style={{ backgroundColor: "#ff5e01", color: "white" }}
                className="button_top px-3 py-2 "
              >
                {t("owner.btn_submit")}
              </span>
            </button>
          </form>
        </motion.div>

        {/* 📋 Λίστα με τα Υπάρχοντα Μαγαζιά του Ιδιοκτήτη */}
        <motion.div variants={itemVariants} className="lg:col-span-2 space-y-6">
          <h2 className="text-3xl font-black text-white [-webkit-text-stroke:5px_black] [paint-order:stroke_fill] tracking-tight uppercase">
            {t("owner.my_restaurants")}
          </h2>
          {isListLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2].map((i) => (
                <motion.div
                  key={i}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="bg-white p-5 rounded-2xl border-2 border-b-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between animate-pulse"
                >
                  <div className="space-y-4">
                    <div className="flex justify-between items-start gap-2">
                      <div className="h-7 w-3/4 bg-gray-200 rounded-lg"></div>
                      <div className="h-7 w-20 bg-gray-200 rounded-lg"></div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-4 w-1/2 bg-gray-200 rounded Brod"></div>
                      <div className="h-4 w-full bg-gray-200 rounded"></div>
                    </div>
                    <div className="space-y-2 pt-2">
                      <div className="h-4 w-full bg-gray-200 rounded"></div>
                      <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                  <div className="border-t-2 border-black/10 pt-4 mt-4 flex justify-between items-center">
                    <div className="h-4 w-1/3 bg-gray-200 rounded"></div>
                    <div className="h-8 w-16 bg-gray-200 rounded-md"></div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : restaurants.length === 0 ? (
            <div className="bg-white p-12 rounded-2xl border-4 border-dashed border-black text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <p className="font-black text-lg text-black">
                {t("owner.empty_state")}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {restaurants.map((res) => (
                <div
                  key={res.id}
                  className={`bg-white p-5 rounded-2xl border-2 border-b-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all ${
                    res.status === "HIDDEN"
                      ? "opacity-60 bg-gray-50 grayscale"
                      : ""
                  }`}
                >
                  <div>
                    {/* Header Κάρτας */}
                    <div className="flex justify-between items-start gap-2 mb-2">
                      <h3 className="text-xl truncate max-w-[150px] sm:max-w-[100%] font-black tracking-tight text-black line-clamp-1">
                        {res.name}
                      </h3>

                      <span
                        className={`px-2.5 py-1 rounded-lg text-2xs font-black border-2 border-black uppercase tracking-wider shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] shrink-0 ${
                          res.status === "APPROVED"
                            ? "bg-green-400 text-black"
                            : res.status === "PENDING"
                              ? "bg-yellow-400 text-black"
                              : res.status === "HIDDEN"
                                ? "bg-gray-800 text-white"
                                : "bg-red-400 text-black"
                        }`}
                      >
                        {res.status === "APPROVED"
                          ? "APPROVED"
                          : res.status === "PENDING"
                            ? "PENDING"
                            : res.status === "HIDDEN"
                              ? "HIDDEN"
                              : "DECLINED"}
                      </span>
                    </div>

                    {/* Κουζίνα & Τοποθεσία */}
                    <p className="text-xs font-black uppercase tracking-wider text-[#3a8bd6] mb-3">
                      {res.cuisineType} •{" "}
                      <span className="text-gray-600 normal-case font-bold">
                        {res.address}
                      </span>
                    </p>

                    {/* Περιγραφή */}
                    <p className="text-sm font-medium text-gray-700 leading-relaxed line-clamp-2 mb-4">
                      {res.description}
                    </p>
                  </div>

                  <div className="border-t-2 border-black/10 pt-3 flex justify-between items-center text-xs font-black uppercase tracking-wide">
                    <div className="flex items-center gap-2">
                      <span className="bg-yellow-400  border-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] border-black px-2 py-1   rounded-lg text-black font-black flex items-center gap-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="12"
                          height="12"
                          fill="black"
                          className="bi bi-star"
                          viewBox="0 0 16 16"
                        >
                          <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.56.56 0 0 0-.163-.505L1.71 6.745l4.052-.576a.53.53 0 0 0 .393-.288L8 2.223l1.847 3.658a.53.53 0 0 0 .393.288l4.052.575-2.906 2.77a.56.56 0 0 0-.163.506l.694 3.957-3.686-1.894a.5.5 0 0 0-.461 0z" />
                        </svg>{" "}
                        {res.globalBayesianScore > 0
                          ? Number(res.globalBayesianScore).toFixed(1)
                          : "N/A"}
                      </span>
                    </div>

                    {/* 🗑️ Κουμπί Διαγραφής */}
                    <button
                      onClick={() =>
                        setRestaurantToDelete({ id: res.id, name: res.name })
                      }
                      className="bg-red-500  text-black border-2 border-black font-black text-2xs px-2.5 py-1 rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer uppercase tracking-wider"
                    >
                      {t("owner.btn_delete") || "DELETE"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
