import React, { useRef, useEffect, useState, useCallback } from 'react';
import { GameLogic } from '../logic/GameLogic';
import { GameProps } from '../types/GameTypes';
import '../styles/DoNotMake.css';

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;

const DoNotMakeGame: React.FC<GameProps> = ({ 
  onGameEnd,
  onLevelComplete,
  width = CANVAS_WIDTH, 
  height = CANVAS_HEIGHT,
  config = {}
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameLogicRef = useRef<GameLogic | null>(null);
  const animationIdRef = useRef<number | null>(null);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [level, setLevel] = useState<number>(1);
  const [score, setScore] = useState<number>(0);
  const [lives, setLives] = useState<number>(3);
  const [health, setHealth] = useState<number>(100);
  const [gameOver, setGameOver] = useState<boolean>(false);

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

  const handleMouseMove = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    mouseRef.current.x = event.clientX - rect.left;
    mouseRef.current.y = event.clientY - rect.top;
    
    const gameLogic = gameLogicRef.current;
    if (gameLogic) {
      gameLogic.handleMouse(mouseRef.current.x, mouseRef.current.y, mouseRef.current.down);
    }
  }, []);

  const handleMouseDown = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    mouseRef.current.down = true;
    const gameLogic = gameLogicRef.current;
    if (gameLogic) {
      gameLogic.handleMouse(mouseRef.current.x, mouseRef.current.y, true);
    }
  }, []);

  const handleMouseUp = useCallback(() => {
    mouseRef.current.down = false;
    const gameLogic = gameLogicRef.current;
    if (gameLogic) {
      gameLogic.handleMouse(mouseRef.current.x, mouseRef.current.y, false);
    }
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
    const canvas = canvasRef.current;
    if (canvas) {
      const context = canvas.getContext('2d');
      if (context) {
        gameLogic.render(context);
      }
    }
    
    // Update React state
    setLevel(state.level);
    setScore(state.score);
    setLives(state.lives);
    setHealth(state.player.health);
    setGameOver(state.gameOver);
    
    // Check for level completion (simplified logic)
    if (state.score > 0 && state.score % 1000 === 0) {
      onLevelComplete?.(state.level);
    }
    
    // Check for game end
    if (state.gameOver) {
      onGameEnd?.(state.score);
      return;
    }

    animationIdRef.current = requestAnimationFrame(gameLoop);
  }, [onGameEnd, onLevelComplete]);

  // Initialize game
  useEffect(() => {
    if (!gameStarted) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = width;
    canvas.height = height;

    const gameLogic = new GameLogic(canvas, { width, height, ...config });
    gameLogic.startGame();
    gameLogicRef.current = gameLogic;

    // Start game loop
    animationIdRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, [gameStarted, width, height, config, gameLoop]);

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

  const restartGame = () => {
    if (animationIdRef.current) {
      cancelAnimationFrame(animationIdRef.current);
    }
    setGameStarted(false);
    setGameOver(false);
    setScore(0);
    setLives(3);
    setLevel(1);
    setHealth(100);
    setTimeout(() => setGameStarted(true), 100);
  };

  return (
    <div className="do-not-make-game">
      {!gameStarted ? (
        <div className="game-start-screen">
          <h2>⚠️ Do Not Make</h2>
          <p>A mysterious game where you must survive and collect points!</p>
          <div className="controls-info">
            <p>🎮 Controls:</p>
            <p>WASD or Arrow Keys: Move</p>
            <p>Mouse: Interact</p>
            <p>Avoid red enemies, collect yellow items!</p>
          </div>
          <button onClick={startGame} className="start-button">
            Start Game
          </button>
        </div>
      ) : (
        <>
          <div className="game-hud">
            <div className="hud-item">Level: {level}</div>
            <div className="hud-item">Score: {score}</div>
            <div className="hud-item">Lives: {lives}</div>
            <div className="hud-item">
              Health: 
              <div className="health-bar">
                <div 
                  className="health-fill" 
                  style={{ width: `${Math.max(0, health)}%` }}
                />
              </div>
            </div>
          </div>
          
          <canvas
            ref={canvasRef}
            width={width}
            height={height}
            className="game-canvas"
            tabIndex={0}
            onMouseMove={handleMouseMove}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          />
          
          {gameOver && (
            <div className="game-over-screen">
              <h2>🎯 Game Over</h2>
              <p>You survived {level} levels!</p>
              <p>Final Score: {score}</p>
              <button onClick={restartGame} className="restart-button">
                Play Again
              </button>
            </div>
          )}
          
          <div className="game-controls">
            <span>🚀 Move: WASD/Arrows • Survive: Avoid red enemies • Collect: Yellow items</span>
          </div>
        </>
      )}
    </div>
  );
};

export default DoNotMakeGame;
