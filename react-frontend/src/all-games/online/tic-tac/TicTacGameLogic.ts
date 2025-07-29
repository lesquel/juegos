import type { 
  GameState, 
  Board, 
  Player, 
  WebSocketMessage, 
  GameConfig,
  CellValue 
} from './types/TicTacTypes';

export class TicTacGameLogic {
  private ws: WebSocket | null = null;
  private gameState: GameState;
  private onStateUpdate: (state: GameState) => void;
  private config: GameConfig;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;

  constructor(
    config: GameConfig,
    onStateUpdate: (state: GameState) => void
  ) {
    this.config = config;
    this.onStateUpdate = onStateUpdate;
    this.gameState = this.createInitialState();
  }

  private createInitialState(): GameState {
    return {
      board: Array(9).fill(null) as Board,
      currentPlayer: 'X',
      gameStatus: 'waiting',
      winner: null,
      winningPositions: [],
      playerSymbol: null,
      isConnected: false,
      roomCode: null,
      playerName: this.config.playerName || '',
      opponentName: null,
      isPlayerTurn: false,
      lastMove: null,
      gameId: null,
      spectators: 0
    };
  }

  public async connect(): Promise<void> {
    try {
      const token = this.config.authToken;
      const wsUrl = `${this.config.wsUrl}?token=${encodeURIComponent(token)}`;
      
      this.ws = new WebSocket(wsUrl);
      
      this.ws.onopen = () => {
        console.log('WebSocket connected');
        this.updateState({ isConnected: true });
        this.reconnectAttempts = 0;
        
        // Join or create room
        if (this.config.roomCode) {
          this.joinRoom(this.config.roomCode);
        } else {
          this.createRoom();
        }
      };

      this.ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          this.handleMessage(message);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      this.ws.onclose = (event) => {
        console.log('WebSocket closed:', event.code, event.reason);
        this.updateState({ isConnected: false });
        
        if (!event.wasClean && this.reconnectAttempts < this.maxReconnectAttempts) {
          this.scheduleReconnect();
        }
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.updateState({ isConnected: false });
      };

    } catch (error) {
      console.error('Connection error:', error);
      throw new Error('Failed to connect to game server');
    }
  }

  private scheduleReconnect(): void {
    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
    
    console.log(`Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts})`);
    
    setTimeout(() => {
      if (this.ws?.readyState !== WebSocket.OPEN) {
        this.connect().catch(console.error);
      }
    }, delay);
  }

  private handleMessage(message: WebSocketMessage): void {
    console.log('Received message:', message);

    switch (message.type) {
      case 'room_created':
        this.updateState({
          roomCode: message.data.roomCode,
          gameId: message.data.gameId,
          playerSymbol: 'X',
          gameStatus: 'waiting'
        });
        break;

      case 'room_joined':
        this.updateState({
          roomCode: message.data.roomCode,
          gameId: message.data.gameId,
          playerSymbol: message.data.playerSymbol,
          gameStatus: message.data.gameStatus,
          opponentName: message.data.opponentName
        });
        break;

      case 'player_joined':
        this.updateState({
          opponentName: message.data.playerName,
          gameStatus: 'playing',
          isPlayerTurn: this.gameState.playerSymbol === 'X'
        });
        break;

      case 'player_left':
        this.updateState({
          opponentName: null,
          gameStatus: 'waiting',
          isPlayerTurn: false
        });
        break;

      case 'move_made':
        this.handleOpponentMove(message.data);
        break;

      case 'game_over':
        this.handleGameOver(message.data);
        break;

      case 'game_reset':
        this.resetGame();
        break;

      case 'error':
        console.error('Server error:', message.data.message);
        break;

      case 'spectator_count':
        this.updateState({ spectators: message.data.count });
        break;

      default:
        console.warn('Unknown message type:', message.type);
    }
  }

  private handleOpponentMove(data: any): void {
    const newBoard = [...this.gameState.board] as Board;
    newBoard[data.position] = data.player;

    this.updateState({
      board: newBoard,
      currentPlayer: this.getNextPlayer(data.player),
      isPlayerTurn: true,
      lastMove: {
        player: data.player,
        position: data.position,
        timestamp: Date.now()
      }
    });
  }

  private handleGameOver(data: any): void {
    this.updateState({
      gameStatus: 'finished',
      winner: data.winner,
      winningPositions: data.winningPositions || [],
      isPlayerTurn: false
    });
  }

  public makeMove(position: number): boolean {
    // Validate move
    if (!this.canMakeMove(position)) {
      return false;
    }

    // For offline mode
    if (!this.config.isOnline) {
      return this.makeOfflineMove(position);
    }

    // For online mode
    if (!this.gameState.isPlayerTurn || !this.gameState.playerSymbol) {
      return false;
    }

    // Send move to server
    this.sendMessage({
      type: 'make_move',
      data: {
        position,
        gameId: this.gameState.gameId
      }
    });

    // Optimistically update local state
    const newBoard = [...this.gameState.board] as Board;
    newBoard[position] = this.gameState.playerSymbol;

    this.updateState({
      board: newBoard,
      currentPlayer: this.getNextPlayer(this.gameState.playerSymbol),
      isPlayerTurn: false,
      lastMove: {
        player: this.gameState.playerSymbol,
        position,
        timestamp: Date.now()
      }
    });

    // Check for win/draw
    const gameResult = this.checkGameResult(newBoard);
    if (gameResult.isFinished) {
      this.updateState({
        gameStatus: 'finished',
        winner: gameResult.winner,
        winningPositions: gameResult.winningPositions
      });
    }

    return true;
  }

