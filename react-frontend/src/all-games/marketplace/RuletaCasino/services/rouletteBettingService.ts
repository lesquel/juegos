import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { useCreateMatch, useFinishMatch } from "../../../../modules/games/services/matchClientData";
import { useMyVirtualCurrency } from "../../../../modules/user/services/userClientData";
import { useAuthStore } from "../../../../modules/auth/store/auth.store";
import { useGames } from "../../../../modules/games/services/gameClientData";
import { environment } from "../../../../config/environment";
import { endpoints } from "../../../../config/endpoints";
import type { CreateMatch, FinishMatch } from "../../../../modules/games/models/match.model";

// Tipos específicos para el juego de ruleta
export interface RouletteBetData {
  betAmount: number;
  gameId: string;
  bets: Map<string, number>;
}

export interface RouletteGameResult {
  win: boolean;
  winAmount: number;
  winningNumber: number;
  totalBet: number;
  multiplier: number;
}

export interface RouletteMatchData {
  matchId: string;
  betAmount: number;
  gameId: string;
  bets: Map<string, number>;
}

// Hook para encontrar el ID del juego de ruleta
export const useRouletteGameId = () => {
  const { data: gamesData, isLoading } = useGames({ page: 1, limit: 100 });

  const rouletteGameId = useMemo(() => {
    if (!gamesData?.results) return null;

    // Buscar por diferentes nombres posibles
    const possibleNames = [
      'ruleta',
      'roulette',
      'ruleta casino',
      'casino roulette',
      'roulette wheel',
      'ruletacasino'
    ];

    for (const game of gamesData.results) {
      const gameName = game.game_name.toLowerCase();
      const gameId = game.game_id.toLowerCase();

      for (const name of possibleNames) {
        if (gameName.includes(name) || gameId.includes(name)) {
          console.log(`🎰 Encontrado juego de ruleta: ${game.game_name} (ID: ${game.game_id})`);
          return game.game_id;
        }
      }
    }

    console.warn('⚠️ No se encontró el juego de ruleta en la lista de juegos');
    return null;
  }, [gamesData]);

  return { rouletteGameId, isLoading, allGames: gamesData?.results };
};

