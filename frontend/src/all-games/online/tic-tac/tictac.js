// Variables del juego
let board;
const playerO = "O";
const playerX = "X";
let currPlayer = playerO;
let gameOver = false;
let moveCount = 0;
let winningPositions = [];

// Variables WebSocket
let socket = null;
let playerId = null;
let playerSymbol = null; // "O" o "X"
let isMyTurn = false;
let isOnlineMode = false;
let userInfo = null;
const params = new URLSearchParams(window.location.search);
let gameConfig = {
  matchId: params.get("match_id"),
  gameType: "tictactoe",
};

// Constantes
const WEBSOCKET_URL = "ws://localhost:8000/ws/games";
const MAX_RETRIES = 3;
const RECONNECT_DELAY = 3000;
const GAME_STATE_DELAY = 500;
const MOVE_STATE_DELAY = 200;

// Configuración de fallback
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

class TicTacWebSocketClient {
  constructor() {
    this.ws = null;
    this.isConnected = false;
    this.reconnectAttempts = 0;
    this.matchId = null;
    this.token = null;
    this.playerId = null;
  }

  connect(matchId, token, playerId) {
    this.matchId = matchId;
    this.token = token;
    this.playerId = playerId;

    console.log("🔌 Conectando WebSocket para Tic-Tac-Toe...", {
      matchId,
      playerId,
      url: WEBSOCKET_URL,
    });

    try {
      // Incluir el matchId en la URL del WebSocket como requiere el backend
      const wsUrl = `${WEBSOCKET_URL}/${matchId}?token=${encodeURIComponent(token)}`;
      console.log("🌐 URL del WebSocket:", wsUrl);
      this.ws = new WebSocket(wsUrl);
      this.setupEventHandlers();
    } catch (error) {
      console.error("❌ Error al crear WebSocket:", error);
      this.handleConnectionError();
    }
  }

  setupEventHandlers() {
    this.ws.onopen = () => {
      console.log("✅ WebSocket conectado para Tic-Tac-Toe");
      this.isConnected = true;
      this.reconnectAttempts = 0;
      updateConnectionStatus("connected", "🟢 Conectado");
      this.joinGame();
    };

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        this.handleMessage(data);
      } catch (error) {
        console.error("❌ Error al parsear mensaje:", error);
      }
    };

    this.ws.onclose = (event) => {
      console.log("🔌 WebSocket cerrado:", event);
      this.isConnected = false;
      isMyTurn = false;
      updateConnectionStatus("disconnected", "🔴 Desconectado");
      
      if (!event.wasClean && this.reconnectAttempts < MAX_RETRIES) {
        this.handleConnectionError();
      }
    };

    this.ws.onerror = (error) => {
      console.error("❌ Error de WebSocket:", error);
      this.handleConnectionError();
    };
  }

  joinGame() {
    if (!this.isConnected) return;

    const joinMessage = {
      type: "join_game",
      match_id: this.matchId,
      game_type: "tictactoe",
      player_id: this.playerId,
    };

    console.log("🚪 Uniéndose al juego:", joinMessage);
    this.sendMessage(joinMessage);
  }

  makeMove(row, col) {
    if (!this.isConnected || !isMyTurn) {
      console.log("❌ No se puede mover:", { connected: this.isConnected, myTurn: isMyTurn });
      return false;
    }

    const moveMessage = {
      type: "make_move",
      match_id: this.matchId,
      game_type: "tictactoe",
      move: {
        row: row,
        column: col,  // Cambiar 'col' a 'column' para que coincida con el backend
      },
      player_id: this.playerId,
    };

    console.log("🎯 Enviando movimiento:", moveMessage);
    this.sendMessage(moveMessage);
    return true;
  }

  sendMessage(message) {
    if (this.isConnected && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      console.error("❌ No se puede enviar mensaje: WebSocket no conectado");
    }
  }

  handleMessage(data) {
    console.log("📨 Mensaje recibido:", data);
    handleWebSocketMessage(data);
  }

  handleConnectionError() {
    this.isConnected = false;
    this.reconnectAttempts++;

    if (this.reconnectAttempts <= MAX_RETRIES) {
      console.log(`🔄 Reintentando conexión... (${this.reconnectAttempts}/${MAX_RETRIES})`);
      updateConnectionStatus("reconnecting", "🟡 Reconectando...");
      
      setTimeout(() => {
        this.connect(this.matchId, this.token, this.playerId);
      }, RECONNECT_DELAY);
    } else {
      console.error("❌ Máximo de reintentos alcanzado");
      updateConnectionStatus("error", "❌ Error de conexión");
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.isConnected = false;
  }

  restartGame() {
    if (this.isConnected) {
      const restartMessage = {
        type: "restart_game",
        match_id: this.matchId,
        game_type: "tictactoe",
        player_id: this.playerId,
      };
      this.sendMessage(restartMessage);
    }
  }
}

