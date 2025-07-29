import React, { useState, useEffect, useCallback, useRef } from "react";
import { TicTacGameLogic } from "./TicTacGameLogic";
import { TicTacBoard } from "./components/TicTacBoard";
import { TicTacHeader } from "./components/TicTacHeader";
import { TicTacModal } from "./components/TicTacModal";
import type { GameState } from "./types/TicTacTypes";
import "./styles/TicTacStyles.css";
import { environment } from "@/config/environment";

interface TicTacGameProps {
  onBack?: () => void;
  isOnlineMode?: boolean;
  roomCode?: string;
  authToken?: string;
  wsUrl?: string;
}

export const TicTacGame: React.FC<TicTacGameProps> = ({
  onBack,
  isOnlineMode = false,
  roomCode,
  authToken = "",
  wsUrl = environment.WS_URL + "/ws/games",
}) => {
  const [gameState, setGameState] = useState<GameState>({
    board: Array(9).fill(null),
    currentPlayer: "X",
    gameStatus: isOnlineMode ? "waiting" : "playing",
    winner: null,
    winningPositions: [],
    playerSymbol: null,
    isConnected: false,
    roomCode: roomCode || null,
    playerName: "Jugador",
    opponentName: null,
    isPlayerTurn: !isOnlineMode,
    lastMove: null,
    gameId: null,
    spectators: 0,
  });

  const [showModal, setShowModal] = useState(false);
  const gameLogicRef = useRef<TicTacGameLogic | null>(null);

  // Initialize game logic
  useEffect(() => {
    const config = {
      isOnline: isOnlineMode,
      wsUrl,
      authToken,
      playerName: "Jugador1", // Default player name
      roomCode,
    };

    console.log("config", config);
    gameLogicRef.current = new TicTacGameLogic(config, setGameState);

    if (isOnlineMode) {
      gameLogicRef.current.connect().catch(console.error);
    } else {
      gameLogicRef.current.startOfflineGame();
    }

    return () => {
      if (gameLogicRef.current) {
        gameLogicRef.current.disconnect();
      }
    };
  }, [isOnlineMode, wsUrl, authToken, roomCode]);

  const handleCellClick = useCallback((index: number) => {
    if (gameLogicRef.current) {
      gameLogicRef.current.makeMove(index);
    }
  }, []);

  const handlePlayAgain = useCallback(() => {
    if (gameLogicRef.current) {
      gameLogicRef.current.resetGame();
    }
    setShowModal(false);
  }, []);

  const handleBack = useCallback(() => {
    if (gameLogicRef.current) {
      gameLogicRef.current.disconnect();
    }
    onBack?.();
  }, [onBack]);

  // Show modal when game is finished
  useEffect(() => {
    if (gameState.gameStatus === "finished") {
      setShowModal(true);
    }
  }, [gameState.gameStatus]);

  const getStatusMessage = useCallback(() => {
    if (gameLogicRef.current) {
      return gameLogicRef.current.getPlayerTurnMessage();
    }
    return "";
  }, [gameState]);

  const isGameDisabled = useCallback(() => {
    if (!isOnlineMode) {
      return gameState.gameStatus !== "playing";
    }
    return gameState.gameStatus !== "playing" || !gameState.isPlayerTurn;
  }, [isOnlineMode, gameState.gameStatus, gameState.isPlayerTurn]);


  return (
    <div className="tic-tac-game">
      <TicTacHeader
        currentPlayer={gameState.currentPlayer}
        statusMessage={getStatusMessage()}
        gameStatus={gameState.gameStatus}
        playerSymbol={gameState.playerSymbol}
        opponentName={gameState.opponentName}
        isOnlineMode={isOnlineMode}
        roomCode={gameState.roomCode}
        onBack={handleBack}
      />

      <TicTacBoard
        board={gameState.board}
        onCellClick={handleCellClick}
        disabled={isGameDisabled()}
        winningPositions={gameState.winningPositions}
      />

      {showModal && gameState.winner !== null && (
        <TicTacModal
          winner={gameState.winner}
          playerSymbol={gameState.playerSymbol}
          onPlayAgain={handlePlayAgain}
          onBack={handleBack}
          isOnlineMode={isOnlineMode}
        />
      )}
    </div>
  );
};
