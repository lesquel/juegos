import { useState, useEffect, useCallback } from 'react';
import { SocietyGameLogic } from '../logic/SocietyGameLogic';
import type { GameState, Position, Fear, Difficulty } from '../types/GameTypes';

export const useSocietyGame = (difficulty: Difficulty = 'normal') => {
  const [gameState, setGameState] = useState<GameState>(() => SocietyGameLogic.createInitialState());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Game timer
  useEffect(() => {
    if (!gameState.isGameActive) return;

    const interval = setInterval(() => {
      setGameState(prevState => SocietyGameLogic.updateTimer(prevState, 1));
    }, 1000);

    return () => clearInterval(interval);
  }, [gameState.isGameActive]);

  // Fear spawning
  useEffect(() => {
    if (!gameState.isGameActive) return;

    const settings = SocietyGameLogic.getDifficultySettings(difficulty);
    const spawnInterval = setInterval(() => {
      if (Math.random() < settings.fearSpawnRate) {
        setGameState(prevState => SocietyGameLogic.spawnFear(prevState));
      }
    }, 2000);

    return () => clearInterval(spawnInterval);
  }, [gameState.isGameActive, difficulty]);

  const startGame = useCallback(() => {
    setIsLoading(true);
    setError(null);
    
    try {
      const newState = SocietyGameLogic.createInitialState();
      const startedState = SocietyGameLogic.startGame(newState);
      setGameState(startedState);
    } catch (err) {
      setError('Error starting game');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const movePlayer = useCallback((playerId: string, newPosition: Position) => {
    setGameState(prevState => {
      const afterMove = SocietyGameLogic.movePlayer(prevState, playerId, newPosition);
      return SocietyGameLogic.checkFearEncounter(afterMove, playerId);
    });
  }, []);

  const selectTile = useCallback((position: Position) => {
    setGameState(prevState => ({
      ...prevState,
      selectedTile: position
    }));
  }, []);

  const hoverTile = useCallback((position: Position | null) => {
    setGameState(prevState => ({
      ...prevState,
      hoveredTile: position
    }));
  }, []);

  const toggleFearsVisibility = useCallback(() => {
    setGameState(prevState => ({
      ...prevState,
      showFears: !prevState.showFears
    }));
  }, []);

  const restartGame = useCallback(() => {
    const newState = SocietyGameLogic.createInitialState();
    setGameState(newState);
    setError(null);
  }, []);

  const pauseGame = useCallback(() => {
    setGameState(prevState => ({
      ...prevState,
      isGameActive: false
    }));
  }, []);

  const resumeGame = useCallback(() => {
    setGameState(prevState => ({
      ...prevState,
      isGameActive: true
    }));
  }, []);

  const getCurrentPlayer = useCallback(() => {
    return gameState.players[gameState.currentPlayer];
  }, [gameState.players, gameState.currentPlayer]);

  const getFearAtPosition = useCallback((position: Position): Fear | null => {
    return SocietyGameLogic.getFearByPosition(gameState.gameBoard, position);
  }, [gameState.gameBoard]);

  const getGameStats = useCallback(() => {
    const player = getCurrentPlayer();
    if (!player) return null;

    return {
      score: player.score,
      fearsEncountered: player.fears.length,
      timeRemaining: gameState.timeLeft,
      turnsPlayed: gameState.turnCount,
      formattedTime: SocietyGameLogic.formatTime(gameState.timeLeft)
    };
  }, [gameState, getCurrentPlayer]);

  const canPlayerMoveTo = useCallback((position: Position): boolean => {
    const player = getCurrentPlayer();
    if (!player) return false;

    return SocietyGameLogic.canMoveTo(player.position, position, gameState.gameBoard);
  }, [gameState.gameBoard, getCurrentPlayer]);

  return {
    // State
    gameState,
    isLoading,
    error,
    
    // Actions
    startGame,
    movePlayer,
    selectTile,
    hoverTile,
    toggleFearsVisibility,
    restartGame,
    pauseGame,
    resumeGame,
    
    // Helpers
    getCurrentPlayer,
    getFearAtPosition,
    getGameStats,
    canPlayerMoveTo,
    
    // Game info
    isGameActive: gameState.isGameActive,
    gamePhase: gameState.gamePhase,
    timeLeft: gameState.timeLeft,
    formattedTime: SocietyGameLogic.formatTime(gameState.timeLeft)
  };
};
