import React from 'react';
import type { GameMode } from '../types/DadosTypes';

interface GameModeSelectorProps {
  currentMode: GameMode;
  onModeChange: (mode: GameMode) => void;
  isRolling: boolean;
}

export const GameModeSelector: React.FC<GameModeSelectorProps> = ({
  currentMode,
  onModeChange,
  isRolling
}) => {
  const gameModes: { mode: GameMode; label: string; description: string; emoji: string }[] = [
    {
      mode: 'single',
      label: 'Un Dado',
      description: 'Juega con un solo dado',
      emoji: '🎲'
    },
    {
      mode: 'double',
      label: 'Dos Dados',
      description: 'Juega con dos dados',
      emoji: '🎲🎲'
    },
    {
      mode: 'triple',
      label: 'Tres Dados',
      description: 'Juega con tres dados',
      emoji: '🎲🎲🎲'
    }
  ];

  return (
    <div className="game-modes">
      <h3>🎯 Modo de Juego</h3>
      <div className="mode-buttons">
        {gameModes.map((modeData) => (
          <button
            key={modeData.mode}
            className={`mode-btn ${currentMode === modeData.mode ? 'active' : ''}`}
            onClick={() => onModeChange(modeData.mode)}
            disabled={isRolling}
          >
            <div className="mode-emoji">{modeData.emoji}</div>
            <div className="mode-label">{modeData.label}</div>
            <div className="mode-description">{modeData.description}</div>
          </button>
        ))}
      </div>
    </div>
  );
};
