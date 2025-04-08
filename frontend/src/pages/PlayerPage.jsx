import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PlayerStatsTable from "../components/PlayerStatsTable";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Awards from "../components/Awards";
import PlayerName from "../components/PlayerName";

const PlayerPage = () => {
  const { id } = useParams();
  const [stats, setStats] = useState([]);
  const [playerName, setPlayerName] = useState("");
  const [bbrefId, setBBRefId] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔧 Helper to generate bbref ID from full name
  const generateBBRefId = (fullName) => {
    const names = fullName.toLowerCase().split(" ");
    const first = names[0]; // "lebron"
    const last = names[names.length - 1]; // "james"
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
      <Navbar />

      <main className="flex-grow pt-[96px] md:pt-[112px] px-6 md:px-10 pb-10">
        {/* Player Name Header */}
        <PlayerName />

        {/* Player Stats Table */}
        <PlayerStatsTable stats={stats} playerName={playerName} />

        {/* Awards Section */}
        <div className="mt-10">{bbrefId && <Awards playerId={bbrefId} />}</div>
      </main>

      <Footer />
    </div>
  );
};

export default PlayerPage;
