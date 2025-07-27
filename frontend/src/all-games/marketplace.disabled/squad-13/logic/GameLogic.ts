import { GameState, SquadMember, Enemy, GameMap, Dialogue } from '../types/GameTypes';

export class GameLogic {
  private state: GameState;

  constructor(canvas: HTMLCanvasElement) {
    this.state = this.initializeGameState(canvas);
  }

  private initializeGameState(canvas: HTMLCanvasElement): GameState {
    return {
      gameStarted: false,
      gameOver: false,
      paused: false,
      currentScene: 'main_menu',
      
      currentMission: 1,
      totalMissions: 10,
      missionComplete: false,
      missionObjectives: ['Eliminate all enemies', 'Secure the area'],
      completedObjectives: 0,
      
      squad: this.createInitialSquad(),
      selectedUnit: null,
      
      inCombat: false,
      turnOrder: [],
      currentTurn: 0,
      actionPoints: 4,
      
      map: this.createMap(),
      enemies: [],
      items: [],
      
      dialogues: this.createDialogues(),
      currentDialogue: null,
      showInventory: false,
      showStats: false,
      
      keys: {},
      mouse: { x: 0, y: 0, down: false },
      
      deltaTime: 0,
      lastTime: Date.now()
    };
  }

  private createInitialSquad(): SquadMember[] {
    return [
      {
        id: 'leader',
        name: 'Commander Riley',
        class: 'Leader',
        level: 5,
        health: 120,
        maxHealth: 120,
        armor: 25,
        damage: 30,
        accuracy: 85,
        x: 3,
        y: 3,
        facing: 0,
        weapon: {
          id: 'assault_rifle',
          name: 'M4A1 Assault Rifle',
          type: 'rifle',
          damage: 35,
          range: 8,
          accuracy: 80,
          ammo: 30,
          maxAmmo: 30
        },
        equipment: [],
        alive: true,
        actionPointsCurrent: 4,
        actionPointsMax: 4,
        statusEffects: [],
        isPlayerControlled: true
      },
      {
        id: 'sniper',
        name: 'Sgt. Martinez',
        class: 'Sniper',
        level: 4,
        health: 80,
        maxHealth: 80,
        armor: 15,
        damage: 50,
        accuracy: 95,
        x: 2,
        y: 3,
        facing: 0,
        weapon: {
          id: 'sniper_rifle',
          name: 'M40 Sniper Rifle',
          type: 'sniper',
          damage: 70,
          range: 12,
          accuracy: 95,
          ammo: 5,
          maxAmmo: 5
        },
        equipment: [],
        alive: true,
        actionPointsCurrent: 3,
        actionPointsMax: 3,
        statusEffects: [],
        isPlayerControlled: true
      },
      {
        id: 'medic',
        name: 'Cpl. Johnson',
        class: 'Medic',
        level: 3,
        health: 90,
        maxHealth: 90,
        armor: 20,
        damage: 20,
        accuracy: 70,
        x: 4,
        y: 3,
        facing: 0,
        weapon: {
          id: 'smg',
          name: 'MP5 SMG',
          type: 'smg',
          damage: 25,
          range: 5,
          accuracy: 75,
          ammo: 25,
          maxAmmo: 25
        },
        equipment: [],
        alive: true,
        actionPointsCurrent: 4,
        actionPointsMax: 4,
        statusEffects: [],
        isPlayerControlled: true
      }
    ];
  }

  private createMap(): GameMap {
    const width = 20;
    const height = 15;
    const tiles = [];
    
    for (let y = 0; y < height; y++) {
      tiles[y] = [];
      for (let x = 0; x < width; x++) {
        let type = 'floor';
        let walkable = true;
        let cover = 0;
        
        // Create walls around edges
        if (x === 0 || x === width - 1 || y === 0 || y === height - 1) {
          type = 'wall';
          walkable = false;
          cover = 100;
        }
        
        // Add some cover objects
        if ((x === 5 && y === 5) || (x === 10 && y === 8) || (x === 15 && y === 6)) {
          type = 'cover';
          cover = 50;
        }
        
        tiles[y][x] = {
          type,
          walkable,
          cover,
          height: 0,
          sprite: type
        };
      }
    }
    
    return {
      width,
      height,
      tiles,
      spawnPoints: [
        { x: 3, y: 3, type: 'player' },
        { x: 16, y: 10, type: 'enemy' },
        { x: 12, y: 4, type: 'enemy' }
      ]
    };
  }

