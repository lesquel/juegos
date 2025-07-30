import React from 'react';
import type { Card } from '../types';

interface CardComponentProps {
  card: Card;
  onClick: () => void;
}

export const CardComponent: React.FC<CardComponentProps> = ({ card, onClick }) => {
  return (
    <div
      className={`card-item ${card.isFlipped || card.isMatched ? 'flipped' : ''} ${card.isMatched ? 'matched' : ''}`}
      onClick={onClick}
    >
      <div className="card-inner">
        <div className="card-face card-front">
          {card.value}
        </div>
        <div className="card-face card-back"></div>
      </div>
    </div>
  );
};
