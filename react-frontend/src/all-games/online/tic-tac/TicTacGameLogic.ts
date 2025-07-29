import type { 
  GameState, 
  Board, 
  Player, 
  WebSocketMessage, 
  GameConfig,
} from './types/TicTacTypes';

export class TicTacGameLogic {
  private ws: WebSocket | null = null;
  private gameState: GameState;
  private onStateUpdate: (state: GameState) => void;
  private config: GameConfig;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private isConnecting = false; // Flag para prevenir conexiones duplicadas
  private connectionPromise: Promise<void> | null = null;

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

  public getConfig(): GameConfig {
    return this.config;
  }

  public isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  public async connect(): Promise<void> {
    // Si ya hay una conexión activa o en proceso, no crear otra
    if (this.ws?.readyState === WebSocket.OPEN) {
      console.log('⚠️ WebSocket already connected, skipping duplicate connection');
      return;
    }

    if (this.isConnecting) {
      console.log('⚠️ Connection already in progress, waiting...');
      return this.connectionPromise || Promise.resolve();
    }

    this.isConnecting = true;
    this.connectionPromise = this.createConnection();
    
    try {
      await this.connectionPromise;
    } finally {
      this.isConnecting = false;
      this.connectionPromise = null;
    }
  }

  private async createConnection(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        // Cerrar conexión existente si la hay
        if (this.ws) {
          this.ws.close();
          this.ws = null;
        }

        const token = this.config.authToken;
        const wsUrl = `${this.config.wsUrl}/${this.config.roomCode}?token=${encodeURIComponent(token)}`;
        
        console.log('🔌 Connecting to WebSocket:', wsUrl);
        this.ws = new WebSocket(wsUrl);
        
        this.ws.onopen = () => {
          console.log('🔌 WebSocket connected for Tic-Tac-Toe');
          this.updateState({ isConnected: true });
          this.reconnectAttempts = 0;
          
          // Join the game using match_id if available
          if (this.config.roomCode) {
            this.joinGame(this.config.roomCode);
          }
          
          resolve();
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
          
          // If connection fails, switch to offline mode
          if (this.reconnectAttempts === 0) {
            console.log('⚠️ WebSocket connection failed, switching to offline mode');
            this.switchToOfflineMode();
          }
          
          reject(error);
        };

      } catch (error) {
        console.error('Failed to create WebSocket connection:', error);
        reject(error);
      }
    });
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
    console.log('📨 Received message:', message);

    switch (message.type) {
      case 'game_state':
        this.handleGameState(message);
        break;

      case 'player_joined':
        this.handlePlayerJoined(message);
        break;

      case 'move_made':
        this.handleMoveMade(message);
        break;

      case 'game_finished_automatically':
      case 'game_over':
        this.handleGameOver(message);
        break;

      case 'game_restarted':
      case 'game_reset':
        this.resetGame();
        break;

      case 'error':
        console.error('💥 Server error:', (message as any).message);
        break;

      default:
        console.warn('⚠️ Unknown message type:', message.type);
    }
  }

  private handleGameState(message: any): void {
    console.log('🎮 Game state received:', message);
    
    if (message.game_state) {
      // New format with game_state object
      const gameState = message.game_state;
      const playersMapping = message.players;
      
      // Map player symbols from backend (R/Y) to frontend (X/O)
      if (playersMapping?.[this.config.playerName]) {
        const backendSymbol = playersMapping[this.config.playerName];
        this.updateState({
          playerSymbol: backendSymbol === 'R' ? 'X' : 'O'
        });
      }
      
      // Update board if available
      if (gameState.board) {
        this.updateBoardFromServer(gameState.board);
      }
      
      // Update game status
      if (gameState.game_over) {
        this.updateState({
          gameStatus: 'finished',
          winner: gameState.winner === 'R' ? 'X' : gameState.winner === 'Y' ? 'O' : gameState.winner
        });
      } else {
        this.updateState({
          gameStatus: 'playing',
          currentPlayer: gameState.current_player === 'R' ? 'X' : 'O',
          isPlayerTurn: this.isMyTurn(gameState.current_player)
        });
      }
    } else {
      // Original format - access properties directly from message
      this.updateState({
        playerSymbol: message.player_symbol === 'R' ? 'X' : 'O',
        gameStatus: message.state === 'waiting_for_players' ? 'waiting' : 'playing'
      });
    }
  }

  private handlePlayerJoined(message: any): void {
    console.log('✅ Player joined:', message);
    this.updateState({
      gameStatus: message.players_count === 2 ? 'playing' : 'waiting'
    });
  }

  private handleMoveMade(message: any): void {
    console.log('🎯 Move made:', message);
    
    if (message.result?.valid) {
      const move = message.move;
      const playerSymbol = message.player_symbol === 'R' ? 'X' : 'O';
      
      // Convert row/col to linear position for our board
      const position = move.row * 3 + move.column;
      
      const newBoard = [...this.gameState.board] as Board;
      if (position >= 0 && position < 9) {
        newBoard[position] = playerSymbol;
        
        this.updateState({
          board: newBoard,
          currentPlayer: this.getNextPlayer(playerSymbol),
          isPlayerTurn: !this.gameState.isPlayerTurn
        });
        
        // Check for game end
        const gameResult = this.checkGameResult(newBoard);
        if (gameResult.isFinished) {
          this.updateState({
            gameStatus: 'finished',
            winner: gameResult.winner,
            winningPositions: gameResult.winningPositions
          });
        }
      }
    }
  }

  private isMyTurn(currentPlayer: string): boolean {
    const myBackendSymbol = this.gameState.playerSymbol === 'X' ? 'R' : 'Y';
    return currentPlayer === myBackendSymbol;
  }

  private updateBoardFromServer(serverBoard: any[][]): void {
    if (!serverBoard || !Array.isArray(serverBoard)) return;
    
    const newBoard = [...this.gameState.board] as Board;
    
    // Take only first 3x3 from server board (in case it's larger like Connect4)
    for (let r = 0; r < Math.min(3, serverBoard.length); r++) {
      for (let c = 0; c < Math.min(3, serverBoard[r]?.length || 0); c++) {
        const position = r * 3 + c;
        const serverValue = serverBoard[r][c];
        
        if (serverValue === 'R' || serverValue === 1) {
          newBoard[position] = 'X';
        } else if (serverValue === 'Y' || serverValue === 2) {
          newBoard[position] = 'O';
        } else {
          newBoard[position] = null;
        }
      }
    }
    
    this.updateState({ board: newBoard });
  }

  private joinGame(matchId: string): void {
    console.log('🚪 Joining game with match_id:', matchId);
    
    this.sendMessage({
      type: 'join_game',
      data: {
        match_id: matchId,
        game_type: 'tictactoe',
        player_id: this.config.playerName
      }
    });
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

  private handleGameOver(message: any): void {
    this.updateState({
      gameStatus: 'finished',
      winner: message.winner,
      winningPositions: message.winningPositions || [],
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
      console.log('❌ Not my turn or no player symbol');
      return false;
    }

    // Convert linear position to row/col for backend
    const row = Math.floor(position / 3);
    const col = position % 3;

    // Send move to server using the same format as the JavaScript version
    this.sendMessage({
      type: 'make_move',
      data: {
        match_id: this.config.roomCode,
        game_type: 'tictactoe',
        move: {
          row: row,
          column: col
        },
        player_id: this.config.playerName
      }
    });

    console.log('🎯 Move sent to server:', { row, col, position });
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
          winner: board[a]!,
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
    if (this.config.isOnline && this.config.roomCode) {
      this.sendMessage({
        type: 'restart_game',
        data: { 
          match_id: this.config.roomCode,
          game_type: 'tictactoe'
        }
      });
    }

    const resetState: Partial<GameState> = {
      board: Array(9).fill(null) as Board,
      currentPlayer: 'X',
      gameStatus: 'playing' as const,
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

  // Utility methods for offline mode
  public startOfflineGame(): void {
    this.updateState({
      gameStatus: 'playing',
      isPlayerTurn: true,
      currentPlayer: 'X'
    });
  }

  private switchToOfflineMode(): void {
    console.log('🔄 Switching to offline mode due to connection failure');
    this.config = { ...this.config, isOnline: false };
    this.startOfflineGame();
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
