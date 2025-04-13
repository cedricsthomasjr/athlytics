import React, { useState, useEffect } from "react";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import Fuse from "fuse.js";
const Hero = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [bios, setBios] = useState({}); // 🧠 cache for player bios

  useEffect(() => {
    if (query.trim() === "") {
      setResults([]);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `http://127.0.0.1:5000/api/search?q=${query}`
        );
        const data = await response.json();

        if (data) {
          const fuse = new Fuse(data, {
            keys: ["full_name"],
            threshold: 0.4,
            distance: 50,
            minMatchCharLength: 2,
          });

          const results = fuse.search(query).map((res) => res.item);
          const sliced = results.sort((a, b) => b.MIN - a.MIN).slice(0, 4);
          setResults(sliced);

          const biosData = {};
          await Promise.all(
            sliced.map(async (player) => {
              try {
                const res = await fetch(
                  `http://127.0.0.1:5000/api/player-bio/${player.id}`
                );
                const bio = await res.json();
                biosData[player.id] = bio;
              } catch (e) {
                console.error("Bio fetch failed:", player.id, e);
              }
            })
          );
          setBios(biosData);
        }
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
      setLoading(false);
    };

    const timeoutId = setTimeout(fetchData, 500);
    return () => clearTimeout(timeoutId);
  }, [query]);

  const clearInput = () => setQuery("");

  return (
    <section className="min-h-screen flex flex-col justify-center items-center text-center py-20 px-6 bg-black font-sans">
      <h1
        className="text-6xl font-bold text-transparent bg-clip-text 
        bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 
        animate-[gradientShift_4s_ease-in-out_infinite] 
        bg-[length:200%_200%] drop-shadow-[0_0_24px_rgba(236,72,153,0.9)]"
      >
        Where data meets the hardwood.
      </h1>

      <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
        Break down every play, stat, and accolade with precision. From advanced
        analytics to historical awards, Athlytics is your all-in-one platform
        for smarter NBA insights.
      </p>

      {/* Search Bar + Dropdown */}
      <div className="relative w-full max-w-4xl mx-auto mt-8">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="bg-transparent text-white border-2 border-white px-6 py-4 rounded-full text-xl w-full focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 pl-12 placeholder-gray-400 shadow-xl"
          placeholder="Search for players, teams, and more."
        />
        <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white w-6 h-6" />
        {query && (
          <XMarkIcon
            onClick={clearInput}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white w-6 h-6 cursor-pointer"
          />
        )}

        {/* Loading */}
        {loading && (
          <div className="absolute left-0 right-0 mt-2 text-white text-sm px-4">
            Loading...
          </div>
        )}

        {/* Autocomplete Dropdown */}
        {results.length > 0 && !loading && (
          <div className="absolute left-0 right-0 mt-2 bg-zinc-900/90 rounded-xl p-4 text-white max-h-60 overflow-y-auto shadow-xl border border-zinc-700/40 backdrop-blur-md z-40">
            <ul className="space-y-2">
              {results.map((player) => {
                const bio = bios[player.id] || {};
                return (
                  <li
                    key={player.id}
                    onClick={() => navigate(`/player/${player.id}`)}
                    className="group px-3 py-2 rounded-md cursor-pointer hover:bg-purple-800/10 transition-all duration-150"
                  >
                    <div className="flex justify-between items-center gap-3">
                      <div className="text-sm font-medium truncate group-hover:text-purple-300">
                        {player.full_name}
                        {bio.TEAM_NAME && (
                          <span className="text-xs font-normal text-gray-400 ml-1.5">
                            • {bio.TEAM_NAME}
                          </span>
                        )}
                      </div>

                      <span className="text-[11px] bg-zinc-700/40 text-zinc-200 px-2 py-[1px] rounded-full font-medium tracking-wide">
                        {bio.POSITION || "—"}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {/* No Results */}
        {results.length === 0 && !loading && query.trim() !== "" && (
          <div className="absolute left-0 right-0 mt-2 text-white bg-zinc-900/90 rounded-lg shadow-md p-4 text-sm border border-zinc-700/40 backdrop-blur-md z-40">
            No results found
          </div>
        )}
      </div>
    </section>
  );
};

export default Hero;
