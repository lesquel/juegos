import React, { useState, useEffect } from 'react';
import { DadosGameLogic } from './DadosGameLogic';
import { DiceDisplay } from './components/DiceDisplay';
import { BettingPanel } from './components/BettingPanel';
import { GameStats } from './components/GameStats';
import { GameModeSelector } from './components/GameModeSelector';
import { GameEndModal } from './components/GameEndModal';
import { useDadosGameId, useDadosBetting, useDadosBalance } from './services/dadosBettingService';
import type { DiceGameState, DiceResult, GameMode } from './types/DadosTypes';
import type { DadosBetData, DadosGameResult } from './services/dadosBettingService';
import './styles/DadosStyles.css';

const DadosGame: React.FC = () => {
  const [gameLogic] = useState(() => new DadosGameLogic());
  const [gameState, setGameState] = useState<DiceGameState>(gameLogic.getGameState());
  const [diceResults, setDiceResults] = useState<DiceResult[]>([]);
  const [resultMessage, setResultMessage] = useState<string>('');
  const [showResult, setShowResult] = useState<boolean>(false);
  
  // Estados adicionales para mejor UX
  const [lastGameResult, setLastGameResult] = useState<{
    diceNumbers: number[];
    betAmount: number;
    winAmount: number;
    isWin: boolean;
    betType: string;
  } | null>(null);
  
  // Backend integration - separar gameId hook
  const { dadosGameId, isLoading: isGameIdLoading } = useDadosGameId();
  const betting = useDadosBetting(dadosGameId || "");
  const { balance, isLoading: isBalanceLoading, hasInsufficientFunds } = useDadosBalance();
  
  // Modal state management
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState<{
    isWin: boolean;
    diceResults: number[];
    betType: string;
    betAmount: number;
    winAmount: number;
  } | null>(null);

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

  const handlePlaceBet = async (betType: string, payout: number) => {
    if (betting.isPlacingBet || !dadosGameId) return;
    
    const betAmount = gameState.selectedAmount;
    
    // Check if user has enough balance
    if (hasInsufficientFunds(betAmount)) {
      setResultMessage('¡Saldo insuficiente!');
      setShowResult(true);
      return;
    }

    try {
      // Crear apuesta en backend (esto deduce el monto automáticamente)
      const betData: DadosBetData = {
        betAmount,
        gameId: dadosGameId,
        prediction: betType === 'specific' ? parseInt(betType.split('-')[1]) || 1 : 1, // Parse prediction from bet type
      };

      await betting.placeBet.mutateAsync(betData);
      
      // Place bet in local game logic
      const success = gameLogic.placeBet(betType, payout);
      if (success) {
        setResultMessage('');
        setShowResult(false);
        console.log("🎲 Apuesta realizada exitosamente");
      }
    } catch (error) {
      console.error('❌ Error placing bet:', error);
      setResultMessage('Error al realizar la apuesta');
      setShowResult(true);
    }
  };

  const handleRollDice = async () => {
    if (!gameState.currentBet.type || !betting.currentMatch || betting.isFinishingGame) {
      setResultMessage('¡Selecciona una apuesta primero!');
      setShowResult(true);
      return;
    }

    setShowResult(false);
    
    try {
      const results = await gameLogic.rollDice();
      
      if (results.length > 0) {
        setDiceResults(results);
        
        // Check if won después de un breve delay para mostrar el resultado
        setTimeout(async () => {
          const currentStats = gameLogic.getGameState().stats;
          const isWin = currentStats.wins > gameState.stats.wins;
          const betAmount = gameState.currentBet.amount;
          const winAmount = isWin ? betAmount * gameState.currentBet.payout : 0;
          
          // Guardar información del resultado para mostrar en la UI
          setLastGameResult({
            diceNumbers: results.map(r => r.value),
            betAmount,
            winAmount,
            isWin,
            betType: gameState.currentBet.type || 'Desconocido'
          });
          
          try {
            // Finalizar match en backend
            const gameResult: DadosGameResult = {
              win: isWin,
              winAmount,
              rolledNumber: results[0]?.value || 1,
              predictedNumber: betting.currentMatch?.prediction || 1,
              totalBet: betAmount,
            };

            await betting.finishGame.mutateAsync(gameResult);
            
            // Show modal with result
            setModalData({
              isWin,
              diceResults: results.map(r => r.value),
              betType: gameState.currentBet.type || 'Desconocido',
              betAmount,
              winAmount
            });
            setShowModal(true);
            
            // Mostrar resultado inmediato en la UI
            const resultText = isWin 
              ? `🎉 ¡GANASTE! +$${winAmount.toFixed(2)}` 
              : `😞 Perdiste $${betAmount.toFixed(2)}`;
            setResultMessage(resultText);
            setShowResult(true);
            
            console.log(`🎲 Juego finalizado - ${isWin ? 'GANASTE' : 'PERDISTE'}: $${winAmount}`);
            
          } catch (error) {
            console.error('❌ Error finishing match:', error);
            setResultMessage('Error al finalizar la partida');
            setShowResult(true);
          }
        }, 1500); // Delay para mostrar la animación de dados
      }
    } catch (error) {
      console.error('❌ Error rolling dice:', error);
      setResultMessage('Error al tirar los dados');
      setShowResult(true);
    }
  };

  const handleResetGame = () => {
    gameLogic.resetGame();
    setDiceResults([{ value: 0, face: '?' }]);
    setResultMessage('');
    setShowResult(false);
    setShowModal(false);
    setModalData(null);
    setLastGameResult(null); // Limpiar resultado anterior
  };

  const handleModalContinue = () => {
    setShowModal(false);
    setModalData(null);
    setResultMessage('');
    setShowResult(false);
    // No limpiar lastGameResult para que se siga viendo la información
    // Permitir continuar jugando - no resetear el juego
    betting.continueGame();
  };

  const handleModalClose = () => {
    setShowModal(false);
    setModalData(null);
    setLastGameResult(null); // Limpiar toda la información al salir
    handleResetGame();
    // Salir del juego
    betting.quitGame.mutate();
  };

  const bettingOptions = gameLogic.getBettingOptions();
  const currentOptions = bettingOptions[gameState.gameMode];

  // Loading states
  if (isGameIdLoading || isBalanceLoading) {
    return (
      <div className="dados-game">
        <div className="dados-betting-loading">
          🎲 Cargando juego de dados...
        </div>
      </div>
    );
  }

  // Error states
  if (!dadosGameId) {
    return (
      <div className="dados-game">
        <div className="dados-betting-error">
          ❌ No se pudo encontrar el juego de dados. Por favor, inténtalo de nuevo.
        </div>
      </div>
    );
  }

  return (
    <div className="dados-game h-full">
      <div className="casino-container">
        <div className="main-game">
          {/* Balance Display - Más prominente */}
          <div className="dados-balance-display dados-balance-prominent">
            <div className="dados-balance-main">
              <span className="dados-balance-icon">💰</span>
              <span className="dados-balance-amount">Balance: ${balance.toFixed(2)}</span>
            </div>
            {betting.currentMatch && (
              <div className="dados-match-indicator">
                🎮 Partida activa: ${betting.currentMatch.betAmount.toFixed(2)}
              </div>
            )}
          </div>

          {/* Resultado del último juego - Información detallada */}
          {lastGameResult && (
            <div className={`dados-last-result ${lastGameResult.isWin ? 'win' : 'lose'}`}>
              <div className="dados-result-header">
                {lastGameResult.isWin ? '🎉 ¡GANASTE!' : '😞 Perdiste'}
              </div>
              <div className="dados-result-details">
                <div className="dados-result-dice-info">
                  🎲 Salieron: {lastGameResult.diceNumbers.map(num => `[${num}]`).join(' ')}
                </div>
                <div className="dados-result-money">
                  {lastGameResult.isWin 
                    ? `💰 Ganaste: $${lastGameResult.winAmount.toFixed(2)}` 
                    : `💸 Perdiste: $${lastGameResult.betAmount.toFixed(2)}`
                  }
                </div>
                <div className="dados-result-bet">
                  🎯 Apuesta: {lastGameResult.betType}
                </div>
              </div>
            </div>
          )}

          <GameModeSelector
            currentMode={gameState.gameMode}
            onModeChange={handleModeChange}
            isRolling={gameState.isRolling || betting.isPlacingBet || betting.isFinishingGame}
          />

          <DiceDisplay 
            dice={diceResults} 
            isRolling={gameState.isRolling || betting.isPlacingBet || betting.isFinishingGame} 
          />

          <div className="game-info">
            <div className="target-info">
              {gameState.currentBet.type 
                ? `🎯 Apuesta actual: ${gameState.currentBet.type} - Pago: ${gameState.currentBet.payout}:1 (Apostando: $${gameState.currentBet.amount.toFixed(2)})`
                : '🎯 Selecciona una apuesta para empezar'
              }
            </div>
            
            {/* Información de estado actual */}
            {betting.currentMatch && (
              <div className="dados-current-status">
                🎮 Tienes una partida activa por $${betting.currentMatch.betAmount.toFixed(2)}
              </div>
            )}
            
            {showResult && (
              <div className={`result-message ${resultMessage.includes('GANASTE') ? 'win' : 'lose'}`}>
                {resultMessage}
              </div>
            )}
            
            {/* Error messages */}
            {betting.betError && (
              <div className="dados-error-message">
                ❌ {betting.betError.message}
              </div>
            )}
            {betting.finishError && (
              <div className="dados-error-message">
                ❌ {betting.finishError.message}
              </div>
            )}
            
            {/* Información de balance insuficiente */}
            {hasInsufficientFunds(gameState.selectedAmount) && (
              <div className="dados-insufficient-funds">
                ⚠️ Saldo insuficiente. Necesitas $${gameState.selectedAmount.toFixed(2)} pero tienes $${balance.toFixed(2)}
              </div>
            )}
          </div>

          <BettingPanel
            gameMode={gameState.gameMode}
            bettingOptions={currentOptions}
            selectedAmount={gameState.selectedAmount}
            currentBet={gameState.currentBet}
            balance={balance}
            isRolling={gameState.isRolling || betting.isPlacingBet || betting.isFinishingGame}
            onPlaceBet={handlePlaceBet}
            onAmountChange={handleAmountChange}
          />

          <div className="game-controls">
            <button
              className="game-btn roll-btn"
              onClick={handleRollDice}
              disabled={
                gameState.isRolling || 
                betting.isPlacingBet || 
                betting.isFinishingGame || 
                !gameState.currentBet.type || 
                !betting.currentMatch ||
                hasInsufficientFunds(gameState.currentBet.amount)
              }
            >
              {gameState.isRolling || betting.isFinishingGame ? '🎲 Procesando...' : '🎲 Tirar Dados'}
            </button>
            <button
              className="game-btn reset-btn"
              onClick={handleResetGame}
              disabled={gameState.isRolling || betting.isPlacingBet || betting.isFinishingGame}
            >
              🔄 Reiniciar
            </button>
          </div>
        </div>

        <GameStats gameState={gameState} />
      </div>

      {/* Game End Modal */}
      {showModal && modalData && (
        <GameEndModal
          isOpen={showModal}
          isWin={modalData.isWin}
          diceResults={modalData.diceResults}
          betType={modalData.betType}
          betAmount={modalData.betAmount}
          winAmount={modalData.winAmount}
          onContinue={handleModalContinue}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
};

export default DadosGame;
