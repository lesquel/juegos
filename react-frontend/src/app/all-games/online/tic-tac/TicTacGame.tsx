import React, { useState, useEffect } from 'react';
import { TicTacGameLogic } from './TicTacGameLogic';
import { TicTacBoard } from './components/TicTacBoard';
import { TicTacHeader } from './components/TicTacHeader';
import { TicTacModal } from './components/TicTacModal';
import type { GameState, Player } from './types/TicTacTypes';
import './styles/TicTacStyles.css';

interface TicTacGameProps {
  onBack?: () => void;
}

export const TicTacGame: React.FC<TicTacGameProps> = ({ onBack }) => {
  const [gameState, setGameState] = useState<GameState>({
    board: Array(9).fill(null),
    currentPlayer: 'X' as Player,
    gameStatus: 'waiting',
    winner: null,
    isConnected: false,
    roomCode: '',
    playerSymbol: null,
    opponentSymbol: null
  });

  const [showModal, setShowModal] = useState(false);
  const [gameLogic] = useState(() => new TicTacGameLogic());

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

  const handleCellClick = (index: number) => {
    gameLogic.makeMove(index);
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
    <div className="tic-tac-game">
      <TicTacHeader 
        gameState={gameState}
        onBack={handleBack}
      />
      
      <TicTacBoard 
        board={gameState.board}
        onCellClick={handleCellClick}
        disabled={gameState.gameStatus !== 'playing' || gameState.currentPlayer !== gameState.playerSymbol}
      />

      {showModal && (
        <TicTacModal
          winner={gameState.winner}
          playerSymbol={gameState.playerSymbol}
          onPlayAgain={handlePlayAgain}
          onBack={handleBack}
        />
      )}
    </div>
  );
};
