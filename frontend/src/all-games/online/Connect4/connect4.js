const playerRed = "R";
const playerYellow = "Y";
let currPlayer = playerRed;
let gameOver = false;
let board;
const rows = 6;
const columns = 7;
let currColumns = [];
let moveCount = 0;
let winningPositions = [];

// WebSocket variables
let socket = null;
let playerId = null;
let playerColor = null;
let isMyTurn = false;
let isOnlineMode = false;
let userInfo = null;
const params = new URLSearchParams(window.location.search);
let gameConfig = {
  matchId: params.get("match_id"), // Se puede cambiar dinámicamente
  gameType: "connect4",
};

// Constants
const WEBSOCKET_URL = "ws://localhost:8000/ws/games";
const MAX_RETRIES = 3;
const RECONNECT_DELAY = 3000;
const GAME_STATE_DELAY = 500;
const MOVE_STATE_DELAY = 200;
const BOARD_SIZE = 42; // 6 * 7
const WIN_LENGTH = 4;
const DEFAULT_COLUMNS = [5, 5, 5, 5, 5, 5, 5];

// Fallback configuration (should be replaced with proper auth)
const FALLBACK_CONFIG = {
  access_token: {
    access_token: "fallback_token_placeholder",
    token_type: "bearer",
  },
  user: {
    user_id: "fallback_user_id",
    email: "fallback@example.com",
    role: "user",
  },
};
class GameWebSocketClient {
  constructor() {
    this.ws = null;
    this.matchId = null;
    this.playerId = null;
    this.token = null;
    this.isConnected = false;
    this.connectionAttempts = 0;
    this.maxRetries = MAX_RETRIES;
  }

  connect(matchId, token, playerId) {
    this.matchId = matchId;
    this.token = token;
    this.playerId = playerId;
    this.connectionAttempts++;

    // Construir URL con token si está disponible
    let wsUrl = `${WEBSOCKET_URL}/${matchId}`;
    if (token) {
      wsUrl += `?token=${encodeURIComponent(token)}`;
    }

    this.log(`🔗 Intento ${this.connectionAttempts}: Conectando a WebSocket`);
    this.log(`🔌 URL: ${wsUrl.replace(/token=[^&]+/, "token=***")}`);

    try {
      this.ws = new WebSocket(wsUrl);
      this.setupEventHandlers();
    } catch (error) {
      this.log(`❌ Error al crear WebSocket: ${error.message}`);
      this.handleConnectionError();
    }
  }

  setupEventHandlers() {
    this.ws.onopen = () => {
      this.log("✅ Conectado al servidor WebSocket");
      this.isConnected = true;
      this.connectionAttempts = 0;
      isOnlineMode = true;
      updateConnectionStatus("connected", "🟢 Conectado");
      updateMessage(`👋 Hola ${userInfo.user.email}`, "");

      // Unirse al juego automáticamente
      this.joinGame();
    };

    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.log(`📥 Mensaje recibido: ${data.type}`);
      this.log(`📋 Contenido: ${JSON.stringify(data, null, 2)}`);
      this.handleMessage(data);
    };

    this.ws.onclose = (event) => {
      this.log(
        `❌ Desconectado. Código: ${event.code}, Razón: ${
          event.reason || "Sin razón"
        }`
      );
      this.isConnected = false;
      isOnlineMode = false;
      updateConnectionStatus("disconnected", "🔴 Desconectado");

      // Reintentar conexión si no fue intencional
      if (event.code !== 1000 && this.connectionAttempts < this.maxRetries) {
        setTimeout(() => {
          this.log(
            `🔄 Reintentando conexión (${this.connectionAttempts + 1}/${
              this.maxRetries
            })`
          );
          this.connect(this.matchId, this.token, this.playerId);
        }, RECONNECT_DELAY);
      }
    };

