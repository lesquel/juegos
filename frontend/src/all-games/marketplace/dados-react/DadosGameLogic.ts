import type { DiceGameState, DiceResult, GameMode, BettingOptions } from './types/DadosTypes';

export class DadosGameLogic {
  private gameState: DiceGameState;
  private houseEdge: number = 0.92; // 92% probabilidad de que gane la casa
  private onStateUpdate: ((state: DiceGameState) => void) | null = null;

  constructor() {
    this.gameState = {
      balance: 1000,
      gameMode: 'single',
      isRolling: false,
      selectedAmount: 1,
      currentBet: { type: null, amount: 1, payout: 0 },
      stats: {
        totalRolls: 0,
        wins: 0,
        totalProfit: 0,
        biggestWin: 0,
        history: []
      }
    };
  }

  public onStateChange(callback: (state: DiceGameState) => void) {
    this.onStateUpdate = callback;
    this.updateState();
  }

  private updateState() {
    if (this.onStateUpdate) {
      this.onStateUpdate({ ...this.gameState });
    }
  }

  public getGameState(): DiceGameState {
    return { ...this.gameState };
  }

  public setGameMode(mode: GameMode) {
    this.gameState.gameMode = mode;
    this.gameState.currentBet = { type: null, amount: this.gameState.selectedAmount, payout: 0 };
    this.updateState();
  }

  public setSelectedAmount(amount: number) {
    this.gameState.selectedAmount = amount;
    if (this.gameState.currentBet.type) {
      this.gameState.currentBet.amount = amount;
    }
    this.updateState();
  }

  public placeBet(betType: string, payout: number) {
    if (this.gameState.balance < this.gameState.selectedAmount || this.gameState.isRolling) {
      return false;
    }

    this.gameState.currentBet = {
      type: betType,
      amount: this.gameState.selectedAmount,
      payout: payout
    };
    this.updateState();
    return true;
  }

  public async rollDice(): Promise<DiceResult[]> {
    if (!this.gameState.currentBet.type || this.gameState.isRolling || 
        this.gameState.balance < this.gameState.currentBet.amount) {
      return [];
    }

    this.gameState.isRolling = true;
    this.gameState.balance -= this.gameState.currentBet.amount;
    this.updateState();

    // Simular tiempo de animación
    await new Promise(resolve => setTimeout(resolve, 2000));

    const results = this.generateRiggedResults(this.gameState.gameMode, this.gameState.currentBet.type, this.gameState.currentBet.amount);
    
    const diceResults: DiceResult[] = results.map(value => ({
      value,
      face: this.getDiceFace(value)
    }));

    const isWin = this.checkWin(results, this.gameState.currentBet.type);
    this.processResult(isWin, results);

    this.gameState.isRolling = false;
    this.updateState();

    return diceResults;
  }

  private getDiceCount(): number {
    switch (this.gameState.gameMode) {
      case 'single': return 1;
      case 'double': return 2;
      case 'triple': return 3;
      default: return 1;
    }
  }

  private generateRiggedResults(gameMode: GameMode, betType: string, betAmount: number): number[] {
    const diceCount = this.getDiceCount();
    const betPenalty = Math.min(betAmount / 100, 0.95);
    const finalWinProbability = Math.max(0.05, (1 - this.houseEdge) - betPenalty);

    if (Math.random() > finalWinProbability) {
      // Forzar resultado perdedor
      return this.generateLosingResults(gameMode, betType, diceCount);
    } else {
      // Generar resultado ganador
      return this.generateWinningResults(gameMode, betType, diceCount);
    }
  }

  private generateLosingResults(gameMode: GameMode, betType: string, diceCount: number): number[] {
    const results: number[] = [];
    
    for (let i = 0; i < diceCount; i++) {
      let value: number;
      do {
        value = Math.floor(Math.random() * 6) + 1;
      } while (this.wouldWin([...results, value], betType));
      results.push(value);
    }
    
    return results;
  }

  private generateWinningResults(gameMode: GameMode, betType: string, diceCount: number): number[] {
    const results: number[] = [];
    
    switch (betType) {
      case 'par':
        results.push(Math.random() < 0.5 ? 2 : 4);
        break;
      case 'impar':
        results.push(Math.random() < 0.5 ? 1 : 3);
        break;
      case 'bajo':
        results.push(Math.floor(Math.random() * 3) + 1); // 1-3
        break;
      case 'alto':
        results.push(Math.floor(Math.random() * 3) + 4); // 4-6
        break;
      case 'exacto':
        {
          const targetNumber = parseInt(betType.split('-')[1]);
          results.push(targetNumber);
          break;
        }
      default:
        results.push(Math.floor(Math.random() * 6) + 1);
    }

    // Completar el resto de dados para modos multiple
    while (results.length < diceCount) {
      results.push(Math.floor(Math.random() * 6) + 1);
    }

    return results;
  }

  private wouldWin(results: number[], betType: string): boolean {
    return this.checkWin(results, betType);
  }

