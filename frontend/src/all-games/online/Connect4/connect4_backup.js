var playerRed = "R";
var playerYellow = "Y";
var currPlayer = playerRed;
var gameOver = false;
var board;
var rows = 6;
var columns = 7;
var currColumns = [];
var moveCount = 0;
var winningPositions = [];

// WebSocket variables
var socket = null;
var playerId = null;
var playerColor = null;
var isMyTurn = false;
var isOnlineMode = false;
var userInfo = null;
const params = new URLSearchParams(window.location.search);
var gameConfig = {
  matchId: params.get("match_id"), // Se p  uede cambiar dinámicamente
  gameType: "connect4",
};

// Clase WebSocket Client mejorada
class GameWebSocketClient {
  constructor() {
    this.ws = null;
    this.matchId = null;
    this.playerId = null;
    this.token = null;
    this.isConnected = false;
    this.connectionAttempts = 0;
    this.maxRetries = 3;
  }

  connect(matchId, token, playerId) {
    this.matchId = matchId;
    this.token = token;
    this.playerId = playerId;
    this.connectionAttempts++;

    // Construir URL con token si está disponible
    let wsUrl = `ws://localhost:8000/ws/games/${matchId}`;
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
      updateConnectionStatusEnhanced("connected", "🟢 Conectado");
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
      updateConnectionStatusEnhanced("disconnected", "🔴 Desconectado");

      // Reintentar conexión si no fue intencional
      if (event.code !== 1000 && this.connectionAttempts < this.maxRetries) {
        setTimeout(() => {
          this.log(
            `🔄 Reintentando conexión (${this.connectionAttempts + 1}/${
              this.maxRetries
            })`
          );
          this.connect(this.matchId, this.token, this.playerId);
        }, 3000);
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
    updateConnectionStatusEnhanced("disconnected", "🔴 Error de conexión");
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

// Instancia global del cliente WebSocket
var wsClient = new GameWebSocketClient();

window.onload = function () {
  console.log("🚀 Iniciando aplicación Connect4...");
  extractUserInfo();
  runDiagnostic(); // Diagnóstico inicial
  initializeWebSocket();
  setGame();
};

function extractUserInfo() {
  console.log("🔍 Extrayendo información del usuario desde localStorage...");

  try {
    // Buscar en localStorage con la key 'auth-storage'
    const authStorage = localStorage.getItem("auth-storage");

    if (authStorage) {
      console.log("✅ auth-storage encontrado en localStorage");
      const authData = JSON.parse(authStorage);
      console.log("📋 Estructura de auth-storage:", authData);

      // Extraer los datos del estado
      if (authData.state && authData.state.user) {
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

          // Actualizar userInfo con el ID correcto del token
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

        return;
      }
    }

    console.log(
      "⚠️ No se encontró auth-storage válido, verificando cookies..."
    );

    // Fallback: buscar en cookies como antes
    const cookies = document.cookie.split(";");
    let userCookie = null;

    console.log("🍪 Cookies disponibles:", cookies);

    for (let cookie of cookies) {
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

    if (userCookie) {
      console.log("📋 Parseando cookie de usuario...");
      userInfo = JSON.parse(userCookie);

      // También extraer user_id del token si hay cookie
      const tokenUserId = extractUserIdFromToken(
        userInfo.access_token?.access_token
      );
      playerId = tokenUserId || userInfo.user.user_id;
      return;
    }

    // Si no se encuentra nada, usar datos fallback
    console.log("⚠️ No se encontraron datos de usuario, usando fallback");
    userInfo = {
      access_token: {
        access_token:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzMzQ3ODY4Zi0yYzcwLTQ5YWYtYjhiZi1lOThhNWE5NDFlNDEiLCJleHAiOjE3NTM0NTQyMzIsImlhdCI6MTc1MzIzODIzMiwidHlwZSI6ImFjY2Vzc190b2tlbiJ9.YRdifdF8JANCFECSNOgHgG76TNAAYAnwaubo1SCAjco",
        token_type: "bearer",
      },
      user: {
        user_id: "3347868f-2c70-49af-b8bf-e98a5a941e41",
        email: "lesquel662@gmail.com",
        role: "user",
      },
    };
    playerId = userInfo.user.user_id;
    console.log("🛡️ Usando datos de fallback");
  } catch (error) {
    console.error("💥 Error al extraer información del usuario:", error);
    // Fallback con datos de ejemplo
    userInfo = {
      access_token: {
        access_token:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzMzQ3ODY4Zi0yYzcwLTQ5YWYtYjhiZi1lOThhNWE5NDFlNDEiLCJleHAiOjE3NTM0NTQyMzIsImlhdCI6MTc1MzIzODIzMiwidHlwZSI6ImFjY2Vzc190b2tlbiJ9.YRdifdF8JANCFECSNOgHgG76TNAAYAnwaubo1SCAjco",
        token_type: "bearer",
      },
      user: {
        user_id: "3347868f-2c70-49af-b8bf-e98a5a941e41",
        email: "lesquel662@gmail.com",
        role: "user",
      },
    };
    playerId = userInfo.user.user_id;
    console.log("🛡️ Usando datos de error fallback");
  }
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
  if (
    !userInfo ||
    !userInfo.access_token ||
    !userInfo.access_token.access_token
  ) {
    console.error(
      "❌ No se pudo obtener la información del usuario o el token"
    );
    console.log("UserInfo disponible:", userInfo);
    updateConnectionStatusEnhanced(
      "disconnected",
      "🔴 Error: Sin autenticación"
    );
    return;
  }

  console.log("� Inicializando WebSocket con nueva clase");

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
  let gameStateData;
  let playersMapping;
  
  if (data.game_state) {
    // Formato nuevo: { type: "game_state", game_state: {...}, players: {...} }
    gameStateData = data.game_state;
    playersMapping = data.players;
    
    console.log("📋 Formato nuevo detectado");
    console.log("📋 Game state data:", gameStateData);
    console.log("📋 Players mapping:", playersMapping);
    
    // Determinar mi color basado en el mapping de jugadores
    if (playersMapping && playersMapping[playerId]) {
      const mySymbol = playersMapping[playerId];
      playerColor = mySymbol === "R" ? "red" : "yellow";
      console.log("📋 Mi símbolo del mapping:", mySymbol, "-> color:", playerColor);
    }
    
    // Determinar el estado del juego
    if (gameStateData.game_over) {
      if (gameStateData.winner) {
        console.log("🏆 Ganador:", gameStateData.winner);
        handleGameWinner(gameStateData.winner);
        return;
      } else {
        handleTie();
        return;
      }
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
    const currentPlayerSymbol = gameStateData.current_player;
    let isCurrentPlayer = false;
    
    if (currentPlayerSymbol === "R") {
      isCurrentPlayer = (playerColor === "red");
    } else if (currentPlayerSymbol === "Y") {
      isCurrentPlayer = (playerColor === "yellow");
    }
    
    isMyTurn = isCurrentPlayer;
    console.log("📋 Current player del servidor:", currentPlayerSymbol);
    console.log("📋 Mi color:", playerColor);
    console.log("📋 Es mi turno:", isMyTurn);
    
    updateTurnMessage();
    updatePlayersInfo(2);
    
  } else {
    // Formato original: campos directos en data
    console.log("📋 Formato original detectado");
    console.log("📋 Player ID asignado:", data.player_id);
    console.log("📋 Color del jugador:", data.player_color);
    console.log("📋 Estado del juego:", data.state);
    
    playerId = data.player_id;
    playerColor = data.player_color;
    
    if (data.state === "waiting_for_players") {
      console.log("⏳ Estado: Esperando jugadores");
      updateMessage("🕐 Esperando a otro jugador...", "");
      updateConnectionStatus("waiting", "🟡 Esperando jugadores");
      isMyTurn = false;
    } else if (data.state === "playing") {
      console.log("🎮 Estado: Jugando");
      updateConnectionStatus("connected", "🟢 En juego");
      
      // Actualizar el tablero si existe
      if (data.board) {
        console.log("📋 Actualizando tablero desde servidor");
        updateBoardFromServer(data.board);
      }
      
      // Determinar de quién es el turno basado en current_player
      let isCurrentPlayer = false;
      
      if (data.current_player === "R" || data.current_player === 1) {
        isCurrentPlayer = (playerColor === "red");
      } else if (data.current_player === "Y" || data.current_player === 2) {
        isCurrentPlayer = (playerColor === "yellow");
      }
      
      isMyTurn = isCurrentPlayer;
      console.log("📋 Current player del servidor:", data.current_player);
      console.log("📋 Mi color:", playerColor);
      console.log("📋 Es mi turno:", isMyTurn);
      
      updateTurnMessage();
      updatePlayersInfo(2);
    }
    
    if (data.winner) {
      console.log("🏆 Ganador:", data.winner);
      handleGameWinner(data.winner);
    }
  }
}

function updateTurnMessage() {
  if (isMyTurn) {
    if (playerColor === "red") {
      updateMessage("🔴 Tu turno - Eres las fichas rojas", "current-red");
    } else {
      updateMessage("🟡 Tu turno - Eres las fichas amarillas", "current-yellow");
    }
  } else {
    if (playerColor === "red") {
      updateMessage("🟡 Turno del oponente", "current-yellow");
    } else {
      updateMessage("🔴 Turno del oponente", "current-red");
    }
  }
  
  console.log("💬 Mensaje de turno actualizado:", {
    isMyTurn,
    playerColor,
    message: document.getElementById("message")?.textContent || "Sin mensaje"
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
  console.log(`Jugador ${data.player_id} se unió. Total: ${data.players_count}`);
  
  // Si ahora hay 2 jugadores, solicitar el estado actualizado del juego
  if (data.players_count === 2) {
    console.log("🎯 Dos jugadores conectados, solicitando estado del juego...");
    setTimeout(() => {
      wsClient.getGameState();
    }, 500); // Pequeño delay para que el servidor procese
  }
  
  // Actualizar información de jugadores conectados
  updatePlayersInfo(data.players_count);
}

function handleMoveMade(data) {
  console.log("🎯 Movimiento procesado:", data);
  
  if (data.result && data.result.valid) {
    // Actualizar el tablero con el movimiento
    const move = data.move;
    const playerSymbol = data.player_symbol;
    
    console.log("📋 Movimiento válido:", {
      column: move.column,
      symbol: playerSymbol,
      result: data.result
    });
    
    // Encontrar la fila donde se colocó la pieza
    const col = move.column;
    let row = -1;
    
    for (let r = rows - 1; r >= 0; r--) {
      if (board[r][col] === " ") {
        board[r][col] = playerSymbol;
        row = r;
        break;
      }
    }
    
    if (row !== -1) {
      // Actualizar la visualización
      const tile = document.getElementById(row.toString() + "-" + col.toString());
      if (tile) {
        if (playerSymbol === "R") {
          tile.classList.add("red-piece");
        } else if (playerSymbol === "Y") {
          tile.classList.add("yellow-piece");
        }
        
        // Actualizar currColumns
        currColumns[col] = row - 1;
        moveCount++;
        document.getElementById("moveCount").textContent = moveCount;
        
        console.log(`✅ Pieza ${playerSymbol} colocada en [${row}][${col}]`);
      }
    }
    
    // Actualizar el estado del juego si existe información adicional
    if (data.game_state) {
      const gameState = data.game_state;
      
      if (gameState.winner) {
        handleGameWinner(gameState.winner);
      } else if (gameState.game_over) {
        handleTie();
      } else {
        // Cambiar turno basado en current_player
        const nextPlayer = gameState.current_player;
        
        let isMyNewTurn = false;
        if (nextPlayer === "R" || nextPlayer === 1) {
          isMyNewTurn = (playerColor === "red");
        } else if (nextPlayer === "Y" || nextPlayer === 2) {
          isMyNewTurn = (playerColor === "yellow");
        }
        
        isMyTurn = isMyNewTurn;
        
        console.log("� Nuevo turno:", {
          nextPlayer: nextPlayer,
          myColor: playerColor,
          isMyTurn: isMyTurn
        });
        
        updateTurnMessage();
        
        // Información adicional de debugging después del movimiento
        console.log("🎯 Análisis del movimiento:", {
          playerWhoMoved: data.player_id,
          isMyMove: data.player_id === playerId,
          myPlayerId: playerId,
          nextPlayerTurn: nextPlayer,
          myColor: playerColor,
          nowMyTurn: isMyTurn
        });
      }
    } else {
      // Si no hay game_state, solicitar el estado actualizado
      setTimeout(() => {
        wsClient.getGameState();
      }, 200);
    }
  } else {
    console.log("❌ Movimiento inválido:", data.result);
    updateMessage(`❌ Movimiento inválido: ${data.result?.reason || 'Error desconocido'}`, "");
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
  const board = document.getElementById("board");
  if (board) {
    board.classList.add("board-disabled");
  }

  // Determinar si el jugador actual ganó o perdió
  let didIWin = false;
  let modalTitle = "";
  let modalMessage = "";
  let titleClass = "";
  
  if (isOnlineMode) {
    // En modo online, determinar si yo gané o perdí
    if (winner === "R" && playerColor === "red") {
      didIWin = true;
    } else if (winner === "Y" && playerColor === "yellow") {
      didIWin = true;
    }
    
    if (didIWin) {
      modalTitle = "🎉 ¡VICTORIA! 🎉";
      modalMessage = `¡Felicidades! Has ganado la partida como jugador ${playerColor === "red" ? "Rojo" : "Amarillo"}.`;
      titleClass = "winner";
      updateMessage("🎉 ¡Has ganado! 🎉", winner === "R" ? "current-red" : "current-yellow");
    } else {
      modalTitle = "😞 Derrota";
      modalMessage = `El jugador ${winner === "R" ? "Rojo" : "Amarillo"} ha ganado esta partida. ¡Mejor suerte la próxima vez!`;
      titleClass = "loser";
      updateMessage("😞 Has perdido", winner === "R" ? "current-red" : "current-yellow");
    }
    
    console.log("🎮 Resultado online:", {
      winner,
      myColor: playerColor,
      didIWin
    });
  } else {
    // Modo offline
    if (winner === "R") {
      modalTitle = "🎉 ¡Jugador Rojo Gana! 🎉";
      modalMessage = "¡El jugador rojo ha conectado 4 fichas y gana la partida!";
      titleClass = "winner";
      updateMessage("🎉 ¡Jugador Rojo ha ganado! 🎉", "current-red");
    } else if (winner === "Y") {
      modalTitle = "🎉 ¡Jugador Amarillo Gana! 🎉";
      modalMessage = "¡El jugador amarillo ha conectado 4 fichas y gana la partida!";
      titleClass = "winner";
      updateMessage("🎉 ¡Jugador Amarillo ha ganado! 🎉", "current-yellow");
    }
  }

  // Mostrar el modal
  showGameEndModal(modalTitle, modalMessage, titleClass);

  // Ocultar el botón de reinicio normal
  document.getElementById("restartBtn").style.display = "none";
}

function updateBoardFromServer(serverBoard) {
  // Actualizar el tablero local con el estado del servidor
  console.log("🔄 Actualizando tablero desde servidor:", serverBoard);
  
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      const serverValue = serverBoard[r][c];
      let localValue = " "; // Valor por defecto
      
      // Convertir los valores del servidor a nuestro formato local
      if (serverValue === 1 || serverValue === "R") {
        localValue = "R";
      } else if (serverValue === 2 || serverValue === "Y") {
        localValue = "Y";
      } else if (serverValue === 0 || serverValue === null || serverValue === " ") {
        localValue = " ";
      }
      
      const currentValue = board[r][c];
      
      if (localValue !== currentValue) {
        board[r][c] = localValue;
        const tile = document.getElementById(r.toString() + "-" + c.toString());
        
        if (tile) {
          // Limpiar clases existentes
          tile.classList.remove("red-piece", "yellow-piece");
          
          // Agregar la clase correspondiente
          if (localValue === "R") {
            tile.classList.add("red-piece");
            console.log(`🔴 Colocando pieza roja en [${r}][${c}]`);
          } else if (localValue === "Y") {
            tile.classList.add("yellow-piece");
            console.log(`🟡 Colocando pieza amarilla en [${r}][${c}]`);
          }
        }
      }
    }
  }
  
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
  
  console.log("📋 Tablero local actualizado:", board);
  console.log("📋 Columnas disponibles:", currColumns);
}

function setGame() {
  board = [];
  currColumns = [5, 5, 5, 5, 5, 5, 5];
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
    let row = [];
    for (let c = 0; c < columns; c++) {
      row.push(" ");

      let tile = document.createElement("div");
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
    updateMessage("🌐 Modo Online - Esperando conexión...", "");
  } else {
    updateMessage("🏠 Modo Offline - Turno del Jugador Rojo", "current-red");
  }

  document.getElementById("restartBtn").style.display = "none";
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
    playerId
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
      shouldBlock: true
    });
    updateMessage("❌ No es tu turno", "");
    return;
  }

  let coords = this.id.split("-");
  let c = parseInt(coords[1]);
  
  console.log("📍 Coordenadas del movimiento:", { coords, column: c });

  // Verificar si la columna está llena
  if (currColumns[c] < 0) {
    console.log("⚠️ Columna llena:", c);
    return;
  }

  // En modo online, usar la nueva clase WebSocket
  if (isOnlineMode && wsClient && wsClient.isConnected) {
    console.log("🌐 Enviando movimiento online - columna:", c);
    const success = wsClient.makeMove(c);
    if (!success) {
      updateMessage("❌ No se pudo enviar el movimiento", "");
    }
    return; // El servidor se encargará de actualizar el tablero
  }

  // Modo offline - lógica original
  console.log("🏠 Procesando movimiento offline - columna:", c);
  let r = currColumns[c];
  board[r][c] = currPlayer;
  let tile = document.getElementById(r.toString() + "-" + c.toString());

  if (currPlayer == playerRed) {
    tile.classList.add("red-piece");
    currPlayer = playerYellow;
    updateMessage("Turno del Jugador Amarillo", "current-yellow");
  } else {
    tile.classList.add("yellow-piece");
    currPlayer = playerRed;
    updateMessage("Turno del Jugador Rojo", "current-red");
  }

  moveCount++;
  document.getElementById("moveCount").textContent = moveCount;

  r -= 1;
  currColumns[c] = r;

  if (checkWinner()) {
    return;
  }

  // Verificar empate
  if (moveCount === 42) {
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
  // Horizontal
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns - 3; c++) {
      if (board[r][c] != " ") {
        if (
          board[r][c] == board[r][c + 1] &&
          board[r][c + 1] == board[r][c + 2] &&
          board[r][c + 2] == board[r][c + 3]
        ) {
          winningPositions = [
            [r, c],
            [r, c + 1],
            [r, c + 2],
            [r, c + 3],
          ];
          setWinner(board[r][c]);
          return true;
        }
      }
    }
  }

  // Vertical
  for (let c = 0; c < columns; c++) {
    for (let r = 0; r < rows - 3; r++) {
      if (board[r][c] != " ") {
        if (
          board[r][c] == board[r + 1][c] &&
          board[r + 1][c] == board[r + 2][c] &&
          board[r + 2][c] == board[r + 3][c]
        ) {
          winningPositions = [
            [r, c],
            [r + 1, c],
            [r + 2, c],
            [r + 3, c],
          ];
          setWinner(board[r][c]);
          return true;
        }
      }
    }
  }

  // Anti diagonal
  for (let r = 0; r < rows - 3; r++) {
    for (let c = 0; c < columns - 3; c++) {
      if (board[r][c] != " ") {
        if (
          board[r][c] == board[r + 1][c + 1] &&
          board[r + 1][c + 1] == board[r + 2][c + 2] &&
          board[r + 2][c + 2] == board[r + 3][c + 3]
        ) {
          winningPositions = [
            [r, c],
            [r + 1, c + 1],
            [r + 2, c + 2],
            [r + 3, c + 3],
          ];
          setWinner(board[r][c]);
          return true;
        }
      }
    }
  }

  // Diagonal
  for (let r = 3; r < rows; r++) {
    for (let c = 0; c < columns - 3; c++) {
      if (board[r][c] != " ") {
        if (
          board[r][c] == board[r - 1][c + 1] &&
          board[r - 1][c + 1] == board[r - 2][c + 2] &&
          board[r - 2][c + 2] == board[r - 3][c + 3]
        ) {
          winningPositions = [
            [r, c],
            [r - 1, c + 1],
            [r - 2, c + 2],
            [r - 3, c + 3],
          ];
          setWinner(board[r][c]);
          return true;
        }
      }
    }
  }

  return false;
}

function setWinner(winner) {
  gameOver = true;

  // Resaltar piezas ganadoras
  winningPositions.forEach((pos) => {
    let tile = document.getElementById(pos[0] + "-" + pos[1]);
    tile.classList.add("winning-piece");
  });

  if (winner == playerRed) {
    updateMessage("🎉 ¡Jugador Rojo ha ganado! 🎉", "current-red");
  } else {
    updateMessage("🎉 ¡Jugador Amarillo ha ganado! 🎉", "current-yellow");
  }

  document.getElementById("restartBtn").style.display = "inline-block";

  // Reiniciar automáticamente después de 4 segundos
  setTimeout(function () {
    restartGame();
  }, 4000);
}

function handleTie() {
  console.log("🤝 Juego terminado en empate");
  gameOver = true;
  
  // Bloquear el tablero
  const board = document.getElementById("board");
  if (board) {
    board.classList.add("board-disabled");
  }
  
  updateMessage("🤝 ¡Es un empate! Tablero lleno 🤝", "");

  // Resaltar todas las piezas para empate
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      let tile = document.getElementById(r + "-" + c);
      if (board[r][c] !== " ") {
        tile.classList.add("tie-piece");
      }
    }
  }

