export interface SlotGameState {
  credits: number;
  currentBet: number;
  jackpot: number;
  isSpinning: boolean;
  currentResults: string[];
  totalSpins: number;
  totalWins: number;
  winMessage: string;
  showWinAnimation: boolean;
}

export interface SymbolData {
  symbol: string;
  weight: number;
}

export interface WinCombination {
  multiplier: number | 'JACKPOT';
  name: string;
}

export interface GameConfig {
  INITIAL_CREDITS: number;
  BET_OPTIONS: number[];
  JACKPOT_INITIAL: number;
  JACKPOT_INCREMENT: number;
  MIN_CREDITS_WARNING: number;
  SPIN_DURATION: number;
  CELEBRATION_DURATION: number;
}

export interface ReelState {
  symbols: string[];
  position: number;
  isSpinning: boolean;
  finalSymbol?: string;
}

export type SpinResult = {
  symbols: string[];
  win: boolean;
  combination?: string;
  multiplier?: number;
  amount?: number;
  isJackpot?: boolean;
};
