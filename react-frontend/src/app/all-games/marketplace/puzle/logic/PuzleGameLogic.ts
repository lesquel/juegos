import type { 
  GameState, 
  Position, 
  Direction, 
  Hero, 
  Coin, 
  Wall, 
  Lava, 
  Portal, 
  Finish,
  LevelData,
  GameConfig,
  GameColors 
} from '../types/GameTypes';

export class PuzleGameLogic {
  static readonly CONFIG: GameConfig = {
    CANVAS_WIDTH: 900,
    CANVAS_HEIGHT: 400,
    TILE_SIZE: 16,
    HERO_SIZE: 8,
    COIN_SIZE: 12,
    MAP_SIZE: 25,
    INITIAL_TIMER: 13.0,
    INITIAL_SPEED: 3
  };

  static readonly COLORS: GameColors = {
    hero: '#ffffff',
    coin: '#ffd166',
    wall: '#073b4c',
    lava: '#ef476f',
    portal: '#f78c6b',
    finish: '#06d6a0',
    background: '#edddd4'
  };

  // Level data extracted from constants.js
  static readonly LEVEL_DATA: LevelData[] = [
    { level: 1, coinsPositions: [], wallsPositions: [[17, 20], [22, 21]], lavasPositions: [], portalsPositions: [], heroPosition: { x: 21 * 16 + 4, y: 21 * 16 + 4 }, finishPosition: { x: 32, y: 48 } },
    { level: 2, coinsPositions: [[15, 17]], wallsPositions: [[17, 20], [22, 21]], lavasPositions: [], portalsPositions: [], heroPosition: { x: 21 * 16 + 4, y: 21 * 16 + 4 }, finishPosition: { x: 32, y: 48 } },
    { level: 3, coinsPositions: [[7, 11], [19, 5]], wallsPositions: [[17, 20], [22, 21]], lavasPositions: [], portalsPositions: [], heroPosition: { x: 21 * 16 + 4, y: 21 * 16 + 4 }, finishPosition: { x: 32, y: 48 } },
    { level: 4, coinsPositions: [[7, 15], [7, 5], [21, 3]], wallsPositions: [[17, 20], [22, 21]], lavasPositions: [], portalsPositions: [], heroPosition: { x: 21 * 16 + 4, y: 21 * 16 + 4 }, finishPosition: { x: 32, y: 48 } },
    { level: 5, coinsPositions: [[5, 13], [3, 11], [11, 3], [5, 5]], wallsPositions: [[17, 20], [22, 21]], lavasPositions: [[7, 15], [7, 16], [7, 17], [6, 17], [5, 17], [5, 18], [5, 19], [4, 19], [4, 20], [6, 19]], portalsPositions: [], heroPosition: { x: 21 * 16 + 4, y: 21 * 16 + 4 }, finishPosition: { x: 32, y: 48 } },
    { level: 6, coinsPositions: [[19, 15], [5, 5], [15, 9], [11, 17], [11, 7]], wallsPositions: [[22, 21]], lavasPositions: [[7, 15], [7, 16], [7, 17], [6, 17], [5, 17], [5, 18], [5, 19], [4, 19], [4, 20], [6, 19], [11, 19], [11, 20], [11, 21], [10, 19], [12, 21]], portalsPositions: [[17, 20]], heroPosition: { x: 21 * 16 + 4, y: 21 * 16 + 4 }, finishPosition: { x: 32, y: 48 } },
    { level: 7, coinsPositions: [[13, 15], [17, 15], [20, 11], [17, 3], [13, 13], [3, 8]], wallsPositions: [[22, 21]], lavasPositions: [[7, 15], [7, 16], [7, 17], [6, 17], [5, 17], [5, 18], [5, 19], [4, 19], [4, 20], [6, 19], [11, 19], [11, 20], [11, 21], [10, 19], [12, 21], [9, 18], [9, 17], [8, 17], [9, 19], [16, 17], [16, 16], [17, 16], [15, 17]], portalsPositions: [[17, 20]], heroPosition: { x: 21 * 16 + 4, y: 21 * 16 + 4 }, finishPosition: { x: 32, y: 48 } },
    { level: 8, coinsPositions: [], wallsPositions: [], lavasPositions: [[7, 15], [7, 16], [7, 17], [6, 17], [5, 17], [5, 18], [5, 19], [4, 19], [4, 20], [6, 19], [11, 19], [11, 20], [11, 21], [10, 19], [12, 21], [9, 18], [9, 17], [8, 17], [9, 19], [16, 17], [16, 16], [17, 16], [15, 17], [17, 17], [17, 18], [17, 19], [16, 19]], portalsPositions: [[17, 20], [22, 21]], heroPosition: { x: 21 * 16 + 4, y: 21 * 16 + 4 }, finishPosition: { x: 32, y: 48 } }
  ];