// Hook principal para manejar las apuestas de ruleta
export const useRouletteBetting = (gameId: string) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { user } = useAuthStore();
  const { data: virtualCurrency, refetch: refetchCurrency } = useMyVirtualCurrency();

  // Estado local del match actual
  const [currentMatch, setCurrentMatch] = useState<RouletteMatchData | null>(null);

  // Hooks para match management - llamados en el nivel superior
  const createMatchMutation = useCreateMatch(gameId, (match) => {
    // Callback cuando se crea exitosamente el match
    console.log("🎰 Match de ruleta creado:", match);
  });

  const finishMatchMutation = useFinishMatch(currentMatch?.matchId || "");

  // Función para verificar si el usuario puede apostar
  const canPlaceBet = (betAmount: number): boolean => {
    if (!virtualCurrency) return false;
    return virtualCurrency.virtual_currency >= betAmount;
  };

  // Función para crear un nuevo match al apostar
  const placeBet = useMutation({
    mutationFn: async (betData: RouletteBetData) => {
      if (!canPlaceBet(betData.betAmount)) {
        throw new Error("Monedas insuficientes para esta apuesta");
      }

      // Crear match en el backend
      const matchData: CreateMatch = {
        base_bet_amount: betData.betAmount,
      };

      console.log("🎰 Enviando datos para crear match de ruleta:", {
        gameId: betData.gameId,
        matchData,
        endpoint: `${environment.API_URL}${endpoints.matches.createMatch(betData.gameId)}`
      });

      return new Promise<RouletteMatchData>((resolve, reject) => {
        createMatchMutation.mutate(matchData, {
          onSuccess: (response) => {
            console.log("✅ Match de ruleta creado exitosamente:", response);
            const match = response.data; // Axios response wrapper
            const rouletteMatch: RouletteMatchData = {
              matchId: match.match_id,
              betAmount: betData.betAmount,
              gameId: betData.gameId,
              bets: betData.bets,
            };
            setCurrentMatch(rouletteMatch);
            resolve(rouletteMatch);
          },
          onError: (error: any) => {
            console.error("❌ Error detallado al crear match de ruleta:", {
              error,
              message: error?.message,
              data: error?.response?.data,
              status: error?.response?.status,
              gameId: betData.gameId,
              matchData
            });
            reject(error);
          },
        });
      });
    },
    onError: (error) => {
      console.error("❌ Error al crear apuesta de ruleta:", error);
      // Refrescar datos en caso de error
      refetchCurrency();
    },
  });

  // Función para finalizar el match con el resultado
  const finishGame = useMutation({
    mutationFn: async (gameResult: RouletteGameResult) => {
      if (!currentMatch || !user) {
        throw new Error("No hay match activo para finalizar o usuario no autenticado");
      }

      const finishData: FinishMatch = {
        participants: [
          {
            user_id: user.user.user_id,
            score: gameResult.win ? gameResult.winAmount : 0,
          },
        ],
        custom_odds: gameResult.win ? gameResult.multiplier : -1,
      };

      console.log("🏁 Finalizando match de ruleta:", {
        matchId: currentMatch.matchId,
        finishData,
        gameResult,
        currentBalance: virtualCurrency?.virtual_currency,
        expectedOutcome: gameResult.win ? `Ganar +${gameResult.winAmount}` : `Perder -${currentMatch.betAmount}`
      });

      return new Promise((resolve, reject) => {
        finishMatchMutation.mutate(finishData, {
          onSuccess: (result) => {
            console.log("✅ Match de ruleta finalizado exitosamente");
            // Limpiar match actual
            setCurrentMatch(null);

            // Refrescar datos del usuario EXACTAMENTE como el tragamonedas
            console.log("🔄 Refrescando datos de usuario en ruleta...");
            console.log("💰 Balance antes del refresh:", virtualCurrency?.virtual_currency);

            // Hacer refetch PRIMERO como en tragamonedas
            refetchCurrency();
            queryClient.invalidateQueries({ queryKey: ["userMe"] });
            queryClient.invalidateQueries({ queryKey: ["userVirtualCurrency"] });

            // Forzar invalidaciones adicionales múltiples
            setTimeout(() => {
              queryClient.invalidateQueries({ queryKey: ["userVirtualCurrency"] });
              refetchCurrency();
            }, 100);

            setTimeout(() => {
              queryClient.invalidateQueries({ queryKey: ["userVirtualCurrency"] });
              console.log("💰 Invalidaciones múltiples de ruleta completadas");
            }, 500);

            resolve(result);
          },
          onError: (error) => {
            console.error("❌ Error al finalizar match de ruleta:", error);
            reject(new Error(error?.errors?.[0] || 'Error al finalizar match de ruleta'));
          },
        });
      });
    },
    onError: (error) => {
      console.error("❌ Error al finalizar partida de ruleta:", error);
      // Refrescar datos en caso de error
      refetchCurrency();
    },
  });

  // Función para abandonar el juego (crear salida)
  const quitGame = useMutation({
    mutationFn: async () => {
      if (currentMatch) {
        // Finalizar match como perdida si hay uno activo
        const quitResult: RouletteGameResult = {
          win: false,
          winAmount: 0,
          winningNumber: 0,
          totalBet: currentMatch.betAmount,
          multiplier: -1,
        };

        await finishGame.mutateAsync(quitResult);
      }

      // Navegar de vuelta
      router.history.back();
    },
  });

  // Función para continuar jugando después de perder
  const continueGame = () => {
    // Simplemente limpiar el match actual para permitir nueva apuesta
    setCurrentMatch(null);
  };

  return {
    // Estados
    currentMatch,
    virtualCurrency,
    canPlaceBet,

    // Acciones
    placeBet,
    finishGame,
    quitGame,
    continueGame,

    // Estados de loading
    isPlacingBet: placeBet.isPending,
    isFinishingGame: finishGame.isPending,
    isQuitting: quitGame.isPending,

    // Errores
    betError: placeBet.error,
    finishError: finishGame.error,
    quitError: quitGame.error,
  };
};

// Hook simplificado para verificar el saldo
export const useRouletteBalance = () => {
  const { data: virtualCurrency, isLoading } = useMyVirtualCurrency();

  return {
    balance: virtualCurrency?.virtual_currency || 0,
    isLoading,
    hasInsufficientFunds: (betAmount: number) => {
      return !virtualCurrency || virtualCurrency.virtual_currency < betAmount;
    },
  };
};
