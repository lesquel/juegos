import type { 
  Fear, 
  Position, 
  GameTile, 
  Player, 
  GameState, 
  GameStats, 
  GameConfig,
  Difficulty 
} from '../types/GameTypes';

export class SocietyGameLogic {
  static readonly CONFIG: GameConfig = {
    BOARD_SIZE: 11,
    MAX_PLAYERS: 4,
    FEARS_PER_GAME: 13,
    TIME_LIMIT: 300, // 5 minutes
    POINTS_PER_FEAR: -10,
    POINTS_PER_SURVIVAL: 50
  };

  static readonly FEARS: Fear[] = [
    { id: 'arachnophobia', name: 'Aracnofobia', emoji: '🕷️', description: 'Miedo a las arañas', intensity: 3, category: 'mild' },
    { id: 'claustrophobia', name: 'Claustrofobia', emoji: '📦', description: 'Miedo a espacios cerrados', intensity: 4, category: 'mild' },
    { id: 'acrophobia', name: 'Acrofobia', emoji: '🏔️', description: 'Miedo a las alturas', intensity: 5, category: 'severe' },
    { id: 'trypophobia', name: 'Tripofobia', emoji: '🕳️', description: 'Miedo a los agujeros', intensity: 4, category: 'mild' },
    { id: 'nyctophobia', name: 'Nictofobia', emoji: '🌙', description: 'Miedo a la oscuridad', intensity: 6, category: 'severe' },
    { id: 'thanatophobia', name: 'Tanatofobia', emoji: '💀', description: 'Miedo a la muerte', intensity: 8, category: 'extreme' },
    { id: 'hemophobia', name: 'Hemofobia', emoji: '🩸', description: 'Miedo a la sangre', intensity: 5, category: 'severe' },
    { id: 'ophidiophobia', name: 'Ofidiofobia', emoji: '🐍', description: 'Miedo a las serpientes', intensity: 4, category: 'mild' },
    { id: 'entomophobia', name: 'Entomofobia', emoji: '🐛', description: 'Miedo a los insectos', intensity: 3, category: 'mild' },
    { id: 'coulrophobia', name: 'Coulrofobia', emoji: '🤡', description: 'Miedo a los payasos', intensity: 7, category: 'extreme' },
    { id: 'thalassophobia', name: 'Talasofobia', emoji: '🌊', description: 'Miedo al océano', intensity: 6, category: 'severe' },
    { id: 'necrophobia', name: 'Necrofobia', emoji: '⚰️', description: 'Miedo a los muertos', intensity: 7, category: 'extreme' },
    { id: 'automatonophobia', name: 'Automatonofobia', emoji: '🤖', description: 'Miedo a los autómatas', intensity: 5, category: 'severe' }
  ];

  static createInitialState(): GameState {
    const board = this.createGameBoard();
    const players = this.createPlayers();
    
    return {
      gameBoard: board,
      players: players,
      currentPlayer: 0,
      gamePhase: 'setup',
      turnCount: 0,
      timeLeft: this.CONFIG.TIME_LIMIT,
      isGameActive: false,
      showFears: false,
      selectedTile: null,
      hoveredTile: null
    };
  }

  static createGameBoard(): GameTile[][] {
    const board: GameTile[][] = [];
    const size = this.CONFIG.BOARD_SIZE;

    for (let y = 0; y < size; y++) {
      board[y] = [];
      for (let x = 0; x < size; x++) {
        board[y][x] = {
          id: `tile-${x}-${y}`,
          position: { x, y },
          type: this.getTileType(x, y, size),
          isOccupied: false
        };
      }
    }

    // Add some tables and chairs
    this.placeFurniture(board);
    
    return board;
  }

  static getTileType(x: number, y: number, size: number): 'empty' | 'chair' | 'table' | 'obstacle' {
    // Center area for tables
    const center = Math.floor(size / 2);
    const distance = Math.abs(x - center) + Math.abs(y - center);
    
    if (distance <= 2) {
      return Math.random() < 0.3 ? 'table' : 'empty';
    }
    
    // Random chairs near edges
    if (x === 0 || x === size - 1 || y === 0 || y === size - 1) {
      return Math.random() < 0.2 ? 'chair' : 'empty';
    }
    
    return 'empty';
  }

