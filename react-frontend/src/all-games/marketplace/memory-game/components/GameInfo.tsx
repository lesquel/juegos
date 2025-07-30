import React from 'react';

interface GameInfoProps {
  moves: number;
  onResetGame: () => void;
}

export const GameInfo: React.FC<GameInfoProps> = ({ moves, onResetGame }) => {
  return (
    <div className="game-info">
      <p>Moves: {moves}</p>
      <button onClick={onResetGame} className="btn-reset">Reset Game</button>
    </div>
  );
};
