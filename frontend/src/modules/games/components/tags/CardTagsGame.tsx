import type { Game } from "@modules/games/models/game.model";

export const CardTagsGame = ({ game }: { game: Game }) => {
  return (
    <a
      key={game.game_id}
      href={`/games/${game.game_id}`}
      className="group block bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-2"
    >
      <div className="relative">
        <img 
          src={game.game_img} 
          alt={`Imagen del juego ${game.game_name}`}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-40 transition-all duration-300"></div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-800 truncate">{game.game_name}</h3>
      </div>
    </a>
  );
};
