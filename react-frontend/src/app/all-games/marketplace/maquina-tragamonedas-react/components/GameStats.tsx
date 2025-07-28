import React from 'react';
import { SlotGameLogic } from '../logic/SlotGameLogic';

interface GameStatsProps {
  credits: number;
  totalSpins: number;
  totalWins: number;
  jackpot: number;
}

export function GameStats({ credits, totalSpins, totalWins, jackpot }: GameStatsProps) {
  const winRate = totalSpins > 0 ? ((totalWins / totalSpins) * 100).toFixed(1) : '0.0';
  const creditsStatus = SlotGameLogic.isLowCredits(credits) ? 'low' : 'normal';
  
  return (
    <div className="game-stats">
      <h3>📊 Estadísticas</h3>
      
      <div className="stats-grid">
        <div className={`stat-item stat-item--credits ${creditsStatus}`}>
          <div className="stat-label">💰 Créditos</div>
          <div className="stat-value">
            ${SlotGameLogic.formatCredits(credits)}
          </div>
        </div>

        <div className="stat-item">
          <div className="stat-label">🎲 Total Giros</div>
          <div className="stat-value">{totalSpins.toLocaleString()}</div>
        </div>

        <div className="stat-item">
          <div className="stat-label">🏆 Victorias</div>
          <div className="stat-value">{totalWins.toLocaleString()}</div>
        </div>

        <div className="stat-item">
          <div className="stat-label">📈 Tasa Éxito</div>
          <div className="stat-value">{winRate}%</div>
        </div>

        <div className="stat-item stat-item--jackpot">
          <div className="stat-label">💎 Jackpot</div>
          <div className="stat-value jackpot-value">
            ${SlotGameLogic.formatCredits(jackpot)}
          </div>
        </div>
      </div>

      <div className="payout-table">
        <h4>💰 Tabla de Pagos</h4>
        <div className="payout-list">
          <div className="payout-item">
            <span className="symbols">🍒🍒🍒</span>
            <span className="multiplier">x2</span>
          </div>
          <div className="payout-item">
            <span className="symbols">🍋🍋🍋</span>
            <span className="multiplier">x3</span>
          </div>
          <div className="payout-item">
            <span className="symbols">🍊🍊🍊</span>
            <span className="multiplier">x4</span>
          </div>
          <div className="payout-item">
            <span className="symbols">🍇🍇🍇</span>
            <span className="multiplier">x5</span>
          </div>
          <div className="payout-item">
            <span className="symbols">🔔🔔🔔</span>
            <span className="multiplier">x10</span>
          </div>
          <div className="payout-item">
            <span className="symbols">⭐⭐⭐</span>
            <span className="multiplier">x15</span>
          </div>
          <div className="payout-item">
            <span className="symbols">💎💎💎</span>
            <span className="multiplier">x25</span>
          </div>
          <div className="payout-item">
            <span className="symbols">👑👑👑</span>
            <span className="multiplier">x50</span>
          </div>
          <div className="payout-item">
            <span className="symbols">🎰🎰🎰</span>
            <span className="multiplier">x100</span>
          </div>
          <div className="payout-item payout-item--jackpot">
            <span className="symbols">💰💰💰</span>
            <span className="multiplier">JACKPOT!</span>
          </div>
        </div>
      </div>
    </div>
  );
}
