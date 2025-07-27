import { GameState, Vec, Player, Camera, Level, Platform, Hole } from '../types/GameTypes';

export class GameLogic {
  private state: GameState;

  constructor(canvas: HTMLCanvasElement) {
    this.state = this.initializeGameState(canvas);
  }

  private initializeGameState(canvas: HTMLCanvasElement): GameState {
    const context = canvas.getContext('2d')!;
    
    const colors = [
      "#ffffff", "#ffd588", "#72cb48", "#b2d4d4", "#c45544", "#cc9155",
      "#0a8a71", "#66aaf7", "#7f3355", "#000000", "#114c77", "#8891aa"
    ];

    return {
      currentLevel: 1,
      totalLevels: 10,
      score: 0,
      jumps: 0,
      stars: 0,
      
      gameStarted: false,
      gameOver: false,
      levelComplete: false,
      paused: false,
      
      player: this.createPlayer(),
      camera: this.createCamera(),
      level: this.createLevel(1),
      
      keys: {},
      mouse: {
        pos: { x: 0, y: 0 },
        down: false,
        drag: false,
        dragStart: { x: 0, y: 0 }
      },
      
      gravity: 0.5,
      friction: 0.9,
      airResistance: 0.98,
      
      deltaTime: 0,
      lastTime: Date.now(),
      
      canvas,
      context,
      colors,
      
      sounds: {}
    };
  }

  private createPlayer(): Player {
    return {
      pos: { x: 0, y: 0 },
      vel: { x: 0, y: 0 },
      radius: 0.3,
      grounded: false,
      onPlatform: false,
      jumps: 0,
      maxJumps: 2,
      color: "#72cb48"
    };
  }

  private createCamera(): Camera {
    return {
      pos: { x: 5, y: -2 },
      vel: { x: 0, y: 0 },
      size: 10
    };
  }

  private createLevel(levelNum: number): Level {
    const platforms: Platform[] = [];
    
    // Create basic platforms for level
    platforms.push({
      pos: { x: 0, y: 0 },
      size: { x: 2, y: 0.5 },
      color: "#cc9155",
      solid: true
    });
    
    platforms.push({
      pos: { x: 3, y: -1 },
      size: { x: 2, y: 0.5 },
      color: "#cc9155",
      solid: true
    });
    
    platforms.push({
      pos: { x: 6, y: -2.5 },
      size: { x: 2, y: 0.5 },
      color: "#cc9155",
      solid: true
    });
    
    platforms.push({
      pos: { x: 9, y: -4 },
      size: { x: 2, y: 0.5 },
      color: "#cc9155",
      solid: true
    });

    const hole: Hole = {
      pos: { x: 10, y: -3.5 },
      radius: 0.4,
      completed: false
    };

    const player: Player = {
      pos: { x: 1, y: -1 },
      vel: { x: 0, y: 0 },
      radius: 0.3,
      grounded: false,
      onPlatform: false,
      jumps: 0,
      maxJumps: 2,
      color: "#72cb48"
    };

    return {
      platforms,
      hole,
      player,
      gravity: 0.5,
      friction: 0.9,
      jumpPower: 8
    };
  }

  public getState(): GameState {
    return this.state;
  }

  public updateTime(): void {
    const now = Date.now();
    this.state.deltaTime = (now - this.state.lastTime) / 16.67; // 60fps normalized
    this.state.lastTime = now;
  }

  public handleInput(keys: { [key: string]: boolean }): void {
    this.state.keys = keys;
    
    const player = this.state.player;
    
    // Handle jumping
    if ((keys[' '] || keys['Space'] || keys['ArrowUp'] || keys['w']) && player.jumps < player.maxJumps) {
      if (player.grounded || player.jumps < player.maxJumps - 1) {
        player.vel.y = -this.state.level.jumpPower;
        player.jumps++;
        player.grounded = false;
        this.state.jumps++;
      }
    }
    
    // Handle horizontal movement
    let moveForce = 0;
    if (keys['ArrowLeft'] || keys['a']) {
      moveForce = -0.8;
    }
    if (keys['ArrowRight'] || keys['d']) {
      moveForce = 0.8;
    }
    
    if (player.grounded) {
      player.vel.x += moveForce;
      player.vel.x *= this.state.friction;
    } else {
      player.vel.x += moveForce * 0.3;
      player.vel.x *= this.state.airResistance;
    }
  }

