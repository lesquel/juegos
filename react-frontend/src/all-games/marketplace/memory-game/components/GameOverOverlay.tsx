import React from 'react';

interface GameOverOverlayProps {
  moves: number;
  onPlayAgain: () => void;
}

export const GameOverOverlay: React.FC<GameOverOverlayProps> = ({ moves, onPlayAgain }) => {
  return (
    <div className="game-over-overlay">
      <div className="game-over-content">
        <h2>Game Over!</h2>
        <p>You completed the game in {moves} moves.</p>
        <button onClick={onPlayAgain} className="btn-play-again">Play Again</button>
      </div>
    </div>
  );
};
