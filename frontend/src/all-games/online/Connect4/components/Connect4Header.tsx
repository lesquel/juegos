import React from 'react';
import type { GameState } from '../types/Connect4Types';

interface Connect4HeaderProps {
  gameState: GameState;
  onBack: () => void;
}

export const Connect4Header: React.FC<Connect4HeaderProps> = ({ gameState, onBack }) => {
  const getStatusText = () => {
    if (!gameState.isConnected) {
      return 'Conectando...';
    }
    
    switch (gameState.gameStatus) {
      case 'waiting':
        return 'Esperando oponente...';
      case 'playing':
        if (gameState.currentPlayer === gameState.playerColor) {
          return 'Tu turno';
        } else {
          return 'Turno del oponente';
        }
      case 'finished':
        if (gameState.winner === 'draw') {
          return '¡Empate!';
        } else if (gameState.winner === gameState.playerColor) {
          return '¡Ganaste!';
        } else {
          return 'Perdiste';
        }
      default:
        return '';
    }
  };

  const getStatusClass = () => {
    if (!gameState.isConnected) return 'connecting';
    if (gameState.gameStatus === 'waiting') return 'waiting';
    if (gameState.gameStatus === 'finished') {
      if (gameState.winner === 'draw') return 'draw';
      if (gameState.winner === gameState.playerColor) return 'win';
      return 'lose';
    }
    return 'playing';
  };

  return (
    <div className="connect4-header">
      <button 
        className="back-button"
        onClick={onBack}
        aria-label="Volver"
      >
        ← Volver
      </button>
      
      <h1 className="game-title">Connect 4</h1>
      
      <div className="game-info">
        <div className={`status-indicator ${getStatusClass()}`}>
          <span className="status-text">{getStatusText()}</span>
        </div>
        
        {gameState.roomCode && (
          <div className="room-info">
            <span className="room-label">Sala:</span>
            <span className="room-code">{gameState.roomCode}</span>
          </div>
        )}
        
        {gameState.playerColor && (
          <div className="player-info">
            <span className="player-label">Tu color:</span>
            <span className={`player-color ${gameState.playerColor}`}>
              {gameState.playerColor === 'red' ? 'Rojo' : 'Amarillo'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
