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

  const formatPercent = (val) =>
    isNaN(val) || val === null ? "—" : (val * 100).toFixed(1) + "%";
  const formatDecimal = (val) =>
    isNaN(val) || val === null ? "—" : val.toFixed(1);
  const formatRank = (val) => (isNaN(val) || val === null ? "—" : `#${val}`);

  const statGroups = {
    normal: [
      { label: "Season", key: "GROUP_VALUE" },
      { label: "Team", key: "TEAM_ABBREVIATION" },
      { label: "GP", key: "GP" },
      { label: "MIN", key: "MIN" },
      { label: "PTS", key: "PTS" },
      { label: "AST", key: "AST" },
      { label: "REB", key: "REB" },
      { label: "STL", key: "STL" },
      { label: "BLK", key: "BLK" },
      { label: "TOV", key: "TOV" },
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
    <div className="w-full bg-zinc-900 rounded-xl p-6 shadow-md">
      <div className="flex justify-center gap-3 mb-6">
        {["normal", "advanced", "rankings"].map((option) => (
          <button
            key={option}
            onClick={() => setView(option)}
            className={`px-4 py-2 rounded-full capitalize text-sm ${
              view === option
                ? "bg-white text-black font-bold"
                : "bg-zinc-800 text-white hover:bg-zinc-700"
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
                  const val = col.isPercent
                    ? formatPercent(raw)
                    : col.isDecimal
                    ? formatDecimal(raw)
                    : col.isRank
                    ? formatRank(raw)
                    : raw ?? "—";

                  return (
                    <td key={col.key} className="px-4 py-2 whitespace-nowrap">
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
