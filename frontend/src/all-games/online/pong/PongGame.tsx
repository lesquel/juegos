import React, { useEffect, useState, useCallback } from 'react';
import { PongGameLogic } from './PongGameLogic';
import { PongCanvas } from './components/PongCanvas';
import { PongHeader } from './components/PongHeader';
import { PongModal } from './components/PongModal';
import type { GameState, GameStatus, Connection } from './types/PongTypes';
import './styles/PongStyles.css';

const PongGame: React.FC = () => {
  const [gameLogic, setGameLogic] = useState<PongGameLogic | null>(null);
  const [gameState, setGameState] = useState<GameState>({
    ball: {
      x: 400,
      y: 200,
      radius: 8,
      velocity: { x: 5, y: 3 },
      speed: 5
    },
    paddle1: {
      x: 20,
      y: 160,
      width: 10,
      height: 80,
      speed: 5
    },
    paddle2: {
      x: 770,
      y: 160,
      width: 10,
      height: 80,
      speed: 5
    },
    score: {
      player1: 0,
      player2: 0
    },
    gameStatus: 'waiting',
    winner: null,
    isConnected: false,
    roomCode: '',
    playerNumber: null,
    canvasWidth: 800,
    canvasHeight: 400
  });

  const [connection, setConnection] = useState<Connection>({
    ws: null,
    roomCode: null,
    playerNumber: null,
    connected: false
  });

  const [showModal, setShowModal] = useState(false);

  // Initialize game logic
  useEffect(() => {
    const logic = new PongGameLogic();
    
    // Set up state update callback
    const handleStateUpdate = (newState: GameState) => {
      setGameState(newState);
      setConnection({
        ws: null, // We don't expose the ws directly
        roomCode: newState.roomCode || null,
        playerNumber: newState.playerNumber,
        connected: newState.isConnected
      });

      // Show modal when game finishes
      if (newState.gameStatus === 'finished') {
        setShowModal(true);
      }
    };

    logic.onStateUpdate = handleStateUpdate;
    logic.initialize(handleStateUpdate);
    setGameLogic(logic);

    return () => {
      logic.disconnect();
    };
  }, []);

  const handleCreateGame = useCallback(() => {
    if (gameLogic) {
      gameLogic.createGame();
    }
  }, [gameLogic]);

  const handleJoinGame = useCallback((roomCode: string) => {
    if (gameLogic) {
      gameLogic.joinGame(roomCode);
    }
  }, [gameLogic]);

  const handleLeaveGame = useCallback(() => {
    if (gameLogic) {
      gameLogic.disconnect();
      setShowModal(false);
    }
  }, [gameLogic]);

  const handleRestartGame = useCallback(() => {
    if (gameLogic && connection.roomCode) {
      // Disconnect and rejoin to restart
      gameLogic.disconnect();
      setTimeout(() => {
        if (connection.roomCode) {
          gameLogic.joinGame(connection.roomCode);
        }
      }, 500);
      setShowModal(false);
    }
  }, [gameLogic, connection.roomCode]);

  const handleCloseModal = useCallback(() => {
    setShowModal(false);
  }, []);

  return (
    <div className="pong-game">
      <PongHeader
        roomCode={connection.roomCode}
        connected={connection.connected}
        playerNumber={connection.playerNumber}
        gameStatus={gameState.gameStatus}
        connection={connection}
        onJoinGame={handleJoinGame}
        onCreateGame={handleCreateGame}
        onLeaveGame={handleLeaveGame}
      />

      {connection.connected && (
        <PongCanvas gameState={gameState} />
      )}

      {showModal && (
        <PongModal
          gameStatus={gameState.gameStatus}
          winner={gameState.winner}
          playerNumber={connection.playerNumber}
          onRestartGame={handleRestartGame}
          onLeaveGame={handleLeaveGame}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default PongGame;
