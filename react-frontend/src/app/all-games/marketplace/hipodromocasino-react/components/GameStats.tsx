import React from 'react';
import { HorseRacingLogic } from '../logic/HorseRacingLogic';
import type { GameStats, Horse, RaceHistoryEntry } from '../types/HorseRacingTypes';

interface GameStatsProps {
  stats: GameStats;
  horses: Horse[];
  currentRace: number;
  history: RaceHistoryEntry[];
  balance: number;
}

export function GameStatsDisplay({ stats, horses, currentRace, history, balance }: GameStatsProps) {

  const renderHorseStats = () => {
    // Calculate horse statistics from race history
    const horseStats = horses.map(horse => {
      const horseRaces = history.filter(entry => entry.selectedHorse.id === horse.id);
      const wins = horseRaces.filter(race => race.won).length;
      const totalRaces = horseRaces.length;
      const winRate = totalRaces > 0 ? (wins / totalRaces * 100) : 0;
      const totalWagered = horseRaces.reduce((sum, race) => sum + race.betAmount, 0);
      const totalWon = horseRaces.reduce((sum, race) => sum + race.payout, 0);
      
      return {
        horse,
        totalRaces,
        wins,
        winRate,
        totalWagered,
        totalWon,
        profit: totalWon - totalWagered
      };
    });

    return horseStats.map(stat => {
      if (stat.totalRaces === 0) return null;

      return (
        <div key={stat.horse.id} className="horse-stats-row">
          <div className="horse-info">
            <span className="horse-emoji" style={{ color: stat.horse.color }}>
              {stat.horse.emoji}
            </span>
            <span className="horse-name">#{stat.horse.id} {stat.horse.name}</span>
          </div>
          
          <div className="stats-data">
            <div className="stat-item">
              <span className="stat-label">Carreras</span>
              <span className="stat-value">{stat.totalRaces}</span>
            </div>
            
            <div className="stat-item">
              <span className="stat-label">Victorias</span>
              <span className="stat-value wins">{stat.wins}</span>
            </div>
            
            <div className="stat-item">
              <span className="stat-label">% Victoria</span>
              <span className="stat-value win-rate">
                {stat.winRate.toFixed(1)}%
              </span>
            </div>
            
            <div className="stat-item">
              <span className="stat-label">Apostado</span>
              <span className="stat-value">{HorseRacingLogic.formatCurrency(stat.totalWagered)}</span>
            </div>
            
            <div className="stat-item">
              <span className="stat-label">Ganado</span>
              <span className="stat-value">{HorseRacingLogic.formatCurrency(stat.totalWon)}</span>
            </div>
            
            <div className="stat-item">
              <span className="stat-label">Ganancia</span>
              <span className={`stat-value ${stat.profit >= 0 ? 'profit' : 'loss'}`}>
                {stat.profit >= 0 ? '+' : ''}{HorseRacingLogic.formatCurrency(stat.profit)}
              </span>
            </div>
          </div>
        </div>
      );
    }).filter(Boolean);
  };

  const getTotalBets = () => history.length;
  const getTotalWagered = () => history.reduce((sum, entry) => sum + entry.betAmount, 0);
  const getTotalWon = () => history.reduce((sum, entry) => sum + entry.payout, 0);
  const getTotalLosses = () => getTotalBets() - stats.wins;
  const getAverageBet = () => getTotalBets() > 0 ? (getTotalWagered() / getTotalBets()) : 0;
  const getProfitLoss = () => getTotalWon() - getTotalWagered();
  const getProfitMargin = () => {
    const wagered = getTotalWagered();
    return wagered > 0 ? ((getTotalWon() - wagered) / wagered * 100) : 0;
  };
  const getWinLossRatio = () => {
    const losses = getTotalLosses();
    if (losses === 0) return stats.wins > 0 ? '∞' : '0';
    return (stats.wins / losses).toFixed(2);
  };

  return (
    <div className="game-stats">
      <div className="stats-header">
        <h2>📊 Estadísticas del Juego</h2>
        <div className="current-race">
          Carrera #{currentRace}
        </div>
      </div>

      <div className="stats-sections">
        <div className="section general-stats">
          <h3>📈 Estadísticas Generales</h3>
          <div className="general-stats-grid">
            <div className="stat-card">
              <div className="stat-icon">🏁</div>
              <div className="stat-info">
                <div className="stat-number">{stats.totalRaces}</div>
                <div className="stat-title">Carreras Completadas</div>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">🎯</div>
              <div className="stat-info">
                <div className="stat-number">{getTotalBets()}</div>
                <div className="stat-title">Apuestas Totales</div>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">💸</div>
              <div className="stat-info">
                <div className="stat-number">{HorseRacingLogic.formatCurrency(getTotalWagered())}</div>
                <div className="stat-title">Total Apostado</div>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">💰</div>
              <div className="stat-info">
                <div className="stat-number">{HorseRacingLogic.formatCurrency(getTotalWon())}</div>
                <div className="stat-title">Total Ganado</div>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">📊</div>
              <div className="stat-info">
                <div className="stat-number">{HorseRacingLogic.formatCurrency(getAverageBet())}</div>
                <div className="stat-title">Apuesta Promedio</div>
              </div>
            </div>
            
            <div className={`stat-card ${getProfitLoss() >= 0 ? 'profit' : 'loss'}`}>
              <div className="stat-icon">{getProfitLoss() >= 0 ? '📈' : '📉'}</div>
              <div className="stat-info">
                <div className="stat-number">
                  {getProfitLoss() >= 0 ? '+' : ''}{HorseRacingLogic.formatCurrency(getProfitLoss())}
                </div>
                <div className="stat-title">Ganancia/Pérdida</div>
              </div>
            </div>
          </div>
        </div>

        <div className="section win-loss-stats">
          <h3>🏆 Estadísticas de Victorias/Derrotas</h3>
          <div className="win-loss-grid">
            <div className="win-loss-item">
              <span className="label">Apuestas Ganadoras:</span>
              <span className="value wins">{stats.wins}</span>
            </div>
            
            <div className="win-loss-item">
              <span className="label">Apuestas Perdedoras:</span>
              <span className="value losses">{getTotalLosses()}</span>
            </div>
            
            <div className="win-loss-item">
              <span className="label">Ratio Victoria/Derrota:</span>
              <span className="value ratio">{getWinLossRatio()}</span>
            </div>
            
            <div className="win-loss-item">
              <span className="label">Porcentaje de Victoria:</span>
              <span className="value win-percentage">
                {getTotalBets() > 0 ? (stats.wins / getTotalBets() * 100).toFixed(1) : 0}%
              </span>
            </div>
            
            <div className="win-loss-item">
              <span className="label">Margen de Ganancia:</span>
              <span className={`value margin ${getProfitMargin() >= 0 ? 'positive' : 'negative'}`}>
                {getProfitMargin() >= 0 ? '+' : ''}{getProfitMargin().toFixed(2)}%
              </span>
            </div>
          </div>
        </div>

        <div className="section horse-performance">
          <h3>🏇 Rendimiento por Caballo</h3>
          <div className="horse-stats-container">
            <div className="horse-stats-header">
              <div className="horse-col">Caballo</div>
              <div className="stats-col">Estadísticas</div>
            </div>
            <div className="horse-stats-list">
              {renderHorseStats()}
            </div>
          </div>
        </div>

        <div className="section betting-insights">
          <h3>💡 Insights de Apuestas</h3>
          <div className="insights-list">
            {getTotalBets() > 0 && (
              <>
                <div className="insight-item">
                  <span className="insight-icon">🎯</span>
                  <span className="insight-text">
                    Has realizado <strong>{getTotalBets()}</strong> apuestas en <strong>{stats.totalRaces}</strong> carreras
                  </span>
                </div>
                
                <div className="insight-item">
                  <span className="insight-icon">💰</span>
                  <span className="insight-text">
                    Tu apuesta promedio es de <strong>{HorseRacingLogic.formatCurrency(getAverageBet())}</strong>
                  </span>
                </div>
                
                {getProfitLoss() >= 0 ? (
                  <div className="insight-item positive">
                    <span className="insight-icon">📈</span>
                    <span className="insight-text">
                      ¡Estás ganando! Has obtenido <strong>{HorseRacingLogic.formatCurrency(getProfitLoss())}</strong> de ganancia
                    </span>
                  </div>
                ) : (
                  <div className="insight-item negative">
                    <span className="insight-icon">📉</span>
                    <span className="insight-text">
                      Estás perdiendo <strong>{HorseRacingLogic.formatCurrency(Math.abs(getProfitLoss()))}</strong>. Considera ajustar tu estrategia
                    </span>
                  </div>
                )}
                
                <div className="insight-item">
                  <span className="insight-icon">🏆</span>
                  <span className="insight-text">
                    Tu tasa de éxito es del <strong>{(stats.wins / getTotalBets() * 100).toFixed(1)}%</strong>
                  </span>
                </div>
              </>
            )}
            
            {getTotalBets() === 0 && (
              <div className="insight-item">
                <span className="insight-icon">🏁</span>
                <span className="insight-text">
                  ¡Comienza a apostar para ver tus estadísticas!
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
