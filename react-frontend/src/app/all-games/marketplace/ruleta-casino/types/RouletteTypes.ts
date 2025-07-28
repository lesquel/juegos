export interface RouletteGameState {
  balance: number;
  totalBet: number;
  selectedChip: number;
  isSpinning: boolean;
  lastWinningNumber: number | null;
  winnings: number;
  history: number[];
  bets: Map<string, number>;
  winMessage: string;
  showWinAnimation: boolean;
}

export interface BetResult {
  totalWinnings: number;
  winningBets: WinningBet[];
}

export interface WinningBet {
  betId: string;
  betAmount: number;
  payout: number;
  multiplier: number;
}

export interface RouletteNumber {
  number: number;
  color: 'red' | 'black' | 'green';
  sector: number;
}

export interface BetOption {
  id: string;
  name: string;
  payout: number;
  description: string;
  type: 'inside' | 'outside';
}

export interface GameConfig {
  INITIAL_BALANCE: number;
  CHIP_VALUES: number[];
  MAX_HISTORY: number;
  SPIN_DURATION: number;
  RESULT_DISPLAY_DURATION: number;
  CELEBRATION_DURATION: number;
  RIGGED_MODE: boolean;
  HOUSE_EDGE: number;
}

export interface SpinResult {
  winningNumber: number;
  totalWinnings: number;
  winningBets: WinningBet[];
  isWin: boolean;
}

export type BetType = 
  | 'straight' // Número individual
  | 'split' // Dos números adyacentes
  | 'street' // Tres números en línea
  | 'corner' // Cuatro números en esquina
  | 'line' // Seis números en dos líneas
  | 'dozen' // Docenas (1-12, 13-24, 25-36)
  | 'column' // Columnas
  | 'red' // Rojo
  | 'black' // Negro
  | 'even' // Par
  | 'odd' // Impar
  | 'low' // Bajo (1-18)
  | 'high'; // Alto (19-36)
