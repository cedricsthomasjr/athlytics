// src/pages/LandingPage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";

// Sample chart data
const statData = [
  { name: "2019", points: 22, assists: 5 },
  { name: "2020", points: 25, assists: 6 },
  { name: "2021", points: 28, assists: 7 },
  { name: "2022", points: 30, assists: 8 },
  { name: "2023", points: 27, assists: 9 },
];

const awardsTimeline = [
  { year: "2019", awards: [] },
  { year: "2020", awards: ["All-NBA"] },
  { year: "2021", awards: ["MVP", "All-NBA"] },
  { year: "2022", awards: ["DPOY", "All-NBA"] },
  { year: "2023", awards: ["All-NBA"] },
];

const LandingPage = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/home");
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Navbar />

      <div className="flex flex-1 flex-col-reverse lg:flex-row items-center justify-between w-full px-8 lg:px-20 py-20 gap-8">
        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex-1 max-w-2xl"
        >
          <h1 className="text-5xl lg:text-6xl font-extrabold leading-tight mb-4">
            Stats don’t lie.
          </h1>
          <h2 className="text-xl text-gray-400 mb-8">
            Let them speak the truth.
          </h2>

          <p className="text-lg text-gray-300 leading-relaxed mb-10">
            Athlytics is built for the modern fan — where{" "}
            <span className="text-purple-400">AI-powered analysis</span>,{" "}
            <span className="text-red-400">real-time data pipelines</span>, and{" "}
            <span className="text-pink-400">predictive modeling</span> converge
            to decode the game like never before. Explore interactive
            visualizations, award timelines, player comparisons, and
            machine-learned performance insights — all in one{" "}
            <span className="text-fuchsia-400">hoops intelligence engine</span>.
          </p>

          <button
            onClick={handleGetStarted}
            className="px-8 py-3 text-lg font-semibold rounded-xl bg-gradient-to-r from-purple-600 via-fuchsia-600 to-red-500 hover:brightness-110 transition shadow-xl"
          >
            Get Started
          </button>
        </motion.div>

        {/* Right Content */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="flex-1 w-full max-w-xl space-y-6"
        >
          {/* Card: Career Timeline */}
          <div className="bg-[#111] rounded-2xl p-6 shadow-xl">
            <h3 className="text-lg text-gray-300 mb-3">Career Timeline</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={statData}>
                <Line
                  type="monotone"
                  dataKey="points"
                  stroke="#f472b6"
                  strokeWidth={3}
                />
                <CartesianGrid stroke="#333" />
                <XAxis dataKey="name" stroke="#ccc" />
                <YAxis stroke="#ccc" />
                <Tooltip />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Card: Scoring Overview with Filters */}
          <div className="bg-[#111] rounded-2xl p-6 shadow-xl">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg text-gray-300">Scoring Overview</h3>
              <div className="flex gap-2">
                <span className="px-3 py-1 text-sm rounded-full bg-purple-600 text-white cursor-pointer hover:brightness-110">
                  Regular
                </span>
                <span className="px-3 py-1 text-sm rounded-full bg-gray-700 text-white cursor-pointer hover:brightness-110">
                  Playoffs
                </span>
                <span className="px-3 py-1 text-sm rounded-full bg-gray-700 text-white cursor-pointer hover:brightness-110">
                  Last 10
                </span>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={statData}>
                <Bar dataKey="points" fill="#a855f7" radius={[8, 8, 0, 0]} />
                <CartesianGrid stroke="#333" />
                <XAxis dataKey="name" stroke="#ccc" />
                <YAxis stroke="#ccc" />
                <Tooltip />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Card: Awards Progress Timeline */}
          <div className="bg-[#111] rounded-2xl p-6 shadow-xl">
            <h3 className="text-lg text-gray-300 mb-3">
              Award Progress Timeline
            </h3>
            <div className="flex items-center justify-between gap-2 px-2 py-4 bg-[#1a1a1a] rounded-xl">
              {awardsTimeline.map((season) => (
                <div
                  key={season.year}
                  className="flex flex-col items-center gap-2 w-full"
                >
                  <span className="text-sm text-gray-400">{season.year}</span>
                  <div className="relative h-3 w-3 rounded-full bg-gray-700">
                    {season.awards.includes("MVP") && (
                      <div className="absolute top-0 left-0 h-3 w-3 rounded-full bg-yellow-400 ring-2 ring-yellow-500" />
                    )}
                    {season.awards.includes("DPOY") && (
                      <div className="absolute top-0 left-0 h-3 w-3 rounded-full bg-blue-400 ring-2 ring-blue-500" />
                    )}
                    {season.awards.includes("All-NBA") && (
                      <div className="absolute top-0 left-0 h-3 w-3 rounded-full bg-purple-500 ring-2 ring-purple-600" />
                    )}
                  </div>
                  <div className="text-[10px] text-center text-gray-300 leading-snug">
                    {season.awards.map((a, i) => (
                      <div key={i}>{a}</div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="flex gap-4 mt-4 text-xs text-gray-400">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-yellow-400 rounded-full" /> MVP
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-blue-400 rounded-full" /> DPOY
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-purple-500 rounded-full" /> All-NBA
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LandingPage;
