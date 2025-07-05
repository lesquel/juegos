import { QueryProvider } from "@providers/QueryProvider";
import { GameClientData } from "../services/gameClientData";
import { CardGame } from "./CardGame";
import type { Game } from "../models/game.model";
import { LoadingComponent } from "@components/LoadingComponent";

export const ListGames = () => {
  return (
    <QueryProvider>
      <UseListgame />
    </QueryProvider>
  );
};

const UseListgame = () => {
  const { data, isLoading, error } = GameClientData.getGames();
  if (isLoading) return <LoadingComponent />;
  if (error) return <div>Error: {error.message}</div>;
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl m-auto">
      {data?.results.map((game: Game) => {
        return <CardGame key={game.game_id} game={game} />;
      })}
    </div>
  );
};
