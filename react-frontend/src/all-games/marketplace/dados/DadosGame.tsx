import React, { useState, useEffect } from 'react';
import { DadosGameLogic } from './DadosGameLogic';
import { DiceDisplay } from './components/DiceDisplay';
import { BettingPanel } from './components/BettingPanel';
import { GameStats } from './components/GameStats';
import { GameModeSelector } from './components/GameModeSelector';
import type { DiceGameState, DiceResult, GameMode } from './types/DadosTypes';
import './styles/DadosStyles.css';

const DadosGame: React.FC = () => {
  const [gameLogic] = useState(() => new DadosGameLogic());
  const [gameState, setGameState] = useState<DiceGameState>(gameLogic.getGameState());
  const [diceResults, setDiceResults] = useState<DiceResult[]>([]);
  const [resultMessage, setResultMessage] = useState<string>('');
  const [showResult, setShowResult] = useState<boolean>(false);

  useEffect(() => {
    gameLogic.onStateChange((newState) => {
      setGameState(newState);
    });

    // Initialize dice display based on current mode
    let diceCount = 1;
    if (gameState.gameMode === 'double') diceCount = 2;
    else if (gameState.gameMode === 'triple') diceCount = 3;
    
    const initialDice = Array.from({ length: diceCount }, () => ({
      value: 0,
      face: '?'
    }));
    setDiceResults(initialDice);
  }, [gameLogic, gameState.gameMode]);

  // Update dice display when game mode changes
  useEffect(() => {
    let diceCount = 1;
    if (gameState.gameMode === 'double') diceCount = 2;
    else if (gameState.gameMode === 'triple') diceCount = 3;
    
    const newDice = Array.from({ length: diceCount }, () => ({
      value: 0,
      face: '?'
    }));
    setDiceResults(newDice);
  }, [gameState.gameMode]);

  const handleModeChange = (mode: GameMode) => {
    gameLogic.setGameMode(mode);
  };

  const handleAmountChange = (amount: number) => {
    gameLogic.setSelectedAmount(amount);
  };

  const handlePlaceBet = (betType: string, payout: number) => {
    const success = gameLogic.placeBet(betType, payout);
    if (success) {
      setResultMessage('');
      setShowResult(false);
    }
  };

  const handleRollDice = async () => {
    if (!gameState.currentBet.type) {
      setResultMessage('¡Selecciona una apuesta primero!');
      setShowResult(true);
      return;
    }

    setShowResult(false);
    const results = await gameLogic.rollDice();
    
    if (results.length > 0) {
      setDiceResults(results);
      
      // Check if won and show result message
      setTimeout(() => {
        const wins = gameState.stats.wins;
        const isWin = gameLogic.getGameState().stats.wins > wins;
        
        if (isWin) {
          const winAmount = gameState.currentBet.amount * gameState.currentBet.payout;
          setResultMessage(`¡GANASTE $${winAmount}!`);
        } else {
          setResultMessage(`Perdiste $${gameState.currentBet.amount}`);
        }
        setShowResult(true);
      }, 100);
    }
  };

  const handleResetGame = () => {
    gameLogic.resetGame();
    setDiceResults([{ value: 0, face: '?' }]);
    setResultMessage('');
    setShowResult(false);
  };

  const bettingOptions = gameLogic.getBettingOptions();
  const currentOptions = bettingOptions[gameState.gameMode];

  return (
    <div className="dados-game">
      <div className="casino-container">
        <div className="main-game">
          <GameModeSelector
            currentMode={gameState.gameMode}
            onModeChange={handleModeChange}
            isRolling={gameState.isRolling}
          />

          <DiceDisplay 
            dice={diceResults} 
            isRolling={gameState.isRolling} 
          />

          <div className="game-info">
            <div className="target-info">
              {gameState.currentBet.type 
                ? `🎯 Apuesta: ${gameState.currentBet.type} - Pago: ${gameState.currentBet.payout}:1`
                : '🎯 Selecciona una apuesta'
              }
            </div>
            {showResult && (
              <div className={`result-message ${resultMessage.includes('GANASTE') ? 'win' : 'lose'}`}>
                {resultMessage}
              </div>
            )}
          </div>

          <BettingPanel
            gameMode={gameState.gameMode}
            bettingOptions={currentOptions}
            selectedAmount={gameState.selectedAmount}
            currentBet={gameState.currentBet}
            balance={gameState.balance}
            isRolling={gameState.isRolling}
            onPlaceBet={handlePlaceBet}
            onAmountChange={handleAmountChange}
          />

          <div className="game-controls">
            <button
              className="game-btn roll-btn"
              onClick={handleRollDice}
              disabled={gameState.isRolling || !gameState.currentBet.type || gameState.balance < gameState.currentBet.amount}
            >
              {gameState.isRolling ? '🎲 Tirando...' : '🎲 Tirar Dados'}
            </button>
            <button
              className="game-btn reset-btn"
              onClick={handleResetGame}
              disabled={gameState.isRolling}
            >
              🔄 Reiniciar
            </button>
          </div>
        </div>

        <GameStats gameState={gameState} />
      </div>
    </div>
  );
};

export default DadosGame;
