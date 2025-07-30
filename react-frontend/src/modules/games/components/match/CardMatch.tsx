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
      Terminada: "bg-red-500/20 text-red-400 border-red-400/30",
      "En curso": "bg-yellow-500/20 text-yellow-400 border-yellow-400/30",
      "Esperando jugadores": "bg-green-500/20 text-green-400 border-green-400/30",
    };
    return colors[matchStatus];
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
      <div className="mb-6 p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
        <h3 className="text-xl font-bold text-gray-300 mb-4 flex items-center gap-3">
          <Star className="h-6 w-6 text-yellow-400" />
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
    return icons[matchStatus];
  }, [matchStatus]);

  return (
    <article className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl shadow-2xl overflow-hidden transform transition-all duration-300 hover:shadow-cyan-500/25 hover:scale-[1.02] h-full flex flex-col">
      {/* Fondo decorativo */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-purple-500/5 to-pink-500/5 rounded-3xl"></div>
      
      {/* Header */}
      <header className="relative p-6 md:p-8 flex-grow">
        <div className="flex justify-between items-start mb-8">
          <div
            className={`px-4 py-2 text-sm font-bold rounded-xl inline-flex items-center gap-2 border backdrop-blur-sm ${statusColor}`}
          >
            {statusIcon}
            {matchStatus}
          </div>
          <div className="text-right">
            <div className="text-sm md:text-base font-medium text-gray-400 mb-2">
              Apuesta Base
            </div>
            <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              ${match.base_bet_amount}
            </div>
          </div>
        </div>

        {/* Jugadores */}
        <section className="mb-8">
          <h3 className="text-xl font-bold text-gray-300 mb-6 flex items-center gap-3">
            <PersonStandingIcon className="h-6 w-6 text-cyan-400" />
            Jugadores ({match.participant_ids.length}/{game?.game_capacity || 0}
            )
          </h3>
          {participantsList}
        </section>

        {winnerSection}
      </header>

      {/* Join Match Section */}
      <div className="relative border-t border-white/10 p-6 bg-white/5 backdrop-blur-sm">
        <JoinMatch match={match} game={game} />
      </div>

      {/* Footer */}
      <footer className="relative bg-white/5 px-6 py-4 text-sm text-gray-400 border-t border-white/10">
        <div className="flex flex-wrap items-center gap-4">
          <span className="flex items-center gap-2">
            <ClipboardCheckIcon className="h-4 w-4" />
            ID: {match.match_id}
          </span>
          <span className="flex items-center gap-2">
            <ClockIcon className="h-4 w-4" />
            Creada: {formattedDate}
          </span>
        </div>
      </footer>
    </article>
  );
});

CardMatch.displayName = "CardMatch";
