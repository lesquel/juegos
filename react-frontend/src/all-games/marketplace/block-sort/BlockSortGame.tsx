import React, { useState } from 'react';
import { generatePuzzle, isValidMove, applyMove, checkWinCondition } from './gameLogic';
import type { Column, GameConfig, GameState } from './types';
import { GameBoard, GameInfo, WinOverlay } from './components';
import './styles/BlockSort.css';

const GAME_CONFIG: GameConfig = {
  numColumns: 8, // Increased columns
  columnCapacity: 4,
  numColors: 6, // Increased colors
};

export const BlockSortGame: React.FC = () => {
  const [columns, setColumns] = useState<Column[]>(generatePuzzle(GAME_CONFIG));
  const [selectedColumnIndex, setSelectedColumnIndex] = useState<number | null>(null);
  const [moves, setMoves] = useState(0);
  const [gameState, setGameState] = useState<GameState>('playing');

  const handleColumnClick = (columnIndex: number) => {
    if (gameState !== 'playing') return;

    if (selectedColumnIndex === null) {
      // Select a column to move from
      if (columns[columnIndex].blocks.length > 0) {
        setSelectedColumnIndex(columnIndex);
      }
    } else {
      // Attempt to move to another column
      const fromColumn = columns[selectedColumnIndex];
      const toColumn = columns[columnIndex];

      if (isValidMove(fromColumn, toColumn, GAME_CONFIG)) {
        const newColumns = applyMove(columns, selectedColumnIndex, columnIndex);
        setColumns(newColumns);
        setMoves(prev => prev + 1);
        setSelectedColumnIndex(null);

        if (checkWinCondition(newColumns, GAME_CONFIG)) {
          setGameState('won');
        }
      } else {
        // Invalid move, deselect
        setSelectedColumnIndex(null);
      }
    }
  };

  const resetGame = () => {
    setColumns(generatePuzzle(GAME_CONFIG));
    setSelectedColumnIndex(null);
    setMoves(0);
    setGameState('playing');
  };

  return (
    <div className="block-sort-container">
      <h1>Block Sort Puzzle</h1>
      <GameInfo moves={moves} onResetGame={resetGame} />
      <GameBoard
        columns={columns}
        onColumnClick={handleColumnClick}
        selectedColumnIndex={selectedColumnIndex}
      />

      {gameState === 'won' && (
        <WinOverlay moves={moves} onPlayAgain={resetGame} />
      )}
    </div>
  );
};
















