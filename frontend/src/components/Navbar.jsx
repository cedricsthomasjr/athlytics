// src/components/Navbar.jsx
import React, { useState } from "react";
import {
  Bars3Icon,
  XMarkIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { label: "Teams", href: "#teams" },
    { label: "Players", href: "#players" },
    { label: "Games", href: "#games" },
    { label: "About / FAQ", href: "#about" },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-[#232323] text-white shadow-lg">
      <div className="flex justify-between items-center max-w-7xl mx-auto px-6 py-4">
        {/* Logo */}
        <a
          href="/home"
          className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-purple-400 via-purple-500 to-pink-600 bg-clip-text text-transparent"
        >
          Athlytics
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-8 text-sm font-medium">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="hover:text-purple-300 transition-colors"
            >
              {link.label}
            </a>
          ))}

          <div className="flex items-center gap-1 bg-purple-700 px-3 py-1 rounded-full text-xs font-semibold shadow-md ml-4">
            <SparklesIcon className="w-4 h-4 text-white" />
            Hero UI Enabled
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? (
            <XMarkIcon className="w-6 h-6" />
          ) : (
            <Bars3Icon className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Mobile Dropdown */}
      <div
        className={`md:hidden transition-all duration-300 ease-in-out ${
          isOpen
            ? "max-h-screen opacity-100"
            : "max-h-0 overflow-hidden opacity-0"
        } px-6 pb-4`}
      >
        <div className="flex flex-col space-y-4 text-base font-medium">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-gray-300 hover:text-white transition"
            >
              {link.label}
            </a>
          ))}

          <div className="flex items-center gap-2 bg-purple-700 px-3 py-1 rounded-full text-xs font-semibold shadow-md w-fit mt-2">
            <SparklesIcon className="w-4 h-4 text-white" />
            Hero UI Enabled
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
