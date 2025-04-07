// src/components/PlayerName.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const PlayerName = () => {
  const { playerId } = useParams();
  const [playerName, setPlayerName] = useState("");
  const [yearsText, setYearsText] = useState("");

  useEffect(() => {
    const fetchNameAndStats = async () => {
      try {
        const res = await fetch(
          `http://127.0.0.1:5000/api/player-name/${playerId}`
        );
        const data = await res.json();
        setPlayerName(data.name);

        const statsRes = await fetch(
          `http://127.0.0.1:5000/api/player/${playerId}`
        );
        const stats = await statsRes.json();

        const totalGP = stats.reduce((sum, s) => sum + (s.GP || 0), 0);
        const rawYears = totalGP / 82;
        const roundedYears = Math.round(rawYears);

        const mostRecentSeason = stats[stats.length - 1]?.SEASON_ID || "";
        const currentYear = new Date().getFullYear();
        const seasonYear = parseInt(mostRecentSeason.split("-")[0]);
        const isActive = currentYear - seasonYear <= 1;

        if (roundedYears <= 1) {
          setYearsText("Rook");
        } else {
          setYearsText(
            isActive
              ? `${roundedYears} year vet`
              : `${roundedYears} year retiree`
          );
        }
      } catch (err) {
        console.error("Failed to fetch player info:", err);
        setPlayerName("Unknown Player");
      }
    };

    fetchNameAndStats();
  }, [playerId]);

  return (
    <div className="mb-8">
      <h1 className="text-4xl font-bold text-white">{playerName}</h1>
      {yearsText && <p className="text-gray-400 text-sm mt-1">{yearsText}</p>}
    </div>
  );
};

export default PlayerName;
