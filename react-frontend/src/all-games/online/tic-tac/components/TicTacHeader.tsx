import React from 'react';
import type { GameState } from '../types/TicTacTypes';

interface TicTacHeaderProps {
  gameState: GameState;
  onBack: () => void;
}

export const TicTacHeader: React.FC<TicTacHeaderProps> = ({ gameState, onBack }) => {
  const getStatusText = () => {
    if (!gameState.isConnected) {
      return 'Conectando...';
    }
    
    switch (gameState.gameStatus) {
      case 'waiting':
        return 'Esperando oponente...';
      case 'playing':
        if (gameState.currentPlayer === gameState.playerSymbol) {
          return 'Tu turno';
        } else {
          return 'Turno del oponente';
        }
      case 'finished':
        if (gameState.winner === 'draw') {
          return '¡Empate!';
        } else if (gameState.winner === gameState.playerSymbol) {
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
      if (gameState.winner === gameState.playerSymbol) return 'win';
      return 'lose';
    }
    return 'playing';
  };

  return (
    <div className="tic-tac-header">
      <button 
        className="back-button"
        onClick={onBack}
        aria-label="Volver"
      >
        ← Volver
      </button>
      
      <h1 className="game-title">Tres en Raya</h1>
      
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
        
        {gameState.playerSymbol && (
          <div className="player-info">
            <span className="player-label">Eres:</span>
            <span className={`player-symbol ${gameState.playerSymbol.toLowerCase()}`}>
              {gameState.playerSymbol}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
