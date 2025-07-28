import React, { useRef, useEffect, useState, useCallback } from 'react';
import { GameLogic } from '../logic/GameLogic';
import { GameProps } from '../types/GameTypes';
import '../styles/Squad13.css';

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;

const Squad13Game: React.FC<GameProps> = ({ 
  onGameEnd,
  onMissionComplete,
  width = CANVAS_WIDTH, 
  height = CANVAS_HEIGHT 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameLogicRef = useRef<GameLogic | null>(null);
  const animationIdRef = useRef<number | null>(null);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [currentMission, setCurrentMission] = useState<number>(1);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [missionComplete, setMissionComplete] = useState<boolean>(false);
  const [inCombat, setInCombat] = useState<boolean>(false);

  // Input handling
  const keysRef = useRef<{ [key: string]: boolean }>({});
  const mouseRef = useRef<{ x: number; y: number; down: boolean }>({ x: 0, y: 0, down: false });

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    keysRef.current[event.key] = true;
    
    // Special handling for game start
    if (event.key === 'Enter' && !gameStarted) {
      setGameStarted(true);
    }
    
    event.preventDefault();
  }, [gameStarted]);

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
        gameLogic.render(context, canvas.width, canvas.height);
      }
    }
    
    // Update React state
    setCurrentMission(state.currentMission);
    setGameOver(state.gameOver);
    setMissionComplete(state.missionComplete);
    setInCombat(state.inCombat);
    
    // Check for mission completion
    if (state.missionComplete && !missionComplete) {
      onMissionComplete?.(state.currentMission);
    }
    
    // Check for game end
    if (state.gameOver) {
      const success = state.currentMission >= state.totalMissions;
      onGameEnd?.(success);
      return;
    }

    animationIdRef.current = requestAnimationFrame(gameLoop);
  }, [onGameEnd, onMissionComplete, missionComplete]);

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

  const restartGame = () => {
    if (animationIdRef.current) {
      cancelAnimationFrame(animationIdRef.current);
    }
    setGameStarted(false);
    setGameOver(false);
    setMissionComplete(false);
    setCurrentMission(1);
    setInCombat(false);
    setTimeout(() => setGameStarted(true), 100);
  };

  return (
    <div className="squad13-game">
      {!gameStarted ? (
        <div className="game-start-screen">
          <h2>⚔️ SQUAD 13</h2>
          <div className="title-subtitle">
            <p>TACTICAL COMBAT SIMULATION</p>
          </div>
          
          <div className="mission-briefing">
            <h3>🎯 MISSION BRIEFING</h3>
            <p>Command a 3-person elite squad through dangerous operations.</p>
            <p>Use tactical positioning and teamwork to complete objectives.</p>
          </div>
          
          <div className="controls-info">
            <h4>🎮 CONTROLS:</h4>
            <div className="control-grid">
              <div className="control-item">
                <span className="key">1-3</span>
                <span>Select Squad Member</span>
              </div>
              <div className="control-item">
                <span className="key">WASD</span>
                <span>Move Selected Unit</span>
              </div>
              <div className="control-item">
                <span className="key">SPACE</span>
                <span>End Turn (Combat)</span>
              </div>
              <div className="control-item">
                <span className="key">I</span>
                <span>Toggle Inventory</span>
              </div>
              <div className="control-item">
                <span className="key">MOUSE</span>
                <span>Select Units/Tiles</span>
              </div>
              <div className="control-item">
                <span className="key">ENTER</span>
                <span>Continue/Confirm</span>
              </div>
            </div>
          </div>
          
          <div className="start-prompt">
            <p className="blink">Press ENTER to begin mission</p>
          </div>
        </div>
      ) : (
        <>
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
          
          <div className="game-status">
            <div className="status-item">
              <span className="status-label">Mission:</span>
              <span className="status-value">{currentMission}</span>
            </div>
            
            {inCombat && (
              <div className="combat-indicator">
                <span className="combat-text">⚔️ COMBAT</span>
              </div>
            )}
            
            {missionComplete && (
              <div className="mission-complete">
                <span>✅ MISSION COMPLETE</span>
              </div>
            )}
          </div>
          
          {gameOver && (
            <div className="game-over-screen">
              <h2>
                {currentMission >= 10 ? '🏆 MISSION ACCOMPLISHED' : '💀 MISSION FAILED'}
              </h2>
              <div className="game-over-content">
                <p>
                  {currentMission >= 10 
                    ? 'Squad 13 has successfully completed all operations!' 
                    : 'Squad 13 has been compromised. Mission aborted.'}
                </p>
                <p>Missions Completed: {currentMission - 1}/10</p>
                
                <div className="final-stats">
                  <h3>📊 OPERATION SUMMARY</h3>
                  <p>Classification: {currentMission >= 10 ? 'SUCCESS' : 'FAILURE'}</p>
                  <p>Status: {currentMission >= 10 ? 'All objectives achieved' : 'Squad casualties exceeded acceptable limits'}</p>
                </div>
              </div>
              
              <button onClick={restartGame} className="restart-button">
                🔄 NEW OPERATION
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Squad13Game;