// Helper function to check if WebSocket is connected
function isWebSocketConnected() {
  return isOnlineMode && wsClient?.isConnected;
}

let wsClient = new TicTacWebSocketClient();

window.onload = function () {
  console.log("🚀 Iniciando aplicación Tic-Tac-Toe...");
  extractUserInfo();
  initializeWebSocket();
  setGame();
};

function extractUserInfo() {
  console.log("🔍 Extrayendo información del usuario desde localStorage...");

  try {
    const authData = getAuthDataFromStorage();
    if (authData && extractFromAuthData(authData)) {
      return true;
    }

    const userCookie = getAuthDataFromCookies();
    if (userCookie && extractFromCookieData(userCookie)) {
      return true;
    }

    return useFallbackAuth();
  } catch (error) {
    console.error("❌ Error al extraer información del usuario:", error);
    return useFallbackAuth();
  }
}

function getAuthDataFromStorage() {
  const authStorage = localStorage.getItem("auth-storage");
  if (!authStorage) {
    console.log("⚠️ No se encontró auth-storage en localStorage");
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

  // Extraer el user_id del token JWT para asegurar coherencia
  const tokenUserId = extractUserIdFromToken(
    userInfo.access_token.access_token
  );

  if (tokenUserId) {
    playerId = tokenUserId;
    console.log("✅ User ID extraído del token JWT:", playerId);
  } else {
    playerId = userInfo.user.user_id;
    console.log("⚠️ Usando user_id del objeto user:", playerId);
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
    if (name === "user") {
      userCookie = decodeURIComponent(value);
      console.log("✅ Cookie de usuario encontrada");
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
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload));
    return decoded.sub || decoded.user_id || null;
  } catch (error) {
    console.error("❌ Error al decodificar token JWT:", error);
    return null;
  }
}

function initializeWebSocket() {
  // Verificar que tenemos la información del usuario
  if (!userInfo?.access_token?.access_token) {
    console.log("⚠️ No hay token disponible, modo offline");
    isOnlineMode = false;
    updateConnectionStatus("offline", "🔴 Modo Offline");
    return;
  }

  console.log("🌐 Inicializando WebSocket para Tic-Tac-Toe");

  if (gameConfig.matchId) {
    isOnlineMode = true;
    wsClient.connect(
      gameConfig.matchId,
      userInfo.access_token.access_token,
      userInfo.user.user_id
    );
    socket = wsClient.ws;
  } else {
    console.log("⚠️ No hay match_id, modo offline");
    isOnlineMode = false;
    updateConnectionStatus("offline", "🔴 Modo Offline");
  }
}

