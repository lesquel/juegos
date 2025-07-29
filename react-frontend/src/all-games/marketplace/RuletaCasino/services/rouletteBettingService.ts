import { useState, useEffect, useCallback } from 'react';

// Interfaces
interface RouletteMatch {
  id: string;
  gameId: string;
  userId: string;
  betAmount: number;
  gameData: {
    bets: Record<string, number>;
    selectedNumbers: number[];
    betType: string;
  };
  status: 'active' | 'finished';
  result?: {
    winningNumber: number;
    winAmount: number;
    isWin: boolean;
  };
  createdAt: string;
  finishedAt?: string;
}

interface RouletteBetService {
  currentMatch: RouletteMatch | null;
  isCreatingMatch: boolean;
  isFinishingMatch: boolean;
  isQuittingMatch: boolean;
  error: string | null;
  createMatch: (betAmount: number, bets: Map<string, number>) => Promise<boolean>;
  finishMatch: (winningNumber: number, winAmount: number, isWin: boolean) => Promise<boolean>;
  quitMatch: () => Promise<boolean>;
  clearError: () => void;
}

// Hook personalizado para detectar ID del juego de ruleta
function useRouletteGameId() {
  const [gameId, setGameId] = useState<string | null>(null);

  useEffect(() => {
    const detectGameId = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/games/');
        if (response.ok) {
          const games = await response.json();
          
          // Buscar el juego de ruleta por nombre
          const rouletteGame = games.find((game: any) => 
            game.name?.toLowerCase().includes('ruleta') ||
            game.name?.toLowerCase().includes('roulette') ||
            game.slug?.includes('ruleta') ||
            game.slug?.includes('roulette')
          );
          
          if (rouletteGame) {
            setGameId(rouletteGame.id);
            console.log('🎰 Ruleta Game ID detectado:', rouletteGame.id);
          } else {
            console.warn('⚠️ No se encontró el juego de ruleta en la lista');
          }
        }
      } catch (error) {
        console.error('❌ Error detectando Game ID de ruleta:', error);
      }
    };

    detectGameId();
  }, []);

  return gameId;
}

// Hook principal del servicio de apuestas de ruleta
export function useRouletteBetting(): RouletteBetService {
  const [currentMatch, setCurrentMatch] = useState<RouletteMatch | null>(null);
  const [isCreatingMatch, setIsCreatingMatch] = useState(false);
  const [isFinishingMatch, setIsFinishingMatch] = useState(false);
  const [isQuittingMatch, setIsQuittingMatch] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const gameId = useRouletteGameId();

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const createMatch = useCallback(async (betAmount: number, bets: Map<string, number>): Promise<boolean> => {
    if (!gameId) {
      setError('ID del juego de ruleta no disponible');
      return false;
    }

    setIsCreatingMatch(true);
    setError(null);

    try {
      // Convertir Map a objeto para el JSON
      const betsObject = Object.fromEntries(bets);
      
      // Extraer números seleccionados y tipo de apuesta
      const selectedNumbers = Array.from(bets.keys())
        .filter(betId => !isNaN(parseInt(betId)))
        .map(num => parseInt(num));
      
      let betType: string;
      if (bets.size > 1) {
        betType = 'multiple';
      } else if (selectedNumbers.length > 0) {
        betType = 'straight';
      } else {
        betType = 'special';
      }

      const matchData = {
        game_id: gameId,
        bet_amount: betAmount,
        game_data: {
          bets: betsObject,
          selectedNumbers,
          betType,
          totalBets: bets.size,
          timestamp: new Date().toISOString()
        }
      };

      console.log('🎰 Creando match de ruleta:', matchData);

      const response = await fetch('http://localhost:8000/api/matches/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(matchData)
      });

      if (response.ok) {
        const newMatch = await response.json();
        console.log('✅ Match de ruleta creado exitosamente:', newMatch.id);
        
        setCurrentMatch({
          id: newMatch.id,
          gameId: newMatch.game_id,
          userId: newMatch.user_id,
          betAmount: newMatch.bet_amount,
          gameData: newMatch.game_data,
          status: 'active',
          createdAt: newMatch.created_at
        });
        
        return true;
      } else {
        const errorData = await response.json();
        setError(`Error al crear match de ruleta: ${errorData.detail || 'Error desconocido'}`);
        return false;
      }
    } catch (error) {
      console.error('❌ Error creando match de ruleta:', error);
      setError('Error de conexión al crear el match');
      return false;
    } finally {
      setIsCreatingMatch(false);
    }
  }, [gameId]);

  const finishMatch = useCallback(async (winningNumber: number, winAmount: number, isWin: boolean): Promise<boolean> => {
    if (!currentMatch) {
      setError('No hay match activo para finalizar');
      return false;
    }

    setIsFinishingMatch(true);
    setError(null);

    try {
      const finishData = {
        final_result: {
          winningNumber,
          winAmount,
          isWin,
          finalBet: currentMatch.betAmount,
          gameOutcome: isWin ? 'win' : 'lose',
          timestamp: new Date().toISOString()
        }
      };

      console.log('🏁 Finalizando match de ruleta:', currentMatch.id, finishData);

      const response = await fetch(`http://localhost:8000/api/matches/${currentMatch.id}/finish/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(finishData)
      });

      if (response.ok) {
        const finishedMatch = await response.json();
        console.log('✅ Match de ruleta finalizado exitosamente');
        
        setCurrentMatch(prev => prev ? {
          ...prev,
          status: 'finished',
          result: {
            winningNumber,
            winAmount,
            isWin
          },
          finishedAt: finishedMatch.finished_at
        } : null);
        
        return true;
      } else {
        const errorData = await response.json();
        setError(`Error al finalizar match de ruleta: ${errorData.detail || 'Error desconocido'}`);
        return false;
      }
    } catch (error) {
      console.error('❌ Error finalizando match de ruleta:', error);
      setError('Error de conexión al finalizar el match');
      return false;
    } finally {
      setIsFinishingMatch(false);
    }
  }, [currentMatch]);

  const quitMatch = useCallback(async (): Promise<boolean> => {
    if (!currentMatch) {
      setError('No hay match activo para salir');
      return false;
    }

    setIsQuittingMatch(true);
    setError(null);

    try {
      console.log('🚪 Saliendo del match de ruleta:', currentMatch.id);

      const response = await fetch(`http://localhost:8000/api/matches/${currentMatch.id}/quit/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        console.log('✅ Salida del match de ruleta exitosa');
        setCurrentMatch(null);
        return true;
      } else {
        const errorData = await response.json();
        setError(`Error al salir del match de ruleta: ${errorData.detail || 'Error desconocido'}`);
        return false;
      }
    } catch (error) {
      console.error('❌ Error saliendo del match de ruleta:', error);
      setError('Error de conexión al salir del match');
      return false;
    } finally {
      setIsQuittingMatch(false);
    }
  }, [currentMatch]);

  return {
    currentMatch,
    isCreatingMatch,
    isFinishingMatch,
    isQuittingMatch,
    error,
    createMatch,
    finishMatch,
    quitMatch,
    clearError
  };
}