  private createDialogues(): Dialogue[] {
    return [
      {
        id: 'mission_start',
        speaker: 'Command',
        lines: [
          'Squad 13, this is Command.',
          'Your mission is to secure the facility.',
          'Eliminate all hostile contacts.',
          'Good luck out there.'
        ],
        skippable: true
      }
    ];
  }

  public getState(): GameState {
    return this.state;
  }

  public startGame(): void {
    this.state.gameStarted = true;
    this.state.currentScene = 'briefing';
    this.state.currentDialogue = this.state.dialogues.find(d => d.id === 'mission_start') || null;
  }

  public updateTime(): void {
    const now = Date.now();
    this.state.deltaTime = (now - this.state.lastTime) / 1000;
    this.state.lastTime = now;
  }

  public handleInput(keys: { [key: string]: boolean }): void {
    this.state.keys = keys;
    
    // Handle scene transitions
    if (keys['Enter'] && this.state.currentDialogue) {
      this.state.currentDialogue = null;
      if (this.state.currentScene === 'briefing') {
        this.state.currentScene = 'mission';
        this.spawnEnemies();
      }
    }
    
    // Handle unit selection
    if (keys['1']) this.selectUnit(0);
    if (keys['2']) this.selectUnit(1);
    if (keys['3']) this.selectUnit(2);
    
    // Handle unit movement
    if (this.state.selectedUnit && !this.state.inCombat) {
      let moveX = 0;
      let moveY = 0;
      
      if (keys['ArrowLeft'] || keys['a']) moveX = -1;
      if (keys['ArrowRight'] || keys['d']) moveX = 1;
      if (keys['ArrowUp'] || keys['w']) moveY = -1;
      if (keys['ArrowDown'] || keys['s']) moveY = 1;
      
      if (moveX !== 0 || moveY !== 0) {
        this.moveUnit(this.state.selectedUnit, moveX, moveY);
      }
    }
    
    // Handle combat actions
    if (keys[' '] && this.state.selectedUnit && this.state.inCombat) {
      this.endTurn();
    }
    
    // Handle inventory toggle
    if (keys['i']) {
      this.state.showInventory = !this.state.showInventory;
    }
  }

  public handleMouse(x: number, y: number, down: boolean): void {
    this.state.mouse = { x, y, down };
    
    if (down && this.state.currentScene === 'mission') {
      const tileX = Math.floor(x / 32);
      const tileY = Math.floor(y / 32);
      
      // Check if clicking on a unit
      const clickedUnit = this.state.squad.find(unit => 
        Math.floor(unit.x) === tileX && Math.floor(unit.y) === tileY && unit.alive
      );
      
      if (clickedUnit) {
        this.state.selectedUnit = clickedUnit;
      }
    }
  }

  private selectUnit(index: number): void {
    if (index < this.state.squad.length && this.state.squad[index].alive) {
      this.state.selectedUnit = this.state.squad[index];
    }
  }

  private moveUnit(unit: SquadMember, deltaX: number, deltaY: number): void {
    const newX = unit.x + deltaX;
    const newY = unit.y + deltaY;
    
    // Check bounds and walkability
    if (newX >= 0 && newX < this.state.map.width && 
        newY >= 0 && newY < this.state.map.height &&
        this.state.map.tiles[newY][newX].walkable) {
      
      // Check for unit collision
      const unitAtPosition = this.state.squad.find(u => 
        u.id !== unit.id && Math.floor(u.x) === newX && Math.floor(u.y) === newY
      );
      
      if (!unitAtPosition) {
        unit.x = newX;
        unit.y = newY;
        
        // Check for enemy contact
        this.checkEnemyContact();
      }
    }
  }

