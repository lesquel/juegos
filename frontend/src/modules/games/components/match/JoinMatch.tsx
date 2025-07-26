import React, { memo, useMemo, useCallback } from "react";
import { useAuthStore } from "@modules/auth/store/auth.store";
import type { Game } from "@modules/games/models/game.model";
import type { Match } from "@modules/games/models/match.model";
import { MatchClientData } from "@modules/games/services/matchClientData";

interface JoinMatchProps {
  match: Match;
  game: Game;
}

export const JoinMatch: React.FC<JoinMatchProps> = memo(({ match, game }) => {
  // Memoizar función de éxito
  const onSuccess = useCallback((data: Match) => {
    const newUrl = `${location.protocol}//${location.host}/${game?.game_url}?match_id=${data.match_id}`;
    location.href = newUrl;
  }, [game?.game_url]);

  const { mutate, error } = MatchClientData.joinMatch(match.match_id, onSuccess);

  // Memoizar estados de la partida
  const matchStates = useMemo(() => {
    const currentUserId = useAuthStore.getState().user?.user.user_id as string;
    const isJoined = match.participant_ids.includes(currentUserId);
    const isFull = match.participant_ids.length >= Number(game.game_capacity);
    const isFinished = match.winner_id !== null;
    
    return { isJoined, isFull, isFinished };
  }, [match.participant_ids, match.winner_id, game.game_capacity]);

  // Memoizar función de unirse/volver a la partida
  const handleJoinMatch = useCallback(async () => {
    if (matchStates.isJoined) {
      if (match.winner_id === null) {
        const gameUrl = `${location.protocol}//${location.host}/${game.game_url}?match_id=${match.match_id}`;
        location.href = gameUrl;
      }
      return;
    }
    mutate({
      bet_amount: match.base_bet_amount,
    });
  }, [matchStates.isJoined, match, game, mutate]);

  // Memoizar mensaje de error
  const errorMessage = useMemo(() => {
    if (!error) return null;
    return (
      <div 
        className="text-center text-red-400 bg-red-900 bg-opacity-50 p-3 rounded-lg mb-4 border border-red-600"
        role="alert"
      >
        <h4 className="font-semibold mb-1">Error:</h4>
        <p>{error.errors.join(", ")}</p>
      </div>
    );
  }, [error]);

  // Memoizar texto del botón e iconos
  const buttonContent = useMemo(() => {
    const { isJoined, isFull, isFinished } = matchStates;
    
    const states = {
      finished: {
        text: "Partida Terminada",
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      },
      full: {
        text: "Partida Llena",
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
          </svg>
        )
      },
      rejoin: {
        text: "Volver a la Partida",
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 15l-3-3m0 0l3-3m-3 3h8M3 12a9 9 0 1118 0 9 9 0 01-18 0z" />
          </svg>
        )
      },
      join: {
        text: "Unirse a la Partida",
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        )
      }
    };

    if (isFinished) return states.finished;
    if (isFull && !isJoined) return states.full;
    if (isJoined) return states.rejoin;
    return states.join;
  }, [matchStates]);

  // Memoizar clases del botón
  const buttonClasses = useMemo(() => {
    const { isJoined, isFull, isFinished } = matchStates;
    const isDisabled = isFinished || (!isJoined && isFull);
    
    const baseClasses = "w-full font-bold py-3 px-6 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-101 flex items-center justify-center gap-3 text-lg";
    
    if (isDisabled) {
      return `${baseClasses} bg-gray-600 text-gray-400 cursor-not-allowed`;
    }
    
    return `${baseClasses} bg-gradient-to-r from-purple-600 to-blue-500 text-white hover:from-purple-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 cursor-pointer`;
  }, [matchStates]);

  // Memoizar si el botón está deshabilitado
  const isDisabled = useMemo(() => {
    const { isJoined, isFull, isFinished } = matchStates;
    return isFinished || (!isJoined && isFull);
  }, [matchStates]);

  return (
    <div>
      {errorMessage}
      
      <button
        disabled={isDisabled}
        onClick={handleJoinMatch}
        className={buttonClasses}
        aria-label={buttonContent.text}
      >
        {buttonContent.icon}
        {buttonContent.text}
      </button>
      
      {/* Información adicional */}
      <div className="mt-3 text-center text-xs text-gray-400">
        {matchStates.isJoined && !matchStates.isFinished && (
          <p className="flex items-center justify-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-green-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            Ya estás en esta partida
          </p>
        )}
        {!matchStates.isJoined && !matchStates.isFull && !matchStates.isFinished && (
          <p>Apuesta requerida: <span className="text-green-400 font-semibold">${match.base_bet_amount}</span></p>
        )}
      </div>
    </div>
  );
});

JoinMatch.displayName = "JoinMatch";
