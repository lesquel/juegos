import React from 'react';
import type { GameState } from '../types/GameTypes';
import '../styles/GameHUD.css';

interface GameHUDProps {
  gameState: GameState;
  instruction: string;
  onStartGame: () => void;
  onRestartLevel: () => void;
  onResetGame: () => void;
  onPauseGame: () => void;
  onResumeGame: () => void;
  isLoading: boolean;
}

export const GameHUD: React.FC<GameHUDProps> = ({
  gameState,
  instruction,
  onStartGame,
  onRestartLevel,
  onResetGame,
  onPauseGame,
  onResumeGame,
  isLoading
}) => {
  const getPhaseDisplay = () => {
    switch (gameState.gamePhase) {
      case 'setup':
        return { icon: '⚙️', text: 'Setup', color: '#f6ad55' };
      case 'playing':
        return { icon: '🎮', text: 'Playing', color: '#68d391' };
      case 'dead':
        return { icon: '💀', text: 'Game Over', color: '#fc8181' };
      case 'finished':
        return { icon: '🏆', text: 'Complete!', color: '#63b3ed' };
      default:
        return { icon: '❓', text: 'Unknown', color: '#e2e8f0' };
    }
  };

  const phase = getPhaseDisplay();
  const progressPercentage = gameState.totalCoins > 0 
    ? Math.round((gameState.coinsCollected / gameState.totalCoins) * 100)
    : 100;

  const renderActionButtons = () => {
    if (gameState.gamePhase === 'setup') {
      return (
        <button
          type="button"
          className="hud-btn start-btn"
          onClick={onStartGame}
          disabled={isLoading}
        >
          {isLoading ? '⏳ Starting...' : '🚀 Start Game'}
        </button>
      );
    }

    if (gameState.gamePhase === 'playing') {
      return (
        <div className="hud-btn-group">
          <button
            type="button"
            className="hud-btn pause-btn"
            onClick={gameState.isPaused ? onResumeGame : onPauseGame}
          >
            {gameState.isPaused ? '▶️ Resume' : '⏸️ Pause'}
          </button>
          <button
            type="button"
            className="hud-btn restart-btn"
            onClick={onRestartLevel}
          >
            🔄 Restart Level
          </button>
        </div>
      );
    }

    if (gameState.gamePhase === 'dead') {
      return (
        <div className="hud-btn-group">
          <button
            type="button"
            className="hud-btn retry-btn"
            onClick={onRestartLevel}
          >
            🔄 Try Again
          </button>
          <button
            type="button"
            className="hud-btn reset-btn"
            onClick={onResetGame}
          >
            🏠 Main Menu
          </button>
        </div>
      );
    }

    if (gameState.gamePhase === 'finished') {
      return (
        <button
          type="button"
          className="hud-btn new-game-btn"
          onClick={onResetGame}
        >
          🎯 New Game
        </button>
      );
    }

    return null;
  };

  return (
    <div className="game-hud">
      {/* Top Stats Bar */}
      <div className="hud-top">
        <div className="hud-stats">
          <div className="stat-item level">
            <span className="stat-label">Level</span>
            <span className="stat-value">{gameState.level}</span>
          </div>
          
          <div className="stat-item score">
            <span className="stat-label">Score</span>
            <span className="stat-value">{gameState.score.toLocaleString()}</span>
          </div>
          
          <div className="stat-item best-score">
            <span className="stat-label">Best</span>
            <span className="stat-value">{gameState.bestScore.toLocaleString()}</span>
          </div>
          
          <div className="stat-item deaths">
            <span className="stat-label">Deaths</span>
            <span className="stat-value">{gameState.deaths}</span>
          </div>
        </div>

        <div className="phase-indicator" style={{ borderColor: phase.color }}>
          <span className="phase-icon">{phase.icon}</span>
          <span className="phase-text" style={{ color: phase.color }}>
            {phase.text}
          </span>
        </div>
      </div>

      {/* Timer and Progress */}
      <div className="hud-middle">
        <div className="timer-container">
          <div className="timer-label">Time Left</div>
          <div className={`timer-value ${gameState.timeLeft < 3 ? 'timer-warning' : ''}`}>
            {gameState.timeLeft.toFixed(1)}s
          </div>
          <div className="timer-bar">
            <div 
              className="timer-fill"
              style={{ 
                width: `${(gameState.timeLeft / 13) * 100}%`,
                backgroundColor: gameState.timeLeft < 3 ? '#fc8181' : '#68d391'
              }}
            />
          </div>
        </div>

        <div className="progress-container">
          <div className="progress-label">
            Coins: {gameState.coinsCollected}/{gameState.totalCoins}
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <div className="progress-percentage">{progressPercentage}%</div>
        </div>
      </div>

      {/* Instruction */}
      <div className="hud-instruction">
        <div className="instruction-text">{instruction}</div>
      </div>

      {/* Action Buttons */}
      <div className="hud-actions">
        {renderActionButtons()}
      </div>

      {/* Controls Help */}
      <div className="hud-controls">
        <div className="controls-title">Controls</div>
        <div className="controls-grid">
          <div className="control-item">
            <span className="control-key">WASD / Arrows</span>
            <span className="control-desc">Move</span>
          </div>
          <div className="control-item">
            <span className="control-key">Space</span>
            <span className="control-desc">
              {(() => {
                if (gameState.gamePhase === 'setup') return 'Start';
                if (gameState.gamePhase === 'dead') return 'Retry';
                return 'Action';
              })()}
            </span>
          </div>
          <div className="control-item">
            <span className="control-key">Escape</span>
            <span className="control-desc">Pause</span>
          </div>
        </div>
      </div>

      {/* Pause Overlay */}
      {gameState.isPaused && (
        <div className="pause-overlay">
          <div className="pause-content">
            <h3>⏸️ Game Paused</h3>
            <p>Press Escape or click Resume to continue</p>
          </div>
        </div>
      )}

      {/* Game Over Overlay */}
      {gameState.gamePhase === 'dead' && (
        <div className="game-over-overlay">
          <div className="game-over-content">
            <h3>💀 Game Over!</h3>
            <div className="game-over-stats">
              <p>Level: {gameState.level}</p>
              <p>Score: {gameState.score.toLocaleString()}</p>
              <p>Coins Collected: {gameState.coinsCollected}/{gameState.totalCoins}</p>
            </div>
            <p>Press Space to try again</p>
          </div>
        </div>
      )}

      {/* Victory Overlay */}
      {gameState.gamePhase === 'finished' && (
        <div className="victory-overlay">
          <div className="victory-content">
            <h3>🏆 Congratulations!</h3>
            <div className="victory-message">
              <p>You've completed all levels!</p>
              <p>You've defeated your Triskaidekaphobia!</p>
            </div>
            <div className="final-stats">
              <p>Final Score: <strong>{gameState.score.toLocaleString()}</strong></p>
              <p>Total Deaths: <strong>{gameState.deaths}</strong></p>
              {gameState.score > gameState.bestScore && (
                <p className="new-record">🎉 New Best Score!</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
