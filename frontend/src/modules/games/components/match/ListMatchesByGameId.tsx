import { MatchClientData } from "@modules/games/services/matchClientData";
import { QueryProvider } from "@providers/QueryProvider";
import { CardMatch } from "./CardMatch";
import { CreateMatch } from "./CreateMatch";
import { GameClientData } from "@modules/games/services/gameClientData";
import { useEffect } from "react";
import type { Game } from "@modules/games/models/game.model";
import { LoadingComponent } from "@components/LoadingComponent";

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
    <LoadingComponent />
  );

  if (error || gameError) return (
    <div className="flex justify-center items-center h-screen">
      <div className="text-red-400 text-2xl">Error: {error?.message || gameError?.message}</div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8 text-white">
      <div className="max-w-3xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 md:mb-0">Partidas de {game?.game_name}</h1>
          <CreateMatch gameId={id} game={game as Game} />
        </div>
        
        <div className="flex flex-wrap -mx-4">
          {data?.results.map((match) => (
            <div key={match.match_id} className="w-full px-4 mb-8">
              <CardMatch match={match} game={game as Game} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