  private spawnEnemies(): void {
    const enemySpawns = this.state.map.spawnPoints.filter(sp => sp.type === 'enemy');
    
    for (let i = 0; i < enemySpawns.length; i++) {
      const spawn = enemySpawns[i];
      const enemy: Enemy = {
        id: `enemy_${i}`,
        type: 'soldier',
        name: `Enemy Soldier ${i + 1}`,
        health: 60,
        maxHealth: 60,
        armor: 10,
        damage: 25,
        accuracy: 70,
        x: spawn.x,
        y: spawn.y,
        facing: 0,
        aiType: 'aggressive',
        alertLevel: 0,
        targetId: null,
        alive: true,
        actionPointsCurrent: 3,
        actionPointsMax: 3,
        statusEffects: []
      };
      
      this.state.enemies.push(enemy);
    }
  }

  private checkEnemyContact(): void {
    const playerPositions = this.state.squad.filter(u => u.alive).map(u => ({ x: u.x, y: u.y }));
    
    for (const enemy of this.state.enemies) {
      if (!enemy.alive) continue;
      
      for (const pos of playerPositions) {
        const distance = Math.abs(enemy.x - pos.x) + Math.abs(enemy.y - pos.y);
        if (distance <= 8) {
          this.startCombat();
          return;
        }
      }
    }
  }

  private startCombat(): void {
    this.state.inCombat = true;
    
    // Create turn order
    this.state.turnOrder = [
      ...this.state.squad.filter(u => u.alive),
      ...this.state.enemies.filter(e => e.alive)
    ].sort((a, b) => (b.accuracy || 0) - (a.accuracy || 0));
    
    this.state.currentTurn = 0;
    
    // Reset action points
    for (const unit of this.state.squad) {
      unit.actionPointsCurrent = unit.actionPointsMax;
    }
    for (const enemy of this.state.enemies) {
      enemy.actionPointsCurrent = enemy.actionPointsMax;
    }
  }

  private endTurn(): void {
    this.state.currentTurn++;
    
    if (this.state.currentTurn >= this.state.turnOrder.length) {
      this.state.currentTurn = 0;
      
      // End of round - check for combat end conditions
      const aliveEnemies = this.state.enemies.filter(e => e.alive);
      const aliveSquad = this.state.squad.filter(u => u.alive);
      
      if (aliveEnemies.length === 0) {
        this.endCombat(true);
      } else if (aliveSquad.length === 0) {
        this.endCombat(false);
      }
    }
    
    // Handle AI turns
    const currentUnit = this.state.turnOrder[this.state.currentTurn];
    if ('aiType' in currentUnit) {
      this.handleAITurn(currentUnit as Enemy);
    }
  }

  private handleAITurn(enemy: Enemy): void {
    // Simple AI: move towards nearest squad member and attack if in range
    const targets = this.state.squad.filter(u => u.alive);
    if (targets.length === 0) return;
    
    const nearestTarget = targets.reduce((closest, target) => {
      const dist = Math.abs(enemy.x - target.x) + Math.abs(enemy.y - target.y);
      const closestDist = Math.abs(enemy.x - closest.x) + Math.abs(enemy.y - closest.y);
      return dist < closestDist ? target : closest;
    });
    
    // Move towards target
    const dx = Math.sign(nearestTarget.x - enemy.x);
    const dy = Math.sign(nearestTarget.y - enemy.y);
    
    if (Math.abs(dx) + Math.abs(dy) > 0) {
      const newX = enemy.x + dx;
      const newY = enemy.y + dy;
      
      if (this.state.map.tiles[newY] && this.state.map.tiles[newY][newX] && 
          this.state.map.tiles[newY][newX].walkable) {
        enemy.x = newX;
        enemy.y = newY;
      }
    }
    
    // Attack if in range
    const distance = Math.abs(enemy.x - nearestTarget.x) + Math.abs(enemy.y - nearestTarget.y);
    if (distance <= 3) {
      this.performAttack(enemy, nearestTarget);
    }
    
    setTimeout(() => this.endTurn(), 1000);
  }

