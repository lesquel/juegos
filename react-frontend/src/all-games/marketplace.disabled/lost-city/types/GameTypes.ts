export interface Entity {
  sprite: string;
  alive: number;
  x: number;
  y: number;
  lastSpawn?: number;
}

export interface Particle {
  sprite: string;
  alive: number;
  x: number;
  y: number;
}

export interface Node {
  x: number;
  y: number;
  neighbors: Node[];
}

export interface GameState {
  // Game dimensions
  mapCols: number;
  mapRows: number;
  mapCenterX: number;
  mapCenterY: number;
  
  // Input state
  pointersX: number[];
  pointersY: number[];
  keysDown: boolean[];
  pointers: number;
  stickX?: number;
  stickY?: number;
  stickDelta?: number;
  
  // Game world
  map: number[];
  nodes: Node[];
  entities: Entity[];
  particles: Particle[];
  blockables: Entity[];
  dust: Particle[];
  pain: Particle[];
  
  // View/Camera
  viewXMin: number;
  viewXMax: number;
  viewYMin: number;
  viewYMax: number;
  lookX: number;
  lookY: number;
  
  // Game timing
  clock: number[];
  start: number;
  now: number;
  last: number;
  finish: number;
  warp: number;
  
  // Game state
  cursed: number;
  cease: number;
  threatLevel: number;
  seed: number;
  
  // UI effects
  shakeUntil: number;
  fadeIn: number;
  fadeOut: number;
  sayId: number;
  
  // Constants
  shakePattern: number[];
  shakeLength: number;
  shakeDuration: number;
  dustLife: number;
}

export interface WebGLShader {
  vertexShader: string;
  fragmentShader: string;
}

export interface GameSprite {
  id: string;
  viewBox: string;
  path: string;
}

export interface GameRenderer {
  canvas: HTMLCanvasElement;
  gl: WebGLRenderingContext;
  shaders: WebGLShader;
  sprites: GameSprite[];
}

export interface GameProps {
  onGameEnd?: (score: number) => void;
  width?: number;
  height?: number;
}
