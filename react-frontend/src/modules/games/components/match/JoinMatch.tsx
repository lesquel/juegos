import React, { memo, useMemo, useCallback, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAuthStore } from "@modules/auth/store/auth.store";
import type { Game } from "@modules/games/models/game.model";
import type { Match } from "@modules/games/models/match.model";
import { useJoinMatch } from "@modules/games/services/matchClientData";
import { Clock, Lock, Merge, Plus, Star } from "lucide-react";
import { LoadingComponent } from "@components/LoadingComponent";

interface JoinMatchProps {
  match: Match;
  game: Game;
}

export const JoinMatch: React.FC<JoinMatchProps> = memo(({ match, game }) => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  // Memoizar función de éxito
  const onSuccess = useCallback(
    (data: Match) => {
      setIsLoading(false);
      // Usar TanStack Router para la navegación
      navigate({ 
        to: `/${game?.game_url}`,
        search: { match_id: data.match_id }
      });
    },
    [game?.game_url, navigate]
  );

  const { mutate, error } = useJoinMatch(
    match.match_id,
    onSuccess
  );

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
    setIsLoading(true);
    if (matchStates.isJoined) {
      if (match.winner_id === null) {
        // Usar TanStack Router para la navegación
        navigate({ 
          to: `/${game.game_url}`,
          search: { match_id: match.match_id }
        });
      }
      return;
    }
    mutate({
      bet_amount: match.base_bet_amount,
    });
  }, [matchStates.isJoined, match, game, mutate, navigate]);

  // Memoizar mensaje de error
  const errorMessage = useMemo(() => {
    if (!error) return null;
    
    // Manejar diferentes tipos de errores
    let errorText = "Ha ocurrido un error inesperado";
    
    if (error && typeof error === 'object') {
      if ('errors' in error && Array.isArray(error.errors)) {
        // Error de validación del backend
        errorText = error.errors.join(", ");
      } else if ('message' in error && typeof error.message === 'string') {
        // Error de Axios u otro tipo de error
        errorText = error.message;
      }
    } else if (typeof error === 'string') {
      // Error simple como string
      errorText = error;
    }
    
    return (
      <div
        className="text-center text-red-400 bg-red-500/10 backdrop-blur-sm p-4 rounded-xl mb-4 border border-red-400/30"
        role="alert"
      >
        <h4 className="font-bold mb-2">Error:</h4>
        <p>{errorText}</p>
      </div>
    );
  }, [error]);

  // Memoizar texto del botón e iconos
  const buttonContent = useMemo(() => {
    const { isJoined, isFull, isFinished } = matchStates;

    const states = {
      finished: {
        text: "Partida Terminada",
        icon: <Clock className="h-5 w-5" />,
      },
      full: {
        text: "Partida Llena",
        icon: <Lock className="h-5 w-5" />,
      },
      rejoin: {
        text: "Volver a la Partida",
        icon: <Merge className="h-5 w-5" />,
      },
      join: {
        text: "Unirse a la Partida",
        icon: <Plus className="h-5 w-5" />,
      },
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

    const baseClasses =
      "w-full font-bold py-4 px-6 rounded-xl shadow-2xl transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center gap-3 text-lg";

    if (isDisabled) {
      return `${baseClasses} bg-gray-600/20 backdrop-blur-sm border border-gray-500/30 text-gray-400 cursor-not-allowed`;
    }

    return `${baseClasses} bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 hover:from-cyan-600 hover:via-purple-600 hover:to-pink-600 text-white hover:shadow-cyan-500/25 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 cursor-pointer`;
  }, [matchStates]);

  // Memoizar si el botón está deshabilitado
  const isDisabled = useMemo(() => {
    const { isJoined, isFull, isFinished } = matchStates;
    return isFinished || (!isJoined && isFull);
  }, [matchStates]);

  return (
    <div>
      {isLoading && <LoadingComponent />}
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
      <div className="mt-4 text-center text-sm text-gray-400">
        {matchStates.isJoined && !matchStates.isFinished && (
          <p className="flex items-center justify-center gap-2">
            <Star className="h-4 w-4 text-yellow-400" />
            Ya estás en esta partida
          </p>
        )}
        {!matchStates.isJoined &&
          !matchStates.isFull &&
          !matchStates.isFinished && (
            <p>
              Apuesta requerida:{" "}
              <span className="text-green-400 font-bold">
                ${match.base_bet_amount}
              </span>
            </p>
          )}
      </div>
    </div>
  );
});

JoinMatch.displayName = "JoinMatch";