function handleWebSocketMessage(data) {
  console.log("🔄 Procesando mensaje del tipo:", data.type);

  switch (data.type) {
    case "game_state":
      handleGameState(data);
      break;
    case "player_joined":
      handlePlayerJoined(data);
      break;
    case "move_made":
      handleMoveMade(data);
      break;
    case "game_restarted":
      handleGameRestarted(data);
      break;
    case "error":
      handleError(data);
      break;
    default:
      console.log("⚠️ Tipo de mensaje no reconocido:", data.type);
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

  // Determinar mi símbolo basado en el mapping de jugadores
  // El backend está enviando "R" y "Y" desde Connect4, mapeamos a "X" y "O"
  if (playersMapping?.[playerId]) {
    const backendSymbol = playersMapping[playerId];
    if (backendSymbol === "R") {
      playerSymbol = "X"; // Primer jugador es X
    } else if (backendSymbol === "Y") {
      playerSymbol = "O"; // Segundo jugador es O
    } else {
      // Si el backend envía números
      playerSymbol = backendSymbol === 1 ? "X" : "O";
    }
    console.log("🎮 Mi símbolo asignado:", playerSymbol, "(mapeado desde", backendSymbol, ")");
  }

  // Determinar el estado del juego
  if (gameStateData.game_over) {
    console.log("🏆 Juego terminado");
    if (gameStateData.winner) {
      // Mapear el ganador del backend también
      let mappedWinner = gameStateData.winner;
      if (gameStateData.winner === "R") {
        mappedWinner = "X";
      } else if (gameStateData.winner === "Y") {
        mappedWinner = "O";
      }
      handleGameWinner(mappedWinner);
    }
    return;
  }

  // El juego está en progreso
  console.log("🎮 Estado: Jugando (2 jugadores conectados)");
  updateConnectionStatus("connected", "🟢 En juego");

  // Para Tic-Tac-Toe, el backend ahora envía el tablero correctamente
  if (gameStateData.board) {
    console.log("📋 Actualizando tablero desde servidor");
    updateBoardFromServer(gameStateData.board);
  }

  // Determinar de quién es el turno
  // Mapear "R" -> "X", "Y" -> "O"
  let mappedCurrentPlayer = gameStateData.current_player;
  if (gameStateData.current_player === "R") {
    mappedCurrentPlayer = "X";
  } else if (gameStateData.current_player === "Y") {
    mappedCurrentPlayer = "O";
  }
  
  updateTurnFromGameState(mappedCurrentPlayer);
  updateTurnMessage();
  updatePlayersInfo(2);
}

function handleOriginalFormatGameState(data) {
  console.log("📋 Formato original detectado");
  console.log("📋 Player ID asignado:", data.player_id);
  console.log("📋 Símbolo del jugador:", data.player_symbol || data.player_color);
  console.log("📋 Estado del juego:", data.state);

  playerId = data.player_id;
  
  // Mapear símbolos del backend a Tic-Tac-Toe
  const backendSymbol = data.player_symbol || data.player_color;
  if (backendSymbol === "R" || backendSymbol === "red") {
    playerSymbol = "X";
  } else if (backendSymbol === "Y" || backendSymbol === "yellow") {
    playerSymbol = "O";
  } else {
    playerSymbol = backendSymbol; // Usar tal como viene si ya es X o O
  }
  
  console.log("🎮 Símbolo mapeado:", playerSymbol);

  if (data.state === "waiting_for_players") {
    handleWaitingState();
  } else if (data.state === "playing") {
    handlePlayingState(data);
  }

  if (data.winner) {
    // Mapear el ganador también
    let mappedWinner = data.winner;
    if (data.winner === "R") {
      mappedWinner = "X";
    } else if (data.winner === "Y") {
      mappedWinner = "O";
    }
    handleGameWinner(mappedWinner);
  }
}

function handleWaitingState() {
  console.log("⏳ Estado: Esperando jugadores");
  updateMessage("⏳ Esperando que se una otro jugador...");
  updateConnectionStatus("waiting", "🟡 Esperando jugadores");
  isMyTurn = false;
}

function handlePlayingState(data) {
  console.log("🎮 Estado: Jugando");
  updateConnectionStatus("connected", "🟢 En juego");

  // Actualizar el tablero si existe
  if (data.board) {
    updateBoardFromServer(data.board);
  }

  updateTurnFromGameState(data.current_player);
  updateTurnMessage();
  updatePlayersInfo(2);
}

function updateTurnFromGameState(currentPlayer) {
  // Determinar de quién es el turno basado en current_player
  let isCurrentPlayer = false;

  if (currentPlayer === "X" || currentPlayer === 1) {
    isCurrentPlayer = playerSymbol === "X";
  } else if (currentPlayer === "O" || currentPlayer === 2) {
    isCurrentPlayer = playerSymbol === "O";
  }

  isMyTurn = isCurrentPlayer;
  console.log("📋 Current player del servidor:", currentPlayer);
  console.log("📋 Mi símbolo:", playerSymbol);
  console.log("📋 Es mi turno:", isMyTurn);
}

function updateTurnMessage() {
  if (isMyTurn) {
    updateMessage(`🎯 Tu turno (${playerSymbol})`, playerSymbol === "X" ? "current-red" : "current-yellow");
  } else if (isOnlineMode) {
    updateMessage(`⏳ Turno del oponente`);
  }

  console.log("💬 Mensaje de turno actualizado:", {
    isMyTurn,
    playerSymbol,
    message: document.getElementById("message")?.textContent || "Sin mensaje",
  });
}

function updatePlayersInfo(playersCount) {
  const playersInfoElement = document.getElementById("playersInfo");
  if (playersInfoElement) {
    playersInfoElement.textContent = `👥 ${playersCount}/2 jugadores`;
  }
}

function updateConnectionStatus(status, message) {
  const statusElement = document.getElementById("connectionStatus");
  if (statusElement) {
    statusElement.textContent = message;
  }
}

function handlePlayerJoined(data) {
  updateMessage("✅ Jugador se unió al juego");
  console.log(
    `Jugador ${data.player_id} se unió. Total: ${data.players_count}`
  );

  // Si ahora hay 2 jugadores, solicitar el estado actualizado del juego
  if (data.players_count === 2) {
    setTimeout(() => {
      if (wsClient.isConnected) {
        wsClient.sendMessage({
          type: "get_game_state",
          match_id: gameConfig.matchId,
          game_type: "tictactoe",
        });
      }
    }, GAME_STATE_DELAY);
  }

  // Actualizar información de jugadores conectados
  updatePlayersInfo(data.players_count);
}

function handleMoveMade(data) {
  console.log("🎯 Movimiento procesado:", data);

  if (data.result?.valid) {
    processValidMove(data);
  } else {
    console.error("❌ Movimiento inválido:", data.result?.reason || "Razón desconocida");
    updateMessage(`❌ ${data.result?.reason || "Movimiento inválido"}`);
  }
}

function processValidMove(data) {
  // Actualizar el tablero con el movimiento
  const move = data.move;
  let symbol = data.player_symbol;
  
  // Mapear símbolo del backend a Tic-Tac-Toe
  if (symbol === "R") {
    symbol = "X";
  } else if (symbol === "Y") {
    symbol = "O";
  }

  console.log("📋 Movimiento válido:", {
    row: move.row,
    column: move.column,
    symbol: symbol,
    original_symbol: data.player_symbol,
    result: data.result,
  });

  // Actualizar el tablero local
  if (board[move.row] && board[move.row][move.column] === " ") {
    board[move.row][move.column] = symbol;
    updateTileVisualization(move.row, move.column, symbol);
    moveCount++;
  }

  // Actualizar el estado del juego si existe información adicional
  if (data.game_state) {
    processGameStateAfterMove(data.game_state, data.player_id);
  } else {
    // Cambiar turno temporalmente hasta recibir el estado actualizado
    setTimeout(() => {
      if (wsClient.isConnected) {
        wsClient.sendMessage({
          type: "get_game_state",
          match_id: gameConfig.matchId,
          game_type: "tictactoe",
        });
      }
    }, MOVE_STATE_DELAY);
  }
}

function updateTileVisualization(row, col, symbol) {
  const tile = document.getElementById(row.toString() + "-" + col.toString());
  if (tile) {
    tile.innerText = symbol;
    tile.classList.add(symbol); // Añadir clase para estilos
  }
}

function processGameStateAfterMove(gameState, playerId) {
  if (gameState.winner) {
    handleGameWinner(gameState.winner);
  } else if (gameState.game_over) {
    handleTie();
  } else {
    updateTurnFromGameState(gameState.current_player);
    updateTurnMessage();
  }
}

function handleGameRestarted(data) {
  setGame();
  updateMessage("🔄 Juego reiniciado");
}

function handleError(data) {
  console.error("💥 Error del servidor:", data.message);
  console.error("📋 Datos completos del error:", data);
  updateMessage(`❌ ${data.message}`);

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
    boardElement.style.pointerEvents = "none";
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
    modalTitle = "🎉 ¡VICTORIA!";
    modalMessage = `¡Felicidades! Has ganado como jugador ${getPlayerSymbolName()}.`;
    titleClass = "winner";
  } else {
    modalTitle = "😔 Derrota";
    modalMessage = `El oponente ha ganado como jugador ${getWinnerSymbolName(winner)}.`;
    titleClass = "loser";
  }

  console.log("🎮 Resultado online:", {
    winner,
    mySymbol: playerSymbol,
    didIWin,
  });

  showGameEndModal(modalTitle, modalMessage, titleClass);
}

