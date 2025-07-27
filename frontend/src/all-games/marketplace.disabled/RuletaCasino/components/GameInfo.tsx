import React from 'react';
import { RouletteGameLogic } from '../logic/RouletteGameLogic';

interface GameInfoProps {
  balance: number;
  totalBet: number;
  lastWinningNumber: number | null;
  history: number[];
  winnings: number;
}

export function GameInfo({ 
  balance, 
  totalBet, 
  lastWinningNumber, 
  history, 
  winnings 
}: GameInfoProps) {
  
  const renderHistory = () => {
    if (history.length === 0) {
      return <div className="no-history">Sin historial aún</div>;
    }

    return history.map((number, index) => {
      const color = RouletteGameLogic.getNumberColor(number);
      let colorClass = 'zero';
      if (color === 'red') colorClass = 'red';
      else if (color === 'black') colorClass = 'black';
      
      return (
        <div
          key={`${number}-${index}`}
          className={`number-history ${colorClass}`}
          title={`Número ${number} (${color === 'green' ? 'verde' : color === 'red' ? 'rojo' : 'negro'})`}
        >
          {number}
        </div>
      );
    });
  };

  const getBalanceStatus = () => {
    if (balance < RouletteGameLogic.CONFIG.CHIP_VALUES[0]) {
      return 'critical';
    }
    if (balance < RouletteGameLogic.CONFIG.INITIAL_BALANCE * 0.3) {
      return 'low';
    }
    if (balance > RouletteGameLogic.CONFIG.INITIAL_BALANCE * 1.5) {
      return 'high';
    }
    return 'normal';
  };

  return (
    <div className="game-info">
      <div className="info-item balance-info">
        <h3>💰 Saldo</h3>
        <div className={`balance ${getBalanceStatus()}`}>
          {RouletteGameLogic.formatCurrency(balance)}
        </div>
        {getBalanceStatus() === 'critical' && (
          <div className="balance-warning">
            ⚠️ Saldo insuficiente
          </div>
        )}
      </div>

      <div className="info-item bet-info">
        <h3>🎯 Apuesta Total</h3>
        <div className="total-bet">
          {RouletteGameLogic.formatCurrency(totalBet)}
        </div>
        {totalBet === 0 && (
          <div className="bet-hint">
            Selecciona fichas y apuesta
          </div>
        )}
      </div>

      <div className="info-item result-info">
        <h3>🎲 Último Resultado</h3>
        {lastWinningNumber !== null ? (
          <div className="last-result">
            <div className={`last-number ${RouletteGameLogic.getNumberColor(lastWinningNumber)}`}>
              {lastWinningNumber}
            </div>
            {winnings > 0 && (
              <div className="last-winnings">
                +{RouletteGameLogic.formatCurrency(winnings)}
              </div>
            )}
          </div>
        ) : (
          <div className="no-result">
            Sin resultados aún
          </div>
        )}
      </div>

      <div className="info-item history-info">
        <h3>📊 Últimos Números</h3>
        <div className="history-container">
          {renderHistory()}
        </div>
      </div>

      <div className="info-item stats-info">
        <h3>📈 Estadísticas</h3>
        <div className="stats-grid">
          <div className="stat">
            <span className="stat-label">Giros:</span>
            <span className="stat-value">{history.length}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Balance Inicial:</span>
            <span className="stat-value">
              {RouletteGameLogic.formatCurrency(RouletteGameLogic.CONFIG.INITIAL_BALANCE)}
            </span>
          </div>
          <div className="stat">
            <span className="stat-label">Ganancia/Pérdida:</span>
            <span className={`stat-value ${balance >= RouletteGameLogic.CONFIG.INITIAL_BALANCE ? 'positive' : 'negative'}`}>
              {balance >= RouletteGameLogic.CONFIG.INITIAL_BALANCE ? '+' : ''}
              {RouletteGameLogic.formatCurrency(balance - RouletteGameLogic.CONFIG.INITIAL_BALANCE)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