  static placeFurniture(board: GameTile[][]): void {
    const size = board.length;
    const center = Math.floor(size / 2);
    
    // Place main table in center
    board[center][center].type = 'table';
    
    // Place chairs around main table
    const chairPositions = [
      { x: center - 1, y: center },
      { x: center + 1, y: center },
      { x: center, y: center - 1 },
      { x: center, y: center + 1 }
    ];
    
    chairPositions.forEach(pos => {
      if (this.isValidPosition(pos, size)) {
        board[pos.y][pos.x].type = 'chair';
      }
    });
  }

  static createPlayers(): Player[] {
    return [{
      id: 'player-1',
      position: { x: 1, y: 1 },
      fears: [],
      score: 0,
      isMoving: false,
      canMove: true
    }];
  }

  static isValidPosition(pos: Position, boardSize: number): boolean {
    return pos.x >= 0 && pos.x < boardSize && pos.y >= 0 && pos.y < boardSize;
  }

  static canMoveTo(from: Position, to: Position, board: GameTile[][]): boolean {
    if (!this.isValidPosition(to, board.length)) return false;
    
    const targetTile = board[to.y][to.x];
    if (targetTile.isOccupied || targetTile.type === 'obstacle') return false;
    
    // Can only move to adjacent tiles
    const distance = Math.abs(from.x - to.x) + Math.abs(from.y - to.y);
    return distance === 1;
  }

  static movePlayer(state: GameState, playerId: string, newPosition: Position): GameState {
    const playerIndex = state.players.findIndex(p => p.id === playerId);
    if (playerIndex === -1) return state;
    
    const player = state.players[playerIndex];
    const oldPosition = player.position;
    
    if (!this.canMoveTo(oldPosition, newPosition, state.gameBoard)) {
      return state;
    }
    
    // Update board occupation
    state.gameBoard[oldPosition.y][oldPosition.x].isOccupied = false;
    state.gameBoard[oldPosition.y][oldPosition.x].hasPlayer = false;
    
    state.gameBoard[newPosition.y][newPosition.x].isOccupied = true;
    state.gameBoard[newPosition.y][newPosition.x].hasPlayer = true;
    
    // Update player
    const updatedPlayers = [...state.players];
    updatedPlayers[playerIndex] = {
      ...player,
      position: newPosition
    };
    
    return {
      ...state,
      players: updatedPlayers,
      turnCount: state.turnCount + 1
    };
  }

  static spawnFear(state: GameState): GameState {
    const availablePositions = this.getEmptyPositions(state.gameBoard);
    if (availablePositions.length === 0) return state;
    
    const randomPosition = availablePositions[Math.floor(Math.random() * availablePositions.length)];
    const randomFear = this.FEARS[Math.floor(Math.random() * this.FEARS.length)];
    
    const updatedBoard = state.gameBoard.map(row => 
      row.map(tile => {
        if (tile.position.x === randomPosition.x && tile.position.y === randomPosition.y) {
          return {
            ...tile,
            hasFear: true,
            fearId: randomFear.id
          };
        }
        return tile;
      })
    );
    
    return {
      ...state,
      gameBoard: updatedBoard
    };
  }

  static getEmptyPositions(board: GameTile[][]): Position[] {
    const positions: Position[] = [];
    
    board.forEach(row => {
      row.forEach(tile => {
        if (tile.type === 'empty' && !tile.isOccupied && !tile.hasFear) {
          positions.push(tile.position);
        }
      });
    });
    
    return positions;
  }

