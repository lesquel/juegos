import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { TicTacGameLogic } from "./TicTacGameLogic";
import { TicTacBoard } from "./components/TicTacBoard";
import { TicTacHeader } from "./components/TicTacHeader";
import { TicTacModal } from "./components/TicTacModal";
import type { GameState } from "./types/TicTacTypes";
import "./styles/TicTacStyles.css";
import { environment } from "@/config/environment";
import { useStore } from "zustand";
import { useAuthStore } from "@/modules/auth/store/auth.store";

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
    gameStatus: "waiting", // Always waiting for online games
    winner: null,
    winningPositions: [],
    playerSymbol: null,
    isConnected: false,
    roomCode: roomCode || null,
    player_id: "Jugador",
    opponentName: null,
    isPlayerTurn: false, // Always false initially for online games
    lastMove: null,
    gameId: null,
    spectators: 0,
  });

  const [showModal, setShowModal] = useState(false);
  const gameLogicRef = useRef<TicTacGameLogic | null>(null);

  // Cleanup global cuando la página se cierra
  useEffect(() => {
    const handleBeforeUnload = () => {
      console.log('🌐 Page unloading, cleaning up connections...');
      TicTacGameLogic.cleanupAllConnections();
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        console.log('📱 Page hidden, cleaning up inactive connections...');
        TicTacGameLogic.cleanupInactiveConnections();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup periódico cada 30 segundos
    const cleanupInterval = setInterval(() => {
      TicTacGameLogic.cleanupInactiveConnections();
    }, 30000);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearInterval(cleanupInterval);
    };
  }, []);

  // Initialize game logic
  const user = useStore(useAuthStore);
  const userId = user?.user?.user.user_id || 'anonymous';

  // Track if we've initialized for this room to prevent re-initialization
  const initRef = useRef<string | null>(null);

  // Memoizar la configuración para evitar cambios innecesarios
  const config = useMemo(() => ({
    isOnline: true, // Always online now
    wsUrl,
    authToken,
    player_id: userId,
    roomCode,
  }), [wsUrl, authToken, userId, roomCode]);

  useEffect(() => {
    console.log('🎯 useEffect triggered with:', {
      roomCode,
      initRefCurrent: initRef.current,
      hasGameLogic: !!gameLogicRef.current,
      isConnected: gameLogicRef.current?.isConnected()
    });

    // Skip if we've already initialized for this room AND we have a valid connection
    if (roomCode && initRef.current === roomCode && gameLogicRef.current?.isConnected()) {
      console.log("🔄 Skipping re-initialization for same room with active connection:", roomCode);
      return;
    }

    console.log("TicTacGame config:", config);

    // Only online mode is supported
    if (roomCode) {
      console.log('🚀 Starting initialization for room:', roomCode);
      // Mark this room as initialized
      initRef.current = roomCode;

      // Verificar si ya existe una conexión activa antes de crear una nueva
      const existingConnection = TicTacGameLogic.getActiveConnection(roomCode);

      if (existingConnection?.isConnected()) {
        console.log(`🔄 Reusing existing connection for room: ${roomCode}`);
        gameLogicRef.current = existingConnection;
        // Actualizar el callback para este componente
        gameLogicRef.current.onStateUpdate = setGameState;
        // Obtener el estado actual
        setGameState(gameLogicRef.current.getState());
        return;
      }

      // Si ya tenemos una instancia y es para el mismo room, no crear otra
      if (gameLogicRef.current && gameLogicRef.current.getConfig().roomCode === roomCode) {
        console.log('🔄 Using existing instance for same room');

        // Pero sí intentar conectar si no está conectado
        if (!gameLogicRef.current.isConnected()) {
          console.log('🔌 Existing instance not connected, attempting connection...');
          const connectTimeout = setTimeout(() => {
            console.log('⏰ Connect timeout triggered for existing instance...');
            if (gameLogicRef.current && !gameLogicRef.current.isConnected()) {
              console.log('🔌 Calling connect() method on existing instance...');
              gameLogicRef.current.connect().catch((error) => {
                console.error('❌ Failed to connect existing instance:', error);
              });
            }
          }, 100);

          return () => {
            clearTimeout(connectTimeout);
          };
        }
        return;
      }

      // Limpiar cualquier conexión previa de esta instancia
      if (gameLogicRef.current && gameLogicRef.current !== existingConnection) {
        console.log('🧹 Cleaning up previous instance');
        gameLogicRef.current.disconnect();
        gameLogicRef.current = null;
      }

      // Crear nueva instancia solo si no hay una conexión activa o válida
      console.log(`🆕 Creating new instance for room: ${roomCode}`);
      gameLogicRef.current = new TicTacGameLogic(config, setGameState);

      // Delay para evitar múltiples conexiones simultáneas en modo desarrollo
      const connectTimeout = setTimeout(() => {
        console.log('⏰ Connect timeout triggered, attempting connection...');
        if (gameLogicRef.current && !gameLogicRef.current.isConnected()) {
          console.log('🔌 Calling connect() method...');
          gameLogicRef.current.connect().catch((error) => {
            console.error('❌ Failed to connect:', error);
            // Set error state for failed online connection
            if (gameLogicRef.current) {
              console.log('🔄 Connection failed - game cannot proceed');
              // Could potentially redirect back or show error state
            }
          });
        } else {
          console.log('⚠️ Connect timeout triggered but conditions not met:', {
            hasGameLogic: !!gameLogicRef.current,
            isConnected: gameLogicRef.current?.isConnected()
          });
        }
      }, 100);

      // Cleanup del timeout
      return () => {
        clearTimeout(connectTimeout);
      };
    }

    return () => {
      // Para modo online, no desconectamos inmediatamente para permitir reutilización
    };
  }, [config, roomCode]);

  const handleCellClick = useCallback((index: number) => {
    if (gameLogicRef.current) {
      gameLogicRef.current.makeMove(index);
    }
  }, []);

  const handlePlayAgain = useCallback(() => {
    // Reset functionality removed - game is online only
    setShowModal(false);
    // Navigate back or disconnect since we can't reset
    onBack?.();
  }, [onBack]);

  const handleBack = useCallback(() => {
    console.log('🔙 Handling back navigation');
    if (gameLogicRef.current) {
      // Para modo online, solo desconectar si somos los únicos usuarios
      if (isOnlineMode && roomCode) {
        // Limpiar la referencia pero no desconectar inmediatamente
        // para permitir que otros componentes puedan reutilizar la conexión
        gameLogicRef.current = null;
      } else {
        // Para modo offline, desconectar inmediatamente
        gameLogicRef.current.disconnect();
        gameLogicRef.current = null;
      }
    }
    onBack?.();
  }, [onBack, isOnlineMode, roomCode]);

  // Show modal when game is finished
  useEffect(() => {
    if (gameState.gameStatus === "finished") {
      setShowModal(true);
    }
  }, [gameState.gameStatus]);

  // Handle game finish notification to backend
  useEffect(() => {
    if (gameState.gameStatus === "finished" && isOnlineMode && gameLogicRef.current && gameState.winner !== null) {
      const currentUserId = user?.user?.user.user_id;
      if (!currentUserId) return;

      let score = 0;
      if (gameState.winner === 'draw') {
        score = 50;
      } else if (gameState.winner === gameState.playerSymbol) {
        score = 100;
      }

      const participants = [{ user_id: currentUserId, score }];

      // Solo notificar en caso de victoria propia o empate
      if (score > 0) {
        gameLogicRef.current.finishGame(participants);
      }
    }
  }, [gameState.gameStatus, gameState.winner, gameState.playerSymbol, isOnlineMode, user?.user?.user.user_id]);

  const getStatusMessage = useCallback(() => {
    if (gameLogicRef.current) {
      return gameLogicRef.current.getPlayerTurnMessage();
    }
    return "";
  }, []);

  const isGameDisabled = useCallback(() => {
    if (gameLogicRef.current) {
      const canMove = gameLogicRef.current.canPlayerMove();
      console.log('🎮 Game disabled check:', !canMove);
      return !canMove;
    }

    // Fallback - always online mode
    const disabled = gameState.gameStatus !== "playing" || !gameState.isPlayerTurn;
    console.log('🌐 Fallback online mode - Game disabled:', disabled, {
      status: gameState.gameStatus,
      isPlayerTurn: gameState.isPlayerTurn,
      playerSymbol: gameState.playerSymbol,
      currentPlayer: gameState.currentPlayer,
      isConnected: gameState.isConnected
    });
    return disabled;
  }, [gameState.gameStatus, gameState.isPlayerTurn, gameState.playerSymbol, gameState.currentPlayer, gameState.isConnected]);


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
