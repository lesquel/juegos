import { Grid, Tile } from './types';

const GRID_SIZE = 4;

// Helper to get empty cells
const getEmptyCells = (grid: Grid): [number, number][] => {
  const emptyCells: [number, number][] = [];
  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      if (grid[i][j] === null) {
        emptyCells.push([i, j]);
      }
    }
  }
  return emptyCells;
};

// Helper to add a new tile
export const addRandomTile = (grid: Grid): Grid => {
  const newGrid = grid.map(row => row.map(tile => (tile ? { ...tile, isNew: false, isMerged: false } : null)));
  const emptyCells = getEmptyCells(newGrid);
  if (emptyCells.length === 0) return newGrid;

  const [x, y] = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  const value = Math.random() < 0.9 ? 2 : 4;
  newGrid[x][y] = { id: Date.now() + Math.random(), value, isNew: true };

  return newGrid;
};

// Initialize Grid
export const initGrid = (): Grid => {
  let grid: Grid = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(null));
  grid = addRandomTile(grid);
  grid = addRandomTile(grid);
  return grid;
};

// --- Core Movement Logic ---

const processRow = (row: (Tile | null)[]): { newRow: (Tile | null)[]; score: number } => {
  const filteredRow = row.filter(tile => tile !== null) as Tile[];
  let newScore = 0;
  const mergedRow: Tile[] = [];

  for (let i = 0; i < filteredRow.length; i++) {
    if (i + 1 < filteredRow.length && filteredRow[i].value === filteredRow[i + 1].value) {
      const mergedValue = filteredRow[i].value * 2;
      newScore += mergedValue;
      mergedRow.push({ ...filteredRow[i], value: mergedValue, isMerged: true });
      i++; // Skip next tile as it's already merged
    } else {
      mergedRow.push(filteredRow[i]);
    }
  }

  const newRow: (Tile | null)[] = [...mergedRow];
  while (newRow.length < GRID_SIZE) {
    newRow.push(null);
  }

  return { newRow, score: newScore };
};

const transpose = (grid: Grid): Grid => {
  const newGrid = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(null));
  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      newGrid[j][i] = grid[i][j];
    }
  }
  return newGrid;
};

const move = (grid: Grid, direction: 'up' | 'down' | 'left' | 'right'): { newGrid: Grid; score: number; moved: boolean } => {
  let currentGrid = JSON.parse(JSON.stringify(grid));
  let totalScore = 0;
  let moved = false;

  const isVertical = direction === 'up' || direction === 'down';
  const isReverse = direction === 'right' || direction === 'down';

  if (isVertical) {
    currentGrid = transpose(currentGrid);
  }

  for (let i = 0; i < GRID_SIZE; i++) {
    const originalRow = [...currentGrid[i]];
    const rowToProcess = isReverse ? [...originalRow].reverse() : originalRow;
    const { newRow, score } = processRow(rowToProcess);
    totalScore += score;
    currentGrid[i] = isReverse ? newRow.reverse() : newRow;

    if (JSON.stringify(originalRow) !== JSON.stringify(currentGrid[i])) {
      moved = true;
    }
  }

  if (isVertical) {
    currentGrid = transpose(currentGrid);
  }

  return { newGrid: currentGrid, score: totalScore, moved };
};

export const moveUp = (grid: Grid) => move(grid, 'up');
export const moveDown = (grid: Grid) => move(grid, 'down');
export const moveLeft = (grid: Grid) => move(grid, 'left');
export const moveRight = (grid: Grid) => move(grid, 'right');

// Check for game over
export const isGameOver = (grid: Grid): boolean => {
  if (getEmptyCells(grid).length > 0) return false;

  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      const tile = grid[i][j];
      if (tile) {
        if ((i < GRID_SIZE - 1 && grid[i + 1][j]?.value === tile.value) ||
            (j < GRID_SIZE - 1 && grid[i][j + 1]?.value === tile.value)) {
          return false;
        }
      }
    }
  }
  return true;
};
