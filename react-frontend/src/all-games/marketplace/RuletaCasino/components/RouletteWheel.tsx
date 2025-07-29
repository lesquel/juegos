import React, { useEffect, useRef } from 'react';
import { RouletteGameLogic } from '../logic/RouletteGameLogic';

interface RouletteWheelProps {
  isSpinning: boolean;
  lastWinningNumber: number | null;
  winnings: number;
}

export function RouletteWheel({ isSpinning, lastWinningNumber, winnings }: RouletteWheelProps) {
  const wheelBallRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isSpinning && lastWinningNumber !== null) {
      const winningNumberData = RouletteGameLogic.NUMBERS.find(
        (num) => num.number === lastWinningNumber
      );

      if (winningNumberData && wheelBallRef.current) {
        const degreesPerSector = 360 / RouletteGameLogic.NUMBERS.length;
        const targetRotation = winningNumberData.sector * degreesPerSector;
        const finalRotation = 1440 + targetRotation; 

        wheelBallRef.current.style.transform = `translate(-50%, -50%) rotate(${finalRotation}deg)`;
        wheelBallRef.current.classList.add('landed');
      }
    } else if (isSpinning && wheelBallRef.current) {
      wheelBallRef.current.style.transform = 'translate(-50%, -50%) rotate(0deg)';
      wheelBallRef.current.classList.remove('landed');
    }
  }, [isSpinning, lastWinningNumber]);
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
        
        <div className="wheel-ball" ref={wheelBallRef}>
          <div className="ball"></div>
        </div>
      </div>
      
      {getResultDisplay()}
    </div>
  );
}
