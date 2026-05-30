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
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
    <nav className="w-[calc(100%-2rem)] max-w-6xl mx-auto mt-4 px-6 py-3 bg-white border-2 border-b-4 border-black rounded-2xl sticky top-4 z-50 text-black">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-black tracking-tight flex items-center gap-1"
        >
          <Image src={flavr_logo} alt="Flavr Logo" width={36} height={36} />
          <span>Flavr</span>
        </Link>

        {/* Desktop Navigation (Κρυφό σε κινητά) */}
        <div className="hidden md:flex items-center gap-6 font-medium text-gray-600">
          <NavLinks
            user={user}
            pathname={pathname}
            handleLogout={handleLogout}
          />
        </div>

        {/* Mobile Hamburger Button */}
        <button
          className="md:hidden p-2 border-2 border-black rounded-lg"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <div className="space-y-1">
            <span className="block w-6 h-0.5 bg-black"></span>
            <span className="block w-6 h-0.5 bg-black"></span>
            <span className="block w-6 h-0.5 bg-black"></span>
          </div>
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden mt-4 pt-4 border-t-2 border-black flex flex-col gap-4">
          <NavLinks
            user={user}
            pathname={pathname}
            handleLogout={handleLogout}
            isMobile
          />
        </div>
      )}
    </nav>
  );
}
function NavLinks({ user, pathname, handleLogout, isMobile = false }: any) {
  const router = useRouter();

  const baseClass = isMobile
    ? "block py-2"
    : "font-semibold hover:opacity-80 transition-colors";

  return (
    <>
      <Link
        href="/restaurants"
        className={`${pathname === "/restaurants" ? "text-blue-600" : "hover:text-blue-600"} font-semibold hover:opacity-80 transition-colors`}
      >
        Restaurants
      </Link>

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
      {user && (
        <Link
          href="/dashboard"
          className={`${pathname === "/dashboard" ? "text-black" : "hover:text-black"} font-semibold hover:opacity-80 transition-colors`}
        >
          My Profile
        </Link>
      )}
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
            {user.username} <span className="text-xs ml-1">({user.role})</span>
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
        <button onClick={() => router.push("/login")} className="button-main">
          <span className="button_top px-3 py-2 font-black tracking-wider">
            LOGIN
          </span>
        </button>
      )}
    </>
  );
}
