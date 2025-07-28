import React, { memo, useMemo } from "react";
import { Link } from "@tanstack/react-router";
import type { Game } from "@modules/games/models/game.model";
import { Play } from "lucide-react";

interface CardTagsGameProps {
  game: Game;
}

export const CardTagsGame: React.FC<CardTagsGameProps> = memo(({ game }) => {
  const { game_id, game_name, game_img, game_description } = game;

  // Memoizar icono de juego
  const playIcon = useMemo(() => <Play className="h-5 w-5" />, []);

  // Memoizar descripción truncada
  const truncatedDescription = useMemo(() => {
    if (!game_description) return "Sin descripción disponible";
    return game_description.length > 80
      ? `${game_description.substring(0, 80)}...`
      : game_description;
  }, [game_description]);

  return (
    <article className="group">
      <Link
        to="/games/$id"
        params={{ id: game_id }}
        className="relative block rounded-2xl overflow-hidden transform transition-all duration-300 ease-in-out hover:scale-105 shadow-lg hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-purple-500 focus:ring-opacity-50"
        aria-label={`Jugar ${game_name}`}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black opacity-50 z-10 group-hover:opacity-60 transition-opacity duration-300"></div>

        {/* Border Effect */}
        <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-purple-500 transition-all duration-300 z-20"></div>

        {/* Game Image */}
        <img
          src={game_img}
          alt={`Imagen del juego ${game_name}`}
          className="w-full h-64 object-cover transform transition-transform duration-500 ease-in-out group-hover:scale-110"
          loading="lazy"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "/placeholder-game.jpg"; // Imagen de fallback
          }}
        />

        {/* Content Overlay */}
        <div className="absolute inset-0 z-30 flex flex-col justify-end p-6 bg-gradient-to-t from-black via-black/70 to-transparent">
          <header className="mb-4">
            <h2 className="text-2xl font-bold text-white mb-2 drop-shadow-lg line-clamp-1">
              {game_name}
            </h2>
            <p className="text-gray-300 text-sm leading-relaxed line-clamp-2">
              {truncatedDescription}
            </p>
          </header>

          <footer className="flex items-center justify-end">
            <button
              type="button"
              className="bg-gradient-to-r from-purple-500 to-teal-400 text-white font-bold py-2 px-4 rounded-lg shadow-lg hover:from-purple-600 hover:to-teal-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition duration-300 ease-in-out flex items-center gap-2"
              aria-label={`Comenzar a jugar ${game_name}`}
            >
              {playIcon}
              Jugar Ahora
            </button>
          </footer>
        </div>
      </Link>
    </article>
  );
});

CardTagsGame.displayName = "CardTagsGame";
