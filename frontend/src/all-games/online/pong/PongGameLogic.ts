import type { GameState, GameMessage, PaddleMove } from './types/PongTypes';
import { environment } from '@config/environment';

export class PongGameLogic {
  private ws: WebSocket | null = null;
  private gameState: GameState;
  public onStateUpdate: ((state: GameState) => void) | null = null;
  private keysPressed: Set<string> = new Set();

  constructor() {
    this.gameState = {
      ball: {
        x: 400,
        y: 200,
        radius: 10,
        velocity: { x: 0, y: 0 },
        speed: 5
      },
      paddle1: {
        x: 20,
        y: 150,
        width: 20,
        height: 100,
        speed: 8
      },
      paddle2: {
        x: 760,
        y: 150,
        width: 20,
        height: 100,
        speed: 8
      },
      score: { player1: 0, player2: 0 },
      gameStatus: 'waiting',
      winner: null,
      isConnected: false,
      roomCode: '',
      playerNumber: null,
      canvasWidth: 800,
      canvasHeight: 400
    };
  }

  initialize(onStateUpdate: (state: GameState) => void) {
    this.onStateUpdate = onStateUpdate;
    this.connectWebSocket();
    this.setupKeyboardListeners();
  }

  private connectWebSocket() {
    try {
      const wsUrl = environment.API_URL.replace('http', 'ws') + '/ws/pong';
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        console.log('Conectado al servidor Pong');
        this.updateGameState({ isConnected: true });
      };

      this.ws.onmessage = (event) => {
        try {
          const message: GameMessage = JSON.parse(event.data);
          this.handleMessage(message);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      this.ws.onclose = () => {
        console.log('Desconectado del servidor');
        this.updateGameState({ isConnected: false });
      };

      this.ws.onerror = (error) => {
        console.error('Error WebSocket:', error);
        this.updateGameState({ isConnected: false });
      };

    } catch (error) {
      console.error('Error connecting to WebSocket:', error);
    }
  }

  private handleMessage(message: GameMessage) {
    switch (message.type) {
      case 'game_state':
        this.updateGameState({
          ball: message.data.ball,
          paddle1: message.data.paddle1,
          paddle2: message.data.paddle2,
          score: message.data.score,
          gameStatus: message.data.gameStatus,
          roomCode: message.data.roomCode,
          playerNumber: message.data.playerNumber
        });
        break;

      case 'game_finished':
        this.updateGameState({
          gameStatus: 'finished',
          winner: message.data.winner,
          score: message.data.score
        });
        break;

      case 'error':
        console.error('Game error:', message.data);
        break;
    }
  }

  private setupKeyboardListeners() {
    document.addEventListener('keydown', (event) => {
      this.keysPressed.add(event.key);
      this.handlePaddleMovement();
    });

    document.addEventListener('keyup', (event) => {
      this.keysPressed.delete(event.key);
      this.handlePaddleMovement();
    });
  }

  private handlePaddleMovement() {
    if (!this.gameState.playerNumber) return;

    let direction: 'up' | 'down' | 'stop' = 'stop';

    if (this.keysPressed.has('ArrowUp') || this.keysPressed.has('w') || this.keysPressed.has('W')) {
      direction = 'up';
    } else if (this.keysPressed.has('ArrowDown') || this.keysPressed.has('s') || this.keysPressed.has('S')) {
      direction = 'down';
    }

    this.sendPaddleMove(direction);
  }

  private sendPaddleMove(direction: 'up' | 'down' | 'stop') {
    if (this.ws && this.ws.readyState === WebSocket.OPEN && this.gameState.playerNumber) {
      const paddleMove: PaddleMove = {
        player: this.gameState.playerNumber,
        direction
      };

      const message = {
        type: 'paddle_move',
        data: paddleMove
      };

      this.ws.send(JSON.stringify(message));
    }
  }

  playAgain() {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      const message = {
        type: 'play_again',
        data: {}
      };
      this.ws.send(JSON.stringify(message));
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    // Remove keyboard listeners
    document.removeEventListener('keydown', this.handlePaddleMovement);
    document.removeEventListener('keyup', this.handlePaddleMovement);
  }

  private updateGameState(updates: Partial<GameState>) {
    this.gameState = { ...this.gameState, ...updates };
    if (this.onStateUpdate) {
      this.onStateUpdate(this.gameState);
    }
  }

  getGameState(): GameState {
    return this.gameState;
  }

  createGame() {
    this.connectWebSocket();
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      const message = {
        type: 'create_game',
        data: {}
      };
      this.ws.send(JSON.stringify(message));
    }
  }

  joinGame(roomCode: string) {
    this.connectWebSocket();
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      const message = {
        type: 'join_game',
        data: { roomCode }
      };
      this.ws.send(JSON.stringify(message));
    }
  }
}
