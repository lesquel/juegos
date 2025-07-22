import type { Game } from "@modules/games/models/game.model";

export const CardTagsGame = ({ game }: { game: Game }) => {
  const { game_id, game_name, game_img, game_description } = game;

  return (
    <a
      href={`/games/${game.game_id}`}
      className="relative block rounded-2xl overflow-hidden group transform transition-all duration-300 ease-in-out hover:scale-105 shadow-lg"
    >
      <div className="absolute inset-0 bg-black opacity-50 z-10 group-hover:opacity-60 transition-opacity duration-300"></div>
      <div
        className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-teal-500 transition-all duration-300 z-20"
        style={{ boxShadow: '0 0 15px rgba(20, 184, 166, 0), 0 0 25px rgba(20, 184, 166, 0)' }}
      ></div>
      <img
        src={game_img}
        alt={game_name}
        className="w-full h-64 object-cover transform transition-transform duration-500 ease-in-out group-hover:scale-110"
      />
      <div className="absolute inset-0 z-10 flex flex-col justify-end p-6 bg-gradient-to-t from-black via-black/70 to-transparent">
        <h2 className="text-2xl font-bold text-white mb-2 drop-shadow-lg">{game_name}</h2>
        <p className="text-gray-300 text-sm mb-4 h-10 overflow-hidden">{game_description}</p>
        <div className="flex items-center justify-end">
          <button className="bg-gradient-to-r from-purple-500 to-teal-400 text-white font-bold py-2 px-4 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition duration-300 ease-in-out">
            Jugar Ahora
          </button>
        </div>
      </div>
    </a>
  );
};