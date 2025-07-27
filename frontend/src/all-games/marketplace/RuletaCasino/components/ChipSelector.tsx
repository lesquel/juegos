import React from 'react';
import { RouletteGameLogic } from '../logic/RouletteGameLogic';

interface ChipSelectorProps {
  selectedChip: number;
  balance: number;
  onChipChange: (chipValue: number) => void;
  disabled: boolean;
}

export function ChipSelector({ selectedChip, balance, onChipChange, disabled }: ChipSelectorProps) {
  
  const renderChips = () => {
    return RouletteGameLogic.CONFIG.CHIP_VALUES.map(value => {
      const canAfford = RouletteGameLogic.canAffordBet(balance, value);
      const isSelected = selectedChip === value;
      
      return (
        <button
          key={value}
          className={`chip ${isSelected ? 'selected' : ''} ${!canAfford ? 'unavailable' : ''}`}
          onClick={() => onChipChange(value)}
          disabled={disabled || !canAfford}
          style={{ background: RouletteGameLogic.getChipColor(value) }}
          title={`Ficha de ${RouletteGameLogic.formatCurrency(value)}${!canAfford ? ' (Saldo insuficiente)' : ''}`}
        >
          <div className="chip-value">
            {RouletteGameLogic.formatCurrency(value)}
          </div>
          <div className="chip-decoration">
            {value >= 100 ? '💎' : value >= 25 ? '⭐' : value >= 5 ? '🔥' : '💫'}
          </div>
        </button>
      );
    });
  };

  const getSelectedChipInfo = () => {
    const canAfford = RouletteGameLogic.canAffordBet(balance, selectedChip);
    const maxBets = Math.floor(balance / selectedChip);

    return (
      <div className="chip-info">
        <div className="selected-info">
          <span className="info-label">Ficha seleccionada:</span>
          <span className="info-value" style={{ color: canAfford ? '#2ecc71' : '#e74c3c' }}>
            {RouletteGameLogic.formatCurrency(selectedChip)}
          </span>
        </div>
        {canAfford ? (
          <div className="max-bets">
            Puedes apostar hasta {maxBets} veces
          </div>
        ) : (
          <div className="insufficient-balance">
            ⚠️ Saldo insuficiente para esta ficha
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="chip-selector">
      <h3>🎰 Selecciona tu Ficha</h3>
      
      <div className="chips-container">
        {renderChips()}
      </div>

      {getSelectedChipInfo()}

      <div className="chip-tips">
        <h4>💡 Consejos:</h4>
        <ul>
          <li>Empieza con fichas pequeñas para conocer el juego</li>
          <li>Las fichas más grandes tienen mayor riesgo y recompensa</li>
          <li>Puedes cambiar de ficha en cualquier momento</li>
        </ul>
      </div>
    </div>
  );
}
