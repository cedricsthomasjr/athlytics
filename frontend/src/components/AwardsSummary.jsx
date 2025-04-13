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
  "Finals MVP": mvp,
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

// Priority order for sorting
const awardPriority = [
  "MVP", // exact MVP comes first
  "Finals MVP",
  "Champ",
  "All-NBA",
  "All Star",
  "ROY",
  "All-Rookie",
  "All-Defensive",
  "Def. POY",
  "Scoring champ",
  "AST champ",
  "STL champ",
  "BLK champ",
  "TRB champ",
  "All-Star MVP",
  "NBA 75th Anniv",
  "Hall of Fame",
];

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
    <div className="p-4 rounded-xl shadow-md max-w-5xl w-full flex flex-wrap justify-center gap-3">
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
        <ul className="flex flex-wrap justify-center gap-x-3 gap-y-2">
          {awards
            .slice()
            .sort((a, b) => {
              const getIndex = (val) => {
                const lower = val.toLowerCase();
                for (let i = 0; i < awardPriority.length; i++) {
                  const keyword = awardPriority[i].toLowerCase();
                  if (lower === keyword) return i - 0.5; // boost exact match
                  if (lower.includes(keyword)) return i;
                }
                return 999;
              };
              return getIndex(a) - getIndex(b);
            })
            .map((award, idx) => {
              const matchedKey = Object.keys(awardImageMap).find((key) =>
                award.toLowerCase().includes(key.toLowerCase())
              );
              const imgSrc = awardImageMap[matchedKey];

              const isGlowing =
                matchedKey === "Hall of Fame" ||
                matchedKey === "NBA 75th Anniv";

              return (
                <li
                  key={idx}
                  className={`${
                    isGlowing
                      ? "border-zinc-800 px-3 py-1.5"
                      : "bg-zinc-900 px-2.5 py-1.5"
                  } rounded-lg flex items-center gap-2 text-xs transition`}
                >
                  {isGlowing ? (
                    <span className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 bg-clip-text text-transparent font-semibold text-sm animate-gradient bg-[length:200%_200%]">
                      {matchedKey}
                    </span>
                  ) : (
                    <>
                      {imgSrc ? (
                        <img
                          src={imgSrc}
                          alt={matchedKey}
                          className="h-5 w-5"
                        />
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
