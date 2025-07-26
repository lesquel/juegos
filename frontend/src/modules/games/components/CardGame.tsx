import { gamesRoutesConfig } from "../config/games.routes.config";
import type { Game } from "../models/game.model";
import { memo, useMemo } from "react";

interface CardGameProps {
  game: Game;
}

export const CardGame = memo(({ game }: CardGameProps) => {
  const { game_id, game_name, game_img, game_description, house_odds } = game;

  // Memoizar la URL del juego
  const gameUrl = useMemo(() => 
    `${gamesRoutesConfig.base}/${game_id}`, 
    [game_id]
  );

  // Memoizar estilos complejos
  const gradientStyles = useMemo(() => ({
    boxShadow: '0 0 15px rgba(20, 184, 166, 0), 0 0 25px rgba(20, 184, 166, 0)'
  }), []);

  return (
    <a
      href={gameUrl}
      className="relative block rounded-2xl overflow-hidden group transform transition-all duration-300 ease-in-out hover:scale-105 shadow-lg"
    >
      <div className="absolute inset-0 bg-black opacity-50 z-10 group-hover:opacity-60 transition-opacity duration-300"></div>
      <div
        className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-teal-500 transition-all duration-300 z-20"
        style={gradientStyles}
      ></div>
      <img
        src={game_img}
        alt={game_name}
        loading="lazy"
        className="w-full h-64 object-cover transform transition-transform duration-500 ease-in-out group-hover:scale-110"
      />
      <div className="absolute inset-0 z-10 flex flex-col justify-end p-6 bg-gradient-to-t from-black via-black/70 to-transparent">
        <h2 className="text-2xl font-bold text-white mb-2 drop-shadow-lg">{game_name}</h2>
        <p className="text-gray-300 text-sm mb-4 h-10 overflow-hidden">{game_description}</p>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400">Cuota base</p>
            <p className="text-lg font-bold text-teal-400">{house_odds}</p>
          </div>
          <button className="bg-gradient-to-r from-teal-500 to-cyan-400 text-white font-bold py-2 px-4 rounded-lg shadow-lg transition duration-300 ease-in-out">
            Jugar Ahora
          </button>
        </div>
      </div>
    </a>
  );
});

CardGame.displayName = "CardGame";
