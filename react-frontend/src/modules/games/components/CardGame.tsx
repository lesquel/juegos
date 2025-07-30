import { gamesRoutesConfig } from "../config/games.routes.config";
import type { Game } from "../models/game.model";
import { memo, useMemo } from "react";
import { Link } from "@tanstack/react-router";

interface CardGameProps {
  game: Game;
}

export const CardGame = memo(({ game }: CardGameProps) => {
  const { game_id, game_name, game_img, game_description, house_odds } = game;

  const gameUrl = useMemo(
    () => `${gamesRoutesConfig.base}/${game_id}`,
    [game_id]
  );

  return (
    <Link
      to={gameUrl}
      className="relative block rounded-3xl overflow-hidden group transform transition-all duration-500 ease-in-out hover:scale-105 hover:-translate-y-2 shadow-2xl hover:shadow-purple-500/25 h-full"
    >
      {/* Glass overlay effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm z-10 group-hover:from-white/20 group-hover:to-white/10 transition-all duration-500 pointer-events-none"></div>
      
      {/* Border glow effect */}
      <div className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-gradient-to-r group-hover:from-cyan-500 group-hover:to-purple-500 transition-all duration-500 z-20 pointer-events-none"></div>
      
      {/* Image with parallax effect */}
      <div className="relative h-72 sm:h-80 lg:h-96 xl:h-[28rem] overflow-hidden">
        <img
          src={game_img}
          alt={game_name}
          loading="lazy"
          className="w-full h-full object-cover transform transition-transform duration-700 ease-out group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent"></div>
      </div>
      
      {/* Content overlay */}
      <div className="absolute inset-0 z-20 flex flex-col justify-end p-6 sm:p-8 lg:p-10 pointer-events-none">
        <div className="transform transition-all duration-500 group-hover:translate-y-0 translate-y-2 space-y-4 sm:space-y-5 lg:space-y-6">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold drop-shadow-lg bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-200 leading-tight">
            {game_name}
          </h2>
          <p className="text-gray-300 text-base sm:text-lg lg:text-xl line-clamp-2 leading-relaxed font-medium">
            {game_description}
          </p>
          <div className="flex items-center justify-between flex-wrap gap-4 sm:gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-5 lg:p-6 border border-white/20 min-w-[120px]">
              <p className="text-sm sm:text-base text-gray-400 uppercase tracking-wider font-medium mb-1">Cuota base</p>
              <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-cyan-400">{house_odds}x</p>
            </div>
            <div className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-bold py-3 px-6 sm:py-4 sm:px-8 lg:py-5 lg:px-10 rounded-2xl shadow-xl transition-all duration-300 ease-in-out group-hover:from-cyan-400 group-hover:to-purple-400 group-hover:shadow-2xl group-hover:shadow-purple-500/50">
              <span className="flex items-center gap-3 sm:gap-4 text-base sm:text-lg lg:text-xl">
                🎮 <span className="hidden sm:inline font-semibold">Jugar Ahora</span><span className="sm:hidden font-semibold">Jugar</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
})