    this.ws.onerror = (error) => {
      this.log(`💥 Error WebSocket: ${error.message || "Error desconocido"}`);
      this.handleConnectionError();
    };
  }

  joinGame() {
    if (!this.isConnected) return;

    const joinMessage = {
      type: "join_game",
      match_id: this.matchId,
      player_id: this.playerId,
      game_type: "connect4",
    };

    this.sendMessage(joinMessage);
    this.log(`📤 Enviando join_game para ${this.playerId}`);
  }

  makeMove(column) {
    if (!this.isConnected || !isMyTurn) {
      this.log(
        `❌ No se puede hacer movimiento: Connected=${this.isConnected}, MyTurn=${isMyTurn}`
      );
      return false;
    }

    const moveMessage = {
      type: "make_move",
      player_id: this.playerId,
      move: { column: column },
    };

    this.sendMessage(moveMessage);
    this.log(`📤 Movimiento enviado: columna ${column}`);
    return true;
  }

  sendMessage(message) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      this.log("❌ No se puede enviar mensaje: WebSocket no conectado");
    }
  }

  handleMessage(data) {
    // Usar las funciones existentes del juego
    handleWebSocketMessage(data);

    // Logging adicional
    switch (data.type) {
      case "game_state":
        this.log(`🎮 Estado: ${data.state}, Color: ${data.player_color}`);
        break;
      case "move_made":
        this.log(
          `🎯 Movimiento: ${data.player_symbol} en columna ${data.move?.column}`
        );
        break;
      case "error":
        this.log(`💥 Error del servidor: ${data.message}`);
        break;
    }
  }

  handleConnectionError() {
    isOnlineMode = false;
    updateConnectionStatus("disconnected", "🔴 Error de conexión");
    updateMessage("❌ Error de conexión al servidor", "");
  }

  log(message) {
    const timestamp = new Date().toLocaleTimeString();
    console.log(`[${timestamp}] ${message}`);
  }

  disconnect() {
    if (this.ws) {
      this.ws.close(1000, "Desconexión manual");
      this.isConnected = false;
    }
  }

  // Métodos adicionales para compatibilidad
  restartGame() {
    if (!this.isConnected) return;
    this.sendMessage({ type: "restart_game" });
    this.log("📤 Solicitud de reinicio enviada");
  }

  getGameState() {
    if (!this.isConnected) return;
    this.sendMessage({ type: "get_game_state" });
    this.log("📤 Solicitando estado del juego");
  }
}

// Helper function to check if WebSocket is connected
function isWebSocketConnected() {
  return isOnlineMode && wsClient?.isConnected;
}
let wsClient = new GameWebSocketClient();

window.onload = function () {
  console.log("🚀 Iniciando aplicación Connect4...");
  extractUserInfo();
  initializeWebSocket();
  setGame();
};

function extractUserInfo() {
  console.log("🔍 Extrayendo información del usuario desde localStorage...");

  try {
    const authData = getAuthDataFromStorage();
    if (authData) {
      return extractFromAuthData(authData);
    }

    const cookieData = getAuthDataFromCookies();
    if (cookieData) {
      return extractFromCookieData(cookieData);
    }

    return useFallbackAuth();
  } catch (error) {
    console.error("💥 Error al extraer información del usuario:", error);
    return useFallbackAuth();
  }
}

function getAuthDataFromStorage() {
  const authStorage = localStorage.getItem("auth-storage");
  if (!authStorage) {
    return null;
  }

  console.log("✅ auth-storage encontrado en localStorage");
  const authData = JSON.parse(authStorage);
  console.log("📋 Estructura de auth-storage:", authData);

  return authData?.state?.user ? authData : null;
}

function extractFromAuthData(authData) {
  userInfo = {
    access_token: authData.state.user.access_token,
    user: authData.state.user.user,
  };

  // IMPORTANTE: Extraer el user_id del token JWT para asegurar coherencia
  const tokenUserId = extractUserIdFromToken(
    userInfo.access_token.access_token
  );

  if (tokenUserId) {
    console.log("🔑 User ID del token:", tokenUserId);
    console.log("👤 User ID del localStorage:", userInfo.user.user_id);

    // Usar el user_id del token para evitar inconsistencias
    playerId = tokenUserId;
    userInfo.user.user_id = tokenUserId;
  } else {
    // Fallback al ID del localStorage
    playerId = userInfo.user.user_id;
  }

  console.log("✅ Información del usuario extraída del localStorage:", {
    user_id: userInfo.user.user_id,
    player_id_usado: playerId,
    email: userInfo.user.email,
    role: userInfo.user.role,
    has_token: !!userInfo.access_token?.access_token,
    token_preview: userInfo.access_token?.access_token
      ? userInfo.access_token.access_token.substring(0, 20) + "..."
      : "No token",
  });

  return true;
}

function getAuthDataFromCookies() {
  console.log("⚠️ No se encontró auth-storage válido, verificando cookies...");

  const cookies = document.cookie.split(";");
  let userCookie = null;

  console.log("🍪 Cookies disponibles:", cookies);

  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split("=");
    console.log("Cookie encontrada:", name);
    if (
      name.includes("user") ||
      name.includes("auth") ||
      name.includes("session")
    ) {
      userCookie = decodeURIComponent(value);
      console.log("✅ Cookie de usuario encontrada:", name);
      break;
    }
  }

  return userCookie;
}

function extractFromCookieData(userCookie) {
  console.log("📋 Parseando cookie de usuario...");
  userInfo = JSON.parse(userCookie);

  // También extraer user_id del token si hay cookie
  const tokenUserId = extractUserIdFromToken(
    userInfo.access_token?.access_token
  );
  playerId = tokenUserId || userInfo.user.user_id;
  return true;
}

