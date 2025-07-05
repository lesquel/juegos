import { gamesRoutesConfig } from "../config/games.routes.config";
import type { Game } from "../models/game.model";

export const CardGame = ({ game }: { game: Game }) => {
  const { game_id, game_name, game_img, game_url, game_description } = game;
  return (
    <a
      href={gamesRoutesConfig.base + `/${game_id}`}
      className="block text-white rounded-lg overflow-hidden
                transform transition-all duration-300 ease-in-out hover:scale-102 group"
    >
      <div className="w-full h-40 bg-gray-200 flex items-center justify-center">
        <img
          src={game_img}
          alt={game_name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4 bg-gray-700">
        <h2 className="text-purple-400 text-lg font-medium mb-1">
          {game_name}
        </h2>
        <p className="text-white text-sm mb-2 line-clamp-2">
          {game_description}
        </p>

        <p
          className="flex items-center text-purple-400 text-sm font-medium
            opacity-100 translate-y-0 pointer-events-auto
            md:opacity-0 md:translate-y-2 md:pointer-events-none
            md:group-hover:opacity-100 md:group-hover:translate-y-0 md:group-hover:pointer-events-auto
            transition-all duration-300 ease-out"
        >
          Jugar ahora
        </p>
      </div>
    </a>
  );
  // {/* <a href={gamesRoutesConfig.base + `/${game_id}`}>Ver mas</a> */}
};
