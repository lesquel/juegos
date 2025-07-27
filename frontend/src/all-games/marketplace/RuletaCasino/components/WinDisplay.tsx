import React from 'react';
import { RouletteGameLogic } from '../logic/RouletteGameLogic';

interface WinDisplayProps {
  message: string;
  isVisible: boolean;
  isWin: boolean;
  winnings: number;
}

export function WinDisplay({ message, isVisible, isWin, winnings }: WinDisplayProps) {
  if (!isVisible || !message) {
    return null;
  }

  const isJackpot = winnings >= 1000;
  const isBigWin = winnings >= 500;

  return (
    <div className={`win-display ${isWin ? 'win' : 'lose'} ${isJackpot ? 'jackpot' : ''}`}>
      <div className="win-display__content">
        <div className="win-display__animation">
          {isWin ? (
            <>
              {isJackpot && (
                <div className="jackpot-stars">
                  ✨🎰✨🎰✨
                </div>
              )}
              
              <div className="win-icon">
                {(() => {
                  if (isJackpot) return '🏆';
                  if (isBigWin) return '🎉';
                  return '🎊';
                })()}
              </div>
              
              <div className="win-display__message">
                {isJackpot ? '¡MEGA VICTORIA!' : '¡GANASTE!'}
              </div>
              
              <div className="win-amount">
                {RouletteGameLogic.formatCurrency(winnings)}
              </div>
              
              {isJackpot && (
                <div className="jackpot-celebration">
                  🎊 ¡INCREÍBLE GANANCIA! 🎊
                </div>
              )}
            </>
          ) : (
            <>
              <div className="lose-icon">😔</div>
              <div className="win-display__message">
                {message}
              </div>
              <div className="lose-encouragement">
                ¡El próximo giro puede ser el tuyo!
              </div>
            </>
          )}
        </div>
        
        {isWin && (
          <div className="win-display__sparkles">
            <span className="sparkle">✨</span>
            <span className="sparkle">⭐</span>
            <span className="sparkle">💫</span>
            <span className="sparkle">✨</span>
            <span className="sparkle">⭐</span>
            <span className="sparkle">💫</span>
            <span className="sparkle">🎆</span>
            <span className="sparkle">🎇</span>
          </div>
        )}
      </div>
    </div>
  );
}
