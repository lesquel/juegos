import React, { memo, useMemo } from "react";
import type { Match } from "@modules/games/models/match.model";
import type { Game } from "@modules/games/models/game.model";
import { CardParticipant } from "./CardParticipant";
import { JoinMatch } from "./JoinMatch";
import {
  ClipboardCheckIcon,
  ClockIcon,
  PersonStandingIcon,
  Star,
} from "lucide-react";

interface CardMatchProps {
  match: Match;
  game: Game;
}

export const CardMatch: React.FC<CardMatchProps> = memo(({ match, game }) => {
  // Memoizar estado de la partida
  const matchStatus = useMemo(() => {
    if (match.winner_id) return "Terminada";
    if (match.participant_ids.length === Number(game?.game_capacity))
      return "En curso";
    return "Esperando jugadores";
  }, [match.winner_id, match.participant_ids.length, game?.game_capacity]);

  // Memoizar colores de estado
  const statusColor = useMemo(() => {
    const colors = {
      Terminada: "bg-red-500 text-red-100",
      "En curso": "bg-yellow-500 text-yellow-900",
      "Esperando jugadores": "bg-green-500 text-green-100",
    };
    return colors[matchStatus as keyof typeof colors];
  }, [matchStatus]);

  // Memoizar fecha formateada
  const formattedDate = useMemo(() => {
    return new Date(match.created_at).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }, [match.created_at]);

  // Memoizar lista de participantes
  const participantsList = useMemo(() => {
    if (match.participant_ids.length === 0) {
      return (
        <div className="text-gray-400 italic flex items-center gap-2">
          <PersonStandingIcon className="h-5 w-5" />
          No hay jugadores aún
        </div>
      );
    }

    return (
      <div className="flex flex-wrap gap-2">
        {match.participant_ids.map((id) => (
          <CardParticipant key={id} id={id} />
        ))}
      </div>
    );
  }, [match.participant_ids]);

  // Memoizar sección de ganador
  const winnerSection = useMemo(() => {
    if (!match.winner_id) return null;

    return (
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-300 mb-4 flex items-center gap-2">
          <Star className="h-6 w-6" />
          Ganador
        </h3>
        <CardParticipant id={match.winner_id} />
      </div>
    );
  }, [match.winner_id]);

  // Memoizar iconos de estado
  const statusIcon = useMemo(() => {
    const icons = {
      Terminada: <ClipboardCheckIcon className="h-4 w-4" />,
      "En curso": <ClockIcon className="h-4 w-4" />,
      "Esperando jugadores": <PersonStandingIcon className="h-4 w-4" />,
    };
    return icons[matchStatus as keyof typeof icons];
  }, [matchStatus]);

  return (
    <article className="bg-gray-800 border border-gray-700 rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-2xl hover:scale-105 h-full flex flex-col backdrop-blur-lg">
      {/* Header */}
      <header className="p-6 md:p-8 flex-grow">
        <div className="flex justify-between items-start mb-6">
          <div
            className={`px-4 py-2 text-sm font-bold rounded-full inline-flex items-center gap-2 ${statusColor}`}
          >
            {statusIcon}
            {matchStatus}
          </div>
          <div className="text-right">
            <div className="text-sm md:text-base font-medium text-gray-400 mb-1">
              Apuesta Base
            </div>
            <div className="text-2xl md:text-3xl font-bold text-purple-400">
              ${match.base_bet_amount}
            </div>
          </div>
        </div>

        {/* Jugadores */}
        <section className="mb-6">
          <h3 className="text-xl font-semibold text-gray-300 mb-4 flex items-center gap-2">
            <PersonStandingIcon className="h-6 w-6 text-teal-400" />
            Jugadores ({match.participant_ids.length}/{game?.game_capacity || 0}
            )
          </h3>
          {participantsList}
        </section>

        {winnerSection}
      </header>

      {/* Join Match Section */}
      <div className="border-t border-gray-700 p-6 bg-gray-900 bg-opacity-50">
        <JoinMatch match={match} game={game} />
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 px-6 py-3 text-xs text-gray-500 border-t border-gray-800">
        <div className="flex flex-wrap items-center gap-4">
          <span className="flex items-center gap-1">
            <ClipboardCheckIcon className="h-3 w-3" />
            ID: {match.match_id}
          </span>
          <span className="flex items-center gap-1">
            <ClockIcon className="h-3 w-3" />
            Creada: {formattedDate}
          </span>
        </div>
      </footer>
    </article>
  );
});

CardMatch.displayName = "CardMatch";