function handleOfflineGameWinner(winner) {
  let modalTitle, modalMessage;

  if (winner === "X") {
    modalTitle = "🎉 ¡Jugador X Gana!";
    modalMessage = "¡Felicidades al jugador X por la victoria!";
  } else {
    modalTitle = "🎉 ¡Jugador O Gana!";
    modalMessage = "¡Felicidades al jugador O por la victoria!";
  }

  showGameEndModal(modalTitle, modalMessage, "winner");
}

function isWinnerMe(winner) {
  return (
    (winner === "X" && playerSymbol === "X") ||
    (winner === "O" && playerSymbol === "O")
  );
}

function getPlayerSymbolName() {
  return playerSymbol === "X" ? "X" : "O";
}

function getWinnerSymbolName(winner) {
  return winner === "X" ? "X" : "O";
}

function updateBoardFromServer(serverBoard) {
  // Actualizar el tablero local con el estado del servidor
  console.log("🔄 Actualizando tablero desde servidor:", serverBoard);

  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      const serverValue = serverBoard[r][c];
      updateBoardCell(r, c, serverValue);
    }
  }

  console.log("📋 Tablero local actualizado:", board);
}

function updateBoardCell(row, col, serverValue) {
  const localValue = convertServerValueToLocal(serverValue);
  const currentValue = board[row][col];

  if (localValue !== currentValue) {
    board[row][col] = localValue;
    updateTileVisualization(row, col, localValue);
    console.log(`📋 Celda actualizada [${row}][${col}]: "${currentValue}" -> "${localValue}"`);
  }
}

