// src/components/Footer.jsx
import React from "react";

const Footer = () => {
  return (
    <footer className="w-full bg-[#1a1a1a] text-gray-400 py-6 px-4 text-center text-sm mt-auto">
      <div className="max-w-5xl mx-auto">
        <p className="mb-3">© 2025 Athlytics. All rights reserved.</p>
        <div className="flex justify-center space-x-6 text-xs">
          <a href="/contact" className="hover:text-purple-400 transition">
            Contact
          </a>
          <a href="/pricing" className="hover:text-purple-400 transition">
            Pricing
          </a>
          <a href="/docs" className="hover:text-purple-400 transition">
            Docs
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
