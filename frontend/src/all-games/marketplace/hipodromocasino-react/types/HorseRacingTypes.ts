export interface Horse {
  id: number;
  name: string;
  emoji: string;
  odds: number;
  speed: number;
  stamina: number;
  luck: number;
  currentPosition: number;
  color: string;
}

export interface RaceResult {
  position: number;
  horse: Horse;
  time: number;
}

export interface HorseRacingState {
  balance: number;
  selectedHorse: number | null;
  selectedAmount: number;
  selectedBetType: BetType;
  isRacing: boolean;
  raceNumber: number;
  stats: GameStats;
  raceHistory: RaceHistoryEntry[];
  horses: Horse[];
  currentRaceResults: RaceResult[] | null;
  winMessage: string;
  showWinAnimation: boolean;
  countdownActive: boolean;
  countdownNumber: number;
}

export interface GameStats {
  totalRaces: number;
  wins: number;
  totalProfit: number;
  biggestWin: number;
  currentStreak: number;
  bestStreak: number;
}

export interface RaceHistoryEntry {
  raceNumber: number;
  selectedHorse: Horse;
  betAmount: number;
  betType: BetType;
  results: RaceResult[];
  won: boolean;
  payout: number;
  profit: number;
}

export interface GameConfig {
  INITIAL_BALANCE: number;
  BET_AMOUNTS: number[];
  HOUSE_EDGE: number;
  RACE_DURATION: number;
  COUNTDOWN_DURATION: number;
  CELEBRATION_DURATION: number;
  MAX_HISTORY: number;
  MIN_BET_WARNING: number;
}

export interface BetPayouts {
  win: number;
  place: number;
  show: number;
}

export type BetType = 'win' | 'place' | 'show';

export interface RaceAnimationState {
  isRunning: boolean;
  currentStep: number;
  totalSteps: number;
  positions: Record<number, number>;
}

export interface CountdownState {
  isActive: boolean;
  currentNumber: number;
  message: string;
}