function convertServerValueToLocal(serverValue) {
  // Convertir símbolos del backend (R/Y) a los símbolos del frontend (X/O)
  if (serverValue === "R" || serverValue === 1 || serverValue === "X") {
    return "X";
  }
  if (serverValue === "Y" || serverValue === 2 || serverValue === "O") {
    return "O";
  }
  return " "; // Default for 0, null, " ", etc.
}

// Eliminar window.onload duplicado - solo usar DOMContentLoaded
function setGame() {
  board = [
    [" ", " ", " "],
    [" ", " ", " "],
    [" ", " ", " "],
  ];

  // Limpiar el tablero
  const boardElement = document.getElementById("board");
  if (boardElement) {
    boardElement.innerHTML = "";
    boardElement.style.pointerEvents = "auto"; // Rehabilitar interacciones
  }

  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      let tile = document.createElement("div");
      tile.id = r.toString() + "-" + c.toString();
      tile.classList.add("tile");
      tile.innerText = "";
      tile.addEventListener("click", setTile);
      document.getElementById("board").appendChild(tile);
    }
  }

  // Resetear variables
  currPlayer = playerO;
  gameOver = false;
  moveCount = 0;
  winningPositions = [];
  
  // Verificar que el elemento mensaje existe
  const messageElement = document.getElementById("message");
  if (messageElement) {
    if (isOnlineMode) {
      messageElement.innerText = "🔗 Modo Online - Esperando conexión...";
    } else {
      messageElement.innerText = "🎮 Jugador O comienza";
    }
  }
  
  // Ocultar botón de reinicio y modal
  const restartBtn = document.getElementById("restartBtn");
  if (restartBtn) {
    restartBtn.style.display = "none";
  }

  hideGameEndModal();
  displayUserInfo();
}

