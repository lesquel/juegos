import type { Match } from "@modules/games/models/match.model";
import { CardParticipant } from "./CardParticipant";
import { JoinMatch } from "./JoinMatch";
import type { Game } from "@modules/games/models/game.model";

export const CardMatch = ({ match, game }: { match: Match; game: Game }) => {
  const matchStatus = match.winner_id
    ? "Terminada"
    : match.participant_ids.length >= Number(game.game_capacity)
    ? "En curso"
    : "Esperando jugadores";

  const statusColor = {
    Terminada: "bg-red-500",
    "En curso": "bg-yellow-500",
    "Esperando jugadores": "bg-green-500",
  };

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <div
              className={`px-3 py-1 text-xs font-bold text-white rounded-full inline-block ${statusColor[matchStatus]}`}>
              {matchStatus}
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-semibold text-white">Apuesta Base</div>
            <div className="text-2xl font-bold text-purple-400">${match.base_bet_amount}</div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-300 mb-3">Jugadores</h3>
          <div className="space-y-3">
            {match.participant_ids.length > 0 ? (
              match.participant_ids.map((id) => (
                <CardParticipant key={id} id={id} />
              ))
            ) : (
              <div className="text-gray-400 italic">No hay jugadores aún.</div>
            )}
          </div>
        </div>

        {match.winner_id && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-300 mb-3">Ganador</h3>
            <CardParticipant id={match.winner_id} />
          </div>
        )}

        <div className="border-t border-gray-700 pt-4">
          <JoinMatch match={match} game={game} />
        </div>
      </div>
      <div className="bg-gray-900 px-6 py-2 text-xs text-gray-500">
        <span>ID de la partida: {match.match_id}</span>
      </div>
    </div>
  );
};
