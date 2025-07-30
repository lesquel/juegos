import React from 'react';

interface ScoreboardProps {
  score: number;
  bestScore: number;
  onNewGame: () => void;
}

export const Scoreboard: React.FC<ScoreboardProps> = ({ score, bestScore, onNewGame }) => {
  return (
    <div className="header-2048">
      <h1 className="title-2048">2048</h1>
      <div className="scores-container">
        <div className="score-box">SCORE <br/> {score}</div>
        <div className="score-box">BEST <br/> {bestScore}</div>
      </div>
      <button onClick={onNewGame} className="btn-2048">New Game</button>
    </div>
  );
};