function setTile() {
  if (gameOver) {
    return;
  }

  let coords = this.id.split("-");
  let r = parseInt(coords[0]);
  let c = parseInt(coords[1]);

  if (board[r][c] != " ") {
    return;
  }

  // En modo online, verificar si es mi turno y usar WebSocket
  if (isOnlineMode) {
    if (!isMyTurn) {
      updateMessage("⏳ No es tu turno");
      return;
    }

    // Intentar hacer el movimiento a través del WebSocket
    if (wsClient.makeMove(r, c)) {
      // El movimiento se envió, esperar respuesta del servidor
      console.log("📤 Movimiento enviado al servidor");
    } else {
      updateMessage("❌ Error de conexión");
    }
    return;
  }

  // Modo offline - lógica original
  board[r][c] = currPlayer;
  this.innerText = currPlayer;
  this.classList.add(currPlayer); // Añadir clase para estilos
  moveCount++;

  // Verificar ganador
  if (checkWinner()) {
    return;
  }

  // Verificar empate
  if (moveCount === 9) {
    handleTie();
    return;
  }

  // Cambiar jugador
  if (currPlayer == playerO) {
    currPlayer = playerX;
    updateMessage("Turno del Jugador X");
  } else {
    currPlayer = playerO;
    updateMessage("Turno del Jugador O");
  }
}

// Función helper para actualizar mensajes de forma segura
function updateMessage(text, playerClass) {
  const messageElement = document.getElementById("message");
  if (messageElement) {
    messageElement.innerText = text;
    
    // Limpiar clases anteriores
    messageElement.classList.remove("current-red", "current-yellow");
    
    // Añadir nueva clase si se proporciona
    if (playerClass) {
      messageElement.classList.add(playerClass);
    }
  }
}

function checkWinner() {
  // Verificar filas
  for (let r = 0; r < 3; r++) {
    if (checkLine(board[r][0], board[r][1], board[r][2])) {
      highlightWinningLine([[r, 0], [r, 1], [r, 2]]);
      handleWin(board[r][0]);
      return true;
    }
  }

  // Verificar columnas
  for (let c = 0; c < 3; c++) {
    if (checkLine(board[0][c], board[1][c], board[2][c])) {
      highlightWinningLine([[0, c], [1, c], [2, c]]);
      handleWin(board[0][c]);
      return true;
    }
  }

  // Verificar diagonal principal
  if (checkLine(board[0][0], board[1][1], board[2][2])) {
    highlightWinningLine([[0, 0], [1, 1], [2, 2]]);
    handleWin(board[0][0]);
    return true;
  }

  // Verificar diagonal secundaria
  if (checkLine(board[0][2], board[1][1], board[2][0])) {
    highlightWinningLine([[0, 2], [1, 1], [2, 0]]);
    handleWin(board[0][2]);
    return true;
  }

  return false;
}

// Función helper para verificar si tres casillas forman una línea ganadora
function checkLine(a, b, c) {
  return a === b && b === c && a !== " ";
}

// Función helper para resaltar la línea ganadora
function highlightWinningLine(positions) {
  winningPositions = positions;
  positions.forEach(([r, c]) => {
    const tile = document.getElementById(r.toString() + "-" + c.toString());
    if (tile) {
      tile.classList.add("winner");
    }
  });
}

function handleWin(winner) {
  gameOver = true;
  
  // En modo offline, mostrar mensaje y modal
  if (!isOnlineMode) {
    updateMessage(`¡Jugador ${winner} ha ganado! 🎉`);
    
    const modalTitle = `🎉 ¡Jugador ${winner} Gana!`;
    const modalMessage = `¡Felicidades al jugador ${winner} por la victoria!`;
    showGameEndModal(modalTitle, modalMessage, "winner");
  }

  const restartBtn = document.getElementById("restartBtn");
  if (restartBtn) {
    restartBtn.style.display = "inline-block";
  }

  // En modo offline, reiniciar automáticamente después de 3 segundos
  if (!isOnlineMode) {
    setTimeout(function () {
      restartGame();
    }, 3000);
  }
}

