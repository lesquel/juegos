import React, { useRef, useEffect, useState, useCallback } from 'react';
import { GameLogic } from '../logic/GameLogic';
import { GameProps } from '../types/GameTypes';
import '../styles/LostOnStrangerTerra.css';

const CANVAS_WIDTH = 256;
const CANVAS_HEIGHT = 224;

const LostOnStrangerTerraGame: React.FC<GameProps> = ({ 
  onGameEnd,
  width = CANVAS_WIDTH, 
  height = CANVAS_HEIGHT 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameLogicRef = useRef<GameLogic | null>(null);
  const animationIdRef = useRef<number | null>(null);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [lives, setLives] = useState<number>(3);
  const [gameOver, setGameOver] = useState<boolean>(false);

  // Input handling
  const keysRef = useRef<{ [key: string]: boolean }>({});

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    keysRef.current[event.key] = true;
    event.preventDefault();
  }, []);

  const handleKeyUp = useCallback((event: KeyboardEvent) => {
    keysRef.current[event.key] = false;
    event.preventDefault();
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
    setScore(state.score);
    setLives(state.lives);
    setGameOver(state.gameOver);
    
    // Check for game end
    if (state.gameOver) {
      onGameEnd?.(state.score);
      return;
    }

    animationIdRef.current = requestAnimationFrame(gameLoop);
  }, [onGameEnd]);

  // Initialize game
  useEffect(() => {
    if (!gameStarted) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = width;
    canvas.height = height;

    const gameLogic = new GameLogic(canvas);
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

  const restartGame = () => {
    if (animationIdRef.current) {
      cancelAnimationFrame(animationIdRef.current);
    }
    setGameOver(false);
    setScore(0);
    setLives(3);
    setGameStarted(false);
    setTimeout(() => setGameStarted(true), 100);
  };

  return (
    <div className="lost-on-stranger-terra-game">
      {!gameStarted ? (
        <div className="game-start-screen">
          <h2>Lost on Stranger Terra</h2>
          <p>Navigate through the alien landscape and avoid enemies!</p>
          <div className="controls-info">
            <p>Arrow Keys or WASD: Move</p>
            <p>Spacebar: Shoot</p>
          </div>
          <button onClick={startGame} className="start-button">
            Start Game
          </button>
        </div>
      ) : (
        <>
          <div className="game-hud">
            <div className="hud-item">Score: {score}</div>
            <div className="hud-item">Lives: {lives}</div>
          </div>
          
          <canvas
            ref={canvasRef}
            width={width}
            height={height}
            className="game-canvas"
            tabIndex={0}
          />
          
          {gameOver && (
            <div className="game-over-screen">
              <h2>Game Over</h2>
              <p>Final Score: {score}</p>
              <button onClick={restartGame} className="restart-button">
                Play Again
              </button>
            </div>
          )}
          
          <div className="game-controls">
            <span>Arrow Keys/WASD: Move • Space: Shoot</span>
          </div>
        </>
      )}
    </div>
  );
};

export default LostOnStrangerTerraGame;