  static checkFearEncounter(state: GameState, playerId: string): GameState {
    const player = state.players.find(p => p.id === playerId);
    if (!player) return state;
    
    const currentTile = state.gameBoard[player.position.y][player.position.x];
    if (!currentTile.hasFear || !currentTile.fearId) return state;
    
    const fear = this.FEARS.find(f => f.id === currentTile.fearId);
    if (!fear) return state;
    
    // Add fear to player and update score
    const updatedPlayers = state.players.map(p => {
      if (p.id === playerId) {
        return {
          ...p,
          fears: [...p.fears, fear],
          score: p.score + this.CONFIG.POINTS_PER_FEAR
        };
      }
      return p;
    });
    
    // Remove fear from board
    const updatedBoard = state.gameBoard.map(row =>
      row.map(tile => {
        if (tile.position.x === player.position.x && tile.position.y === player.position.y) {
          return {
            ...tile,
            hasFear: false,
            fearId: undefined
          };
        }
        return tile;
      })
    );
    
    return {
      ...state,
      players: updatedPlayers,
      gameBoard: updatedBoard
    };
  }

  static startGame(state: GameState): GameState {
    return {
      ...state,
      gamePhase: 'playing',
      isGameActive: true,
      timeLeft: this.CONFIG.TIME_LIMIT
    };
  }

  static updateTimer(state: GameState, deltaTime: number): GameState {
    if (!state.isGameActive) return state;
    
    const newTimeLeft = Math.max(0, state.timeLeft - deltaTime);
    
    if (newTimeLeft === 0) {
      return this.endGame(state);
    }
    
    return {
      ...state,
      timeLeft: newTimeLeft
    };
  }

  static endGame(state: GameState): GameState {
    // Award survival points
    const updatedPlayers = state.players.map(player => ({
      ...player,
      score: player.score + this.CONFIG.POINTS_PER_SURVIVAL
    }));
    
    return {
      ...state,
      players: updatedPlayers,
      gamePhase: 'finished',
      isGameActive: false
    };
  }

  static getFearByPosition(board: GameTile[][], position: Position): Fear | null {
    const tile = board[position.y]?.[position.x];
    if (!tile?.hasFear || !tile.fearId) return null;
    
    return this.FEARS.find(f => f.id === tile.fearId) || null;
  }

  static calculateFinalScore(player: Player): number {
    let score = player.score;
    
    // Bonus for surviving without encountering many fears
    if (player.fears.length <= 3) {
      score += 100;
    }
    
    // Penalty for encountering extreme fears
    const extremeFears = player.fears.filter(f => f.category === 'extreme').length;
    score -= extremeFears * 20;
    
    return Math.max(0, score);
  }

  static getDifficultySettings(difficulty: Difficulty) {
    const settings = {
      easy: { fearSpawnRate: 0.1, timeLimit: 400, fearIntensityMultiplier: 0.7 },
      normal: { fearSpawnRate: 0.15, timeLimit: 300, fearIntensityMultiplier: 1.0 },
      hard: { fearSpawnRate: 0.25, timeLimit: 200, fearIntensityMultiplier: 1.3 },
      nightmare: { fearSpawnRate: 0.35, timeLimit: 150, fearIntensityMultiplier: 1.5 }
    };
    
    return settings[difficulty];
  }

  static formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  static createEmptyStats(): GameStats {
    return {
      gamesPlayed: 0,
      bestScore: 0,
      worstScore: 0,
      averageScore: 0,
      totalFears: 0,
      fearsEncountered: []
    };
  }

  static updateStats(stats: GameStats, finalScore: number, fearsEncountered: Fear[]): GameStats {
    const newGamesPlayed = stats.gamesPlayed + 1;
    const newTotalScore = (stats.averageScore * stats.gamesPlayed) + finalScore;
    
    return {
      gamesPlayed: newGamesPlayed,
      bestScore: Math.max(stats.bestScore, finalScore),
      worstScore: stats.gamesPlayed === 0 ? finalScore : Math.min(stats.worstScore, finalScore),
      averageScore: Math.round(newTotalScore / newGamesPlayed),
      totalFears: stats.totalFears + fearsEncountered.length,
      fearsEncountered: [...new Set([...stats.fearsEncountered, ...fearsEncountered.map(f => f.id)])]
    };
  }
}
