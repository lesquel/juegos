import type { Match } from "@modules/games/models/match.model";
import { CardParticipant } from "./CardParticipant";
import { JoinMatch } from "./JoinMatch";
import type { Game } from "@modules/games/models/game.model";

export const CardMatch = ({ match, game }: { match: Match; game: Game }) => {
  const matchStatus = match.winner_id
    ? "Terminada"
    : match.participant_ids.length === Number(game?.game_capacity)
    ? "En curso"
    : "Esperando jugadores";

  const statusColor = {
    Terminada: "bg-red-500",
    "En curso": "bg-yellow-500",
    "Esperando jugadores": "bg-green-500",
  };

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-2xl h-full flex flex-col">
      <div className="p-6 md:p-8 flex-grow">
        <div className="flex justify-between items-start mb-4">
          <div>
            <div
              className={`px-3 py-1 text-sm font-bold text-white rounded-full inline-block ${statusColor[matchStatus]}`}
            >
              {matchStatus}
            </div>
          </div>
          <div className="text-right">
            <div className="md:text-lg font-semibold text-white text-sm">
              Apuesta Base
            </div>
            <div className="text-3xl font-bold text-purple-400">
              ${match.base_bet_amount}
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-300 mb-4">
            Jugadores
          </h3>
          <div className="space-x-4 flex items-center flex-wrap gap-y-2.5">
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
            <h3 className="text-xl font-semibold text-gray-300 mb-4">
              Ganador
            </h3>
            <CardParticipant id={match.winner_id} />
          </div>
        )}
      </div>

      <div className="border-t border-gray-700 p-6">
        <JoinMatch match={match} game={game} />
      </div>

      <div className="bg-gray-900 px-6 py-2 text-xs text-gray-500">
        <span>ID de la partida: {match.match_id}</span>
        <span>&nbsp;&nbsp;|&nbsp;&nbsp;</span>
        <span>Fecha de creación: {match.created_at.toLocaleString()}</span>
      </div>
    </div>
  );
};
