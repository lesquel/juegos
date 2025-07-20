import { GameClientData } from "@modules/games/services/gameClientData";
import { CardTagsGame } from "./CardTagsGame";

export const ListTagsGames = ({ categoryId }: { categoryId: string }) => {
  const { data, isLoading, error } =
    GameClientData.getGamesByCategoryId(categoryId);

  if (isLoading) return <div>Loading...</div>;
  if (error)
    return (
      <div className="text-center text-red-400">Error: {error.message}</div>
    );
  if (!data?.results || data.results.length === 0)
    return <div className="text-center text-red-400">No hay juegos</div>;
  return (
    <div>
      <h2 className="text-md font-medium">Juegos</h2>
      <div className="flex flex-wrap gap-2">
        {data?.results.map((game) => (
          <CardTagsGame key={game.game_id} game={game} />
        ))}
      </div>
    </div>
  );
};
