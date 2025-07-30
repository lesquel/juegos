import React from 'react';

interface WinOverlayProps {
  moves: number;
  onPlayAgain: () => void;
}

export const WinOverlay: React.FC<WinOverlayProps> = ({ moves, onPlayAgain }) => {
  return (
    <div className="win-overlay">
      <div className="win-content">
        <h2>You Won!</h2>
        <p>Moves: {moves}</p>
        <button onClick={onPlayAgain} className="btn-play-again">Play Again</button>
      </div>
    </div>
  );
};
