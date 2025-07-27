import { GameState, Entity, Node, Particle } from '../types/GameTypes';

export class GameLogic {
  private state: GameState;

  constructor() {
    this.state = this.initializeGameState();
  }

  private initializeGameState(): GameState {
    const mapCols = 16;
    const mapRows = 128;
    const start = Date.now();

    return {
      mapCols,
      mapRows,
      mapCenterX: mapCols >> 1,
      mapCenterY: mapRows >> 1,
      
      pointersX: [],
      pointersY: [],
      keysDown: [],
      pointers: 0,
      
      map: [],
      nodes: [],
      entities: [],
      particles: [],
      blockables: [],
      dust: [],
      pain: [],
      
      viewXMin: 0,
      viewXMax: 0,
      viewYMin: 0,
      viewYMax: 0,
      lookX: mapCols >> 1,
      lookY: mapRows - 4,
      
      clock: [],
      start,
      now: start,
      last: start,
      finish: 0,
      warp: 1,
      
      cursed: 0,
      cease: 0,
      threatLevel: 4,
      seed: 1,
      
      shakeUntil: 0,
      fadeIn: start,
      fadeOut: 0,
      sayId: 0,
      
      shakePattern: [.1, -.4, .7, -.3, .5, .2],
      shakeLength: 6,
      shakeDuration: 300,
      dustLife: 150
    };
  }

  public getState(): GameState {
    return this.state;
  }

  public updateTime(currentTime: number): void {
    this.state.now = currentTime;
    this.state.warp = (this.state.now - this.state.last) / 16.6667;
    this.state.last = this.state.now;
  }

  public spawn(what: string, particles: Particle[], entity: Entity, x: number, y: number): void {
    if (this.state.now - entity.lastSpawn! < 50) {
      return;
    }
    entity.lastSpawn = this.state.now;
    
    for (let i = particles.length; i--; ) {
      const particle = particles[i];
      if (particle.alive < this.state.now) {
        particle.sprite = what;
        particle.alive = this.state.now + this.state.dustLife;
        particle.x = x + (Math.random() - 0.5) / 2;
        particle.y = y + (Math.random() - 0.5) / 2;
        break;
      }
    }
  }

  public offset(x: number, y: number): number {
    return Math.round(y) * this.state.mapCols + Math.round(x);
  }

  public canMoveTo(entity: Entity, x: number, y: number): boolean {
    x = Math.round(x);
    y = Math.round(y);
    const cell = this.state.nodes[this.offset(entity.x, entity.y)];
    
    if (cell.x === x && cell.y === y) {
      return true;
    }
    
    const neighbors = cell.neighbors;
    for (let i = neighbors.length; i--; ) {
      const n = neighbors[i];
      if (n.x === x && n.y === y) {
        return true;
      }
    }
    return false;
  }

  public blocks(x: number, y: number): boolean {
    return !!(this.state.map[this.offset(x, y)] & 128);
  }

  public clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
  }

  public isWater(x: number, y: number): boolean {
    const tile = this.state.map[this.offset(x, y)];
    return tile >= 22 && tile < 26;
  }

  public moveTo(entity: Entity, tx: number, ty: number, speed: number): boolean {
    if ('stunned' in entity && (entity as any).stunned > this.state.now) {
      return false;
    }
    
    const dx = tx - entity.x;
    const dy = ty - entity.y;
    const moving = Math.abs(dx) + Math.abs(dy) > 0;
    
    if (!moving) {
      return false;
    }
    
    const f = Math.min(1, speed * this.state.warp / Math.sqrt(dx * dx + dy * dy));
    let x = this.clamp(entity.x + dx * f, 0, this.state.mapCols - 1);
    let y = this.clamp(entity.y + dy * f, 0, this.state.mapRows - 1);
    
    // Handle collision for player
    if ((entity as any).isPlayer) {
      this.state.cease = 0;
      if (this.blocks(x, y) || !this.canMoveTo(entity, x, y)) {
        if (!this.blocks(x, entity.y) && this.canMoveTo(entity, x, entity.y)) {
          y = entity.y;
        } else if (!this.blocks(entity.x, y) && this.canMoveTo(entity, entity.x, y)) {
          x = entity.x;
        } else {
          return true;
        }
      }
    }
    
    entity.x = x;
    entity.y = y;
    (entity as any).dx = dx < 0 ? -1 : 1;
    (entity as any).sink = this.isWater(x, y);
    
    this.spawn('2', this.state.dust, entity, x, y);
    return f === 1;
  }

  public random(): number {
    // Seeded random number generator
    return (this.state.seed = (this.state.seed * 9301 + 49297) % 233280) / 233280;
  }

  public initializeMap(): void {
    const map3 = Math.floor(this.state.mapRows / 3);
    const waterRow = map3;
    const sandRow = map3 * 2;
    const areas = [
      { sprite: 22, y: waterRow }, // water
      { sprite: 21, y: waterRow + 1 }, // water to sand
      { sprite: 20, y: sandRow }, // sand
      { sprite: 19, y: sandRow + 1 }, // sand to soil
      { sprite: 12, y: this.state.mapRows }, // soil
    ];

    // Initialize map tiles
    for (let y = 0, i = 0, area = 0, a = areas[area]; y < this.state.mapRows; ++y) {
      for (let x = 0; x < this.state.mapCols; ++x, ++i) {
        if (y > a.y) {
          a = areas[++area];
        }
        this.state.map[i] = a.sprite;
        this.state.nodes[i] = { x, y, neighbors: [] };
      }
    }

    // Initialize node neighbors
    for (let i = 0, y = 0; y < this.state.mapRows; ++y) {
      for (let x = 0; x < this.state.mapCols; ++x, ++i) {
        const neighbors: Node[] = [];
        if (x > 0) neighbors.push(this.state.nodes[this.offset(x - 1, y)]);
        if (x < this.state.mapCols - 1) neighbors.push(this.state.nodes[this.offset(x + 1, y)]);
        if (y > 0) neighbors.push(this.state.nodes[this.offset(x, y - 1)]);
        if (y < this.state.mapRows - 1) neighbors.push(this.state.nodes[this.offset(x, y + 1)]);
        this.state.nodes[i].neighbors = neighbors;
      }
    }
  }

  public handleInput(keysDown: boolean[], pointers: number, pointersX: number[], pointersY: number[], 
                    stickX?: number, stickY?: number): { x: number; y: number } {
    const player = this.getPlayer();
    if (!player || (player as any).life <= 0) {
      return { x: 0, y: 0 };
    }

    const max = (player as any).speed;
    let x = 0, y = 0;

    // Keyboard input
    if (keysDown[37] || keysDown[72]) x -= max; // Left or H
    if (keysDown[39] || keysDown[76]) x += max; // Right or L
    if (keysDown[38] || keysDown[75]) y -= max; // Up or K
    if (keysDown[40] || keysDown[74]) y += max; // Down or J

    // Touch/mouse input
    if (pointers && stickX !== undefined && stickY !== undefined) {
      const dx = stickX - pointersX[0];
      const dy = stickY - pointersY[0];
      x = -Math.max(-max, Math.min(dx * this.state.warp, max));
      y = Math.max(-max, Math.min(dy * this.state.warp, max));
    }

    // Cursed mode reverses controls
    if (this.state.cursed && (x || y)) {
      x = -x;
      y = -y;
    }

    return { x, y };
  }

  public getPlayer(): Entity | null {
    return this.state.entities.find(e => (e as any).isPlayer) || null;
  }
}
