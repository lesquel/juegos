import { MatchClientData } from "@modules/games/services/matchClientData";
import { QueryProvider } from "@providers/QueryProvider";
import { CardMatch } from "./CardMatch";
import { CreateMatch } from "./CreateMatch";
import { GameClientData } from "@modules/games/services/gameClientData";
import { useEffect } from "react";
import type { Game } from "@modules/games/models/game.model";

export const ListMatchesByGameId = ({ id }: { id: string }) => {
  return (
    <QueryProvider>
      <UseListMatchesByGameId id={id} />
    </QueryProvider>
  );
};

const UseListMatchesByGameId = ({ id }: { id: string }) => {
  const { data, isLoading, error } = MatchClientData.getMatchesByGameId(id);
  const {
    data: game,
    isLoading: gameIsLoading,
    error: gameError,
  } = GameClientData.getGameDetail(id);

  useEffect(() => {
    console.log(location);
  }, []);

  if (isLoading || gameIsLoading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="text-white text-2xl">Loading...</div>
    </div>
  );

  if (error || gameError) return (
    <div className="flex justify-center items-center h-screen">
      <div className="text-red-400 text-2xl">Error: {error?.message || gameError?.message}</div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8 text-white">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Partidas de {game?.game_name}</h1>
        <CreateMatch gameId={id} game={game as Game} />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data?.results.map((match) => (
          <CardMatch key={match.match_id} match={match} game={game as Game} />
        ))}
      </div>
    </div>
  );
};
