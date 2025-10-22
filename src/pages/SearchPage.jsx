import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import api from "../api";
import Movie from "./Movie";
import ActorCard from "../components/ActorCard";
import Header from "./Header";

export default function SearchPage() {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("q") || "";

  const [movies, setMovies] = useState([]);
  const [actors, setActors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (!query) return;

    setLoading(true);

    async function fetchData() {
      try {
        const [moviesRes, actorsRes, userRes] = await Promise.all([
          api.get(`/api/movies/?q=${encodeURIComponent(query)}`),
          api.get(`/api/actors/?q=${encodeURIComponent(query)}`),
          api.get("/api/user/me/").catch(() => ({ data: null })),
        ]);

        setMovies(moviesRes.data.results || moviesRes.data || []);
        setActors(actorsRes.data.results || actorsRes.data || []);
        setUser(userRes.data);
      } catch (err) {
        console.error("Erreur recherche:", err);
        setMovies([]);
        setActors([]);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [query]);

  return (
    <div>
      <Header username={user?.username} />

      <main className="max-w-5xl mx-auto p-6 space-y-8">
        <h1 className="text-2xl font-bold mb-4">Résultats pour « {query} »</h1>

        {loading ? (
          <div>Recherche en cours…</div>
        ) : (
          <>
            {/* Films */}
            <section>
              <h2 className="text-xl font-semibold mb-3">Films</h2>
              {movies.length === 0 ? (
                <div className="text-gray-600">Aucun film trouvé.</div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {movies.map((movie) => (
                    <Movie key={movie.id} movie={movie} />
                  ))}
                </div>
              )}
            </section>

            {/* Acteurs */}
            <section>
              <h2 className="text-xl font-semibold mb-3">Acteurs</h2>
              {actors.length === 0 ? (
                <div className="text-gray-600">Aucun acteur trouvé.</div>
              ) : (
                <div className="flex gap-4 overflow-x-auto py-2">
                  {actors.map((actor) => (
                    <ActorCard
                      key={actor.id}
                      castItem={{ actor }} // ActorCard attend castItem
                    />
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </main>
    </div>
  );
}
