import React from 'react';
import type { Tile } from '../types';

interface TileProps {
  tile: Tile;
  row: number;
  col: number;
}

export const TileComponent: React.FC<TileProps> = ({ tile, row, col }) => {
  const { value, isNew, isMerged } = tile;
  const className = `tile tile-${value} ${isNew ? 'new' : ''} ${isMerged ? 'merged' : ''}`;
  const style = {
    '--row': row,
    '--col': col,
  } as React.CSSProperties;

  return (
    <div className={className} style={style}>
      {value}
    </div>
  );
};
