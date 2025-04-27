import React, { useState } from "react";

const PlayerStatsTable = ({ stats }) => {
  const [view, setView] = useState("normal");

  if (!stats || stats.length === 0) {
    return <div className="text-white p-10">No stats available</div>;
  }

  // 🔍 Prefer "TOT" if available for a season
  const filteredStats = Object.values(
    stats.reduce((acc, row) => {
      const season = row.GROUP_VALUE || row.SEASON_ID;
      if (!acc[season] || row.TEAM_ABBREVIATION === "TOT") {
        acc[season] = row;
      }
      return acc;
    }, {})
  );

  // 👑 Define stat keys for leader highlights by view
  const leaderKeys = {
    normal: ["PTS", "AST", "REB", "STL", "BLK"],
    advanced: ["USG_PCT", "TS_PCT", "EFG_PCT", "PIE"],
    rankings: [
      "PTS_RANK",
      "AST_RANK",
      "REB_RANK",
      "TS_PCT_RANK",
      "EFG_PCT_RANK",
    ],
  };

  // Find leaders dynamically
  const leaders = {};
  Object.keys(leaderKeys).forEach((group) => {
    leaderKeys[group].forEach((key) => {
      if (group === "rankings") {
        // Lower is better in rankings
        leaders[key] = Math.min(
          ...filteredStats.map((s) => s[key] ?? Infinity)
        );
      } else {
        // Higher is better in normal/advanced
        leaders[key] = Math.max(
          ...filteredStats.map((s) => s[key] ?? -Infinity)
        );
      }
    });
  });

  const formatPercent = (val) =>
    isNaN(val) || val === null ? "—" : (val * 100).toFixed(1) + "%";
  const formatDecimal = (val) =>
    isNaN(val) || val === null ? "—" : val.toFixed(1);
  const formatRank = (val) => (isNaN(val) || val === null ? "—" : `#${val}`);
  const formatInteger = (val) =>
    isNaN(val) || val === null ? "—" : Math.round(val);

  const statGroups = {
    normal: [
      { label: "Season", key: "GROUP_VALUE" },
      { label: "Team", key: "TEAM_ABBREVIATION" },
      { label: "GP", key: "GP", isInteger: true },
      { label: "MIN", key: "MIN", isDecimal: true },
      { label: "PTS", key: "PTS", isDecimal: true },
      { label: "AST", key: "AST", isDecimal: true },
      { label: "REB", key: "REB", isDecimal: true },
      { label: "STL", key: "STL", isDecimal: true },
      { label: "BLK", key: "BLK", isDecimal: true },
      { label: "TOV", key: "TOV", isDecimal: true },
      { label: "FG%", key: "FG_PCT", isPercent: true },
      { label: "3P%", key: "FG3_PCT", isPercent: true },
      { label: "FT%", key: "FT_PCT", isPercent: true },
    ],
    advanced: [
      { label: "Season", key: "GROUP_VALUE" },
      { label: "Team", key: "TEAM_ABBREVIATION" },
      { label: "USG%", key: "USG_PCT", isPercent: true },
      { label: "TS%", key: "TS_PCT", isPercent: true },
      { label: "EFG%", key: "EFG_PCT", isPercent: true },
      { label: "OFF RTG", key: "OFF_RATING", isDecimal: true },
      { label: "DEF RTG", key: "DEF_RATING", isDecimal: true },
      { label: "NET RTG", key: "NET_RATING", isDecimal: true },
      { label: "PACE", key: "PACE", isDecimal: true },
      { label: "AST%", key: "AST_PCT", isPercent: true },
      { label: "REB%", key: "REB_PCT", isPercent: true },
      { label: "TO%", key: "TO_PCT", isPercent: true },
      { label: "PIE", key: "PIE", isDecimal: true },
    ],
    rankings: [
      { label: "Season", key: "GROUP_VALUE" },
      { label: "Team", key: "TEAM_ABBREVIATION" },
      { label: "PTS Rank", key: "PTS_RANK", isRank: true },
      { label: "AST Rank", key: "AST_RANK", isRank: true },
      { label: "REB Rank", key: "REB_RANK", isRank: true },
      { label: "TS% Rank", key: "TS_PCT_RANK", isRank: true },
      { label: "EFG% Rank", key: "EFG_PCT_RANK", isRank: true },
      { label: "USG% Rank", key: "USG_PCT_RANK", isRank: true },
      { label: "OFF RTG Rank", key: "OFF_RATING_RANK", isRank: true },
      { label: "DEF RTG Rank", key: "DEF_RATING_RANK", isRank: true },
      { label: "NET RTG Rank", key: "NET_RATING_RANK", isRank: true },
      { label: "AST% Rank", key: "AST_PCT_RANK", isRank: true },
      { label: "REB% Rank", key: "REB_PCT_RANK", isRank: true },
      { label: "TO% Rank", key: "TO_PCT_RANK", isRank: true },
    ],
  };

  const activeStats = statGroups[view];

  return (
    <div className="w-full bg-zinc-900 rounded-2xl p-6 shadow-md">
      <div className="flex justify-center gap-3 mb-6">
        {["normal", "advanced", "rankings"].map((option) => (
          <button
            key={option}
            onClick={() => setView(option)}
            className={`px-4 py-1 rounded-full capitalize text-sm ${
              view === option
                ? "bg-purple-500 text-white font-bold"
                : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-white border-collapse">
          <thead className="bg-zinc-800 text-xs uppercase">
            <tr>
              {activeStats.map((col) => (
                <th key={col.key} className="px-4 py-3 whitespace-nowrap">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredStats.map((row, i) => (
              <tr
                key={i}
                className={`${
                  i % 2 === 0 ? "bg-zinc-950" : "bg-zinc-900"
                } hover:bg-zinc-800 transition`}
              >
                {activeStats.map((col) => {
                  const raw = row[col.key];
                  let val = "—";
                  if (col.isPercent) val = formatPercent(raw);
                  else if (col.isDecimal) val = formatDecimal(raw);
                  else if (col.isRank) val = formatRank(raw);
                  else if (col.isInteger) val = formatInteger(raw);
                  else val = raw ?? "—";

                  const highlightKey = leaderKeys[view]?.includes(col.key);
                  const isLeader =
                    highlightKey &&
                    ((view === "rankings" &&
                      parseInt(raw) === leaders[col.key]) ||
                      (view !== "rankings" &&
                        parseFloat(raw) === leaders[col.key]));

                  return (
                    <td
                      key={col.key}
                      className={`px-4 py-2 whitespace-nowrap ${
                        isLeader ? "text-purple-400 font-bold" : ""
                      }`}
                    >
                      {val}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PlayerStatsTable;
