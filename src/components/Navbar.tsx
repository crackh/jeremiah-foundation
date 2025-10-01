"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string>("");
  const pathname = usePathname();

  // Navbar links
  const links = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About Us" },
    { href: "/programs", label: "Programs" },
    { href: "/achievements", label: "Achievements" },
    { href: "/challenges", label: "Challenges" },
    { href: "/get-involved", label: "Get Involved" },
    { href: "/contact", label: "Contact Us" },
  ];

  // Fetch logo from Supabase Storage
  useEffect(() => {
    const fetchLogo = () => {
      const { data } = supabase.storage.from("logo").getPublicUrl("logo.png");
      if (data && data.publicUrl) {
        setLogoUrl(data.publicUrl);
      }
    };

    fetchLogo();
  }, []);

  // Close mobile menu when navigating
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <nav className="bg-gray-900 text-white shadow-md sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo and Name */}
          <Link href="/" className="flex items-center space-x-3">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt="JKFU"
                className="h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 object-contain"
              />
            ) : (
              <div className="h-12 w-12 bg-white rounded-full animate-pulse" /> // placeholder
            )}
            <span className="text-lg sm:text-l md:text-2l font-bold">Jeremiah 29:11 Kids Foundation Uganda</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-2 py-1 transition-colors duration-300 hover:text-blue-200 ${
                  pathname === link.href
                    ? "after:absolute after:-bottom-1 after:left-0 after:w-full after:h-1 after:bg-gray-200"
                    : ""
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden focus:outline-none text-2xl"
            aria-label="Toggle Menu"
          >
            {isOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden bg-gray-800 overflow-hidden transition-all duration-500 ${
          isOpen ? "max-h-96 py-4" : "max-h-0"
        }`}
      >
        <div className="flex flex-col space-y-2 px-4">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-2 py-2 rounded-lg transition-colors duration-300 hover:bg-gray-700 ${
                pathname === link.href ? "bg-gray-600 font-semibold" : ""
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
