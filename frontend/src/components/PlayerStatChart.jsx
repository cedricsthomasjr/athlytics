import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const STAT_OPTIONS = [
  { key: "PTS", label: "Points", color: "#f43f5e" },
  { key: "AST", label: "Assists", color: "#3b82f6" },
  { key: "REB", label: "Rebounds", color: "#22c55e" },
  { key: "STL", label: "Steals", color: "#eab308" },
  { key: "BLK", label: "Blocks", color: "#8b5cf6" },
  { key: "TOV", label: "Turnovers", color: "#f97316" },
];

const PlayerStatChart = ({ data }) => {
  const [activeStat, setActiveStat] = useState(STAT_OPTIONS[0]);

  // 🔍 Prefer 'TOT' row for traded seasons
  const seasonMap = new Map();
  data.forEach((row) => {
    const seasonId = row.SEASON_ID;
    const team = row.TEAM_ABBREVIATION;

    if (!seasonMap.has(seasonId)) {
      seasonMap.set(seasonId, row);
    }

    if (team === "TOT") {
      seasonMap.set(seasonId, row);
    }
  });

  const chartData = Array.from(seasonMap.values()).map((season) => {
    const gp = season.GP || 1;
    const total = season[activeStat.key] || 0;
    const perGame = total / gp;

    return {
      season: season.SEASON_ID?.split("-")[0] || "Unknown",
      value: parseFloat(perGame.toFixed(1)),
    };
  });

  return (
    <div className="w-full bg-zinc-900 rounded-xl p-6 shadow-md">
      <div className="flex flex-wrap gap-3 mb-4">
        {STAT_OPTIONS.map((stat) => (
          <button
            key={stat.key}
            onClick={() => setActiveStat(stat)}
            className={`px-3 py-1 rounded-full border text-sm transition-all duration-200 ${
              activeStat.key === stat.key
                ? "bg-white text-black font-semibold"
                : "bg-zinc-800 text-gray-300 hover:bg-zinc-700"
            }`}
          >
            {stat.label}
          </button>
        ))}
      </div>

      <h2 className="text-white text-lg font-semibold mb-2">
        {activeStat.label} Per Game (Season by Season)
      </h2>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#444" />
          <XAxis dataKey="season" stroke="#ccc" />
          <YAxis stroke="#ccc" />
          <Tooltip
            contentStyle={{ backgroundColor: "#111", border: "none" }}
            labelStyle={{ color: "#fff" }}
            formatter={(value) => `${value} ${activeStat.label}`}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke={activeStat.color}
            strokeWidth={3}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PlayerStatChart;
