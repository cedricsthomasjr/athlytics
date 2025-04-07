import React, { useState, useEffect } from "react";

import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();

  const [query, setQuery] = useState(""); // Store the search query
  const [results, setResults] = useState([]); // Store the search results
  const [loading, setLoading] = useState(false); // Handle loading state

  // Fetch data from the backend when query changes
  useEffect(() => {
    if (query.trim() === "") {
      setResults([]); // Clear results if query is empty
      return;
    }

    const fetchData = async () => {
      setLoading(true); // Set loading state to true when fetching data
      try {
        const response = await fetch(
          `http://127.0.0.1:5000/api/search?q=${query}` // Query backend for players
        );
        const data = await response.json();

        if (data) {
          setResults(
            data
              .sort((a, b) => b.MIN - a.MIN) // Sort by total minutes played
              .slice(0, 4) // Limit to top 4 results
          );

          // Limit the results to 5 after fetching
        }
      } catch (error) {
        // Handle any potential errors that may occur when fetching data
        console.error("Error fetching search results:", error);
      }
      setLoading(false); // Set loading state to false after fetching data
    };
    /**
     * Fetches data from the backend when the search query changes
     * @param {string} query The search query
     */

    const timeoutId = setTimeout(fetchData, 500); // Debounced search query
    return () => clearTimeout(timeoutId); // Cleanup the timeout
  }, [query]); // Trigger the effect when query changes

  // Clear the input field
  const clearInput = () => setQuery("");

  return (
    <section className="min-h-screen flex flex-col justify-center items-center text-center py-20 px-6 bg-black font-sans">
      <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-purple-500 to-pink-600 animate-gradientText tracking-wide leading-tight mb-8">
        Stats don't lie.
      </h1>
      <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
        Let them speak the truth. Our platform brings you real-time insights
        into the stats that matter the most, all in one place.
      </p>

      {/* Modern Search Bar Section */}
      <div className="relative w-full max-w-4xl mx-auto mt-8">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)} // Update query as user types
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
      </div>

      {/* Loading State */}
      {loading && <div className="text-white mt-4">Loading...</div>}

      {/* Autocomplete Dropdown */}
      {results.length > 0 && !loading && (
        <div className="mt-4 bg-[#232323] rounded-lg p-4 text-white max-h-60 overflow-y-auto w-full">
          <ul>
            {results.map((player, index) => (
              <li
                key={player.id}
                onClick={() => navigate(`/player/${player.id}`)}
                className={`py-2 px-4 hover:bg-purple-600 transition-colors cursor-pointer rounded-md ${
                  index !== results.length - 1 ? "border-b border-gray-400" : ""
                }`}
              >
                <div className="flex justify-between">
                  <span className="text-lg font-semibold">
                    {player.full_name}
                  </span>
                  <span className="text-sm text-gray-300 font-light">
                    {player.position}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* No results */}
      {results.length === 0 && !loading && query.trim() !== "" && (
        <div className="text-white mt-4">No results found</div>
      )}
    </section>
  );
};

export default Hero;
