import { GameState, Entity, Particle, GameConfig } from '../types/GameTypes';

export class GameLogic {
  private state: GameState;
  private config: GameConfig;

  constructor(canvas: HTMLCanvasElement, config: Partial<GameConfig> = {}) {
    this.config = {
      width: 800,
      height: 600,
      maxLevel: 10,
      playerSpeed: 200,
      gravity: 500,
      friction: 0.8,
      ...config
    };
    
    this.state = this.initializeGameState(canvas);
  }

  private initializeGameState(canvas: HTMLCanvasElement): GameState {
    return {
      gameStarted: false,
      gameOver: false,
      paused: false,
      level: 1,
      score: 0,
      lives: 3,
      
      time: 0,
      deltaTime: 0,
      lastTime: Date.now(),
      
      player: {
        x: this.config.width / 2,
        y: this.config.height / 2,
        width: 32,
        height: 32,
        health: 100,
        maxHealth: 100,
        speed: this.config.playerSpeed,
        direction: 0
      },
      
      world: {
        width: this.config.width,
        height: this.config.height,
        gravity: this.config.gravity,
        friction: this.config.friction
      },
      
      entities: [],
      particles: [],
      
      input: {
        keys: {},
        mouse: {
          x: 0,
          y: 0,
          down: false
        }
      },
      
      camera: {
        x: 0,
        y: 0,
        zoom: 1
      },
      
      sounds: {}
    };
  }

  public getState(): GameState {
    return this.state;
  }

  public startGame(): void {
    this.state.gameStarted = true;
    this.state.gameOver = false;
    this.state.level = 1;
    this.state.score = 0;
    this.state.lives = 3;
    this.state.player.health = this.state.player.maxHealth;
    this.resetLevel();
  }

  public updateTime(): void {
    const now = Date.now();
    this.state.deltaTime = (now - this.state.lastTime) / 1000; // Convert to seconds
    this.state.lastTime = now;
    this.state.time += this.state.deltaTime;
  }

  public handleInput(keys: { [key: string]: boolean }): void {
    this.state.input.keys = keys;
  }

  public handleMouse(x: number, y: number, down: boolean): void {
    this.state.input.mouse = { x, y, down };
  }

  public update(): void {
    if (!this.state.gameStarted || this.state.gameOver || this.state.paused) {
      return;
    }

    this.updateTime();
    this.updatePlayer();
    this.updateEntities();
    this.updateParticles();
    this.updateCamera();
    this.checkCollisions();
    this.cleanupEntities();
    this.spawnEnemies();
  }

  private updatePlayer(): void {
    const player = this.state.player;
    const input = this.state.input;
    const deltaTime = this.state.deltaTime;
    
    // Handle player movement
    let moveX = 0;
    let moveY = 0;
    
    if (input.keys['ArrowLeft'] || input.keys['a']) {
      moveX = -1;
      player.direction = -1;
    }
    if (input.keys['ArrowRight'] || input.keys['d']) {
      moveX = 1;
      player.direction = 1;
    }
    if (input.keys['ArrowUp'] || input.keys['w']) {
      moveY = -1;
    }
    if (input.keys['ArrowDown'] || input.keys['s']) {
      moveY = 1;
    }
    
    // Normalize diagonal movement
    if (moveX !== 0 && moveY !== 0) {
      moveX *= 0.707;
      moveY *= 0.707;
    }
    
    // Update player position
    player.x += moveX * player.speed * deltaTime;
    player.y += moveY * player.speed * deltaTime;
    
    // Keep player in bounds
    player.x = Math.max(0, Math.min(this.state.world.width - player.width, player.x));
    player.y = Math.max(0, Math.min(this.state.world.height - player.height, player.y));
    
    // Create movement particles
    if (moveX !== 0 || moveY !== 0) {
      this.createParticle(
        player.x + player.width / 2,
        player.y + player.height,
        (Math.random() - 0.5) * 50,
        Math.random() * 50,
        '#888888',
        30
      );
    }
  }

  private updateEntities(): void {
    for (const entity of this.state.entities) {
      if (!entity.active) continue;
      
      if (entity.update) {
        entity.update(this.state.deltaTime, this.state);
      } else {
        // Default entity update
        entity.x += entity.velocityX * this.state.deltaTime;
        entity.y += entity.velocityY * this.state.deltaTime;
        
        // Apply gravity if needed
        if (entity.type === 'enemy' || entity.type === 'projectile') {
          entity.velocityY += this.state.world.gravity * this.state.deltaTime;
        }
        
        // Keep entities in world bounds
        if (entity.x < -entity.width || entity.x > this.state.world.width ||
            entity.y < -entity.height || entity.y > this.state.world.height) {
          entity.active = false;
        }
      }
    }
  }

