import type {
  RouletteGameState,
  BetResult,
  WinningBet,
  RouletteNumber,
  BetOption,
  GameConfig,
  SpinResult
} from '../types/RouletteTypes';

export class RouletteGameLogic {
  public static readonly CONFIG: GameConfig = {
    INITIAL_BALANCE: 1000,
    CHIP_VALUES: [1, 5, 25, 100, 500],
    MAX_HISTORY: 10,
    SPIN_DURATION: 4000,
    RESULT_DISPLAY_DURATION: 3000,
    CELEBRATION_DURATION: 4000,
    RIGGED_MODE: true,
    HOUSE_EDGE: 0.05 // 5% probabilidad de perder (mucho más favorable al jugador)
  };

  public static readonly NUMBERS: RouletteNumber[] = [
    { number: 0, color: 'green', sector: 0 },
    { number: 32, color: 'red', sector: 1 },
    { number: 15, color: 'black', sector: 2 },
    { number: 19, color: 'red', sector: 3 },
    { number: 4, color: 'black', sector: 4 },
    { number: 21, color: 'red', sector: 5 },
    { number: 2, color: 'black', sector: 6 },
    { number: 25, color: 'red', sector: 7 },
    { number: 17, color: 'black', sector: 8 },
    { number: 34, color: 'red', sector: 9 },
    { number: 6, color: 'black', sector: 10 },
    { number: 27, color: 'red', sector: 11 },
    { number: 13, color: 'black', sector: 12 },
    { number: 36, color: 'red', sector: 13 },
    { number: 11, color: 'black', sector: 14 },
    { number: 30, color: 'red', sector: 15 },
    { number: 8, color: 'black', sector: 16 },
    { number: 23, color: 'red', sector: 17 },
    { number: 10, color: 'black', sector: 18 },
    { number: 5, color: 'red', sector: 19 },
    { number: 24, color: 'black', sector: 20 },
    { number: 16, color: 'red', sector: 21 },
    { number: 33, color: 'black', sector: 22 },
    { number: 1, color: 'red', sector: 23 },
    { number: 20, color: 'black', sector: 24 },
    { number: 14, color: 'red', sector: 25 },
    { number: 31, color: 'black', sector: 26 },
    { number: 9, color: 'red', sector: 27 },
    { number: 22, color: 'black', sector: 28 },
    { number: 18, color: 'red', sector: 29 },
    { number: 29, color: 'black', sector: 30 },
    { number: 7, color: 'red', sector: 31 },
    { number: 28, color: 'black', sector: 32 },
    { number: 12, color: 'red', sector: 33 },
    { number: 35, color: 'black', sector: 34 },
    { number: 3, color: 'red', sector: 35 },
    { number: 26, color: 'black', sector: 36 }
  ];

  public static readonly BET_OPTIONS: BetOption[] = [
    // Apuestas internas
    { id: 'straight', name: 'Pleno', payout: 35, description: 'Un número', type: 'inside' },

    // Apuestas externas
    { id: 'red', name: 'Rojo', payout: 1, description: 'Números rojos', type: 'outside' },
    { id: 'black', name: 'Negro', payout: 1, description: 'Números negros', type: 'outside' },
    { id: 'even', name: 'Par', payout: 1, description: 'Números pares', type: 'outside' },
    { id: 'odd', name: 'Impar', payout: 1, description: 'Números impares', type: 'outside' },
    { id: 'low', name: '1-18', payout: 1, description: 'Números bajos', type: 'outside' },
    { id: 'high', name: '19-36', payout: 1, description: 'Números altos', type: 'outside' },
    { id: 'dozen1', name: '1er 12', payout: 2, description: 'Primera docena (1-12)', type: 'outside' },
    { id: 'dozen2', name: '2do 12', payout: 2, description: 'Segunda docena (13-24)', type: 'outside' },
    { id: 'dozen3', name: '3er 12', payout: 2, description: 'Tercera docena (25-36)', type: 'outside' },
    { id: 'column1', name: 'Col 1', payout: 2, description: 'Primera columna', type: 'outside' },
    { id: 'column2', name: 'Col 2', payout: 2, description: 'Segunda columna', type: 'outside' },
    { id: 'column3', name: 'Col 3', payout: 2, description: 'Tercera columna', type: 'outside' }
  ];

