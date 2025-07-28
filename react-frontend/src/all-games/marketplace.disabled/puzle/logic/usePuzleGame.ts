import { useState, useEffect, useCallback } from 'react';
import { PuzleGameLogic } from './PuzleGameLogic';
import type { GameState, Direction } from '../types/GameTypes';

export const usePuzleGame = () => {
  const [gameState, setGameState] = useState<GameState>(() => PuzleGameLogic.createInitialState());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startGame = useCallback(() => {
    setIsLoading(true);
    setError(null);
    
    try {
      setGameState(prevState => PuzleGameLogic.startGame(prevState));
    } catch (err) {
      setError('Error starting game');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const moveHero = useCallback((direction: Direction) => {
    setGameState(prevState => {
      const afterMove = PuzleGameLogic.moveHero(prevState, direction);
      return PuzleGameLogic.checkCollisions(afterMove);
    });
  }, []);

  const restartLevel = useCallback(() => {
    setGameState(prevState => PuzleGameLogic.restartLevel(prevState));
  }, []);

  const resetGame = useCallback(() => {
    setGameState(PuzleGameLogic.resetGame());
    setError(null);
  }, []);

  const pauseGame = useCallback(() => {
    setGameState(prevState => PuzleGameLogic.pauseGame(prevState));
  }, []);

  const resumeGame = useCallback(() => {
    setGameState(prevState => PuzleGameLogic.resumeGame(prevState));
  }, []);

  // Game timer
  useEffect(() => {
    if (gameState.gamePhase !== 'playing' || gameState.isPaused) return;

    const interval = setInterval(() => {
      setGameState(prevState => PuzleGameLogic.updateTimer(prevState, 0.1));
    }, 100);

    return () => clearInterval(interval);
  }, [gameState.gamePhase, gameState.isPaused]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      let direction: Direction = 'none';

      switch (key) {
        case 'arrowup':
        case 'w':
          direction = 'up';
          break;
        case 'arrowdown':
        case 's':
          direction = 'down';
          break;
        case 'arrowleft':
        case 'a':
          direction = 'left';
          break;
        case 'arrowright':
        case 'd':
          direction = 'right';
          break;
        case ' ':
          event.preventDefault();
          if (gameState.gamePhase === 'dead') {
            restartLevel();
          } else if (gameState.gamePhase === 'setup') {
            startGame();
          }
          return;
        case 'escape':
          if (gameState.gamePhase === 'playing') {
            if (gameState.isPaused) {
              resumeGame();
            } else {
              pauseGame();
            }
          }
          return;
      }

      if (direction !== 'none' && gameState.gamePhase === 'playing') {
        event.preventDefault();
        moveHero(direction);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameState.gamePhase, gameState.isPaused, startGame, restartLevel, moveHero, pauseGame, resumeGame]);

  const nextLevel = useCallback(() => {
    setGameState(prevState => PuzleGameLogic.completeLevel(prevState));
  }, []);

  const getCurrentInstruction = useCallback(() => {
    return PuzleGameLogic.getCurrentInstruction(gameState.level);
  }, [gameState.level]);

  const getGameStats = useCallback(() => {
    return {
      score: gameState.score,
      bestScore: gameState.bestScore,
      level: gameState.level,
      deaths: gameState.deaths,
      timeLeft: gameState.timeLeft,
      formattedTime: PuzleGameLogic.formatTime(gameState.timeLeft),
      coinsCollected: gameState.coinsCollected,
      totalCoins: gameState.totalCoins,
      progressPercentage: PuzleGameLogic.getProgressPercentage(gameState),
      isLevelCompleted: PuzleGameLogic.isLevelCompleted(gameState)
    };
  }, [gameState]);

  return {
    // State
    gameState,
    isLoading,
    error,
    
    // Actions
    startGame,
    moveHero,
    restartLevel,
    resetGame,
    pauseGame,
    resumeGame,
    nextLevel,
    
    // Helpers
    getCurrentInstruction,
    getGameStats,
    
    // Game info
    isGameActive: gameState.gamePhase === 'playing',
    gamePhase: gameState.gamePhase,
    isPaused: gameState.isPaused,
    timeLeft: gameState.timeLeft,
    formattedTime: PuzleGameLogic.formatTime(gameState.timeLeft)
  };
};