  private makeOfflineMove(position: number): boolean {
    const newBoard = [...this.gameState.board] as Board;
    newBoard[position] = this.gameState.currentPlayer;

    const gameResult = this.checkGameResult(newBoard);
    
    this.updateState({
      board: newBoard,
      currentPlayer: this.getNextPlayer(this.gameState.currentPlayer),
      lastMove: {
        player: this.gameState.currentPlayer,
        position,
        timestamp: Date.now()
      },
      ...(gameResult.isFinished && {
        gameStatus: 'finished',
        winner: gameResult.winner,
        winningPositions: gameResult.winningPositions
      })
    });

    return true;
  }

  private canMakeMove(position: number): boolean {
    return (
      position >= 0 && 
      position < 9 && 
      this.gameState.board[position] === null &&
      this.gameState.gameStatus === 'playing'
    );
  }

  private checkGameResult(board: Board): {
    isFinished: boolean;
    winner: Player | 'draw' | null;
    winningPositions: number[];
  } {
    const winPatterns = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
      [0, 4, 8], [2, 4, 6]             // Diagonals
    ];

    // Check for winner
    for (const pattern of winPatterns) {
      const [a, b, c] = pattern;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return {
          isFinished: true,
          winner: board[a] as Player,
          winningPositions: pattern
        };
      }
    }

    // Check for draw
    if (board.every(cell => cell !== null)) {
      return {
        isFinished: true,
        winner: 'draw',
        winningPositions: []
      };
    }

    return {
      isFinished: false,
      winner: null,
      winningPositions: []
    };
  }

  private getNextPlayer(currentPlayer: Player): Player {
    return currentPlayer === 'X' ? 'O' : 'X';
  }

  public resetGame(): void {
    if (this.config.isOnline && this.gameState.gameId) {
      this.sendMessage({
        type: 'reset_game',
        data: { gameId: this.gameState.gameId }
      });
    }

    const resetState = {
      ...this.gameState,
      board: Array(9).fill(null) as Board,
      currentPlayer: 'X' as Player,
      gameStatus: this.config.isOnline ? 'playing' : 'playing',
      winner: null,
      winningPositions: [],
      isPlayerTurn: this.config.isOnline ? this.gameState.playerSymbol === 'X' : true,
      lastMove: null
    };

    this.updateState(resetState);
  }

  private createRoom(): void {
    this.sendMessage({
      type: 'create_room',
      data: {
        gameType: 'tic-tac-toe',
        playerName: this.gameState.playerName
      }
    });
  }

  private joinRoom(roomCode: string): void {
    this.sendMessage({
      type: 'join_room',
      data: {
        roomCode,
        playerName: this.gameState.playerName
      }
    });
  }

  private sendMessage(message: WebSocketMessage): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      console.error('WebSocket not connected');
    }
  }

  private updateState(updates: Partial<GameState>): void {
    this.gameState = { ...this.gameState, ...updates };
    this.onStateUpdate(this.gameState);
  }

  public getState(): GameState {
    return { ...this.gameState };
  }

  public disconnect(): void {
    if (this.ws) {
      this.ws.close(1000, 'Manual disconnect');
      this.ws = null;
    }
    this.updateState({ isConnected: false });
  }

  public isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  // Utility methods for offline mode
  public startOfflineGame(): void {
    this.updateState({
      gameStatus: 'playing',
      isPlayerTurn: true,
      currentPlayer: 'X'
    });
  }

  public canPlayerMove(): boolean {
    if (!this.config.isOnline) {
      return this.gameState.gameStatus === 'playing';
    }
    return this.gameState.isPlayerTurn && this.gameState.gameStatus === 'playing';
  }

  public getPlayerTurnMessage(): string {
    if (!this.config.isOnline) {
      return `Turno del jugador ${this.gameState.currentPlayer}`;
    }

    if (!this.gameState.isConnected) {
      return 'Conectando...';
    }

    switch (this.gameState.gameStatus) {
      case 'waiting':
        return 'Esperando oponente...';
      case 'playing':
        return this.gameState.isPlayerTurn ? 'Tu turno' : 'Turno del oponente';
      case 'finished':
        if (this.gameState.winner === 'draw') {
          return '¡Empate!';
        }
        if (this.config.isOnline) {
          return this.gameState.winner === this.gameState.playerSymbol ? '¡Ganaste!' : 'Perdiste';
        }
        return `¡Ganó el jugador ${this.gameState.winner}!`;
      default:
        return '';
    }
  }
}
