import React from 'react';
import { GameCanvas } from './GameCanvas';
import { GameHUD } from './GameHUD';
import { usePuzleGame } from '../logic/usePuzleGame';
import { PuzleGameLogic } from '../logic/PuzleGameLogic';
import '../styles/PuzleGame.css';

export const PuzleGame: React.FC = () => {
  const {
    gameState,
    isLoading,
    error,
    startGame,
    restartLevel,
    resetGame,
    pauseGame,
    resumeGame,
    getCurrentInstruction,
    getGameStats
  } = usePuzleGame();

  const stats = getGameStats();
  const instruction = getCurrentInstruction();

  if (error) {
    return (
      <div className="puzle-game error-state">
        <div className="error-message">
          <h2>❌ Error</h2>
          <p>{error}</p>
          <button type="button" onClick={resetGame} className="retry-btn">
            🔄 Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="puzle-game">
      <header className="game-header">
        <h1>🧩 PUZLE - Maze Escape</h1>
        <p className="game-subtitle">
          Navigate through the maze, collect coins, and find the exit before time runs out!
        </p>
      </header>

      <div className="game-container">
        <aside className="game-sidebar">
          <GameHUD
            gameState={gameState}
            instruction={instruction}
            onStartGame={startGame}
            onRestartLevel={restartLevel}
            onResetGame={resetGame}
            onPauseGame={pauseGame}
            onResumeGame={resumeGame}
            isLoading={isLoading}
          />
        </aside>

        <main className="game-main">
          <div className="canvas-wrapper">
            <GameCanvas
              gameState={gameState}
              width={PuzleGameLogic.CONFIG.CANVAS_WIDTH}
              height={PuzleGameLogic.CONFIG.CANVAS_HEIGHT}
            />
          </div>

          {gameState.gamePhase === 'setup' && (
            <div className="setup-overlay">
              <div className="setup-content">
                <h3>🎯 Welcome to PUZLE!</h3>
                <div className="game-rules">
                  <h4>How to Play:</h4>
                  <ul>
                    <li>🚶‍♂️ Use WASD or arrow keys to move</li>
                    <li>🪙 Collect all coins in each level</li>
                    <li>🚪 Reach the green exit after collecting coins</li>
                    <li>⏰ Beat the timer to complete each level</li>
                    <li>🌋 Avoid the red lava tiles</li>
                    <li>🌀 Use orange portals to pass through walls</li>
                  </ul>
                </div>
                <div className="level-info">
                  <h4>Level {gameState.level}:</h4>
                  <p>{instruction}</p>
                </div>
                <p className="start-hint">
                  Press Space or click "Start Game" to begin!
                </p>
              </div>
            </div>
          )}
        </main>
      </div>

      <footer className="game-footer">
        <div className="legend">
          <h4>Legend:</h4>
          <div className="legend-grid">
            <div className="legend-item">
              <div className="legend-color hero"></div>
              <span>Hero (You)</span>
            </div>
            <div className="legend-item">
              <div className="legend-color coin"></div>
              <span>Coin</span>
            </div>
            <div className="legend-item">
              <div className="legend-color wall"></div>
              <span>Wall</span>
            </div>
            <div className="legend-item">
              <div className="legend-color lava"></div>
              <span>Lava (Deadly)</span>
            </div>
            <div className="legend-item">
              <div className="legend-color portal"></div>
              <span>Portal</span>
            </div>
            <div className="legend-item">
              <div className="legend-color finish"></div>
              <span>Exit</span>
            </div>
          </div>
        </div>

        <div className="game-tips">
          <h4>💡 Tips:</h4>
          <ul>
            <li>Plan your route to collect coins efficiently</li>
            <li>Watch the timer - time management is key!</li>
            <li>Portals let you pass through walls in later levels</li>
            <li>Avoid lava at all costs - it's instant death</li>
            <li>The exit only opens after collecting all coins</li>
          </ul>
        </div>

        <div className="stats-summary">
          <h4>📊 Your Stats:</h4>
          <div className="stats-grid">
            <div className="stat">
              <span className="stat-label">Current Score:</span>
              <span className="stat-value">{stats.score.toLocaleString()}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Best Score:</span>
              <span className="stat-value">{stats.bestScore.toLocaleString()}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Level:</span>
              <span className="stat-value">{stats.level}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Deaths:</span>
              <span className="stat-value">{stats.deaths}</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
