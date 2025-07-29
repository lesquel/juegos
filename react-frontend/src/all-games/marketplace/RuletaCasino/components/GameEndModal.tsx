import React from 'react';

interface GameEndModalProps {
  isOpen: boolean;
  isWin: boolean;
  winAmount: number;
  winningNumber: number | null;
  currentBalance: number;
  onNewGame: () => void;
  onQuitGame: () => void;
  isNewGameLoading?: boolean;
  isQuitLoading?: boolean;
  canContinue: boolean;
}

export function GameEndModal({
  isOpen,
  isWin,
  winAmount,
  winningNumber,
  currentBalance,
  onNewGame,
  onQuitGame,
  isNewGameLoading = false,
  isQuitLoading = false,
  canContinue
}: GameEndModalProps) {
  if (!isOpen) return null;

  const getNumberColor = (num: number | null): string => {
    if (num === null || num === 0) return 'green';
    const redNumbers = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
    return redNumbers.includes(num) ? 'red' : 'black';
  };

  const getResultMessage = (): string => {
    if (isWin) {
      return winAmount > 0 ? '¡Felicitaciones!' : '¡Buen intento!';
    }
    return 'No hubo suerte esta vez';
  };

  const getResultDescription = (): string => {
    if (winningNumber !== null) {
      const color = getNumberColor(winningNumber);
      const colorName = color === 'red' ? 'Rojo' : color === 'black' ? 'Negro' : 'Verde';
      return `Salió el ${winningNumber} (${colorName})`;
    }
    return '';
  };

  return (
    <div className="roulette-game-end-modal-overlay">
      <div className="roulette-game-end-modal">
        <div className="roulette-modal-header">
          <h2>🎰 Fin de la Ronda 🎰</h2>
        </div>

        <div className="roulette-modal-content">
          <div className={`roulette-result ${isWin ? 'win-result' : 'lose-result'}`}>
            <h3>{getResultMessage()}</h3>
            {winningNumber !== null && (
              <div className="winning-number-display">
                <div className={`modal-winning-number ${getNumberColor(winningNumber)}`}>
                  {winningNumber}
                </div>
                <p className="winning-number-desc">{getResultDescription()}</p>
              </div>
            )}
            {isWin && winAmount > 0 && (
              <p className="win-message">¡Ganaste esta ronda!</p>
            )}
          </div>

          {winAmount > 0 && (
            <div className="roulette-modal-win-amount">
              Ganancia: +{winAmount.toLocaleString()} monedas
            </div>
          )}

          <div className="roulette-current-balance">
            <p>Saldo actual: {currentBalance.toLocaleString()} monedas</p>
          </div>

          {!canContinue && (
            <div className="roulette-insufficient-funds-warning">
              ⚠️ Saldo insuficiente para continuar jugando
            </div>
          )}
        </div>

        <div className="roulette-modal-actions">
          <button
            className="roulette-new-game-button"
            onClick={onNewGame}
            disabled={isNewGameLoading || isQuitLoading || !canContinue}
          >
            {isNewGameLoading ? (
              <>🔄 Iniciando...</>
            ) : (
              <>🎯 Nueva Ronda</>
            )}
          </button>

          <button
            className="roulette-quit-game-button"
            onClick={onQuitGame}
            disabled={isNewGameLoading || isQuitLoading}
          >
            {isQuitLoading ? (
              <>⏳ Saliendo...</>
            ) : (
              <>🚪 Salir del Juego</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