  // Mostrar modal de empate
  showGameEndModal(
    "🤝 ¡Empate!",
    "El tablero está lleno y ningún jugador logró conectar 4 fichas. ¡Fue una partida muy reñida!",
    "winner"
  );

  document.getElementById("restartBtn").style.display = "none";
}

function restartGame() {
  // En modo online, usar la nueva clase WebSocket
  if (isOnlineMode && wsClient && wsClient.isConnected) {
    wsClient.restartGame();
    return;
  }

  // Modo offline - reinicio local
  setGame();
}

function getGameState() {
  // Solicitar el estado actual del juego al servidor usando la nueva clase
  if (isOnlineMode && wsClient && wsClient.isConnected) {
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
  if (isOnlineMode && wsClient && wsClient.isConnected) {
    wsClient.restartGame();
  } else {
    setGame();
  }
}

// Función de diagnóstico para detectar problemas de conexión
function runDiagnostic() {
  console.log("🔍 DIAGNÓSTICO BÁSICO:");
  console.log("1. UserInfo:", userInfo);
  console.log("2. Game config:", gameConfig);
  console.log("3. Is online mode:", isOnlineMode);
  console.log("4. Player ID:", playerId);

  // Para diagnóstico más detallado, usar runAdvancedDiagnostic() después de la conexión
  if (!userInfo) {
    console.error("❌ PROBLEMA: userInfo es null");
  }

  if (!userInfo?.access_token?.access_token) {
    console.error("❌ PROBLEMA: No hay access_token");
  }

  console.log(
    "📡 URL que se usaría:",
    `ws://localhost:8000/ws/games/${gameConfig.matchId}?token=${
      userInfo?.access_token?.access_token || "NO_TOKEN"
    }`
  );
}

// Función para verificar si el servidor está disponible
async function checkServerAvailability() {
  try {
    console.log("🔍 Verificando disponibilidad del servidor...");
    const response = await fetch("http://localhost:8000/health", {
      method: "GET",
      timeout: 5000,
    });

    if (response.ok) {
      console.log("✅ Servidor disponible");
      return true;
    } else {
      console.log("⚠️ Servidor responde pero con error:", response.status);
      return false;
    }
  } catch (error) {
    console.error("❌ Servidor no disponible:", error.message);
    updateMessage("❌ Servidor no disponible. ¿Está ejecutándose?", "");
    return false;
  }
}

// Función mejorada para reconectar
async function reconnectWebSocket() {
  console.log("🔄 Intentando reconectar...");

  // Verificar servidor primero
  const serverAvailable = await checkServerAvailability();
  if (!serverAvailable) {
    updateMessage("❌ No se puede conectar: servidor no disponible", "");
    return;
  }

  if (wsClient) {
    wsClient.disconnect();
  }

  setTimeout(() => {
    initializeWebSocket();
  }, 1000);
}

// Funciones adicionales para la nueva clase WebSocket
function forceReconnect() {
  console.log("🔄 Forzando reconexión...");
  if (wsClient) {
    wsClient.disconnect();
  }
  setTimeout(() => {
    initializeWebSocket();
  }, 500);
}

function getConnectionStatus() {
  return {
    isConnected: wsClient?.isConnected || false,
    isOnlineMode: isOnlineMode,
    playerId: playerId,
    playerColor: playerColor,
    isMyTurn: isMyTurn,
    matchId: gameConfig.matchId,
    wsState: wsClient?.ws?.readyState || "No WebSocket",
  };
}

// Función para debugging mejorada
function runAdvancedDiagnostic() {
  console.log("🔍 DIAGNÓSTICO AVANZADO:");
  console.log("1. UserInfo:", userInfo);
  console.log("2. Game config:", gameConfig);
  console.log("3. Connection status:", getConnectionStatus());
  console.log("4. WebSocket client:", wsClient);

  if (wsClient?.ws) {
    console.log("5. WebSocket URL:", wsClient.ws.url);
    console.log(
      "6. WebSocket state:",
      {
        0: "CONNECTING",
        1: "OPEN",
        2: "CLOSING",
        3: "CLOSED",
      }[wsClient.ws.readyState]
    );
  }

  console.log("7. Token disponible:", !!userInfo?.access_token?.access_token);
  console.log("8. Player ID:", playerId);

  // Test de conectividad
  if (userInfo?.access_token?.access_token) {
    console.log("✅ Token válido encontrado");
  } else {
    console.error("❌ PROBLEMA: No hay token válido");
  }
}

// Función para probar conexión con diferentes configuraciones
function testConnection(customMatchId = null, customToken = null) {
  const testMatchId = customMatchId || gameConfig.matchId;
  const testToken = customToken || userInfo?.access_token?.access_token;
  const testPlayerId = `test_${Date.now()}`;

  console.log("🧪 PROBANDO CONEXIÓN:");
  console.log("Match ID:", testMatchId);
  console.log("Token:", testToken ? "***" + testToken.slice(-10) : "NO TOKEN");
  console.log("Player ID:", testPlayerId);

  if (wsClient) {
    wsClient.disconnect();
  }

  setTimeout(() => {
    wsClient.connect(testMatchId, testToken, testPlayerId);
  }, 500);
}

// Funciones de utilidad adicionales para debugging y control

// Función para limpiar y resetear todo el estado del juego
function resetGameState() {
  console.log("🔄 Reseteando estado completo del juego...");

  // Desconectar WebSocket
  if (wsClient) {
    wsClient.disconnect();
  }

  // Resetear variables globales
  isOnlineMode = false;
  playerId = null;
  playerColor = null;
  isMyTurn = false;

  // Resetear juego visual
  setGame();

  // Actualizar UI
  updateConnectionStatus("disconnected", "🔴 Desconectado");
  updateMessage("🔄 Estado reseteado", "");

  console.log("✅ Estado reseteado completamente");
}

// Función para obtener información detallada del tablero
function getBoardInfo() {
  console.log("📋 INFORMACIÓN DEL TABLERO:");
  console.log("Tablero actual:", board);
  console.log("Columnas disponibles:", currColumns);
  console.log("Movimientos realizados:", moveCount);
  console.log("Juego terminado:", gameOver);
  console.log("Posiciones ganadoras:", winningPositions);

  if (isOnlineMode) {
    console.log("Modo:", "Online");
    console.log("Es mi turno:", isMyTurn);
    console.log("Color del jugador:", playerColor);
  } else {
    console.log("Modo:", "Offline");
    console.log("Jugador actual:", currPlayer);
  }
}

// Función para simular datos de usuario de prueba
function setTestUser() {
  userInfo = {
    access_token: {
      access_token: `test_token_${Date.now()}`,
    },
    user: {
      user_id: `test_user_${Math.random().toString(36).substr(2, 9)}`,
      email: `test${Math.floor(Math.random() * 1000)}@example.com`,
      role: "user",
    },
  };

  playerId = userInfo.user.user_id;
  console.log("🧪 Usuario de prueba configurado:", userInfo.user);
  displayUserInfo();
}

// Función para configurar usuario desde localStorage actual
function loadUserFromStorage() {
  console.log("🔄 Recargando usuario desde localStorage...");
  extractUserInfo();
  if (userInfo) {
    console.log("✅ Usuario cargado:", userInfo.user);
    displayUserInfo();
    updateMessage(`👋 Usuario: ${userInfo.user.email}`, "");
  } else {
    console.log("❌ No se pudo cargar usuario desde localStorage");
    updateMessage("❌ No hay datos de usuario en localStorage", "");
  }
}

// Función para mostrar información actual del localStorage
function debugLocalStorage() {
  console.log("🔍 DEBUGGING LOCALSTORAGE:");

  const authStorage = localStorage.getItem("auth-storage");
  console.log("1. auth-storage raw:", authStorage);

  if (authStorage) {
    try {
      const parsed = JSON.parse(authStorage);
      console.log("2. auth-storage parsed:", parsed);
      console.log("3. state:", parsed.state);
      console.log("4. user data:", parsed.state?.user);
      console.log("5. access_token:", parsed.state?.user?.access_token);
      console.log("6. user info:", parsed.state?.user?.user);

      // Verificar coherencia del token
      const token = parsed.state?.user?.access_token?.access_token;
      if (token) {
        const tokenUserId = extractUserIdFromToken(token);
        const storageUserId = parsed.state?.user?.user?.user_id;

        console.log("🔍 VERIFICACIÓN DE COHERENCIA:");
        console.log("Token user_id:", tokenUserId);
        console.log("Storage user_id:", storageUserId);

        if (tokenUserId === storageUserId) {
          console.log("✅ IDs coinciden - Todo correcto");
        } else {
          console.warn(
            "⚠️ IDs NO coinciden - Posible problema de autenticación"
          );
          console.warn("Se usará el ID del token:", tokenUserId);
        }
      }
    } catch (e) {
      console.error("Error parsing auth-storage:", e);
    }
  } else {
    console.log("❌ No hay auth-storage en localStorage");
  }

  console.log("7. Todas las keys en localStorage:", Object.keys(localStorage));

  // También mostrar información actual del juego
  console.log("8. Player ID actual:", playerId);
  console.log("9. UserInfo actual:", userInfo);
}

// Función para validar token y mostrar su contenido
function validateAndShowToken(token = null) {
  const tokenToValidate = token || userInfo?.access_token?.access_token;

  if (!tokenToValidate) {
    console.log("❌ No hay token para validar");
    return;
  }

  console.log("🔍 VALIDACIÓN DE TOKEN:");
  console.log("Token completo:", tokenToValidate);

  const userId = extractUserIdFromToken(tokenToValidate);
  if (userId) {
    console.log("✅ Token válido");
    console.log("User ID extraído:", userId);

    // Verificar expiración
    try {
      const parts = tokenToValidate.split(".");
      const payload = JSON.parse(
        atob(parts[1] + "=".repeat((4 - (parts[1].length % 4)) % 4))
      );

      const exp = payload.exp;
      const now = Math.floor(Date.now() / 1000);

      if (exp > now) {
        const timeLeft = exp - now;
        console.log("✅ Token NO expirado");
        console.log("Tiempo restante:", Math.floor(timeLeft / 60), "minutos");
      } else {
        console.log("❌ Token EXPIRADO");
        console.log("Expiró hace:", Math.floor((now - exp) / 60), "minutos");
      }
    } catch (e) {
      console.error("Error al verificar expiración:", e);
    }
  } else {
    console.log("❌ Token inválido");
  }
}

// Funciones globales disponibles para debugging desde la consola
window.connectFour = {
  // Información y diagnóstico
  status: getConnectionStatus,
  diagnose: runAdvancedDiagnostic,
  boardInfo: getBoardInfo,

  // Control de conexión
  connect: initializeWebSocket,
  disconnect: () => wsClient?.disconnect(),
  reconnect: forceReconnect,

  // Control de juego
  restart: restartGame,
  reset: resetGameState,
  getState: getGameState,

  // Testing y debugging
  testConnection: testConnection,
  setTestUser: setTestUser,
  loadUserFromStorage: loadUserFromStorage,
  debugStorage: debugLocalStorage,
  validateToken: validateAndShowToken,

  // Configuración
  config: (matchId) => updateGameConfig(matchId),

  // Referencias internas (solo para debugging)
  _wsClient: () => wsClient,
  _userInfo: () => userInfo,
  _gameConfig: () => gameConfig,
};

console.log("🎮 Connect4 Debug Functions disponibles en window.connectFour");
console.log("Ejemplos:");
console.log("- connectFour.status() // Ver estado de conexión");
console.log("- connectFour.diagnose() // Diagnóstico avanzado");
console.log("- connectFour.reconnect() // Forzar reconexión");
console.log(
  "- connectFour.loadUserFromStorage() // Recargar desde localStorage"
);
console.log("- connectFour.debugStorage() // Debug del localStorage");
console.log("- connectFour.validateToken() // Validar token JWT");
console.log("- connectFour.setTestUser() // Configurar usuario de prueba");

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
  if (isOnlineMode && wsClient && wsClient.isConnected) {
    wsClient.restartGame();
  } else {
    setGame();
  }
}

// Función para alternar el panel de debug en la UI
function toggleDebugPanel() {
  const panel = document.getElementById("debugPanel");
  const button = document.getElementById("toggleDebug");

  if (panel.style.display === "none") {
    panel.style.display = "block";
    button.textContent = "🔧 Ocultar Debug";
    console.log("🔧 Panel de debug mostrado");
  } else {
    panel.style.display = "none";
    button.textContent = "🔧 Mostrar Debug";
    console.log("🔧 Panel de debug ocultado");
  }
}

// Función helper para actualizar el botón de reconexión basado en el estado
function updateReconnectButton() {
  const reconnectBtn = document.getElementById("reconnectBtn");
  if (reconnectBtn) {
    if (isOnlineMode && wsClient?.isConnected) {
      reconnectBtn.textContent = "🔄 Reconectar";
      reconnectBtn.style.opacity = "0.7";
    } else {
      reconnectBtn.textContent = "🔌 Conectar";
      reconnectBtn.style.opacity = "1";
    }
  }
}

// Mejorar la función updateConnectionStatus para actualizar también el botón
function updateConnectionStatusEnhanced(status, message) {
  updateConnectionStatus(status, message);
  updateReconnectButton();
}
