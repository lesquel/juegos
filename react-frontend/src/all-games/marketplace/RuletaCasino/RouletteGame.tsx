import React, { useState, useCallback, useEffect } from 'react';
import { RouletteGameLogic } from './logic/RouletteGameLogic';
import type { RouletteGameState, SpinResult } from './types/RouletteTypes';
import { RouletteWheel } from './components/RouletteWheel';
import { BettingTable } from './components/BettingTable';
import { GameInfo } from './components/GameInfo';
import { ChipSelector } from './components/ChipSelector';
import { WinDisplay } from './components/WinDisplay';
import { GameEndModal } from './components/GameEndModal';
import { useRouletteBetting } from './services/rouletteBettingService';
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

  // Servicio de apuestas
  const bettingService = useRouletteBetting();

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
    if (gameState.isSpinning) return;

    const canAfford = RouletteGameLogic.canAffordBet(gameState.balance, gameState.selectedChip);
    if (!canAfford) return;

    setGameState(prev => RouletteGameLogic.placeBet(prev, betId, prev.selectedChip));
  }, [gameState.isSpinning, gameState.balance, gameState.selectedChip]);

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

    // Finalizar match automáticamente
    if (bettingService.currentMatch) {
      await bettingService.finishMatch(winningNumber, result.totalWinnings, result.isWin);
    }

    // Mostrar modal después de un breve delay
    const modalTimeout = setTimeout(() => {
      setShowEndModal(true);
    }, 2000);

    setSpinTimeouts(prev => [...prev, modalTimeout]);
  }, [gameState, bettingService]);

  const handleSpin = useCallback(async () => {
    if (gameState.isSpinning || gameState.totalBet === 0) return;

    clearAllTimeouts();

    // Crear match antes de girar
    const matchCreated = await bettingService.createMatch(gameState.totalBet, gameState.bets);
    if (!matchCreated) {
      console.error('❌ No se pudo crear el match de ruleta');
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
  }, [gameState, clearAllTimeouts, processSpinComplete, bettingService]);

  const handleReset = useCallback(() => {
    if (gameState.isSpinning) return;

    clearAllTimeouts();
    setGameState(RouletteGameLogic.createInitialState());
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
  }, []);

  const handleQuitGame = useCallback(async () => {
    if (bettingService.currentMatch) {
      await bettingService.quitMatch();
    }
    setShowEndModal(false);
    setLastSpinResult(null);
    setGameState(RouletteGameLogic.createInitialState());
  }, [bettingService]);

  const canSpin = gameState.totalBet > 0 && !gameState.isSpinning;
  const canPlaceBets = !gameState.isSpinning;

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
            ✅ Match activo: {bettingService.currentMatch.id} - Apuesta: {bettingService.currentMatch.betAmount.toLocaleString()} monedas
          </div>
        )}
        
        {bettingService.isCreatingMatch && (
          <div className="roulette-betting-loading">
            🔄 Creando apuesta...
          </div>
        )}
        
        {bettingService.isFinishingMatch && (
          <div className="roulette-finishing-loading">
            ⏳ Finalizando ronda...
          </div>
        )}
        
        {bettingService.isQuittingMatch && (
          <div className="roulette-quitting-loading">
            🚪 Saliendo del juego...
          </div>
        )}
        
        {bettingService.error && (
          <div className="roulette-error-message">
            <h3>❌ Error en el Sistema de Apuestas</h3>
            <p>{bettingService.error}</p>
            <button onClick={bettingService.clearError} className="clear-error-btn">
              Cerrar
            </button>
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
              className={`spin-button ${gameState.isSpinning ? 'spinning' : ''} ${!canSpin ? 'disabled' : ''}`}
              onClick={handleSpin}
              disabled={!canSpin}
              title={canSpin ? 'Girar la ruleta' : 'Necesitas apostar primero'}
            >
              {gameState.isSpinning ? (
                <>
                  <span className="spinner">🌀</span>
                  {' '}GIRANDO...
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
                disabled={gameState.isSpinning}
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
        {gameState.balance < RouletteGameLogic.CONFIG.CHIP_VALUES[0] && (
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
        isQuitLoading={bettingService.isQuittingMatch}
        canContinue={gameState.balance >= RouletteGameLogic.CONFIG.CHIP_VALUES[0]}
      />
    </div>
  );
}
