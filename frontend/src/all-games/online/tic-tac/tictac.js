var board;
var playerO = "O";
var playerX = "X";
var currPlayer = playerO;
var gameOver = false;
var moveCount = 0;

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
  }

  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      let tile = document.createElement("div");
      tile.id = r.toString() + "-" + c.toString();
      tile.classList.add("tile");
      if (r == 0 || r == 1) {
        tile.classList.add("horizontal-line");
      }
      if (c == 0 || c == 1) {
        tile.classList.add("vertical-line");
      }
      tile.innerText = "";
      tile.addEventListener("click", setTile);
      document.getElementById("board").appendChild(tile);
    }
  }

  // Resetear variables
  currPlayer = playerO;
  gameOver = false;
  moveCount = 0;
  
  // Verificar que el elemento mensaje existe
  const messageElement = document.getElementById("message");
  if (messageElement) {
    messageElement.innerText = "Jugador O comienza";
  }
  
  // Ocultar botón de reinicio
  const restartBtn = document.getElementById("restartBtn");
  if (restartBtn) {
    restartBtn.style.display = "none";
  }
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

  board[r][c] = currPlayer;
  this.innerText = currPlayer;
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
function updateMessage(text) {
  const messageElement = document.getElementById("message");
  if (messageElement) {
    messageElement.innerText = text;
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
  positions.forEach(([r, c]) => {
    const tile = document.getElementById(r.toString() + "-" + c.toString());
    if (tile) {
      tile.classList.add("winner");
    }
  });
}

function handleWin(winner) {
  gameOver = true;
  updateMessage(`¡Jugador ${winner} ha ganado! 🎉`);
  
  const restartBtn = document.getElementById("restartBtn");
  if (restartBtn) {
    restartBtn.style.display = "inline-block";
  }

  // Reiniciar automáticamente después de 3 segundos
  setTimeout(function () {
    restartGame();
  }, 3000);
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

  // Reiniciar automáticamente después de 3 segundos
  setTimeout(function () {
    restartGame();
  }, 3000);
}

function restartGame() {
  setGame();
}

// Agregar event listener para el botón de reinicio
function setupEventListeners() {
  const restartBtn = document.getElementById("restartBtn");
  if (restartBtn) {
    restartBtn.addEventListener("click", restartGame);
  }
}

// Inicializar el juego cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", function () {
  setGame();
  setupEventListeners();
});