  public handleMouseInput(mousePos: Vec, mouseDown: boolean): void {
    this.state.mouse.pos = mousePos;
    this.state.mouse.down = mouseDown;
    
    if (mouseDown && !this.state.mouse.drag) {
      this.state.mouse.drag = true;
      this.state.mouse.dragStart = { ...mousePos };
    } else if (!mouseDown && this.state.mouse.drag) {
      this.state.mouse.drag = false;
      
      // Apply launch force based on drag
      const dragDistance = this.distance(this.state.mouse.dragStart, mousePos);
      const dragAngle = Math.atan2(
        mousePos.y - this.state.mouse.dragStart.y,
        mousePos.x - this.state.mouse.dragStart.x
      );
      
      const force = Math.min(dragDistance * 0.02, 15);
      this.state.player.vel.x = -Math.cos(dragAngle) * force;
      this.state.player.vel.y = -Math.sin(dragAngle) * force;
      this.state.jumps++;
    }
  }

  private distance(a: Vec, b: Vec): number {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  public update(): void {
    this.updateTime();
    
    if (this.state.paused || this.state.gameOver || this.state.levelComplete) {
      return;
    }
    
    this.updatePlayer();
    this.updateCamera();
    this.checkCollisions();
    this.checkWinCondition();
  }

  private updatePlayer(): void {
    const player = this.state.player;
    
    // Apply gravity
    player.vel.y += this.state.gravity * this.state.deltaTime;
    
    // Update position
    player.pos.x += player.vel.x * this.state.deltaTime;
    player.pos.y += player.vel.y * this.state.deltaTime;
    
    // Reset grounded state
    player.grounded = false;
    player.onPlatform = false;
  }

  private updateCamera(): void {
    const camera = this.state.camera;
    const player = this.state.player;
    
    // Follow player with smooth camera
    const targetX = player.pos.x;
    const targetY = player.pos.y;
    
    camera.vel.x = (targetX - camera.pos.x) * 0.1;
    camera.vel.y = (targetY - camera.pos.y) * 0.1;
    
    camera.pos.x += camera.vel.x;
    camera.pos.y += camera.vel.y;
  }

  private checkCollisions(): void {
    const player = this.state.player;
    const platforms = this.state.level.platforms;
    
    for (const platform of platforms) {
      if (!platform.solid) continue;
      
      // Check collision with platform
      if (this.isColliding(player, platform)) {
        this.resolveCollision(player, platform);
      }
    }
    
    // Check hole collision
    const hole = this.state.level.hole;
    const holeDistance = this.distance(player.pos, hole.pos);
    if (holeDistance < hole.radius + player.radius) {
      this.state.levelComplete = true;
      this.calculateScore();
    }
  }

  private isColliding(player: Player, platform: Platform): boolean {
    return player.pos.x + player.radius > platform.pos.x &&
           player.pos.x - player.radius < platform.pos.x + platform.size.x &&
           player.pos.y + player.radius > platform.pos.y &&
           player.pos.y - player.radius < platform.pos.y + platform.size.y;
  }

  private resolveCollision(player: Player, platform: Platform): void {
    const centerX = platform.pos.x + platform.size.x / 2;
    const centerY = platform.pos.y + platform.size.y / 2;
    
    const dx = player.pos.x - centerX;
    const dy = player.pos.y - centerY;
    
    const xOverlap = (platform.size.x / 2 + player.radius) - Math.abs(dx);
    const yOverlap = (platform.size.y / 2 + player.radius) - Math.abs(dy);
    
    if (xOverlap < yOverlap) {
      // Horizontal collision
      if (dx > 0) {
        player.pos.x = platform.pos.x + platform.size.x + player.radius;
      } else {
        player.pos.x = platform.pos.x - player.radius;
      }
      player.vel.x = 0;
    } else {
      // Vertical collision
      if (dy > 0) {
        player.pos.y = platform.pos.y + platform.size.y + player.radius;
        player.vel.y = Math.max(0, player.vel.y);
      } else {
        player.pos.y = platform.pos.y - player.radius;
        player.vel.y = Math.min(0, player.vel.y);
        player.grounded = true;
        player.onPlatform = true;
        player.jumps = 0;
      }
    }
  }

  private checkWinCondition(): void {
    // Check if player fell off the world
    if (this.state.player.pos.y > 10) {
      this.resetLevel();
    }
  }

  private calculateScore(): void {
    const jumpBonus = Math.max(0, 20 - this.state.jumps) * 10;
    this.state.score += 100 + jumpBonus;
    
    // Calculate stars based on performance
    if (this.state.jumps <= 3) {
      this.state.stars = 3;
    } else if (this.state.jumps <= 6) {
      this.state.stars = 2;
    } else {
      this.state.stars = 1;
    }
  }

  public nextLevel(): void {
    if (this.state.currentLevel < this.state.totalLevels) {
      this.state.currentLevel++;
      this.state.level = this.createLevel(this.state.currentLevel);
      this.state.player = { ...this.state.level.player };
      this.state.levelComplete = false;
      this.state.jumps = 0;
    } else {
      this.state.gameOver = true;
    }
  }

  public resetLevel(): void {
    this.state.player = { ...this.state.level.player };
    this.state.jumps = 0;
    this.state.levelComplete = false;
  }

  public startGame(): void {
    this.state.gameStarted = true;
    this.state.gameOver = false;
    this.state.currentLevel = 1;
    this.state.score = 0;
    this.state.jumps = 0;
    this.state.level = this.createLevel(1);
    this.state.player = { ...this.state.level.player };
  }

  public render(): void {
    const { context, canvas, camera } = this.state;
    
    // Clear canvas
    context.fillStyle = '#66aaf7'; // Sky blue
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    // Save context for camera transform
    context.save();
    
    // Apply camera transform
    const scale = canvas.width / camera.size;
    context.translate(canvas.width / 2, canvas.height / 2);
    context.scale(scale, -scale); // Flip Y axis
    context.translate(-camera.pos.x, camera.pos.y);
    
    // Render platforms
    this.renderPlatforms();
    
    // Render hole
    this.renderHole();
    
    // Render player
    this.renderPlayer();
    
    // Render trajectory if dragging
    if (this.state.mouse.drag) {
      this.renderTrajectory();
    }
    
    context.restore();
    
    // Render UI
    this.renderUI();
  }

  private renderPlatforms(): void {
    const { context } = this.state;
    
    for (const platform of this.state.level.platforms) {
      context.fillStyle = platform.color;
      context.fillRect(platform.pos.x, platform.pos.y, platform.size.x, platform.size.y);
      
      // Add border
      context.strokeStyle = '#000000';
      context.lineWidth = 0.05;
      context.strokeRect(platform.pos.x, platform.pos.y, platform.size.x, platform.size.y);
    }
  }

  private renderHole(): void {
    const { context } = this.state;
    const hole = this.state.level.hole;
    
    context.fillStyle = '#000000';
    context.beginPath();
    context.arc(hole.pos.x, hole.pos.y, hole.radius, 0, Math.PI * 2);
    context.fill();
    
    // Add glow effect
    context.strokeStyle = '#ffff00';
    context.lineWidth = 0.1;
    context.stroke();
  }

  private renderPlayer(): void {
    const { context } = this.state;
    const player = this.state.player;
    
    context.fillStyle = player.color;
    context.beginPath();
    context.arc(player.pos.x, player.pos.y, player.radius, 0, Math.PI * 2);
    context.fill();
    
    // Add eyes
    context.fillStyle = '#000000';
    context.beginPath();
    context.arc(player.pos.x - 0.1, player.pos.y + 0.1, 0.05, 0, Math.PI * 2);
    context.arc(player.pos.x + 0.1, player.pos.y + 0.1, 0.05, 0, Math.PI * 2);
    context.fill();
  }

  private renderTrajectory(): void {
    const { context, mouse, player } = this.state;
    
    context.strokeStyle = '#ffffff';
    context.lineWidth = 0.1;
    context.setLineDash([0.2, 0.2]);
    
    context.beginPath();
    context.moveTo(player.pos.x, player.pos.y);
    
    // Convert screen coordinates to world coordinates
    const worldStart = this.screenToWorld(mouse.dragStart);
    const worldCurrent = this.screenToWorld(mouse.pos);
    
    context.lineTo(worldCurrent.x, worldCurrent.y);
    context.stroke();
    
    context.setLineDash([]);
  }

  private screenToWorld(screenPos: Vec): Vec {
    const { canvas, camera } = this.state;
    const scale = canvas.width / camera.size;
    
    const x = ((screenPos.x - canvas.width / 2) / scale) + camera.pos.x;
    const y = camera.pos.y - ((screenPos.y - canvas.height / 2) / scale);
    
    return { x, y };
  }

  private renderUI(): void {
    const { context, canvas } = this.state;
    
    context.font = '20px monospace';
    context.fillStyle = '#ffffff';
    context.textAlign = 'left';
    
    context.fillText(`Level: ${this.state.currentLevel}`, 10, 30);
    context.fillText(`Score: ${this.state.score}`, 10, 55);
    context.fillText(`Jumps: ${this.state.jumps}`, 10, 80);
    
    if (this.state.levelComplete) {
      context.font = '32px monospace';
      context.fillStyle = '#ffff00';
      context.textAlign = 'center';
      context.fillText('Level Complete!', canvas.width / 2, canvas.height / 2);
      context.fillText(`Stars: ${'★'.repeat(this.state.stars)}`, canvas.width / 2, canvas.height / 2 + 40);
    }
    
    if (this.state.gameOver) {
      context.font = '32px monospace';
      context.fillStyle = '#ff0000';
      context.textAlign = 'center';
      context.fillText('Game Complete!', canvas.width / 2, canvas.height / 2);
      context.fillText(`Final Score: ${this.state.score}`, canvas.width / 2, canvas.height / 2 + 40);
    }
  }
}