  private checkWin(results: number[], betType: string): boolean {
    const firstDie = results[0];
    
    switch (betType) {
      case 'par':
        return firstDie % 2 === 0;
      case 'impar':
        return firstDie % 2 === 1;
      case 'bajo':
        return firstDie >= 1 && firstDie <= 3;
      case 'alto':
        return firstDie >= 4 && firstDie <= 6;
      case 'suma-7':
        return results.length >= 2 && results.reduce((a, b) => a + b, 0) === 7;
      case 'suma-14':
        return results.length >= 2 && results.reduce((a, b) => a + b, 0) === 14;
      case 'dobles':
        return results.length >= 2 && results[0] === results[1];
      case 'triples':
        return results.length >= 3 && results[0] === results[1] && results[1] === results[2];
      default:
        if (betType.startsWith('exacto-')) {
          const targetNumber = parseInt(betType.split('-')[1]);
          return firstDie === targetNumber;
        }
        return false;
    }
  }

  private processResult(isWin: boolean, results: number[]) {
    this.gameState.stats.totalRolls++;

    if (isWin) {
      const winAmount = this.gameState.currentBet.amount * this.gameState.currentBet.payout;
      this.gameState.balance += this.gameState.currentBet.amount + winAmount;
      this.gameState.stats.wins++;
      this.gameState.stats.totalProfit += winAmount;

      if (winAmount > this.gameState.stats.biggestWin) {
        this.gameState.stats.biggestWin = winAmount;
      }

      this.gameState.stats.history.unshift({
        result: results.join('-'),
        win: true
      });
    } else {
      this.gameState.stats.totalProfit -= this.gameState.currentBet.amount;
      this.gameState.stats.history.unshift({
        result: results.join('-'),
        win: false
      });
    }

    // Mantener solo los últimos 20 resultados
    if (this.gameState.stats.history.length > 20) {
      this.gameState.stats.history.pop();
    }
  }

  private getDiceFace(value: number): string {
    const faces = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
    return faces[value - 1] || '?';
  }

  public getBettingOptions(): BettingOptions {
    return {
      single: [
        { id: 'par', label: 'Par', description: 'Números pares (2,4,6)', payout: 1, probability: 50 },
        { id: 'impar', label: 'Impar', description: 'Números impares (1,3,5)', payout: 1, probability: 50 },
        { id: 'bajo', label: 'Bajo', description: 'Números bajos (1-3)', payout: 1, probability: 50 },
        { id: 'alto', label: 'Alto', description: 'Números altos (4-6)', payout: 1, probability: 50 },
        { id: 'exacto-1', label: '1', description: 'Exactamente 1', payout: 5, probability: 16.67 },
        { id: 'exacto-2', label: '2', description: 'Exactamente 2', payout: 5, probability: 16.67 },
        { id: 'exacto-3', label: '3', description: 'Exactamente 3', payout: 5, probability: 16.67 },
        { id: 'exacto-4', label: '4', description: 'Exactamente 4', payout: 5, probability: 16.67 },
        { id: 'exacto-5', label: '5', description: 'Exactamente 5', payout: 5, probability: 16.67 },
        { id: 'exacto-6', label: '6', description: 'Exactamente 6', payout: 5, probability: 16.67 }
      ],
      double: [
        { id: 'suma-7', label: 'Suma = 7', description: 'Suma de ambos dados = 7', payout: 4, probability: 16.67 },
        { id: 'suma-14', label: 'Suma = 14', description: 'Suma de ambos dados = 14', payout: 35, probability: 2.78 },
        { id: 'dobles', label: 'Dobles', description: 'Ambos dados iguales', payout: 5, probability: 16.67 },
        { id: 'par', label: 'Primer Par', description: 'Primer dado par', payout: 1, probability: 50 },
        { id: 'impar', label: 'Primer Impar', description: 'Primer dado impar', payout: 1, probability: 50 }
      ],
      triple: [
        { id: 'triples', label: 'Triples', description: 'Los tres dados iguales', payout: 30, probability: 2.78 },
        { id: 'par', label: 'Primer Par', description: 'Primer dado par', payout: 1, probability: 50 },
        { id: 'impar', label: 'Primer Impar', description: 'Primer dado impar', payout: 1, probability: 50 },
        { id: 'bajo', label: 'Primer Bajo', description: 'Primer dado bajo (1-3)', payout: 1, probability: 50 },
        { id: 'alto', label: 'Primer Alto', description: 'Primer dado alto (4-6)', payout: 1, probability: 50 }
      ]
    };
  }

  public resetGame() {
    this.gameState = {
      balance: 1000,
      gameMode: 'single',
      isRolling: false,
      selectedAmount: 1,
      currentBet: { type: null, amount: 1, payout: 0 },
      stats: {
        totalRolls: 0,
        wins: 0,
        totalProfit: 0,
        biggestWin: 0,
        history: []
      }
    };
    this.updateState();
  }
}
