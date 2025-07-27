export interface Vec {
  x: number;
  y: number;
}

export interface Camera {
  pos: Vec;
  vel: Vec;
  size: number;
}

export interface Player {
  pos: Vec;
  vel: Vec;
  radius: number;
  grounded: boolean;
  onPlatform: boolean;
  jumps: number;
  maxJumps: number;
  color: string;
}

export interface Platform {
  pos: Vec;
  size: Vec;
  color: string;
  solid: boolean;
}

export interface Hole {
  pos: Vec;
  radius: number;
  completed: boolean;
}

export interface Level {
  platforms: Platform[];
  hole: Hole;
  player: Player;
  gravity: number;
  friction: number;
  jumpPower: number;
}

export interface GameState {
  // Current game state
  currentLevel: number;
  totalLevels: number;
  score: number;
  jumps: number;
  stars: number;
  
  // Game status
  gameStarted: boolean;
  gameOver: boolean;
  levelComplete: boolean;
  paused: boolean;
  
  // Game objects
  player: Player;
  camera: Camera;
  level: Level;
  
  // Input state
  keys: { [key: string]: boolean };
  mouse: {
    pos: Vec;
    down: boolean;
    drag: boolean;
    dragStart: Vec;
  };
  
  // Physics
  gravity: number;
  friction: number;
  airResistance: number;
  
  // Timing
  deltaTime: number;
  lastTime: number;
  
  // Rendering
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  colors: string[];
  
  // Audio
  sounds: { [key: string]: HTMLAudioElement };
}

export interface GameProps {
  onGameEnd?: (score: number) => void;
  onLevelComplete?: (level: number, stars: number) => void;
  width?: number;
  height?: number;
}
