import React, { memo, useMemo } from "react";
import type { Match } from "@modules/games/models/match.model";
import type { Game } from "@modules/games/models/game.model";
import { CardParticipant } from "./CardParticipant";
import { JoinMatch } from "./JoinMatch";

interface CardMatchProps {
  match: Match;
  game: Game;
}

export const CardMatch: React.FC<CardMatchProps> = memo(({ match, game }) => {
  // Memoizar estado de la partida
  const matchStatus = useMemo(() => {
    if (match.winner_id) return "Terminada";
    if (match.participant_ids.length === Number(game?.game_capacity)) return "En curso";
    return "Esperando jugadores";
  }, [match.winner_id, match.participant_ids.length, game?.game_capacity]);

  // Memoizar colores de estado
  const statusColor = useMemo(() => {
    const colors = {
      "Terminada": "bg-red-500 text-red-100",
      "En curso": "bg-yellow-500 text-yellow-900", 
      "Esperando jugadores": "bg-green-500 text-green-100",
    };
    return colors[matchStatus as keyof typeof colors];
  }, [matchStatus]);

  // Memoizar fecha formateada
  const formattedDate = useMemo(() => {
    return new Date(match.created_at).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }, [match.created_at]);

  // Memoizar lista de participantes
  const participantsList = useMemo(() => {
    if (match.participant_ids.length === 0) {
      return (
        <div className="text-gray-400 italic flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5 0a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
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
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
          Ganador
        </h3>
        <CardParticipant id={match.winner_id} />
      </div>
    );
  }, [match.winner_id]);

  // Memoizar iconos de estado
  const statusIcon = useMemo(() => {
    const icons = {
      "Terminada": (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      "En curso": (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      "Esperando jugadores": (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      ),
    };
    return icons[matchStatus as keyof typeof icons];
  }, [matchStatus]);

  return (
    <article className="bg-gray-800 border border-gray-700 rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-2xl hover:scale-105 h-full flex flex-col backdrop-blur-lg">
      {/* Header */}
      <header className="p-6 md:p-8 flex-grow">
        <div className="flex justify-between items-start mb-6">
          <div className={`px-4 py-2 text-sm font-bold rounded-full inline-flex items-center gap-2 ${statusColor}`}>
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
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Jugadores ({match.participant_ids.length}/{game?.game_capacity || 0})
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
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
            </svg>
            ID: {match.match_id}
          </span>
          <span className="flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Creada: {formattedDate}
          </span>
        </div>
      </footer>
    </article>
  );
});

CardMatch.displayName = "CardMatch";
