import React, { useState, useEffect } from "react";
import { Scatter } from "react-chartjs-2";
import { Chart as ChartJS, PointElement, LinearScale, Tooltip } from "chart.js";
import { useParams } from "react-router-dom";

ChartJS.register(PointElement, LinearScale, Tooltip);

const ShotChart = ({ playerName }) => {
  const { id } = useParams();
  const [shots, setShots] = useState([]);
  const [view, setView] = useState("regular");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShots = async () => {
      setLoading(true);
      let url = `http://127.0.0.1:5000/api/player/${id}/shots`;
      if (view === "career") url += `?career=true`;
      else if (view === "playoffs") url += `?playoffs=true`;
      const res = await fetch(url);
      const data = await res.json();
      setShots(data.shots || []);
      setLoading(false);
    };
    fetchShots();
  }, [id, view]);

  const data = {
    datasets: [
      {
        data: shots.map((shot) => ({ x: shot.x, y: shot.y })),
        backgroundColor: shots.map((shot) =>
          shot.made ? "rgba(0, 200, 81, 0.8)" : "rgba(220, 20, 60, 0.8)"
        ),
        pointRadius: 4,
      },
    ],
  };

  const options = {
    scales: {
      x: {
        min: -250,
        max: 250,
        grid: { display: false },
        ticks: { display: false },
      },
      y: {
        min: -50,
        max: 500,
        grid: { display: false },
        ticks: { display: false },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => {
            const shot = shots[context.dataIndex];
            return `${shot.made ? "Made" : "Missed"} (${shot.zone})`;
          },
        },
      },
      legend: { display: false },
    },
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-center gap-4">
        {["regular", "playoffs", "career"].map((v) => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={`px-4 py-2 rounded-md ${
              view === v
                ? "bg-purple-600 text-white"
                : "bg-gray-700 text-gray-300"
            }`}
          >
            {v.charAt(0).toUpperCase() + v.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-white text-center">Loading Shot Chart...</div>
      ) : shots.length === 0 ? (
        <div className="text-white text-center">No shot data available.</div>
      ) : (
        <div className="bg-[#1a1a1a] rounded-xl p-4">
          <h2 className="text-center text-xl font-bold mb-6">{playerName}</h2>
          <Scatter data={data} options={options} />
        </div>
      )}
    </div>
  );
};

export default ShotChart;
