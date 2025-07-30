import React from 'react';

interface ScoreboardProps {
  playerScore: number;
  computerScore: number;
}

export const Scoreboard: React.FC<ScoreboardProps> = ({ playerScore, computerScore }) => {
  return (
    <div className="scoreboard">
      <div className="score">
        <h3>Tú</h3>
        <p>{playerScore}</p>
      </div>
      <div className="score">
        <h3>Computadora</h3>
        <p>{computerScore}</p>
      </div>
    </div>
  );
};
