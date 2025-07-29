import React, { memo, useMemo, useCallback, useState } from "react";
import { useAuthStore } from "@modules/auth/store/auth.store";
import type { Game } from "@modules/games/models/game.model";
import type { Match } from "@modules/games/models/match.model";
import { MatchClientData, useJoinMatch } from "@modules/games/services/matchClientData";
import { Clock, Lock, Merge, Plus, Star } from "lucide-react";
import { LoadingComponent } from "@components/LoadingComponent";

interface JoinMatchProps {
  match: Match;
  game: Game;
}

export const JoinMatch: React.FC<JoinMatchProps> = memo(({ match, game }) => {
  const [isLoading, setIsLoading] = useState(false);
  // Memoizar función de éxito
  const onSuccess = useCallback(
    (data: Match) => {
      setIsLoading(false);
      const newUrl = `${location.protocol}//${location.host}/${game?.game_url}?match_id=${data.match_id}`;
      location.href = newUrl;
    },
    [game?.game_url]
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
        icon: <Clock className="h-5 w-5 text-yellow-400" />,
      },
      full: {
        text: "Partida Llena",
        icon: <Lock className="h-5 w-5 text-red-400" />,
      },
      rejoin: {
        text: "Volver a la Partida",
        icon: <Merge className="h-5 w-5 text-teal-400" />,
      },
      join: {
        text: "Unirse a la Partida",
        icon: <Plus className="h-5 w-5 text-teal-400" />,
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
      "w-full font-bold py-3 px-6 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-101 flex items-center justify-center gap-3 text-lg";

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
      <div className="mt-3 text-center text-xs text-gray-400">
        {matchStates.isJoined && !matchStates.isFinished && (
          <p className="flex items-center justify-center gap-1">
            <Star className="h-3 w-3 text-yellow-400" />
            Ya estás en esta partida
          </p>
        )}
        {!matchStates.isJoined &&
          !matchStates.isFull &&
          !matchStates.isFinished && (
            <p>
              Apuesta requerida:{" "}
              <span className="text-green-400 font-semibold">
                ${match.base_bet_amount}
              </span>
            </p>
          )}
      </div>
    </div>
  );
});

JoinMatch.displayName = "JoinMatch";
