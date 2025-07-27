import { GameState, Vec, Box, Player, Enemy, Bumm } from '../types/GameTypes';

export class GameLogic {
  private state: GameState;

  constructor(canvas: HTMLCanvasElement) {
    this.state = this.initializeGameState(canvas);
  }

  private initializeGameState(canvas: HTMLCanvasElement): GameState {
    const context = canvas.getContext('2d')!;
    
    return {
      tick: 0,
      frame: 0,
      deltaTime: 0,
      lastTime: Date.now(),
      
      player: this.createPlayer(),
      enemies: [],
      bumms: [],
      lasers: [],
      
      score: 0,
      level: 1,
      lives: 3,
      gameOver: false,
      paused: false,
      
      keys: {},
      gamepad: null,
      
      canvas,
      context,
      
      audioContext: null,
      sounds: {},
      
      width: canvas.width,
      height: canvas.height,
      
      collisions: []
    };
  }

  private createPlayer(): Player {
    return {
      pos: this.createVec(120, 200),
      box: this.createBox(this.createVec(120, 200), 16, 24),
      face: 0,
      tick: 0,
      walk: true,
      pick: false,
      frame: 1,
      shoot: false,
      speed: this.createVec(0, 1),
      collided: this.createVec(0, 1),
      lasers: [],
      jetSound: null,
      spawn: (time = -200) => {
        this.state.player.tick = time;
        this.state.player.walk = true;
        this.state.player.pick = false;
        this.state.player.face = 0;
        this.state.player.frame = 1;
        this.state.player.shoot = false;
        this.state.player.speed = this.createVec(0, 1);
        this.state.player.collided = this.createVec(0, 1);
      },
      mute: () => {
        if (this.state.player.jetSound) {
          this.state.player.jetSound = null;
        }
      },
      inactive: () => this.state.player.tick < -100,
      spawning: () => this.state.player.tick < 0,
      render: (context: CanvasRenderingContext2D) => {
        this.renderPlayer(context);
      },
      update: (deltaTime: number) => {
        this.updatePlayer(deltaTime);
      }
    };
  }

  private createVec(x: number, y: number): Vec {
    return {
      x,
      y,
      clone: () => this.createVec(x, y)
    };
  }

  private createBox(pos: Vec, w: number, h: number): Box {
    return {
      pos,
      w,
      h,
      test: (other: Box) => {
        return pos.x < other.pos.x + other.w &&
               pos.x + w > other.pos.x &&
               pos.y < other.pos.y + other.h &&
               h + pos.y > other.pos.y;
      },
      contains: (other: Box) => {
        return pos.x <= other.pos.x &&
               pos.x + w >= other.pos.x + other.w &&
               pos.y <= other.pos.y &&
               pos.y + h >= other.pos.y + other.h;
      },
      intersect: (other: Box) => {
        const left = Math.max(pos.x, other.pos.x);
        const top = Math.max(pos.y, other.pos.y);
        const right = Math.min(pos.x + w, other.pos.x + other.w);
        const bottom = Math.min(pos.y + h, other.pos.y + other.h);
        return this.createBox(this.createVec(left, top), right - left, bottom - top);
      },
      clone: () => this.createBox(pos.clone(), w, h)
    };
  }

  public getState(): GameState {
    return this.state;
  }

  public updateTime(): void {
    const now = Date.now();
    this.state.deltaTime = now - this.state.lastTime;
    this.state.lastTime = now;
    this.state.tick++;
  }

  public handleInput(keys: { [key: string]: boolean }): void {
    this.state.keys = keys;
    
    // Handle player movement
    const player = this.state.player;
    if (!player.spawning() && !player.inactive()) {
      player.speed.x = 0;
      player.speed.y = 1; // Default downward movement
      
      if (keys['ArrowLeft'] || keys['a']) {
        player.speed.x = -2;
        player.face = -1;
      }
      if (keys['ArrowRight'] || keys['d']) {
        player.speed.x = 2;
        player.face = 1;
      }
      if (keys['ArrowUp'] || keys['w']) {
        player.speed.y = -2;
      }
      if (keys['ArrowDown'] || keys['s']) {
        player.speed.y = 2;
      }
      if (keys[' '] || keys['Space']) {
        player.shoot = true;
      }
    }
  }

  private renderPlayer(context: CanvasRenderingContext2D): void {
    const player = this.state.player;
    if (player.spawning() || player.inactive()) return;
    
    context.fillStyle = '#00FF00'; // Green player
    context.fillRect(player.box.pos.x, player.box.pos.y, player.box.w, player.box.h);
    
    // Draw simple face direction indicator
    context.fillStyle = '#FFFFFF';
    const faceX = player.box.pos.x + (player.face > 0 ? 12 : 4);
    context.fillRect(faceX, player.box.pos.y + 4, 2, 2);
  }

  private updatePlayer(deltaTime: number): void {
    const player = this.state.player;
    if (player.inactive()) return;
    
    player.tick++;
    
    if (!player.spawning()) {
      // Update position
      player.pos.x += player.speed.x;
      player.pos.y += player.speed.y;
      
      // Keep player in bounds
      player.pos.x = Math.max(0, Math.min(this.state.width - player.box.w, player.pos.x));
      player.pos.y = Math.max(0, Math.min(this.state.height - player.box.h, player.pos.y));
      
      // Update box position
      player.box.pos.x = player.pos.x;
      player.box.pos.y = player.pos.y;
      
      // Animate frame
      if (player.tick % 8 === 0) {
        player.frame = (player.frame + 1) % 3;
      }
    }
  }

