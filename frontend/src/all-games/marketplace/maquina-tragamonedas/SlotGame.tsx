import React, { useState, useEffect, useCallback } from 'react';
import { SlotGameLogic } from '../logic/SlotGameLogic';
import type { SlotGameState, SpinResult } from '../types/SlotTypes';
import { SlotMachine } from '../components/SlotMachine';
import { GameControls } from '../components/GameControls';
import { GameStats } from '../components/GameStats';
import { WinDisplay } from '../components/WinDisplay';
import '../styles/slot-game.css';

export function SlotGame() {
  const [gameState, setGameState] = useState<SlotGameState>(() => 
    SlotGameLogic.createInitialState()
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

  const processSpinResult = useCallback((spinResults: string[], currentBet: number, currentJackpot: number) => {
    const spinResult: SpinResult = SlotGameLogic.checkWin(spinResults);
    const winAmount = SlotGameLogic.calculateWinAmount(spinResult, currentBet, currentJackpot);

    setGameState(prev => {
      const newState = {
        ...prev,
        isSpinning: false,
        currentResults: spinResults,
        winMessage: SlotGameLogic.getWinMessage(spinResult, winAmount),
        showWinAnimation: spinResult.win
      };

      if (spinResult.win) {
        newState.credits += winAmount;
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
  }, []);

  const handleSpin = useCallback(async () => {
    if (gameState.isSpinning || !SlotGameLogic.canAffordBet(gameState.credits, gameState.currentBet)) {
      return;
    }

    clearAllTimeouts();

    // Capturar valores actuales para el timeout
    const currentBet = gameState.currentBet;
    const currentJackpot = gameState.jackpot + SlotGameLogic.CONFIG.JACKPOT_INCREMENT;

    // Iniciar giro
    setGameState(prev => ({
      ...prev,
      isSpinning: true,
      credits: prev.credits - prev.currentBet,
      totalSpins: prev.totalSpins + 1,
      winMessage: '',
      showWinAnimation: false,
      jackpot: prev.jackpot + SlotGameLogic.CONFIG.JACKPOT_INCREMENT
    }));

    // Simular giro con duración
    const spinTimeout = setTimeout(() => {
      const spinResults = SlotGameLogic.generateSpin();
      processSpinResult(spinResults, currentBet, currentJackpot);
    }, SlotGameLogic.CONFIG.SPIN_DURATION);

    setSpinTimeouts(prev => [...prev, spinTimeout]);
  }, [gameState, clearAllTimeouts, processSpinResult]);

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
        <p className="controls-hint">💡 Presiona <kbd>ESPACIO</kbd> para girar</p>
        {isLowCredits && !gameState.isSpinning && (
          <p className="warning">⚠️ Créditos bajos. Considera apostar menos o reiniciar el juego.</p>
        )}
      </div>
    </div>
  );
}
