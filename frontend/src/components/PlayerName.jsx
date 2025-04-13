import React from "react";

const PlayerName = ({ bio }) => {
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
    <div className="relative bg-zinc-900 px-8 py-6 rounded-2xl shadow-lg w-full max-w-7xl mx-auto overflow-hidden border border-zinc-700/50">
      {/* Animated outline ring */}
      <div className="flex flex-col md:flex-row items-center gap-6">
        {/* Headshot */}
        <img
          src={headshotUrl}
          alt={`${DISPLAY_FIRST_LAST} headshot`}
          className="w-32 h-32 md:w-40 md:h-40 object-cover rounded-xl border border-zinc-700 shadow-md"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/fallback-headshot.png"; // optional
          }}
        />

        {/* Name + Info */}
        <div className="flex-1 space-y-2 text-center md:text-left">
          <h2 className="text-white text-2xl font-bold">
            {DISPLAY_FIRST_LAST}
          </h2>
          <div className="text-zinc-400 text-sm font-medium">
            #{JERSEY} • {POSITION} •{" "}
            {isRetired ? (
              <span className="italic text-rose-400">Retired</span>
            ) : (
              `${TEAM_CITY} ${TEAM_NAME} (${TEAM_ABBREVIATION})`
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm text-zinc-300 pt-2">
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
              {SEASON_EXP >= 2 ? `${SEASON_EXP}-year vet` : "Rookie"}
            </div>

            <div>
              <span className="text-zinc-400">Draft:</span>{" "}
              {`Round ${DRAFT_ROUND}, Pick ${DRAFT_NUMBER} (${DRAFT_YEAR})`}
            </div>
            <div>
              <span className="text-zinc-400">College:</span> {SCHOOL}
            </div>
            <div>
              <span className="text-zinc-400">Country:</span> {COUNTRY}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerName;
