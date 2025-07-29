import type { 
  Horse, 
  HorseRacingState, 
  RaceResult, 
  GameConfig, 
  BetType, 
  BetPayouts,
  GameStats,
  RaceHistoryEntry
} from '../types/HorseRacingTypes';

export class HorseRacingLogic {
  public static readonly CONFIG: GameConfig = {
    INITIAL_BALANCE: 1000,
    BET_AMOUNTS: [10, 25, 50, 100, 250, 500],
    HOUSE_EDGE: 0.85, // 85% probabilidad de perder
    RACE_DURATION: 8000,
    COUNTDOWN_DURATION: 3000,
    CELEBRATION_DURATION: 4000,
    MAX_HISTORY: 10,
    MIN_BET_WARNING: 100,
    TRACK_LENGTH: 500, // Longitud visual de la pista para la animación (en píxeles)
  };

  public static readonly BET_PAYOUTS: BetPayouts = {
    win: 5.0,    // 5:1 - Ganar (1er lugar)
    place: 2.5,  // 2.5:1 - Lugar (1er o 2do lugar)
    show: 1.5    // 1.5:1 - Show (1er, 2do o 3er lugar)
  };

  public static readonly HORSES: Horse[] = [
    {
      id: 1,
      name: "Rayo Dorado",
      emoji: "🐎",
      odds: 3.2,
      speed: 85,
      stamina: 90,
      luck: 75,
      currentPosition: 0,
      color: "#FFD700"
    },
    {
      id: 2,
      name: "Trueno Negro",
      emoji: "🏇",
      odds: 4.1,
      speed: 90,
      stamina: 80,
      luck: 70,
      currentPosition: 0,
      color: "#2C3E50"
    },
    {
      id: 3,
      name: "Fuego Rojo",
      emoji: "🐴",
      odds: 5.5,
      speed: 80,
      stamina: 85,
      luck: 85,
      currentPosition: 0,
      color: "#E74C3C"
    },
    {
      id: 4,
      name: "Viento Azul",
      emoji: "🦄",
      odds: 6.8,
      speed: 75,
      stamina: 95,
      luck: 80,
      currentPosition: 0,
      color: "#3498DB"
    }
  ];

  public static createInitialState(): HorseRacingState {
    return {
      balance: this.CONFIG.INITIAL_BALANCE,
      selectedHorse: null,
      selectedAmount: this.CONFIG.BET_AMOUNTS[0],
      selectedBetType: 'win',
      isRacing: false,
      raceNumber: 1,
      stats: this.createInitialStats(),
      raceHistory: [],
      horses: this.HORSES.map(horse => ({ ...horse, currentPosition: 0 })),
      currentRaceResults: null,
      winMessage: '',
      showWinAnimation: false,
      countdownActive: false,
      countdownNumber: 0
    };
  }

  private static createInitialStats(): GameStats {
    return {
      totalRaces: 0,
      wins: 0,
      totalProfit: 0,
      biggestWin: 0,
      currentStreak: 0,
      bestStreak: 0
    };
  }

  public static selectHorse(state: HorseRacingState, horseId: number): HorseRacingState {
    if (state.isRacing) return state;

    return {
      ...state,
      selectedHorse: horseId
    };
  }

  public static changeBetAmount(state: HorseRacingState, amount: number): HorseRacingState {
    if (state.isRacing) return state;

    return {
      ...state,
      selectedAmount: amount
    };
  }

  public static changeBetType(state: HorseRacingState, betType: BetType): HorseRacingState {
    if (state.isRacing) return state;

    return {
      ...state,
      selectedBetType: betType
    };
  }

  public static canStartRace(state: HorseRacingState): boolean {
    return !state.isRacing && 
           state.selectedHorse !== null && 
           state.balance >= state.selectedAmount;
  }

  public static generateRiggedRaceResults(state: HorseRacingState): RaceResult[] {
    if (!state.selectedHorse) {
      return this.generateRandomResults(state.horses);
    }

    // Calcular penalización basada en la apuesta
    const betPenalty = Math.min(state.selectedAmount / 100, 0.9);
    const finalHouseEdge = Math.min(this.CONFIG.HOUSE_EDGE + betPenalty, 0.95);

    const shouldLose = Math.random() < finalHouseEdge;

    if (shouldLose) {
      return this.generateLosingResults(state);
    } else {
      return this.generateWinningResults(state);
    }
  }

  private static generateLosingResults(state: HorseRacingState): RaceResult[] {
    const results = this.shuffleArray([...state.horses]);
    const selectedHorseIndex = results.findIndex(h => h.id === state.selectedHorse);

    if (selectedHorseIndex !== -1) {
      const selectedHorse = results[selectedHorseIndex];
      results.splice(selectedHorseIndex, 1);

      let newPosition: number;
      switch (state.selectedBetType) {
        case 'win':
          newPosition = 1 + Math.floor(Math.random() * 3); // Posición 2-4
          break;
        case 'place':
          newPosition = 2 + Math.floor(Math.random() * 2); // Posición 3-4
          break;
        case 'show':
          newPosition = 3; // Posición 4
          break;
        default:
          newPosition = 3;
      }

      results.splice(newPosition, 0, selectedHorse);
    }

    return this.createRaceResults(results);
  }

