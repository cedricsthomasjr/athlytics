// src/pages/LandingPage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/home");
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-center items-center">
      <h1 className="text-5xl font-bold mb-6">Welcome to Athlytics</h1>
      <p className="text-lg mb-8 text-gray-400 max-w-xl text-center">
        Explore the modern way to analyze player stats, trends, and award
        histories across the NBA, NFL, CFB, and CBB.
      </p>
      <button
        onClick={handleGetStarted}
        className="px-6 py-3 text-lg font-semibold bg-white text-black rounded-xl hover:bg-gray-300 transition"
      >
        Get Started
      </button>
    </div>
  );
};

export default LandingPage;
