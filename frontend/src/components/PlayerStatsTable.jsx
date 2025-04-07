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

  const careerHighs = {
    mpg: Math.max(...stats.map((s) => (s.MIN || 0) / (s.GP || 1))),
    ppg: Math.max(...stats.map((s) => (s.PTS || 0) / (s.GP || 1))),
    rpg: Math.max(...stats.map((s) => (s.REB || 0) / (s.GP || 1))),
    apg: Math.max(...stats.map((s) => (s.AST || 0) / (s.GP || 1))),
    tsp: Math.max(
      ...stats.map((s) =>
        s.FGA + 0.44 * s.FTA > 0 ? s.PTS / (2 * (s.FGA + 0.44 * s.FTA)) : 0
      )
    ),
    pts: Math.max(...stats.map((s) => s.PTS || 0)),
    reb: Math.max(...stats.map((s) => s.REB || 0)),
    ast: Math.max(...stats.map((s) => s.AST || 0)),
    stl: Math.max(...stats.map((s) => s.STL || 0)),
    blk: Math.max(...stats.map((s) => s.BLK || 0)),
    usg: Math.max(...stats.map((s) => s.USG_PCT || 0)),
    tov: Math.max(...stats.map((s) => s.TOV_PCT || 0)),
    astPct: Math.max(...stats.map((s) => s.AST_PCT || 0)),
    rebPct: Math.max(...stats.map((s) => s.REB_PCT || 0)),
    efg: Math.max(
      ...stats.map((s) => (s.FGA > 0 ? (s.FGM + 0.5 * s.FG3M) / s.FGA : 0))
    ),
    pts36: Math.max(...stats.map((s) => (s.MIN ? (s.PTS / s.MIN) * 36 : 0))),
    reb36: Math.max(...stats.map((s) => (s.MIN ? (s.REB / s.MIN) * 36 : 0))),
    ast36: Math.max(...stats.map((s) => (s.MIN ? (s.AST / s.MIN) * 36 : 0))),
    stl36: Math.max(...stats.map((s) => (s.MIN ? (s.STL / s.MIN) * 36 : 0))),
    blk36: Math.max(...stats.map((s) => (s.MIN ? (s.BLK / s.MIN) * 36 : 0))),
  };

  const highlightIfHigh = (val, high, fixed = 1, isPercent = false) => {
    const display = isPercent
      ? `${(val * 100).toFixed(fixed)}%`
      : val.toFixed(fixed);
    const isHigh =
      parseFloat(display) ===
      parseFloat(isPercent ? (high * 100).toFixed(fixed) : high.toFixed(fixed));
    return (
      <td
        className={`px-4 py-2 ${isHigh ? "text-purple-400 font-semibold" : ""}`}
      >
        {display}
      </td>
    );
  };

  return (
    <div className="w-full">
      <div className="overflow-x-auto">
        <div className="flex items-center space-x-2 mb-4">
          {["averages", "totals", "nerd", "per36"].map((type) => (
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
              {view === "per36" && (
                <>
                  <th className="px-4 py-2">PTS/36</th>
                  <th className="px-4 py-2">REB/36</th>
                  <th className="px-4 py-2">AST/36</th>
                  <th className="px-4 py-2">STL/36</th>
                  <th className="px-4 py-2">BLK/36</th>
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
                const minutes = s.MIN || 1;
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
                        {highlightIfHigh(mpg, careerHighs.mpg)}
                        {highlightIfHigh(s.PTS / gp, careerHighs.ppg)}
                        {highlightIfHigh(s.REB / gp, careerHighs.rpg)}
                        {highlightIfHigh(s.AST / gp, careerHighs.apg)}
                        {highlightIfHigh(ts, careerHighs.tsp, 1, true)}
                      </>
                    )}
                    {view === "totals" && (
                      <>
                        {highlightIfHigh(s.PTS, careerHighs.pts, 0)}
                        {highlightIfHigh(s.REB, careerHighs.reb, 0)}
                        {highlightIfHigh(s.AST, careerHighs.ast, 0)}
                        {highlightIfHigh(s.STL, careerHighs.stl, 0)}
                        {highlightIfHigh(s.BLK, careerHighs.blk, 0)}
                      </>
                    )}
                    {view === "nerd" && (
                      <>
                        {highlightIfHigh(s.USG_PCT, careerHighs.usg, 1, true)}
                        {highlightIfHigh(s.TOV_PCT, careerHighs.tov, 1, true)}
                        {highlightIfHigh(
                          s.AST_PCT,
                          careerHighs.astPct,
                          1,
                          true
                        )}
                        {highlightIfHigh(
                          s.REB_PCT,
                          careerHighs.rebPct,
                          1,
                          true
                        )}
                        {highlightIfHigh(
                          efgPct / 100,
                          careerHighs.efg,
                          1,
                          true
                        )}
                      </>
                    )}
                    {view === "per36" && (
                      <>
                        {highlightIfHigh(
                          (s.PTS / minutes) * 36,
                          careerHighs.pts36
                        )}
                        {highlightIfHigh(
                          (s.REB / minutes) * 36,
                          careerHighs.reb36
                        )}
                        {highlightIfHigh(
                          (s.AST / minutes) * 36,
                          careerHighs.ast36
                        )}
                        {highlightIfHigh(
                          (s.STL / minutes) * 36,
                          careerHighs.stl36
                        )}
                        {highlightIfHigh(
                          (s.BLK / minutes) * 36,
                          careerHighs.blk36
                        )}
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