  private static generateWinningResults(state: HorseRacingState): RaceResult[] {
    const results = this.shuffleArray([...state.horses]);
    const selectedHorseIndex = results.findIndex(h => h.id === state.selectedHorse);

    if (selectedHorseIndex !== -1) {
      const selectedHorse = results[selectedHorseIndex];
      results.splice(selectedHorseIndex, 1);

      let newPosition: number;
      switch (state.selectedBetType) {
        case 'win':
          newPosition = 0; // 1er lugar
          break;
        case 'place':
          newPosition = Math.random() < 0.5 ? 0 : 1; // 1er o 2do lugar
          break;
        case 'show':
          newPosition = Math.floor(Math.random() * 3); // 1er, 2do o 3er lugar
          break;
        default:
          newPosition = 0;
      }

      results.splice(newPosition, 0, selectedHorse);
    }

    return this.createRaceResults(results);
  }

  private static generateRandomResults(horses: Horse[]): RaceResult[] {
    const shuffled = this.shuffleArray([...horses]);
    return this.createRaceResults(shuffled);
  }

  private static createRaceResults(horses: Horse[]): RaceResult[] {
    return horses.map((horse, index) => ({
      position: index + 1,
      horse: { ...horse },
      time: 45 + Math.random() * 15 // Tiempo entre 45-60 segundos
    }));
  }

  private static shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  public static checkWin(state: HorseRacingState, results: RaceResult[]): boolean {
    if (!state.selectedHorse) return false;

    const selectedHorseResult = results.find(r => r.horse.id === state.selectedHorse);
    if (!selectedHorseResult) return false;

    switch (state.selectedBetType) {
      case 'win':
        return selectedHorseResult.position === 1;
      case 'place':
        return selectedHorseResult.position <= 2;
      case 'show':
        return selectedHorseResult.position <= 3;
      default:
        return false;
    }
  }

  public static calculatePayout(state: HorseRacingState, isWin: boolean): number {
    if (!isWin) return 0;

    const multiplier = this.BET_PAYOUTS[state.selectedBetType];
    return Math.floor(state.selectedAmount * multiplier);
  }

  public static processRaceResult(
    state: HorseRacingState, 
    results: RaceResult[]
  ): HorseRacingState {
    const isWin = this.checkWin(state, results);
    const payout = this.calculatePayout(state, isWin);
    const profit = payout - state.selectedAmount;

    // Actualizar balance
    const newBalance = state.balance + payout;

    // Actualizar estadísticas
    const newStats: GameStats = {
      totalRaces: state.stats.totalRaces + 1,
      wins: state.stats.wins + (isWin ? 1 : 0),
      totalProfit: state.stats.totalProfit + profit,
      biggestWin: Math.max(state.stats.biggestWin, profit),
      currentStreak: isWin ? state.stats.currentStreak + 1 : 0,
      bestStreak: Math.max(
        state.stats.bestStreak, 
        isWin ? state.stats.currentStreak + 1 : state.stats.currentStreak
      )
    };

    // Crear entrada del historial
    const historyEntry: RaceHistoryEntry = {
      raceNumber: state.raceNumber,
      selectedHorse: state.horses.find(h => h.id === state.selectedHorse)!,
      betAmount: state.selectedAmount,
      betType: state.selectedBetType,
      results,
      won: isWin,
      payout,
      profit
    };

    // Actualizar historial
    const newHistory = [historyEntry, ...state.raceHistory];
    if (newHistory.length > this.CONFIG.MAX_HISTORY) {
      newHistory.pop();
    }

    return {
      ...state,
      balance: newBalance,
      stats: newStats,
      raceHistory: newHistory,
      currentRaceResults: results,
      winMessage: this.getWinMessage(isWin, profit, state.selectedBetType),
      showWinAnimation: isWin,
      raceNumber: state.raceNumber + 1,
      selectedHorse: null, // Reset selection
      isRacing: false
    };
  }

  private static getWinMessage(isWin: boolean, profit: number, betType: BetType): string {
    if (!isWin) {
      return 'Sin suerte esta vez. ¡El próximo caballo puede ser el ganador!';
    }

    const betTypeNames = {
      win: 'Ganador',
      place: 'Lugar', 
      show: 'Show'
    };

    if (profit >= 1000) {
      return `¡GRAN VICTORIA ${betTypeNames[betType].toUpperCase()}! Ganaste $${profit}! 🏆`;
    }

    if (profit >= 500) {
      return `¡Excelente ${betTypeNames[betType]}! Ganaste $${profit}! 🎉`;
    }

    return `¡${betTypeNames[betType]} correcto! Ganaste $${profit}! 🎊`;
  }

  public static formatCurrency(amount: number): string {
    return `$${amount.toLocaleString()}`;
  }

  public static getBetTypeDescription(betType: BetType): string {
    switch (betType) {
      case 'win':
        return 'Tu caballo debe quedar 1°';
      case 'place':
        return 'Tu caballo debe quedar 1° o 2°';
      case 'show':
        return 'Tu caballo debe quedar 1°, 2° o 3°';
      default:
        return '';
    }
  }

  public static getWinRate(stats: GameStats): number {
    if (stats.totalRaces === 0) return 0;
    return Math.round((stats.wins / stats.totalRaces) * 100);
  }

  public static isLowBalance(balance: number): boolean {
    return balance < this.CONFIG.MIN_BET_WARNING;
  }

  public static getMaxAffordableBet(balance: number): number {
    const affordableBets = this.CONFIG.BET_AMOUNTS.filter(amount => amount <= balance);
    return affordableBets.length > 0 ? Math.max(...affordableBets) : 0;
  }

  public static resetPositions(horses: Horse[]): Horse[] {
    return horses.map(horse => ({ ...horse, currentPosition: 0 }));
  }
}
