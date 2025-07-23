import { MatchClientData } from "@modules/games/services/matchClientData";
import { UserClientData } from "@modules/user/services/userClientData";
import { QueryProvider } from "@providers/QueryProvider";
import { CardMatch } from "./CardMatch";

export const ListMatchesByGameId = ({ id }: { id: string }) => {
  return (
    <QueryProvider>
      <UseListMatchesByGameId id={id} />
    </QueryProvider>
  );
};

const UseListMatchesByGameId = ({ id }: { id: string }) => {
  const { data, isLoading, error } = MatchClientData.getMatchesByGameId(id);

  if (isLoading) return <div>Loading...</div>;
  if (error)
    return (
      <div className="text-center text-red-400">Error: {error.message}</div>
    );
  return (
    <div className="text-white">
      <h1>Matches</h1>
      <ul>
        {data?.results.map((match) => (
          <CardMatch key={match.match_id} match={match} />
        ))}
      </ul>
    </div>
  );
};
