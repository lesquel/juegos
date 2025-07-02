var board;
var playerO = "O";
var playerX = "X";
var currPlayer = playerO;
var gameOver = false;
var moveCount = 0;

window.onload = function () {
  setGame();
};

function setGame() {
  board = [
    [" ", " ", " "],
    [" ", " ", " "],
    [" ", " ", " "],
  ];

  // Limpiar el tablero
  document.getElementById("board").innerHTML = "";

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
  document.getElementById("message").innerText = "Jugador O comienza";
  document.getElementById("restartBtn").style.display = "none";
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
    document.getElementById("message").innerText = "Turno del Jugador X";
  } else {
    currPlayer = playerO;
    document.getElementById("message").innerText = "Turno del Jugador O";
  }
}

function checkWinner() {
  // Verificar filas
  for (let r = 0; r < 3; r++) {
    if (
      board[r][0] == board[r][1] &&
      board[r][1] == board[r][2] &&
      board[r][0] != " "
    ) {
      for (let i = 0; i < 3; i++) {
        let tile = document.getElementById(r.toString() + "-" + i.toString());
        tile.classList.add("winner");
      }
      handleWin(board[r][0]);
      return true;
    }
  }

  // Verificar columnas
  for (let c = 0; c < 3; c++) {
    if (
      board[0][c] == board[1][c] &&
      board[1][c] == board[2][c] &&
      board[0][c] != " "
    ) {
      for (let i = 0; i < 3; i++) {
        let tile = document.getElementById(i.toString() + "-" + c.toString());
        tile.classList.add("winner");
      }
      handleWin(board[0][c]);
      return true;
    }
  }

  // Verificar diagonal principal
  if (
    board[0][0] == board[1][1] &&
    board[1][1] == board[2][2] &&
    board[0][0] != " "
  ) {
    for (let i = 0; i < 3; i++) {
      let tile = document.getElementById(i.toString() + "-" + i.toString());
      tile.classList.add("winner");
    }
    handleWin(board[0][0]);
    return true;
  }

  // Verificar diagonal secundaria
  if (
    board[0][2] == board[1][1] &&
    board[1][1] == board[2][0] &&
    board[0][2] != " "
  ) {
    let tile = document.getElementById("0-2");
    tile.classList.add("winner");
    tile = document.getElementById("1-1");
    tile.classList.add("winner");
    tile = document.getElementById("2-0");
    tile.classList.add("winner");

    handleWin(board[0][2]);
    return true;
  }

  return false;
}

function handleWin(winner) {
  gameOver = true;
  document.getElementById(
    "message"
  ).innerText = `¡Jugador ${winner} ha ganado! 🎉`;
  document.getElementById("restartBtn").style.display = "inline-block";

  // Reiniciar automáticamente después de 3 segundos
  setTimeout(function () {
    restartGame();
  }, 3000);
}

function handleTie() {
  gameOver = true;
  document.getElementById("message").innerText = "¡Es un empate! 🤝";

  // Resaltar todas las casillas para empate
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      let tile = document.getElementById(r.toString() + "-" + c.toString());
      tile.classList.add("tie");
    }
  }

  document.getElementById("restartBtn").style.display = "inline-block";

  // Reiniciar automáticamente después de 3 segundos
  setTimeout(function () {
    restartGame();
  }, 3000);
}

function restartGame() {
  setGame();
}

document.addEventListener("DOMContentLoaded", function () {
  setGame();
});

