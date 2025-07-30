export type Color = 'red' | 'blue' | 'green' | 'yellow' | 'purple' | 'orange' | 'cyan' | 'magenta';

export type Block = {
  id: number;
  color: Color;
};

export type Column = {
  id: number;
  blocks: Block[];
};

export type GameConfig = {
  numColumns: number;
  columnCapacity: number;
  numColors: number;
};

export type GameState = 'ready' | 'playing' | 'won';
