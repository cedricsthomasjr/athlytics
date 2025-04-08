import React, { useEffect, useState } from "react";
import axios from "axios";

// 🖼️ Import award icons
import allDefense from "../assets/all-defense.png";
import allNBA from "../assets/all-nba.png";
import allRookie from "../assets/all-rookie.png";
import allStarMVP from "../assets/all-star-mvp.png";
import allStar from "../assets/all-star.png";
import assistsTitle from "../assets/assists-title.png";
import blocksTitle from "../assets/blocks-title.png";
import champ from "../assets/champ.png";
import dpoy from "../assets/dpoy.png";
import mvp from "../assets/mvp.png";
import nba75 from "../assets/nba-75.png";
import roy from "../assets/roy.png";
import scoringTitle from "../assets/scoring-title.png";
import stealsTitle from "../assets/steals-title.png";

// 🔍 Updated helper to support Hall of Fame flag
const getAwardIcon = (awardName) => {
  const normalized = awardName.toLowerCase();

  if (normalized.includes("hall of fame")) {
    return { icon: null, isHallOfFame: true };
  }

  if (normalized.includes("all star")) return { icon: allStar };
  if (normalized.includes("as mvp")) return { icon: allStarMVP };
  if (normalized.includes("scoring champ")) return { icon: scoringTitle };
  if (normalized.includes("assist")) return { icon: assistsTitle };
  if (normalized.includes("block")) return { icon: blocksTitle };
  if (normalized.includes("steal")) return { icon: stealsTitle };
  if (normalized.includes("champ")) return { icon: champ };
  if (normalized.includes("mvp") && !normalized.includes("as"))
    return { icon: mvp };
  if (normalized.includes("wcf mvp")) return { icon: mvp };
  if (
    normalized.includes("def. poy") ||
    normalized.includes("defensive player")
  )
    return { icon: dpoy };
  if (normalized.includes("all-nba")) return { icon: allNBA };
  if (normalized.includes("all-rookie")) return { icon: allRookie };
  if (normalized.includes("sportsmanship")) return { icon: champ };
  if (normalized.includes("nba 75")) return { icon: nba75 };
  if (normalized.includes("roy")) return { icon: roy };
  if (normalized.includes("all-defensive")) return { icon: allDefense };

  return { icon: null };
};

const Awards = ({ playerId }) => {
  const [awards, setAwards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAwards = async () => {
      try {
        const res = await axios.get(
          `http://127.0.0.1:5000/api/player/${playerId}/awards`
        );
        setAwards(res.data.awards || []);
      } catch (err) {
        console.error("Error fetching awards:", err);
        setError("Failed to load awards.");
      } finally {
        setLoading(false);
      }
    };

    if (playerId) {
      fetchAwards();
    }
  }, [playerId]);

  if (loading) {
    return (
      <div className="text-gray-400 py-6 px-4 text-center text-sm">
        Loading awards...
      </div>
    );
  }

  if (error || !awards || awards.length === 0) {
    return (
      <div className="text-gray-500 py-6 px-4 text-center text-sm">
        No awards or accolades available.
      </div>
    );
  }

  return (
    <div className="w-full px-4 py-6">
      <h2 className="text-base md:text-lg font-medium text-purple-300 mb-3">
        Awards & Accolades
      </h2>

      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-sm">
        {awards.map((award, index) => {
          const { icon, isHallOfFame } = getAwardIcon(award);

          return (
            <li
              key={index}
              className="flex items-center gap-3 px-3 py-2 border border-gray-700 rounded-md bg-[#111] hover:bg-[#1a1a1a] transition-colors"
            >
              {icon && (
                <img
                  src={icon}
                  alt={`${award} icon`}
                  className="w-6 h-6 object-contain"
                />
              )}
              <span
                className={`${
                  isHallOfFame
                    ? "text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 drop-shadow-[0_0_6px_rgba(236,72,153,0.8)]"
                    : ""
                }`}
              >
                {award}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Awards;
