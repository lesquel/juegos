import React from 'react';
import type { Winner } from '../types';

interface ResultDisplayProps {
  winner: Winner | null;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ winner }) => {
  if (!winner) return null;

  let message = '';
  switch (winner) {
    case 'player':
      message = '¡Ganaste!';
      break;
    case 'computer':
      message = '¡Perdiste!';
      break;
    case 'tie':
      message = '¡Empate!';
      break;
  }

  return (
    <div className="result-display">
      <p>{message}</p>
    </div>
  );
};
