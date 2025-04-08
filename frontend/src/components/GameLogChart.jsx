import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

// Stat options
const GAME_STATS = [
  { key: "PTS", label: "Points", color: "#f43f5e" },
  { key: "AST", label: "Assists", color: "#3b82f6" },
  { key: "REB", label: "Rebounds", color: "#22c55e" },
];

const GameLogChart = ({ playerId, careerStats = [] }) => {
  // 🎯 Filter out duplicate teams per season, prefer 'TOT'
  const seasonMap = new Map();
  careerStats.forEach((row) => {
    const seasonId = row.SEASON_ID;
    const team = row.TEAM_ABBREVIATION;

    if (!seasonMap.has(seasonId)) {
      seasonMap.set(seasonId, row);
    }

    if (team === "TOT") {
      seasonMap.set(seasonId, row);
    }
  });

  const playedSeasons = Array.from(seasonMap.values())
    .map((s) => s.SEASON_ID)
    .filter(Boolean)
    .reverse();

  const [season, setSeason] = useState(playedSeasons[0]);
  const [games, setGames] = useState([]);
  const [activeStat, setActiveStat] = useState(GAME_STATS[0]);

  useEffect(() => {
    if (!season) return;

    const fetchGames = async () => {
      try {
        const res = await fetch(
          `http://127.0.0.1:5000/api/player/${playerId}/games/${season}`
        );
        const data = await res.json();
        setGames(data);
      } catch (err) {
        console.error("❌ Failed to fetch game log:", err);
      }
    };

    fetchGames();
  }, [playerId, season]);

  const chartData = games.map((game, idx) => ({
    date: `Game ${idx + 1}`,
    value: game[activeStat.key] || 0,
  }));

  return (
    <div className="w-full bg-zinc-900 rounded-xl p-6 shadow-md mt-10">
      <div className="flex flex-wrap items-center gap-3 mb-4">
        {GAME_STATS.map((stat) => (
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

        <select
          value={season}
          onChange={(e) => setSeason(e.target.value)}
          className="ml-auto bg-zinc-800 text-white border border-zinc-600 px-3 py-1 rounded-md text-sm"
        >
          {playedSeasons.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <h2 className="text-white text-lg font-semibold mb-2">
        {activeStat.label} Per Game – {season}
      </h2>

      {games.length === 0 ? (
        <p className="text-red-400 text-sm">
          No game data found for this season.
        </p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis
              dataKey="date"
              stroke="#ccc"
              tickFormatter={(value, index) => {
                const isStart = index === 0;
                const isMid = index === Math.floor(chartData.length / 2);
                const isEnd = index === chartData.length - 1;

                return isStart || isMid || isEnd ? value : "";
              }}
            />

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
      )}
    </div>
  );
};

export default GameLogChart;