function useFallbackAuth() {
  console.log("⚠️ No se encontraron datos de usuario, usando fallback");
  userInfo = {
    ...FALLBACK_CONFIG,
  };
  playerId = userInfo.user.user_id;
  console.log("🛡️ Usando datos de fallback");
  return true;
}

// Función para extraer el user_id del token JWT
function extractUserIdFromToken(token) {
  if (!token) return null;

  try {
    // Los JWT tienen 3 partes separadas por puntos: header.payload.signature
    const parts = token.split(".");
    if (parts.length !== 3) {
      console.error("❌ Token JWT malformado");
      return null;
    }

    // Decodificar el payload (segunda parte)
    const payload = parts[1];

    // Agregar padding si es necesario para base64
    const paddedPayload = payload + "=".repeat((4 - (payload.length % 4)) % 4);

    // Decodificar de base64
    const decodedPayload = JSON.parse(atob(paddedPayload));

    console.log("🔓 Token JWT decodificado:", decodedPayload);

    // Extraer el subject (user_id)
    const userId = decodedPayload.sub;

    if (userId) {
      console.log("✅ User ID extraído del token:", userId);
      return userId;
    } else {
      console.error("❌ No se encontró 'sub' en el token");
      return null;
    }
  } catch (error) {
    console.error("💥 Error al decodificar el token JWT:", error);
    return null;
  }
}

function initializeWebSocket() {
  // Verificar que tenemos la información del usuario
  if (!userInfo?.access_token?.access_token) {
    console.error(
      "❌ No se pudo obtener la información del usuario o el token"
    );
    console.log("UserInfo disponible:", userInfo);
    updateConnectionStatus("disconnected", "🔴 Error: Sin autenticación");
    return;
  }

  console.log("🌐 Inicializando WebSocket con nueva clase");

  // Usar la nueva clase WebSocket
  wsClient.connect(
    gameConfig.matchId,
    userInfo.access_token.access_token,
    userInfo.user.user_id
  );

  // Mantener referencia para compatibilidad con código existente
  socket = wsClient.ws;
}

function handleWebSocketMessage(data) {
  console.log("🔄 Procesando mensaje del tipo:", data.type);

  switch (data.type) {
    case "game_state":
      console.log("🎮 Manejando estado del juego");
      handleGameState(data);
      break;
    case "player_joined":
      console.log("👤 Manejando jugador unido");
      handlePlayerJoined(data);
      break;
    case "move_made":
      console.log("🎯 Manejando movimiento realizado");
      handleMoveMade(data);
      break;
    case "game_restarted":
      console.log("🔄 Manejando reinicio del juego");
      handleGameRestarted(data);
      break;
    case "error":
      console.log("❌ Manejando error del servidor");
      handleError(data);
      break;
    default:
      console.log("❓ Tipo de mensaje no reconocido:", data.type);
      console.log("📋 Datos del mensaje:", data);
  }
}

function handleGameState(data) {
  console.log("🎮 Estado del juego recibido:", data);

  // Detectar el formato del mensaje
  if (data.game_state) {
    handleNewFormatGameState(data);
  } else {
    handleOriginalFormatGameState(data);
  }
}

function handleNewFormatGameState(data) {
  const gameStateData = data.game_state;
  const playersMapping = data.players;

  console.log("📋 Formato nuevo detectado");
  console.log("📋 Game state data:", gameStateData);
  console.log("📋 Players mapping:", playersMapping);

  // Determinar mi color basado en el mapping de jugadores
  if (playersMapping?.[playerId]) {
    const mySymbol = playersMapping[playerId];
    playerColor = mySymbol === "R" ? "red" : "yellow";
    console.log(
      "📋 Mi símbolo del mapping:",
      mySymbol,
      "-> color:",
      playerColor
    );
  }

  // Determinar el estado del juego
  if (gameStateData.game_over) {
    if (gameStateData.winner) {
      console.log("🏆 Ganador:", gameStateData.winner);
      handleGameWinner(gameStateData.winner);
      return;
    }
    handleTie();
    return;
  }

  // El juego está en progreso
  console.log("🎮 Estado: Jugando (2 jugadores conectados)");
  updateConnectionStatus("connected", "🟢 En juego");

  // Actualizar el tablero si existe
  if (gameStateData.board) {
    console.log("📋 Actualizando tablero desde servidor");
    updateBoardFromServer(gameStateData.board);
  }

  // Determinar de quién es el turno
  updateTurnFromGameState(gameStateData.current_player);
  updateTurnMessage();
  updatePlayersInfo(2);
}

