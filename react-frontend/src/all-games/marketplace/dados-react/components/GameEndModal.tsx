import React from 'react';

interface GameEndModalProps {
  isOpen: boolean;
  isWin: boolean;
  diceResults: number[];
  betType: string;
  betAmount: number;
  winAmount: number;
  onContinue: () => void;
  onClose: () => void;
}

export const GameEndModal: React.FC<GameEndModalProps> = ({
  isOpen,
  isWin,
  diceResults,
  betType,
  betAmount,
  winAmount,
  onContinue,
  onClose
}) => {
  if (!isOpen) return null;

  const getDiceEmoji = (value: number) => {
    const diceEmojis = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
    return diceEmojis[value - 1] || '🎲';
  };

  const getResultColor = () => {
    return isWin ? '#22c55e' : '#ef4444'; // green for win, red for lose
  };

  return (
    <div className="dados-modal-overlay">
      <div className="dados-modal-content">
        <div className="dados-modal-header">
          <h2 style={{ color: getResultColor() }}>
            {isWin ? '🎉 ¡GANASTE!' : '😞 Perdiste'}
          </h2>
        </div>

        <div className="dados-modal-body">
          <div className="dados-result-display">
            <h3>Resultado de los dados:</h3>
            <div className="dados-result-dice">
              {diceResults.map((value, index) => (
                <span key={`dice-${value}-${index}`} className="dice-result-emoji">
                  {getDiceEmoji(value)}
                </span>
              ))}
            </div>
            <div className="dados-result-values">
              Valores: {diceResults.join(' + ')} = {diceResults.reduce((sum, val) => sum + val, 0)}
            </div>
          </div>

          <div className="dados-bet-info">
            <p><strong>Apuesta:</strong> {betType}</p>
            <p><strong>Cantidad apostada:</strong> ${betAmount}</p>
            {isWin ? (
              <p style={{ color: getResultColor() }}>
                <strong>Ganancia:</strong> ${winAmount}
              </p>
            ) : (
              <p style={{ color: getResultColor() }}>
                <strong>Pérdida:</strong> ${betAmount}
              </p>
            )}
          </div>
        </div>

        <div className="dados-modal-footer">
          <button 
            className="dados-btn dados-btn-primary" 
            onClick={onContinue}
          >
            Continuar Jugando
          </button>
          <button 
            className="dados-btn dados-btn-secondary" 
            onClick={onClose}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
