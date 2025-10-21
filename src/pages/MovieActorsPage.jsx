import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api";
import Header from "./Header";
import ActorCard from "../components/ActorCard";

export default function MovieActorsPage() {
  const { id } = useParams(); // movie id
  const [user, setUser] = useState(null);
  const [cast, setCast] = useState([]);
  const [movie, setMovie] = useState(null);
  const [loadingCast, setLoadingCast] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    async function fetchUser() {
      try {
        const res = await api.get("/api/user/me/");
        setUser(res.data);
      } catch {
        setUser(null);
      }
    }

    async function fetchCastAndMovie() {
      setLoadingCast(true);
      setError(null);
      try {
        const res = await api.get(`/api/movies/${id}/actors/`);
        setCast(Array.isArray(res.data) ? res.data : res.data.results || []);

        // // optionnel : charge aussi le film pour affichage (titre / affiche)
        // try {
        //   const movieRes = await api.get(`/api/movies/${id}/`);
        //   setMovie(movieRes.data);
        // } catch {
        //   setMovie(null);
        // }
      } catch (err) {
        console.error("fetch cast error", err);
        setError("Impossible de charger la distribution du film.");
        setCast([]);
      } finally {
        setLoadingCast(false);
      }
    }

    fetchUser();
    fetchCastAndMovie();
  }, [id]);

  return (
    <div>
      <Header username={user?.username} />
      <main className="max-w-6xl mx-auto p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold">{movie?.title_fr || movie?.title_original || "Distribution"}</h1>
            {movie?.release_date && <div className="text-sm text-gray-600">{new Date(movie.release_date).getFullYear()}</div>}
          </div>
          <Link to={`/movies/${id}`} className="px-3 py-2 border rounded hover:shadow-sm">← Fiche film</Link>
        </div>

        {loadingCast ? (
          <div>Chargement de la distribution…</div>
        ) : error ? (
          <div className="text-red-600">{error}</div>
        ) : cast.length === 0 ? (
          <div className="text-gray-600">Aucun acteur listé pour ce film.</div>
        ) : (
          <div className="overflow-x-auto">
            <div className="flex gap-4 pb-3">
              {cast.map((c, idx) => (
                <ActorCard key={c.id ?? c.actor?.id ?? idx} castItem={c} />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