function handleTie() {
  gameOver = true;
  updateMessage("¡Es un empate! 🤝");

  // Resaltar todas las casillas para empate
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      let tile = document.getElementById(r.toString() + "-" + c.toString());
      if (tile) {
        tile.classList.add("tie");
      }
    }
  }

  const restartBtn = document.getElementById("restartBtn");
  if (restartBtn) {
    restartBtn.style.display = "inline-block";
  }

  // Mostrar modal de empate
  showGameEndModal("🤝 ¡Empate!", "¡Un juego muy reñido! Nadie ha ganado esta vez.", "tie");

  // En modo offline, reiniciar automáticamente después de 3 segundos
  if (!isOnlineMode) {
    setTimeout(function () {
      restartGame();
    }, 3000);
  }
}

function restartGame() {
  if (isOnlineMode && wsClient.isConnected) {
    wsClient.restartGame();
  } else {
    setGame();
  }
}

// Agregar event listener para el botón de reinicio
function setupEventListeners() {
  const restartBtn = document.getElementById("restartBtn");
  if (restartBtn) {
    restartBtn.addEventListener("click", restartGame);
  }

  const restartFromModal = document.getElementById("restartFromModal");
  if (restartFromModal) {
    restartFromModal.addEventListener("click", restartGameFromModal);
  }

  const goBackBtn = document.getElementById("goBackBtn");
  if (goBackBtn) {
    goBackBtn.addEventListener("click", goBackToPreviousPage);
  }
}

// Función para cambiar la configuración del juego
function updateGameConfig(newMatchId, newGameType = "tictactoe") {
  gameConfig.matchId = newMatchId;
  gameConfig.gameType = newGameType;
  
  console.log("⚙️ Configuración del juego actualizada:", gameConfig);
}

// Función para mostrar información del usuario en la interfaz
function displayUserInfo() {
  const userInfoElement = document.getElementById("userInfo");
  if (userInfoElement && userInfo?.user) {
    const userDisplay = userInfo.user.email || userInfo.user.user_id || "Invitado";
    userInfoElement.textContent = `🎮 ${userDisplay}`;
  }
}

// Funciones del Modal de Fin de Juego
function showGameEndModal(title, message, titleClass) {
  const modal = document.getElementById("gameEndModal");
  const modalTitle = document.getElementById("modalTitle");
  const modalMessage = document.getElementById("modalMessage");

  if (modal && modalTitle && modalMessage) {
    modalTitle.textContent = title;
    modalMessage.textContent = message;
    
    // Limpiar clases anteriores y añadir nueva
    modalTitle.classList.remove("winner", "loser", "tie");
    if (titleClass) {
      modalTitle.classList.add(titleClass);
    }
    
    modal.style.display = "flex";
  }
}

function hideGameEndModal() {
  const modal = document.getElementById("gameEndModal");
  if (modal) {
    modal.style.display = "none";
  }
}

function goBackToPreviousPage() {
  // Desconectar WebSocket si está conectado
  if (wsClient) {
    wsClient.disconnect();
  }
  
  // Volver a la página anterior
  if (window.history.length > 1) {
    window.history.back();
  } else {
    // Si no hay historial, ir a la página principal
    window.location.href = "/";
  }
}

function restartGameFromModal() {
  hideGameEndModal();
  restartGame();
}

// Asegurar que las funciones del modal estén disponibles globalmente
window.showGameEndModal = showGameEndModal;
window.hideGameEndModal = hideGameEndModal;
window.goBackToPreviousPage = goBackToPreviousPage;
window.restartGameFromModal = restartGameFromModal;

// Inicializar el juego cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", function () {
  // No llamar setGame aquí si ya se llama en window.onload
  setupEventListeners();
});
