import { useAuthStore } from "@modules/auth/store/auth.store";
import type { Game } from "@modules/games/models/game.model";
import type { Match } from "@modules/games/models/match.model";
import { MatchClientData } from "@modules/games/services/matchClientData";

export const JoinMatch = ({ match, game }: { match: Match; game: Game }) => {
  const { mutate, error } = MatchClientData.joinMatch(match.match_id);
  const isJoined = match.participant_ids.includes(
    useAuthStore.getState().user?.user.user_id as string
  );

  const handleJoinMatch = async () => {
    if (isJoined) {
      if (match.winner_id === null) {
        console.log("match.match_id", match.match_id);
        location.href =
          location.protocol +
          "//" +
          location.host +
          "/" +
          game.game_url +
          "?match_id=" +
          match.match_id;
      }
      return;
    }
    mutate({
      bet_amount: match.base_bet_amount,
    });
  };

  return (
    <div>
      {error ? (
        <span className="text-center text-red-400">
          Errors: {error.errors.join(", ")}
        </span>
      ) : null}
      <button
        disabled={match.participant_ids.length >= 2 || match.winner_id !== null}
        onClick={() => {
          handleJoinMatch();
        }}
        className="bg-gradient-to-r from-purple-600 to-blue-500 text-white font-bold py-2 px-4 rounded-full shadow-lg hover:from-purple-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition duration-300 ease-in-out text-xl transform hover:scale-105 flex items-center justify-center gap-3"
      >
        join{" "}
      </button>
    </div>
  );
};
