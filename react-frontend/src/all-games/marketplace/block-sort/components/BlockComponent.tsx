import React from 'react';
import type { Block } from '../types';

interface BlockComponentProps {
  block: Block;
}

export const BlockComponent: React.FC<BlockComponentProps> = ({ block }) => {
  return (
    <div className={`block ${block.color}`}></div>
  );
};
