import { useAuthStore } from "@modules/auth/store/auth.store";
import type { Game } from "@modules/games/models/game.model";
import type { Match } from "@modules/games/models/match.model";
import { MatchClientData } from "@modules/games/services/matchClientData";

export const JoinMatch = ({ match, game }: { match: Match; game: Game }) => {
  const onSuccess = (data: Match) => {
    location.href =
      location.protocol +
      "//" +
      location.host +
      "/" +
      game?.game_url +
      "?match_id=" +
      data.match_id;
  };
  const { mutate, error } = MatchClientData.joinMatch(
    match.match_id,
    onSuccess
  );
  const isJoined = match.participant_ids.includes(
    useAuthStore.getState().user?.user.user_id as string
  );

  const handleJoinMatch = async () => {
    if (isJoined) {
      if (match.winner_id === null) {
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

  const isFull = match.participant_ids.length >= Number(game.game_capacity);
  const isFinished = match.winner_id !== null;

  return (
    <div>
      {error ? (
        <span className="text-center text-red-400">
          Errors: {error.errors.join(", ")}
        </span>
      ) : null}
      <button
        disabled={isFull || isFinished}
        onClick={() => {
          handleJoinMatch();
        }}
        className={`w-full font-bold py-3 px-6 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center gap-3 text-lg 
          ${isFull || isFinished
            ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
            : 'bg-gradient-to-r from-purple-600 to-blue-500 text-white hover:from-purple-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500'
          }`}
      >
        {isFinished ? 'Partida Terminada' : isFull ? 'Partida Llena' : isJoined ? 'Volver a la Partida' : 'Unirse a la Partida'}
      </button>
    </div>
  );
};
