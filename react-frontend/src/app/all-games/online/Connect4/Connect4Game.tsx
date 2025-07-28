import React, { useState, useEffect } from 'react';
import { Connect4GameLogic } from './Connect4GameLogic';
import { Connect4Board } from './components/Connect4Board';
import { Connect4Header } from './components/Connect4Header';
import { Connect4Modal } from './components/Connect4Modal';
import type { GameState } from './types/Connect4Types';
import './styles/Connect4Styles.css';

interface Connect4GameProps {
  onBack?: () => void;
}

export const Connect4Game: React.FC<Connect4GameProps> = ({ onBack }) => {
  const [gameState, setGameState] = useState<GameState>({
    board: Array(6).fill(null).map(() => Array(7).fill(null)),
    currentPlayer: 'red',
    gameStatus: 'waiting',
    winner: null,
    isConnected: false,
    roomCode: '',
    playerColor: null,
    opponentColor: null,
    winningCells: []
  });

  const [showModal, setShowModal] = useState(false);
  const [gameLogic] = useState(() => new Connect4GameLogic());

  useEffect(() => {
    // Initialize WebSocket connection
    gameLogic.initialize((newState: GameState) => {
      setGameState(newState);
      
      if (newState.gameStatus === 'finished') {
        setShowModal(true);
      }
    });

    return () => {
      gameLogic.disconnect();
    };
  }, [gameLogic]);

  const handleColumnClick = (column: number) => {
    gameLogic.makeMove(column);
  };

  const handlePlayAgain = () => {
    setShowModal(false);
    gameLogic.playAgain();
  };

  const handleBack = () => {
    setShowModal(false);
    gameLogic.disconnect();
    if (onBack) {
      onBack();
    } else {
      window.history.back();
    }
  };

  return (
    <div className="connect4-game">
      <Connect4Header 
        gameState={gameState}
        onBack={handleBack}
      />
      
      <Connect4Board 
        board={gameState.board}
        onColumnClick={handleColumnClick}
        disabled={gameState.gameStatus !== 'playing' || gameState.currentPlayer !== gameState.playerColor}
        winningCells={gameState.winningCells}
      />

      {showModal && (
        <Connect4Modal
          winner={gameState.winner}
          playerColor={gameState.playerColor}
          onPlayAgain={handlePlayAgain}
          onBack={handleBack}
        />
      )}
    </div>
  );
};
