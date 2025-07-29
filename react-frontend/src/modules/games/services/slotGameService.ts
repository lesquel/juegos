import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { useCreateMatch, useFinishMatch } from "./matchClientData";
import { useMyVirtualCurrency } from "../../user/services/userClientData";
import { useAuthStore } from "../../auth/store/auth.store";
import { environment } from "../../../config/environment";
import { endpoints } from "../../../config/endpoints";
import type { CreateMatch, FinishMatch } from "../models/match.model";

// Tipos específicos para el juego de tragamonedas
export interface SlotBetData {
  betAmount: number;
  gameId: string;
}

export interface SlotGameResult {
  win: boolean;
  winAmount: number;
  isJackpot: boolean;
  combination: string;
}

export interface SlotMatchData {
  matchId: string;
  betAmount: number;
  gameId: string;
}

// Hook principal para manejar las apuestas de tragamonedas
export const useSlotGameBetting = (gameId: string) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { user } = useAuthStore();
  const { data: virtualCurrency, refetch: refetchCurrency } = useMyVirtualCurrency();
  
  // Estado local del match actual
  const [currentMatch, setCurrentMatch] = useState<SlotMatchData | null>(null);

  // Hooks para match management - llamados en el nivel superior
  const createMatchMutation = useCreateMatch(gameId, (match) => {
    // Callback cuando se crea exitosamente el match
    console.log("Match creado:", match);
  });

  const finishMatchMutation = useFinishMatch(currentMatch?.matchId || "");

  // Función para verificar si el usuario puede apostar
  const canPlaceBet = (betAmount: number): boolean => {
    if (!virtualCurrency) return false;
    return virtualCurrency.virtual_currency >= betAmount;
  };

  // Función para crear un nuevo match al apostar
  const placeBet = useMutation({
    mutationFn: async (betData: SlotBetData) => {
      if (!canPlaceBet(betData.betAmount)) {
        throw new Error("Monedas insuficientes para esta apuesta");
      }

      // Crear match en el backend
      const matchData: CreateMatch = {
        base_bet_amount: betData.betAmount,
      };

      console.log("Enviando datos para crear match:", {
        gameId: betData.gameId,
        matchData,
        endpoint: `${environment.API_URL}${endpoints.matches.createMatch(betData.gameId)}`
      });

      return new Promise<SlotMatchData>((resolve, reject) => {
        createMatchMutation.mutate(matchData, {
          onSuccess: (response) => {
            console.log("Match creado exitosamente:", response);
            const match = response.data; // Axios response wrapper
            const slotMatch: SlotMatchData = {
              matchId: match.match_id,
              betAmount: betData.betAmount,
              gameId: betData.gameId,
            };
            setCurrentMatch(slotMatch);
            resolve(slotMatch);
          },
          onError: (error: any) => {
            console.error("Error detallado al crear match:", {
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
      console.error("Error al crear apuesta:", error);
      // Refrescar datos en caso de error
      refetchCurrency();
    },
  });

  // Función para finalizar el match con el resultado
  const finishGame = useMutation({
    mutationFn: async (gameResult: SlotGameResult) => {
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

      return new Promise((resolve, reject) => {
        finishMatchMutation.mutate(finishData, {
          onSuccess: (result) => {
            // Limpiar match actual
            setCurrentMatch(null);
            
            // Refrescar datos del usuario
            refetchCurrency();
            queryClient.invalidateQueries({ queryKey: ["userMe"] });
            queryClient.invalidateQueries({ queryKey: ["userVirtualCurrency"] });
            
            resolve(result);
          },
          onError: (error) => {
            reject(error);
          },
        });
      });
    },
    onError: (error) => {
      console.error("Error al finalizar partida:", error);
      // Refrescar datos en caso de error
      refetchCurrency();
    },
  });

  // Función para abandonar el juego (crear salida)
  const quitGame = useMutation({
    mutationFn: async () => {
      if (currentMatch) {
        // Finalizar match como perdida si hay uno activo
        const quitResult: SlotGameResult = {
          win: false,
          winAmount: 0,
          isJackpot: false,
          combination: "quit",
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
export const useSlotGameBalance = () => {
  const { data: virtualCurrency, isLoading } = useMyVirtualCurrency();
  
  return {
    balance: virtualCurrency?.virtual_currency || 0,
    isLoading,
    hasInsufficientFunds: (betAmount: number) => {
      return !virtualCurrency || virtualCurrency.virtual_currency < betAmount;
    },
  };
};
