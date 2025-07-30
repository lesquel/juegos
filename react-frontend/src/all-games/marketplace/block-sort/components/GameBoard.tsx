import React from 'react';
import type { Column } from '../types';
import { ColumnComponent } from './ColumnComponent';

interface GameBoardProps {
  columns: Column[];
  onColumnClick: (index: number) => void;
  selectedColumnIndex: number | null;
}

export const GameBoard: React.FC<GameBoardProps> = ({ columns, onColumnClick, selectedColumnIndex }) => {
  return (
    <div className="game-board">
      {/* Render column containers (click targets) */}
      {columns.map((column, colIndex) => (
        <ColumnComponent
          key={column.id}
          column={column}
          onClick={() => onColumnClick(colIndex)}
          isSelected={selectedColumnIndex === colIndex}
        >
          {column.blocks.map(block => (
            <div key={block.id} className={`block ${block.color}`}></div>
          ))}
        </ColumnComponent>
      ))}
    </div>
  );
};
