import type {
  GameState,
  Board,
  Player,
  WebSocketMessage,
  GameConfig,
} from './types/TicTacTypes';

// Tipos específicos para los mensajes del backend
interface BackendMessage {
  type: string;
  match_id?: string;
  player_id?: string | null;
  move?: {
    row: number;
    col: number;
  };
  participants?: Array<{
    user_id: string;
    score: number;
  }>;
  winner?: string;
  winningPositions?: number[];
  [key: string]: unknown;
}

export class TicTacGameLogic {
  public ws: WebSocket | null = null; // Cambiado a público para poder compartir conexiones
  private gameState: GameState;
  public onStateUpdate: (state: GameState) => void; // Cambiado a público
  private config: GameConfig;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private isConnecting = false; // Flag para prevenir conexiones duplicadas
  private connectionPromise: Promise<void> | null = null;

  // Static registry to prevent multiple connections to the same room
  private static activeConnections = new Map<string, TicTacGameLogic>();

  // Static methods to manage active connections
  static getActiveConnection(roomCode: string): TicTacGameLogic | undefined {
    const connection = this.activeConnections.get(roomCode);
    // Verificar que la conexión sea válida y esté activa
    if (connection && connection.isConnected() && connection.gameState.gameStatus !== 'error') {
      return connection;
    }
    // Si la conexión no es válida, limpiarla del registro
    if (connection) {
      this.activeConnections.delete(roomCode);
    }
    return undefined;
  }

  static hasActiveConnection(roomCode: string): boolean {
    const connection = this.getActiveConnection(roomCode);
    return connection !== undefined;
  }

  static registerConnection(roomCode: string, instance: TicTacGameLogic): void {
    this.activeConnections.set(roomCode, instance);
  }

  static unregisterConnection(roomCode: string): void {
    this.activeConnections.delete(roomCode);
  }

  static removeConnection(roomCode: string): void {
    const instance = this.activeConnections.get(roomCode);
    if (instance) {
      try {
        instance.disconnect();
      } catch (error) {
        console.warn(`Error disconnecting room ${roomCode}:`, error);
      }
    }
    this.activeConnections.delete(roomCode);
  }



  // Static method to cleanup inactive connections
  static cleanupInactiveConnections(): void {
    const roomsToCleanup: string[] = [];

    for (const [roomCode, instance] of this.activeConnections.entries()) {
      if (!instance.isConnected()) {
        roomsToCleanup.push(roomCode);
      }
    }

    roomsToCleanup.forEach(roomCode => {
      this.activeConnections.delete(roomCode);
    });
  }

  // Static method to force cleanup all connections (useful for page refresh/navigation)
  static cleanupAllConnections(): void {
    for (const [roomCode, instance] of this.activeConnections.entries()) {
      try {
        instance.disconnect();
      } catch (error) {
        console.warn(`Error disconnecting room ${roomCode}:`, error);
      }
    }
    this.activeConnections.clear();
  }

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
      roomCode: this.config.roomCode || null,
      player_id: this.config.player_id || '',
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
    const roomCode = this.config.roomCode;

    if (!roomCode) {
      throw new Error('Room code is required for connection');
    }

    // Si ya hay una conexión activa en esta instancia, no crear otra
    if (this.ws?.readyState === WebSocket.OPEN) {
      console.log('🟢 WebSocket already connected in this instance');
      TicTacGameLogic.registerConnection(roomCode, this);
      return;
    }

    if (this.isConnecting) {
      console.log('🔄 Connection already in progress, waiting...');
      return this.connectionPromise || Promise.resolve();
    }

