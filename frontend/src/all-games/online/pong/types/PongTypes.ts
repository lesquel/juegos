export interface Vector2D {
  x: number;
  y: number;
}

export interface Paddle {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
}

export interface Ball {
  x: number;
  y: number;
  radius: number;
  velocity: Vector2D;
  speed: number;
}

export interface GameScore {
  player1: number;
  player2: number;
}

export type GameStatus = 
  | 'waiting'    // Esperando conexión/jugador
  | 'playing'    // Jugando
  | 'paused'     // Pausado
  | 'finished'; // Juego terminado

export interface GameState {
  ball: Ball;
  paddle1: Paddle;
  paddle2: Paddle;
  score: GameScore;
  gameStatus: GameStatus;
  winner: 'player1' | 'player2' | null;
  isConnected: boolean;
  roomCode: string;
  playerNumber: 1 | 2 | null;
  canvasWidth: number;
  canvasHeight: number;
}

export interface GameMessage {
  type: 'move' | 'game_state' | 'game_finished' | 'paddle_move' | 'error';
  data: any;
}

export interface Connection {
  ws: WebSocket | null;
  roomCode: string | null;
  playerNumber: number | null;
  connected: boolean;
}

export interface PaddleMove {
  player: 1 | 2;
  direction: 'up' | 'down' | 'stop';
}
