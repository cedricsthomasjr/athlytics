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

// 🔍 Helper to find best-match icon
const getAwardIcon = (awardName) => {
  const normalized = awardName.toLowerCase();

  if (normalized.includes("all star")) return allStar;
  if (normalized.includes("as mvp")) return allStarMVP;
  if (normalized.includes("scoring champ")) return scoringTitle;
  if (normalized.includes("assist")) return assistsTitle;
  if (normalized.includes("block")) return blocksTitle;
  if (normalized.includes("steal")) return stealsTitle;
  if (normalized.includes("champ")) return champ;
  if (normalized.includes("mvp") && !normalized.includes("as")) return mvp;
  if (normalized.includes("wcf mvp")) return mvp; // or use a custom one if you have
  if (
    normalized.includes("def. poy") ||
    normalized.includes("defensive player")
  )
    return dpoy;
  if (normalized.includes("all-nba")) return allNBA;
  if (normalized.includes("all-rookie")) return allRookie;
  if (normalized.includes("sportsmanship")) return champ; // temporary or custom
  if (normalized.includes("nba 75")) return nba75;
  if (normalized.includes("roy")) return roy;
  if (normalized.includes("all-defensive")) return allDefense;

  return null;
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

      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-sm text-gray-300">
        {awards.map((award, index) => {
          const icon = getAwardIcon(award);
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
              <span>{award}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Awards;
