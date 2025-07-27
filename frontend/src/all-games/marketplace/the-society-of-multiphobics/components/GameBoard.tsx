import React from 'react';
import type { GameTile, Position, Fear } from '../types/GameTypes';
import '../styles/GameBoard.css';

interface GameBoardProps {
  board: GameTile[][];
  selectedTile: Position | null;
  hoveredTile: Position | null;
  showFears: boolean;
  playerPosition: Position;
  onTileClick: (position: Position) => void;
  onTileHover: (position: Position | null) => void;
  getFearAtPosition: (position: Position) => Fear | null;
  canMoveTo: (position: Position) => boolean;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  board,
  selectedTile,
  hoveredTile,
  showFears,
  playerPosition,
  onTileClick,
  onTileHover,
  getFearAtPosition,
  canMoveTo
}) => {
  const getTileClasses = (tile: GameTile): string => {
    const classes = ['game-tile', `tile-${tile.type}`];
    
    if (tile.hasPlayer) classes.push('has-player');
    if (tile.hasFear && showFears) classes.push('has-fear');
    if (selectedTile && tile.position.x === selectedTile.x && tile.position.y === selectedTile.y) {
      classes.push('selected');
    }
    if (hoveredTile && tile.position.x === hoveredTile.x && tile.position.y === hoveredTile.y) {
      classes.push('hovered');
    }
    if (canMoveTo(tile.position)) {
      classes.push('can-move');
    }
    
    return classes.join(' ');
  };

  const getTileContent = (tile: GameTile): React.ReactNode => {
    // Player
    if (tile.position.x === playerPosition.x && tile.position.y === playerPosition.y) {
      return <div className="player-avatar">🧑‍💼</div>;
    }
    
    // Fear
    if (tile.hasFear && showFears) {
      const fear = getFearAtPosition(tile.position);
      if (fear) {
        return (
          <div className="fear-icon" title={fear.description}>
            {fear.emoji}
          </div>
        );
      }
    }
    
    // Furniture
    if (tile.type === 'table') {
      return <div className="furniture">🪑</div>;
    }
    if (tile.type === 'chair') {
      return <div className="furniture">💺</div>;
    }
    
    return null;
  };

  return (
    <div className="game-board-container">
      <div className="game-board">
        {board.map((row, y) => (
          <div key={`board-row-${board.length}-${y}`} className="board-row">
            {row.map((tile, x) => (
              <button
                key={tile.id}
                className={getTileClasses(tile)}
                onClick={() => onTileClick(tile.position)}
                onMouseEnter={() => onTileHover(tile.position)}
                onMouseLeave={() => onTileHover(null)}
                title={`Posición (${x}, ${y})`}
                type="button"
              >
                {getTileContent(tile)}
                <div className="tile-coords">{x},{y}</div>
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
