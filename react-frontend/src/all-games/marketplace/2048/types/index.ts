export type Tile = {
  id: number;
  value: number;
  isNew?: boolean;
  isMerged?: boolean;
};

export type Grid = (Tile | null)[][];
