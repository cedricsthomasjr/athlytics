// components/Hero/SearchResults.jsx
import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const SearchResults = ({ results, navigate }) => {
  const filtered = results
    .filter((p) => p && p.status)
    .filter(
      (p) =>
        p.status === "Active" ||
        (p.status === "Retired" && p.total_points >= 1000)
    )
    .slice(0, 4);

  return (
    <AnimatePresence>
      {filtered.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 4 }}
          transition={{ duration: 0.2 }}
          className="absolute top-full mt-2 w-full max-w-2xl mx-auto bg-black border border-white/10 rounded-xl shadow-lg z-50 backdrop-blur-md"
        >
          <ul className="divide-y divide-white/5">
            {filtered.map((player) => (
              <li
                key={player.id}
                onClick={() => navigate(`/player/${player.id}`)}
                className="flex items-center gap-4 px-4 py-3 hover:bg-white/5 transition-all duration-150 cursor-pointer"
              >
                <img
                  src={player.image}
                  alt={player.full_name}
                  className="w-10 h-10 rounded-full object-cover border border-white/10"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 text-white text-sm font-medium">
                    {player.full_name}
                    <span
                      className={`text-[10px] px-2 py-[1px] rounded-full ${
                        player.status === "Active"
                          ? "text-green-400 bg-green-900/20"
                          : "text-yellow-400 bg-yellow-900/20"
                      }`}
                    >
                      {player.status}
                    </span>
                  </div>
                  <div className="text-xs text-gray-400">
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
          className="absolute top-full mt-2 w-full max-w-2xl mx-auto bg-black border border-white/10 rounded-xl shadow-sm z-50 p-4 text-center text-white text-sm"
        >
          No results found
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SearchResults;
