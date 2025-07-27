import React, { useState } from 'react';
import { GameBoard } from './GameBoard';
import { PlayerStats } from './PlayerStats';
import { GameControls } from './GameControls';
import { useSocietyGame } from '../logic/useSocietyGame';
import type { Difficulty } from '../types/GameTypes';
import '../styles/SocietyOfMultiphobics.css';

export const SocietyOfMultiphobics: React.FC = () => {
  const [difficulty, setDifficulty] = useState<Difficulty>('normal');
  
  const {
    gameState,
    isLoading,
    error,
    startGame,
    movePlayer,
    selectTile,
    hoverTile,
    toggleFearsVisibility,
    restartGame,
    pauseGame,
    resumeGame,
    getCurrentPlayer,
    getFearAtPosition,
    canPlayerMoveTo,
    formattedTime
  } = useSocietyGame(difficulty);

  const currentPlayer = getCurrentPlayer();

  const handleTileClick = (position: { x: number; y: number }) => {
    if (!currentPlayer || !gameState.isGameActive) return;
    
    if (canPlayerMoveTo(position)) {
      movePlayer(currentPlayer.id, position);
    } else {
      selectTile(position);
    }
  };

  const handleDifficultyChange = (newDifficulty: Difficulty) => {
    if (!gameState.isGameActive) {
      setDifficulty(newDifficulty);
    }
  };

  if (error) {
    return (
      <div className="society-game error-state">
        <div className="error-message">
          <h2>❌ Error</h2>
          <p>{error}</p>
          <button type="button" onClick={restartGame} className="retry-btn">
            🔄 Intentar de nuevo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="society-game">
      <header className="game-header">
        <h1>🎭 La Sociedad de los Multifóbicos</h1>
        <p className="game-description">
          Navega por la sala de terapia grupal evitando enfrentarte a tus miedos. 
          ¡Cada miedo que encuentres reducirá tu puntuación!
        </p>
      </header>

      <div className="game-layout">
        <aside className="game-sidebar">
          <GameControls
            gameState={gameState}
            difficulty={difficulty}
            onDifficultyChange={handleDifficultyChange}
            onStartGame={startGame}
            onRestartGame={restartGame}
            onPauseGame={pauseGame}
            onResumeGame={resumeGame}
            isLoading={isLoading}
          />
          
          {currentPlayer && (
            <PlayerStats
              player={currentPlayer}
              timeLeft={gameState.timeLeft}
              formattedTime={formattedTime}
              turnCount={gameState.turnCount}
              showFears={gameState.showFears}
              onToggleFears={toggleFearsVisibility}
            />
          )}
        </aside>

        <main className="game-main">
          {currentPlayer && (
            <GameBoard
              board={gameState.gameBoard}
              selectedTile={gameState.selectedTile}
              hoveredTile={gameState.hoveredTile}
              showFears={gameState.showFears}
              playerPosition={currentPlayer.position}
              onTileClick={handleTileClick}
              onTileHover={hoverTile}
              getFearAtPosition={getFearAtPosition}
              canMoveTo={canPlayerMoveTo}
            />
          )}

          {gameState.gamePhase === 'setup' && (
            <div className="setup-overlay">
              <div className="setup-instructions">
                <h3>🎯 Instrucciones</h3>
                <ul>
                  <li>🚶‍♂️ Muévete haciendo clic en casillas adyacentes</li>
                  <li>😨 Evita los miedos que aparecen en el tablero</li>
                  <li>⏰ Tienes tiempo limitado para sobrevivir</li>
                  <li>🏆 Gana puntos por supervivencia, pierdes por miedos</li>
                </ul>
                <p className="start-hint">
                  Selecciona una dificultad y haz clic en "Iniciar Juego" para comenzar.
                </p>
              </div>
            </div>
          )}

          {!gameState.isGameActive && gameState.gamePhase === 'playing' && (
            <div className="pause-overlay">
              <div className="pause-message">
                <h3>⏸️ Juego Pausado</h3>
                <p>Haz clic en "Continuar" para resumir el juego.</p>
              </div>
            </div>
          )}
        </main>
      </div>

      <footer className="game-footer">
        <div className="game-tips">
          <h4>💡 Consejos</h4>
          <ul>
            <li>Los miedos aparecen aleatoriamente en el tablero</li>
            <li>Puedes alternar la visibilidad de los miedos con el botón 👁️</li>
            <li>Los miedos extremos dan más penalización que los leves</li>
            <li>Planifica tu ruta para evitar las zonas peligrosas</li>
          </ul>
        </div>
      </footer>
    </div>
  );
};
