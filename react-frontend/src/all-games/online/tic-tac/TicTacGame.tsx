import React, { useState, useEffect, useCallback } from 'react';
import { TicTacGameLogic } from './TicTacGameLogic';
import { TicTacBoard } from './components/TicTacBoard';
import { TicTacHeader } from './components/TicTacHeader';
import { TicTacModal } from './components/TicTacModal';
import type { GameState } from './types/TicTacTypes';
import './styles/TicTacStyles.css';

interface TicTacGameProps {
  onBack?: () => void;
}

export const TicTacGame: React.FC<TicTacGameProps> = ({ onBack }) => {
  const [gameState, setGameState] = useState<GameState>({
    board: Array(9).fill(null),
    currentPlayer: 'X',
    gameStatus: 'waiting',
    winner: null,
    isConnected: false,
    playersInfo: '👥 0/2 jugadores',
    playerSymbol: null,
    opponentSymbol: null,
    isMyTurn: false,
    userInfo: null,
    matchId: null,
    moveCount: 0,
    winningPositions: []
  });

  const [showModal, setShowModal] = useState(false);
  const [gameLogic] = useState(() => new TicTacGameLogic());

  const handleStateChange = useCallback((newState: GameState) => {
    console.log("🔄 Estado del juego actualizado:", newState);
    setGameState(newState);
    
    if (newState.gameStatus === 'finished') {
      setShowModal(true);
    }
  }, []);

  useEffect(() => {
    // Initialize WebSocket connection
    gameLogic.initialize(handleStateChange);

    return () => {
      gameLogic.disconnect();
    };
  }, [gameLogic, handleStateChange]);

  const handleCellClick = useCallback((index: number) => {
    console.log(`🎯 Click en celda ${index}:`, {
      isMyTurn: gameState.isMyTurn,
      gameStatus: gameState.gameStatus,
      cellValue: gameState.board[index],
      playerSymbol: gameState.playerSymbol
    });
    
    gameLogic.makeMove(index);
  }, [gameLogic, gameState.isMyTurn, gameState.gameStatus, gameState.board, gameState.playerSymbol]);

  const handlePlayAgain = useCallback(() => {
    console.log("🔄 Jugando de nuevo...");
    setShowModal(false);
    gameLogic.playAgain();
  }, [gameLogic]);

  const handleBack = useCallback(() => {
    console.log("🏠 Volviendo atrás...");
    setShowModal(false);
    gameLogic.disconnect();
    if (onBack) {
      onBack();
    } else {
      window.history.back();
    }
  }, [gameLogic, onBack]);

  const getStatusMessage = useCallback(() => {
    if (gameState.gameStatus === 'waiting') {
      return gameState.matchId 
        ? '⏳ Esperando que se una otro jugador...'
        : '🎮 Modo práctica - ¡Comienza a jugar!';
    }
    
    if (gameState.gameStatus === 'playing') {
      if (gameState.matchId) {
        // Modo online
        if (gameState.isMyTurn) {
          return `🎯 Tu turno (${gameState.playerSymbol})`;
        } else {
          return `⏳ Turno del oponente`;
        }
      } else {
        // Modo práctica
        return `🎮 Turno del jugador ${gameState.currentPlayer}`;
      }
    }
    
    if (gameState.gameStatus === 'finished') {
      if (gameState.winner === 'draw') {
        return '🤝 ¡Es un empate!';
      }
      
      if (gameState.matchId) {
        // Modo online
        const didIWin = gameState.winner === gameState.playerSymbol;
        return didIWin ? '🏆 ¡Ganaste!' : '😞 Perdiste';
      } else {
        // Modo práctica
        return `🏆 ¡Ganó el jugador ${gameState.winner}!`;
      }
    }
    
    return '';
  }, [gameState]);

  return (
    <div className="tic-tac-game">
      <TicTacHeader 
        gameState={gameState}
        statusMessage={getStatusMessage()}
        onBack={handleBack}
      />
      
      <TicTacBoard 
        board={gameState.board}
        onCellClick={handleCellClick}
        disabled={
          gameState.gameStatus !== 'playing' || 
          (gameState.matchId ? !gameState.isMyTurn : false)
        }
        winningPositions={gameState.winningPositions}
      />

      {showModal && (
        <TicTacModal
          winner={gameState.winner}
          playerSymbol={gameState.playerSymbol}
          isOnlineMode={!!gameState.matchId}
          onPlayAgain={handlePlayAgain}
          onBack={handleBack}
        />
      )}
    </div>
  );
};
