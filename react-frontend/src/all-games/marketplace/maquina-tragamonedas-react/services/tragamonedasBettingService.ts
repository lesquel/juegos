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

// Tipos específicos para el juego de tragamonedas
export interface TragamonedasBetData {
  betAmount: number;
  gameId: string;
}

export interface TragamonedasGameResult {
  win: boolean;
  winAmount: number;
  totalBet: number;
  reels: string[][];
  winningLines: number[];
  isJackpot: boolean;
}

export interface TragamonedasMatchData {
  matchId: string;
  betAmount: number;
  gameId: string;
}

// Hook para encontrar el ID del juego de tragamonedas
export const useTragamonedasGameId = () => {
  const { data: gamesData, isLoading } = useGames({ page: 1, limit: 100 });
  
  const tragamonedasGameId = useMemo(() => {
    if (!gamesData?.results) return null;
    
    // Buscar por diferentes nombres posibles
    const possibleNames = [
      'tragamonedas',
      'slot machine',
      'slots',
      'maquina tragamonedas',
      'casino slots',
      'slotmachine'
    ];
    
    for (const game of gamesData.results) {
      const gameName = game.game_name.toLowerCase();
      const gameId = game.game_id.toLowerCase();
      
      for (const name of possibleNames) {
        if (gameName.includes(name) || gameId.includes(name)) {
          console.log(`🎰 Encontrado juego de tragamonedas: ${game.game_name} (ID: ${game.game_id})`);
          return game.game_id;
        }
      }
    }
    
    console.warn('⚠️ No se encontró el juego de tragamonedas en la lista de juegos');
    return null;
  }, [gamesData]);
  
  return { tragamonedasGameId, isLoading, allGames: gamesData?.results };
};

// Hook principal para manejar las apuestas de tragamonedas
export const useTragamonedasBetting = (gameId: string) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { user } = useAuthStore();
  const { data: virtualCurrency, refetch: refetchCurrency } = useMyVirtualCurrency();
  
  // Estado local del match actual
  const [currentMatch, setCurrentMatch] = useState<TragamonedasMatchData | null>(null);

  // Hooks para match management - llamados en el nivel superior
  const createMatchMutation = useCreateMatch(gameId, (match) => {
    // Callback cuando se crea exitosamente el match
    console.log("🎰 Match de tragamonedas creado:", match);
  });

  const finishMatchMutation = useFinishMatch(currentMatch?.matchId || "");

  // Función para verificar si el usuario puede apostar
  const canPlaceBet = (betAmount: number): boolean => {
    if (!virtualCurrency) return false;
    return virtualCurrency.virtual_currency >= betAmount;
  };

  // Función para crear un nuevo match al apostar
  const placeBet = useMutation({
    mutationFn: async (betData: TragamonedasBetData) => {
      if (!canPlaceBet(betData.betAmount)) {
        throw new Error("Monedas insuficientes para esta apuesta");
      }

      // Crear match en el backend
      const matchData: CreateMatch = {
        base_bet_amount: betData.betAmount,
      };

      console.log("🎰 Enviando datos para crear match de tragamonedas:", {
        gameId: betData.gameId,
        matchData,
        endpoint: `${environment.API_URL}${endpoints.matches.createMatch(betData.gameId)}`
      });

      return new Promise<TragamonedasMatchData>((resolve, reject) => {
        createMatchMutation.mutate(matchData, {
          onSuccess: (response) => {
            console.log("✅ Match de tragamonedas creado exitosamente:", response);
            const match = response.data; // Axios response wrapper
            const tragamonedasMatch: TragamonedasMatchData = {
              matchId: match.match_id,
              betAmount: betData.betAmount,
              gameId: betData.gameId,
            };
            setCurrentMatch(tragamonedasMatch);
            resolve(tragamonedasMatch);
          },
          onError: (error: any) => {
            console.error("❌ Error detallado al crear match de tragamonedas:", {
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
      console.error("❌ Error al crear apuesta de tragamonedas:", error);
      // Refrescar datos en caso de error
      refetchCurrency();
    },
  });

  // Función para finalizar el match con el resultado
  const finishGame = useMutation({
    mutationFn: async (gameResult: TragamonedasGameResult) => {
      if (!currentMatch || !user) {
        throw new Error("No hay match activo para finalizar o usuario no autenticado");
      }

      const finishData: FinishMatch = {
        participants: [
          {
            user_id: user.user.user_id,
            score: gameResult.winAmount,
          },
        ],
        custom_odds: gameResult.win ? (gameResult.winAmount / currentMatch.betAmount) : 0,
      };

      console.log("🏁 Finalizando match de tragamonedas:", {
        matchId: currentMatch.matchId,
        finishData,
        gameResult
      });

      return new Promise((resolve, reject) => {
        finishMatchMutation.mutate(finishData, {
          onSuccess: (result) => {
            console.log("✅ Match de tragamonedas finalizado exitosamente");
            // Limpiar match actual
            setCurrentMatch(null);
            
            // Refrescar datos del usuario
            refetchCurrency();
            queryClient.invalidateQueries({ queryKey: ["userMe"] });
            queryClient.invalidateQueries({ queryKey: ["userVirtualCurrency"] });
            
            resolve(result);
          },
          onError: (error) => {
            console.error("❌ Error al finalizar match de tragamonedas:", error);
            reject(error);
          },
        });
      });
    },
    onError: (error) => {
      console.error("❌ Error al finalizar partida de tragamonedas:", error);
      // Refrescar datos en caso de error
      refetchCurrency();
    },
  });

  // Función para abandonar el juego (crear salida)
  const quitGame = useMutation({
    mutationFn: async () => {
      if (currentMatch) {
        // Finalizar match como perdida si hay uno activo
        const quitResult: TragamonedasGameResult = {
          win: false,
          winAmount: 0,
          totalBet: currentMatch.betAmount,
          reels: [],
          winningLines: [],
          isJackpot: false,
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
export const useTragamonedasBalance = () => {
  const { data: virtualCurrency, isLoading } = useMyVirtualCurrency();
  
  return {
    balance: virtualCurrency?.virtual_currency || 0,
    isLoading,
    hasInsufficientFunds: (betAmount: number) => {
      return !virtualCurrency || virtualCurrency.virtual_currency < betAmount;
    },
  };
};