  static readonly INSTRUCTIONS = [
    "Find the exit, no pressure... except the clock!",
    "Grab a coin, then run for your life!",
    "Two coins, one goal: survive!",
    "Three coins and the finish line. Go get rich!",
    "Four coins and avoid the lava. It's a hot mess!",
    "Five coins, dodge the lava, and oh yeah, walk through walls!",
    "Six coins, lava everywhere, walls are still optional!",
    "Lava... lava everywhere, good luck getting anywhere!",
    "Congrats, Maze Master! You've defeated your Triskaidekaphobia. \\nYou're a true legend!"
  ];

  static createInitialState(): GameState {
    const levelData = this.LEVEL_DATA[0];
    return {
      level: 1,
      score: 0,
      bestScore: this.getBestScore(),
      deaths: 0,
      timer: this.CONFIG.INITIAL_TIMER,
      gameSpeed: this.CONFIG.INITIAL_SPEED,
      isGameOver: false,
      isPaused: false,
      gamePhase: 'setup',
      
      hero: this.createHero(levelData.heroPosition),
      coins: this.createCoins(levelData.coinsPositions),
      walls: this.createWalls(levelData.wallsPositions),
      lavas: this.createLavas(levelData.lavasPositions),
      portals: this.createPortals(levelData.portalsPositions),
      finish: this.createFinish(levelData.finishPosition),
      
      coinsCollected: 0,
      totalCoins: levelData.coinsPositions.length,
      timeLeft: this.CONFIG.INITIAL_TIMER
    };
  }

  static createHero(position: Position): Hero {
    return {
      id: 'hero',
      position: { ...position },
      size: { width: this.CONFIG.HERO_SIZE, height: this.CONFIG.HERO_SIZE },
      color: this.COLORS.hero,
      isVisible: true,
      isMoving: false,
      direction: 'none',
      canMove: true
    };
  }

  static createCoins(positions: number[][]): Coin[] {
    return positions.map((pos, index) => ({
      id: `coin-${index}`,
      position: { 
        x: pos[0] * this.CONFIG.TILE_SIZE + this.centerSprite(this.CONFIG.TILE_SIZE, this.CONFIG.COIN_SIZE), 
        y: pos[1] * this.CONFIG.TILE_SIZE + this.centerSprite(this.CONFIG.TILE_SIZE, this.CONFIG.COIN_SIZE) 
      },
      size: { width: this.CONFIG.COIN_SIZE, height: this.CONFIG.COIN_SIZE },
      color: this.COLORS.coin,
      isVisible: true,
      isCollected: false,
      value: 100
    }));
  }

  static createWalls(positions: number[][]): Wall[] {
    return positions.map((pos, index) => ({
      id: `wall-${index}`,
      position: { x: pos[0] * this.CONFIG.TILE_SIZE, y: pos[1] * this.CONFIG.TILE_SIZE },
      size: { width: this.CONFIG.TILE_SIZE, height: this.CONFIG.TILE_SIZE },
      color: this.COLORS.wall,
      isVisible: true,
      isSolid: true
    }));
  }

