import React from "react";

const Footer = () => {
  return (
    <footer className="w-full bg-[#111111] text-zinc-400 px-6 py-10 text-sm mt-auto border-t border-zinc-800">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        {/* Left side: copyright */}
        <div className="text-center md:text-left">
          <p className="text-xs text-zinc-500">
            © {new Date().getFullYear()}{" "}
            <span className="font-semibold text-white">Athlytics</span>. All
            rights reserved.
          </p>
        </div>

        {/* Center links */}
        <div className="flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-2 text-xs font-medium">
          <a
            href="/contact"
            className="hover:text-purple-400 transition-all duration-150"
          >
            Contact
          </a>
          <a
            href="/pricing"
            className="hover:text-purple-400 transition-all duration-150"
          >
            Pricing
          </a>
          <a
            href="/docs"
            className="hover:text-purple-400 transition-all duration-150"
          >
            Docs
          </a>
          <a
            href="/privacy"
            className="hover:text-purple-400 transition-all duration-150"
          >
            Privacy
          </a>
        </div>

        {/* Right side: socials or tech badge */}
        <div className="flex items-center space-x-3">
          <span className="text-xs text-zinc-500 hidden md:inline">
            Built with React
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
