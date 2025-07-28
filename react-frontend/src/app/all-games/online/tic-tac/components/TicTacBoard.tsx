import React from 'react';
import type { Board, CellValue } from '../types/TicTacTypes';

interface TicTacBoardProps {
  board: Board;
  onCellClick: (index: number) => void;
  disabled?: boolean;
}

export const TicTacBoard: React.FC<TicTacBoardProps> = ({ 
  board, 
  onCellClick, 
  disabled = false 
}) => {
  const handleCellClick = (index: number) => {
    if (!disabled && !board[index]) {
      onCellClick(index);
    }
  };

  const renderCell = (value: CellValue, index: number) => {
    return (
      <button
        key={index}
        className={`tic-tac-cell ${value ? 'filled' : ''} ${disabled ? 'disabled' : ''}`}
        onClick={() => handleCellClick(index)}
        disabled={disabled || !!value}
      >
        <span className={`cell-content ${value?.toLowerCase()}`}>
          {value}
        </span>
      </button>
    );
  };

  return (
    <div className="tic-tac-board">
      <div className="board-grid">
        {board.map((cell, index) => renderCell(cell, index))}
      </div>
    </div>
  );
};
