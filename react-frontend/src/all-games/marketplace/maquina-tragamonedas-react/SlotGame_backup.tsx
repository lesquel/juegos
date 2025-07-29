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
  const { balance, isLoading: isLoadingBalance, hasInsufficientFunds } = useSlotGameBalance();
  
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
    const spinResult: SpinResult = SlotGameLogic.checkWin(spinResults);
    const winAmount = SlotGameLogic.calculateWinAmount(spinResult, currentBet, currentJackpot);

    // Crear el resultado para el backend
    const gameResult: SlotGameResult = {
      win: spinResult.win,
      winAmount: winAmount,
      isJackpot: spinResult.isJackpot || false,
      combination: spinResults.join('')
    };

    // Finalizar el match en el backend
    try {
      await finishGame.mutateAsync(gameResult);
    } catch (error) {
      console.error("Error al finalizar el match:", error);
    }

    setGameState(prev => {
      const newState = {
        ...prev,
        isSpinning: false,
        currentResults: spinResults,
        winMessage: SlotGameLogic.getWinMessage(spinResult, winAmount),
        showWinAnimation: spinResult.win
      };

      // Nota: No modificamos credits aquí porque se actualizan desde el backend
      if (spinResult.win) {
        newState.totalWins += 1;
        
        if (spinResult.isJackpot) {
          newState.jackpot = SlotGameLogic.CONFIG.JACKPOT_INITIAL;
        }
      }

      return newState;
    });

    // Programar ocultado de animación de victoria
    if (spinResult.win) {
      const winTimeout = setTimeout(() => {
        setGameState(prev => ({
          ...prev,
          showWinAnimation: false,
          winMessage: ''
        }));
      }, SlotGameLogic.CONFIG.CELEBRATION_DURATION);

      setSpinTimeouts(prev => [...prev, winTimeout]);
    }
  }, [finishGame]);

  const handleSpin = useCallback(async () => {
    // Verificar si ya está girando o si no puede apostar
    if (gameState.isSpinning || isPlacingBet) {
      return;
    }

    // Verificar si el usuario tiene suficientes fondos
    if (balance < gameState.currentBet) {
      alert("Fondos insuficientes para esta apuesta");
      return;
    }

    clearAllTimeouts();

    try {
      // Crear apuesta en el backend
      await placeBet.mutateAsync({
        betAmount: gameState.currentBet,
        gameId: SLOT_GAME_ID
      });

      // Capturar valores actuales para el timeout
      const currentBet = gameState.currentBet;
      const currentJackpot = gameState.jackpot + SlotGameLogic.CONFIG.JACKPOT_INCREMENT;

      // Iniciar giro (no descontamos créditos aquí, se hace en el backend)
      setGameState(prev => ({
        ...prev,
        isSpinning: true,
        totalSpins: prev.totalSpins + 1,
        winMessage: '',
        showWinAnimation: false,
        jackpot: prev.jackpot + SlotGameLogic.CONFIG.JACKPOT_INCREMENT
      }));

      // Simular giro con duración
      const spinTimeout = setTimeout(async () => {
        const spinResults = SlotGameLogic.generateSpin();
        await processSpinResult(spinResults, currentBet, currentJackpot);
      }, SlotGameLogic.CONFIG.SPIN_DURATION);

      setSpinTimeouts(prev => [...prev, spinTimeout]);
    } catch (error) {
      console.error("Error al realizar apuesta:", error);
      alert("Error al realizar la apuesta. Por favor intenta de nuevo.");
    }
  }, [gameState, balance, isPlacingBet, placeBet, clearAllTimeouts, processSpinResult]);

  const handleBetChange = useCallback((direction: 'up' | 'down') => {
    if (gameState.isSpinning) return;

    setGameState(prev => ({
      ...prev,
      currentBet: SlotGameLogic.changeBet(prev.currentBet, direction)
    }));
  }, [gameState.isSpinning]);

  const handleMaxBet = useCallback(() => {
    if (gameState.isSpinning) return;

    const maxBet = SlotGameLogic.getMaxBetForCredits(gameState.credits);
    if (maxBet > 0) {
      setGameState(prev => ({
        ...prev,
        currentBet: maxBet
      }));
    }
  }, [gameState.isSpinning, gameState.credits]);

  const handleReset = useCallback(() => {
    if (gameState.isSpinning) return;

    clearAllTimeouts();
    setGameState(SlotGameLogic.createInitialState());
  }, [gameState.isSpinning, clearAllTimeouts]);

  // Función para salir del juego
  const handleQuitGame = useCallback(async () => {
    if (window.confirm("¿Estás seguro de que quieres salir del juego?")) {
      try {
        await quitGame.mutateAsync();
      } catch (error) {
        console.error("Error al salir del juego:", error);
      }
    }
  }, [quitGame]);

  // Función para continuar jugando después de perder
  const handleContinueGame = useCallback(() => {
    continueGame();
    setGameState(prev => ({
      ...prev,
      winMessage: '',
      showWinAnimation: false
    }));
  }, [continueGame]);

  // Manejo de teclado
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.code === 'Space') {
        event.preventDefault();
        handleSpin();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleSpin]);

  const canAffordCurrentBet = SlotGameLogic.canAffordBet(gameState.credits, gameState.currentBet);
  const isLowCredits = SlotGameLogic.isLowCredits(gameState.credits);

  return (
    <div className="slot-game">
      <div className="slot-game__header">
        <h1>🎰 Máquina Tragamonedas 🎰</h1>
        <div className="slot-game__jackpot">
          <span className="jackpot-label">JACKPOT</span>
          <span className="jackpot-amount">${SlotGameLogic.formatCredits(gameState.jackpot)}</span>
        </div>
      </div>

      <div className="slot-game__content">
        <div className="slot-game__main">
          <SlotMachine 
            symbols={gameState.currentResults}
            isSpinning={gameState.isSpinning}
          />

          <GameControls
            currentBet={gameState.currentBet}
            credits={gameState.credits}
            isSpinning={gameState.isSpinning}
            canAffordBet={canAffordCurrentBet}
            isLowCredits={isLowCredits}
            onSpin={handleSpin}
            onBetChange={handleBetChange}
            onMaxBet={handleMaxBet}
            onReset={handleReset}
          />
        </div>

        <div className="slot-game__sidebar">
          <GameStats
            credits={gameState.credits}
            totalSpins={gameState.totalSpins}
            totalWins={gameState.totalWins}
            jackpot={gameState.jackpot}
          />
        </div>
      </div>

      <WinDisplay
        message={gameState.winMessage}
        isVisible={gameState.showWinAnimation}
        isJackpot={gameState.winMessage.includes('JACKPOT')}
      />

      <div className="slot-game__footer">
        {/* Información del estado de apuesta */}
        {currentMatch && (
          <div className="betting-status">
            <p>🎯 Apuesta activa: ${currentMatch.betAmount}</p>
          </div>
        )}
        
        {/* Estados de carga */}
        {isPlacingBet && (
          <p className="loading-status">🎲 Creando apuesta...</p>
        )}
        {isFinishingGame && (
          <p className="loading-status">🏁 Finalizando partida...</p>
        )}
        
        {/* Errores */}
        {betError && (
          <div className="error-message">
            <p>❌ Error en apuesta: {betError.message}</p>
            <p>🔍 Verifica que el juego ID "{SLOT_GAME_ID}" exista en el backend</p>
            <p>📝 Endpoint: POST /games/{SLOT_GAME_ID}/matches</p>
            <details>
              <summary>Detalles técnicos</summary>
              <pre>{JSON.stringify(betError, null, 2)}</pre>
            </details>
          </div>
        )}
        {finishError && (
          <p className="error-message">❌ Error al finalizar: {finishError.message}</p>
        )}
        
        {/* Información del saldo */}
        <div className="balance-info">
          <p>💰 Saldo actual: ${balance}</p>
          {isLoadingBalance && <span>Cargando...</span>}
        </div>
        
        {/* Controles del juego */}
        <div className="betting-game-controls">
          <button 
            onClick={handleQuitGame}
            disabled={isQuitting}
            className="quit-button"
          >
            {isQuitting ? "Saliendo..." : "🚪 Salir del Juego"}
          </button>
          
          {balance < gameState.currentBet && (
            <button 
              onClick={handleContinueGame}
              className="continue-button"
            >
              � Fondos Insuficientes - Continuar
            </button>
          )}
        </div>
        
        <p className="controls-hint">�💡 Presiona <kbd>ESPACIO</kbd> para girar</p>
        {balance < gameState.currentBet && !gameState.isSpinning && (
          <p className="warning">⚠️ Fondos insuficientes para esta apuesta. Reduce la apuesta o sal del juego.</p>
        )}
      </div>
    </div>
  );
}
