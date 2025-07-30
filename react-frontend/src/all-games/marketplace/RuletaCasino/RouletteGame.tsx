import React, { useState, useCallback, useEffect } from 'react';
import { RouletteGameLogic } from './logic/RouletteGameLogic';
import type { RouletteGameState, SpinResult } from './types/RouletteTypes';
import { RouletteWheel } from './components/RouletteWheel';
import { BettingTable } from './components/BettingTable';
import { GameInfo } from './components/GameInfo';
import { ChipSelector } from './components/ChipSelector';
import { WinDisplay } from './components/WinDisplay';
import { GameEndModal } from './components/GameEndModal';
import { useRouletteGameId, useRouletteBetting, useRouletteBalance } from './services/rouletteBettingService';
import type { RouletteBetData, RouletteGameResult } from './services/rouletteBettingService';
import './styles/roulette-game.css';

export function RouletteGame() {
  const [gameState, setGameState] = useState<RouletteGameState>(() => 
    RouletteGameLogic.createInitialState()
  );
  const [spinTimeouts, setSpinTimeouts] = useState<NodeJS.Timeout[]>([]);
  const [showEndModal, setShowEndModal] = useState(false);
  const [lastSpinResult, setLastSpinResult] = useState<{
    winningNumber: number;
    winAmount: number;
    isWin: boolean;
  } | null>(null);

  // Hooks para detectar el game ID y balance
  const { rouletteGameId, isLoading: isLoadingGameId } = useRouletteGameId();
  const { balance, isLoading: isLoadingBalance, hasInsufficientFunds } = useRouletteBalance();
  
  // Servicio de apuestas (solo si tenemos gameId)
  const bettingService = useRouletteBetting(rouletteGameId || "");

  // Sincronizar balance del backend con el estado local
  useEffect(() => {
    if (balance > 0) {
      setGameState(prev => ({ ...prev, balance }));
    }
  }, [balance]);

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

  const handlePlaceBet = useCallback((betId: string) => {
    if (gameState.isSpinning || !bettingService.canPlaceBet(gameState.selectedChip)) return;

    setGameState(prev => RouletteGameLogic.placeBet(prev, betId, prev.selectedChip));
  }, [gameState.isSpinning, gameState.selectedChip, bettingService]);

  const handleChipChange = useCallback((chipValue: number) => {
    if (gameState.isSpinning) return;

    setGameState(prev => RouletteGameLogic.changeChip(prev, chipValue));
  }, [gameState.isSpinning]);

  const handleClearBets = useCallback(() => {
    if (gameState.isSpinning) return;

    setGameState(prev => RouletteGameLogic.clearBets(prev));
  }, [gameState.isSpinning]);

  const processSpinComplete = useCallback(async (winningNumber: number) => {
    const result: SpinResult = RouletteGameLogic.processSpinResult(gameState, winningNumber);
    
    setGameState(prev => RouletteGameLogic.updateStateAfterSpin(prev, result));
    setLastSpinResult({
      winningNumber,
      winAmount: result.totalWinnings,
      isWin: result.isWin
    });

    // Finalizar match automáticamente usando el servicio correcto
    if (bettingService.currentMatch && rouletteGameId) {
      const gameResult: RouletteGameResult = {
        win: result.isWin,
        winAmount: result.totalWinnings,
        winningNumber,
        totalBet: gameState.totalBet,
        multiplier: result.isWin ? (result.totalWinnings / gameState.totalBet) : -1,
      };

      try {
        await bettingService.finishGame.mutateAsync(gameResult);
        console.log("✅ Match de ruleta finalizado exitosamente");
      } catch (error) {
        console.error("❌ Error al finalizar match de ruleta:", error);
      }
    }

    // Mostrar modal después de un breve delay
    const modalTimeout = setTimeout(() => {
      setShowEndModal(true);
    }, 2000);

    setSpinTimeouts(prev => [...prev, modalTimeout]);
  }, [gameState, bettingService, rouletteGameId]);

  const handleSpin = useCallback(async () => {
    if (gameState.isSpinning || gameState.totalBet === 0 || !rouletteGameId) return;

    // Verificar fondos suficientes
    if (hasInsufficientFunds(gameState.totalBet)) {
      console.warn("⚠️ Fondos insuficientes para la apuesta");
      return;
    }

    clearAllTimeouts();

    // Crear match antes de girar usando el servicio correcto
    const betData: RouletteBetData = {
      betAmount: gameState.totalBet,
      gameId: rouletteGameId,
      bets: gameState.bets
    };

    try {
      await bettingService.placeBet.mutateAsync(betData);
      console.log("✅ Match de ruleta creado exitosamente");
    } catch (error) {
      console.error("❌ No se pudo crear el match de ruleta:", error);
      return;
    }

    // Iniciar giro
    setGameState(prev => ({
      ...prev,
      isSpinning: true,
      winMessage: '',
      showWinAnimation: false
    }));

    // Generar número ganador
    const winningNumber = RouletteGameLogic.generateRiggedNumber(gameState);

    // Simular duración del giro
    const spinTimeout = setTimeout(() => {
      processSpinComplete(winningNumber);
    }, RouletteGameLogic.CONFIG.SPIN_DURATION);

    setSpinTimeouts(prev => [...prev, spinTimeout]);
  }, [gameState, clearAllTimeouts, processSpinComplete, bettingService, rouletteGameId, hasInsufficientFunds]);

  const handleReset = useCallback(() => {
    if (gameState.isSpinning) return;

    clearAllTimeouts();
    setGameState(prev => ({ ...RouletteGameLogic.createInitialState(), balance: prev.balance }));
    setShowEndModal(false);
    setLastSpinResult(null);
  }, [gameState.isSpinning, clearAllTimeouts]);

  const handleNewGame = useCallback(async () => {
    setShowEndModal(false);
    setLastSpinResult(null);
    
    // Limpiar apuestas y preparar para nueva ronda
    setGameState(prev => ({
      ...prev,
      bets: new Map(),
      totalBet: 0,
      winMessage: '',
      showWinAnimation: false
    }));

    // Continuar juego usando el servicio
    bettingService.continueGame();
  }, [bettingService]);

  const handleQuitGame = useCallback(async () => {
    try {
      await bettingService.quitGame.mutateAsync();
      console.log("✅ Salida del juego exitosa");
    } catch (error) {
      console.error("❌ Error al salir del juego:", error);
    }
    
    setShowEndModal(false);
    setLastSpinResult(null);
    setGameState(prev => ({ ...RouletteGameLogic.createInitialState(), balance: prev.balance }));
  }, [bettingService]);

  const canSpin = gameState.totalBet > 0 && !gameState.isSpinning && !bettingService.isPlacingBet && !!rouletteGameId;
  const canPlaceBets = !gameState.isSpinning && !bettingService.isPlacingBet;

  // Mostrar loading si está cargando datos
  if (isLoadingGameId || isLoadingBalance) {
    return (
      <div className="roulette-game">
        <div className="roulette-game__header">
          <h1>🎰 Ruleta Casino 🎰</h1>
          <p className="subtitle">Cargando...</p>
        </div>
      </div>
    );
  }

  // Mostrar error si no se puede cargar el juego
  if (!rouletteGameId) {
    return (
      <div className="roulette-game">
        <div className="roulette-game__header">
          <h1>🎰 Ruleta Casino 🎰</h1>
          <p className="subtitle">Error al cargar el juego</p>
        </div>
        <div className="roulette-error-message">
          <h3>❌ Juego no disponible</h3>
          <p>No se pudo encontrar el juego de ruleta. Por favor, contacta al administrador.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="roulette-game">
      <div className="roulette-game__header">
        <h1>🎰 Ruleta Casino 🎰</h1>
        <p className="subtitle">¡Haz tu apuesta y gira la ruleta!</p>
      </div>

      {/* Estado de apuestas */}
      <div className="roulette-betting-status">
        {bettingService.currentMatch && (
          <div className="roulette-current-match">
            ✅ Match activo: {bettingService.currentMatch.matchId} - Apuesta: {bettingService.currentMatch.betAmount.toLocaleString()} monedas
          </div>
        )}
        
        {bettingService.isPlacingBet && (
          <div className="roulette-betting-loading">
            🔄 Creando apuesta...
          </div>
        )}
        
        {bettingService.isFinishingGame && (
          <div className="roulette-finishing-loading">
            ⏳ Finalizando ronda...
          </div>
        )}
        
        {bettingService.isQuitting && (
          <div className="roulette-quitting-loading">
            🚪 Saliendo del juego...
          </div>
        )}
        
        {(bettingService.betError || bettingService.finishError || bettingService.quitError) && (
          <div className="roulette-error-message">
            <h3>❌ Error en el Sistema de Apuestas</h3>
            <p>
              {bettingService.betError?.message || 
               bettingService.finishError?.message || 
               bettingService.quitError?.message}
            </p>
          </div>
        )}
      </div>

      <GameInfo
        balance={gameState.balance}
        totalBet={gameState.totalBet}
        lastWinningNumber={gameState.lastWinningNumber}
        history={gameState.history}
        winnings={gameState.winnings}
      />

      <div className="roulette-game__main">
        <div className="roulette-game__wheel-section">
          <RouletteWheel
            isSpinning={gameState.isSpinning}
            lastWinningNumber={gameState.lastWinningNumber}
            winnings={gameState.winnings}
          />

          <div className="roulette-game__controls">
            <button
              className={`spin-button ${gameState.isSpinning || bettingService.isPlacingBet ? 'spinning' : ''} ${!canSpin ? 'disabled' : ''}`}
              onClick={handleSpin}
              disabled={!canSpin}
              title={canSpin ? 'Girar la ruleta' : 'Necesitas apostar primero'}
            >
              {gameState.isSpinning ? (
                <>
                  <span className="spinner">🌀</span>
                  {' '}GIRANDO...
                </>
              ) : bettingService.isPlacingBet ? (
                <>
                  <span className="spinner">🔄</span>
                  {' '}CREANDO APUESTA...
                </>
              ) : (
                <>
                  <span>🎯</span>
                  {' '}¡GIRAR RULETA!
                </>
              )}
            </button>

            <div className="action-buttons">
              <button
                className="clear-bets-btn"
                onClick={handleClearBets}
                disabled={!canPlaceBets || gameState.totalBet === 0}
                title="Limpiar todas las apuestas"
              >
                🧹 Limpiar Apuestas
              </button>

              <button
                className="reset-btn"
                onClick={handleReset}
                disabled={gameState.isSpinning || bettingService.isPlacingBet}
                title="Reiniciar juego"
              >
                🔄 Reiniciar
              </button>
            </div>
          </div>
        </div>

        <div className="roulette-game__betting-section">
          <ChipSelector
            selectedChip={gameState.selectedChip}
            balance={gameState.balance}
            onChipChange={handleChipChange}
            disabled={!canPlaceBets}
          />

          <BettingTable
            bets={gameState.bets}
            onPlaceBet={handlePlaceBet}
            disabled={!canPlaceBets}
            selectedChip={gameState.selectedChip}
            lastWinningNumber={gameState.lastWinningNumber}
          />
        </div>
      </div>

      <WinDisplay
        message={gameState.winMessage}
        isVisible={gameState.showWinAnimation || (gameState.winMessage !== '' && !gameState.showWinAnimation)}
        isWin={gameState.showWinAnimation}
        winnings={gameState.winnings}
      />

      <div className="roulette-game__footer">
        <p className="game-tip">
          💡 <strong>Consejo:</strong> Prueba diferentes estrategias de apuesta. ¡Cada giro es una nueva oportunidad!
        </p>
        {hasInsufficientFunds(RouletteGameLogic.CONFIG.CHIP_VALUES[0]) && (
          <p className="warning">
            ⚠️ Saldo insuficiente. Reinicia el juego para continuar jugando.
          </p>
        )}
      </div>

      {/* Modal de fin de partida */}
      <GameEndModal
        isOpen={showEndModal}
        isWin={lastSpinResult?.isWin || false}
        winAmount={lastSpinResult?.winAmount || 0}
        winningNumber={lastSpinResult?.winningNumber || null}
        currentBalance={gameState.balance}
        onNewGame={handleNewGame}
        onQuitGame={handleQuitGame}
        isNewGameLoading={false}
        isQuitLoading={bettingService.isQuitting}
        canContinue={!hasInsufficientFunds(RouletteGameLogic.CONFIG.CHIP_VALUES[0])}
      />
    </div>
  );
}
