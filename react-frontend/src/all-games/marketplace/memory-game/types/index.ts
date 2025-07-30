export type Card = {
  id: number;
  value: string;
  isFlipped: boolean;
  isMatched: boolean;
};

export type GameStatus = 'playing' | 'gameOver';
