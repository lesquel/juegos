import React from 'react';
import { SlotGameLogic } from '../logic/SlotGameLogic';

interface GameControlsProps {
  currentBet: number;
  credits: number;
  isSpinning: boolean;
  canAffordBet: boolean;
  isLowCredits: boolean;
  onSpin: () => void;
  onBetChange: (direction: 'up' | 'down') => void;
  onMaxBet: () => void;
  onReset: () => void;
}

export function GameControls({
  currentBet,
  credits,
  isSpinning,
  canAffordBet,
  isLowCredits,
  onSpin,
  onBetChange,
  onMaxBet,
  onReset
}: GameControlsProps) {
  const betOptions = SlotGameLogic.CONFIG.BET_OPTIONS;
  const currentBetIndex = betOptions.indexOf(currentBet);
  const canIncreaseBet = currentBetIndex < betOptions.length - 1;
  const canDecreaseBet = currentBetIndex > 0;

  return (
    <div className="game-controls">
      <div className="controls-section">
        <h3>Créditos</h3>
        <div className={`credits-display ${isLowCredits ? 'low-credits' : ''}`}>
          ${SlotGameLogic.formatCredits(credits)}
        </div>
      </div>

      <div className="controls-section">
        <h3>Apuesta</h3>
        <div className="bet-controls">
          <button
            className="bet-btn bet-btn--decrease"
            onClick={() => onBetChange('down')}
            disabled={isSpinning || !canDecreaseBet}
            title="Disminuir apuesta"
          >
            -
          </button>
          
          <div className="bet-display">
            ${currentBet}
          </div>
          
          <button
            className="bet-btn bet-btn--increase"
            onClick={() => onBetChange('up')}
            disabled={isSpinning || !canIncreaseBet}
            title="Aumentar apuesta"
          >
            +
          </button>
        </div>
        
        <button
          className="max-bet-btn"
          onClick={onMaxBet}
          disabled={isSpinning}
          title="Apuesta máxima"
        >
          MAX BET
        </button>
      </div>

      <div className="controls-section">
        <button
          className={`spin-btn ${isSpinning ? 'spinning' : ''} ${!canAffordBet ? 'disabled' : ''}`}
          onClick={onSpin}
          disabled={isSpinning || !canAffordBet}
          title={canAffordBet ? 'Girar (Espacio)' : 'Créditos insuficientes'}
        >
          {isSpinning ? (
            <>
              <span className="spinner">🎰</span>
              {' '}GIRANDO...
            </>
          ) : (
            <>
              <span>🎯</span>
              {' '}GIRAR
            </>
          )}
        </button>
        
        {!canAffordBet && !isSpinning && (
          <div className="insufficient-credits">
            ⚠️ Créditos insuficientes
          </div>
        )}
      </div>

      <div className="controls-section">
        <button
          className="reset-btn"
          onClick={onReset}
          disabled={isSpinning}
          title="Reiniciar juego"
        >
          🔄 REINICIAR
        </button>
      </div>
    </div>
  );
}