  public static createInitialState(): RouletteGameState {
    return {
      balance: this.CONFIG.INITIAL_BALANCE,
      totalBet: 0,
      selectedChip: this.CONFIG.CHIP_VALUES[0],
      isSpinning: false,
      lastWinningNumber: null,
      winnings: 0,
      history: [],
      bets: new Map(),
      winMessage: '',
      showWinAnimation: false
    };
  }

  public static placeBet(state: RouletteGameState, betId: string, amount: number): RouletteGameState {
    if (state.balance < amount || state.isSpinning) {
      return state;
    }

    const newBets = new Map(state.bets);
    const currentBet = newBets.get(betId) || 0;
    newBets.set(betId, currentBet + amount);

    return {
      ...state,
      bets: newBets,
      totalBet: state.totalBet + amount,
      balance: state.balance - amount
    };
  }

  public static clearBets(state: RouletteGameState): RouletteGameState {
    const refund = state.totalBet;
    return {
      ...state,
      bets: new Map(),
      totalBet: 0,
      balance: state.balance + refund
    };
  }

  public static changeChip(state: RouletteGameState, chipValue: number): RouletteGameState {
    return {
      ...state,
      selectedChip: chipValue
    };
  }

  public static getNumberColor(number: number): 'red' | 'black' | 'green' {
    if (number === 0) return 'green';

    const redNumbers = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
    return redNumbers.includes(number) ? 'red' : 'black';
  }

  public static isBetWinning(betId: string, winningNumber: number): boolean {
    // Número directo
    if (!isNaN(parseInt(betId))) {
      return parseInt(betId) === winningNumber;
    }

    // Apuestas externas
    switch (betId) {
      case 'red':
        return this.getNumberColor(winningNumber) === 'red';
      case 'black':
        return this.getNumberColor(winningNumber) === 'black';
      case 'even':
        return winningNumber !== 0 && winningNumber % 2 === 0;
      case 'odd':
        return winningNumber !== 0 && winningNumber % 2 === 1;
      case 'low':
        return winningNumber >= 1 && winningNumber <= 18;
      case 'high':
        return winningNumber >= 19 && winningNumber <= 36;
      case 'dozen1':
        return winningNumber >= 1 && winningNumber <= 12;
      case 'dozen2':
        return winningNumber >= 13 && winningNumber <= 24;
      case 'dozen3':
        return winningNumber >= 25 && winningNumber <= 36;
      case 'column1':
        return winningNumber !== 0 && (winningNumber - 1) % 3 === 0;
      case 'column2':
        return winningNumber !== 0 && (winningNumber - 2) % 3 === 0;
      case 'column3':
        return winningNumber !== 0 && (winningNumber - 3) % 3 === 0;
      default:
        return false;
    }
  }

  public static getBetPayout(betId: string): number {
    if (!isNaN(parseInt(betId))) {
      return 35; // Número directo
    }

    const betOption = this.BET_OPTIONS.find(option => option.id === betId);
    return betOption?.payout || 0;
  }

  public static calculateWinnings(state: RouletteGameState, winningNumber: number): BetResult {
    const winningBets: WinningBet[] = [];
    let totalWinnings = 0;

    state.bets.forEach((betAmount, betId) => {
      if (this.isBetWinning(betId, winningNumber)) {
        const payout = this.getBetPayout(betId);
        const multiplier = payout + 1; // Incluye la apuesta original
        const winAmount = betAmount * multiplier;

        winningBets.push({
          betId,
          betAmount,
          payout: winAmount,
          multiplier
        });

        totalWinnings += winAmount;
      }
    });

    return { totalWinnings, winningBets };
  }

  public static generateRiggedNumber(state: RouletteGameState): number {
    if (state.bets.size === 0 || !this.CONFIG.RIGGED_MODE) {
      return this.generateRandomNumber();
    }

    const shouldTriggerHouseEdge = Math.random() < this.CONFIG.HOUSE_EDGE;

    if (shouldTriggerHouseEdge) {
      const losingNumbers = this.findLosingNumbers(state);

      if (losingNumbers.length > 0) {
        return this.selectLosingNumber(losingNumbers);
      }

      return this.findLeastProfitableNumber(state);
    }

    // 85% del tiempo, buscar números que hagan ganar al jugador
    return this.findWinningNumber(state);
  }

