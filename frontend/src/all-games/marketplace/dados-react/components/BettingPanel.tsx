import React from 'react';
import type { BetOption, GameMode } from '../types/DadosTypes';

interface BettingPanelProps {
  gameMode: GameMode;
  bettingOptions: BetOption[];
  selectedAmount: number;
  currentBet: { type: string | null; amount: number; payout: number };
  balance: number;
  isRolling: boolean;
  onPlaceBet: (betType: string, payout: number) => void;
  onAmountChange: (amount: number) => void;
}

export const BettingPanel: React.FC<BettingPanelProps> = ({
  gameMode,
  bettingOptions,
  selectedAmount,
  currentBet,
  balance,
  isRolling,
  onPlaceBet,
  onAmountChange
}) => {
  const betAmounts = [1, 5, 10, 25, 50, 100];

  return (
    <div className="betting-area">
      <div className="betting-options">
        <h3>Opciones de Apuesta - {gameMode.toUpperCase()}</h3>
        <div className="bet-grid">
          {bettingOptions.map((option) => (
            <button
              key={option.id}
              className={`bet-option ${currentBet.type === option.id ? 'selected' : ''}`}
              onClick={() => onPlaceBet(option.id, option.payout)}
              disabled={isRolling || balance < selectedAmount}
            >
              <div className="bet-label">{option.label}</div>
              <div className="bet-payout">{option.payout}:1</div>
              <div className="bet-description">{option.description}</div>
              <div className="bet-probability">{option.probability.toFixed(1)}%</div>
            </button>
          ))}
        </div>
      </div>

      <div className="bet-amount-selector">
        <h4>Cantidad de Apuesta</h4>
        <div className="amount-chips">
          {betAmounts.map((amount) => (
            <button
              key={amount}
              className={`amount-chip ${selectedAmount === amount ? 'selected' : ''} ${
                balance < amount ? 'disabled' : ''
              }`}
              onClick={() => onAmountChange(amount)}
              disabled={isRolling || balance < amount}
            >
              ${amount}
            </button>
          ))}
        </div>
      </div>

      {currentBet.type && (
        <div className="current-bet-info">
          <h4>Apuesta Actual</h4>
          <div className="bet-details">
            <span>Tipo: {currentBet.type}</span>
            <span>Cantidad: ${currentBet.amount}</span>
            <span>Pago: {currentBet.payout}:1</span>
            <span>Ganancia Potencial: ${currentBet.amount * currentBet.payout}</span>
          </div>
        </div>
      )}
    </div>
  );
};
