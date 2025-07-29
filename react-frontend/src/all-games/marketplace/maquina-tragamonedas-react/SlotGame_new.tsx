import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { SlotGameLogic } from './logic/SlotGameLogic';
import type { SlotGameState, SpinResult } from './types/SlotTypes';
import { SlotMachine } from './components/SlotMachine';
import { GameControls } from './components/GameControls';
import { GameStats } from './components/GameStats';
import { WinDisplay } from './components/WinDisplay';
import { useSlotGameBetting, useSlotGameBalance } from '../../../modules/games/services/slotGameService';
import { useGames } from '../../../modules/games/services/gameClientData';
import type { SlotGameResult } from '../../../modules/games/services/slotGameService';
import './styles/slot-game.css';

// Función para encontrar el ID del juego de tragamonedas
const useSlotGameId = () => {
  const { data: gamesData, isLoading } = useGames({ page: 1, limit: 100 });
  
  const slotGameId = useMemo(() => {
    if (!gamesData?.results) return null;
    
    // Buscar por diferentes nombres posibles
    const possibleNames = [
      'tragamonedas',
      'slots', 
      'slot machine',
      'maquina tragamonedas',
      'casino slots',
      'slot',
      'tragamonedasreact'
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
  
  return { slotGameId, isLoading, allGames: gamesData?.results };
};

export function SlotGame() {
  const [gameState, setGameState] = useState<SlotGameState>(() => 
    SlotGameLogic.createInitialState()
  );

  const [spinTimeouts, setSpinTimeouts] = useState<NodeJS.Timeout[]>([]);

  // Obtener el ID del juego dinámicamente
  const { slotGameId, isLoading: isLoadingGameId, allGames } = useSlotGameId();

  // Hooks para manejar apuestas y saldo
  const { balance, isLoading: isLoadingBalance } = useSlotGameBalance();
  
  // Solo inicializar el hook de apuestas si tenemos el gameId
  const bettingHook = useSlotGameBetting(slotGameId || "");
  const {
    currentMatch,
    placeBet,
    finishGame,
    quitGame,
    continueGame,
    isPlacingBet,
    isFinishingGame,
    isQuitting,
    betError,
    finishError
  } = bettingHook;

  // Sobrescribir créditos con el saldo real del usuario
  useEffect(() => {
    if (!isLoadingBalance && balance > 0) {
      setGameState(prev => ({ ...prev, credits: balance }));
    }
  }, [balance, isLoadingBalance]);

  // Limpiar timeouts al desmontar
  useEffect(() => {
    return () => {
      spinTimeouts.forEach(timeout => clearTimeout(timeout));
    };
  }, [spinTimeouts]);

  const clearAllTimeouts = useCallback(() => {
    spinTimeouts.forEach(timeout => clearTimeout(timeout));
    setSpinTimeouts([]);
  }, [spinTimeouts]);

  const processSpinResult = useCallback(async (spinResults: string[], currentBet: number, currentJackpot: number) => {
    const slotResult = SlotGameLogic.checkWin(spinResults);
    const winAmount = SlotGameLogic.calculateWinAmount(slotResult, currentBet, currentJackpot);
    
    // Crear el resultado para el backend
    const gameResult: SlotGameResult = {
      win: slotResult.win,
      winAmount,
      isJackpot: slotResult.isJackpot || false,
      combination: slotResult.combination || ""
    };

    console.log('🎯 Resultado del giro:', gameResult);

    try {
      if (currentMatch?.matchId) {
        console.log('🏁 Finalizando partida con resultado:', gameResult);
        await finishGame.mutateAsync(gameResult);
        console.log('✅ Partida finalizada exitosamente');
      } else {
        console.warn('⚠️ No hay partida activa para finalizar');
      }
    } catch (error) {
      console.error('❌ Error al finalizar partida:', error);
    }

    // Actualizar estado del juego local
    setGameState(prev => ({
      ...prev,
      credits: prev.credits + winAmount,
      totalWins: prev.totalWins + winAmount,
      totalSpins: prev.totalSpins + 1,
      currentResults: spinResults,
      winMessage: SlotGameLogic.getWinMessage(slotResult, winAmount),
      showWinAnimation: winAmount > 0
    }));

    return slotResult;
  }, [finishGame, currentMatch, slotGameId]);

  const handleSpin = useCallback(async () => {
    if (gameState.isSpinning || gameState.currentBet <= 0 || gameState.credits < gameState.currentBet) {
      return;
    }

    console.log('🎰 Iniciando giro con apuesta:', gameState.currentBet);

    try {
      // Crear nueva partida y hacer apuesta
      console.log('💰 Creando partida para apuesta de', gameState.currentBet, 'créditos');
      await placeBet.mutateAsync(gameState.currentBet);
      console.log('✅ Apuesta realizada exitosamente');
    } catch (error) {
      console.error('❌ Error al realizar apuesta:', error);
      return; // No continuar si la apuesta falla
    }

    // Actualizar estado inmediatamente después de apostar
    setGameState(prev => ({
      ...prev,
      isSpinning: true,
      credits: prev.credits - prev.currentBet,
      totalSpins: prev.totalSpins + 1
    }));

    clearAllTimeouts();

    const currentBet = gameState.currentBet;
    const currentJackpot = gameState.jackpot;
    
    // Simular el giro con un timeout
    const timeout = setTimeout(async () => {
      const finalResults = SlotGameLogic.generateSpin();
      
      setGameState(prev => ({
        ...prev,
        currentResults: finalResults,
        isSpinning: false
      }));

      await processSpinResult(finalResults, currentBet, currentJackpot);
    }, 2000);

    setSpinTimeouts([timeout]);
  }, [gameState, placeBet, clearAllTimeouts, processSpinResult]);

  const handleBetChange = useCallback((direction: 'up' | 'down') => {
    setGameState(prev => {
      const change = direction === 'up' ? 10 : -10;
      const newBet = Math.max(10, Math.min(100, prev.bet + change));
      return { ...prev, bet: newBet };
    });
  }, []);

  const handleMaxBet = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      bet: Math.min(100, prev.credits)
    }));
  }, []);

  const handleReset = useCallback(() => {
    clearAllTimeouts();
    setGameState(SlotGameLogic.createInitialState());
  }, [clearAllTimeouts]);

  const handleQuitGame = useCallback(async () => {
    if (currentMatch?.match_id) {
      console.log('🚪 Saliendo de la partida:', currentMatch.match_id);
      await quitGame.mutateAsync(currentMatch.match_id);
    }
    clearAllTimeouts();
    setGameState(SlotGameLogic.createInitialState());
  }, [currentMatch, quitGame, clearAllTimeouts]);

  const handleContinueGame = useCallback(() => {
    console.log('🎮 Continuando juego...');
    continueGame();
  }, [continueGame]);

  // Auto-sincronizar créditos cuando cambia el balance
  useEffect(() => {
    if (balance !== gameState.credits && !isLoadingBalance) {
      console.log('💰 Sincronizando saldo:', balance);
      setGameState(prev => ({ ...prev, credits: balance }));
    }
  }, [balance, gameState.credits, isLoadingBalance]);

  // Mostrar loading mientras obtenemos el gameId
  if (isLoadingGameId) {
    return (
      <div className="slot-game">
        <div className="slot-game__header">
          <h1>🎰 Cargando Tragamonedas... 🎰</h1>
          <p>Obteniendo información del juego...</p>
        </div>
      </div>
    );
  }

  // Mostrar error si no se encuentra el juego
  if (!slotGameId) {
    return (
      <div className="slot-game">
        <div className="slot-game__header">
          <h1>❌ Error: Juego no encontrado</h1>
          <div className="error-message">
            <p>No se pudo encontrar el juego de tragamonedas en el sistema.</p>
            <p>Juegos disponibles:</p>
            <ul>
              {allGames?.slice(0, 10).map(game => (
                <li key={game.game_id}>
                  {game.game_name} (ID: {game.game_id})
                </li>
              ))}
            </ul>
            <p>Por favor, verifica que el juego esté registrado en el backend.</p>
          </div>
        </div>
      </div>
    );
  }

  const canSpin = !gameState.isSpinning && 
                 gameState.bet > 0 && 
                 gameState.credits >= gameState.bet &&
                 !isPlacingBet;

  const hasInsufficientFunds = gameState.credits < gameState.bet;

  return (
    <div className="slot-game">
      <div className="slot-game__header">
        <h1>🎰 Tragamonedas - ¡Buena Suerte! 🎰</h1>
        
        {/* Estado de las apuestas */}
        <div className="betting-status">
          {currentMatch && (
            <div className="current-match">
              <span>🎯 Partida activa: {currentMatch.match_id}</span>
            </div>
          )}
          
          {isPlacingBet && (
            <div className="betting-loading">
              <span>💰 Realizando apuesta...</span>
            </div>
          )}
          
          {isFinishingGame && (
            <div className="finishing-loading">
              <span>🏁 Finalizando partida...</span>
            </div>
          )}
          
          {isQuitting && (
            <div className="quitting-loading">
              <span>🚪 Saliendo del juego...</span>
            </div>
          )}
        </div>

        {/* Mostrar errores */}
        {betError && (
          <div className="error-message">
            <h3>❌ Error en la apuesta:</h3>
            <p>{betError.message}</p>
            <p>🔍 Verifica que el juego ID "{slotGameId}" exista en el backend</p>
            <p>📝 Endpoint: POST /games/{slotGameId}/matches</p>
          </div>
        )}
        
        {finishError && (
          <div className="error-message">
            <h3>❌ Error al finalizar:</h3>
            <p>{finishError.message}</p>
          </div>
        )}
      </div>

      <div className="slot-game__content">
        <div className="slot-game__left">
          <SlotMachine 
            reels={gameState.reels}
            isSpinning={gameState.isSpinning}
            jackpot={gameState.jackpot}
          />
          
          <GameControls
            bet={gameState.bet}
            credits={gameState.credits}
            canSpin={canSpin}
            isSpinning={gameState.isSpinning}
            hasInsufficientFunds={hasInsufficientFunds}
            onSpin={handleSpin}
            onBetChange={handleBetChange}
            onMaxBet={handleMaxBet}
          />

          {/* Controles adicionales del sistema de apuestas */}
          <div className="betting-game-controls">
            {currentMatch && (
              <button
                onClick={handleQuitGame}
                disabled={isQuitting || gameState.isSpinning}
                className="quit-button"
              >
                {isQuitting ? '🚪 Saliendo...' : '🚪 Salir del Juego'}
              </button>
            )}
            
            <button
              onClick={handleContinueGame}
              disabled={gameState.isSpinning}
              className="continue-button"
            >
              🎮 Continuar Jugando
            </button>
            
            <button
              onClick={handleReset}
              disabled={gameState.isSpinning}
              className="reset-button"
            >
              🔄 Reiniciar Juego
            </button>
          </div>
        </div>

        <div className="slot-game__right">
          {gameState.lastWin > 0 && (
            <WinDisplay 
              winAmount={gameState.lastWin}
              winType={gameState.lastSpin?.results ? 
                SlotGameLogic.calculateWin(gameState.lastSpin.results, gameState.lastSpin.bet).winType : 
                'none'
              }
            />
          )}
          
          <GameStats
            credits={gameState.credits}
            totalWins={gameState.totalWins}
            totalSpent={gameState.totalSpent}
            spinsCount={gameState.spinsCount}
            winStreak={gameState.winStreak}
            lastSpin={gameState.lastSpin}
          />
        </div>
      </div>
    </div>
  );
}