  private updateParticles(): void {
    for (const particle of this.state.particles) {
      particle.x += particle.velocityX * this.state.deltaTime;
      particle.y += particle.velocityY * this.state.deltaTime;
      
      if (particle.gravity) {
        particle.velocityY += this.state.world.gravity * this.state.deltaTime;
      }
      
      particle.life -= this.state.deltaTime;
    }
    
    // Remove dead particles
    this.state.particles = this.state.particles.filter(p => p.life > 0);
  }

  private updateCamera(): void {
    const camera = this.state.camera;
    const player = this.state.player;
    
    // Follow player with smooth camera
    const targetX = player.x + player.width / 2 - this.config.width / 2;
    const targetY = player.y + player.height / 2 - this.config.height / 2;
    
    camera.x += (targetX - camera.x) * 0.1;
    camera.y += (targetY - camera.y) * 0.1;
  }

  private checkCollisions(): void {
    const player = this.state.player;
    
    for (const entity of this.state.entities) {
      if (!entity.active) continue;
      
      if (this.isColliding(player, entity)) {
        this.handlePlayerEntityCollision(entity);
      }
    }
  }

  private isColliding(a: any, b: any): boolean {
    return a.x < b.x + b.width &&
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y;
  }

  private handlePlayerEntityCollision(entity: Entity): void {
    switch (entity.type) {
      case 'enemy':
        this.damagePlayer(20);
        this.createExplosion(entity.x + entity.width / 2, entity.y + entity.height / 2);
        entity.active = false;
        break;
      case 'collectible':
        this.state.score += 100;
        this.createPickupEffect(entity.x + entity.width / 2, entity.y + entity.height / 2);
        entity.active = false;
        break;
      case 'powerup':
        this.state.player.health = Math.min(this.state.player.maxHealth, this.state.player.health + 25);
        this.createHealEffect(entity.x + entity.width / 2, entity.y + entity.height / 2);
        entity.active = false;
        break;
    }
  }

  private damagePlayer(damage: number): void {
    this.state.player.health -= damage;
    if (this.state.player.health <= 0) {
      this.state.lives--;
      if (this.state.lives <= 0) {
        this.state.gameOver = true;
      } else {
        this.state.player.health = this.state.player.maxHealth;
        this.resetPlayerPosition();
      }
    }
  }

  private resetPlayerPosition(): void {
    this.state.player.x = this.config.width / 2;
    this.state.player.y = this.config.height / 2;
  }

  private cleanupEntities(): void {
    this.state.entities = this.state.entities.filter(e => e.active);
  }

  private spawnEnemies(): void {
    // Spawn enemies periodically
    if (Math.random() < 0.01 * this.state.level) {
      this.createEnemy();
    }
    
    // Spawn collectibles
    if (Math.random() < 0.005) {
      this.createCollectible();
    }
  }

  private createEnemy(): void {
    const side = Math.floor(Math.random() * 4);
    let x, y;
    
    switch (side) {
      case 0: // Top
        x = Math.random() * this.config.width;
        y = -32;
        break;
      case 1: // Right
        x = this.config.width;
        y = Math.random() * this.config.height;
        break;
      case 2: // Bottom
        x = Math.random() * this.config.width;
        y = this.config.height;
        break;
      default: // Left
        x = -32;
        y = Math.random() * this.config.height;
        break;
    }
    
    const player = this.state.player;
    const dx = player.x - x;
    const dy = player.y - y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const speed = 50 + this.state.level * 10;
    
    const enemy: Entity = {
      id: `enemy_${Date.now()}_${Math.random()}`,
      type: 'enemy',
      x,
      y,
      width: 24,
      height: 24,
      velocityX: (dx / distance) * speed,
      velocityY: (dy / distance) * speed,
      health: 1,
      active: true,
      color: '#ff4444'
    };
    
    this.state.entities.push(enemy);
  }

  private createCollectible(): void {
    const collectible: Entity = {
      id: `collectible_${Date.now()}_${Math.random()}`,
      type: 'collectible',
      x: Math.random() * (this.config.width - 16),
      y: Math.random() * (this.config.height - 16),
      width: 16,
      height: 16,
      velocityX: 0,
      velocityY: 0,
      health: 1,
      active: true,
      color: '#ffff44'
    };
    
    this.state.entities.push(collectible);
  }

  private createParticle(x: number, y: number, vx: number, vy: number, color: string, life: number): void {
    const particle: Particle = {
      x,
      y,
      velocityX: vx,
      velocityY: vy,
      life,
      maxLife: life,
      size: 2 + Math.random() * 4,
      color,
      gravity: true
    };
    
    this.state.particles.push(particle);
  }

  private createExplosion(x: number, y: number): void {
    for (let i = 0; i < 10; i++) {
      this.createParticle(
        x,
        y,
        (Math.random() - 0.5) * 200,
        (Math.random() - 0.5) * 200,
        '#ff6644',
        0.5 + Math.random() * 0.5
      );
    }
  }

  private createPickupEffect(x: number, y: number): void {
    for (let i = 0; i < 5; i++) {
      this.createParticle(
        x,
        y,
        (Math.random() - 0.5) * 100,
        -Math.random() * 100,
        '#ffff44',
        1
      );
    }
  }

