import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Header = ({ username }) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const handleHome = () => navigate("/");
  const handleLogout = () => navigate("/logout");
  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setQuery("");
    }
  };

  return (
    <header className="w-full bg-gradient-to-r from-green-600 to-green-400 shadow-lg p-4">
      {/* Ligne 1 : Logo + user info */}
      <div className="flex justify-between items-center w-full mb-3">
        <button
          className="text-white text-3xl font-bold tracking-wide"
          onClick={handleHome}
        >
          CINEMAX
        </button>

        <div className="flex items-center gap-4">
          <span className="text-white text-lg font-medium text-right">
            <span className="block">Bonjour,</span>
            <span className="block font-bold">{username}</span>
          </span>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-white text-green-700 font-semibold rounded-lg shadow hover:bg-green-50 transition whitespace-nowrap"
          >
            Déconnexion
          </button>
        </div>
      </div>

      {/* Ligne 2 : Barre de recherche */}
      <form
        onSubmit={handleSearch}
        className="flex w-full max-w-xl mx-auto items-center bg-white rounded-full shadow-sm overflow-hidden"
      >
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher un film ou un acteur..."
          className="flex-grow px-4 py-2 text-gray-700 focus:outline-none"
        />
      </form>
    </header>
  );
};

export default Header;
