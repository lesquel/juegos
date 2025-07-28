// Game Types for PUZLE game
export interface Position {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface GameConfig {
  CANVAS_WIDTH: number;
  CANVAS_HEIGHT: number;
  TILE_SIZE: number;
  HERO_SIZE: number;
  COIN_SIZE: number;
  MAP_SIZE: number;
  INITIAL_TIMER: number;
  INITIAL_SPEED: number;
}

export interface GameColors {
  hero: string;
  coin: string;
  wall: string;
  lava: string;
  portal: string;
  finish: string;
  background: string;
}

export interface GameObject {
  id: string;
  position: Position;
  size: Size;
  color: string;
  isVisible: boolean;
}

export interface Hero extends GameObject {
  isMoving: boolean;
  direction: Direction;
  canMove: boolean;
}

export interface Coin extends GameObject {
  isCollected: boolean;
  value: number;
}

export interface Wall extends GameObject {
  isSolid: boolean;
}

export interface Lava extends GameObject {
  isDangerous: boolean;
}

export interface Portal extends GameObject {
  targetPosition: Position;
  isActive: boolean;
}

export interface Finish extends GameObject {
  isReached: boolean;
}

export type Direction = 'up' | 'down' | 'left' | 'right' | 'none';

export interface KeyMapping {
  key: string;
  direction: Direction;
}

export interface GameState {
  level: number;
  score: number;
  bestScore: number;
  deaths: number;
  timer: number;
  gameSpeed: number;
  isGameOver: boolean;
  isPaused: boolean;
  gamePhase: 'setup' | 'playing' | 'finished' | 'dead';
  
  hero: Hero;
  coins: Coin[];
  walls: Wall[];
  lavas: Lava[];
  portals: Portal[];
  finish: Finish;
  
  coinsCollected: number;
  totalCoins: number;
  timeLeft: number;
}

export interface LevelData {
  level: number;
  coinsPositions: number[][];
  wallsPositions: number[][];
  lavasPositions: number[][];
  portalsPositions: number[][];
  heroPosition: Position;
  finishPosition: Position;
}

export interface GameStats {
  totalGamesPlayed: number;
  bestScore: number;
  averageScore: number;
  totalDeaths: number;
  levelsCompleted: number;
  totalCoinsCollected: number;
  averageTimePerLevel: number;
}

export interface GameControls {
  up: string[];
  down: string[];
  left: string[];
  right: string[];
  restart: string[];
  pause: string[];
}

export interface InstructionText {
  id: string;
  text: string;
  position: Position;
  isVisible: boolean;
}

export type GameDifficulty = 'easy' | 'normal' | 'hard';

export interface DifficultySettings {
  timerSpeed: number;
  lavaSpawnRate: number;
  coinValue: number;
  heroSpeed: number;
}
