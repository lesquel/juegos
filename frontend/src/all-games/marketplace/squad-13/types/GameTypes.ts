export interface GameState {
  // Core game state
  gameStarted: boolean;
  gameOver: boolean;
  paused: boolean;
  currentScene: string;
  
  // Mission state
  currentMission: number;
  totalMissions: number;
  missionComplete: boolean;
  missionObjectives: string[];
  completedObjectives: number;
  
  // Squad state
  squad: SquadMember[];
  selectedUnit: SquadMember | null;
  
  // Combat state
  inCombat: boolean;
  turnOrder: SquadMember[];
  currentTurn: number;
  actionPoints: number;
  
  // World state
  map: GameMap;
  enemies: Enemy[];
  items: Item[];
  
  // UI state
  dialogues: Dialogue[];
  currentDialogue: Dialogue | null;
  showInventory: boolean;
  showStats: boolean;
  
  // Input state
  keys: { [key: string]: boolean };
  mouse: {
    x: number;
    y: number;
    down: boolean;
  };
  
  // Timing
  deltaTime: number;
  lastTime: number;
}

export interface SquadMember {
  id: string;
  name: string;
  class: string;
  level: number;
  
  // Stats
  health: number;
  maxHealth: number;
  armor: number;
  damage: number;
  accuracy: number;
  
  // Position
  x: number;
  y: number;
  facing: number;
  
  // Equipment
  weapon: Weapon | null;
  equipment: Item[];
  
  // Status
  alive: boolean;
  actionPointsCurrent: number;
  actionPointsMax: number;
  statusEffects: StatusEffect[];
  
  // AI/Behavior
  isPlayerControlled: boolean;
  aiType?: string;
}

export interface Enemy {
  id: string;
  type: string;
  name: string;
  
  // Stats
  health: number;
  maxHealth: number;
  armor: number;
  damage: number;
  accuracy: number;
  
  // Position
  x: number;
  y: number;
  facing: number;
  
  // Behavior
  aiType: string;
  alertLevel: number;
  targetId: string | null;
  
  // Status
  alive: boolean;
  actionPointsCurrent: number;
  actionPointsMax: number;
  statusEffects: StatusEffect[];
}

export interface Weapon {
  id: string;
  name: string;
  type: string;
  damage: number;
  range: number;
  accuracy: number;
  ammo: number;
  maxAmmo: number;
}

export interface Item {
  id: string;
  name: string;
  type: string;
  description: string;
  value: number;
  stackable: boolean;
  quantity: number;
}

export interface StatusEffect {
  id: string;
  name: string;
  type: string;
  duration: number;
  value: number;
}

export interface GameMap {
  width: number;
  height: number;
  tiles: Tile[][];
  spawnPoints: { x: number; y: number; type: string }[];
}

export interface Tile {
  type: string;
  walkable: boolean;
  cover: number;
  height: number;
  sprite: string;
}

export interface Dialogue {
  id: string;
  speaker: string;
  lines: string[];
  choices?: DialogueChoice[];
  skippable: boolean;
}

export interface DialogueChoice {
  text: string;
  action: string;
  nextDialogue?: string;
}

export interface GameProps {
  onGameEnd?: (success: boolean) => void;
  onMissionComplete?: (mission: number) => void;
  width?: number;
  height?: number;
}
