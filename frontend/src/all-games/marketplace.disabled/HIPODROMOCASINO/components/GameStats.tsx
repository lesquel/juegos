import React from 'react';
import { HorseRacingLogic } from '../logic/HorseRacingLogic';
import type { GameStats, Horse } from '../types/HorseRacingTypes';

interface GameStatsProps {
  stats: GameStats;
  horses: Horse[];
  currentRace: number;
}

export function GameStatsDisplay({ stats, horses, currentRace }: GameStatsProps) {

  const renderHorseStats = () => {
    return horses.map(horse => {
      const horseStats = stats.horseStats[horse.id];
      if (!horseStats) return null;

      const winRate = horseStats.races > 0 ? (horseStats.wins / horseStats.races * 100) : 0;
      const placementRate = horseStats.races > 0 ? ((horseStats.wins + horseStats.places + horseStats.shows) / horseStats.races * 100) : 0;

      return (
        <div key={horse.id} className="horse-stats-row">
          <div className="horse-info">
            <span className="horse-emoji" style={{ color: horse.color }}>
              {horse.emoji}
            </span>
            <span className="horse-name">#{horse.id} {horse.name}</span>
          </div>
          
          <div className="stats-data">
            <div className="stat-item">
              <span className="stat-label">Carreras</span>
              <span className="stat-value">{horseStats.races}</span>
            </div>
            
            <div className="stat-item">
              <span className="stat-label">Victorias</span>
              <span className="stat-value wins">{horseStats.wins}</span>
            </div>
            
            <div className="stat-item">
              <span className="stat-label">Lugares</span>
              <span className="stat-value places">{horseStats.places}</span>
            </div>
            
            <div className="stat-item">
              <span className="stat-label">Shows</span>
              <span className="stat-value shows">{horseStats.shows}</span>
            </div>
            
            <div className="stat-item">
              <span className="stat-label">% Victoria</span>
              <span className="stat-value win-rate">
                {winRate.toFixed(1)}%
              </span>
            </div>
            
            <div className="stat-item">
              <span className="stat-label">% Colocación</span>
              <span className="stat-value placement-rate">
                {placementRate.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      );
    });
  };

  const getWinLossRatio = () => {
    if (stats.totalLosses === 0) return stats.totalWins > 0 ? '∞' : '0';
    return (stats.totalWins / stats.totalLosses).toFixed(2);
  };

  const getAverageBet = () => {
    return stats.totalBets > 0 ? (stats.totalWagered / stats.totalBets) : 0;
  };

  const getProfitLoss = () => {
    return stats.totalWon - stats.totalWagered;
  };

  const getProfitMargin = () => {
    if (stats.totalWagered === 0) return 0;
    return ((stats.totalWon - stats.totalWagered) / stats.totalWagered * 100);
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
                <div className="stat-number">{stats.racesCompleted}</div>
                <div className="stat-title">Carreras Completadas</div>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">🎯</div>
              <div className="stat-info">
                <div className="stat-number">{stats.totalBets}</div>
                <div className="stat-title">Apuestas Totales</div>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">💸</div>
              <div className="stat-info">
                <div className="stat-number">{HorseRacingLogic.formatCurrency(stats.totalWagered)}</div>
                <div className="stat-title">Total Apostado</div>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">💰</div>
              <div className="stat-info">
                <div className="stat-number">{HorseRacingLogic.formatCurrency(stats.totalWon)}</div>
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
              <span className="value wins">{stats.totalWins}</span>
            </div>
            
            <div className="win-loss-item">
              <span className="label">Apuestas Perdedoras:</span>
              <span className="value losses">{stats.totalLosses}</span>
            </div>
            
            <div className="win-loss-item">
              <span className="label">Ratio Victoria/Derrota:</span>
              <span className="value ratio">{getWinLossRatio()}</span>
            </div>
            
            <div className="win-loss-item">
              <span className="label">Porcentaje de Victoria:</span>
              <span className="value win-percentage">
                {stats.totalBets > 0 ? (stats.totalWins / stats.totalBets * 100).toFixed(1) : 0}%
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
            {stats.totalBets > 0 && (
              <>
                <div className="insight-item">
                  <span className="insight-icon">🎯</span>
                  <span className="insight-text">
                    Has realizado <strong>{stats.totalBets}</strong> apuestas en <strong>{stats.racesCompleted}</strong> carreras
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
                    Tu tasa de éxito es del <strong>{(stats.totalWins / stats.totalBets * 100).toFixed(1)}%</strong>
                  </span>
                </div>
              </>
            )}
            
            {stats.totalBets === 0 && (
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