  static createLavas(positions: number[][]): Lava[] {
    return positions.map((pos, index) => ({
      id: `lava-${index}`,
      position: { x: pos[0] * this.CONFIG.TILE_SIZE, y: pos[1] * this.CONFIG.TILE_SIZE },
      size: { width: this.CONFIG.TILE_SIZE, height: this.CONFIG.TILE_SIZE },
      color: this.COLORS.lava,
      isVisible: true,
      isDangerous: true
    }));
  }

  static createPortals(positions: number[][]): Portal[] {
    return positions.map((pos, index) => ({
      id: `portal-${index}`,
      position: { x: pos[0] * this.CONFIG.TILE_SIZE, y: pos[1] * this.CONFIG.TILE_SIZE },
      size: { width: this.CONFIG.TILE_SIZE, height: this.CONFIG.TILE_SIZE },
      color: this.COLORS.portal,
      isVisible: true,
      targetPosition: { x: pos[0] * this.CONFIG.TILE_SIZE, y: pos[1] * this.CONFIG.TILE_SIZE },
      isActive: true
    }));
  }

  static createFinish(position: Position): Finish {
    return {
      id: 'finish',
      position: { ...position },
      size: { width: this.CONFIG.TILE_SIZE, height: this.CONFIG.TILE_SIZE },
      color: this.COLORS.finish,
      isVisible: true,
      isReached: false
    };
  }

  static centerSprite(tileSize: number, spriteSize: number): number {
    return (tileSize - spriteSize) / 2;
  }

  static moveHero(state: GameState, direction: Direction): GameState {
    if (!state.hero.canMove || state.gamePhase !== 'playing') return state;

    const newPosition = { ...state.hero.position };
    const moveDistance = this.CONFIG.TILE_SIZE;

    switch (direction) {
      case 'up':
        newPosition.y -= moveDistance;
        break;
      case 'down':
        newPosition.y += moveDistance;
        break;
      case 'left':
        newPosition.x -= moveDistance;
        break;
      case 'right':
        newPosition.x += moveDistance;
        break;
      default:
        return state;
    }

    // Check bounds
    if (newPosition.x < 0 || newPosition.x >= this.CONFIG.CANVAS_WIDTH - this.CONFIG.HERO_SIZE ||
        newPosition.y < 0 || newPosition.y >= this.CONFIG.CANVAS_HEIGHT - this.CONFIG.HERO_SIZE) {
      return state;
    }

    // Check wall collisions (unless portal allows passage)
    const heroRect = { ...newPosition, width: this.CONFIG.HERO_SIZE, height: this.CONFIG.HERO_SIZE };
    const wallCollision = state.walls.find(wall => this.checkCollision(heroRect, wall));
    const portalCollision = state.portals.find(portal => this.checkCollision(heroRect, portal));
    
    if (wallCollision && !portalCollision) {
      return state;
    }

    const updatedHero = {
      ...state.hero,
      position: newPosition,
      direction,
      isMoving: true
    };

    return {
      ...state,
      hero: updatedHero
    };
  }

  static checkCollision(rect1: any, rect2: any): boolean {
    return rect1.x < rect2.position.x + rect2.size.width &&
           rect1.x + rect1.width > rect2.position.x &&
           rect1.y < rect2.position.y + rect2.size.height &&
           rect1.y + rect1.height > rect2.position.y;
  }

  static checkCollisions(state: GameState): GameState {
    const heroRect = {
      x: state.hero.position.x,
      y: state.hero.position.y,
      width: state.hero.size.width,
      height: state.hero.size.height
    };

    // Check coin collisions
    const updatedCoins = state.coins.map(coin => {
      if (!coin.isCollected && this.checkCollision(heroRect, coin)) {
        return { ...coin, isCollected: true };
      }
      return coin;
    });

    const newCoinsCollected = updatedCoins.filter(coin => coin.isCollected).length;
    const scoreIncrease = (newCoinsCollected - state.coinsCollected) * 100;

    // Check lava collision
    const lavaCollision = state.lavas.some(lava => this.checkCollision(heroRect, lava));
    if (lavaCollision) {
      return this.handleDeath(state);
    }

    // Check finish collision
    const finishCollision = this.checkCollision(heroRect, state.finish);
    const allCoinsCollected = newCoinsCollected === state.totalCoins;
    
    if (finishCollision && allCoinsCollected) {
      return this.completeLevel(state);
    }

    return {
      ...state,
      coins: updatedCoins,
      coinsCollected: newCoinsCollected,
      score: state.score + scoreIncrease
    };
  }

