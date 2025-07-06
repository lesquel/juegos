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
  if (error) return <div className="text-center text-red-400">Error: {error.message}</div>;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col items-center">
      <h1 className="text-4xl sm:text-5xl font-extrabold text-center mb-10 text-white">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-500 to-cyan-400">
          Explora Nuestros Juegos
        </span>
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl">
        {data?.results.map((game: Game) => (
          <CardGame key={game.game_id} game={game} />
        ))}
      </div>
    </div>
  );
};