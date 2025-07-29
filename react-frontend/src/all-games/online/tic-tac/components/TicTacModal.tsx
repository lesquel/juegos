import React from 'react';
import type { Player } from '../types/TicTacTypes';

interface TicTacModalProps {
  winner: Player | 'draw' | null;
  playerSymbol: Player | null;
  onPlayAgain: () => void;
  onBack: () => void;
  isOnlineMode?: boolean;
}

export const TicTacModal: React.FC<TicTacModalProps> = ({ 
  winner, 
  playerSymbol, 
  onPlayAgain, 
  onBack,
  isOnlineMode = false
}) => {
  const getModalTitle = () => {
    if (winner === 'draw') {
      return '¡Empate!';
    } else if (winner === playerSymbol) {
      return '¡Ganaste!';
    } else {
      return 'Perdiste';
    }
  };

  const getModalClass = () => {
    if (winner === 'draw') return 'modal-draw';
    if (winner === playerSymbol) return 'modal-win';
    return 'modal-lose';
  };

  const getEmoji = () => {
    if (winner === 'draw') return '🤝';
    if (winner === playerSymbol) return '🎉';
    return '😢';
  };

  const getPlayAgainText = () => {
    return isOnlineMode ? 'Nueva partida' : 'Jugar de nuevo';
  };

  return (
    <div className="tic-tac-modal-overlay">
      <div className={`tic-tac-modal ${getModalClass()}`}>
        <div className="modal-content">
          <div className="modal-emoji">{getEmoji()}</div>
          <h2 className="modal-title">{getModalTitle()}</h2>
          
          {winner !== 'draw' && (
            <p className="modal-subtitle">
              Ganador: <span className="winner-symbol">{winner}</span>
            </p>
          )}
          
          {isOnlineMode && (
            <p className="modal-info">
              {winner === 'draw' ? 
                'Ambos jugadores empataron' : 
                `El jugador ${winner} ha ganado la partida`
              }
            </p>
          )}
          
          <div className="modal-actions">
            <button 
              className="play-again-button"
              onClick={onPlayAgain}
            >
              {getPlayAgainText()}
            </button>
            
            <button 
              className="back-button"
              onClick={onBack}
            >
              Volver
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