function handleOriginalFormatGameState(data) {
  console.log("📋 Formato original detectado");
  console.log("📋 Player ID asignado:", data.player_id);
  console.log("📋 Color del jugador:", data.player_color);
  console.log("📋 Estado del juego:", data.state);

  playerId = data.player_id;
  playerColor = data.player_color;

  if (data.state === "waiting_for_players") {
    handleWaitingState();
  } else if (data.state === "playing") {
    handlePlayingState(data);
  }

  if (data.winner) {
    console.log("🏆 Ganador:", data.winner);
    handleGameWinner(data.winner);
  }
}

function handleWaitingState() {
  console.log("⏳ Estado: Esperando jugadores");
  updateMessage("⏳ Esperando que se una otro jugador...", "");
  updateConnectionStatus("waiting", "🟡 Esperando jugadores");
  isMyTurn = false;
}

function handlePlayingState(data) {
  console.log("🎮 Estado: Jugando");
  updateConnectionStatus("connected", "🟢 En juego");

  // Actualizar el tablero si existe
  if (data.board) {
    console.log("📋 Actualizando tablero desde servidor");
    updateBoardFromServer(data.board);
  }

  updateTurnFromGameState(data.current_player);
  updateTurnMessage();
  updatePlayersInfo(2);
}

function updateTurnFromGameState(currentPlayer) {
  // Determinar de quién es el turno basado en current_player
  let isCurrentPlayer = false;

  if (currentPlayer === "R" || currentPlayer === 1) {
    isCurrentPlayer = playerColor === "red";
  } else if (currentPlayer === "Y" || currentPlayer === 2) {
    isCurrentPlayer = playerColor === "yellow";
  }

  isMyTurn = isCurrentPlayer;
  console.log("📋 Current player del servidor:", currentPlayer);
  console.log("📋 Mi color:", playerColor);
  console.log("📋 Es mi turno:", isMyTurn);
}

function updateTurnMessage() {
  if (isMyTurn) {
    if (playerColor === "red") {
      updateMessage("🎯 Es tu turno - Tus fichas son rojas", "current-red");
    } else {
      updateMessage(
        "🎯 Es tu turno - Tus fichas son amarillas",
        "current-yellow"
      );
    }
  } else if (playerColor === "red") {
    updateMessage(
      "⏳ Turno del oponente (fichas amarillas)",
      "current-yellow"
    );
  } else {
    updateMessage("⏳ Turno del oponente (fichas rojas)", "current-red");
  }

  console.log("💬 Mensaje de turno actualizado:", {
    isMyTurn,
    playerColor,
    message: document.getElementById("message")?.textContent || "Sin mensaje",
  });
}

function updatePlayersInfo(playersCount) {
  const playersInfoElement = document.getElementById("playersInfo");
  if (playersInfoElement) {
    let statusText = "";
    let statusClass = "";

    if (playersCount === 1) {
      statusText = "👤 1/2 jugadores - Esperando oponente...";
      statusClass = "waiting";
    } else if (playersCount === 2) {
      statusText = "👥 2/2 jugadores - ¡Listos para jugar!";
      statusClass = "ready";
    }

    playersInfoElement.textContent = statusText;
    playersInfoElement.className = `players-info status-${statusClass}`;
  }
}

function updateConnectionStatus(status, message) {
  const statusElement = document.getElementById("connectionStatus");
  if (statusElement) {
    statusElement.className = `connection-status status-${status}`;
    statusElement.textContent = message;
  }
}

function handlePlayerJoined(data) {
  updateMessage("✅ Jugador se unió al juego", "");
  console.log(
    `Jugador ${data.player_id} se unió. Total: ${data.players_count}`
  );

  // Si ahora hay 2 jugadores, solicitar el estado actualizado del juego
  if (data.players_count === 2) {
    console.log("🎯 Dos jugadores conectados, solicitando estado del juego...");
    setTimeout(() => {
      wsClient.getGameState();
    }, GAME_STATE_DELAY); // Pequeño delay para que el servidor procese
  }

  // Actualizar información de jugadores conectados
  updatePlayersInfo(data.players_count);
}

function handleMoveMade(data) {
  console.log("🎯 Movimiento procesado:", data);

  if (data.result?.valid) {
    processValidMove(data);
  } else {
    console.log("❌ Movimiento inválido:", data.result);
    updateMessage(
      `❌ Movimiento inválido: ${data.result?.reason || "Error desconocido"}`,
      ""
    );
  }
}

