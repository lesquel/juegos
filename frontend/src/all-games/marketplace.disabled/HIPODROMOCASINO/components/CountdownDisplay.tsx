import React, { useEffect, useState } from 'react';

interface CountdownDisplayProps {
  isVisible: boolean;
  startNumber: number;
  message?: string;
  onComplete: () => void;
  onCountdownChange?: (currentNumber: number) => void;
}

export function CountdownDisplay({ 
  isVisible, 
  startNumber, 
  message = 'La carrera comenzará en...', 
  onComplete,
  onCountdownChange 
}: CountdownDisplayProps) {
  const [currentNumber, setCurrentNumber] = useState(startNumber);
  const [animationClass, setAnimationClass] = useState('');

  useEffect(() => {
    if (!isVisible) {
      setCurrentNumber(startNumber);
      setAnimationClass('');
      return;
    }

    if (currentNumber > 0) {
      setAnimationClass('countdown-animate');
      
      const timer = setTimeout(() => {
        const nextNumber = currentNumber - 1;
        setCurrentNumber(nextNumber);
        onCountdownChange?.(nextNumber);
        setAnimationClass('');
      }, 1000);

      return () => clearTimeout(timer);
    } else {
      // Countdown finished
      const finishTimer = setTimeout(() => {
        onComplete();
      }, 500);

      return () => clearTimeout(finishTimer);
    }
  }, [currentNumber, isVisible, onComplete, onCountdownChange]);

  useEffect(() => {
    if (isVisible) {
      setCurrentNumber(startNumber);
      onCountdownChange?.(startNumber);
    }
  }, [isVisible, startNumber, onCountdownChange]);

  if (!isVisible) return null;

  const getCountdownIcon = () => {
    if (currentNumber === 0) return '🏁';
    if (currentNumber === 1) return '🚨';
    if (currentNumber === 2) return '⚡';
    if (currentNumber === 3) return '⭐';
    return '🕐';
  };

  const getCountdownColor = () => {
    if (currentNumber === 0) return '#00ff88';
    if (currentNumber === 1) return '#ff4444';
    if (currentNumber === 2) return '#ffaa00';
    if (currentNumber === 3) return '#00ccff';
    return '#ffffff';
  };

  const getCountdownText = () => {
    if (currentNumber === 0) return '¡CORRAN!';
    return currentNumber.toString();
  };

  const getCountdownSize = () => {
    if (currentNumber === 0) return 'countdown-go';
    if (currentNumber === 1) return 'countdown-urgent';
    return 'countdown-normal';
  };

  return (
    <div className={`countdown-overlay ${currentNumber === 0 ? 'countdown-complete' : ''}`}>
      <div className="countdown-container">
        <div className="countdown-background">
          <div className="countdown-pulse"></div>
        </div>
        
        <div className="countdown-content">
          <div className="countdown-message">
            {currentNumber > 0 ? message : ''}
          </div>
          
          <div 
            className={`countdown-number ${getCountdownSize()} ${animationClass}`}
            style={{ color: getCountdownColor() }}
          >
            <div className="countdown-icon">
              {getCountdownIcon()}
            </div>
            <div className="countdown-text">
              {getCountdownText()}
            </div>
          </div>
          
          {currentNumber > 0 && (
            <div className="countdown-subtitle">
              {(() => {
                switch(currentNumber) {
                  case 3: return 'Prepárense...';
                  case 2: return 'Listos...';
                  case 1: return '¡Ya casi!';
                  default: return 'Preparando carrera...';
                }
              })()}
            </div>
          )}
          
          {currentNumber === 0 && (
            <div className="race-start-effects">
              <div className="speed-lines">
                <div className="speed-line"></div>
                <div className="speed-line"></div>
                <div className="speed-line"></div>
                <div className="speed-line"></div>
                <div className="speed-line"></div>
              </div>
              <div className="start-particles">
                <div className="particle">💨</div>
                <div className="particle">⚡</div>
                <div className="particle">💨</div>
                <div className="particle">⚡</div>
                <div className="particle">💨</div>
              </div>
            </div>
          )}
        </div>
        
        <div className="countdown-progress">
          <div 
            className="countdown-progress-bar"
            style={{ 
              width: `${((startNumber - currentNumber) / startNumber) * 100}%`,
              backgroundColor: getCountdownColor()
            }}
          ></div>
        </div>
      </div>
    </div>
  );
}
