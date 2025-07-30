import React from 'react';
import { CardComponent } from './CardComponent';
import type { Card } from '../types';

interface GameBoardProps {
  cards: Card[];
  onCardClick: (index: number) => void;
}

export const GameBoard: React.FC<GameBoardProps> = ({ cards, onCardClick }) => {
  return (
    <div className="game-board">
      {cards.map((card, index) => (
        <CardComponent
          key={card.id}
          card={card}
          onClick={() => onCardClick(index)}
        />
      ))}
    </div>
  );
};
