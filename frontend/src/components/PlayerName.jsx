import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PlayerImage from "./PlayerImage";

const PlayerName = () => {
  const { id } = useParams();
  const [playerName, setPlayerName] = useState("");
  const [meta, setMeta] = useState(null);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const nameRes = await fetch(
          `http://127.0.0.1:5000/api/player-name/${id}`
        );
        const nameData = await nameRes.json();
        setPlayerName(nameData.name);

        const metaRes = await fetch(
          `http://127.0.0.1:5000/api/player/${id}/meta`
        );
        const metaData = await metaRes.json();
        setMeta(metaData);
      } catch (err) {
        console.error("Error loading player info:", err);
      }
    };

    fetchAll();
  }, [id]);

  return (
    <div className="relative z-0">
      {/* Layer 1: Subtle Pulse Gradient */}
      <div className="absolute -inset-1 rounded-3xl blur-xl bg-gradient-to-r from-pink-500 via-purple-600 to-fuchsia-500 opacity-30 animate-pulse z-[-1]" />

      {/* Layer 2: Base Glow (refined) */}
      <div className="absolute -inset-1 rounded-3xl blur-[32px] bg-pink-500 opacity-20 z-[-2]" />

      {/* Main Card */}
      <div className="flex items-center gap-6 px-6 py-6 bg-zinc-900 rounded-2xl shadow-lg ring-1 ring-zinc-800/60 backdrop-blur-md">
        <PlayerImage id={id} className="w-28 sm:w-32 lg:w-36" />
        <div className="flex flex-col justify-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-1">
            {playerName}
          </h1>

          {meta && (
            <div className="flex flex-wrap gap-3 text-sm text-gray-300">
              <span className="bg-zinc-800/60 px-3 py-1 rounded-full border border-zinc-700 shadow-sm">
                Team: {meta.team}
              </span>
              <span className="bg-zinc-800/60 px-3 py-1 rounded-full border border-zinc-700 shadow-sm">
                Position: {meta.position}
              </span>
              <span className="bg-zinc-800/60 px-3 py-1 rounded-full border border-zinc-700 shadow-sm">
                Age: {meta.age}
              </span>
              <span
                className={`px-3 py-1 rounded-full font-semibold tracking-wide ${
                  meta.status === "Active"
                    ? "bg-green-700 text-white"
                    : "bg-gray-600 text-white"
                }`}
              >
                {meta.status}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlayerName;
