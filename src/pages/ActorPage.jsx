import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api";
import Header from "./Header";
import Movie from "./Movie";

export default function ActorPage() {
  const { id } = useParams(); // actor id
  const [user, setUser] = useState(null);
  const [actor, setActor] = useState(null);
  const [movies, setMovies] = useState([]);
  const [loadingActor, setLoadingActor] = useState(true);
  const [loadingMovies, setLoadingMovies] = useState(true);
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

    async function fetchActorAndMovies() {
      setLoadingActor(true);
      setLoadingMovies(true);
      setError(null);

      try {
        const resActor = await api.get(`/api/actors/${id}/`);
        setActor(resActor.data);
      } catch (err) {
        console.error("fetch actor failed", err);
        setError("Impossible de charger l'acteur.");
        setLoadingActor(false);
        setLoadingMovies(false);
        return;
      } finally {
        setLoadingActor(false);
      }

      try {
        const resMovies = await api.get(`/api/actors/${id}/movies/`);
        setMovies(Array.isArray(resMovies.data) ? resMovies.data : resMovies.data.results || []);
      } catch (err) {
        console.warn("fetch actor movies failed, fallback to /api/movies/?actor=", err);
        try {
          const res2 = await api.get(`/api/movies/?actor=${id}`);
          setMovies(Array.isArray(res2.data) ? res2.data : res2.data.results || []);
        } catch (err2) {
          console.error("fallback movies failed", err2);
          setMovies([]);
        }
      } finally {
        setLoadingMovies(false);
      }
    }

    fetchUser();
    fetchActorAndMovies();
  }, [id]);

  if (loadingActor) return <div className="p-6">Chargement de l'acteur…</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!actor) return <div className="p-6">Acteur introuvable.</div>;

  const full_name = actor.full_name || `${actor.first_name || ""} ${actor.last_name || ""}`.trim();
  const birth_date = actor.birth_date || actor?.dob || null;
  let photo = actor.photo || actor.avatar || null;
  if (photo && typeof photo === "object" && photo.url) photo = photo.url;

  return (
    <div>
      <Header username={user?.username} />
      <main className="max-w-4xl mx-auto p-6">
        <div className="flex flex-col md:flex-row gap-6 items-start bg-white rounded-lg shadow p-6">
          <div className="w-full md:w-44 flex-shrink-0">
            <div className="w-full h-56 md:h-64 bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={photo || "/images/actor-placeholder.png"}
                alt={full_name || "Acteur"}
                className="w-full h-full object-cover"
                onError={(e) => { e.currentTarget.src = "/images/actor-placeholder.png"; }}
              />
            </div>
          </div>

          <div className="flex-1">
            <h1 className="text-2xl font-extrabold">{full_name || "Acteur"}</h1>
            {birth_date && <div className="text-sm text-gray-600 mt-1">Né(e) le {new Date(birth_date).toLocaleDateString("fr-FR")}</div>}

            {actor.biography && (
              <div className="mt-4 text-gray-800 prose">
                <p>{actor.biography}</p>
              </div>
            )}

            <div className="mt-6 flex gap-3">
              <Link to="/" className="px-4 py-2 border rounded hover:shadow-sm">Retour</Link>
            </div>
          </div>
        </div>

        <section className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Films avec {full_name || "cet acteur"}</h2>

          {loadingMovies ? (
            <div>Chargement des films…</div>
          ) : movies.length === 0 ? (
            <div className="text-gray-600">Aucun film trouvé pour cet acteur.</div>
          ) : (
            <div className="overflow-x-auto">
              <div className="flex gap-4 pb-3 px-1">
                {movies.map((m) => (
                  <article key={m.id} className="flex-shrink-0 w-40 bg-white rounded-lg shadow-sm overflow-hidden">
                    <Link to={`/movies/${m.id}`}>
                      <div className="w-full h-56 bg-gray-100">
                        <img
                          src={m.poster || m.poster_url || "/images/poster-placeholder.png"}
                          alt={m.title_fr || m.title_original}
                          className="w-full h-full object-cover"
                          onError={(e) => { e.currentTarget.src = "/images/poster-placeholder.png"; }}
                        />
                      </div>
                      <div className="p-2">
                        <div className="text-sm font-medium truncate">{m.title_fr || m.title_original}</div>
                        <div className="text-xs text-gray-500 mt-1">{m.release_date ? new Date(m.release_date).getFullYear() : ""}</div>
                      </div>
                    </Link>
                  </article>
                ))}
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
