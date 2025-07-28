import React from 'react';
import type { GameState, Difficulty } from '../types/GameTypes';
import '../styles/GameControls.css';

interface GameControlsProps {
  gameState: GameState;
  difficulty: Difficulty;
  onDifficultyChange: (difficulty: Difficulty) => void;
  onStartGame: () => void;
  onRestartGame: () => void;
  onPauseGame: () => void;
  onResumeGame: () => void;
  isLoading: boolean;
}

const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  easy: 'Fácil',
  normal: 'Normal',
  hard: 'Difícil',
  nightmare: 'Pesadilla'
};

const DIFFICULTY_DESCRIPTIONS: Record<Difficulty, string> = {
  easy: 'Menos miedos, más tiempo',
  normal: 'Experiencia equilibrada',
  hard: 'Más miedos, menos tiempo',
  nightmare: 'Para expertos en fobias'
};

export const GameControls: React.FC<GameControlsProps> = ({
  gameState,
  difficulty,
  onDifficultyChange,
  onStartGame,
  onRestartGame,
  onPauseGame,
  onResumeGame,
  isLoading
}) => {
  const renderGamePhaseStatus = () => {
    switch (gameState.gamePhase) {
      case 'setup':
        return (
          <div className="phase-status setup">
            <span className="phase-icon">⚙️</span>
            <span>Configuración</span>
          </div>
        );
      case 'playing':
        return (
          <div className="phase-status playing">
            <span className="phase-icon">🎮</span>
            <span>Jugando</span>
          </div>
        );
      case 'finished':
        return (
          <div className="phase-status finished">
            <span className="phase-icon">🏁</span>
            <span>Finalizado</span>
          </div>
        );
      default:
        return null;
    }
  };

  const renderActionButtons = () => {
    if (gameState.gamePhase === 'setup') {
      return (
        <button
          type="button"
          className="action-btn start-btn"
          onClick={onStartGame}
          disabled={isLoading}
        >
          {isLoading ? '⏳ Iniciando...' : '🚀 Iniciar Juego'}
        </button>
      );
    }

    if (gameState.gamePhase === 'playing') {
      return (
        <div className="playing-controls">
          <button
            type="button"
            className="action-btn pause-btn"
            onClick={gameState.isGameActive ? onPauseGame : onResumeGame}
          >
            {gameState.isGameActive ? '⏸️ Pausar' : '▶️ Continuar'}
          </button>
          <button
            type="button"
            className="action-btn restart-btn"
            onClick={onRestartGame}
          >
            🔄 Reiniciar
          </button>
        </div>
      );
    }

    if (gameState.gamePhase === 'finished') {
      return (
        <button
          type="button"
          className="action-btn restart-btn"
          onClick={onRestartGame}
        >
          🎯 Nuevo Juego
        </button>
      );
    }

    return null;
  };

  return (
    <div className="game-controls">
      <div className="controls-header">
        <h3>🎛️ Controles del Juego</h3>
        {renderGamePhaseStatus()}
      </div>

      <div className="difficulty-section">
        <h4>🎯 Dificultad</h4>
        <div className="difficulty-selector">
          {(Object.keys(DIFFICULTY_LABELS) as Difficulty[]).map(diff => (
            <label 
              key={diff} 
              className="difficulty-option"
              htmlFor={`difficulty-${diff}`}
            >
              <input
                id={`difficulty-${diff}`}
                type="radio"
                name="difficulty"
                value={diff}
                checked={difficulty === diff}
                onChange={(e) => onDifficultyChange(e.target.value as Difficulty)}
                disabled={gameState.isGameActive}
              />
              <span className="difficulty-label">
                <strong>{DIFFICULTY_LABELS[diff]}</strong>
                <small>{DIFFICULTY_DESCRIPTIONS[diff]}</small>
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="actions-section">
        {renderActionButtons()}
      </div>

      <div className="game-info">
        <div className="info-item">
          <span className="info-label">Objetivo:</span>
          <span className="info-value">Sobrevive evitando los miedos</span>
        </div>
        <div className="info-item">
          <span className="info-label">Puntuación por miedo:</span>
          <span className="info-value">-10 puntos</span>
        </div>
        <div className="info-item">
          <span className="info-label">Puntuación por supervivencia:</span>
          <span className="info-value">+50 puntos</span>
        </div>
      </div>

      {gameState.gamePhase === 'finished' && (
        <div className="final-score">
          <h4>🏆 Resultado Final</h4>
          <div className="score-display">
            <span className="final-score-value">
              {gameState.players[0]?.score || 0} puntos
            </span>
          </div>
          <div className="game-summary">
            <p>
              Miedos encontrados: {gameState.players[0]?.fears.length || 0}
            </p>
            <p>
              Turnos jugados: {gameState.turnCount}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
