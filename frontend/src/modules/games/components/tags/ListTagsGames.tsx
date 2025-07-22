import { GameClientData } from "@modules/games/services/gameClientData";
import { CardTagsGame } from "./CardTagsGame";

export const ListTagsGames = ({ categoryId }: { categoryId: string }) => {
  const { data, isLoading, error } =
    GameClientData.getGamesByCategoryId(categoryId);

  if (isLoading) return <div className="text-center">Loading...</div>;
  if (error)
    return (
      <div className="text-center text-red-400">Error: {error.message}</div>
    );
  if (!data?.results || data.results.length === 0)
    return <div className="text-center text-red-400">No hay juegos</div>;
  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Juegos: </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {data?.results.map((game) => (
          <CardTagsGame key={game.game_id} game={game} />
        ))}
      </div>
    </div>
  );
};
