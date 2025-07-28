// The Society of Multiphobics Types
export interface Fear {
  id: string;
  name: string;
  emoji: string;
  description: string;
  intensity: number;
  category: 'mild' | 'severe' | 'extreme';
}

export interface Position {
  x: number;
  y: number;
}

export interface GameTile {
  id: string;
  position: Position;
  type: 'empty' | 'chair' | 'table' | 'obstacle';
  isOccupied: boolean;
  hasPlayer?: boolean;
  hasFear?: boolean;
  fearId?: string;
}

export interface Player {
  id: string;
  position: Position;
  fears: Fear[];
  score: number;
  isMoving: boolean;
  canMove: boolean;
}

export interface GameState {
  gameBoard: GameTile[][];
  players: Player[];
  currentPlayer: number;
  gamePhase: 'setup' | 'playing' | 'finished';
  turnCount: number;
  timeLeft: number;
  isGameActive: boolean;
  showFears: boolean;
  selectedTile: Position | null;
  hoveredTile: Position | null;
}

export interface GameStats {
  gamesPlayed: number;
  bestScore: number;
  worstScore: number;
  averageScore: number;
  totalFears: number;
  fearsEncountered: string[];
}

export interface GameConfig {
  BOARD_SIZE: number;
  MAX_PLAYERS: number;
  FEARS_PER_GAME: number;
  TIME_LIMIT: number;
  POINTS_PER_FEAR: number;
  POINTS_PER_SURVIVAL: number;
}

export interface GameRules {
  canMoveTo: (from: Position, to: Position, board: GameTile[][]) => boolean;
  calculateScore: (player: Player, survived: boolean) => number;
  checkGameEnd: (players: Player[], timeLeft: number) => boolean;
  spawnFear: (board: GameTile[][], availableFears: Fear[]) => Fear | null;
}

export type GameEvent = 
  | { type: 'PLAYER_MOVE'; playerId: string; from: Position; to: Position }
  | { type: 'FEAR_SPAWNED'; fear: Fear; position: Position }
  | { type: 'FEAR_ENCOUNTERED'; playerId: string; fearId: string }
  | { type: 'GAME_START' }
  | { type: 'GAME_END'; winner: string | null }
  | { type: 'TURN_CHANGE'; newPlayer: number };

export type Difficulty = 'easy' | 'normal' | 'hard' | 'nightmare';
