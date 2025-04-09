// components/Hero/SearchBar.jsx
import React from "react";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";

const SearchBar = ({ query, setQuery }) => {
  return (
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
          onClick={() => setQuery("")}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white w-6 h-6 cursor-pointer"
        />
      )}
    </div>
  );
};

export default SearchBar;