function processValidMove(data) {
  // Actualizar el tablero con el movimiento
  const move = data.move;
  const playerSymbol = data.player_symbol;

  console.log("📋 Movimiento válido:", {
    column: move.column,
    symbol: playerSymbol,
    result: data.result,
  });

  const row = placePieceOnBoard(move.column, playerSymbol);

  if (row !== -1) {
    updateMoveVisualization(row, move.column, playerSymbol);
  }

  // Actualizar el estado del juego si existe información adicional
  if (data.game_state) {
    processGameStateAfterMove(data.game_state, data.player_id);
  } else {
    // Si no hay game_state, solicitar el estado actualizado
    setTimeout(() => {
      wsClient.getGameState();
    }, MOVE_STATE_DELAY);
  }
}

function placePieceOnBoard(column, playerSymbol) {
  let row = -1;

  for (let r = rows - 1; r >= 0; r--) {
    if (board[r][column] === " ") {
      board[r][column] = playerSymbol;
      row = r;
      break;
    }
  }

  return row;
}

function updateMoveVisualization(row, column, playerSymbol) {
  const tile = document.getElementById(
    row.toString() + "-" + column.toString()
  );
  if (tile) {
    if (playerSymbol === "R") {
      tile.classList.add("red-piece");
    } else if (playerSymbol === "Y") {
      tile.classList.add("yellow-piece");
    }

    // Actualizar currColumns
    currColumns[column] = row - 1;
    moveCount++;
    document.getElementById("moveCount").textContent = moveCount;

    console.log(`✅ Pieza ${playerSymbol} colocada en [${row}][${column}]`);
  }
}

function processGameStateAfterMove(gameState, playerId) {
  if (gameState.winner) {
    handleGameWinner(gameState.winner);
  } else if (gameState.game_over) {
    handleTie();
  } else {
    // Cambiar turno basado en current_player
    const nextPlayer = gameState.current_player;

    let isMyNewTurn = false;
    if (nextPlayer === "R" || nextPlayer === 1) {
      isMyNewTurn = playerColor === "red";
    } else if (nextPlayer === "Y" || nextPlayer === 2) {
      isMyNewTurn = playerColor === "yellow";
    }

    isMyTurn = isMyNewTurn;

    console.log("🔄 Nuevo turno:", {
      nextPlayer: nextPlayer,
      myColor: playerColor,
      isMyTurn: isMyTurn,
    });

    updateTurnMessage();

    // Información adicional de debugging después del movimiento
    console.log("🎯 Análisis del movimiento:", {
      playerWhoMoved: playerId,
      isMyMove: playerId === window.playerId,
      myPlayerId: window.playerId,
      nextPlayerTurn: nextPlayer,
      myColor: playerColor,
      nowMyTurn: isMyTurn,
    });
  }
}

function handleGameRestarted(data) {
  setGame();
  updateMessage("🔄 Juego reiniciado", "");
}

function handleError(data) {
  console.error("💥 Error del servidor:", data.message);
  console.error("📋 Datos completos del error:", data);
  updateMessage(`❌ ${data.message}`, "");

  // Si hay información adicional en el error, mostrarla
  if (data.details) {
    console.error("📋 Detalles del error:", data.details);
  }

  if (data.code) {
    console.error("📋 Código de error:", data.code);
  }
}

function handleGameWinner(winner) {
  console.log("🏆 Juego terminado - Ganador:", winner);
  gameOver = true;

  // Bloquear el tablero
  const boardElement = document.getElementById("board");
  if (boardElement) {
    boardElement.classList.add("board-disabled");
  }

  if (isOnlineMode) {
    handleOnlineGameWinner(winner);
  } else {
    handleOfflineGameWinner(winner);
  }
}

function handleOnlineGameWinner(winner) {
  const didIWin = isWinnerMe(winner);
  let modalTitle, modalMessage, titleClass;

  if (didIWin) {
    modalTitle = "🎉 ¡GANASTE! 🎉";
    modalMessage = `¡Excelente! Has conectado 4 fichas ${getPlayerColorName().toLowerCase()}s y ganaste la partida.`;
    titleClass = "winner";
    updateMessage(
      `🎉 ¡Ganaste con las fichas ${getPlayerColorName().toLowerCase()}s! 🎉`,
      getMyPlayerClass()
    );
  } else {
    modalTitle = "😞 Perdiste";
    modalMessage = `Tu oponente conectó 4 fichas ${getWinnerColorName(
      winner
    ).toLowerCase()}s primero. ¡Inténtalo de nuevo!`;
    titleClass = "loser";
    updateMessage(
      `😞 Perdiste - El oponente ganó con fichas ${getWinnerColorName(
        winner
      ).toLowerCase()}s`,
      getWinnerClass(winner)
    );
  }

  console.log("🎮 Resultado online:", {
    winner,
    myColor: playerColor,
    didIWin,
  });

  showGameEndModal(modalTitle, modalMessage, titleClass);
}

