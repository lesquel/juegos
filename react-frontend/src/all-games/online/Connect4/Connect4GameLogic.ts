import type { GameState, GameMessage } from './types/Connect4Types';
import { environment } from '@config/environment';

export class Connect4GameLogic {
  private ws: WebSocket | null = null;
  private gameState: GameState;
  private onStateChange: ((state: GameState) => void) | null = null;

  constructor() {
    this.gameState = {
      board: Array(6).fill(null).map(() => Array(7).fill(null)),
      currentPlayer: 'red',
      gameStatus: 'waiting',
      winner: null,
      isConnected: false,
      roomCode: '',
      playerColor: null,
      opponentColor: null,
      winningCells: []
    };
  }

  initialize(onStateChange: (state: GameState) => void) {
    this.onStateChange = onStateChange;
    this.connectWebSocket();
  }

  private connectWebSocket() {
    try {
      const wsUrl = environment.API_URL.replace('http', 'ws') + '/ws/connect4';
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        console.log('Conectado al servidor Connect4');
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
          board: message.data.board,
          currentPlayer: message.data.currentPlayer,
          gameStatus: message.data.gameStatus,
          roomCode: message.data.roomCode,
          playerColor: message.data.playerColor,
          opponentColor: message.data.opponentColor
        });
        break;

      case 'game_finished':
        this.updateGameState({
          gameStatus: 'finished',
          winner: message.data.winner,
          board: message.data.board,
          winningCells: message.data.winningCells
        });
        break;

      case 'error':
        console.error('Game error:', message.data);
        break;
    }
  }

  makeMove(column: number) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      const message = {
        type: 'move',
        data: { column }
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
  }

  private updateGameState(updates: Partial<GameState>) {
    this.gameState = { ...this.gameState, ...updates };
    if (this.onStateChange) {
      this.onStateChange(this.gameState);
    }
  }

  getGameState(): GameState {
    return this.gameState;
  }
}
