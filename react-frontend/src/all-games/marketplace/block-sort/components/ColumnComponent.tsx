import React from 'react';
import type { Column } from '../types';
import { BlockComponent } from './BlockComponent';

interface ColumnComponentProps {
  column: Column;
  onClick: () => void;
  isSelected: boolean;
}

export const ColumnComponent: React.FC<ColumnComponentProps> = ({ column, onClick, isSelected }) => {
  return (
    <div
      className={`column ${isSelected ? 'selected' : ''}`}
      onClick={onClick}
    >
      {column.blocks.map(block => (
        <BlockComponent key={block.id} block={block} />
      ))}
    </div>
  );
};
