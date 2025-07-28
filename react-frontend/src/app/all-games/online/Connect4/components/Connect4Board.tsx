import React from 'react';
import type { Board, CellValue } from '../types/Connect4Types';

interface Connect4BoardProps {
  board: Board;
  onColumnClick: (column: number) => void;
  disabled?: boolean;
  winningCells?: Array<[number, number]>;
}

export const Connect4Board: React.FC<Connect4BoardProps> = ({ 
  board, 
  onColumnClick, 
  disabled = false,
  winningCells = []
}) => {
  const handleColumnClick = (column: number) => {
    if (!disabled) {
      onColumnClick(column);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent, column: number) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleColumnClick(column);
    }
  };

  const isWinningCell = (row: number, col: number): boolean => {
    return winningCells.some(([r, c]) => r === row && c === col);
  };

  const renderCell = (value: CellValue, row: number, col: number) => {
    const isWinner = isWinningCell(row, col);
    let cellClass = 'tile';
    
    if (value === 'red') {
      cellClass += ' red-piece';
    } else if (value === 'yellow') {
      cellClass += ' yellow-piece';
    }
    
    if (isWinner) {
      cellClass += ' winning-piece';
    }

    return (
      <button
        key={`${row}-${col}`}
        className={cellClass}
        onClick={() => handleColumnClick(col)}
        onKeyDown={(e) => handleKeyDown(e, col)}
        disabled={disabled}
        aria-label={`Columna ${col + 1}, Fila ${row + 1}`}
        type="button"
      />
    );
  };

  return (
    <div className="connect4-board-container">
      <div className="board" id="board">
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => 
            renderCell(cell, rowIndex, colIndex)
          )
        )}
      </div>
    </div>
  );
};
