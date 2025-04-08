import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const GAME_STATS = [
  { key: "PTS", label: "Points", color: "#f43f5e" },
  { key: "AST", label: "Assists", color: "#3b82f6" },
  { key: "REB", label: "Rebounds", color: "#22c55e" },
];

const GameLogChart = ({ playerId, careerStats = [] }) => {
  const seasonMap = new Map();
  careerStats.forEach((row) => {
    const seasonId = row.SEASON_ID;
    const team = row.TEAM_ABBREVIATION;
    if (!seasonMap.has(seasonId)) seasonMap.set(seasonId, row);
    if (team === "TOT") seasonMap.set(seasonId, row);
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

  const chartData = games.map((game, idx) => {
    const isHomeGame = game.MATCHUP.includes("@") ? "Away" : "Home";
    const opponent = game.MATCHUP.replace("@", "").trim();
    return {
      index: idx,
      date: `Game ${idx + 1} - ${isHomeGame} vs ${opponent}`,
      value: game[activeStat.key] ? Math.round(game[activeStat.key]) : 0,
      opponent,
      result: game.WL === "W" ? "Win" : "Loss",
    };
  });

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

            {/* ⛔ XAxis removed */}
            <YAxis stroke="#ccc" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#111",
                border: "none",
                padding: "10px",
              }}
              labelStyle={{ color: "#fff" }}
              formatter={(value, name, props) => [
                `${Math.round(value)} ${activeStat.label}`,
                `Game ${props.payload.index + 1}`,
              ]}
              labelFormatter={(label, payload) => {
                if (!payload || payload.length === 0 || !payload[0]?.payload)
                  return label;

                const { index, opponent, result } = payload[0].payload;

                return (
                  <div style={{ color: "#fff", lineHeight: "1.5" }}>
                    <p style={{ fontWeight: 600 }}>Game {index + 1}</p>
                    <p>
                      Opponent:{" "}
                      <span style={{ color: "#ddd" }}>{opponent}</span>
                    </p>
                    <p>
                      Result:{" "}
                      <span
                        style={{
                          color: result === "Win" ? "#22c55e" : "#f43f5e",
                        }}
                      >
                        {result}
                      </span>
                    </p>
                  </div>
                );
              }}
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
