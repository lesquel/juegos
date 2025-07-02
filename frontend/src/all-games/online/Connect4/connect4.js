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

window.onload = function () {
  setGame();
};

function setGame() {
  board = [];
  currColumns = [5, 5, 5, 5, 5, 5, 5];
  moveCount = 0;
  gameOver = false;
  winningPositions = [];

  // Limpiar el tablero
  document.getElementById("board").innerHTML = "";

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
  updateMessage("Turno del Jugador Rojo", "current-red");
  document.getElementById("restartBtn").style.display = "none";
  document.getElementById("moveCount").textContent = "0";
}

function setPiece() {
  if (gameOver) {
    return;
  }

  let coords = this.id.split("-");
  let r = parseInt(coords[0]);
  let c = parseInt(coords[1]);

  r = currColumns[c];
  if (r < 0) {
    return;
  }

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
  messageDiv.innerHTML =
    text + ' <span class="current-player ' + playerClass + '"></span>';
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
  gameOver = true;
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

  document.getElementById("restartBtn").style.display = "inline-block";

  // Reiniciar automáticamente después de 4 segundos
  setTimeout(function () {
    restartGame();
  }, 4000);
}

function restartGame() {
  setGame();
}
