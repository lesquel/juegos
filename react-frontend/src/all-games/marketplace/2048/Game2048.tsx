import React, { useState, useEffect } from 'react';
import { initGrid, moveLeft, moveRight, moveUp, moveDown, addRandomTile, isGameOver } from './gameLogic';
import type { Grid } from './types';
import { GridComponent, TileComponent, Scoreboard, GameOverOverlay } from './components';
import { useSwipe } from './hooks/useSwipe';
import './styles/2048.css';

export const Game2048: React.FC = () => {
  const [grid, setGrid] = useState<Grid>(initGrid());
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(() => Number(localStorage.getItem('bestScore2048')) || 0);
  const [gameOver, setGameOver] = useState(false);

  const handleMove = (direction: 'up' | 'down' | 'left' | 'right') => {
    if (gameOver) return;

    let result;
    switch (direction) {
      case 'up':
        result = moveUp(grid);
        break;
      case 'down':
        result = moveDown(grid);
        break;
      case 'left':
        result = moveLeft(grid);
        break;
      case 'right':
        result = moveRight(grid);
        break;
    }

    if (result.moved) {
      const newGridWithTile = addRandomTile(result.newGrid);
      setGrid(newGridWithTile);
      setScore(prev => prev + result.score);
      if (isGameOver(newGridWithTile)) {
        setGameOver(true);
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    const keyMap = {
        ArrowUp: 'up',
        ArrowDown: 'down',
        ArrowLeft: 'left',
        ArrowRight: 'right',
    } as const;

    const direction = keyMap[e.key as keyof typeof keyMap];
    if (direction) {
        e.preventDefault();
        handleMove(direction);
    }
  };

  const swipeHandlers = useSwipe({
    onSwipedLeft: () => handleMove('left'),
    onSwipedRight: () => handleMove('right'),
    onSwipedUp: () => handleMove('up'),
    onSwipedDown: () => handleMove('down'),
  });

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [grid, gameOver]);

  useEffect(() => {
    if (score > bestScore) {
      setBestScore(score);
      localStorage.setItem('bestScore2048', String(score));
    }
  }, [score, bestScore]);

  const resetGame = () => {
    setGrid(initGrid());
    setScore(0);
    setGameOver(false);
  };

  return (
    <div className="game-container-2048" {...swipeHandlers}>
      <Scoreboard score={score} bestScore={bestScore} onNewGame={resetGame} />
      <div className="grid-container">
        <GridComponent />
        <div className="tiles-container">
          {grid.map((row, i) =>
            row.map((tile, j) =>
              tile ? <TileComponent key={tile.id} tile={tile} row={i} col={j} /> : null
            )
          )}
        </div>
      </div>
      {gameOver && <GameOverOverlay score={score} onRestart={resetGame} />}
    </div>
  );
};
