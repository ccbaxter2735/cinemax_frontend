import React from "react";
import { Link } from "react-router-dom";

export default function ActorCard({ castItem }) {
  const actor = castItem?.actor || castItem || {};
  const name = actor.full_name || `${actor.first_name || ""} ${actor.last_name || ""}`.trim() || "Acteur";
  let img = actor.photo || actor.avatar || "/images/actor-placeholder.png";
  if (img && typeof img === "object" && img.url) img = img.url;
  const role = castItem?.role_name || "";

  const to = actor.id ? `/actors/${actor.id}` : null;

  const CardContent = (
    <div className="flex-shrink-0 w-40 bg-white rounded-lg shadow-sm p-0 text-center hover:shadow-md transition">
      <div className="w-full h-40 md:h-48 bg-gray-100 flex items-center justify-center overflow-hidden rounded-t-lg">
        <img
          src={img}
          alt={name}
          loading="lazy"
          className="w-full h-full object-cover"
          onError={(e) => { e.currentTarget.src = "/images/actor-placeholder.png"; }}
        />
      </div>
      <div className="p-3 text-left">
        <div className="text-sm font-semibold text-gray-900 truncate">{name}</div>
        {role && <div className="text-xs text-gray-500 mt-1 truncate">{role}</div>}
      </div>
    </div>
  );

  return to ? (
    <Link to={to} aria-label={`Voir la fiche de ${name}`}>
      {CardContent}
    </Link>
  ) : (
    CardContent
  );
}
