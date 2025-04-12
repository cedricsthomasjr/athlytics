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

  const calcCareerHighs = () => {
    const avg = (fn) =>
      stats.reduce((acc, val) => acc + fn(val), 0) / stats.length || 1;

    const teamMinAvg = avg((t) => t.MIN);
    const teamFGM = stats.reduce((a, t) => a + t.FGM, 0) || 1;
    const teamREBAvg = avg((t) => t.REB);
    const teamTotsAvg = avg((t) => t.FGA + 0.44 * t.FTA + t.TOV);

    return {
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
      usg: Math.max(
        ...stats.map((s) => {
          const val =
            ((s.FGA + 0.44 * s.FTA + s.TOV) * teamMinAvg) /
            (s.MIN * teamTotsAvg || 1);
          return isNaN(val) ? 0 : val;
        })
      ),
      tov: Math.max(
        ...stats.map((s) =>
          s.FGA + 0.44 * s.FTA + s.TOV > 0
            ? s.TOV / (s.FGA + 0.44 * s.FTA + s.TOV)
            : 0
        )
      ),
      astPct: Math.max(
        ...stats.map((s) => {
          const val = s.AST / ((s.MIN / teamMinAvg) * teamFGM - s.FGM || 1);
          return isNaN(val) ? 0 : val;
        })
      ),
      rebPct: Math.max(
        ...stats.map((s) => {
          const val = (s.REB * teamMinAvg) / (s.MIN * teamREBAvg || 1);
          return isNaN(val) ? 0 : val;
        })
      ),
      efg: Math.max(
        ...stats.map((s) => (s.FGA > 0 ? (s.FGM + 0.5 * s.FG3M) / s.FGA : 0))
      ),
      pts36: Math.max(...stats.map((s) => (s.MIN ? (s.PTS / s.MIN) * 36 : 0))),
      reb36: Math.max(...stats.map((s) => (s.REB / s.MIN) * 36 || 0)),
      ast36: Math.max(...stats.map((s) => (s.AST / s.MIN) * 36 || 0)),
      stl36: Math.max(...stats.map((s) => (s.STL / s.MIN) * 36 || 0)),
      blk36: Math.max(...stats.map((s) => (s.BLK / s.MIN) * 36 || 0)),
    };
  };

  const careerHighs = calcCareerHighs();

  const highlightIfHigh = (val, high, fixed = 1, isPercent = false) => {
    const display = isPercent
      ? `${(val * 100).toFixed(fixed)}%`
      : val.toFixed(fixed);
    const isHigh =
      parseFloat(display) ===
      parseFloat(isPercent ? (high * 100).toFixed(fixed) : high.toFixed(fixed));
    return (
      <td
        className={`px-4 py-2 transition-all duration-300 ease-in-out ${
          isHigh ? "text-purple-400 font-semibold" : ""
        }`}
      >
        {display}
      </td>
    );
  };

  return (
    <div className="w-full overflow-x-auto text-white">
      <div className="flex items-center gap-2 mb-4">
        {["averages", "totals", "per36"].map((type) => (
          <button
            key={type}
            onClick={() => setView(type)}
            className={`px-4 py-1.5 rounded-full text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-600 ${
              view === type
                ? "bg-purple-700 text-white shadow-md"
                : "bg-zinc-800 text-gray-400 hover:bg-zinc-700 border border-zinc-600"
            }`}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      <div className="rounded-xl overflow-hidden shadow-md ring-1 ring-zinc-800">
        <table className="min-w-full divide-y divide-zinc-800 text-sm">
          <thead className="bg-zinc-900 text-purple-400 uppercase text-xs tracking-wider">
            <tr>
              <th className="px-4 py-3 text-left">Season</th>
              <th className="px-4 py-3 text-left">Team</th>
              <th className="px-4 py-3 text-left">GP</th>
              {view === "averages" &&
                ["MPG", "PPG", "RPG", "APG", "TS%"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left">
                    {h}
                  </th>
                ))}
              {view === "totals" &&
                ["PTS", "REB", "AST", "STL", "BLK"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left">
                    {h}
                  </th>
                ))}
              {view === "per36" &&
                ["PTS/36", "REB/36", "AST/36", "STL/36", "BLK/36"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left">
                    {h}
                  </th>
                ))}
              {["FG%", "3P%", "FT%"].map((h) => (
                <th key={h} className="px-4 py-3 text-left">
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="bg-zinc-950 divide-y divide-zinc-800">
            {[...stats]
              .sort((a, b) => (a.SEASON_ID > b.SEASON_ID ? -1 : 1))
              .map((s) => {
                const gp = s.GP || 1;
                const minutes = s.MIN || 1;
                const mpg = s.MIN / gp;
                const ts =
                  s.FGA + 0.44 * s.FTA > 0
                    ? s.PTS / (2 * (s.FGA + 0.44 * s.FTA))
                    : 0;
                const fgPct = s.FGA > 0 ? s.FGM / s.FGA : 0;
                const fg3Pct = s.FG3A > 0 ? s.FG3M / s.FG3A : 0;
                const ftPct = s.FTA > 0 ? s.FTM / s.FTA : 0;

                return (
                  <tr
                    key={`${s.SEASON_ID}-${s.TEAM_ABBREVIATION}`}
                    className="transition duration-150 hover:bg-zinc-800"
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
