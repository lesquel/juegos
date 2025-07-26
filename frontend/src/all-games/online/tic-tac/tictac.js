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
    case "game_finished_automatically":
      handleGameFinishedAutomatically(data);
      break;
    case "error":
      handleError(data);
      break;
    default:
      console.log("⚠️ Tipo de mensaje no reconocido:", data.type);
  }
}

function handleGameFinishedAutomatically(data) {
  console.log("🏁 Juego finalizado automáticamente:", data);
  
  // Bloquear el tablero
  gameOver = true;
  const boardElement = document.getElementById("board");
  if (boardElement) {
    boardElement.style.pointerEvents = "none";
  }
  
  // Extraer información del resultado
  const winner = data.winner;
  const isTie = data.is_tie;
  const finalScores = data.final_scores || [];
  
  console.log("🏆 Ganador:", winner, "| Empate:", isTie);
  console.log("📊 Puntuaciones finales:", finalScores);
  
  if (isTie) {
    // Manejar empate
    updateMessage("¡Es un empate! 🤝");
    const modalTitle = "🤝 ¡Empate!";
    const modalMessage = "¡Fue una partida muy reñida! Nadie ganó esta vez.";
    showGameEndModal(modalTitle, modalMessage, "tie");
    
    // Resaltar todas las casillas para empate
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        let tile = document.getElementById(r.toString() + "-" + c.toString());
        if (tile) {
          tile.classList.add("tie");
        }
      }
    }
  } else if (winner) {
    // Determinar si el jugador actual ganó o perdió
    const currentPlayerBackendSymbol = getBackendSymbolFromFrontend(playerSymbol);
    const isCurrentPlayerWinner = (winner === currentPlayerBackendSymbol);
    
    console.log("🎯 Comparación de ganador:");
    console.log("  - Ganador del backend:", winner);
    console.log("  - Mi símbolo frontend:", playerSymbol);
    console.log("  - Mi símbolo backend:", currentPlayerBackendSymbol);
    console.log("  - ¿Soy el ganador?:", isCurrentPlayerWinner);
    
    if (isCurrentPlayerWinner) {
      updateMessage(`¡Has ganado! 🎉`);
      const modalTitle = "🎉 ¡Victoria!";
      const modalMessage = "¡Felicidades! Has ganado la partida.";
      showGameEndModal(modalTitle, modalMessage, "victory");
    } else {
      updateMessage(`Has perdido 😔`);
      const modalTitle = "😔 Derrota";
      const modalMessage = "¡Mejor suerte la próxima vez!";
      showGameEndModal(modalTitle, modalMessage, "defeat");
    }
  }
  
  // Desconectar WebSocket después de un breve delay para permitir que se vea el resultado
  setTimeout(() => {
    if (wsClient) {
      console.log("🔌 Desconectando WebSocket después de finalización automática");
      wsClient.disconnect();
    }
  }, 5000); // 5 segundos para que el usuario vea el resultado
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

  console.log("🎯 Determinando turno:", {
    currentPlayerFromServer: currentPlayer,
    myPlayerSymbol: playerSymbol,
    playerId: playerId
  });

  if (currentPlayer === "X" || currentPlayer === 1 || currentPlayer === "R") {
    isCurrentPlayer = playerSymbol === "X";
    console.log("🔴 Turno del jugador X/R:", { isMyTurn: isCurrentPlayer, mySymbol: playerSymbol });
  } else if (currentPlayer === "O" || currentPlayer === 2 || currentPlayer === "Y") {
    isCurrentPlayer = playerSymbol === "O";
    console.log("🟡 Turno del jugador O/Y:", { isMyTurn: isCurrentPlayer, mySymbol: playerSymbol });
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

  // Verificar ganador localmente después de actualizar el tablero
  console.log("🔍 Verificando ganador después del movimiento...");
  if (checkWinner()) {
    console.log("🏆 ¡Ganador detectado localmente!");
    return; // checkWinner() ya maneja el final del juego
  }

  // Verificar empate
  if (moveCount >= 9) {
    console.log("🤝 Empate detectado localmente!");
    handleTie();
    return;
  }

  // Actualizar el estado del juego si existe información adicional
  if (data.game_state) {
    console.log("🎮 Actualizando estado con data.game_state:", data.game_state);
    processGameStateAfterMove(data.game_state, data.player_id);
  } else {
    // Si no hay game_state en la respuesta, solicitar el estado actualizado
    console.log("🔄 No hay game_state en la respuesta, solicitando estado...");
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
  console.log("🎮 Procesando estado después del movimiento:", gameState);
  
  if (gameState.winner) {
    // Mapear ganador
    let mappedWinner = gameState.winner;
    if (gameState.winner === "R") {
      mappedWinner = "X";
    } else if (gameState.winner === "Y") {
      mappedWinner = "O";
    }
    handleGameWinner(mappedWinner);
  } else if (gameState.game_over) {
    handleTie();
  } else {
    // Mapear current_player para determinar turnos
    let mappedCurrentPlayer = gameState.current_player;
    if (gameState.current_player === "R") {
      mappedCurrentPlayer = "X";
    } else if (gameState.current_player === "Y") {
      mappedCurrentPlayer = "O";
    }
    
    console.log("🔄 Actualizando turno después del movimiento:", {
      originalCurrentPlayer: gameState.current_player,
      mappedCurrentPlayer: mappedCurrentPlayer,
      mySymbol: playerSymbol
    });
    
    updateTurnFromGameState(mappedCurrentPlayer);
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
  console.log(`📋 Tablero del servidor: ${serverBoard.length}x${serverBoard[0]?.length || 0}`);

  // SOLUCIÓN: Si el servidor envía un tablero de Connect4 (6x7), extraer solo las primeras 3x3 celdas
  const maxRows = Math.min(3, serverBoard.length);
  const maxCols = Math.min(3, serverBoard[0]?.length || 0);

  console.log(`📋 Procesando tablero: ${maxRows}x${maxCols}`);

  for (let r = 0; r < maxRows; r++) {
    for (let c = 0; c < maxCols; c++) {
      if (serverBoard[r] && serverBoard[r][c] !== undefined) {
        const serverValue = serverBoard[r][c];
        updateBoardCell(r, c, serverValue);
      }
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

function getBackendSymbolFromFrontend(frontendSymbol) {
  // Convertir símbolos del frontend (X/O) a los símbolos del backend (R/Y)
  if (frontendSymbol === "X") {
    return "R";
  }
  if (frontendSymbol === "O") {
    return "Y";
  }
  return frontendSymbol; // Devolver tal como está si no coincide
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
  console.log("🏆 Juego terminado - Ganador local:", winner);
  
  // Bloquear el tablero
  const boardElement = document.getElementById("board");
  if (boardElement) {
    boardElement.style.pointerEvents = "none";
  }

  // En modo online, manejar como victoria online
  if (isOnlineMode) {
    handleOnlineGameWinner(winner);
  } else {
    // En modo offline, mostrar mensaje y modal
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
  console.log("🤝 Juego terminado - Empate");
  
  // Bloquear el tablero
  const boardElement = document.getElementById("board");
  if (boardElement) {
    boardElement.style.pointerEvents = "none";
  }

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

  // En modo online, manejar como empate online
  if (isOnlineMode) {
    handleOnlineGameTie();
  } else {
    // En modo offline, mostrar modal de empate
    showGameEndModal("🤝 ¡Empate!", "¡Un juego muy reñido! Nadie ha ganado esta vez.", "tie");
    
    // En modo offline, reiniciar automáticamente después de 3 segundos
    setTimeout(function () {
      restartGame();
    }, 3000);
  }
}

function handleOnlineGameTie() {
  console.log("🤝 Manejando empate online");
  
  updateMessage("¡Es un empate! 🤝");
  const modalTitle = "🤝 ¡Empate!";
  const modalMessage = "¡Fue una partida muy reñida! Buen juego.";
  showGameEndModal(modalTitle, modalMessage, "tie");
  
  // Desconectar WebSocket después de un breve delay
  setTimeout(() => {
    if (wsClient) {
      wsClient.disconnect();
    }
  }, 3000);
}

function showGameEndModal(title, message, resultType) {
  console.log("📱 Mostrando modal de fin de juego:", title);
  
  // Crear o actualizar modal
  let modal = document.getElementById('gameEndModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'gameEndModal';
    modal.className = 'game-end-modal';
    document.body.appendChild(modal);
  }
  
  // Determinar clase CSS según el tipo de resultado
  let resultClass = '';
  let emoji = '';
  switch(resultType) {
    case 'victory':
      resultClass = 'victory';
      emoji = '🎉';
      break;
    case 'defeat':
      resultClass = 'defeat';
      emoji = '😔';
      break;
    case 'tie':
      resultClass = 'tie';
      emoji = '🤝';
      break;
    case 'winner':
      resultClass = 'winner';
      emoji = '🏆';
      break;
    default:
      resultClass = 'default';
      emoji = '🎮';
  }
  
  modal.innerHTML = `
    <div class="modal-content ${resultClass}">
      <div class="modal-header">
        <h2>${emoji} ${title}</h2>
      </div>
      <div class="modal-body">
        <p>${message}</p>
      </div>
      <div class="modal-footer">
        ${isOnlineMode ? 
          '<button id="backToLobby" class="btn btn-primary">Volver al Lobby</button>' :
          ''
        }
        <button id="goBack" class="btn btn-secondary">Volver</button>
      </div>
    </div>
  `;
  
  modal.style.display = 'flex';
  
  // Agregar event listeners
  const backToLobbyBtn = document.getElementById('backToLobby');
  const goBackBtn = document.getElementById('goBack');
  
  if (backToLobbyBtn) {
    backToLobbyBtn.addEventListener('click', () => {
      modal.style.display = 'none';
      window.location.href = '/all-games/online/';
    });
  }
  
  if (goBackBtn) {
    goBackBtn.addEventListener('click', () => {
      modal.style.display = 'none';
      goBackToPreviousPage();
    });
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
  
  // Agregar estilos CSS para el modal de fin de juego
  if (!document.getElementById('gameEndModalStyles')) {
    const style = document.createElement('style');
    style.id = 'gameEndModalStyles';
    style.textContent = `
      .game-end-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: none;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        backdrop-filter: blur(5px);
      }
      
      .game-end-modal .modal-content {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 20px;
        padding: 30px;
        text-align: center;
        max-width: 400px;
        width: 90%;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        border: 2px solid rgba(255, 255, 255, 0.2);
        animation: modalSlideIn 0.3s ease-out;
      }
      
      .game-end-modal .modal-content.victory {
        background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
      }
      
      .game-end-modal .modal-content.defeat {
        background: linear-gradient(135deg, #f44336 0%, #d32f2f 100%);
      }
      
      .game-end-modal .modal-content.tie {
        background: linear-gradient(135deg, #ff9800 0%, #f57c00 100%);
      }
      
      .game-end-modal .modal-content.winner {
        background: linear-gradient(135deg, #ffd700 0%, #ffa000 100%);
      }
      
      .game-end-modal .modal-header h2 {
        color: white;
        margin: 0 0 20px 0;
        font-size: 2.5em;
        text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
        font-weight: bold;
      }
      
      .game-end-modal .modal-body p {
        color: rgba(255, 255, 255, 0.9);
        font-size: 1.2em;
        margin: 0 0 30px 0;
        line-height: 1.5;
      }
      
      .game-end-modal .modal-footer {
        display: flex;
        gap: 15px;
        justify-content: center;
        flex-wrap: wrap;
      }
      
      .game-end-modal .btn {
        padding: 12px 24px;
        border: none;
        border-radius: 25px;
        font-size: 1em;
        font-weight: bold;
        cursor: pointer;
        transition: all 0.3s ease;
        text-decoration: none;
        display: inline-block;
        min-width: 140px;
      }
      
      .game-end-modal .btn-primary {
        background: linear-gradient(135deg, #2196F3 0%, #1976D2 100%);
        color: white;
        box-shadow: 0 4px 15px rgba(33, 150, 243, 0.3);
      }
      
      .game-end-modal .btn-primary:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(33, 150, 243, 0.4);
      }
      
      .game-end-modal .btn-secondary {
        background: linear-gradient(135deg, #9E9E9E 0%, #757575 100%);
        color: white;
        box-shadow: 0 4px 15px rgba(158, 158, 158, 0.3);
      }
      
      .game-end-modal .btn-secondary:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(158, 158, 158, 0.4);
      }
      
      @keyframes modalSlideIn {
        from {
          opacity: 0;
          transform: scale(0.7) translateY(-50px);
        }
        to {
          opacity: 1;
          transform: scale(1) translateY(0);
        }
      }
      
      @media (max-width: 768px) {
        .game-end-modal .modal-content {
          padding: 20px;
          margin: 20px;
        }
        
        .game-end-modal .modal-header h2 {
          font-size: 2em;
        }
        
        .game-end-modal .modal-footer {
          flex-direction: column;
          align-items: center;
        }
        
        .game-end-modal .btn {
          width: 100%;
          max-width: 200px;
        }
      }
    `;
    document.head.appendChild(style);
  }
});
