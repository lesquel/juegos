import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { SlotGameLogic } from './logic/SlotGameLogic';
import type { SlotGameState } from './types/SlotTypes';
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
  const [showGameEndModal, setShowGameEndModal] = useState(false);
  const [lastGameResult, setLastGameResult] = useState<{win: boolean, amount: number, message: string} | null>(null);

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
        
        // Guardar resultado para el modal
        setLastGameResult({
          win: slotResult.win,
          amount: winAmount,
          message: SlotGameLogic.getWinMessage(slotResult, winAmount)
        });
        
        // Mostrar modal de fin de partida
        setTimeout(() => {
          setShowGameEndModal(true);
        }, 1000);
        
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
  }, [finishGame, currentMatch]);

  const handleSpin = useCallback(async () => {
    if (gameState.isSpinning || gameState.currentBet <= 0 || gameState.credits < gameState.currentBet || !slotGameId) {
      return;
    }

    console.log('🎰 Iniciando giro con apuesta:', gameState.currentBet);

    try {
      // Crear nueva partida y hacer apuesta
      const betData = {
        betAmount: gameState.currentBet,
        gameId: slotGameId
      };
      
      console.log('💰 Creando partida para apuesta:', betData);
      await placeBet.mutateAsync(betData);
      console.log('✅ Apuesta realizada exitosamente');
    } catch (error) {
      console.error('❌ Error al realizar apuesta:', error);
      return; // No continuar si la apuesta falla
    }

    // Actualizar estado para mostrar que está girando
    // NO descontamos créditos aquí, el backend ya lo hizo
    setGameState(prev => ({
      ...prev,
      isSpinning: true,
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
  }, [gameState, placeBet, clearAllTimeouts, processSpinResult, slotGameId]);

  const handleBetChange = useCallback((direction: 'up' | 'down') => {
    setGameState(prev => {
      const newBet = SlotGameLogic.changeBet(prev.currentBet, direction);
      return { ...prev, currentBet: newBet };
    });
  }, []);

  const handleReset = useCallback(() => {
    clearAllTimeouts();
    setGameState(SlotGameLogic.createInitialState());
    setShowGameEndModal(false);
    setLastGameResult(null);
  }, [clearAllTimeouts]);

  const handleNewGame = useCallback(() => {
    setShowGameEndModal(false);
    setLastGameResult(null);
    // El estado se mantendrá con los créditos actualizados
    console.log('🎮 Iniciando nueva partida...');
  }, []);

  const handleQuitAndReset = useCallback(() => {
    setShowGameEndModal(false);
    setLastGameResult(null);
    clearAllTimeouts();
    setGameState(SlotGameLogic.createInitialState());
    console.log('🚪 Saliendo y reiniciando juego...');
  }, [clearAllTimeouts]);

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
                 gameState.currentBet > 0 && 
                 gameState.credits >= gameState.currentBet &&
                 !isPlacingBet;

  const hasInsufficientFunds = gameState.credits < gameState.currentBet;

  return (
    <div className="slot-game">
      <div className="slot-game__header">
        <h1>🎰 Tragamonedas - ¡Buena Suerte! 🎰</h1>
        
        {/* Estado de las apuestas */}
        <div className="betting-status">
          {currentMatch && (
            <div className="current-match">
              <span>🎯 Partida activa: {currentMatch.matchId}</span>
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
          {/* Slot Machine simplificada */}
          <div className="slot-machine">
            <div className="jackpot-display">
              <h2>💰 Jackpot: ${SlotGameLogic.formatCredits(gameState.jackpot)}</h2>
            </div>
            
            <div className="reels">
              {gameState.currentResults.map((symbol, index) => (
                <div key={`reel-${index}-${symbol}`} className={`reel ${gameState.isSpinning ? 'spinning' : ''}`}>
                  <div className="symbol">{symbol}</div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Controles simplificados */}
          <div className="game-controls">
            <div className="credits-display">
              <span>💰 Créditos: ${SlotGameLogic.formatCredits(gameState.credits)}</span>
            </div>
            
            <div className="bet-controls">
              <button 
                onClick={() => handleBetChange('down')}
                disabled={gameState.isSpinning}
              >
                -
              </button>
              <span>Apuesta: ${gameState.currentBet}</span>
              <button 
                onClick={() => handleBetChange('up')}
                disabled={gameState.isSpinning}
              >
                +
              </button>
            </div>
            
            <button
              onClick={handleSpin}
              disabled={!canSpin}
              className={`spin-button ${gameState.isSpinning ? 'spinning' : ''}`}
            >
              {gameState.isSpinning ? '⏳ Girando...' : '🎰 GIRAR'}
            </button>
            
            {hasInsufficientFunds && (
              <div className="insufficient-funds">
                ⚠️ Fondos insuficientes
              </div>
            )}
          </div>

          {/* Controles adicionales del sistema de apuestas */}
          <div className="betting-game-controls">
            <button
              onClick={handleReset}
              disabled={gameState.isSpinning}
              className="reset-button"
            >
              🔄 Reiniciar Juego Completo
            </button>
          </div>
        </div>

        <div className="slot-game__right">
          {/* Win Display */}
          {gameState.showWinAnimation && gameState.winMessage && (
            <div className="win-display">
              <h3>🎉 ¡GANASTE! 🎉</h3>
              <p>{gameState.winMessage}</p>
            </div>
          )}
          
          {/* Game Stats */}
          <div className="game-stats">
            <h3>📊 Estadísticas</h3>
            <div className="stat">
              <span>💰 Créditos:</span>
              <span>${SlotGameLogic.formatCredits(gameState.credits)}</span>
            </div>
            <div className="stat">
              <span>🎯 Total Ganado:</span>
              <span>${SlotGameLogic.formatCredits(gameState.totalWins)}</span>
            </div>
            <div className="stat">
              <span>🎰 Giros:</span>
              <span>{gameState.totalSpins}</span>
            </div>
            <div className="stat">
              <span>🔥 Jackpot:</span>
              <span>${SlotGameLogic.formatCredits(gameState.jackpot)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de fin de partida */}
      {showGameEndModal && lastGameResult && (
        <div className="game-end-modal-overlay">
          <div className="game-end-modal">
            <div className="modal-header">
              <h2>🎰 Partida Finalizada 🎰</h2>
            </div>
            
            <div className="modal-content">
              {lastGameResult.win ? (
                <div className="win-result">
                  <h3>🎉 ¡FELICIDADES! 🎉</h3>
                  <p className="win-message">{lastGameResult.message}</p>
                  <p className="modal-win-amount">Ganaste: ${lastGameResult.amount}</p>
                </div>
              ) : (
                <div className="lose-result">
                  <h3>😔 No hubo suerte esta vez</h3>
                  <p>¡Inténtalo de nuevo!</p>
                </div>
              )}
              
              <div className="current-balance">
                <p>💰 Saldo actual: ${SlotGameLogic.formatCredits(gameState.credits)}</p>
              </div>
            </div>
            
            <div className="modal-actions">
              <button
                onClick={handleNewGame}
                className="new-game-button"
                disabled={gameState.credits < gameState.currentBet}
              >
                🎮 Nueva Partida
              </button>
              
              <button
                onClick={handleQuitAndReset}
                className="quit-game-button"
              >
                🚪 Salir del Juego
              </button>
            </div>
            
            {gameState.credits < gameState.currentBet && (
              <div className="insufficient-funds-warning">
                ⚠️ Fondos insuficientes para continuar con la apuesta actual
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
