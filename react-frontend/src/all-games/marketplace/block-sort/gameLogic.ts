import { Color, Block, Column, GameConfig } from './types';

let blockIdCounter = 0;

const ALL_COLORS: Color[] = ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'cyan', 'magenta'];

export const generatePuzzle = (config: GameConfig): Column[] => {
  const { numColumns, columnCapacity, numColors } = config;
  const colorsToUse = ALL_COLORS.slice(0, numColors);

  const allBlocks: Block[] = [];
  colorsToUse.forEach(color => {
    for (let i = 0; i < columnCapacity; i++) {
      allBlocks.push({ id: blockIdCounter++, color });
    }
  });

  // Shuffle all blocks
  for (let i = allBlocks.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allBlocks[i], allBlocks[j]] = [allBlocks[j], allBlocks[i]];
  }

  const columns: Column[] = Array.from({ length: numColumns }, (_, i) => ({
    id: i,
    blocks: [],
  }));

  // Distribute blocks into columns
  let blockIndex = 0;
  for (let i = 0; i < numColumns; i++) {
    for (let j = 0; j < columnCapacity; j++) {
      if (blockIndex < allBlocks.length) {
        columns[i].blocks.push(allBlocks[blockIndex]);
        blockIndex++;
      }
    }
  }

  return columns;
};

export const isValidMove = (fromColumn: Column, toColumn: Column, config: GameConfig): boolean => {
  // Cannot move from an empty column
  if (fromColumn.blocks.length === 0) {
    return false;
  }

  const movingBlock = fromColumn.blocks[fromColumn.blocks.length - 1];

  // Cannot move to a full column
  if (toColumn.blocks.length >= config.columnCapacity) {
    return false;
  }

  // Can move to an empty column
  if (toColumn.blocks.length === 0) {
    return true;
  }

  // Can move if the top block of the target column is the same color
  const topBlockInToColumn = toColumn.blocks[toColumn.blocks.length - 1];
  return movingBlock.color === topBlockInToColumn.color;
};

export const applyMove = (columns: Column[], fromIndex: number, toIndex: number): Column[] => {
  const newColumns = columns.map(col => ({ ...col, blocks: [...col.blocks] }));
  const fromColumn = newColumns[fromIndex];
  const toColumn = newColumns[toIndex];

  const movingBlock = fromColumn.blocks.pop(); // Remove from source
  if (movingBlock) {
    toColumn.blocks.push(movingBlock); // Add to destination
  }

  return newColumns;
};

export const checkWinCondition = (columns: Column[], config: GameConfig): boolean => {
  const { columnCapacity } = config;

  return columns.every(column => {
    // Empty columns are considered sorted for win condition
    if (column.blocks.length === 0) {
      return true;
    }
    // Check if all blocks in the column are the same color and column is full
    if (column.blocks.length === columnCapacity) {
      const firstColor = column.blocks[0].color;
      return column.blocks.every(block => block.color === firstColor);
    }
    return false;
  });
};