  static handleDeath(state: GameState): GameState {
    return {
      ...state,
      deaths: state.deaths + 1,
      gamePhase: 'dead',
      hero: {
        ...state.hero,
        canMove: false
      }
    };
  }

  static completeLevel(state: GameState): GameState {
    const nextLevel = state.level + 1;
    const timeBonus = Math.floor(state.timeLeft * 10);
    const newScore = state.score + timeBonus;

    // Update best score
    if (newScore > state.bestScore) {
      this.setBestScore(newScore);
    }

    if (nextLevel > this.LEVEL_DATA.length) {
      return {
        ...state,
        score: newScore,
        bestScore: Math.max(state.bestScore, newScore),
        gamePhase: 'finished'
      };
    }

    return this.loadLevel(state, nextLevel, newScore);
  }

  static loadLevel(state: GameState, level: number, score: number): GameState {
    const levelData = this.LEVEL_DATA[level - 1];
    if (!levelData) return state;

    return {
      ...state,
      level,
      score,
      timer: this.CONFIG.INITIAL_TIMER,
      timeLeft: this.CONFIG.INITIAL_TIMER,
      gamePhase: 'playing',
      
      hero: this.createHero(levelData.heroPosition),
      coins: this.createCoins(levelData.coinsPositions),
      walls: this.createWalls(levelData.wallsPositions),
      lavas: this.createLavas(levelData.lavasPositions),
      portals: this.createPortals(levelData.portalsPositions),
      finish: this.createFinish(levelData.finishPosition),
      
      coinsCollected: 0,
      totalCoins: levelData.coinsPositions.length
    };
  }

  static updateTimer(state: GameState, deltaTime: number): GameState {
    if (state.gamePhase !== 'playing' || state.isPaused) return state;

    const newTimeLeft = Math.max(0, state.timeLeft - deltaTime);
    
    if (newTimeLeft === 0) {
      return this.handleDeath(state);
    }

    return {
      ...state,
      timeLeft: newTimeLeft
    };
  }

  static startGame(state: GameState): GameState {
    return {
      ...state,
      gamePhase: 'playing',
      timer: this.CONFIG.INITIAL_TIMER,
      timeLeft: this.CONFIG.INITIAL_TIMER
    };
  }

  static restartLevel(state: GameState): GameState {
    return this.loadLevel({
      ...state,
      deaths: state.deaths + 1
    }, state.level, state.score);
  }

  static pauseGame(state: GameState): GameState {
    return {
      ...state,
      isPaused: true
    };
  }

  static resumeGame(state: GameState): GameState {
    return {
      ...state,
      isPaused: false
    };
  }

  static resetGame(): GameState {
    return this.createInitialState();
  }

  static getCurrentInstruction(level: number): string {
    return this.INSTRUCTIONS[level - 1] || this.INSTRUCTIONS[0];
  }

  static getBestScore(): number {
    const stored = localStorage.getItem('puzle-best-score');
    return stored ? parseInt(stored, 10) : 0;
  }

  static setBestScore(score: number): void {
    localStorage.setItem('puzle-best-score', score.toString());
  }

  static calculateScore(timeLeft: number, coinsCollected: number, level: number): number {
    const timeBonus = Math.floor(timeLeft * 10);
    const coinBonus = coinsCollected * 100;
    const levelBonus = level * 50;
    return timeBonus + coinBonus + levelBonus;
  }

  static formatTime(time: number): string {
    return time.toFixed(1) + 's';
  }

  static isLevelCompleted(state: GameState): boolean {
    return state.coinsCollected === state.totalCoins;
  }

  static getProgressPercentage(state: GameState): number {
    if (state.totalCoins === 0) return 100;
    return Math.round((state.coinsCollected / state.totalCoins) * 100);
  }
}
