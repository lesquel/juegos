import React, { useState, useCallback, useMemo } from 'react';
import './MaquinaTragamonedasStyles.css';
import { useTragamonedasGameId, useTragamonedasBetting, useTragamonedasBalance } from './services/tragamonedasBettingService';

// Símbolos de la máquina tragamonedas
const SYMBOLS = ['🍒', '🍋', '🔔', '⭐', '💎', '7️⃣', '🍀'];

const SYMBOL_VALUES = {
  '🍒': 2,
  '🍋': 3,
  '🔔': 5,
  '⭐': 10,
  '💎': 20,
  '7️⃣': 50,
  '🍀': 100
} as const;

const PAYLINES = [
  // Líneas horizontales
  [[0, 0], [0, 1], [0, 2]], // Línea superior
  [[1, 0], [1, 1], [1, 2]], // Línea media
  [[2, 0], [2, 1], [2, 2]], // Línea inferior
  // Líneas diagonales
  [[0, 0], [1, 1], [2, 2]], // Diagonal principal
  [[2, 0], [1, 1], [0, 2]], // Diagonal inversa
] as const;

interface GameResult {
  reels: string[][];
  winAmount: number;
  isWin: boolean;
  betAmount: number;
  winningLines: number[];
}

const MaquinaTragamonedasGame: React.FC = () => {
  // Backend integration
  const { tragamonedasGameId, isLoading: isGameIdLoading } = useTragamonedasGameId();
  const betting = useTragamonedasBetting(tragamonedasGameId || "");
  const { balance, isLoading: isBalanceLoading, hasInsufficientFunds } = useTragamonedasBalance();
  
  // Game state
  const [bet, setBet] = useState(10);
  const [reels, setReels] = useState<string[][]>([
    ['🍒', '🍒', '🍒'],
    ['🍋', '🍋', '🍋'],
    ['🔔', '🔔', '🔔']
  ]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [winAmount, setWinAmount] = useState(0);
  const [winningLines, setWinningLines] = useState<number[]>([]);
  const [showWinAnimation, setShowWinAnimation] = useState(false);
  const [message, setMessage] = useState('¡Presiona SPIN para jugar!');
  const [lastGameResult, setLastGameResult] = useState<GameResult | null>(null);

  // Función para generar un símbolo aleatorio con probabilidades
  const getRandomSymbol = useCallback((): string => {
    const weights = [30, 25, 20, 15, 7, 2, 1]; // Probabilidades decrecientes
    const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
    let random = Math.random() * totalWeight;
    
    for (let i = 0; i < SYMBOLS.length; i++) {
      random -= weights[i];
      if (random <= 0) {
        return SYMBOLS[i];
      }
    }
    return SYMBOLS[0];
  }, []);

  // Función para generar los carretes
  const generateReels = useCallback((): string[][] => {
    return Array.from({ length: 3 }, () =>
      Array.from({ length: 3 }, () => getRandomSymbol())
    );
  }, [getRandomSymbol]);

  // Función para verificar líneas ganadoras
  const checkWinningLines = useCallback((gameReels: string[][]): { winningLines: number[], totalWin: number } => {
    const winningLinesFound: number[] = [];
    let totalWin = 0;

    PAYLINES.forEach((line, index) => {
      const symbols = line.map(([row, col]) => gameReels[row][col]);
      
      // Verificar si todos los símbolos son iguales
      if (symbols[0] === symbols[1] && symbols[1] === symbols[2]) {
        winningLinesFound.push(index);
        const symbolValue = SYMBOL_VALUES[symbols[0] as keyof typeof SYMBOL_VALUES] || 1;
        totalWin += symbolValue * bet;
      }
    });

    return { winningLines: winningLinesFound, totalWin };
  }, [bet]);

  // Función para verificar si un símbolo está en línea ganadora
  const isSymbolWinning = useCallback((reelIndex: number, symbolIndex: number): boolean => {
    return winningLines.some(lineIndex => 
      PAYLINES[lineIndex].some(([row, col]) => 
        row === reelIndex && col === symbolIndex
      )
    );
  }, [winningLines]);

  // Función principal de giro
  const spin = useCallback(async () => {
    if (isSpinning || betting.isPlacingBet || !tragamonedasGameId) return;
    
    // Verificar saldo suficiente
    if (hasInsufficientFunds(bet)) {
      setMessage('¡Saldo insuficiente!');
      return;
    }

    setIsSpinning(true);
    setWinAmount(0);
    setWinningLines([]);
    setShowWinAnimation(false);
    setMessage('Girando...');

    try {
      // Crear match en el backend
      const betData = {
        betAmount: bet,
        gameId: tragamonedasGameId,
      };

      await betting.placeBet.mutateAsync(betData);
      console.log("🎰 Apuesta realizada exitosamente");

      // Animación de giro realista
      const spinDuration = 2000;
      const intervalTime = 100;
      const intervals = spinDuration / intervalTime;

      // Animar los carretes
      for (let i = 0; i < intervals; i++) {
        await new Promise(resolve => setTimeout(resolve, intervalTime));
        setReels(generateReels());
      }

      // Resultado final
      const finalReels = generateReels();
      setReels(finalReels);

      // Verificar ganancias
      const { winningLines: lines, totalWin } = checkWinningLines(finalReels);
      
      // Procesar resultado después de la animación
      setTimeout(async () => {
        setWinningLines(lines);
        setWinAmount(totalWin);
        
        const isWin = totalWin > 0;
        const isJackpot = lines.length === PAYLINES.length;

        // Finalizar match en el backend
        const gameResult = {
          win: isWin,
          winAmount: totalWin,
          totalBet: bet,
          reels: finalReels,
          winningLines: lines,
          isJackpot: isJackpot,
        };

        try {
          await betting.finishGame.mutateAsync(gameResult);
          console.log(`🎰 Juego finalizado - ${isWin ? 'GANASTE' : 'PERDISTE'}: $${totalWin}`);
          
          // Guardar resultado para mostrar información
          setLastGameResult({
            reels: finalReels,
            winAmount: totalWin,
            isWin: isWin,
            betAmount: bet,
            winningLines: lines,
          });

        } catch (error) {
          console.error('❌ Error finishing match:', error);
          setMessage('Error al finalizar la partida');
        }
        
        // Mostrar mensaje de resultado
        if (isWin) {
          setShowWinAnimation(true);
          
          if (isJackpot) {
            setMessage(`🎉 ¡JACKPOT! ¡Ganaste $${totalWin}! 🎉`);
          } else {
            setMessage(`🎊 ¡Ganaste $${totalWin}! 🎊`);
          }
        } else {
          setMessage('¡Inténtalo de nuevo!');
        }
        
        setIsSpinning(false);
      }, 500);

    } catch (error) {
      console.error('❌ Error spinning reels:', error);
      setMessage('Error al girar');
      setIsSpinning(false);
    }
  }, [bet, isSpinning, betting, tragamonedasGameId, hasInsufficientFunds, generateReels, checkWinningLines]);

  // Función para ajustar apuesta
  const adjustBet = useCallback((amount: number) => {
    const newBet = bet + amount;
    if (newBet >= 1 && newBet <= balance && newBet <= 100) {
      setBet(newBet);
    }
  }, [bet, balance]);

  // Función para reset del juego
  const resetGame = useCallback(() => {
    setBet(10);
    setWinAmount(0);
    setWinningLines([]);
    setShowWinAnimation(false);
    setMessage('¡Presiona SPIN para jugar!');
    setLastGameResult(null);
    setReels([
      ['🍒', '🍒', '🍒'],
      ['🍋', '🍋', '🍋'],
      ['🔔', '🔔', '🔔']
    ]);
  }, []);

  // Estados de carga
  const isLoading = isGameIdLoading || isBalanceLoading;
  const canSpin = !isSpinning && !betting.isPlacingBet && !betting.isFinishingGame && balance >= bet;

  // Memoizar la tabla de pagos
  const paytableEntries = useMemo(() => 
    Object.entries(SYMBOL_VALUES).map(([symbol, value]) => ({ symbol, value })),
    []
  );

  // Loading states
  if (isLoading) {
    return (
      <div className="maquina-tragamonedas">
        <div className="tragamonedas-container">
          <div className="tragamonedas-loading">
            <h2>🎰 Cargando Tragamonedas...</h2>
            <p>Conectando con el servidor...</p>
            <div className="loading-spinner"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!tragamonedasGameId) {
    return (
      <div className="maquina-tragamonedas">
        <div className="tragamonedas-container">
          <div className="tragamonedas-error">
            <h2>❌ Error</h2>
            <p>No se pudo encontrar el juego de tragamonedas.</p>
            <p>Por favor, contacta al administrador.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="maquina-tragamonedas">
      <div className="tragamonedas-container">
        {/* Header */}
        <div className="tragamonedas-header">
          <h1>🎰 MÁQUINA TRAGAMONEDAS 🎰</h1>
          <div className="balance-display">
            <span className="balance-label">Balance:</span>
            <span className="balance-amount">${balance.toLocaleString()}</span>
          </div>
        </div>

        {/* Estados del match */}
        {betting.currentMatch && (
          <div className="tragamonedas-betting-status">
            <div className="tragamonedas-current-match">
              🎰 Match activo - Apuesta: ${betting.currentMatch.betAmount}
            </div>
          </div>
        )}

        {/* Estados de loading */}
        {betting.isPlacingBet && (
          <div className="tragamonedas-betting-loading">
            ⏳ Creando apuesta...
          </div>
        )}

        {betting.isFinishingGame && (
          <div className="tragamonedas-finishing-loading">
            🏁 Finalizando partida...
          </div>
        )}

        {/* Información del último resultado */}
        {lastGameResult && (
          <div className="tragamonedas-last-result">
            <h3>🎯 Último Resultado</h3>
            <div className="result-info">
              <div className="result-outcome">
                <span className={`result-status ${lastGameResult.isWin ? 'win' : 'lose'}`}>
                  {lastGameResult.isWin ? '🎉 GANASTE' : '😞 Perdiste'}
                </span>
                <span className="result-money">
                  {lastGameResult.isWin 
                    ? `+$${lastGameResult.winAmount.toLocaleString()}` 
                    : `-$${lastGameResult.betAmount.toLocaleString()}`
                  }
                </span>
              </div>
              <div className="result-details">
                <span>Apuesta: ${lastGameResult.betAmount.toLocaleString()}</span>
                {lastGameResult.winningLines.length > 0 && (
                  <span>Líneas ganadoras: {lastGameResult.winningLines.length}</span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Máquina principal */}
        <div className="slot-machine">
          <div className="machine-frame">
            {/* Carretes */}
            <div className={`reels-container ${isSpinning ? 'spinning' : ''}`}>
              {reels.map((reel, reelIndex) => (
                <div key={`reel-${reelIndex}`} className="reel">
                  {reel.map((symbol, symbolIndex) => (
                    <div
                      key={`symbol-${reelIndex}-${symbolIndex}`}
                      className={`symbol ${isSymbolWinning(reelIndex, symbolIndex) ? 'winning' : ''}`}
                    >
                      {symbol}
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {/* Líneas ganadoras visuales */}
            {winningLines.map(lineIndex => (
              <div
                key={`payline-${lineIndex}`}
                className={`payline payline-${lineIndex} ${showWinAnimation ? 'active' : ''}`}
              />
            ))}
          </div>

          {/* Panel de resultados */}
          <div className="results-panel">
            <div className={`message ${showWinAnimation ? 'winning' : ''}`}>
              {message}
            </div>
            {winAmount > 0 && (
              <div className="win-amount">
                <span className="win-label">Ganancia:</span>
                <span className="win-value">${winAmount.toLocaleString()}</span>
              </div>
            )}
          </div>
        </div>

        {/* Controles */}
        <div className="controls">
          {/* Control de apuesta */}
          <div className="bet-controls">
            <label>Apuesta: ${bet.toLocaleString()}</label>
            <div className="bet-buttons">
              <button
                onClick={() => adjustBet(-1)}
                disabled={bet <= 1}
                className="bet-btn decrease"
                aria-label="Disminuir apuesta"
              >
                -
              </button>
              <button
                onClick={() => adjustBet(1)}
                disabled={bet >= Math.min(balance, 100)}
                className="bet-btn increase"
                aria-label="Aumentar apuesta"
              >
                +
              </button>
            </div>
          </div>

          {/* Botón de giro */}
          <button
            onClick={spin}
            disabled={!canSpin}
            className={`spin-button ${isSpinning ? 'spinning' : ''}`}
            aria-label={isSpinning ? 'Girando' : 'Girar carretes'}
          >
            {isSpinning ? '🌀 GIRANDO...' : '🎰 SPIN'}
          </button>

          {/* Botón de reset */}
          <button
            onClick={resetGame}
            className="reset-button"
            aria-label="Reiniciar juego"
          >
            🔄 RESET
          </button>
        </div>

        {/* Tabla de pagos */}
        <div className="paytable">
          <h3>💰 Tabla de Pagos (por línea)</h3>
          <div className="paytable-grid">
            {paytableEntries.map(({ symbol, value }) => (
              <div key={`paytable-${symbol}`} className="paytable-row">
                <span className="paytable-symbol">{symbol} {symbol} {symbol}</span>
                <span className="paytable-value">{value}x</span>
              </div>
            ))}
          </div>
          <div className="paytable-info">
            <p>💡 Obtén 3 símbolos iguales en una línea para ganar</p>
            <p>🎯 5 líneas de pago disponibles</p>
            <p>💰 El balance se actualiza automáticamente</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaquinaTragamonedasGame;