  private static findLosingNumbers(state: RouletteGameState): number[] {
    const losingNumbers: number[] = [];

    for (let num = 0; num <= 36; num++) {
      const isLosingNumber = this.isNumberLosing(state, num);

      if (isLosingNumber) {
        losingNumbers.push(num);
      }
    }

    return losingNumbers;
  }

  private static isNumberLosing(state: RouletteGameState, number: number): boolean {
    let isLosing = true;

    state.bets.forEach((amount, betId) => {
      if (this.isBetWinning(betId, number)) {
        isLosing = false;
      }
    });

    return isLosing;
  }

  private static selectLosingNumber(losingNumbers: number[]): number {
    // Favor al 0 si está disponible
    if (losingNumbers.includes(0)) {
      return Math.random() < 0.3 ? 0 : losingNumbers[Math.floor(Math.random() * losingNumbers.length)];
    }

    return losingNumbers[Math.floor(Math.random() * losingNumbers.length)];
  }

  private static findLeastProfitableNumber(state: RouletteGameState): number {
    let minPayout = Infinity;
    let leastProfitableNumber = 0;

    for (let num = 0; num <= 36; num++) {
      const { totalWinnings } = this.calculateWinnings(state, num);
      if (totalWinnings < minPayout) {
        minPayout = totalWinnings;
        leastProfitableNumber = num;
      }
    }

    return leastProfitableNumber;
  }

  public static generateRandomNumber(): number {
    const numbers = this.NUMBERS.map(n => n.number);
    return numbers[Math.floor(Math.random() * numbers.length)];
  }

  public static processSpinResult(state: RouletteGameState, winningNumber: number): SpinResult {
    const { totalWinnings, winningBets } = this.calculateWinnings(state, winningNumber);

    return {
      winningNumber,
      totalWinnings,
      winningBets,
      isWin: totalWinnings > 0
    };
  }

  public static updateStateAfterSpin(state: RouletteGameState, result: SpinResult): RouletteGameState {
    const newHistory = [...state.history, result.winningNumber];
    if (newHistory.length > this.CONFIG.MAX_HISTORY) {
      newHistory.shift();
    }

    return {
      ...state,
      balance: state.balance + result.totalWinnings,
      lastWinningNumber: result.winningNumber,
      winnings: result.totalWinnings,
      history: newHistory,
      bets: new Map(),
      totalBet: 0,
      isSpinning: false,
      winMessage: this.getWinMessage(result),
      showWinAnimation: result.isWin
    };
  }

  private static getWinMessage(result: SpinResult): string {
    if (!result.isWin) {
      return 'Sin suerte esta vez. ¡Sigue intentando!';
    }

    if (result.totalWinnings >= 500) {
      return `¡GRAN VICTORIA! Ganaste $${result.totalWinnings}! 🎉`;
    }

    return `¡Ganaste $${result.totalWinnings}! 🎊`;
  }

  public static formatCurrency(amount: number): string {
    return `$${amount.toLocaleString()}`;
  }

  public static canAffordBet(balance: number, amount: number): boolean {
    return balance >= amount;
  }

  public static getChipColor(value: number): string {
    const colorMap: Record<number, string> = {
      1: 'linear-gradient(135deg, #ffffff, #f8f9fa)',
      5: 'linear-gradient(135deg, #e74c3c, #c0392b)',
      25: 'linear-gradient(135deg, #2ecc71, #27ae60)',
      100: 'linear-gradient(135deg, #000, #2c3e50)',
      500: 'linear-gradient(135deg, #9b59b6, #8e44ad)'
    };
    return colorMap[value] || colorMap[1];
  }

  public static getNumberBackground(color: 'red' | 'black' | 'green'): string {
    switch (color) {
      case 'red':
        return 'linear-gradient(135deg, #e74c3c, #c0392b)';
      case 'black':
        return 'linear-gradient(135deg, #2c3e50, #000)';
      case 'green':
        return 'linear-gradient(135deg, #2ecc71, #27ae60)';
      default:
        return 'linear-gradient(135deg, #95a5a6, #7f8c8d)';
    }
  }
}
