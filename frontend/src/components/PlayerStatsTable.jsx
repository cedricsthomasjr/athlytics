// src/components/PlayerStatsTable.jsx
import React, { useState } from "react";

const PlayerStatsTable = ({ stats }) => {
  const [view, setView] = useState("averages");

  if (!stats || stats.length === 0) {
    return <div className="text-white p-10">No stats available</div>;
  }

  const safePercent = (val) =>
    isNaN(val) || val === null
      ? "0.0%"
      : (val <= 1 ? (val * 100).toFixed(1) : val.toFixed(1)) + "%";

  return (
    <div className="w-full">
      <div className="overflow-x-auto">
        <div className="flex items-center space-x-2 mb-4">
          {["averages", "totals", "nerd"].map((type) => (
            <button
              key={type}
              onClick={() => setView(type)}
              className={`px-4 py-1 rounded-full text-xs border transition ${
                view === type
                  ? "bg-purple-700 text-white border-purple-700"
                  : "bg-[#1a1a1a] text-gray-400 border-gray-600 hover:bg-gray-800"
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        <table className="w-full text-xs md:text-sm text-left border border-gray-700">
          <thead className="bg-[#111111] text-purple-400">
            <tr>
              <th className="px-4 py-2">Season</th>
              <th className="px-4 py-2">Team</th>
              <th className="px-4 py-2">GP</th>

              {view === "averages" && (
                <>
                  <th className="px-4 py-2">MPG</th>
                  <th className="px-4 py-2">PPG</th>
                  <th className="px-4 py-2">RPG</th>
                  <th className="px-4 py-2">APG</th>
                  <th className="px-4 py-2">TS%</th>
                </>
              )}

              {view === "totals" && (
                <>
                  <th className="px-4 py-2">PTS</th>
                  <th className="px-4 py-2">REB</th>
                  <th className="px-4 py-2">AST</th>
                  <th className="px-4 py-2">STL</th>
                  <th className="px-4 py-2">BLK</th>
                </>
              )}

              {view === "nerd" && (
                <>
                  <th className="px-4 py-2">USG%</th>
                  <th className="px-4 py-2">TOV%</th>
                  <th className="px-4 py-2">AST%</th>
                  <th className="px-4 py-2">REB%</th>
                  <th className="px-4 py-2">eFG%</th>
                </>
              )}

              <th className="px-4 py-2">FG%</th>
              <th className="px-4 py-2">3P%</th>
              <th className="px-4 py-2">FT%</th>
            </tr>
          </thead>
          <tbody>
            {[...stats]
              .sort((a, b) => (a.SEASON_ID > b.SEASON_ID ? -1 : 1))
              .map((s) => {
                const gp = s.GP || 1;
                const mpg = s.MIN / gp;
                const ppg = s.PTS / gp;
                const rpg = s.REB / gp;
                const apg = s.AST / gp;
                const ts =
                  s.FGA + 0.44 * s.FTA > 0
                    ? s.PTS / (2 * (s.FGA + 0.44 * s.FTA))
                    : 0;
                const fgPct = s.FGA > 0 ? s.FGM / s.FGA : 0;
                const fg3Pct = s.FG3A > 0 ? s.FG3M / s.FG3A : 0;
                const ftPct = s.FTA > 0 ? s.FTM / s.FTA : 0;
                const efgPct =
                  s.FGA > 0 ? ((s.FGM + 0.5 * s.FG3M) / s.FGA) * 100 : 0;

                return (
                  <tr
                    key={`${s.SEASON_ID}-${s.TEAM_ABBREVIATION}`}
                    className="border-b border-gray-800 hover:bg-[#1a1a1a]"
                  >
                    <td className="px-4 py-2">{s.SEASON_ID}</td>
                    <td className="px-4 py-2">{s.TEAM_ABBREVIATION}</td>
                    <td className="px-4 py-2">{gp}</td>

                    {view === "averages" && (
                      <>
                        <td className="px-4 py-2">{mpg.toFixed(1)}</td>
                        <td className="px-4 py-2">{ppg.toFixed(1)}</td>
                        <td className="px-4 py-2">{rpg.toFixed(1)}</td>
                        <td className="px-4 py-2">{apg.toFixed(1)}</td>
                        <td className="px-4 py-2">{(ts * 100).toFixed(1)}%</td>
                      </>
                    )}

                    {view === "totals" && (
                      <>
                        <td className="px-4 py-2">{s.PTS}</td>
                        <td className="px-4 py-2">{s.REB}</td>
                        <td className="px-4 py-2">{s.AST}</td>
                        <td className="px-4 py-2">{s.STL}</td>
                        <td className="px-4 py-2">{s.BLK}</td>
                      </>
                    )}

                    {view === "nerd" && (
                      <>
                        <td className="px-4 py-2">{safePercent(s.USG_PCT)}</td>
                        <td className="px-4 py-2">{safePercent(s.TOV_PCT)}</td>
                        <td className="px-4 py-2">{safePercent(s.AST_PCT)}</td>
                        <td className="px-4 py-2">{safePercent(s.REB_PCT)}</td>
                        <td className="px-4 py-2">{efgPct.toFixed(1)}%</td>
                      </>
                    )}

                    <td className="px-4 py-2">{safePercent(fgPct)}</td>
                    <td className="px-4 py-2">{safePercent(fg3Pct)}</td>
                    <td className="px-4 py-2">{safePercent(ftPct)}</td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PlayerStatsTable;
