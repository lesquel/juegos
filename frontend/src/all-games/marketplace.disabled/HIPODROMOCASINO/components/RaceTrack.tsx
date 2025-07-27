import React from 'react';
import type { Horse, RaceResult } from '../types/HorseRacingTypes';

interface RaceTrackProps {
  horses: Horse[];
  isRacing: boolean;
  raceResults: RaceResult[] | null;
  raceNumber: number;
}

export function RaceTrack({ horses, isRacing, raceResults, raceNumber }: RaceTrackProps) {
  
  const renderHorse = (horse: Horse, index: number) => {
    const winner = raceResults?.find(r => r.position === 1);
    const isWinner = winner?.horse.id === horse.id;
    const racePosition = raceResults?.find(r => r.horse.id === horse.id)?.position;
    
    return (
      <div 
        key={horse.id}
        className={`race-lane lane-${index + 1}`}
      >
        <div className="lane-number">{index + 1}</div>
        
        <div 
          className={`horse ${isRacing ? 'running' : ''} ${isWinner ? 'winner' : ''}`}
          style={{ 
            '--horse-color': horse.color,
            transform: `translateX(${horse.currentPosition}px)`
          } as React.CSSProperties}
        >
          <div className="horse-emoji">{horse.emoji}</div>
          <div className="horse-name">{horse.name}</div>
        </div>
        
        {raceResults && racePosition && (
          <div className={`finish-position position-${racePosition}`}>
            {racePosition}°
          </div>
        )}
        
        <div className="finish-line">🏁</div>
      </div>
    );
  };

  const renderRaceResults = () => {
    if (!raceResults) return null;

    return (
      <div className="race-results">
        <h3>🏆 Resultados de la Carrera #{raceNumber - 1}</h3>
        <div className="results-podium">
          {raceResults.slice(0, 3).map((result, index) => (
            <div 
              key={result.horse.id}
              className={`podium-position position-${result.position}`}
            >
              <div className="position-medal">
                {(() => {
                  if (index === 0) return '🥇';
                  if (index === 1) return '🥈';
                  return '🥉';
                })()}
              </div>
              <div className="horse-info">
                <div className="horse-emoji">{result.horse.emoji}</div>
                <div className="horse-name">{result.horse.name}</div>
                <div className="race-time">{result.time.toFixed(1)}s</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="race-track">
      <div className="track-header">
        <h2>🏇 Pista de Carreras - Carrera #{raceNumber}</h2>
        {isRacing && (
          <div className="racing-status">
            <span className="racing-indicator">🏁</span>
            {' '}¡Carrera en progreso!
          </div>
        )}
      </div>

      <div className="track-container">
        <div className="track-surface">
          {horses.map((horse, index) => renderHorse(horse, index))}
        </div>
        
        <div className="track-markings">
          <div className="start-line">SALIDA</div>
          <div className="quarter-mark">25%</div>
          <div className="half-mark">50%</div>
          <div className="three-quarter-mark">75%</div>
          <div className="finish-line-mark">META</div>
        </div>
      </div>

      {renderRaceResults()}

      <div className="track-info">
        <div className="track-conditions">
          <span>🌤️ Condiciones: Buenas</span>
          <span>🏃 Distancia: 1200m</span>
          <span>💨 Viento: Favorable</span>
        </div>
      </div>
    </div>
  );
}
