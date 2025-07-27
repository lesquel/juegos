import React from 'react';
import type { DiceResult } from '../types/DadosTypes';

interface DiceDisplayProps {
  dice: DiceResult[];
  isRolling: boolean;
}

export const DiceDisplay: React.FC<DiceDisplayProps> = ({ dice, isRolling }) => {
  return (
    <div className="dice-container">
      {dice.map((die, index) => (
        <div 
          key={`die-${index}-${die.value}`}
          className={`die ${isRolling ? 'rolling' : ''}`}
        >
          {isRolling ? '?' : die.face}
        </div>
      ))}
    </div>
  );
};