  private createHealEffect(x: number, y: number): void {
    for (let i = 0; i < 8; i++) {
      this.createParticle(
        x,
        y,
        (Math.random() - 0.5) * 50,
        -Math.random() * 50,
        '#44ff44',
        1.5
      );
    }
  }

  private resetLevel(): void {
    this.state.entities = [];
    this.state.particles = [];
    this.resetPlayerPosition();
    this.state.player.health = this.state.player.maxHealth;
  }

  public nextLevel(): void {
    if (this.state.level < this.config.maxLevel) {
      this.state.level++;
      this.resetLevel();
    } else {
      this.state.gameOver = true;
    }
  }

  public render(context: CanvasRenderingContext2D): void {
    const { width, height } = this.config;
    const camera = this.state.camera;
    
    // Clear canvas
    context.fillStyle = '#001122';
    context.fillRect(0, 0, width, height);
    
    // Save context for camera transform
    context.save();
    context.translate(-camera.x, -camera.y);
    
    // Render background grid
    this.renderGrid(context);
    
    // Render entities
    for (const entity of this.state.entities) {
      if (entity.active) {
        if (entity.render) {
          entity.render(context, camera);
        } else {
          this.renderEntity(context, entity);
        }
      }
    }
    
    // Render particles
    for (const particle of this.state.particles) {
      this.renderParticle(context, particle);
    }
    
    // Render player
    this.renderPlayer(context);
    
    context.restore();
    
    // Render UI
    this.renderUI(context);
  }

  private renderGrid(context: CanvasRenderingContext2D): void {
    context.strokeStyle = '#003344';
    context.lineWidth = 1;
    
    const gridSize = 50;
    const startX = Math.floor(this.state.camera.x / gridSize) * gridSize;
    const startY = Math.floor(this.state.camera.y / gridSize) * gridSize;
    
    for (let x = startX; x < startX + this.config.width + gridSize; x += gridSize) {
      context.beginPath();
      context.moveTo(x, this.state.camera.y);
      context.lineTo(x, this.state.camera.y + this.config.height);
      context.stroke();
    }
    
    for (let y = startY; y < startY + this.config.height + gridSize; y += gridSize) {
      context.beginPath();
      context.moveTo(this.state.camera.x, y);
      context.lineTo(this.state.camera.x + this.config.width, y);
      context.stroke();
    }
  }

  private renderEntity(context: CanvasRenderingContext2D, entity: Entity): void {
    context.fillStyle = entity.color;
    context.fillRect(entity.x, entity.y, entity.width, entity.height);
    
    // Add border
    context.strokeStyle = '#ffffff';
    context.lineWidth = 1;
    context.strokeRect(entity.x, entity.y, entity.width, entity.height);
  }

  private renderParticle(context: CanvasRenderingContext2D, particle: Particle): void {
    const alpha = particle.life / particle.maxLife;
    context.fillStyle = particle.color + Math.floor(alpha * 255).toString(16).padStart(2, '0');
    context.fillRect(particle.x - particle.size / 2, particle.y - particle.size / 2, particle.size, particle.size);
  }

  private renderPlayer(context: CanvasRenderingContext2D): void {
    const player = this.state.player;
    
    // Player body
    context.fillStyle = '#4488ff';
    context.fillRect(player.x, player.y, player.width, player.height);
    
    // Player face/direction indicator
    context.fillStyle = '#ffffff';
    const eyeX = player.x + (player.direction > 0 ? player.width * 0.75 : player.width * 0.25);
    context.fillRect(eyeX - 2, player.y + 8, 4, 4);
    
    // Health bar
    const barWidth = player.width;
    const barHeight = 4;
    const healthPercent = player.health / player.maxHealth;
    
    context.fillStyle = '#ff0000';
    context.fillRect(player.x, player.y - 8, barWidth, barHeight);
    context.fillStyle = '#00ff00';
    context.fillRect(player.x, player.y - 8, barWidth * healthPercent, barHeight);
  }

  private renderUI(context: CanvasRenderingContext2D): void {
    context.font = '16px monospace';
    context.fillStyle = '#ffffff';
    context.textAlign = 'left';
    
    context.fillText(`Level: ${this.state.level}`, 10, 30);
    context.fillText(`Score: ${this.state.score}`, 10, 50);
    context.fillText(`Lives: ${this.state.lives}`, 10, 70);
    context.fillText(`Health: ${Math.max(0, Math.round(this.state.player.health))}`, 10, 90);
    
    if (this.state.gameOver) {
      context.font = '32px monospace';
      context.fillStyle = '#ff4444';
      context.textAlign = 'center';
      context.fillText('GAME OVER', this.config.width / 2, this.config.height / 2);
      context.fillText(`Final Score: ${this.state.score}`, this.config.width / 2, this.config.height / 2 + 40);
    }
  }
}