function handleOfflineGameWinner(winner) {
  let modalTitle, modalMessage;

  if (winner === "R") {
    modalTitle = "🎉 ¡Jugador Rojo Gana! 🎉";
    modalMessage = "¡El jugador rojo ha conectado 4 fichas y gana la partida!";
    updateMessage("🎉 ¡Jugador Rojo ha ganado! 🎉", "current-red");
  } else if (winner === "Y") {
    modalTitle = "🎉 ¡Jugador Amarillo Gana! 🎉";
    modalMessage =
      "¡El jugador amarillo ha conectado 4 fichas y gana la partida!";
    updateMessage("🎉 ¡Jugador Amarillo ha ganado! 🎉", "current-yellow");
  }

  showGameEndModal(modalTitle, modalMessage, "winner");
}

function isWinnerMe(winner) {
  return (
    (winner === "R" && playerColor === "red") ||
    (winner === "Y" && playerColor === "yellow")
  );
}

function getPlayerColorName() {
  return playerColor === "red" ? "Rojo" : "Amarillo";
}

function getWinnerColorName(winner) {
  return winner === "R" ? "Rojo" : "Amarillo";
}

function getWinnerClass(winner) {
  return winner === "R" ? "current-red" : "current-yellow";
}

function getMyPlayerClass() {
  return playerColor === "red" ? "current-red" : "current-yellow";
}

function updateBoardFromServer(serverBoard) {
  // Actualizar el tablero local con el estado del servidor
  console.log("🔄 Actualizando tablero desde servidor:", serverBoard);

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      updateBoardCell(r, c, serverBoard[r][c]);
    }
  }

  updateColumnsFromBoard();

  console.log("📋 Tablero local actualizado:", board);
  console.log("📋 Columnas disponibles:", currColumns);
}

function updateBoardCell(row, col, serverValue) {
  const localValue = convertServerValueToLocal(serverValue);
  const currentValue = board[row][col];

  if (localValue !== currentValue) {
    board[row][col] = localValue;
    updateTileVisualization(row, col, localValue);
  }
}

function convertServerValueToLocal(serverValue) {
  if (serverValue === 1 || serverValue === "R") {
    return "R";
  }
  if (serverValue === 2 || serverValue === "Y") {
    return "Y";
  }
  return " "; // Default for 0, null, " ", etc.
}

function updateTileVisualization(row, col, localValue) {
  const tile = document.getElementById(row.toString() + "-" + col.toString());

  if (tile) {
    // Limpiar clases existentes
    tile.classList.remove("red-piece", "yellow-piece");

    // Agregar la clase correspondiente
    if (localValue === "R") {
      tile.classList.add("red-piece");
      console.log(`🔴 Colocando pieza roja en [${row}][${col}]`);
    } else if (localValue === "Y") {
      tile.classList.add("yellow-piece");
      console.log(`🟡 Colocando pieza amarilla en [${row}][${col}]`);
    }
  }
}

function updateColumnsFromBoard() {
  // Actualizar currColumns basado en el tablero del servidor
  for (let c = 0; c < columns; c++) {
    let availableRow = -1;
    for (let r = rows - 1; r >= 0; r--) {
      if (board[r][c] === " ") {
        availableRow = r;
        break;
      }
    }
    currColumns[c] = availableRow;
  }
}

function setGame() {
  board = [];
  currColumns = [...DEFAULT_COLUMNS];
  moveCount = 0;
  gameOver = false;
  winningPositions = [];

  // Rehabilitar el tablero
  const boardElement = document.getElementById("board");
  if (boardElement) {
    boardElement.classList.remove("board-disabled");
    boardElement.innerHTML = "";
  }

  for (let r = 0; r < rows; r++) {
    const row = [];
    for (let c = 0; c < columns; c++) {
      row.push(" ");

      const tile = document.createElement("div");
      tile.id = r.toString() + "-" + c.toString();
      tile.classList.add("tile");
      tile.addEventListener("click", setPiece);
      document.getElementById("board").append(tile);
    }
    board.push(row);
  }

  // Resetear UI
  currPlayer = playerRed;
  if (isOnlineMode) {
    updateMessage("🌐 Conectando al juego online...", "");
  } else {
    updateMessage("🏠 Modo Offline - Turno del Jugador Rojo", "current-red");
  }

  document.getElementById("moveCount").textContent = "0";

  // Ocultar modal si está visible
  hideGameEndModal();

  // Mostrar información del usuario si está disponible
  displayUserInfo();
}

