import React from 'react';
import { HorseRacingLogic } from '../logic/HorseRacingLogic';
import type { Horse, BetType } from '../types/HorseRacingTypes';

interface BettingPanelProps {
  balance: number;
  selectedHorse: number | null;
  selectedAmount: number;
  selectedBetType: BetType;
  horses: Horse[];
  disabled: boolean;
  onSelectHorse: (horseId: number) => void;
  onChangeBetAmount: (amount: number) => void;
  onChangeBetType: (betType: BetType) => void;
}

export function BettingPanel({
  balance,
  selectedHorse,
  selectedAmount,
  selectedBetType,
  horses,
  disabled,
  onSelectHorse,
  onChangeBetAmount,
  onChangeBetType
}: BettingPanelProps) {

  const renderHorseCards = () => {
    return horses.map(horse => {
      const isSelected = selectedHorse === horse.id;
      
      return (
        <button
          key={horse.id}
          className={`horse-card ${isSelected ? 'selected' : ''} ${disabled ? 'disabled' : ''}`}
          onClick={() => !disabled && onSelectHorse(horse.id)}
          disabled={disabled}
          type="button"
        >
          <div className="horse-header">
            <div className="horse-number">#{horse.id}</div>
            <div className="horse-odds">{horse.odds}:1</div>
          </div>
          
          <div className="horse-display">
            <div className="horse-emoji" style={{ color: horse.color }}>
              {horse.emoji}
            </div>
            <div className="horse-name">{horse.name}</div>
          </div>
          
          <div className="horse-stats">
            <div className="stat">
              <span className="stat-label">Velocidad</span>
              <div className="stat-bar">
                <div 
                  className="stat-fill" 
                  style={{ width: `${horse.speed}%`, backgroundColor: '#00ff88' }}
                ></div>
              </div>
              <span className="stat-value">{horse.speed}</span>
            </div>
            
            <div className="stat">
              <span className="stat-label">Resistencia</span>
              <div className="stat-bar">
                <div 
                  className="stat-fill" 
                  style={{ width: `${horse.stamina}%`, backgroundColor: '#00ccff' }}
                ></div>
              </div>
              <span className="stat-value">{horse.stamina}</span>
            </div>
            
            <div className="stat">
              <span className="stat-label">Suerte</span>
              <div className="stat-bar">
                <div 
                  className="stat-fill" 
                  style={{ width: `${horse.luck}%`, backgroundColor: '#ffd700' }}
                ></div>
              </div>
              <span className="stat-value">{horse.luck}</span>
            </div>
          </div>
          
          {isSelected && (
            <div className="selected-indicator">
              ✓ SELECCIONADO
            </div>
          )}
        </button>
      );
    });
  };

  const renderBetAmounts = () => {
    return HorseRacingLogic.CONFIG.BET_AMOUNTS.map(amount => {
      const canAfford = balance >= amount;
      const isSelected = selectedAmount === amount;
      
      return (
        <button
          key={amount}
          className={`bet-amount-btn ${isSelected ? 'selected' : ''} ${!canAfford || disabled ? 'disabled' : ''}`}
          onClick={() => !disabled && canAfford && onChangeBetAmount(amount)}
          disabled={!canAfford || disabled}
          title={canAfford ? `Apostar ${HorseRacingLogic.formatCurrency(amount)}` : 'Saldo insuficiente'}
        >
          {HorseRacingLogic.formatCurrency(amount)}
        </button>
      );
    });
  };

  const renderBetTypes = () => {
    const betTypes: { type: BetType; name: string; payout: number }[] = [
      { type: 'win', name: 'Ganar', payout: HorseRacingLogic.BET_PAYOUTS.win },
      { type: 'place', name: 'Lugar', payout: HorseRacingLogic.BET_PAYOUTS.place },
      { type: 'show', name: 'Show', payout: HorseRacingLogic.BET_PAYOUTS.show }
    ];

    return betTypes.map(bet => {
      const isSelected = selectedBetType === bet.type;
      
      return (
        <button
          key={bet.type}
          className={`bet-type-btn ${isSelected ? 'selected' : ''} ${disabled ? 'disabled' : ''}`}
          onClick={() => !disabled && onChangeBetType(bet.type)}
          disabled={disabled}
          title={HorseRacingLogic.getBetTypeDescription(bet.type)}
        >
          <div className="bet-type-name">{bet.name}</div>
          <div className="bet-type-payout">{bet.payout}:1</div>
          <div className="bet-type-description">
            {HorseRacingLogic.getBetTypeDescription(bet.type)}
          </div>
        </button>
      );
    });
  };

  const getPotentialWinnings = () => {
    if (!selectedHorse) return 0;
    return Math.floor(selectedAmount * HorseRacingLogic.BET_PAYOUTS[selectedBetType]);
  };

  const isLowBalance = HorseRacingLogic.isLowBalance(balance);

  return (
    <div className="betting-panel">
      <div className="panel-header">
        <h2>💰 Panel de Apuestas</h2>
        <div className={`balance-display ${isLowBalance ? 'low-balance' : ''}`}>
          <span className="balance-label">Saldo:</span>
          <span className="balance-amount">{HorseRacingLogic.formatCurrency(balance)}</span>
        </div>
      </div>

      <div className="betting-sections">
        <div className="section horse-selection">
          <h3>🏇 Selecciona tu Caballo</h3>
          <div className="horses-grid">
            {renderHorseCards()}
          </div>
        </div>

        <div className="section bet-configuration">
          <div className="bet-amounts">
            <h4>💵 Cantidad de Apuesta</h4>
            <div className="amount-buttons">
              {renderBetAmounts()}
            </div>
          </div>

          <div className="bet-types">
            <h4>🎯 Tipo de Apuesta</h4>
            <div className="type-buttons">
              {renderBetTypes()}
            </div>
          </div>

          <div className="bet-summary">
            <h4>📋 Resumen de Apuesta</h4>
            <div className="summary-content">
              <div className="summary-row">
                <span>Caballo seleccionado:</span>
                <span className="summary-value">
                  {selectedHorse 
                    ? `#${selectedHorse} ${horses.find(h => h.id === selectedHorse)?.name}` 
                    : 'Ninguno'
                  }
                </span>
              </div>
              <div className="summary-row">
                <span>Tipo de apuesta:</span>
                <span className="summary-value">{selectedBetType.toUpperCase()}</span>
              </div>
              <div className="summary-row">
                <span>Cantidad:</span>
                <span className="summary-value">{HorseRacingLogic.formatCurrency(selectedAmount)}</span>
              </div>
              <div className="summary-row potential-winnings">
                <span>Ganancia potencial:</span>
                <span className="summary-value winning-amount">
                  {HorseRacingLogic.formatCurrency(getPotentialWinnings())}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isLowBalance && (
        <div className="balance-warning">
          ⚠️ Saldo bajo. Considera apostar cantidades menores.
        </div>
      )}
    </div>
  );
}
