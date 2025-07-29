import React, { useEffect, useState } from 'react';
import { HorseRacingLogic } from '../logic/HorseRacingLogic';
import type { Horse, RaceResult } from '../types/HorseRacingTypes';

interface WinDisplayProps {
  isVisible: boolean;
  winAmount: number;
  selectedHorse: Horse | null;
  betAmount: number;
  betType: string;
  raceResults: RaceResult[];
  onClose: () => void;
}

export function WinDisplay({ 
  isVisible, 
  winAmount, 
  selectedHorse, 
  betAmount, 
  betType, 
  raceResults, 
  onClose 
}: WinDisplayProps) {
  const [animationPhase, setAnimationPhase] = useState<'enter' | 'celebrate' | 'exit'>('enter');

  useEffect(() => {
    if (!isVisible) {
      setAnimationPhase('enter');
      return;
    }

    const timer1 = setTimeout(() => {
      setAnimationPhase('celebrate');
    }, 500);

    const timer2 = setTimeout(() => {
      setAnimationPhase('exit');
    }, 3000);

    const timer3 = setTimeout(() => {
      onClose();
    }, 4000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [isVisible, onClose]);

  if (!isVisible || !selectedHorse) return null;

  const selectedHorseResult = raceResults.find(result => result.horse.id === selectedHorse.id);
  const profit = winAmount - betAmount;
  const multiplier = betAmount > 0 ? (winAmount / betAmount).toFixed(2) : '0';

  const getWinReason = () => {
    if (!selectedHorseResult) return '';
    
    switch (betType) {
      case 'win':
        return selectedHorseResult.position === 1 ? '¡TU CABALLO GANÓ LA CARRERA!' : '';
      case 'place':
        return selectedHorseResult.position <= 2 ? `¡TU CABALLO LLEGÓ EN ${selectedHorseResult.position}° LUGAR!` : '';
      case 'show':
        return selectedHorseResult.position <= 3 ? `¡TU CABALLO LLEGÓ EN ${selectedHorseResult.position}° LUGAR!` : '';
      default:
        return '';
    }
  };

  const getBetTypeDescription = () => {
    switch (betType) {
      case 'win':
        return 'Apuesta WIN ganadora';
      case 'place':
        return 'Apuesta PLACE ganadora';
      case 'show':
        return 'Apuesta SHOW ganadora';
      default:
        return 'Apuesta ganadora';
    }
  };

  const getFireworks = () => {
    return ['🎆', '🎇', '✨', '🎉', '🎊', '💥', '🌟', '⭐', '💫'];
  };

  const renderFireworks = () => {
    const fireworks = getFireworks();
    return (
      <div className="fireworks-container">
        {fireworks.map((firework, index) => (
          <div
            key={`firework-${firework}-${index}`}
            className={`firework firework-${index} ${animationPhase === 'celebrate' ? 'animate' : ''}`}
            style={{
              left: `${10 + (index * 10)}%`,
              animationDelay: `${index * 0.2}s`
            }}
          >
            {firework}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={`win-display-overlay ${animationPhase}`}>
      <div className={`win-display ${animationPhase}`}>
        {renderFireworks()}
        
        <div className="win-content">
          <div className="win-header">
            <div className="win-title">
              <span className="trophy-icon">🏆</span>
              <h1>¡FELICITACIONES!</h1>
              <span className="trophy-icon">🏆</span>
            </div>
            <div className="win-subtitle">
              {getWinReason()}
            </div>
          </div>

          <div className="winning-horse-section">
            <div className="winning-horse-details">
              <span 
                className="horse-emoji-large" 
                style={{ color: selectedHorse.color }}
              >
                {selectedHorse.emoji}
              </span>
              <div className="horse-name-large">#{selectedHorse.id} {selectedHorse.name}</div>
              {selectedHorseResult && (
                <div className="horse-position-large">
                  Posición: {selectedHorseResult.position}° - Tiempo: {selectedHorseResult.time.toFixed(2)}s
                </div>
              )}
            </div>
          </div>

          <div className="win-amounts">
            <div className="bet-details">
              <div className="bet-info">
                <span className="label">Tipo de apuesta:</span>
                <span className="value bet-type">{getBetTypeDescription()}</span>
              </div>
              <div className="bet-info">
                <span className="label">Cantidad apostada:</span>
                <span className="value bet-amount">{HorseRacingLogic.formatCurrency(betAmount)}</span>
              </div>
              <div className="bet-info">
                <span className="label">Multiplicador:</span>
                <span className="value multiplier">{multiplier}x</span>
              </div>
            </div>

            <div className="payout-section">
              <div className="total-payout">
                <span className="payout-label">TOTAL GANADO</span>
                <span className="payout-amount">
                  {HorseRacingLogic.formatCurrency(winAmount)}
                </span>
              </div>
              
              <div className="profit-amount">
                <span className="profit-label">GANANCIA NETA</span>
                <span className="profit-value">
                  +{HorseRacingLogic.formatCurrency(profit)}
                </span>
              </div>
            </div>
          </div>

          <div className="celebration-messages">
            <div className="celebration-text">
              {profit >= 1000 && (
                <div className="big-win-message">
                  🎊 ¡GRAN VICTORIA! 🎊
                </div>
              )}
              {profit >= 500 && profit < 1000 && (
                <div className="good-win-message">
                  🎉 ¡Excelente ganancia! 🎉
                </div>
              )}
              {profit < 500 && (
                <div className="small-win-message">
                  ✨ ¡Bien jugado! ✨
                </div>
              )}
            </div>

            <div className="encouragement-text">
              {winAmount >= betAmount * 5 && "¡Una apuesta perfecta!"}
              {winAmount >= betAmount * 3 && winAmount < betAmount * 5 && "¡Sigue así!"}
              {winAmount >= betAmount * 2 && winAmount < betAmount * 3 && "¡Buen ojo para los caballos!"}
              {winAmount < betAmount * 2 && "¡Cada victoria cuenta!"}
            </div>
          </div>
        </div>

        <div className="win-footer">
          <button 
            className="continue-btn"
            onClick={onClose}
            type="button"
          >
            🏁 Continuar Jugando
          </button>
        </div>

        <div className="confetti-container">
          <div className="confetti">🎊</div>
          <div className="confetti">🎉</div>
          <div className="confetti">🎊</div>
          <div className="confetti">🎉</div>
          <div className="confetti">🎊</div>
          <div className="confetti">🎉</div>
        </div>
      </div>
    </div>
  );
}
