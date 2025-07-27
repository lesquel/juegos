import React from 'react';
import { RouletteGameLogic } from '../logic/RouletteGameLogic';

interface RouletteWheelProps {
  isSpinning: boolean;
  lastWinningNumber: number | null;
  winnings: number;
}

export function RouletteWheel({ isSpinning, lastWinningNumber, winnings }: RouletteWheelProps) {
  const getResultDisplay = () => {
    if (isSpinning) {
      return (
        <div className="result-display spinning">
          <div className="spinning-text">🎲 Girando la ruleta...</div>
        </div>
      );
    }

    if (lastWinningNumber !== null) {
      const color = RouletteGameLogic.getNumberColor(lastWinningNumber);
      let colorClass = 'zero';
      if (color === 'red') colorClass = 'red';
      else if (color === 'black') colorClass = 'black';
      
      return (
        <div className="result-display">
          <div className={`winning-number ${colorClass}`}>
            {lastWinningNumber}
          </div>
          {winnings > 0 ? (
            <div className="win-amount">
              🎉 ¡Ganaste {RouletteGameLogic.formatCurrency(winnings)}!
            </div>
          ) : (
            <div className="lose-message">
              😔 Sin suerte esta vez
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="result-display">
        <div className="ready-message">
          🎰 ¡Listo para girar!
        </div>
      </div>
    );
  };

  return (
    <div className="wheel-container">
      <div className={`roulette-wheel ${isSpinning ? 'spinning' : ''}`}>
        <div className="wheel-center">
          <div className="wheel-logo">🎰</div>
        </div>
        
        <div className="wheel-ball">
          <div className="ball"></div>
        </div>
      </div>
      
      {getResultDisplay()}
    </div>
  );
}
