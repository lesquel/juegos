import React, { useState, useCallback, useMemo } from 'react';
import './MaquinaTragamonedasStyles.css';
import { 
  useTragamonedasGameId, 
  useTragamonedasBetting,
  useTragamonedasBalance,
  type TragamonedasGameResult 
} from './services/tragamonedasBettingService';

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
  // Hooks para backend integration
  const { tragamonedasGameId, isLoading: isLoadingGameId } = useTragamonedasGameId();
  const { balance, isLoading: isLoadingBalance, hasInsufficientFunds } = useTragamonedasBalance();
  
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
  const [lastGameResult, setLastGameResult] = useState<TragamonedasGameResult | null>(null);

  // Backend betting hooks - solo inicializar si tenemos gameId
  const bettingHooks = useTragamonedasBetting(tragamonedasGameId || "");
  const {
    placeBet,
    finishGame,
    isPlacingBet,
    isFinishingGame,
    betError,
    finishError,
  } = bettingHooks;

  // Loading states
  const isLoading = isLoadingGameId || isLoadingBalance;
  const canSpin = !isSpinning && !isPlacingBet && !isFinishingGame && !hasInsufficientFunds(bet) && tragamonedasGameId;

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

  // Función principal de giro usando backend
  const spin = useCallback(async () => {
    if (!canSpin || !tragamonedasGameId) {
      if (!tragamonedasGameId) {
        setMessage('⚠️ Error: Juego no encontrado');
      } else if (hasInsufficientFunds(bet)) {
        setMessage('💰 Saldo insuficiente');
      }
      return;
    }
    
    setIsSpinning(true);
    setWinAmount(0);
    setWinningLines([]);
    setShowWinAnimation(false);
    setMessage('🎰 Creando apuesta...');

    try {
      // Crear match en el backend
      await placeBet.mutateAsync({
        betAmount: bet,
        gameId: tragamonedasGameId
      });

      setMessage('🎲 Girando...');

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
        const multiplier = isWin ? (totalWin / bet) : -1;
        
        // Crear resultado para el backend
        const gameResult: TragamonedasGameResult = {
          win: isWin,
          winAmount: totalWin,
          reels: finalReels,
          winningLines: lines,
          totalBet: bet,
          multiplier: multiplier,
          isJackpot: lines.length === PAYLINES.length
        };
        
        // Guardar resultado para mostrar información
        setLastGameResult(gameResult);
        
        try {
          // Finalizar match en el backend
          console.log("🎰 Enviando resultado a backend:", {
            gameResult,
            currentBalance: balance,
            expectedChange: isWin ? `+${totalWin}` : `-${bet}`
          });
          
          await finishGame.mutateAsync(gameResult);
          
          console.log("✅ Match finalizado, saldo debería actualizarse automáticamente");
          
          // Mostrar mensaje de resultado
          if (isWin) {
            setShowWinAnimation(true);
            
            if (lines.length === PAYLINES.length) {
              setMessage(`🎉 ¡JACKPOT! ¡Ganaste $${totalWin}! 🎉`);
            } else {
              setMessage(`🎊 ¡Ganaste $${totalWin}! 🎊`);
            }
          } else {
            setMessage('😞 ¡Inténtalo de nuevo!');
          }
          
        } catch (finishError) {
          console.error('❌ Error al finalizar match:', finishError);
          setMessage('⚠️ Error al procesar resultado');
        }
        
        setIsSpinning(false);
      }, 500);

    } catch (error) {
      console.error('❌ Error al crear apuesta:', error);
      setMessage('❌ Error al crear apuesta');
      setIsSpinning(false);
    }
  }, [bet, canSpin, tragamonedasGameId, hasInsufficientFunds, placeBet, generateReels, checkWinningLines, finishGame]);

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

  // Memoizar la tabla de pagos
  const paytableEntries = useMemo(() => 
    Object.entries(SYMBOL_VALUES).map(([symbol, value]) => ({ symbol, value })),
    []
  );

  // Mostrar loading si está cargando los datos del backend
  if (isLoading) {
    return (
      <div className="maquina-tragamonedas">
        <div className="tragamonedas-container">
          <div className="tragamonedas-header">
            <h1>🎰 MÁQUINA TRAGAMONEDAS 🎰</h1>
            <div className="message">
              {isLoadingGameId ? '🔍 Cargando juego...' : '💰 Cargando saldo...'}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Mostrar error si no se encuentra el juego
  if (!tragamonedasGameId) {
    return (
      <div className="maquina-tragamonedas">
        <div className="tragamonedas-container">
          <div className="tragamonedas-header">
            <h1>🎰 MÁQUINA TRAGAMONEDAS 🎰</h1>
            <div className="message">
              ⚠️ Error: No se pudo encontrar el juego de tragamonedas
            </div>
            <button 
              onClick={() => window.history.back()} 
              className="reset-button"
            >
              🔄 Volver
            </button>
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

        {/* Información del último resultado */}
        {lastGameResult && (
          <div className="tragamonedas-last-result">
            <h3>🎯 Último Resultado</h3>
            <div className="result-info">
              <div className="result-outcome">
                <span className={`result-status ${lastGameResult.win ? 'win' : 'lose'}`}>
                  {lastGameResult.win ? '🎉 GANASTE' : '😞 Perdiste'}
                </span>
                <span className="result-money">
                  {lastGameResult.win 
                    ? `+$${lastGameResult.winAmount.toLocaleString()}` 
                    : `-$${lastGameResult.totalBet.toLocaleString()}`
                  }
                </span>
              </div>
              <div className="result-details">
                <span>Apuesta: ${lastGameResult.totalBet.toLocaleString()}</span>
                {lastGameResult.winningLines.length > 0 && (
                  <span>Líneas ganadoras: {lastGameResult.winningLines.length}</span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Mostrar errores de betting */}
        {(betError || finishError) && (
          <div className="tragamonedas-last-result">
            <h3>⚠️ Error</h3>
            <div className="result-info">
              <div className="result-outcome">
                <span className="result-status lose">
                  {betError ? '❌ Error al crear apuesta' : '❌ Error al finalizar'}
                </span>
              </div>
              <div className="result-details">
                <span>{(betError as Error)?.message || (finishError as Error)?.message || 'Error desconocido'}</span>
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
                <div key={`reel-col-${reelIndex}`} className="reel">
                  {reel.map((symbol, symbolIndex) => (
                    <div
                      key={`symbol-${reelIndex}-${symbolIndex}-${symbol}`}
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
            className={`spin-button ${(isSpinning || isPlacingBet || isFinishingGame) ? 'spinning' : ''}`}
            aria-label={isSpinning ? 'Girando' : 'Girar carretes'}
          >
            {(() => {
              if (isPlacingBet) return '🎰 APOSTANDO...';
              if (isSpinning) return '🌀 GIRANDO...';
              if (isFinishingGame) return '💰 FINALIZANDO...';
              return '🎰 SPIN';
            })()}
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