function setPiece() {
  console.log("🎯 setPiece llamado");
  console.log("📊 Estado actual:", {
    gameOver,
    isOnlineMode,
    isMyTurn,
    playerColor,
    playerId,
  });

  if (gameOver) {
    console.log("⚠️ Juego terminado, no se permiten movimientos");
    return;
  }

  // En modo online, verificar si es mi turno
  if (isOnlineMode && !isMyTurn) {
    console.log("⚠️ No es mi turno en modo online");
    console.log("🔍 Detalles del turno:", {
      isOnlineMode,
      isMyTurn,
      playerColor,
      shouldBlock: true,
    });
    updateMessage("⏳ Espera tu turno para jugar", "");
    return;
  }

  let coords = this.id.split("-");
  let c = parseInt(coords[1]);

  console.log("📍 Coordenadas del movimiento:", { coords, column: c });

  // Verificar si la columna está llena
  if (currColumns[c] < 0) {
    console.log("⚠️ Columna llena:", c);
    updateMessage("⚠️ Esta columna está llena, elige otra", "");
    return;
  }

  // En modo online, usar la nueva clase WebSocket
  if (isWebSocketConnected()) {
    console.log("🌐 Enviando movimiento online - columna:", c);
    const success = wsClient.makeMove(c);
    if (!success) {
      updateMessage("❌ No se pudo enviar el movimiento", "");
    }
    return; // El servidor se encargará de actualizar el tablero
  }

  // Modo offline - lógica original
  console.log("🏠 Procesando movimiento offline - columna:", c);
  const r = currColumns[c];
  board[r][c] = currPlayer;
  const tile = document.getElementById(r.toString() + "-" + c.toString());

  if (currPlayer === playerRed) {
    tile.classList.add("red-piece");
    currPlayer = playerYellow;
    updateMessage("🟡 Turno del Jugador Amarillo", "current-yellow");
  } else {
    tile.classList.add("yellow-piece");
    currPlayer = playerRed;
    updateMessage("🔴 Turno del Jugador Rojo", "current-red");
  }

  moveCount++;
  document.getElementById("moveCount").textContent = moveCount;

  currColumns[c] = r - 1;

  if (checkWinner()) {
    return;
  }

  // Verificar empate
  if (moveCount === BOARD_SIZE) {
    handleTie();
  }
}

function updateMessage(text, playerClass) {
  const messageDiv = document.getElementById("message");
  if (messageDiv) {
    messageDiv.innerHTML =
      text + ' <span class="current-player ' + playerClass + '"></span>';
    console.log("📝 Mensaje actualizado:", text, "con clase:", playerClass);
  } else {
    console.warn("⚠️ Elemento #message no encontrado");
  }
}

function checkWinner() {
  return (
    checkHorizontalWin() ||
    checkVerticalWin() ||
    checkDiagonalWin() ||
    checkAntiDiagonalWin()
  );
}

function checkHorizontalWin() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns - WIN_LENGTH + 1; c++) {
      if (board[r][c] !== " " && checkLineWin(r, c, 0, 1)) {
        setWinningLine(r, c, 0, 1);
        setWinner(board[r][c]);
        return true;
      }
    }
  }
  return false;
}

function checkVerticalWin() {
  for (let c = 0; c < columns; c++) {
    for (let r = 0; r < rows - WIN_LENGTH + 1; r++) {
      if (board[r][c] !== " " && checkLineWin(r, c, 1, 0)) {
        setWinningLine(r, c, 1, 0);
        setWinner(board[r][c]);
        return true;
      }
    }
  }
  return false;
}

function checkDiagonalWin() {
  for (let r = WIN_LENGTH - 1; r < rows; r++) {
    for (let c = 0; c < columns - WIN_LENGTH + 1; c++) {
      if (board[r][c] !== " " && checkLineWin(r, c, -1, 1)) {
        setWinningLine(r, c, -1, 1);
        setWinner(board[r][c]);
        return true;
      }
    }
  }
  return false;
}

function checkAntiDiagonalWin() {
  for (let r = 0; r < rows - WIN_LENGTH + 1; r++) {
    for (let c = 0; c < columns - WIN_LENGTH + 1; c++) {
      if (board[r][c] !== " " && checkLineWin(r, c, 1, 1)) {
        setWinningLine(r, c, 1, 1);
        setWinner(board[r][c]);
        return true;
      }
    }
  }
  return false;
}

function checkLineWin(startRow, startCol, deltaRow, deltaCol) {
  const piece = board[startRow][startCol];
  for (let i = 1; i < WIN_LENGTH; i++) {
    const row = startRow + i * deltaRow;
    const col = startCol + i * deltaCol;
    if (board[row][col] !== piece) {
      return false;
    }
  }
  return true;
}

function setWinningLine(startRow, startCol, deltaRow, deltaCol) {
  winningPositions = [];
  for (let i = 0; i < WIN_LENGTH; i++) {
    winningPositions.push([startRow + i * deltaRow, startCol + i * deltaCol]);
  }
}

