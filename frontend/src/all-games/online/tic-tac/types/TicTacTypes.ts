export type Player = 'X' | 'O';
export type CellValue = Player | null;
export type Board = CellValue[];

export type GameStatus = 
  | 'waiting'    // Esperando conexión/jugador
  | 'playing'    // Jugando
  | 'finished'; // Juego terminado

export interface GameState {
  board: Board;
  currentPlayer: Player;
  gameStatus: GameStatus;
  winner: Player | 'draw' | null;
  isConnected: boolean;
  roomCode: string;
  playerSymbol: Player | null;
  opponentSymbol: Player | null;
}

export interface GameMessage {
  type: 'move' | 'game_state' | 'game_finished' | 'error';
  data: any;
}

export interface WinCondition {
  winner: Player | 'draw';
  winningCells?: number[];
}
