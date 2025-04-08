import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PlayerStatsTable from "../components/PlayerStatsTable";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Awards from "../components/Awards";
import PlayerName from "../components/PlayerName";
import PlayerStatChart from "../components/PlayerStatChart";
import GameLogChart from "../components/GameLogChart";
import Divider from "../components/Divider";
import { motion } from "framer-motion";

const PlayerPage = () => {
  const { id } = useParams();
  const [stats, setStats] = useState([]);
  const [playerName, setPlayerName] = useState("");
  const [bbrefId, setBBRefId] = useState(null);
  const [loading, setLoading] = useState(true);

  const generateBBRefId = (fullName) => {
    const names = fullName.toLowerCase().split(" ");
    const first = names[0];
    const last = names[names.length - 1];
    const lastPart = last.slice(0, 5).padEnd(5, "x");
    const firstPart = first.slice(0, 2).padEnd(2, "x");
    return `${lastPart}${firstPart}01`;
  };

  useEffect(() => {
    const fetchPlayer = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:5000/api/player/${id}`);
        const data = await res.json();
        setStats(data);

        const nameRes = await fetch(
          `http://127.0.0.1:5000/api/player-name/${id}`
        );
        const nameData = await nameRes.json();
        setPlayerName(nameData.name);

        const generatedId = generateBBRefId(nameData.name);
        setBBRefId(generatedId);
      } catch (err) {
        console.error("Error fetching player data:", err);
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
        {/* Player Name Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <PlayerName />
        </motion.div>

        <Divider />

        {/* Player Stats Table */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <PlayerStatsTable stats={stats} playerName={playerName} />
        </motion.div>

        <Divider />

        {/* Per-Season Stat Graphs */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <PlayerStatChart data={stats} />
        </motion.div>

        <Divider />

        {/* Game Log Graph */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <GameLogChart playerId={id} careerStats={stats} />
        </motion.div>

        <Divider />

        {/* Awards Section */}
        {bbrefId && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Awards playerId={bbrefId} />
          </motion.div>
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
