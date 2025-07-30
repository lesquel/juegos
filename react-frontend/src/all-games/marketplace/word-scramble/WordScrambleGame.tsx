import React, { useState, useEffect, useCallback } from 'react';
import { initializeGameData, checkGuess } from './gameLogic';
import type { WordData, GameState } from './types';
import './styles/WordScramble.css';

// Game constants
const GAME_DURATION = 120; // seconds (2 minutes)

export const WordScrambleGame: React.FC = () => {
  const [wordData, setWordData] = useState<WordData>(initializeGameData());
  const [guess, setGuess] = useState('');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [gameState, setGameState] = useState<GameState>('ready');
  const [feedbackMessage, setFeedbackMessage] = useState('');

  const startNewRound = useCallback(() => {
    setWordData(initializeGameData());
    setGuess('');
    setFeedbackMessage('');
  }, []);

  const startGame = useCallback(() => {
    setScore(0);
    setTimeLeft(GAME_DURATION);
    setGameState('playing');
    startNewRound();
  }, [startNewRound]);

  const handleGuessSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (gameState !== 'playing') return;

    if (checkGuess(wordData.original, guess)) {
      setScore(prevScore => prevScore + 1);
      setFeedbackMessage({ text: '¡Correcto!', type: 'success' });
      setTimeout(() => {
        setFeedbackMessage({ text: '', type: '' }); // Clear feedback
        startNewRound(); // Start new round
      }, 1000); // Show feedback for 1 second
    } else {
      setFeedbackMessage({ text: '¡Incorrecto! Intenta de nuevo.', type: 'error' });
    }
  };

  const handleResetGame = useCallback(() => {
    setGameState('ready');
    setScore(0);
    setTimeLeft(GAME_DURATION);
    setGuess('');
    setFeedbackMessage('');
  }, []);

  // Timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameState === 'playing' && timeLeft > 0) {
      timer = setTimeout(() => {
        setTimeLeft(prevTime => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0 && gameState === 'playing') {
      setGameState('lost');
    }
    return () => clearTimeout(timer);
  }, [timeLeft, gameState]);

  return (
    <div className="word-scramble-container">
      <h1>Word Scramble</h1>

      {gameState === 'ready' && (
        <div className="start-screen">
          <p>Adivina la palabra desordenada.</p>
          <button onClick={startGame}>Comenzar Juego</button>
        </div>
      )}

      {gameState === 'playing' && (
        <div className="game-area">
          <div className="game-header">
            <p className="score-display">Puntuación: {score}</p>
            <p className="timer-display">Tiempo: {timeLeft}s</p>
          </div>

          <div className="scrambled-word-display">
            {gameState === 'playing' ? wordData.scrambled : wordData.original}
          </div>

          <form onSubmit={handleGuessSubmit} className="guess-form">
            <input
              type="text"
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              placeholder="Tu respuesta..."
              autoFocus
            />
            <button type="submit">Adivinar</button>
          </form>

          {feedbackMessage.text && (
            <p className={`feedback-message ${feedbackMessage.type}`}>{feedbackMessage.text}</p>
          )}
        </div>
      )}

      {gameState === 'lost' && (
        <div className="game-over-screen">
          <h2>¡Tiempo Agotado!</h2>
          <p>La palabra era: <strong>{wordData.original}</strong></p>
          <p>Tu puntuación final: {score}</p>
          <button onClick={handleResetGame}>Jugar de Nuevo</button>
        </div>
      )}
    </div>
  );
};