  public spawnEnemy(): void {
    const flip = Math.random() < 0.5;
    const x = flip ? 240 : 0;
    const y = Math.round(136 * Math.random()) + 32;
    
    const enemy: Enemy = {
      box: this.createBox(this.createVec(x, y), 16, 16),
      speed: this.createVec(flip ? -1 : 1, 0),
      collided: this.createVec(0, 0),
      frame: 0,
      tick: 0,
      flip,
      color: (this.state.enemies.length % 4) + 1,
      type: Math.floor(Math.random() * 3),
      render: (context: CanvasRenderingContext2D) => {
        this.renderEnemy(context, enemy);
      },
      update: (deltaTime: number) => {
        this.updateEnemy(enemy, deltaTime);
      }
    };
    
    this.state.enemies.push(enemy);
  }

  private renderEnemy(context: CanvasRenderingContext2D, enemy: Enemy): void {
    const colors = ['#FF0000', '#FF8800', '#FFFF00', '#8800FF', '#00FFFF'];
    context.fillStyle = colors[enemy.color - 1] || '#FF0000';
    context.fillRect(enemy.box.pos.x, enemy.box.pos.y, enemy.box.w, enemy.box.h);
    
    // Draw simple enemy indicator
    context.fillStyle = '#000000';
    context.fillRect(enemy.box.pos.x + 4, enemy.box.pos.y + 4, 8, 8);
  }

  private updateEnemy(enemy: Enemy, deltaTime: number): void {
    enemy.tick++;
    
    // Move enemy
    enemy.box.pos.x += enemy.speed.x;
    enemy.box.pos.y += enemy.speed.y;
    
    // Animate frame
    if (enemy.tick % 7 === 0) {
      enemy.frame = (enemy.frame + 1) % 3;
    }
  }

  public update(): void {
    this.updateTime();
    
    // Update player
    this.state.player.update(this.state.deltaTime);
    
    // Update enemies
    this.state.enemies.forEach(enemy => enemy.update(this.state.deltaTime));
    
    // Remove off-screen enemies
    this.state.enemies = this.state.enemies.filter(enemy => 
      enemy.box.pos.x > -20 && enemy.box.pos.x < this.state.width + 20
    );
    
    // Spawn new enemies occasionally
    if (this.state.tick % 60 === 0) {
      this.spawnEnemy();
    }
    
    // Check collisions
    this.checkCollisions();
  }

  private checkCollisions(): void {
    const player = this.state.player;
    if (player.spawning() || player.inactive()) return;
    
    for (const enemy of this.state.enemies) {
      if (player.box.test(enemy.box)) {
        // Collision detected - reduce life, create explosion
        this.state.lives--;
        this.createExplosion(enemy.box.pos.x, enemy.box.pos.y);
        
        if (this.state.lives <= 0) {
          this.state.gameOver = true;
        } else {
          player.spawn();
        }
        break;
      }
    }
  }

  private createExplosion(x: number, y: number): void {
    const bumm: Bumm = {
      box: this.createBox(this.createVec(x, y), 16, 16),
      tick: 0,
      frame: 0,
      end: false,
      color: Math.floor(Math.random() * 4) + 1,
      render: (context: CanvasRenderingContext2D) => {
        if (bumm.frame < 3) {
          context.fillStyle = '#FFFF00';
          const size = 16 + bumm.frame * 4;
          context.fillRect(bumm.box.pos.x - bumm.frame * 2, bumm.box.pos.y - bumm.frame * 2, size, size);
        }
      },
      update: (deltaTime: number) => {
        bumm.tick++;
        if (bumm.tick % 4 === 0) {
          bumm.end = ++bumm.frame > 2;
        }
      }
    };
    
    this.state.bumms.push(bumm);
  }

  public render(): void {
    const { context, width, height } = this.state;
    
    // Clear canvas
    context.fillStyle = '#000011';
    context.fillRect(0, 0, width, height);
    
    // Render stars background
    context.fillStyle = '#FFFFFF';
    for (let i = 0; i < 50; i++) {
      const x = (i * 37) % width;
      const y = (i * 23 + this.state.tick) % height;
      context.fillRect(x, y, 1, 1);
    }
    
    // Render game objects
    this.state.enemies.forEach(enemy => enemy.render(context));
    this.state.bumms.forEach(bumm => bumm.render(context));
    this.state.player.render(context);
    
    // Render UI
    this.renderUI();
    
    // Clean up finished explosions
    this.state.bumms = this.state.bumms.filter(bumm => !bumm.end);
  }

  private renderUI(): void {
    const { context } = this.state;
    
    context.fillStyle = '#FFFFFF';
    context.font = '16px monospace';
    context.fillText(`Score: ${this.state.score}`, 10, 30);
    context.fillText(`Lives: ${this.state.lives}`, 10, 50);
    context.fillText(`Level: ${this.state.level}`, 10, 70);
    
    if (this.state.gameOver) {
      context.fillStyle = 'rgba(0, 0, 0, 0.8)';
      context.fillRect(0, 0, this.state.width, this.state.height);
      
      context.fillStyle = '#FF0000';
      context.font = '32px monospace';
      context.textAlign = 'center';
      context.fillText('GAME OVER', this.state.width / 2, this.state.height / 2);
      context.fillText(`Final Score: ${this.state.score}`, this.state.width / 2, this.state.height / 2 + 40);
      context.textAlign = 'left';
    }
  }
}
