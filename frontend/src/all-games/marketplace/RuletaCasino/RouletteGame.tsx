import React, { useState, useCallback, useEffect } from 'react';
import { RouletteGameLogic } from '../logic/RouletteGameLogic';
import type { RouletteGameState, SpinResult } from '../types/RouletteTypes';
import { RouletteWheel } from '../components/RouletteWheel';
import { BettingTable } from '../components/BettingTable';
import { GameInfo } from '../components/GameInfo';
import { ChipSelector } from '../components/ChipSelector';
import { WinDisplay } from '../components/WinDisplay';
import '../styles/roulette-game.css';

export function RouletteGame() {
  const [gameState, setGameState] = useState<RouletteGameState>(() => 
    RouletteGameLogic.createInitialState()
  );
  const [spinTimeouts, setSpinTimeouts] = useState<NodeJS.Timeout[]>([]);

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

  const processSpinComplete = useCallback((winningNumber: number) => {
    const result: SpinResult = RouletteGameLogic.processSpinResult(gameState, winningNumber);
    
    setGameState(prev => RouletteGameLogic.updateStateAfterSpin(prev, result));

    // Programar ocultado de animación
    if (result.isWin) {
      const winTimeout = setTimeout(() => {
        setGameState(prev => ({
          ...prev,
          showWinAnimation: false,
          winMessage: ''
        }));
      }, RouletteGameLogic.CONFIG.CELEBRATION_DURATION);

      setSpinTimeouts(prev => [...prev, winTimeout]);
    } else {
      const hideTimeout = setTimeout(() => {
        setGameState(prev => ({
          ...prev,
          winMessage: ''
        }));
      }, RouletteGameLogic.CONFIG.RESULT_DISPLAY_DURATION);

      setSpinTimeouts(prev => [...prev, hideTimeout]);
    }
  }, [gameState]);

  const handleSpin = useCallback(async () => {
    if (gameState.isSpinning || gameState.totalBet === 0) return;

    clearAllTimeouts();

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
  }, [gameState, clearAllTimeouts, processSpinComplete]);

  const handleReset = useCallback(() => {
    if (gameState.isSpinning) return;

    clearAllTimeouts();
    setGameState(RouletteGameLogic.createInitialState());
  }, [gameState.isSpinning, clearAllTimeouts]);

  const canSpin = gameState.totalBet > 0 && !gameState.isSpinning;
  const canPlaceBets = !gameState.isSpinning;

  return (
    <div className="roulette-game">
      <div className="roulette-game__header">
        <h1>🎰 Ruleta Casino 🎰</h1>
        <p className="subtitle">¡Haz tu apuesta y gira la ruleta!</p>
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
    </div>
  );
}
