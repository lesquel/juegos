import React, { useState, useEffect } from 'react';
import { initializeGame, flipCard, checkMatch, isGameOver } from './gameLogic';
import type { Card, GameStatus } from './types';
import { CardComponent, GameBoard, GameInfo, GameOverOverlay } from './components';
import './styles/MemoryGame.css';

const NUM_PAIRS = 12; // 12 pairs = 24 cards (6x4 grid)

export const MemoryGame: React.FC = () => {
  const [cards, setCards] = useState<Card[]>(initializeGame(NUM_PAIRS));
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [gameStatus, setGameStatus] = useState<GameStatus>('playing');
  const [awaitingEndOfTurn, setAwaitingEndOfTurn] = useState(false);

  const handleCardClick = (index: number) => {
    if (awaitingEndOfTurn || cards[index].isFlipped || cards[index].isMatched) {
      return;
    }

    const newCards = flipCard(cards, index);
    setCards(newCards);
    setFlippedIndices(prev => [...prev, index]);
  };

  useEffect(() => {
    if (flippedIndices.length === 2) {
      setAwaitingEndOfTurn(true);
      setMoves(prev => prev + 1);

      const { newCards, isMatch } = checkMatch(cards, flippedIndices);

      setTimeout(() => {
        setCards(newCards);
        setFlippedIndices([]);
        setAwaitingEndOfTurn(false);

        if (isMatch && isGameOver(newCards)) {
          setGameStatus('gameOver');
        }
      }, 1000); // Keep cards flipped for 1 second
    }
  }, [flippedIndices, cards]);

  const resetGame = () => {
    setCards(initializeGame(NUM_PAIRS));
    setFlippedIndices([]);
    setMoves(0);
    setGameStatus('playing');
    setAwaitingEndOfTurn(false);
  };

  return (
    <div className="memory-game-container">
      <h1>Memory Game</h1>
      <GameInfo moves={moves} onResetGame={resetGame} />
      <GameBoard cards={cards} onCardClick={handleCardClick} />
      {gameStatus === 'gameOver' && (
        <GameOverOverlay moves={moves} onPlayAgain={resetGame} />
      )}
    </div>
  );
};
