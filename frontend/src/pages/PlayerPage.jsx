import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PlayerStatsTable from "../components/PlayerStatsTable";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PlayerName from "../components/PlayerName";
import PlayerStatChart from "../components/PlayerStatChart";
import GameLogChart from "../components/GameLogChart";
import Divider from "../components/Divider";
import { motion } from "framer-motion";
import AwardsSummary from "../components/AwardsSummary";

// ⬇️ Moved outside the component to silence ESLint
const suffixes = ["jr", "sr", "ii", "iii", "iv", "v"];

const generateBBRefId = (fullName) => {
  const parts = fullName
    .toLowerCase()
    .replace(/[^a-z\s]/g, "") // strip punctuation
    .split(" ")
    .filter((part) => !suffixes.includes(part)); // remove suffixes

  if (parts.length < 2) return null;

  const first = parts[0];
  const last = parts[parts.length - 1];

  const lastPart = last.slice(0, 5).padEnd(5, "x");
  const firstPart = first.slice(0, 2).padEnd(2, "x");

  return `${lastPart}${firstPart}01`;
};

const PlayerPage = () => {
  const { id } = useParams();
  const [stats, setStats] = useState([]);
  const [playerBio, setPlayerBio] = useState(null);
  const [bbrefId, setBBRefId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlayer = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:5000/api/player/${id}`);
        const data = await res.json();
        setStats(data);
        console.log("📈 Stats data:", data);

        const nameRes = await fetch(
          `http://127.0.0.1:5000/api/player-bio/${id}`
        );
        const nameData = await nameRes.json();
        console.log("🧠 Bio response:", nameData);

        if (!nameData.DISPLAY_FIRST_LAST) {
          console.warn("❌ nameData.DISPLAY_FIRST_LAST is undefined or null");
          return;
        }

        const manualNameMap = {
          76003: "Kareem Abdul-Jabbar",
        };

        const manualBBRefMap = {
          "Kareem Abdul-Jabbar": "abdulka01",
        };

        const correctedName = manualNameMap[id] || nameData.DISPLAY_FIRST_LAST;
        const manualBBRefId = manualBBRefMap[correctedName];
        const generatedId = manualBBRefId || generateBBRefId(correctedName);

        console.log("🧾 Final Name:", correctedName);
        console.log("🆔 Final BBRef ID:", generatedId);

        setPlayerBio(nameData);
        setBBRefId(generatedId);
      } catch (err) {
        console.error("🔥 Error fetching player data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayer();
  }, [id]);

  if (loading) return <div className="text-white p-10">Loading...</div>;
  if (!stats || stats.length === 0)
    return <div className="text-white p-10">No stats available</div>;

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Navbar />
      </motion.div>

      <main className="flex-grow pt-[96px] md:pt-[112px] px-6 md:px-10 pb-10 space-y-10">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Divider />
          <PlayerName bio={playerBio} />
          <Divider />
          <div className="flex flex-col items-center gap-4 mt-6 mb-8">
            <h1 className="text-2xl font-bold text-center">Awards Summary</h1>
            <AwardsSummary bbrefId={bbrefId} />
          </div>
        </motion.div>

        <Divider />

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h1 className="text-2xl font-bold mb-4">Career Table</h1>
          <PlayerStatsTable stats={stats} playerBio={playerBio} />
        </motion.div>

        <Divider />

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h1 className="text-2xl font-bold mb-4">Career Graph</h1>
          <PlayerStatChart data={stats} />
        </motion.div>

        <Divider />

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h1 className="text-2xl font-bold mb-4">Season Graph</h1>
          <GameLogChart playerId={id} careerStats={stats} />
        </motion.div>

        <Divider />

        {bbrefId && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          />
        )}
      </main>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.6 }}
      >
        <Footer />
      </motion.div>
    </div>
  );
};

export default PlayerPage;
