import React, { useRef, useEffect, useState, useCallback } from 'react';
import { GameLogic } from '../logic/GameLogic';
import { GameProps } from '../types/GameTypes';
import '../styles/Golfrog.css';

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;

const GolfrogGame: React.FC<GameProps> = ({ 
  onGameEnd,
  onLevelComplete,
  width = CANVAS_WIDTH, 
  height = CANVAS_HEIGHT 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameLogicRef = useRef<GameLogic | null>(null);
  const animationIdRef = useRef<number | null>(null);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [currentLevel, setCurrentLevel] = useState<number>(1);
  const [score, setScore] = useState<number>(0);
  const [jumps, setJumps] = useState<number>(0);
  const [levelComplete, setLevelComplete] = useState<boolean>(false);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [stars, setStars] = useState<number>(0);

  // Input handling
  const keysRef = useRef<{ [key: string]: boolean }>({});
  const mouseRef = useRef<{ x: number; y: number; down: boolean }>({ x: 0, y: 0, down: false });

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    keysRef.current[event.key] = true;
    event.preventDefault();
  }, []);

  const handleKeyUp = useCallback((event: KeyboardEvent) => {
    keysRef.current[event.key] = false;
    event.preventDefault();
  }, []);

  const handleMouseDown = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    mouseRef.current = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
      down: true
    };
    
    const gameLogic = gameLogicRef.current;
    if (gameLogic) {
      gameLogic.handleMouseInput(mouseRef.current, true);
    }
  }, []);

  const handleMouseMove = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    mouseRef.current.x = event.clientX - rect.left;
    mouseRef.current.y = event.clientY - rect.top;
    
    const gameLogic = gameLogicRef.current;
    if (gameLogic && mouseRef.current.down) {
      gameLogic.handleMouseInput(mouseRef.current, true);
    }
  }, []);

  const handleMouseUp = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    const gameLogic = gameLogicRef.current;
    if (gameLogic) {
      gameLogic.handleMouseInput(mouseRef.current, false);
    }
    mouseRef.current.down = false;
  }, []);

  // Game loop
  const gameLoop = useCallback(() => {
    const gameLogic = gameLogicRef.current;
    if (!gameLogic) return;

    const state = gameLogic.getState();
    
    // Handle input
    gameLogic.handleInput(keysRef.current);
    
    // Update game
    gameLogic.update();
    
    // Render game
    gameLogic.render();
    
    // Update React state
    setCurrentLevel(state.currentLevel);
    setScore(state.score);
    setJumps(state.jumps);
    setLevelComplete(state.levelComplete);
    setGameOver(state.gameOver);
    setStars(state.stars);
    
    // Check for level completion
    if (state.levelComplete && !levelComplete) {
      onLevelComplete?.(state.currentLevel, state.stars);
    }
    
    // Check for game end
    if (state.gameOver) {
      onGameEnd?.(state.score);
      return;
    }

    animationIdRef.current = requestAnimationFrame(gameLoop);
  }, [onGameEnd, onLevelComplete, levelComplete]);

  // Initialize game
  useEffect(() => {
    if (!gameStarted) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = width;
    canvas.height = height;

    const gameLogic = new GameLogic(canvas);
    gameLogic.startGame();
    gameLogicRef.current = gameLogic;

    // Start game loop
    animationIdRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, [gameStarted, width, height, gameLoop]);

  // Event listeners
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  const startGame = () => {
    setGameStarted(true);
  };

  const nextLevel = () => {
    const gameLogic = gameLogicRef.current;
    if (gameLogic) {
      gameLogic.nextLevel();
      setLevelComplete(false);
    }
  };

  const restartLevel = () => {
    const gameLogic = gameLogicRef.current;
    if (gameLogic) {
      gameLogic.resetLevel();
      setLevelComplete(false);
    }
  };

  const restartGame = () => {
    if (animationIdRef.current) {
      cancelAnimationFrame(animationIdRef.current);
    }
    setGameStarted(false);
    setGameOver(false);
    setLevelComplete(false);
    setScore(0);
    setJumps(0);
    setCurrentLevel(1);
    setStars(0);
    setTimeout(() => setGameStarted(true), 100);
  };

  return (
    <div className="golfrog-game">
      {!gameStarted ? (
        <div className="game-start-screen">
          <h2>🐸 Golfrog</h2>
          <p>Help the frog reach the hole using as few jumps as possible!</p>
          <div className="controls-info">
            <p>🎮 Controls:</p>
            <p>Arrow Keys or WASD: Move & Jump</p>
            <p>Mouse: Click and drag to launch</p>
            <p>Space: Jump</p>
          </div>
          <button onClick={startGame} className="start-button">
            Start Game
          </button>
        </div>
      ) : (
        <>
          <div className="game-hud">
            <div className="hud-item">Level: {currentLevel}</div>
            <div className="hud-item">Score: {score}</div>
            <div className="hud-item">Jumps: {jumps}</div>
          </div>
          
          <canvas
            ref={canvasRef}
            width={width}
            height={height}
            className="game-canvas"
            tabIndex={0}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          />
          
          {levelComplete && (
            <div className="level-complete-screen">
              <h2>🎉 Level Complete!</h2>
              <div className="stars-display">
                {'★'.repeat(stars)}{'☆'.repeat(3 - stars)}
              </div>
              <p>Score: {score}</p>
              <div className="level-buttons">
                <button onClick={nextLevel} className="next-button">
                  Next Level
                </button>
                <button onClick={restartLevel} className="retry-button">
                  Retry Level
                </button>
              </div>
            </div>
          )}
          
          {gameOver && (
            <div className="game-over-screen">
              <h2>🏆 Game Complete!</h2>
              <p>Congratulations! You completed all levels!</p>
              <p>Final Score: {score}</p>
              <button onClick={restartGame} className="restart-button">
                Play Again
              </button>
            </div>
          )}
          
          <div className="game-controls">
            <span>🎯 Drag to aim and launch • Arrow keys to move • Space to jump</span>
          </div>
        </>
      )}
    </div>
  );
};

export default GolfrogGame;