    // Verificar si ya existe una conexión activa y VÁLIDA para este room
    const existingConnection = TicTacGameLogic.getActiveConnection(roomCode);
    if (existingConnection && existingConnection !== this) {
      const gameState = existingConnection.getState();
      // Solo reutilizar si el juego no tiene errores y la conexión está activa
      if (gameState.gameStatus !== 'error' && existingConnection.isConnected()) {
        console.log('🟢 Reusing existing valid connection for room:', roomCode);
        // Compartir la conexión WebSocket
        this.ws = existingConnection.ws;
        // Copiar el estado del juego, pero mantener nuestro callback
        this.gameState = { ...gameState };
        this.updateState({
          isConnected: true,
          playerSymbol: gameState.playerSymbol,
          gameStatus: gameState.gameStatus
        });
        TicTacGameLogic.registerConnection(roomCode, this);
        return;
      } else {
        // La conexión existente tiene errores, limpiarla
        console.log('🧹 Existing connection has errors, cleaning up');
        TicTacGameLogic.removeConnection(roomCode);
      }
    }

    this.isConnecting = true;
    this.connectionPromise = this.createConnection();

    try {
      await this.connectionPromise;
      // Registrar la conexión activa solo después de una conexión exitosa
      TicTacGameLogic.registerConnection(roomCode, this);
    } catch (error) {
      console.error('❌ Connection failed:', error);
      // En caso de error, intentar modo offline si es posible
      if (!this.config.isOnline) {
        this.switchToOfflineMode();
      }
      throw error;
    } finally {
      this.isConnecting = false;
      this.connectionPromise = null;
    }
  }

  private async createConnection(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        // Verificar si ya existe una conexión activa para este room antes de crear una nueva
        const roomCode = this.config.roomCode;
        const existingConnection = TicTacGameLogic.getActiveConnection(roomCode!);
        if (existingConnection && existingConnection !== this && existingConnection.isConnected()) {
          console.log('🔄 Detected existing connection during creation, reusing it');
          this.ws = existingConnection.ws;
          this.updateState({ isConnected: true });
          resolve();
          return;
        }

        // Cerrar conexión existente si la hay
        if (this.ws) {
          this.ws.close();
          this.ws = null;
        }

        const token = this.config.authToken;
        const wsUrl = `${this.config.wsUrl}/${this.config.roomCode}?token=${encodeURIComponent(token)}`;

        console.log('🔌 Creating new WebSocket connection to:', wsUrl);

        this.ws = new WebSocket(wsUrl);

        // Timeout para conexión
        const connectionTimeout = setTimeout(() => {
          if (this.ws && this.ws.readyState !== WebSocket.OPEN) {
            console.error('❌ WebSocket connection timeout');
            this.ws.close();
            reject(new Error('Connection timeout'));
          }
        }, 10000);

        this.ws.onopen = () => {
          clearTimeout(connectionTimeout);
          console.log('✅ WebSocket connected successfully');
          this.updateState({ isConnected: true });
          this.reconnectAttempts = 0;

          // Join the game using match_id if available
          if (this.config.roomCode) {
            console.log('🎮 Joining game with match_id:', this.config.roomCode);
            // Delay para evitar enviar join inmediatamente
            setTimeout(() => {
              this.joinGame(this.config.roomCode!);
            }, 100);
          }

          resolve();
        };

        this.ws.onmessage = (event) => {
          try {
            const message: WebSocketMessage = JSON.parse(event.data);
            console.log('📩 WebSocket message received:', message);
            this.handleMessage(message);
          } catch (error) {
            console.error('Error parsing WebSocket message:', error, event.data);
          }
        };

        this.ws.onclose = (event) => {
          clearTimeout(connectionTimeout);
          console.log('🔌 WebSocket connection closed:', event.code, event.reason);
          this.updateState({ isConnected: false });

          // Limpiar del registro si la conexión se cierra
          const roomCode = this.config.roomCode;

          // Si es una desconexión manual (código 1000) o por conexión duplicada, no intentar reconectar
          if (event.code === 1000 || event.reason === 'Duplicate connection') {

            if (roomCode) {
              TicTacGameLogic.unregisterConnection(roomCode);
            }
            return;
          }

          // Solo intentar reconectar si no fue una desconexión limpia
          if (!event.wasClean && this.reconnectAttempts < this.maxReconnectAttempts) {

            this.scheduleReconnect();
          } else if (this.reconnectAttempts >= this.maxReconnectAttempts) {
            console.log('❌ Max reconnection attempts reached');
            // Si agotamos los intentos de reconexión, limpiar del registro
            if (roomCode) {
              TicTacGameLogic.unregisterConnection(roomCode);
            }
            // Cambiar a modo offline como último recurso
            this.switchToOfflineMode();
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

          reject(new Error('WebSocket connection failed'));
        };

      } catch (error) {
        console.error('Failed to create WebSocket connection:', error);
        reject(error instanceof Error ? error : new Error('Unknown connection error'));
      }
    });
  }

  private scheduleReconnect(): void {
    if (this.isConnecting) {

      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);

    console.log(`Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);

    setTimeout(() => {
      if (this.ws?.readyState !== WebSocket.OPEN && this.reconnectAttempts <= this.maxReconnectAttempts) {
        this.connect().catch((error) => {
          console.error('Reconnection failed:', error);
          // Si falla la reconexión y no hay más intentos, cambiar a modo offline
          if (this.reconnectAttempts >= this.maxReconnectAttempts) {
            console.log('⚠️ Max reconnection attempts reached, switching to offline mode');
            this.switchToOfflineMode();
          }
        });
      }
    }, delay);
  }

  private handleMessage(message: WebSocketMessage): void {
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
      case 'game_over': {
        console.log('🏆 Juego terminado:', message);
        
        const finishMessage = message as WebSocketMessage & { winner?: string; winningPositions?: number[] };
        
        // Mapear el ganador igual que en vanilla JS
        let mappedWinner: Player | 'draw' | null = null;
        const winner = finishMessage.winner;
        
        if (winner === "R") {
          mappedWinner = "X";
        } else if (winner === "Y") {
          mappedWinner = "O";
        } else if (winner === "draw") {
          mappedWinner = "draw";
        } else if (winner === "X" || winner === "O") {
          mappedWinner = winner; // Ya está en formato correcto
        }
        
        console.log('🏆 Ganador mapeado:', winner, '->', mappedWinner);
        
        this.updateState({
          gameStatus: 'finished',
          winner: mappedWinner,
          winningPositions: finishMessage.winningPositions || [],
          isPlayerTurn: false
        });
        break;
      }



      case 'player_assigned':
        this.handlePlayerAssigned(message);
        break;

      case 'game_restarted':
        console.log('🔄 Juego reiniciado');
        this.resetGameState();
        break;

      case 'error': {
        const errorMessage = (message as any).message || 'Unknown error';
        console.error('💥 Server error:', errorMessage);

        // Manejar diferentes tipos de errores
        if (errorMessage.includes('Juego no encontrado') || errorMessage.includes('Game not found')) {
          console.warn('🎯 Game not found error - cleaning up and retrying');

          // Limpiar la conexión del registro de conexiones activas
          if (this.config.roomCode) {
            TicTacGameLogic.removeConnection(this.config.roomCode);
          }

          this.updateState({
            gameStatus: 'error',
            isConnected: false
          });

          // Resetear intentos de reconexión para empezar desde cero
          this.reconnectAttempts = 0;

          // Intentar reconectar después de un breve delay
          setTimeout(() => {
            if (this.config.roomCode) {
              console.log('🔄 Retrying connection for room:', this.config.roomCode);
              this.connect().catch((err) => {
                console.error('❌ Retry connection failed:', err);
                this.switchToOfflineMode();
              });
            }
          }, 2000);
        } else if (errorMessage.includes('Columna inválida') || errorMessage.includes('Invalid column')) {
          // Para errores de movimiento inválido, no desconectar, solo mostrar error
          console.warn('⚠️ Invalid move error from server:', errorMessage);
          // Optionally update UI to show the error to user
          // this.updateState({ lastError: errorMessage });
        } else {
          // Para otros errores, marcar como error pero mantener conexión
          console.warn('⚠️ Server error (maintaining connection):', errorMessage);
          // this.updateState({ lastError: errorMessage });
        }
        break;
      }

      default:
        console.warn('⚠️ Unknown message type:', message.type);
        // También intentar manejar como game_state si tiene información del juego
        if ((message as any).game_state || (message as any).board || (message as any).state) {
          console.log('🔄 Treating unknown message as game_state');
          this.handleGameState(message);
        }
    }
  }

  private handleGameState(message: any): void {
    console.log('🎮 Estado del juego recibido:', message);

    // Detectar el formato del mensaje como en el vanilla JS
    if (message.game_state) {
      this.handleNewFormatGameState(message);
    } else {
      this.handleOriginalFormatGameState(message);
    }
  }

  private handleNewFormatGameState(data: any): void {
    const gameStateData = data.game_state;
    const playersMapping = data.players;

    console.log('📋 Formato nuevo detectado');
    console.log('📋 Game state data:', gameStateData);
    console.log('📋 Players mapping:', playersMapping);

    // Determinar mi símbolo basado en el mapping de jugadores
    const currentUserId = this.getCurrentUserId();
    if (currentUserId && playersMapping?.[currentUserId]) {
      const backendSymbol = playersMapping[currentUserId];
      let frontendSymbol: Player;
      
      if (backendSymbol === "R") {
        frontendSymbol = "X"; // Primer jugador es X
      } else if (backendSymbol === "Y") {
        frontendSymbol = "O"; // Segundo jugador es O
      } else {
        frontendSymbol = backendSymbol === 1 ? "X" : "O";
      }
      
      console.log('🎮 Mi símbolo asignado:', frontendSymbol, '(mapeado desde', backendSymbol, ')');
      this.updateState({ playerSymbol: frontendSymbol });
    }

    // Determinar el estado del juego
    if (gameStateData.game_over) {
      console.log('🏆 Juego terminado');
      if (gameStateData.winner) {
        // Mapear el ganador del backend también
        let mappedWinner: Player | 'draw' = gameStateData.winner;
        if (gameStateData.winner === "R") {
          mappedWinner = "X";
        } else if (gameStateData.winner === "Y") {
          mappedWinner = "O";
        }
        this.updateState({
          gameStatus: 'finished',
          winner: mappedWinner
        });
      }
      return;
    }

    // El juego está en progreso
    console.log('🎮 Estado: Jugando (2 jugadores conectados)');
    this.updateState({ gameStatus: 'playing' });

    // Para Tic-Tac-Toe, el backend ahora envía el tablero correctamente
    if (gameStateData.board) {
      console.log('📋 Actualizando tablero desde servidor');
      this.updateBoardFromServer(gameStateData.board);
    }

    // Determinar de quién es el turno - mapear "R" -> "X", "Y" -> "O"
    let mappedCurrentPlayer: Player = gameStateData.current_player;
    if (gameStateData.current_player === "R") {
      mappedCurrentPlayer = "X";
    } else if (gameStateData.current_player === "Y") {
      mappedCurrentPlayer = "O";
    }

    // Determinar si es mi turno usando la misma lógica del vanilla JS
    this.updateTurnFromGameState(mappedCurrentPlayer);
    this.updateState({ currentPlayer: mappedCurrentPlayer });
  }

  private handleOriginalFormatGameState(data: any): void {
    console.log('📋 Formato original detectado');
    console.log('📋 Player ID asignado:', data.player_id);
    console.log('📋 Símbolo del jugador:', data.player_symbol || data.player_color);
    console.log('📋 Estado del juego:', data.state);

    // Mapear símbolos del backend a Tic-Tac-Toe como en vanilla JS
    const backendSymbol = data.player_symbol || data.player_color;
    let playerSymbol: Player;
    
    if (backendSymbol === "R" || backendSymbol === "red") {
      playerSymbol = "X";
    } else if (backendSymbol === "Y" || backendSymbol === "yellow") {
      playerSymbol = "O";
    } else {
      playerSymbol = backendSymbol; // Usar tal como viene si ya es X o O
    }

    console.log('🎮 Símbolo mapeado:', playerSymbol);

    this.updateState({
      playerSymbol,
      gameStatus: data.state === 'waiting_for_players' ? 'waiting' : 'playing'
    });

    // Actualizar el tablero si existe
    if (data.board) {
      this.updateBoardFromServer(data.board);
    }

    // Determinar turno usando la misma lógica del vanilla JS
    if (data.current_player) {
      this.updateTurnFromGameState(data.current_player);
    }

    if (data.winner) {
      // Mapear el ganador también
      let mappedWinner: Player | 'draw' = data.winner;
      if (data.winner === "R") {
        mappedWinner = "X";
      } else if (data.winner === "Y") {
        mappedWinner = "O";
      }
      this.updateState({
        gameStatus: 'finished',
        winner: mappedWinner
      });
    }
  }

  // Método para determinar turno igual que el vanilla JS
  private updateTurnFromGameState(currentPlayer: any): void {
    // Determinar de quién es el turno basado en current_player
    let isCurrentPlayer = false;

    console.log('🎯 Determinando turno:', {
      currentPlayerFromServer: currentPlayer,
      myPlayerSymbol: this.gameState.playerSymbol,
      currentUserId: this.getCurrentUserId(),
    });

    if (currentPlayer === "X" || currentPlayer === 1 || currentPlayer === "R") {
      isCurrentPlayer = this.gameState.playerSymbol === "X";
      console.log('🔴 Turno del jugador X/R:', {
        isMyTurn: isCurrentPlayer,
        mySymbol: this.gameState.playerSymbol,
      });
    } else if (currentPlayer === "O" || currentPlayer === 2 || currentPlayer === "Y") {
      isCurrentPlayer = this.gameState.playerSymbol === "O";
      console.log('🟡 Turno del jugador O/Y:', {
        isMyTurn: isCurrentPlayer,
        mySymbol: this.gameState.playerSymbol,
      });
    }

    console.log('📋 Current player del servidor:', currentPlayer);
    console.log('📋 Mi símbolo:', this.gameState.playerSymbol);
    console.log('📋 Es mi turno:', isCurrentPlayer);

    this.updateState({ isPlayerTurn: isCurrentPlayer });
  }



  private mapBackendSymbolToFrontend(backendSymbol: string): Player | null {
    switch (backendSymbol) {
      case 'R':
      case '1':
        return 'X';
      case 'Y':
      case '2':
        return 'O';
      case null:
      case undefined:
        return null;
      default:
        return backendSymbol as Player | null;
    }
  }

  private mapBackendWinnerToFrontend(backendWinner: string): Player | 'draw' | null {
    switch (backendWinner) {
      case 'R':
      case '1':
        return 'X';
      case 'Y':
      case '2':
        return 'O';
      case 'draw':
        return 'draw';
      case null:
      case undefined:
        return null;
      default:
        return backendWinner as Player | 'draw' | null;
    }
  }

  private getCurrentUserId(): string | null {
    // Extraer el ID de usuario del token JWT
    try {
      if (!this.config.authToken) return null;

      const payload = JSON.parse(atob(this.config.authToken.split('.')[1]));
      return payload.sub || null;
    } catch (error) {
      console.error('Error extracting user ID from token:', error);
      return null;
    }
  }

  private resetGameState(): void {
    console.log('🔄 Reseteando estado del juego');
    
    this.updateState({
      board: Array(9).fill(null) as Board,
      currentPlayer: 'X',
      gameStatus: 'playing',
      winner: null,
      winningPositions: [],
      isPlayerTurn: this.gameState.playerSymbol === 'X', // X siempre empieza
      lastMove: null
    });
  }

  private handlePlayerAssigned(message: any): void {
    if (message.player_symbol) {
      const frontendSymbol = this.mapBackendSymbolToFrontend(message.player_symbol);
      this.updateState({
        playerSymbol: frontendSymbol,
        isPlayerTurn: message.player_symbol === 'R'
      });
    }
  }

  private handlePlayerJoined(message: any): void {
    const playersCount = message.players_count || 0;

    this.updateState({
      gameStatus: playersCount === 2 ? 'playing' : 'waiting'
    });

    // Si ahora hay 2 jugadores, solicitar el estado actualizado del juego
    if (playersCount === 2) {
      setTimeout(() => {
        if (this.ws?.readyState === WebSocket.OPEN) {
          this.sendMessage({
            type: 'get_game_state',
            match_id: this.config.roomCode
          });
        }
      }, 500);
    }
  }

  private handleMoveMade(message: any): void {
    console.log('🎯 Movimiento procesado:', message);

    // Verificar si el movimiento es válido como en vanilla JS
    if (message.result?.valid) {
      this.processValidMove(message);
    } else {
      console.error('❌ Movimiento inválido:', message.result?.reason || 'Razón desconocida');
      // Mostrar error al usuario pero no desconectar
    }
  }

  private processValidMove(data: any): void {
    console.log('📋 Procesando movimiento válido:', data);
    
    // Actualizar el tablero con el movimiento
    const move = data.move;
    let symbol = data.player_symbol;

    // Mapear símbolo del backend a Tic-Tac-Toe como en vanilla JS
    if (symbol === "R") {
      symbol = "X";
    } else if (symbol === "Y") {
      symbol = "O";
    }

    console.log('📋 Movimiento válido:', {
      row: move.row,
      column: move.column,
      symbol: symbol,
      original_symbol: data.player_symbol,
      result: data.result,
    });

    // Actualizar el tablero local
    const position = move.row * 3 + move.column;
    const newBoard = [...this.gameState.board] as Board;
    
    if (position >= 0 && position < 9 && newBoard[position] === null) {
      newBoard[position] = symbol as Player;
      this.updateState({ board: newBoard });
    }

    // Verificar ganador localmente después de actualizar el tablero
    console.log('🔍 Verificando ganador después del movimiento...');
    const gameResult = this.checkGameResult(newBoard);
    if (gameResult.isFinished) {
      console.log('🏆 ¡Ganador detectado localmente!');
      this.updateState({
        gameStatus: 'finished',
        winner: gameResult.winner,
        winningPositions: gameResult.winningPositions
      });
      return;
    }

    // Verificar empate
    const moveCount = newBoard.filter(cell => cell !== null).length;
    if (moveCount >= 9) {
      console.log('🤝 Empate detectado localmente!');
      this.updateState({
        gameStatus: 'finished',
        winner: 'draw'
      });
      return;
    }

    // Actualizar el estado del juego si existe información adicional
    if (data.game_state) {
      console.log('🎮 Actualizando estado con data.game_state:', data.game_state);
      this.processGameStateAfterMove(data.game_state, data.player_id);
    } else {
      // Si no hay game_state en la respuesta, solicitar el estado actualizado
      console.log('🔄 No hay game_state en la respuesta, solicitando estado...');
      setTimeout(() => {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
          const getStateMessage = {
            type: 'get_game_state',
            match_id: this.config.roomCode,
            game_type: 'tictactoe'
          };
          this.ws.send(JSON.stringify(getStateMessage));
        }
      }, 200); // MOVE_STATE_DELAY del vanilla JS
    }
  }

  private processGameStateAfterMove(gameState: any, playerId: string): void {
    console.log('🎮 Procesando estado después del movimiento:', gameState);

    if (gameState.winner) {
      // Mapear ganador como en vanilla JS
      let mappedWinner: Player | 'draw' = gameState.winner;
      if (gameState.winner === "R") {
        mappedWinner = "X";
      } else if (gameState.winner === "Y") {
        mappedWinner = "O";
      }
      
      this.updateState({
        gameStatus: 'finished',
        winner: mappedWinner
      });
    } else if (gameState.game_over) {
      this.updateState({
        gameStatus: 'finished',
        winner: 'draw'
      });
    } else {
      // Mapear current_player para determinar turnos
      let mappedCurrentPlayer: Player = gameState.current_player;
      if (gameState.current_player === "R") {
        mappedCurrentPlayer = "X";
      } else if (gameState.current_player === "Y") {
        mappedCurrentPlayer = "O";
      }

      console.log('🔄 Actualizando turno después del movimiento:', {
        originalCurrentPlayer: gameState.current_player,
        mappedCurrentPlayer: mappedCurrentPlayer,
        mySymbol: this.gameState.playerSymbol,
      });

      this.updateTurnFromGameState(mappedCurrentPlayer);
      this.updateState({ currentPlayer: mappedCurrentPlayer });
    }
  }



  // Método para determinar turno igual que el vanilla JS
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
    
    const joinMessage = {
      type: 'join_game',
      match_id: matchId,
      game_type: 'tictactoe',
      player_id: this.getCurrentUserId()
    };

    console.log('🚪 Enviando mensaje de unión:', joinMessage);
    
    // Enviar directamente como JSON sin wrapper, igual que el vanilla JS
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(joinMessage));
    } else {
      console.error('❌ No se puede enviar mensaje: WebSocket no conectado');
    }
  }



  public makeMove(position: number): boolean {
    // Validate move
    if (!this.canMakeMove(position)) {
      console.log('❌ Invalid move - position:', position, 'canMakeMove:', this.canMakeMove(position));
      return false;
    }

    // For offline mode
    if (!this.config.isOnline) {
      return this.makeOfflineMove(position);
    }

    // For online mode
    if (!this.gameState.isPlayerTurn || !this.gameState.playerSymbol) {
      console.log('❌ Not player turn or no symbol assigned:', {
        isPlayerTurn: this.gameState.isPlayerTurn,
        playerSymbol: this.gameState.playerSymbol
      });
      return false;
    }

    // Convert linear position to row/col for backend (0-based indexing)
    const row = Math.floor(position / 3);
    const col = position % 3;

    // Validate coordinates are within bounds
    if (row < 0 || row > 2 || col < 0 || col > 2) {
      console.error('❌ Invalid coordinates:', { position, row, col });
      return false;
    }

    console.log('🎯 Making move:', { position, row, col, playerSymbol: this.gameState.playerSymbol });

    // Send move to server using the same format as vanilla JS
    const moveMessage = {
      type: 'make_move',
      match_id: this.config.roomCode,
      game_type: 'tictactoe',
      player_id: this.getCurrentUserId(),
      move: {
        row: row,
        column: col // Usar 'column' como en el vanilla JS
      }
    };

    console.log('🎯 Enviando movimiento:', moveMessage);
    
    // Enviar directamente como JSON sin wrapper
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(moveMessage));
    } else {
      console.error('❌ No se puede enviar mensaje: WebSocket no conectado');
      return false;
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
    const isValidPosition = position >= 0 && position < 9;
    const isEmptyCell = this.gameState.board[position] === null;
    const isGamePlaying = this.gameState.gameStatus === 'playing';

    console.log('🔍 Move validation:', {
      position,
      isValidPosition,
      isEmptyCell,
      isGamePlaying,
      gameStatus: this.gameState.gameStatus,
      cellValue: this.gameState.board[position]
    });

    return isValidPosition && isEmptyCell && isGamePlaying;
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
          winner: board[a],
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



  public finishGame(participants: { user_id: string; score: number }[]): void {
    if (this.config.isOnline && this.config.roomCode) {
      this.sendMessage({
        type: 'game_finished',
        match_id: this.config.roomCode,
        participants: participants
      });
    }
  }



  private sendMessage(message: BackendMessage): void {
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
    console.log('🔌 Disconnecting WebSocket for room:', this.config.roomCode);

    if (this.ws) {
      this.ws.close(1000, 'Manual disconnect');
      this.ws = null;
    }

    this.updateState({ isConnected: false });

    // Limpiar el registro de conexiones activas solo si esta instancia está registrada
    const roomCode = this.config.roomCode;
    if (roomCode) {
      const activeConnection = TicTacGameLogic.getActiveConnection(roomCode);
      if (activeConnection === this) {
        console.log('🧹 Unregistering connection for room:', roomCode);
        TicTacGameLogic.unregisterConnection(roomCode);
      }
    }

    // Reset reconnection attempts
    this.reconnectAttempts = 0;
    this.isConnecting = false;
    this.connectionPromise = null;
  }

  // Utility methods for offline mode
  public startOfflineGame(): void {

    this.updateState({
      gameStatus: 'playing',
      isPlayerTurn: true,
      currentPlayer: 'X',
      playerSymbol: 'X', // En modo offline, el jugador siempre empieza como X
      isConnected: false
    });
  }

  private switchToOfflineMode(): void {

    this.config = { ...this.config, isOnline: false };
    this.startOfflineGame();
  }

  public canPlayerMove(): boolean {
    if (!this.config.isOnline) {
      return this.gameState.gameStatus === 'playing';
    }

    return this.gameState.isPlayerTurn &&
      this.gameState.gameStatus === 'playing' &&
      this.gameState.playerSymbol !== null &&
      this.gameState.isConnected;
  }

  public getPlayerTurnMessage(): string {
    if (!this.config.isOnline) {
      return `Turno del jugador ${this.gameState.currentPlayer}`;
    }

    if (!this.gameState.isConnected) {
      return 'Conectando...';
    }

    if (!this.gameState.playerSymbol) {
      return 'Esperando asignación de símbolo...';
    }

    switch (this.gameState.gameStatus) {
      case 'waiting':
        return 'Esperando oponente...';
      case 'playing':
        if (this.gameState.isPlayerTurn) {
          return `Tu turno (${this.gameState.playerSymbol}) - Jugador actual: ${this.gameState.currentPlayer}`;
        } else {
          return `Turno del oponente (esperando jugada...) - Jugador actual: ${this.gameState.currentPlayer}`;
        }
      case 'finished':
        if (this.gameState.winner === 'draw') {
          return '¡Empate!';
        }
        if (this.config.isOnline) {
          return this.gameState.winner === this.gameState.playerSymbol ? '¡Ganaste!' : 'Perdiste';
        }
        return `¡Ganó el jugador ${this.gameState.winner}!`;
      default:
        return 'Preparando juego...';
    }
  }

  public resetGame(): void {
    console.log('🔄 Resetting game');

    // Reset game state
    this.gameState = this.createInitialState();

    // Keep connection and room info
    this.gameState.isConnected = this.isConnected();
    this.gameState.roomCode = this.config.roomCode || null;
    this.gameState.player_id = this.config.player_id;

    // If online, maintain current configuration and request game state
    if (this.config.isOnline && this.isConnected()) {
      this.gameState.gameStatus = 'waiting';

      // Request fresh game state from server
      setTimeout(() => {
        if (this.ws?.readyState === WebSocket.OPEN) {
          this.sendMessage({
            type: 'get_game_state',
            match_id: this.config.roomCode
          });
        }
      }, 100);
    } else {
      // For offline mode, start a new game immediately
      this.startOfflineGame();
    }

    // Notify state update
    this.onStateUpdate(this.gameState);
  }
}
