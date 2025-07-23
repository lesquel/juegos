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

  if (isLoading || gameIsLoading) return <div>Loading...</div>;
  if (error || gameError)
    return (
      <div className="text-center text-red-400">Error: {error?.message}</div>
    );
  return (
    <div className="text-white">
      <h1>Matches</h1>
      <CreateMatch gameId={id} game={game as Game} />
      <ul>
        {data?.results.map((match) => (
          <CardMatch key={match.match_id} match={match} game={game as Game} />
        ))}
      </ul>
    </div>
  );
};
