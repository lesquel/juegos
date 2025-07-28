import React from 'react';
import { HorseRacingLogic } from '../logic/HorseRacingLogic';
import type { RaceHistoryEntry } from '../types/HorseRacingTypes';

interface RaceHistoryProps {
  history: RaceHistoryEntry[];
  onClearHistory?: () => void;
}

export function RaceHistory({ history, onClearHistory }: RaceHistoryProps) {

  const renderHistoryEntry = (entry: RaceHistoryEntry) => {
    const selectedHorseResult = entry.results.find(result => result.horse.id === entry.selectedHorse.id);
    
    return (
      <div key={entry.raceNumber} className={`history-entry ${entry.won ? 'won' : 'lost'}`}>
        <div className="entry-header">
          <div className="race-number">Carrera #{entry.raceNumber}</div>
          <div className={`result-badge ${entry.won ? 'win' : 'loss'}`}>
            {entry.won ? '🏆 GANASTE' : '❌ PERDISTE'}
          </div>
        </div>
        
        <div className="entry-content">
          <div className="bet-info">
            <div className="bet-detail">
              <span className="label">Caballo seleccionado:</span>
              <span className="value">
                <span className="horse-emoji" style={{ color: entry.selectedHorse.color }}>
                  {entry.selectedHorse.emoji}
                </span>
                #{entry.selectedHorse.id} {entry.selectedHorse.name}
              </span>
            </div>
            
            <div className="bet-detail">
              <span className="label">Tipo de apuesta:</span>
              <span className="value bet-type">{entry.betType.toUpperCase()}</span>
            </div>
            
            <div className="bet-detail">
              <span className="label">Cantidad apostada:</span>
              <span className="value bet-amount">{HorseRacingLogic.formatCurrency(entry.betAmount)}</span>
            </div>
            
            <div className="bet-detail">
              <span className="label">Pago recibido:</span>
              <span className={`value payout ${entry.payout > 0 ? 'positive' : 'zero'}`}>
                {HorseRacingLogic.formatCurrency(entry.payout)}
              </span>
            </div>
            
            <div className="bet-detail">
              <span className="label">Ganancia/Pérdida:</span>
              <span className={`value profit ${entry.profit >= 0 ? 'positive' : 'negative'}`}>
                {entry.profit >= 0 ? '+' : ''}{HorseRacingLogic.formatCurrency(entry.profit)}
              </span>
            </div>
          </div>
          
          <div className="race-results">
            <h4>Resultados de la carrera:</h4>
            <div className="results-podium">
              {entry.results.slice(0, 3).map((result, index) => (
                <div 
                  key={result.horse.id} 
                  className={`podium-position position-${index + 1} ${
                    result.horse.id === entry.selectedHorse.id ? 'selected-horse' : ''
                  }`}
                >
                  <div className="position-medal">
                    {index === 0 && '🥇'}
                    {index === 1 && '🥈'}
                    {index === 2 && '🥉'}
                  </div>
                  <div className="horse-info">
                    <span className="horse-emoji" style={{ color: result.horse.color }}>
                      {result.horse.emoji}
                    </span>
                    <span className="horse-name">#{result.horse.id} {result.horse.name}</span>
                  </div>
                  <div className="finish-time">{result.time.toFixed(2)}s</div>
                </div>
              ))}
            </div>
            
            {selectedHorseResult && selectedHorseResult.position > 3 && (
              <div className="selected-horse-result">
                <span className="horse-emoji" style={{ color: selectedHorseResult.horse.color }}>
                  {selectedHorseResult.horse.emoji}
                </span>
                Tu caballo #{selectedHorseResult.horse.id} {selectedHorseResult.horse.name} 
                terminó en la posición {selectedHorseResult.position}° 
                con un tiempo de {selectedHorseResult.time.toFixed(2)}s
              </div>
            )}
          </div>
        </div>
        
        <div className="entry-summary">
          {entry.won ? (
            <div className="win-summary">
              <span className="win-icon">🎉</span>
              <span className="win-text">
                {(() => {
                  if (entry.betType === 'win' && selectedHorseResult?.position === 1) {
                    return `¡Tu caballo ganó la carrera! Apuesta WIN ganadora.`;
                  } else if (entry.betType === 'place' && selectedHorseResult && selectedHorseResult.position <= 2) {
                    return `¡Tu caballo llegó en ${selectedHorseResult.position}° lugar! Apuesta PLACE ganadora.`;
                  } else if (entry.betType === 'show' && selectedHorseResult && selectedHorseResult.position <= 3) {
                    return `¡Tu caballo llegó en ${selectedHorseResult.position}° lugar! Apuesta SHOW ganadora.`;
                  }
                  return '¡Apuesta ganadora!';
                })()}
              </span>
            </div>
          ) : (
            <div className="loss-summary">
              <span className="loss-icon">😞</span>
              <span className="loss-text">
                {(() => {
                  if (!selectedHorseResult) return 'Tu caballo no completó la carrera.';
                  
                  if (entry.betType === 'win') {
                    return selectedHorseResult.position === 1 
                      ? 'Error inesperado en la apuesta WIN.' 
                      : `Tu caballo llegó en ${selectedHorseResult.position}° lugar. Necesitaba ganar para la apuesta WIN.`;
                  } else if (entry.betType === 'place') {
                    return selectedHorseResult.position <= 2 
                      ? 'Error inesperado en la apuesta PLACE.' 
                      : `Tu caballo llegó en ${selectedHorseResult.position}° lugar. Necesitaba llegar en 1° o 2° para la apuesta PLACE.`;
                  } else if (entry.betType === 'show') {
                    return selectedHorseResult.position <= 3 
                      ? 'Error inesperado en la apuesta SHOW.' 
                      : `Tu caballo llegó en ${selectedHorseResult.position}° lugar. Necesitaba llegar en el top 3 para la apuesta SHOW.`;
                  }
                  return 'Tu apuesta no fue ganadora.';
                })()}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  };

  const getTotalStats = () => {
    const totalBets = history.length;
    const totalWins = history.filter(entry => entry.won).length;
    const totalWagered = history.reduce((sum, entry) => sum + entry.betAmount, 0);
    const totalWon = history.reduce((sum, entry) => sum + entry.payout, 0);
    const totalProfit = totalWon - totalWagered;
    
    return {
      totalBets,
      totalWins,
      totalWagered,
      totalWon,
      totalProfit,
      winRate: totalBets > 0 ? (totalWins / totalBets * 100) : 0
    };
  };

  const stats = getTotalStats();

  if (history.length === 0) {
    return (
      <div className="race-history empty">
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <h3>No hay historial de carreras</h3>
          <p>Comienza a apostar para ver tu historial de carreras aquí.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="race-history">
      <div className="history-header">
        <div className="header-content">
          <h2>📋 Historial de Carreras</h2>
          <div className="history-summary">
            <span className="summary-item">
              <strong>{stats.totalBets}</strong> carreras
            </span>
            <span className="summary-item">
              <strong>{stats.totalWins}</strong> ganadas
            </span>
            <span className="summary-item">
              <strong>{stats.winRate.toFixed(1)}%</strong> éxito
            </span>
            <span className={`summary-item ${stats.totalProfit >= 0 ? 'profit' : 'loss'}`}>
              <strong>
                {stats.totalProfit >= 0 ? '+' : ''}{HorseRacingLogic.formatCurrency(stats.totalProfit)}
              </strong> ganancia
            </span>
          </div>
        </div>
        
        {onClearHistory && history.length > 0 && (
          <button 
            className="clear-history-btn"
            onClick={onClearHistory}
            title="Limpiar historial"
          >
            🗑️ Limpiar Historial
          </button>
        )}
      </div>

      <div className="history-list">
        {history.slice().reverse().map(renderHistoryEntry)}
      </div>

      <div className="history-footer">
        <div className="footer-stats">
          <div className="footer-stat">
            <span className="stat-label">Total apostado:</span>
            <span className="stat-value">{HorseRacingLogic.formatCurrency(stats.totalWagered)}</span>
          </div>
          <div className="footer-stat">
            <span className="stat-label">Total ganado:</span>
            <span className="stat-value">{HorseRacingLogic.formatCurrency(stats.totalWon)}</span>
          </div>
          <div className="footer-stat">
            <span className="stat-label">Ganancia neta:</span>
            <span className={`stat-value ${stats.totalProfit >= 0 ? 'profit' : 'loss'}`}>
              {stats.totalProfit >= 0 ? '+' : ''}{HorseRacingLogic.formatCurrency(stats.totalProfit)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
