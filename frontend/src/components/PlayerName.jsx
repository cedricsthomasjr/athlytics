import React, { useEffect, useState } from "react";

const PlayerName = ({ bio }) => {
  const [badges, setBadges] = useState([]);

  useEffect(() => {
    if (!bio?.PERSON_ID) return;

    const fetchAwards = async () => {
      try {
        const res = await fetch(
          `http://127.0.0.1:5000/api/player/${bio.PERSON_ID}/awards-api`
        );
        const data = await res.json();

        if (!data?.PlayerAwards) return;

        const awardsList = data.PlayerAwards.map(
          (award) => award.DESCRIPTION || ""
        );

        const mvpCount = awardsList.filter(
          (desc) => desc === "NBA Most Valuable Player"
        ).length;
        const champCount = awardsList.filter(
          (desc) => desc === "NBA Champion"
        ).length;
        const finalsMvpCount = awardsList.filter(
          (desc) => desc === "NBA Finals Most Valuable Player"
        ).length;
        const dpoyCount = awardsList.filter(
          (desc) => desc === "NBA Defensive Player of the Year"
        ).length;
        const allNbaCount = awardsList.filter((desc) =>
          desc.includes("All-NBA")
        ).length;
        const hofCount = awardsList.filter((desc) =>
          desc.includes("Hall of Fame")
        ).length;

        const badgeList = [];

        if (mvpCount > 0) badgeList.push({ label: "MVP", count: mvpCount });
        if (champCount > 0)
          badgeList.push({ label: "Champion", count: champCount });
        if (finalsMvpCount > 0)
          badgeList.push({ label: "Finals MVP", count: finalsMvpCount });
        if (dpoyCount > 0) badgeList.push({ label: "DPOY", count: dpoyCount });
        if (allNbaCount > 0)
          badgeList.push({ label: "All-NBA", count: allNbaCount });
        if (hofCount > 0) badgeList.push({ label: "Hall of Fame" });

        if (bio?.GREATEST_75_FLAG === "Y") {
          badgeList.push({ label: "NBA 75", special: true });
        }

        setBadges(badgeList);
      } catch (err) {
        console.error("Failed to fetch awards:", err);
      }
    };

    fetchAwards();
  }, [bio?.PERSON_ID]);

  if (!bio) return null;

  const {
    DISPLAY_FIRST_LAST,
    POSITION,
    TEAM_NAME,
    TEAM_CITY,
    TEAM_ABBREVIATION,
    HEIGHT,
    WEIGHT,
    JERSEY,
    SCHOOL,
    COUNTRY,
    SEASON_EXP,
    DRAFT_YEAR,
    DRAFT_ROUND,
    DRAFT_NUMBER,
    AGE,
    ROSTERSTATUS,
    PERSON_ID,
  } = bio;

  const isRetired = ROSTERSTATUS !== "Active";
  const headshotUrl = `https://cdn.nba.com/headshots/nba/latest/1040x760/${PERSON_ID}.png`;

  return (
    <div className="relative bg-zinc-900 border border-zinc-800 rounded-2xl shadow-md w-full max-w-5xl mx-auto p-6 overflow-hidden">
      {/* Top Section */}
      <div className="flex items-center gap-6 flex-wrap">
        {/* Headshot */}
        <img
          src={headshotUrl}
          alt={`${DISPLAY_FIRST_LAST} headshot`}
          className="w-24 h-24 md:w-28 md:h-28 object-cover rounded-xl border border-purple-500/50 shadow-md hover:scale-105 transition-all duration-300"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/fallback-headshot.png";
          }}
        />

        {/* Name and Info */}
        <div className="flex-1 space-y-1">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <h1 className="text-2xl md:text-3xl font-bold text-white leading-tight">
              {DISPLAY_FIRST_LAST}
            </h1>

            {/* 🏆 Major Badges */}
            {badges.length > 0 && (
              <div className="flex gap-3 mt-2 md:mt-0 text-purple-400 text-sm font-semibold flex-wrap">
                {badges.map((badge, idx) => (
                  <span
                    key={idx}
                    className={`px-2 py-1 rounded-md ${
                      badge.special
                        ? "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white animate-pulse-slow shadow-md hover:shadow-purple-400/40 hover:scale-105 transition-all duration-500"
                        : "bg-purple-800/20 text-purple-400"
                    }`}
                  >
                    {badge.count ? `${badge.count}× ` : ""}
                    {badge.label}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2 text-zinc-400 text-xs font-medium">
            <span className="text-purple-400 font-semibold text-sm">
              #{JERSEY}
            </span>
            <span>• {POSITION}</span>
            <span>
              •{" "}
              {isRetired ? (
                <span className="italic text-rose-400">Retired</span>
              ) : (
                <>
                  <span>
                    {TEAM_CITY} {TEAM_NAME}
                  </span>{" "}
                  <span className="text-purple-400">({TEAM_ABBREVIATION})</span>
                </>
              )}
            </span>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="my-4 border-t border-zinc-700" />

      {/* Mini Info Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs text-zinc-300">
        <div>
          <span className="text-zinc-400">Height:</span> {HEIGHT}
        </div>
        <div>
          <span className="text-zinc-400">Weight:</span> {WEIGHT} lbs
        </div>
        <div>
          <span className="text-zinc-400">Age:</span> {AGE}
        </div>
        <div>
          <span className="text-zinc-400">Experience:</span>{" "}
          {SEASON_EXP >= 2 ? `${SEASON_EXP}-yr vet` : "Rookie"}
        </div>
        {DRAFT_YEAR !== "Undrafted" && (
          <div>
            <span className="text-zinc-400">Draft:</span> Rd {DRAFT_ROUND}, Pick{" "}
            {DRAFT_NUMBER} ({DRAFT_YEAR})
          </div>
        )}
        {SCHOOL && (
          <div>
            <span className="text-zinc-400">College:</span> {SCHOOL}
          </div>
        )}
        <div>
          <span className="text-zinc-400">Country:</span> {COUNTRY}
        </div>
      </div>
    </div>
  );
};

export default PlayerName;
