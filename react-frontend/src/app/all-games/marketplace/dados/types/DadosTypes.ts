export interface DiceGameState {
  balance: number;
  gameMode: 'single' | 'double' | 'triple';
  isRolling: boolean;
  selectedAmount: number;
  currentBet: {
    type: string | null;
    amount: number;
    payout: number;
  };
  stats: {
    totalRolls: number;
    wins: number;
    totalProfit: number;
    biggestWin: number;
    history: GameResult[];
  };
}

export interface GameResult {
  result: string;
  win: boolean;
}

export interface BetOption {
  id: string;
  label: string;
  description: string;
  payout: number;
  probability: number;
}

export interface DiceResult {
  value: number;
  face: string;
}

export type GameMode = 'single' | 'double' | 'triple';

export interface BettingOptions {
  single: BetOption[];
  double: BetOption[];
  triple: BetOption[];
}

export interface AnimationState {
  isRolling: boolean;
  showResult: boolean;
  resultMessage: string;
  isWin: boolean;
}
