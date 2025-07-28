export interface Vec {
  x: number;
  y: number;
  clone(): Vec;
}

export interface Box {
  pos: Vec;
  w: number;
  h: number;
  test(other: Box): boolean;
  contains(other: Box): boolean;
  intersect(other: Box): Box;
  clone(): Box;
}

export interface Enemy {
  box: Box;
  speed: Vec;
  collided: Vec;
  frame: number;
  tick: number;
  flip: boolean;
  color: number;
  type: number;
  render(context: CanvasRenderingContext2D): void;
  update(deltaTime: number): void;
}

export interface Player {
  pos: Vec;
  box: Box;
  face: number;
  tick: number;
  walk: boolean;
  pick: boolean;
  frame: number;
  shoot: boolean;
  speed: Vec;
  collided: Vec;
  lasers: Laser[];
  jetSound: AudioContext | null;
  spawn(time?: number): void;
  mute(): void;
  inactive(): boolean;
  spawning(): boolean;
  render(context: CanvasRenderingContext2D): void;
  update(deltaTime: number): void;
}

export interface Laser {
  box: Box;
  speed: Vec;
  frame: number;
  tick: number;
  render(context: CanvasRenderingContext2D): void;
  update(deltaTime: number): void;
}

export interface Bumm {
  box: Box;
  tick: number;
  frame: number;
  end: boolean;
  color: number;
  render(context: CanvasRenderingContext2D): void;
  update(deltaTime: number): void;
}

export interface Sprite {
  render(context: CanvasRenderingContext2D, box: Box, color: number, frame: number): void;
}

export interface GameState {
  // Game timing
  tick: number;
  frame: number;
  deltaTime: number;
  lastTime: number;
  
  // Game objects
  player: Player;
  enemies: Enemy[];
  bumms: Bumm[];
  lasers: Laser[];
  
  // Game state
  score: number;
  level: number;
  lives: number;
  gameOver: boolean;
  paused: boolean;
  
  // Input state
  keys: { [key: string]: boolean };
  gamepad: Gamepad | null;
  
  // Rendering
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  
  // Audio
  audioContext: AudioContext | null;
  sounds: { [key: string]: AudioBuffer };
  
  // Game dimensions
  width: number;
  height: number;
  
  // Collision detection
  collisions: Box[];
}

export interface SfxrParams {
  setSettings(settings: number[]): void;
  [key: string]: any;
}

export interface SfxrSynth {
  _params: SfxrParams;
  reset(): void;
  totalReset(): number;
  synthWave(buffer: Uint16Array, length: number): number;
}

export interface GameProps {
  onGameEnd?: (score: number) => void;
  width?: number;
  height?: number;
}
