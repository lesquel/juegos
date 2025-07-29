import React from 'react';
import type { Player, GameStatus } from '../types/TicTacTypes';

interface TicTacHeaderProps {
  currentPlayer: Player;
  statusMessage: string;
  gameStatus: GameStatus;
  playerSymbol?: Player | null;
  opponentName?: string | null;
  isOnlineMode?: boolean;
  roomCode?: string | null;
  onBack?: () => void;
}

export const TicTacHeader: React.FC<TicTacHeaderProps> = ({
  currentPlayer,
  statusMessage,
  gameStatus,
  playerSymbol,
  opponentName,
  isOnlineMode = false,
  roomCode,
  onBack
}) => {
  const getPlayerIndicator = () => {
    if (isOnlineMode && playerSymbol) {
      return (
        <div className="player-info">
          <span className="player-label">Eres:</span>
          <span className={`player-symbol ${playerSymbol.toLowerCase()}`}>
            {playerSymbol}
          </span>
          {opponentName && <span className="opponent-name">vs {opponentName}</span>}
        </div>
      );
    }
    return null;
  };

  const getStatusClass = () => {
    switch (gameStatus) {
      case 'waiting':
        return 'waiting';
      case 'playing':
        return 'playing';
      case 'finished':
        return 'finished';
      default:
        return '';
    }
  };

  return (
    <div className="tic-tac-header">
      {onBack && (
        <button
          className="back-button"
          onClick={onBack}
          aria-label="Volver"
        >
          ← Volver
        </button>
      )}

      <h1 className="game-title">Tres en Raya</h1>

      <div className="game-info">
        <div className={`status-indicator ${getStatusClass()}`}>
          <span className="status-text">{statusMessage}</span>
        </div>

        {roomCode && (
          <div className="room-info">
            <span className="room-label">Sala:</span>
            <span className="room-code">{roomCode}</span>
          </div>
        )}

        {getPlayerIndicator()}

        <div className={`current-player ${currentPlayer.toLowerCase()}`}>
          Jugador actual: <span className="player-symbol">{currentPlayer}</span>
        </div>
      </div>
    </div>
  );
};
