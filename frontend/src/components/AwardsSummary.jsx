import React, { useEffect, useState } from "react";
import { ExclamationCircleIcon } from "@heroicons/react/24/solid";

const AwardsSummary = ({ playerId }) => {
  const [awards, setAwards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!playerId) return setLoading(false);

    const fetchAwards = async () => {
      try {
        const res = await fetch(
          `http://127.0.0.1:5000/api/player/${playerId}/awards-api`
        );
        const data = await res.json();
        setAwards(data.PlayerAwards || []);
      } catch (err) {
        console.error("Failed to fetch awards:", err);
        setHasError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchAwards();
  }, [playerId]);

  const groupAwards = (awards) => {
    const grouped = {};
    awards.forEach((award) => {
      const key = award.DESCRIPTION || "Unknown Award";
      if (grouped[key]) {
        grouped[key].push(award);
      } else {
        grouped[key] = [award];
      }
    });
    return grouped;
  };

  const groupedAwards = groupAwards(awards);
  const sortedAwards = Object.entries(groupedAwards);

  const isMajorAchievement = (title) =>
    [
      "NBA Most Valuable Player",
      "Finals Most Valuable Player",
      "NBA Champion",
      "All-NBA",
      "All-Defensive Team",
    ].some((major) => title.includes(major));

  const isCareerHighlight = (title) =>
    [
      "All-Star",
      "Defensive",
      "Rookie",
      "Olympic",
      "Player of the Month",
      "Player of the Week",
    ].some((highlight) => title.includes(highlight));

  const majorAchievements = sortedAwards.filter(([desc]) =>
    isMajorAchievement(desc)
  );
  const careerHighlights = sortedAwards.filter(
    ([desc]) => !isMajorAchievement(desc) && isCareerHighlight(desc)
  );
  const otherAwards = sortedAwards.filter(
    ([desc]) => !isMajorAchievement(desc) && !isCareerHighlight(desc)
  );

  if (loading) {
    return <div className="text-gray-500 animate-pulse">Loading awards...</div>;
  }

  if (hasError) {
    return (
      <div className="flex items-center text-red-500 gap-2">
        <ExclamationCircleIcon className="h-5 w-5" />
        <span>Failed to load awards.</span>
      </div>
    );
  }

  if (sortedAwards.length === 0) {
    return (
      <div className="text-gray-500">No awards found for this player.</div>
    );
  }

  return (
    <div className="p-6 rounded-2xl max-w-5xl w-full flex flex-col items-center bg-transparent">
      <h2 className="text-2xl font-bold text-white mb-6">Career Résumé</h2>

      {/* Major Achievements */}
      {majorAchievements.length > 0 && (
        <section className="w-full mb-10">
          <h3 className="flex items-center gap-2 text-lg font-bold text-purple-400 mb-4">
            🏆 Major Achievements
          </h3>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {majorAchievements.map(([desc, list], idx) => (
              <li
                key={idx}
                className="bg-zinc-900/80 hover:bg-zinc-800 transition px-4 py-2 rounded-xl flex justify-between items-center shadow-sm"
              >
                <span className="text-white text-sm">{desc}</span>
                <span className="text-gray-400 text-sm">{list.length}x</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Career Highlights */}
      {careerHighlights.length > 0 && (
        <section className="w-full mb-10">
          <h3 className="flex items-center gap-2 text-lg font-bold text-purple-300 mb-4">
            ✨ Career Highlights
          </h3>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {careerHighlights.map(([desc, list], idx) => (
              <li
                key={idx}
                className="bg-zinc-900/80 hover:bg-zinc-800 transition px-4 py-2 rounded-xl flex justify-between items-center shadow-sm"
              >
                <span className="text-white text-sm">{desc}</span>
                <span className="text-gray-400 text-sm">{list.length}x</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Other Awards */}
      {otherAwards.length > 0 && (
        <section className="w-full">
          <h3 className="flex items-center gap-2 text-lg font-bold text-purple-200 mb-4">
            🌟 Other Awards
          </h3>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {otherAwards.map(([desc, list], idx) => (
              <li
                key={idx}
                className="bg-zinc-900/80 hover:bg-zinc-800 transition px-4 py-2 rounded-xl flex justify-between items-center shadow-sm"
              >
                <span className="text-white text-sm">{desc}</span>
                <span className="text-gray-400 text-sm">{list.length}x</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
};

export default AwardsSummary;
