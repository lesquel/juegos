import React from 'react';
import type { GameStatus } from '../types/PongTypes';

interface PongModalProps {
  gameStatus: GameStatus;
  winner: 'player1' | 'player2' | null;
  playerNumber: number | null;
  onRestartGame: () => void;
  onLeaveGame: () => void;
  onClose: () => void;
}

export const PongModal: React.FC<PongModalProps> = ({
  gameStatus,
  winner,
  playerNumber,
  onRestartGame,
  onLeaveGame,
  onClose
}) => {
  if (gameStatus !== 'finished' && gameStatus !== 'paused') {
    return null;
  }

  const getModalTitle = () => {
    if (gameStatus === 'paused') {
      return 'Juego Pausado';
    }
    
    if (gameStatus === 'finished' && winner) {
      const winnerText = winner === 'player1' ? 'Jugador 1' : 'Jugador 2';
      const isCurrentPlayerWinner = 
        (winner === 'player1' && playerNumber === 1) ||
        (winner === 'player2' && playerNumber === 2);
      
      return isCurrentPlayerWinner ? '¡Ganaste!' : `Ganó ${winnerText}`;
    }
    
    return 'Juego Terminado';
  };

  const getModalMessage = () => {
    if (gameStatus === 'paused') {
      return 'El juego ha sido pausado. Puedes continuar cuando estés listo.';
    }
    
    if (gameStatus === 'finished' && winner) {
      const isCurrentPlayerWinner = 
        (winner === 'player1' && playerNumber === 1) ||
        (winner === 'player2' && playerNumber === 2);
      
      if (isCurrentPlayerWinner) {
        return '¡Felicitaciones! Has ganado la partida.';
      } else {
        return 'El otro jugador ha ganado esta vez. ¡Mejor suerte la próxima!';
      }
    }
    
    return 'La partida ha terminado.';
  };

  const getModalClass = () => {
    if (gameStatus === 'paused') return 'pong-modal paused';
    if (gameStatus === 'finished' && winner) {
      const isCurrentPlayerWinner = 
        (winner === 'player1' && playerNumber === 1) ||
        (winner === 'player2' && playerNumber === 2);
      return `pong-modal ${isCurrentPlayerWinner ? 'winner' : 'loser'}`;
    }
    return 'pong-modal';
  };

  return (
    <div className="pong-modal-overlay">
      <div className={getModalClass()}>
        <div className="modal-header">
          <h2 className="modal-title">{getModalTitle()}</h2>
          <button 
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Cerrar"
          >
            ×
          </button>
        </div>
        
        <div className="modal-content">
          <p className="modal-message">{getModalMessage()}</p>
          
          {gameStatus === 'finished' && winner && (
            <div className="game-stats">
              <div className="winner-info">
                <span className="winner-label">Ganador:</span>
                <span className={`winner-name ${winner}`}>
                  {winner === 'player1' ? 'Jugador 1' : 'Jugador 2'}
                </span>
              </div>
            </div>
          )}
        </div>
        
        <div className="modal-actions">
          {gameStatus === 'paused' && (
            <>
              <button 
                className="btn btn-primary"
                onClick={onClose}
              >
                Continuar
              </button>
              <button 
                className="btn btn-secondary"
                onClick={onLeaveGame}
              >
                Salir del Juego
              </button>
            </>
          )}
          
          {gameStatus === 'finished' && (
            <>
              <button 
                className="btn btn-primary"
                onClick={onRestartGame}
              >
                Jugar de Nuevo
              </button>
              <button 
                className="btn btn-secondary"
                onClick={onLeaveGame}
              >
                Salir del Juego
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