function setWinner(winner) {
  gameOver = true;

  // Resaltar piezas ganadoras
  winningPositions.forEach((pos) => {
    const tile = document.getElementById(pos[0] + "-" + pos[1]);
    tile.classList.add("winning-piece");
  });

  if (winner === playerRed) {
    updateMessage("🎉 ¡Las fichas rojas han ganado! 🎉", "current-red");
  } else {
    updateMessage("🎉 ¡Las fichas amarillas han ganado! 🎉", "current-yellow");
  }

  // En modo offline, el setWinner se encarga de mostrar el mensaje
  // pero no mostramos botón de reinicio ya que se usa el modal
}

function handleTie() {
  console.log("🤝 Juego terminado en empate");
  gameOver = true;

  // Bloquear el tablero
  const boardElement = document.getElementById("board");
  if (boardElement) {
    boardElement.classList.add("board-disabled");
  }

  updateMessage("💔 ¡Tablero lleno! Ambos jugadores perdieron", "");

  // Resaltar todas las piezas para empate
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      const tile = document.getElementById(r + "-" + c);
      if (board[r][c] !== " ") {
        tile.classList.add("tie-piece");
      }
    }
  }

  // Mostrar modal de empate
  showGameEndModal(
    "💔 ¡Ambos Perdieron!",
    "El tablero se llenó sin que ningún jugador logre conectar 4 fichas. ¡Ambos jugadores han perdido esta partida!",
    "loser"
  );

  // No necesitamos el botón de reinicio ya que usamos el modal
}

function restartGame() {
  // En modo online, usar la nueva clase WebSocket
  if (isWebSocketConnected()) {
    wsClient.restartGame();
    return;
  }

  // Modo offline - reinicio local
  setGame();
}

function getGameState() {
  // Solicitar el estado actual del juego al servidor usando la nueva clase
  if (isWebSocketConnected()) {
    wsClient.getGameState();
  }
}

// Función para cambiar la configuración del juego
function updateGameConfig(newMatchId, newGameType = "connect4") {
  gameConfig.matchId = newMatchId;
  gameConfig.gameType = newGameType;

  console.log("⚙️ Configuración del juego actualizada:", gameConfig);

  // Reconectar con la nueva configuración si está online
  if (isOnlineMode && wsClient) {
    wsClient.disconnect();
    setTimeout(() => {
      initializeWebSocket();
    }, 1000);
  }
}

// Función para mostrar información del usuario en la interfaz
function displayUserInfo() {
  if (userInfo?.user) {
    const userDisplay = document.createElement("div");
    userDisplay.id = "userInfo";
    userDisplay.className = "user-info";
    userDisplay.innerHTML = `
      <div class="user-details">
        <span class="user-email">👤 ${userInfo.user.email}</span>
        <span class="user-role">🎭 ${userInfo.user.role}</span>
      </div>
    `;

    // Insertar después del título
    const title = document.querySelector("h1");
    if (title && !document.getElementById("userInfo")) {
      title.insertAdjacentElement("afterend", userDisplay);
    }
  }
}

// Funciones del Modal de Fin de Juego
function showGameEndModal(title, message, titleClass) {
  const modal = document.getElementById("gameEndModal");
  const modalTitle = document.getElementById("modalTitle");
  const modalMessage = document.getElementById("modalMessage");

  if (modal && modalTitle && modalMessage) {
    modalTitle.textContent = title;
    modalTitle.className = `modal-title ${titleClass}`;
    modalMessage.textContent = message;

    modal.classList.add("show");

    console.log("🎯 Modal mostrado:", { title, message, titleClass });
  }
}

function hideGameEndModal() {
  const modal = document.getElementById("gameEndModal");
  if (modal) {
    modal.classList.remove("show");
  }
}

function goBackToPreviousPage() {
  console.log("🏠 Regresando a la página anterior...");

  // Intentar usar history.back() primero
  if (window.history.length > 1) {
    window.history.back();
  } else {
    // Fallback: ir a la página principal de juegos
    window.location.href = "/";
  }
}

function restartGameFromModal() {
  console.log("🔄 Reiniciando juego desde modal...");

  // Ocultar el modal
  hideGameEndModal();

  // Rehabilitar el tablero
  const board = document.getElementById("board");
  if (board) {
    board.classList.remove("board-disabled");
  }

  // Reiniciar el juego
  if (isWebSocketConnected()) {
    wsClient.restartGame();
  } else {
    setGame();
  }
}

// Asegurar que las funciones del modal estén disponibles globalmente
window.showGameEndModal = showGameEndModal;
window.hideGameEndModal = hideGameEndModal;
window.goBackToPreviousPage = goBackToPreviousPage;
window.restartGameFromModal = restartGameFromModal;
