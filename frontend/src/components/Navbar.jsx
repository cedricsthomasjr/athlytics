// src/components/Navbar.jsx
import React, { useState } from "react";
import {
  Bars3Icon,
  XMarkIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-black text-white py-4 px-6 shadow-md">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        <a
          href="/home"
          className="text-3xl font-extrabold tracking-wide bg-gradient-to-r from-purple-400 via-purple-500 to-pink-600 animate-gradientText"
        >
          Athlytics
        </a>

        {/* Desktop Links */}
        <div className="hidden md:flex space-x-8 text-lg items-center">
          <a href="#teams" className="hover:text-gray-300">
            Teams
          </a>
          <a href="#players" className="hover:text-gray-300">
            Players
          </a>
          <a href="#games" className="hover:text-gray-300">
            Games
          </a>
          <a href="#about" className="hover:text-gray-300">
            About/FAQ
          </a>
          <div className="flex items-center gap-1 bg-purple-700 px-3 py-1 rounded-full text-sm font-semibold shadow-lg ml-4">
            <SparklesIcon className="w-4 h-4 text-white" />
            Hero UI Enabled
          </div>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <XMarkIcon className="w-6 h-6" />
          ) : (
            <Bars3Icon className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden mt-2 px-6 space-y-4 text-lg">
          <a href="#nba" className="block text-gray-300 hover:text-white">
            Players
          </a>
          <a href="#nfl" className="block text-gray-300 hover:text-white">
            Stats
          </a>
          <a href="#cfb" className="block text-gray-300 hover:text-white">
            Team
          </a>
          <a href="#cbb" className="block text-gray-300 hover:text-white">
            About
          </a>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
