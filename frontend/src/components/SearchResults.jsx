import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const highlightMatch = (text, search) => {
  if (!search) return text;
  const regex = new RegExp(`(${search})`, "i");
  return text.split(regex).map((part, i) =>
    regex.test(part) ? (
      <span key={i} className="text-purple-400 font-semibold">
        {part}
      </span>
    ) : (
      part
    )
  );
};

const SearchResults = ({
  results,
  searchTerm,
  navigate,
  selectedIndex,
  setSelectedIndex,
}) => {
  const filtered = results
    .filter((p) => p && p.status)
    .filter(
      (p) =>
        p.status === "Active" ||
        (p.status === "Retired" && p.total_points >= 1000)
    )
    .slice(0, 4);

  useEffect(() => {
    if (filtered.length > 0 && selectedIndex >= filtered.length) {
      setSelectedIndex(0);
    }
  }, [filtered, selectedIndex, setSelectedIndex]);

  const handleKeyDown = (e) => {
    if (filtered.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filtered.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex(
        (prev) => (prev - 1 + filtered.length) % filtered.length
      );
    } else if (e.key === "Enter" && filtered[selectedIndex]) {
      navigate(`/player/${filtered[selectedIndex].id}`);
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  return (
    <AnimatePresence>
      {filtered.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 4 }}
          transition={{ duration: 0.2 }}
          className="absolute top-full mt-3 w-full max-w-2xl mx-auto 
                     bg-zinc-900/80 backdrop-blur-xl border border-zinc-700/40 
                     rounded-2xl shadow-2xl ring-1 ring-white/10 z-50"
        >
          <ul className="divide-y divide-white/5 px-1 py-1">
            {filtered.map((player, i) => (
              <li
                key={player.id}
                onClick={() => navigate(`/player/${player.id}`)}
                className={`flex items-center gap-4 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 
                            ${
                              i === selectedIndex
                                ? "bg-purple-800/20"
                                : "hover:bg-purple-900/10"
                            }`}
              >
                <img
                  src={player.image}
                  alt={player.full_name}
                  className="w-10 h-10 rounded-full object-cover 
                             border border-zinc-700 shadow-sm"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 text-white text-sm font-semibold">
                    {highlightMatch(player.full_name, searchTerm)}
                    <span
                      className={`text-[10px] px-2 py-[1px] rounded-full 
                                  shadow-sm font-semibold tracking-wide ${
                                    player.status === "Active"
                                      ? "text-green-300 bg-green-900/30"
                                      : "text-yellow-300 bg-yellow-900/30"
                                  }`}
                    >
                      {player.status}
                    </span>
                  </div>
                  <div className="text-xs text-gray-400">
                    {player.team} • {player.position} •{" "}
                    {player.total_points.toLocaleString()} pts
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </motion.div>
      )}

      {filtered.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 4 }}
          transition={{ duration: 0.2 }}
          className="absolute top-full mt-3 w-full max-w-2xl mx-auto 
                     bg-zinc-900/80 text-white text-sm text-center 
                     rounded-xl border border-zinc-700/40 shadow-md 
                     backdrop-blur-md p-4"
        >
          No results found
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SearchResults;
