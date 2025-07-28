import React from 'react';

interface WinDisplayProps {
  message: string;
  isVisible: boolean;
  isJackpot: boolean;
}

export function WinDisplay({ message, isVisible, isJackpot }: WinDisplayProps) {
  if (!isVisible || !message) {
    return null;
  }

  return (
    <div className={`win-display ${isJackpot ? 'win-display--jackpot' : ''}`}>
      <div className="win-display__content">
        <div className="win-display__animation">
          {isJackpot ? (
            <>
              <div className="jackpot-stars">✨💰✨💰✨</div>
              <div className="win-display__message jackpot-message">
                {message}
              </div>
              <div className="jackpot-celebration">
                🎉 ¡FELICITACIONES! 🎉
              </div>
            </>
          ) : (
            <>
              <div className="win-coins">💰💰💰</div>
              <div className="win-display__message">
                ¡GANASTE!
              </div>
              <div className="win-amount">
                {message}
              </div>
            </>
          )}
        </div>
        
        <div className="win-display__sparkles">
          <span className="sparkle">✨</span>
          <span className="sparkle">⭐</span>
          <span className="sparkle">💫</span>
          <span className="sparkle">✨</span>
          <span className="sparkle">⭐</span>
          <span className="sparkle">💫</span>
        </div>
      </div>
    </div>
  );
}
