export type Player = 'X' | 'O';
export type CellValue = Player | null;
export type Board = CellValue[];

export type GameStatus =
  | 'waiting'    // Esperando conexión/jugador
  | 'playing'    // Jugando
  | 'finished'   // Juego terminado
  | 'error';     // Error en el juego

export interface GameState {
  board: Board;
  currentPlayer: Player;
  gameStatus: GameStatus;
  winner: Player | 'draw' | null;
  winningPositions: number[];
  playerSymbol: Player | null;
  isConnected: boolean;
  roomCode: string | null;
  player_id: string;
  opponentName: string | null;
  isPlayerTurn: boolean;
  lastMove: {
    player: Player;
    position: number;
    timestamp: number;
  } | null;
  gameId: string | null;
  spectators: number;
}

export interface GameConfig {
  isOnline: boolean;
  wsUrl: string;
  authToken: string;
  player_id: string;
  roomCode?: string;
}

export interface WebSocketMessage {
  type: string;
  data: any;
}

export interface GameWebSocketMessage {
  type: string;
  data?: {
    match_id?: string;
    game_type?: string;
    move?: {
      row: number;
      column: number;
    };
    player_id?: string;
  };
  match_id?: string;
  game_type?: string;
  move?: {
    row: number;
    column: number;
  };
}

export interface UserInfo {
  access_token: {
    access_token: string;
    token_type: string;
  };
  user: {
    user_id: string;
    email: string;
    role: string;
  };
}

export interface GameMessage {
  type: string;
  data: any;
  game_state?: any;
  players?: any;
  move?: any;
  result?: any;
  player_symbol?: string;
  winner?: string;
  is_tie?: boolean;
  final_scores?: any[];
}

export interface WinCondition {
  winner: Player | 'draw';
  winningCells?: number[];
}
