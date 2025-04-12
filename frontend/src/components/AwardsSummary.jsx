import React, { useEffect, useState } from "react";
import {
  CheckBadgeIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/solid";
import allDefense from "../assets/all-defense.png";
import allNBA from "../assets/all-nba.png";
import allRookie from "../assets/all-rookie.png";
import allStar from "../assets/all-star.png";
import allStarMVP from "../assets/all-star-mvp.png";
import assistsTitle from "../assets/assists-title.png";
import blocksTitle from "../assets/blocks-title.png";
import champ from "../assets/champ.png";
import dpoy from "../assets/dpoy.png";
import hof from "../assets/hof.png";
import mvp from "../assets/mvp.png";
import nba75 from "../assets/nba-75.png";
import roy from "../assets/roy.png";
import scoringTitle from "../assets/scoring-title.png";
import stealsTitle from "../assets/steals-title.png";

const awardImageMap = {
  MVP: mvp,
  "Scoring champ": scoringTitle,
  "AST champ": assistsTitle,
  "TRB champ": blocksTitle,
  "BLK champ": blocksTitle,
  "STL champ": stealsTitle,
  "Def. POY": dpoy,
  ROY: roy,
  "All Star": allStar,
  "All-Star MVP": allStarMVP,
  "All-NBA": allNBA,
  "All-Defensive": allDefense,
  "All-Rookie": allRookie,
  champ: champ,
  "Hall of Fame": hof,
  "NBA 75th Anniv": nba75,
};

const AwardsSummary = ({ bbrefId }) => {
  const [awards, setAwards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!bbrefId) return setLoading(false);

    const fetchAwards = async () => {
      try {
        const res = await fetch(
          `http://127.0.0.1:5000/api/player/${bbrefId}/awards`
        );
        const data = await res.json();
        setAwards(data.awards || []);
      } catch (err) {
        console.error("Failed to fetch awards:", err);
        setHasError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchAwards();
  }, [bbrefId]);

  return (
    <div className="bg-black text-white rounded-2xl shadow-md p-6 w-full">
      {loading ? (
        <div className="text-gray-400 animate-pulse">Loading awards...</div>
      ) : hasError ? (
        <div className="flex items-center text-red-400 gap-2">
          <ExclamationCircleIcon className="h-5 w-5" />
          <span>Failed to load awards.</span>
        </div>
      ) : awards.length === 0 ? (
        <div className="text-white-400">No awards found for this player.</div>
      ) : (
        <ul className="flex flex-wrap gap-3">
          {awards.map((award, idx) => {
            const matchedKey = Object.keys(awardImageMap).find((key) =>
              award.toLowerCase().includes(key.toLowerCase())
            );
            const imgSrc = awardImageMap[matchedKey];

            const isGlowing =
              matchedKey === "Hall of Fame" || matchedKey === "NBA 75th Anniv";

            return (
              <li
                key={idx}
                className={`${
                  isGlowing
                    ? " border-zinc-800 px-3 py-1.5"
                    : "bg-zinc-900 px-2.5 py-1.5"
                } rounded-lg flex items-center gap-2 text-xs bg-zinc-900 transition`}
              >
                {isGlowing ? (
                  <span className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 bg-clip-text text-transparent font-semibold text-sm animate-gradient bg-[length:200%_200%]">
                    {matchedKey}
                  </span>
                ) : (
                  <>
                    {imgSrc ? (
                      <img src={imgSrc} alt={matchedKey} className="h-5 w-5" />
                    ) : (
                      <CheckBadgeIcon className="h-5 w-5 text-purple-800" />
                    )}
                    <span className="text-sm">{award}</span>
                  </>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default AwardsSummary;
