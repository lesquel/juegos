import React from 'react';
import type { Player } from '../types/Connect4Types';

interface Connect4ModalProps {
  winner: Player | 'draw' | null;
  playerColor: Player | null;
  onPlayAgain: () => void;
  onBack: () => void;
}

export const Connect4Modal: React.FC<Connect4ModalProps> = ({ 
  winner, 
  playerColor, 
  onPlayAgain, 
  onBack 
}) => {
  const getModalTitle = () => {
    if (winner === 'draw') {
      return '¡Empate!';
    } else if (winner === playerColor) {
      return '¡Ganaste!';
    } else {
      return 'Perdiste';
    }
  };

  const getModalClass = () => {
    if (winner === 'draw') return 'modal-draw';
    if (winner === playerColor) return 'modal-win';
    return 'modal-lose';
  };

  const getEmoji = () => {
    if (winner === 'draw') return '🤝';
    if (winner === playerColor) return '🎉';
    return '😢';
  };

  const getWinnerText = () => {
    if (winner === 'draw') return 'Empate';
    return winner === 'red' ? 'Rojo' : 'Amarillo';
  };

  return (
    <div className="connect4-modal-overlay">
      <div className={`connect4-modal ${getModalClass()}`}>
        <div className="modal-content">
          <div className="modal-emoji">{getEmoji()}</div>
          <h2 className="modal-title">{getModalTitle()}</h2>
          
          {winner !== 'draw' && (
            <p className="modal-subtitle">
              Ganador: <span className={`winner-color ${winner}`}>
                {getWinnerText()}
              </span>
            </p>
          )}
          
          <div className="modal-actions">
            <button 
              className="play-again-button"
              onClick={onPlayAgain}
            >
              Jugar de nuevo
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
