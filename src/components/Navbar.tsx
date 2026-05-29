"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import flavr_logo from "../assets/flavr_logo.png";
import Image from "next/image";

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const pathname = usePathname();

  // 🔥 Τρέχει ΚΑΘΕ ΦΟΡΑ που αλλάζει η σελίδα (route change)
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      setUser(null); // Αν δεν υπάρχει χρήστης, καθαρίζει το state
    }
  }, [pathname]); // <-- Το μυστικό είναι εδώ!

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null); // Καθαρίζουμε το state αμέσως
    router.push("/"); // Φεύγουμε χωρίς κανένα άσχημο page reload!
  };

  return (
    <nav className="w-[calc(100%-2rem)] max-w-6xl mx-auto mt-4 px-7 py-1 bg-white backdrop-blur-md border-2 border-b-4 border-black rounded-2xl sticky top-4 z-50 text-black">
      <div className="w-full h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-black tracking-tight flex items-center gap-1"
        >
          <Image src={flavr_logo} alt="Flavr Logo" width={40} height={40} />
          <span className="text-black">Flavr</span>
        </Link>

        {/* Links & Auth Section */}
        <div className="flex items-center gap-6 font-medium text-gray-600">
          <Link
            href="/restaurants"
            className={`${pathname === "/restaurants" ? "text-blue-600" : "hover:text-blue-600"} font-semibold hover:opacity-80 transition-colors`}
          >
            Restaurants
          </Link>

          {/* Dynamic Dashboard Links */}
          {user?.role === "OWNER" && (
            <Link
              href="/owner"
              className={`${pathname === "/owner" ? "text-orange-600" : "hover:text-orange-600"} font-semibold hover:opacity-80 transition-colors`}
            >
              Owner Dashboard
            </Link>
          )}

          {user?.role === "ADMIN" && (
            <Link
              href="/admin"
              className={`${pathname === "/admin" ? "text-purple-600" : "hover:text-purple-600"} font-semibold hover:opacity-80 transition-colors`}
            >
              Admin Dashboard
            </Link>
          )}

          {/* GitHub Icon */}
          <Link
            href="https://github.com/filipposobrijanu"
            target="_blank"
            className="text-sm font-bold underline-offset-4 hover:opacity-80 text-black"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="currentColor"
              className="bi bi-github"
              viewBox="0 0 16 16"
            >
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8" />
            </svg>
          </Link>

          {/* Conditional Login / Logout Button */}
          {user ? (
            <div className="flex items-center gap-4">
              <div className="inline-flex items-center gap-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-bold text-black bg-gray-100 border-2 border-black px-3 py-1 rounded-xl text-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  fill="black"
                  className="bi bi-file-person-fill"
                  viewBox="0 0 16 16"
                >
                  <path d="M12 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2m-1 7a3 3 0 1 1-6 0 3 3 0 0 1 6 0m-3 4c2.623 0 4.146.826 5 1.755V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-1.245C3.854 11.825 5.377 11 8 11" />
                </svg>
                {user.username}{" "}
                <span className="text-xs ml-1">({user.role})</span>
              </div>

              <button onClick={handleLogout} className="button-main">
                <span
                  style={{ backgroundColor: "#ec3030", color: "white" }}
                  className="button_top px-3 py-2 font-black tracking-wider"
                >
                  EXIT
                </span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => router.push("/login")}
              className="button-main"
            >
              <span className="button_top px-3 py-2 font-black tracking-wider">
                LOGIN
              </span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
