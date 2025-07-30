import React, { useState, useEffect } from 'react';
import { determineWinner, getRandomOption } from './RockPaperScissorsLogic';
import type { Option, Winner } from './types';
import { GameOption, ResultDisplay, Scoreboard } from './components';
import './styles/RockPaperScissors.css';

const MAX_SCORE = 5;

export const RockPaperScissorsGame: React.FC = () => {
  const [playerOption, setPlayerOption] = useState<Option | null>(null);
  const [computerOption, setComputerOption] = useState<Option | null>(null);
  const [winner, setWinner] = useState<Winner | null>(null);
  const [playerScore, setPlayerScore] = useState(0);
  const [computerScore, setComputerScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const handlePlayerChoice = (option: Option) => {
    if (isGameOver || showResult) return;

    const computer = getRandomOption();
    const newWinner = determineWinner(option, computer);

    setPlayerOption(option);
    setComputerOption(computer);
    setWinner(newWinner);
    setShowResult(true);

    setTimeout(() => {
      if (newWinner === 'player') {
        setPlayerScore((prev) => prev + 1);
      } else if (newWinner === 'computer') {
        setComputerScore((prev) => prev + 1);
      }
      setShowResult(false);
      setPlayerOption(null);
      setComputerOption(null);
      setWinner(null);
    }, 2000); // Show result for 2 seconds
  };

  const resetGame = () => {
    setPlayerScore(0);
    setComputerScore(0);
    setPlayerOption(null);
    setComputerOption(null);
    setWinner(null);
    setIsGameOver(false);
  };

  useEffect(() => {
    if (playerScore === MAX_SCORE || computerScore === MAX_SCORE) {
      setIsGameOver(true);
    }
  }, [playerScore, computerScore]);

  return (
    <div className="game-container">
      <h1 className="title">Piedra, Papel o Tijeras</h1>
      <p className="game-rule">El primero en llegar a {MAX_SCORE} puntos gana la partida.</p>
      <Scoreboard playerScore={playerScore} computerScore={computerScore} />

      {isGameOver ? (
        <div className="game-over">
          <h2>{playerScore === MAX_SCORE ? '¡Ganaste el Juego!' : '¡Perdiste el Juego!'}</h2>
          <button className="btn" onClick={resetGame}>Jugar de Nuevo</button>
        </div>
      ) : (
        <>
          {!showResult ? (
            <div className="options">
              <GameOption option="rock" onSelect={handlePlayerChoice} disabled={false} />
              <GameOption option="paper" onSelect={handlePlayerChoice} disabled={false} />
              <GameOption option="scissors" onSelect={handlePlayerChoice} disabled={false} />
            </div>
          ) : (
            <div className="result-container">
              <div className={`choice-display player ${winner === 'player' ? 'winner' : ''}`}>
                <h3>Tú</h3>
                <GameOption option={playerOption!} onSelect={() => {}} disabled={true} />
              </div>
              <div className="versus">VS</div>
              <div className={`choice-display computer ${winner === 'computer' ? 'winner' : ''}`}>
                <h3>Computadora</h3>
                <GameOption option={computerOption!} onSelect={() => {}} disabled={true} />
              </div>
            </div>
          )}
          <ResultDisplay winner={winner} />
        </>
      )}
    </div>
  );
};
''