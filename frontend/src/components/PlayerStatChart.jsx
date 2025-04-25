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

// 🧠 Dynamically convert stat key to unit label
const getUnitForStat = (key) => {
  switch (key) {
    case "PTS":
      return "ppg";
    case "AST":
      return "apg";
    case "REB":
      return "rpg";
    case "STL":
      return "spg";
    case "BLK":
      return "bpg";
    case "TOV":
      return "topg";
    default:
      return "";
  }
};

const PlayerStatChart = ({ data }) => {
  const [activeStat, setActiveStat] = useState(STAT_OPTIONS[0]);

  const seasonMap = new Map();
  data.forEach((row) => {
    const seasonKey = row.GROUP_VALUE || row.SEASON_ID || "Unknown";
    const team = row.TEAM_ABBREVIATION;

    if (!seasonMap.has(seasonKey)) {
      seasonMap.set(seasonKey, row);
    }

    if (team === "TOT") {
      seasonMap.set(seasonKey, row);
    }
  });

  const chartData = Array.from(seasonMap.entries())
    .map(([seasonKey, row]) => {
      const fullSeason = seasonKey || "Unknown";
      const perGame = row[activeStat.key];

      return {
        season: fullSeason,
        value:
          perGame !== undefined && perGame !== null
            ? +perGame.toFixed(1)
            : null,
      };
    })
    .filter((d) => d.value !== null)
    .sort((a, b) => {
      const aYear = parseInt(a.season.split("-")[0]);
      const bYear = parseInt(b.season.split("-")[0]);
      return aYear - bYear;
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

      <h2 className="text-white text-lg font-semibold mb-4">
        {activeStat.label} Per Game (Season by Season)
      </h2>

      {chartData.length === 0 ? (
        <div className="text-sm text-gray-400">No data available.</div>
      ) : (
        <ResponsiveContainer width="100%" height={320}>
          <LineChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 10, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis
              dataKey="season"
              stroke="#ccc"
              tick={{ fontSize: 12 }}
              allowDuplicatedCategory={false}
              interval={0}
            />
            <YAxis
              stroke="#ccc"
              tick={{ fontSize: 12 }}
              allowDecimals={false}
              domain={["auto", "auto"]}
              tickFormatter={(val) => Number(val)}
            />
            <Tooltip
              contentStyle={{ backgroundColor: "#111", border: "none" }}
              labelStyle={{ color: "#fff", fontWeight: 600 }}
              formatter={(value) => [
                `${value.toFixed(1)} ${getUnitForStat(activeStat.key)}`,
                "",
              ]}
              labelFormatter={(label) => `${label}`}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke={activeStat.color}
              strokeWidth={3}
              dot={{ r: 5 }}
              activeDot={{ r: 7 }}
              isAnimationActive={true}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default PlayerStatChart;
