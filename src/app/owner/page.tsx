"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Restaurant {
  id: string;
  name: string;
  description: string;
  cuisineType: string;
  address: string;
  status: string;
  globalBayesianScore: number;
  imageUrl?: string;
}

export default function OwnerDashboard() {
  const [image, setImage] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setImage(e.target.files[0]);
  };

  const uploadToCloudinary = async () => {
    if (!image) return null;

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    console.log("Cloud Name being used:", cloudName); // Δες αν είναι σωστό στο Console

    const formData = new FormData();
    formData.append("file", image);
    formData.append("upload_preset", "my_flavr_preset"); // Σιγουρέψου ότι αυτό υπάρχει στο dashboard σου!

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
        // ΕΔΩ ΘΑ ΔΟΥΜΕ ΤΟ ΠΡΑΓΜΑΤΙΚΟ ΛΑΘΟΣ (π.χ. "invalid cloud name" ή "preset not found")
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

  // Input states
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [cuisineType, setCuisineType] = useState("ITALIAN");
  const [userId, setUserId] = useState<string | null>(null);

  // Validation State
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
      tempErrors.name = "Name is required";
      isValid = false;
    }
    if (!description.trim()) {
      tempErrors.description = "Description is required";
      isValid = false;
    }
    if (!address.trim()) {
      tempErrors.address = "Address is required";
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      showNotification("Please check the form for errors!", "error");
      return;
    }
    // 1. Δείτε αν ξεκινάει η διαδικασία
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
      }),
    });

    if (res.ok) {
      showNotification("Restaurant submitted successfully!", "success");
      setName("");
      setDescription("");
      setAddress("");
      if (userId) fetchMyRestaurants(userId);
    } else {
      showNotification("Failed to submit application.", "error");
      const errorData = await res.json();
      console.error("Server Error:", errorData);
    }
  };

  // Έλεγχος αν ο χρήστης είναι πράγματι OWNER
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.push("/login");
      return;
    }
    const user = JSON.parse(storedUser);
    if (user.role !== "OWNER") {
      showNotification("Δεν έχετε πρόσβαση σε αυτή τη σελίδα!", "error");
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
          Data Control...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(90vh-4rem)]  p-6 md:p-12 text-black">
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
      <title>Owner Dashboard | Flavr</title>
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* 🍳 Φόρμα Υποβολής Νέου Εστιατορίου */}
        <div className="bg-white p-6 rounded-2xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] h-fit">
          <h2 className="text-3xl text-black mb-6 tracking-tight uppercase">
            New Application
          </h2>

          <form onSubmit={handleSubmitApplication} className="space-y-5">
            {/* Όνομα */}
            <div className="text-left">
              <label className="block text-xs font-black uppercase tracking-wider mb-1.5 text-black">
                Restaurant Name
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
                Address
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
                Type of Cuisine
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
                Restaurant Image
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
                Description
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

            {/* Κουμπί Υποβολής */}

            <button type="submit" className="w-full button-main ">
              <span
                style={{ backgroundColor: "#ff5e01", color: "white" }}
                className="button_top px-3 py-2 "
              >
                SUBMIT FOR APPROVAL
              </span>
            </button>
          </form>
        </div>

        {/* 📋 Λίστα με τα Υπάρχοντα Μαγαζιά του Ιδιοκτήτη */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-3xl font-black text-white [-webkit-text-stroke:5px_black] [paint-order:stroke_fill] tracking-tight uppercase">
            My Restaurants
          </h2>
          {isListLoading ? (
            /* ⏳ HIGH-FIDELITY LOADING SKELETON */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="bg-white p-5 rounded-2xl border-2 border-b-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between animate-pulse"
                >
                  <div className="space-y-4">
                    {/* Header Skeleton */}
                    <div className="flex justify-between items-start gap-2">
                      <div className="h-7 w-3/4 bg-gray-200 rounded-lg"></div>
                      <div className="h-7 w-20 bg-gray-200 rounded-lg"></div>
                    </div>

                    {/* Cuisine & Address Skeleton */}
                    <div className="space-y-2">
                      <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
                      <div className="h-4 w-full bg-gray-200 rounded"></div>
                    </div>

                    {/* Description Lines Skeleton */}
                    <div className="space-y-2 pt-2">
                      <div className="h-4 w-full bg-gray-200 rounded"></div>
                      <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
                    </div>
                  </div>

                  {/* Footer Skeleton */}
                  <div className="border-t-2 border-black/10 pt-4 mt-4 flex justify-between items-center">
                    <div className="h-4 w-1/3 bg-gray-200 rounded"></div>
                    <div className="h-8 w-16 bg-gray-200 rounded-md"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : restaurants.length === 0 ? (
            <div className="bg-white p-12 rounded-2xl border-4 border-dashed border-black text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <p className="font-black text-lg text-black">
                You have not registered a restaurant yet.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {restaurants.map((res) => (
                <div
                  key={res.id}
                  className="bg-white p-5 rounded-2xl border-2 border-b-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all"
                >
                  <div>
                    {/* Header Κάρτας */}
                    <div className="flex justify-between items-start gap-2 mb-2">
                      <h3 className="text-xl font-black tracking-tight text-black line-clamp-1">
                        {res.name}
                      </h3>

                      {/* Status Badge με Neobrutalist Sticker Style */}
                      <span
                        className={`px-2.5 py-1 rounded-lg text-2xs font-black border-2 border-black uppercase tracking-wider shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] shrink-0 ${
                          res.status === "APPROVED"
                            ? "bg-green-400 text-black"
                            : res.status === "PENDING"
                              ? "bg-yellow-400 text-black"
                              : "bg-red-400 text-black"
                        }`}
                      >
                        {res.status === "APPROVED"
                          ? "APPROVED"
                          : res.status === "PENDING"
                            ? "PENDING"
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

                  {/* Bayesian Score Footer Row */}
                  <div className="border-t-2 border-black/10 pt-3 flex justify-between items-center text-xs font-black uppercase tracking-wide">
                    <span className="text-gray-500 font-bold">
                      Bayesian Score:
                    </span>
                    <span className="bg-amber-100 border-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] border-black px-2 py-0.5 rounded-md text-amber-900 font-black">
                      ⭐{" "}
                      {res.globalBayesianScore > 0
                        ? Number(res.globalBayesianScore).toFixed(1)
                        : "N/A"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
