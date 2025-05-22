
import React, { useState } from "react";

const API_KEY = "e78ff85f4c26c37e18666a5736e5741e";
const SPORT = "basketball_nba";

export default function App() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchOdds = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.the-odds-api.com/v4/sports/${SPORT}/odds/?regions=us&markets=h2h,spreads,totals&apiKey=${API_KEY}`
      );
      const data = await response.json();
      setGames(data);
    } catch (error) {
      console.error("Error fetching odds:", error);
    }
    setLoading(false);
  };

  return (
    <div className="p-6 font-sans">
      <h1 className="text-3xl font-bold mb-4">Live Sports Odds</h1>
      <button
        onClick={fetchOdds}
        className="mb-6 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        {loading ? "Loading..." : "Refresh Odds"}
      </button>

      {games.length === 0 ? (
        <p>No games loaded. Click "Refresh Odds" to begin.</p>
      ) : (
        games.map((game) => (
          <div key={game.id} className="border rounded-xl p-4 mb-4 shadow">
            <div className="text-xl font-semibold mb-2">
              {game.away_team} @ {game.home_team}
            </div>
            <div className="text-sm text-gray-500 mb-2">
              Start: {new Date(game.commence_time).toLocaleString()}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {game.bookmakers.map((book, idx) => (
                <div key={idx} className="border p-2 rounded bg-gray-50">
                  <div className="font-bold text-green-700">{book.title}</div>
                  <div className="text-sm mt-1">
                    <strong>Spread:</strong>{" "}
                    {(book.markets.find(m => m.key === "spreads")?.outcomes || []).map(o =>
                      `${o.name} ${o.point} (${o.price})`).join(" | ")}
                  </div>
                  <div className="text-sm mt-1">
                    <strong>Moneyline:</strong>{" "}
                    {(book.markets.find(m => m.key === "h2h")?.outcomes || []).map(o =>
                      `${o.name} (${o.price})`).join(" | ")}
                  </div>
                  <div className="text-sm mt-1">
                    <strong>Total:</strong>{" "}
                    {(book.markets.find(m => m.key === "totals")?.outcomes || []).map(o =>
                      `${o.name} ${o.point} (${o.price})`).join(" | ")}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