  private performAttack(attacker: Enemy | SquadMember, target: Enemy | SquadMember): void {
    const hitChance = attacker.accuracy;
    const hit = Math.random() * 100 < hitChance;
    
    if (hit) {
      let damage = attacker.damage;
      
      // Apply armor reduction
      if ('armor' in target) {
        damage = Math.max(1, damage - target.armor);
      }
      
      target.health -= damage;
      
      if (target.health <= 0) {
        target.alive = false;
        target.health = 0;
      }
    }
  }

  private endCombat(victory: boolean): void {
    this.state.inCombat = false;
    this.state.turnOrder = [];
    this.state.currentTurn = 0;
    
    if (victory) {
      this.state.completedObjectives++;
      if (this.state.completedObjectives >= this.state.missionObjectives.length) {
        this.state.missionComplete = true;
      }
    } else {
      this.state.gameOver = true;
    }
  }

  public update(): void {
    if (!this.state.gameStarted || this.state.gameOver) return;
    
    this.updateTime();
    
    // Update game logic based on current scene
    switch (this.state.currentScene) {
      case 'mission':
        this.updateMission();
        break;
    }
  }

  private updateMission(): void {
    // Check for mission completion
    if (this.state.missionComplete && this.state.currentMission < this.state.totalMissions) {
      this.state.currentMission++;
      this.state.missionComplete = false;
      this.state.completedObjectives = 0;
      // Reset for next mission
      this.spawnEnemies();
    } else if (this.state.missionComplete && this.state.currentMission >= this.state.totalMissions) {
      this.state.gameOver = true;
    }
  }

  public render(context: CanvasRenderingContext2D, width: number, height: number): void {
    // Clear canvas
    context.fillStyle = '#000000';
    context.fillRect(0, 0, width, height);
    
    switch (this.state.currentScene) {
      case 'main_menu':
        this.renderMainMenu(context, width, height);
        break;
      case 'briefing':
        this.renderBriefing(context, width, height);
        break;
      case 'mission':
        this.renderMission(context, width, height);
        break;
    }
  }

  private renderMainMenu(context: CanvasRenderingContext2D, width: number, height: number): void {
    context.fillStyle = '#ffffff';
    context.font = '32px monospace';
    context.textAlign = 'center';
    context.fillText('SQUAD 13', width / 2, height / 2 - 50);
    
    context.font = '16px monospace';
    context.fillText('Press ENTER to start mission', width / 2, height / 2 + 50);
  }

  private renderBriefing(context: CanvasRenderingContext2D, width: number, height: number): void {
    context.fillStyle = '#001122';
    context.fillRect(0, 0, width, height);
    
    if (this.state.currentDialogue) {
      context.fillStyle = 'rgba(0, 0, 0, 0.8)';
      context.fillRect(50, height - 150, width - 100, 120);
      
      context.fillStyle = '#ffffff';
      context.font = '14px monospace';
      context.textAlign = 'left';
      
      let y = height - 130;
      for (const line of this.state.currentDialogue.lines) {
        context.fillText(line, 70, y);
        y += 20;
      }
      
      context.fillText('Press ENTER to continue', 70, y + 10);
    }
  }

  private renderMission(context: CanvasRenderingContext2D, width: number, height: number): void {
    // Render map
    this.renderMap(context);
    
    // Render entities
    this.renderSquad(context);
    this.renderEnemies(context);
    
    // Render UI
    this.renderUI(context, width, height);
  }

  private renderMap(context: CanvasRenderingContext2D): void {
    const tileSize = 32;
    
    for (let y = 0; y < this.state.map.height; y++) {
      for (let x = 0; x < this.state.map.width; x++) {
        const tile = this.state.map.tiles[y][x];
        
        switch (tile.type) {
          case 'floor':
            context.fillStyle = '#334455';
            break;
          case 'wall':
            context.fillStyle = '#666666';
            break;
          case 'cover':
            context.fillStyle = '#885533';
            break;
          default:
            context.fillStyle = '#222222';
        }
        
        context.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
        
        // Draw grid
        context.strokeStyle = '#555555';
        context.lineWidth = 1;
        context.strokeRect(x * tileSize, y * tileSize, tileSize, tileSize);
      }
    }
  }

