import React from 'react';

interface GameOverOverlayProps {
  score: number;
  onRestart: () => void;
}

export const GameOverOverlay: React.FC<GameOverOverlayProps> = ({ score, onRestart }) => {
  return (
    <div className="game-over-overlay">
      <div className="game-over-box">
        <h2>Game Over!</h2>
        <p>Your score: {score}</p>
        <button onClick={onRestart} className="btn-2048">Try Again</button>
      </div>
    </div>
  );
};
