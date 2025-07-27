import React from 'react';
import type { Connection, GameStatus } from '../types/PongTypes';

interface PongHeaderProps {
  roomCode: string | null;
  connected: boolean;
  playerNumber: number | null;
  gameStatus: GameStatus;
  connection: Connection | null;
  onJoinGame: (roomCode: string) => void;
  onCreateGame: () => void;
  onLeaveGame: () => void;
}

export const PongHeader: React.FC<PongHeaderProps> = ({
  roomCode,
  connected,
  playerNumber,
  gameStatus,
  connection,
  onJoinGame,
  onCreateGame,
  onLeaveGame
}) => {
  const [inputRoomCode, setInputRoomCode] = React.useState('');

  const handleJoinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputRoomCode.trim()) {
      onJoinGame(inputRoomCode.trim());
      setInputRoomCode('');
    }
  };

  const getConnectionStatusClass = () => {
    if (!connected) return 'status-disconnected';
    if (gameStatus === 'waiting') return 'status-waiting';
    return 'status-playing';
  };

  const getConnectionStatusText = () => {
    if (!connected) return 'Desconectado';
    if (gameStatus === 'waiting') return 'Esperando jugador';
    return 'Jugando';
  };

  const getPlayerInfo = () => {
    if (!connected || !playerNumber) return null;
    
    const isPlayer1 = playerNumber === 1;
    return (
      <div className={`player-info ${isPlayer1 ? 'player-1' : 'player-2'}`}>
        <span className="player-label">
          {isPlayer1 ? 'Jugador 1 (Izquierda)' : 'Jugador 2 (Derecha)'}
        </span>
        <span className="controls-hint">
          {isPlayer1 ? 'Controles: W/S' : 'Controles: ↑/↓'}
        </span>
      </div>
    );
  };

  return (
    <div className="pong-header">
      <div className="game-title">
        <h1>Pong Online</h1>
        <div className={`connection-status ${getConnectionStatusClass()}`}>
          <span className="status-indicator"></span>
          <span className="status-text">{getConnectionStatusText()}</span>
        </div>
      </div>

      {!connected && (
        <div className="connection-controls">
          <button 
            onClick={onCreateGame}
            className="btn btn-primary"
          >
            Crear Partida
          </button>
          
          <div className="join-game-section">
            <form onSubmit={handleJoinSubmit} className="join-form">
              <input
                type="text"
                value={inputRoomCode}
                onChange={(e) => setInputRoomCode(e.target.value)}
                placeholder="Código de sala"
                className="room-code-input"
                maxLength={6}
              />
              <button 
                type="submit" 
                className="btn btn-secondary"
                disabled={!inputRoomCode.trim()}
              >
                Unirse
              </button>
            </form>
          </div>
        </div>
      )}

      {connected && roomCode && (
        <div className="game-info">
          <div className="room-info">
            <span className="room-code-label">Código de sala:</span>
            <span className="room-code">{roomCode}</span>
            <button 
              onClick={() => navigator.clipboard.writeText(roomCode)}
              className="btn btn-copy"
              title="Copiar código"
            >
              📋
            </button>
          </div>
          
          {getPlayerInfo()}
          
          <button 
            onClick={onLeaveGame}
            className="btn btn-danger"
          >
            Salir de la Partida
          </button>
        </div>
      )}

      {connected && gameStatus === 'waiting' && playerNumber && (
        <div className="waiting-message">
          <div className="waiting-spinner"></div>
          <p>Esperando a que se una el otro jugador...</p>
          <p className="share-hint">
            Comparte el código de sala para que otro jugador se una
          </p>
        </div>
      )}

      {gameStatus === 'playing' && (
        <div className="game-controls-info">
          <div className="controls-reminder">
            <h3>Controles:</h3>
            <div className="controls-grid">
              <div className="control-set">
                <span className="player-label">Jugador 1 (Izquierda)</span>
                <div className="keys">
                  <kbd>W</kbd> <span>Subir</span>
                  <kbd>S</kbd> <span>Bajar</span>
                </div>
              </div>
              <div className="control-set">
                <span className="player-label">Jugador 2 (Derecha)</span>
                <div className="keys">
                  <kbd>↑</kbd> <span>Subir</span>
                  <kbd>↓</kbd> <span>Bajar</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