  private renderSquad(context: CanvasRenderingContext2D): void {
    const tileSize = 32;
    
    for (const unit of this.state.squad) {
      if (!unit.alive) continue;
      
      // Unit body
      context.fillStyle = unit === this.state.selectedUnit ? '#00ff00' : '#0088ff';
      context.fillRect(unit.x * tileSize + 4, unit.y * tileSize + 4, tileSize - 8, tileSize - 8);
      
      // Health bar
      const healthPercent = unit.health / unit.maxHealth;
      context.fillStyle = '#ff0000';
      context.fillRect(unit.x * tileSize + 2, unit.y * tileSize - 6, tileSize - 4, 4);
      context.fillStyle = '#00ff00';
      context.fillRect(unit.x * tileSize + 2, unit.y * tileSize - 6, (tileSize - 4) * healthPercent, 4);
      
      // Name
      context.fillStyle = '#ffffff';
      context.font = '10px monospace';
      context.textAlign = 'center';
      context.fillText(unit.name.split(' ')[0], unit.x * tileSize + tileSize / 2, unit.y * tileSize + tileSize + 12);
    }
  }

  private renderEnemies(context: CanvasRenderingContext2D): void {
    const tileSize = 32;
    
    for (const enemy of this.state.enemies) {
      if (!enemy.alive) continue;
      
      // Enemy body
      context.fillStyle = '#ff4444';
      context.fillRect(enemy.x * tileSize + 4, enemy.y * tileSize + 4, tileSize - 8, tileSize - 8);
      
      // Health bar
      const healthPercent = enemy.health / enemy.maxHealth;
      context.fillStyle = '#330000';
      context.fillRect(enemy.x * tileSize + 2, enemy.y * tileSize - 6, tileSize - 4, 4);
      context.fillStyle = '#ff0000';
      context.fillRect(enemy.x * tileSize + 2, enemy.y * tileSize - 6, (tileSize - 4) * healthPercent, 4);
    }
  }

  private renderUI(context: CanvasRenderingContext2D, width: number, height: number): void {
    // Mission info
    context.fillStyle = 'rgba(0, 0, 0, 0.8)';
    context.fillRect(10, 10, 300, 100);
    
    context.fillStyle = '#ffffff';
    context.font = '14px monospace';
    context.textAlign = 'left';
    
    context.fillText(`Mission: ${this.state.currentMission}/${this.state.totalMissions}`, 20, 30);
    context.fillText(`Objectives: ${this.state.completedObjectives}/${this.state.missionObjectives.length}`, 20, 50);
    
    if (this.state.selectedUnit) {
      context.fillText(`Selected: ${this.state.selectedUnit.name}`, 20, 70);
      context.fillText(`Health: ${this.state.selectedUnit.health}/${this.state.selectedUnit.maxHealth}`, 20, 90);
    }
    
    // Combat UI
    if (this.state.inCombat) {
      context.fillStyle = 'rgba(255, 0, 0, 0.8)';
      context.fillRect(width / 2 - 100, 10, 200, 30);
      
      context.fillStyle = '#ffffff';
      context.textAlign = 'center';
      context.fillText('COMBAT MODE', width / 2, 30);
      
      if (this.state.turnOrder.length > 0) {
        const currentUnit = this.state.turnOrder[this.state.currentTurn];
        const unitName = 'name' in currentUnit ? currentUnit.name : 'Enemy';
        context.fillText(`Turn: ${unitName}`, width / 2, height - 20);
      }
    }
    
    // Controls
    context.fillStyle = '#ffffff';
    context.font = '12px monospace';
    context.textAlign = 'left';
    context.fillText('Controls: 1-3 Select Unit, WASD Move, SPACE End Turn, I Inventory', 10, height - 10);
  }
}
