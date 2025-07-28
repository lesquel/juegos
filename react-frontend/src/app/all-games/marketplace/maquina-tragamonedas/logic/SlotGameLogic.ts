import type { SlotGameState, SymbolData, SpinResult, GameConfig, WinCombination } from '../types/SlotTypes';

export class SlotGameLogic {
  private static readonly SYMBOLS: SymbolData[] = [
    { symbol: '🍒', weight: 15 },
    { symbol: '🍋', weight: 15 },
    { symbol: '🍊', weight: 15 },
    { symbol: '🍇', weight: 15 },
    { symbol: '🔔', weight: 10 },
    { symbol: '⭐', weight: 8 },
    { symbol: '💎', weight: 5 },
    { symbol: '👑', weight: 3 },
    { symbol: '🎰', weight: 2 },
    { symbol: '💰', weight: 1 }
  ];

  private static readonly PAYOUT_TABLE: Record<string, WinCombination> = {
    '🍒🍒🍒': { multiplier: 2, name: 'Cerezas' },
    '🍋🍋🍋': { multiplier: 3, name: 'Limones' },
    '🍊🍊🍊': { multiplier: 4, name: 'Naranjas' },
    '🍇🍇🍇': { multiplier: 5, name: 'Uvas' },
    '🔔🔔🔔': { multiplier: 10, name: 'Campanas' },
    '⭐⭐⭐': { multiplier: 15, name: 'Estrellas' },
    '💎💎💎': { multiplier: 25, name: 'Diamantes' },
    '👑👑👑': { multiplier: 50, name: 'Coronas' },
    '🎰🎰🎰': { multiplier: 100, name: 'Triple Casino' },
    '💰💰💰': { multiplier: 'JACKPOT', name: '¡JACKPOT!' }
  };

  public static readonly CONFIG: GameConfig = {
    INITIAL_CREDITS: 1000,
    BET_OPTIONS: [1, 10, 25, 50],
    JACKPOT_INITIAL: 10000,
    JACKPOT_INCREMENT: 2,
    MIN_CREDITS_WARNING: 100,
    SPIN_DURATION: 2000,
    CELEBRATION_DURATION: 3000
  };

  public static createInitialState(): SlotGameState {
    return {
      credits: this.CONFIG.INITIAL_CREDITS,
      currentBet: this.CONFIG.BET_OPTIONS[0],
      jackpot: this.CONFIG.JACKPOT_INITIAL,
      isSpinning: false,
      currentResults: ['🎰', '🎰', '🎰'],
      totalSpins: 0,
      totalWins: 0,
      winMessage: '',
      showWinAnimation: false
    };
  }

  public static getRandomSymbol(): string {
    const totalWeight = this.SYMBOLS.reduce((sum, symbol) => sum + symbol.weight, 0);
    let random = Math.random() * totalWeight;
    
    for (const symbolData of this.SYMBOLS) {
      random -= symbolData.weight;
      if (random <= 0) {
        return symbolData.symbol;
      }
    }
    
    return this.SYMBOLS[0].symbol;
  }

  public static generateSpin(): string[] {
    return [
      this.getRandomSymbol(),
      this.getRandomSymbol(),
      this.getRandomSymbol()
    ];
  }

  public static checkWin(symbols: string[]): SpinResult {
    const combinationKey = symbols.join('');
    const combination = this.PAYOUT_TABLE[combinationKey];
    
    if (!combination) {
      return {
        symbols,
        win: false
      };
    }

    const isJackpot = combination.multiplier === 'JACKPOT';
    
    return {
      symbols,
      win: true,
      combination: combination.name,
      multiplier: isJackpot ? 0 : combination.multiplier as number,
      isJackpot
    };
  }

  public static calculateWinAmount(result: SpinResult, bet: number, jackpot: number): number {
    if (!result.win) return 0;
    
    if (result.isJackpot) {
      return jackpot;
    }
    
    return bet * (result.multiplier || 0);
  }

  public static canAffordBet(credits: number, bet: number): boolean {
    return credits >= bet;
  }

  public static changeBet(currentBet: number, direction: 'up' | 'down'): number {
    const currentIndex = this.CONFIG.BET_OPTIONS.indexOf(currentBet);
    
    if (direction === 'up') {
      const nextIndex = Math.min(currentIndex + 1, this.CONFIG.BET_OPTIONS.length - 1);
      return this.CONFIG.BET_OPTIONS[nextIndex];
    } else {
      const prevIndex = Math.max(currentIndex - 1, 0);
      return this.CONFIG.BET_OPTIONS[prevIndex];
    }
  }

  public static formatCredits(credits: number): string {
    return credits.toLocaleString();
  }

  public static getWinMessage(result: SpinResult, amount: number): string {
    if (!result.win) return '';
    
    if (result.isJackpot) {
      return `¡¡¡JACKPOT!!! ${result.combination} - $${amount.toLocaleString()}`;
    }
    
    return `${result.combination} - $${amount.toLocaleString()}`;
  }

  public static isLowCredits(credits: number): boolean {
    return credits < this.CONFIG.MIN_CREDITS_WARNING;
  }

  public static getMaxBetForCredits(credits: number): number {
    const affordableBets = this.CONFIG.BET_OPTIONS.filter(bet => bet <= credits);
    return affordableBets.length > 0 ? Math.max(...affordableBets) : 0;
  }
}
