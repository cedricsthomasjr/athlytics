import React, { useEffect, useState } from "react";

const PlayerImage = ({ id, className = "" }) => {
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    if (!id) return;

    /*************  ✨ Windsurf Command ⭐  *************/
    /**
     * Fetches the player image URL from the backend API.
     *
     * Queries the backend API at `http://127.0.0.1:5000/api/player/:id/image`
     * and sets the `imageUrl` state variable to the response's `image_url`.
     *
     * If the request fails, logs an error message to the console.
     */
    /*******  bea638f5-844f-45f3-9edf-4ff64ad1d0e7  *******/ const fetchImage =
      async () => {
        try {
          const response = await fetch(
            `http://127.0.0.1:5000/api/player/${id}/image`
          );
          const data = await response.json();
          setImageUrl(data.image_url);
        } catch (err) {
          console.error("Failed to load player image:", err);
        }
      };

    fetchImage();
  }, [id]);

  if (!imageUrl) return null;

  return (
    <img
      src={imageUrl}
      alt={`Player ${id}`}
      className={`rounded-xl w-32 h-auto shadow-md object-cover ${className}`}
      loading="lazy"
    />
  );
};

export default PlayerImage;
