import type { Game } from "@modules/games/models/game.model";

export const CardTagsGame = ({ game }: { game: Game }) => {
  return (
    <a
      key={game.game_id}
      href={`/games/${game.game_id}`}
      className="p-3 bg-blue-200 rounded-2xl hover:bg-blue-300 transition-colors text-black font-medium"
    >
      <p className="text-sm">{game.game_name}</p>
    </a>
  );
};
