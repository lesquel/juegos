import React from 'react';
import type { Player, Fear } from '../types/GameTypes';
import '../styles/PlayerStats.css';

interface PlayerStatsProps {
  player: Player;
  timeLeft: number;
  formattedTime: string;
  turnCount: number;
  showFears: boolean;
  onToggleFears: () => void;
}

export const PlayerStats: React.FC<PlayerStatsProps> = ({
  player,
  timeLeft,
  formattedTime,
  turnCount,
  showFears,
  onToggleFears
}) => {
  const getScoreColor = (score: number): string => {
    if (score >= 50) return 'score-excellent';
    if (score >= 0) return 'score-good';
    if (score >= -50) return 'score-warning';
    return 'score-danger';
  };

  const getFearsByCategory = (fears: Fear[]) => {
    return {
      mild: fears.filter(f => f.category === 'mild'),
      severe: fears.filter(f => f.category === 'severe'),
      extreme: fears.filter(f => f.category === 'extreme')
    };
  };

  const fearsByCategory = getFearsByCategory(player.fears);

  return (
    <div className="player-stats">
      <div className="stats-header">
        <h3>📊 Estadísticas del Jugador</h3>
      </div>

      <div className="stats-grid">
        <div className="stat-item">
          <span className="stat-label">Puntuación:</span>
          <span className={`stat-value ${getScoreColor(player.score)}`}>
            {player.score}
          </span>
        </div>

        <div className="stat-item">
          <span className="stat-label">Tiempo:</span>
          <span className={`stat-value ${timeLeft < 60 ? 'time-warning' : ''}`}>
            {formattedTime}
          </span>
        </div>

        <div className="stat-item">
          <span className="stat-label">Turnos:</span>
          <span className="stat-value">{turnCount}</span>
        </div>

        <div className="stat-item">
          <span className="stat-label">Posición:</span>
          <span className="stat-value">
            ({player.position.x}, {player.position.y})
          </span>
        </div>
      </div>

      <div className="fears-section">
        <div className="fears-header">
          <h4>😨 Miedos Encontrados ({player.fears.length})</h4>
          <button
            type="button"
            className={`toggle-fears-btn ${showFears ? 'active' : ''}`}
            onClick={onToggleFears}
            title={showFears ? 'Ocultar miedos en el tablero' : 'Mostrar miedos en el tablero'}
          >
            {showFears ? '🙈' : '👁️'}
          </button>
        </div>

        {player.fears.length === 0 ? (
          <div className="no-fears">
            <p>¡Sin miedos encontrados aún! 😊</p>
          </div>
        ) : (
          <div className="fears-by-category">
            {fearsByCategory.mild.length > 0 && (
              <div className="fear-category mild">
                <h5>😟 Leves ({fearsByCategory.mild.length})</h5>
                <div className="fear-list">
                  {fearsByCategory.mild.map(fear => (
                    <div key={fear.id} className="fear-item" title={fear.description}>
                      <span className="fear-emoji">{fear.emoji}</span>
                      <span className="fear-name">{fear.name}</span>
                      <span className="fear-intensity">Intensidad: {fear.intensity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {fearsByCategory.severe.length > 0 && (
              <div className="fear-category severe">
                <h5>😰 Severos ({fearsByCategory.severe.length})</h5>
                <div className="fear-list">
                  {fearsByCategory.severe.map(fear => (
                    <div key={fear.id} className="fear-item" title={fear.description}>
                      <span className="fear-emoji">{fear.emoji}</span>
                      <span className="fear-name">{fear.name}</span>
                      <span className="fear-intensity">Intensidad: {fear.intensity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {fearsByCategory.extreme.length > 0 && (
              <div className="fear-category extreme">
                <h5>😱 Extremos ({fearsByCategory.extreme.length})</h5>
                <div className="fear-list">
                  {fearsByCategory.extreme.map(fear => (
                    <div key={fear.id} className="fear-item" title={fear.description}>
                      <span className="fear-emoji">{fear.emoji}</span>
                      <span className="fear-name">{fear.name}</span>
                      <span className="fear-intensity">Intensidad: {fear.intensity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="movement-info">
        <h4>🚶‍♂️ Movimiento</h4>
        <p className="movement-hint">
          Haz clic en una casilla adyacente para moverte.
          {!player.canMove && " ¡No puedes moverte este turno!"}
        </p>
      </div>
    </div>
  );
};
