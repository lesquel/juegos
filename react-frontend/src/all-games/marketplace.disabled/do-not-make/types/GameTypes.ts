export interface GameState {
  // Core game state
  gameStarted: boolean;
  gameOver: boolean;
  paused: boolean;
  level: number;
  score: number;
  lives: number;
  
  // Timing
  time: number;
  deltaTime: number;
  lastTime: number;
  
  // Player state
  player: {
    x: number;
    y: number;
    width: number;
    height: number;
    health: number;
    maxHealth: number;
    speed: number;
    direction: number;
  };
  
  // World state
  world: {
    width: number;
    height: number;
    gravity: number;
    friction: number;
  };
  
  // Objects
  entities: Entity[];
  particles: Particle[];
  
  // Input
  input: {
    keys: { [key: string]: boolean };
    mouse: {
      x: number;
      y: number;
      down: boolean;
    };
  };
  
  // Rendering
  camera: {
    x: number;
    y: number;
    zoom: number;
  };
  
  // Audio
  sounds: { [key: string]: HTMLAudioElement };
}

export interface Entity {
  id: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  velocityX: number;
  velocityY: number;
  health: number;
  active: boolean;
  color: string;
  
  update?(deltaTime: number, gameState: GameState): void;
  render?(context: CanvasRenderingContext2D, camera: { x: number; y: number }): void;
  onCollision?(other: Entity): void;
}

export interface Particle {
  x: number;
  y: number;
  velocityX: number;
  velocityY: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
  gravity: boolean;
}

export interface GameConfig {
  width: number;
  height: number;
  maxLevel: number;
  playerSpeed: number;
  gravity: number;
  friction: number;
}

export interface GameProps {
  onGameEnd?: (score: number) => void;
  onLevelComplete?: (level: number) => void;
  width?: number;
  height?: number;
  config?: Partial<GameConfig>;
}
