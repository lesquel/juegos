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

// Tipos específicos para el juego de dados
export interface DadosBetData {
  betAmount: number;
  gameId: string;
  prediction: number; // El número que el usuario predice (1-6)
}

export interface DadosGameResult {
  win: boolean;
  winAmount: number;
  rolledNumber: number;
  predictedNumber: number;
  totalBet: number;
  multiplier: number;
}

export interface DadosMatchData {
  matchId: string;
  betAmount: number;
  gameId: string;
  prediction: number;
}

// Hook para encontrar el ID del juego de dados
export const useDadosGameId = () => {
  const { data: gamesData, isLoading } = useGames({ page: 1, limit: 100 });
  
  const dadosGameId = useMemo(() => {
    if (!gamesData?.results) return null;
    
    // Buscar por diferentes nombres posibles
    const possibleNames = [
      'dados',
      'dice', 
      'dados casino',
      'casino dice',
      'dice game',
      'dadoscasino'
    ];
    
    for (const game of gamesData.results) {
      const gameName = game.game_name.toLowerCase();
      const gameId = game.game_id.toLowerCase();
      
      for (const name of possibleNames) {
        if (gameName.includes(name) || gameId.includes(name)) {
          console.log(`🎲 Encontrado juego de dados: ${game.game_name} (ID: ${game.game_id})`);
          return game.game_id;
        }
      }
    }
    
    console.warn('⚠️ No se encontró el juego de dados en la lista de juegos');
    return null;
  }, [gamesData]);
  
  return { dadosGameId, isLoading, allGames: gamesData?.results };
};

// Hook principal para manejar las apuestas de dados
export const useDadosBetting = (gameId: string) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { user } = useAuthStore();
  const { data: virtualCurrency, refetch: refetchCurrency } = useMyVirtualCurrency();
  
  // Estado local del match actual
  const [currentMatch, setCurrentMatch] = useState<DadosMatchData | null>(null);

  // Hooks para match management - llamados en el nivel superior
  const createMatchMutation = useCreateMatch(gameId, (match) => {
    // Callback cuando se crea exitosamente el match
    console.log("🎲 Match de dados creado:", match);
  });

  const finishMatchMutation = useFinishMatch(currentMatch?.matchId || "");

  // Función para verificar si el usuario puede apostar
  const canPlaceBet = (betAmount: number): boolean => {
    if (!virtualCurrency) return false;
    return virtualCurrency.virtual_currency >= betAmount;
  };

  // Función para crear un nuevo match al apostar
  const placeBet = useMutation({
    mutationFn: async (betData: DadosBetData) => {
      if (!canPlaceBet(betData.betAmount)) {
        throw new Error("Monedas insuficientes para esta apuesta");
      }

      // Crear match en el backend
      const matchData: CreateMatch = {
        base_bet_amount: betData.betAmount,
      };

      console.log("🎲 Enviando datos para crear match de dados:", {
        gameId: betData.gameId,
        matchData,
        endpoint: `${environment.API_URL}${endpoints.matches.createMatch(betData.gameId)}`
      });

      return new Promise<DadosMatchData>((resolve, reject) => {
        createMatchMutation.mutate(matchData, {
          onSuccess: (response) => {
            console.log("✅ Match de dados creado exitosamente:", response);
            const match = response.data; // Axios response wrapper
            const dadosMatch: DadosMatchData = {
              matchId: match.match_id,
              betAmount: betData.betAmount,
              gameId: betData.gameId,
              prediction: betData.prediction,
            };
            setCurrentMatch(dadosMatch);
            resolve(dadosMatch);
          },
          onError: (error: any) => {
            console.error("❌ Error detallado al crear match de dados:", {
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
      console.error("❌ Error al crear apuesta de dados:", error);
      // Refrescar datos en caso de error
      refetchCurrency();
    },
  });

  // Función para finalizar el match con el resultado
  const finishGame = useMutation({
    mutationFn: async (gameResult: DadosGameResult) => {
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

      console.log("🏁 Finalizando match de dados:", {
        matchId: currentMatch.matchId,
        finishData,
        gameResult,
        currentBalance: virtualCurrency?.virtual_currency,
        expectedOutcome: gameResult.win ? `Ganar +${gameResult.winAmount}` : `Perder -${currentMatch.betAmount}`
      });

      return new Promise((resolve, reject) => {
        finishMatchMutation.mutate(finishData, {
          onSuccess: (result) => {
            console.log("✅ Match de dados finalizado exitosamente");
            // Limpiar match actual
            setCurrentMatch(null);
            
            // Refrescar datos del usuario
            refetchCurrency();
            queryClient.invalidateQueries({ queryKey: ["userMe"] });
            queryClient.invalidateQueries({ queryKey: ["userVirtualCurrency"] });
            
            resolve(result);
          },
          onError: (error) => {
            console.error("❌ Error al finalizar match de dados:", error);
            reject(error);
          },
        });
      });
    },
    onError: (error) => {
      console.error("❌ Error al finalizar partida de dados:", error);
      // Refrescar datos en caso de error
      refetchCurrency();
    },
  });

  // Función para abandonar el juego (crear salida)
  const quitGame = useMutation({
    mutationFn: async () => {
      if (currentMatch) {
        // Finalizar match como perdida si hay uno activo
        const quitResult: DadosGameResult = {
          win: false,
          winAmount: 0,
          rolledNumber: 0,
          predictedNumber: currentMatch.prediction,
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
export const useDadosBalance = () => {
  const { data: virtualCurrency, isLoading } = useMyVirtualCurrency();
  
  return {
    balance: virtualCurrency?.virtual_currency || 0,
    isLoading,
    hasInsufficientFunds: (betAmount: number) => {
      return !virtualCurrency || virtualCurrency.virtual_currency < betAmount;
    },
  };
};
