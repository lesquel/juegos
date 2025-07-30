import React from 'react';
import type { DiceGameState } from '../types/DadosTypes';

interface GameStatsProps {
  gameState: DiceGameState;
}

export const GameStats: React.FC<GameStatsProps> = ({ gameState }) => {
  const { stats, balance } = gameState;
  const winRate = stats.totalRolls > 0 ? (stats.wins / stats.totalRolls) * 100 : 0;

  return (
    <div className="sidebar">
      <div className="balance-info">
        <div className="current-bet">
          Apuesta: ${gameState.currentBet.amount}
        </div>
      </div>

      <div className="stats-section">
        <h3>📊 Estadísticas</h3>
        <div className="stat-item">
          <span className="stat-label">Tiradas totales:</span>
          <span className="stat-value">{stats.totalRolls}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Victorias:</span>
          <span className="stat-value win">{stats.wins}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">% Victorias:</span>
          <span className="stat-value">{winRate.toFixed(1)}%</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Ganancia total:</span>
          <span className={`stat-value ${stats.totalProfit >= 0 ? 'win' : 'lose'}`}>
            ${stats.totalProfit}
          </span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Mayor ganancia:</span>
          <span className="stat-value win">${stats.biggestWin}</span>
        </div>
      </div>

      <div className="history-section">
        <h3>📝 Historial</h3>
        <div className="history-list">
          {stats.history.slice(0, 10).map((result, index) => (
            <div 
              key={`history-${index}-${result.result}`}
              className={`history-item ${result.win ? 'win' : 'lose'}`}
            >
              <span className="result">{result.result}</span>
              <span className="outcome">
                {result.win ? '✅' : '❌'}
              </span>
            </div>
          ))}
          {stats.history.length === 0 && (
            <div className="no-history">No hay historial aún</div>
          )}
        </div>
      </div>
    </div>
  );
};
