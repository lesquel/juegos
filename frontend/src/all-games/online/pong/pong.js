// Variables del juego
let board;
let boardWidth;
let boardHeight;
let context;

// Configuración responsiva
function setCanvasSize() {
  const container = document.getElementById("gameContainer");
  const maxWidth = Math.min(window.innerWidth * 0.95, 800);
  const maxHeight = Math.min(window.innerHeight * 0.6, 400);

  boardWidth = maxWidth;
  boardHeight = maxHeight;

  board.width = boardWidth;
  board.height = boardHeight;
}

// Jugadores
let playerWidth = 8;
let playerHeight;

let player1 = {
  x: 15,
  y: 0,
  width: playerWidth,
  height: 0,
  velocityY: 0,
};

let player2 = {
  x: 0,
  y: 0,
  width: playerWidth,
  height: 0,
  velocityY: 0,
};

// Pelota
let ballSize;
let ball = {
  x: 0,
  y: 0,
  width: 0,
  height: 0,
  velocityX: 3,
  velocityY: 2,
};

let player1Score = 0;
let player2Score = 0;
let gameRunning = true;
let maxScore = 5;

// Controles
let keys = {
  p1Up: false,
  p1Down: false,
  p2Up: false,
  p2Down: false,
};

window.onload = function () {
  board = document.getElementById("board");
  context = board.getContext("2d");

  setCanvasSize();
  initializeGame();
  setupControls();

  requestAnimationFrame(update);

  // Redimensionar en cambio de orientación
  window.addEventListener("resize", () => {
    setCanvasSize();
    resetPositions();
  });
};

function initializeGame() {
  // Calcular tamaños basados en el canvas
  playerHeight = boardHeight * 0.15;
  ballSize = Math.min(boardWidth, boardHeight) * 0.02;

  resetPositions();
}

function resetPositions() {
  // Posiciones de jugadores
  player1.y = boardHeight / 2 - playerHeight / 2;
  player1.height = playerHeight;
  player1.x = 15;

  player2.x = boardWidth - playerWidth - 15;
  player2.y = boardHeight / 2 - playerHeight / 2;
  player2.height = playerHeight;

  // Posición de pelota
  ball.x = boardWidth / 2 - ballSize / 2;
  ball.y = boardHeight / 2 - ballSize / 2;
  ball.width = ballSize;
  ball.height = ballSize;
}

function setupControls() {
  // Controles táctiles
  const controls = {
    p1Up: document.getElementById("p1Up"),
    p1Down: document.getElementById("p1Down"),
    p2Up: document.getElementById("p2Up"),
    p2Down: document.getElementById("p2Down"),
  };

  // Eventos táctiles y mouse
  Object.keys(controls).forEach((key) => {
    const btn = controls[key];

    // Touch events
    btn.addEventListener("touchstart", (e) => {
      e.preventDefault();
      keys[key] = true;
    });

    btn.addEventListener("touchend", (e) => {
      e.preventDefault();
      keys[key] = false;
    });

    // Mouse events (para desktop)
    btn.addEventListener("mousedown", () => (keys[key] = true));
    btn.addEventListener("mouseup", () => (keys[key] = false));
    btn.addEventListener("mouseleave", () => (keys[key] = false));
  });

  // Teclado (para desktop)
  document.addEventListener("keydown", (e) => {
    switch (e.code) {
      case "KeyW":
        keys.p1Up = true;
        break;
      case "KeyS":
        keys.p1Down = true;
        break;
      case "ArrowUp":
        keys.p2Up = true;
        break;
      case "ArrowDown":
        keys.p2Down = true;
        break;
    }
  });

  document.addEventListener("keyup", (e) => {
    switch (e.code) {
      case "KeyW":
        keys.p1Up = false;
        break;
      case "KeyS":
        keys.p1Down = false;
        break;
      case "ArrowUp":
        keys.p2Up = false;
        break;
      case "ArrowDown":
        keys.p2Down = false;
        break;
    }
  });
}

function update() {
  if (!gameRunning) return;

  requestAnimationFrame(update);
  context.clearRect(0, 0, boardWidth, boardHeight);

  // Mover jugadores
  updatePlayer(player1, keys.p1Up, keys.p1Down);
  updatePlayer(player2, keys.p2Up, keys.p2Down);

  // Dibujar jugadores
  drawPlayer(player1, "#00ffff");
  drawPlayer(player2, "#ff00ff");

  // Mover y dibujar pelota
  updateBall();
  drawBall();

  // Dibujar línea central
  drawCenterLine();

  // Actualizar puntuaciones
  updateScoreDisplay();
}

function updatePlayer(player, upPressed, downPressed) {
  const speed = boardHeight * 0.01;

  if (upPressed) {
    player.velocityY = -speed;
  } else if (downPressed) {
    player.velocityY = speed;
  } else {
    player.velocityY *= 0.8; // Fricción
  }

  let nextY = player.y + player.velocityY;
  if (nextY >= 0 && nextY + player.height <= boardHeight) {
    player.y = nextY;
  }
}

function drawPlayer(player, color) {
  context.fillStyle = color;
  context.shadowColor = color;
  context.shadowBlur = 10;
  context.fillRect(player.x, player.y, player.width, player.height);
  context.shadowBlur = 0;
}

function updateBall() {
  ball.x += ball.velocityX;
  ball.y += ball.velocityY;

  // Rebote en paredes superior e inferior
  if (ball.y <= 0 || ball.y + ball.height >= boardHeight) {
    ball.velocityY *= -1;
  }

  // Colisiones con jugadores
  if (detectCollision(ball, player1)) {
    if (ball.x <= player1.x + player1.width) {
      ball.velocityX *= -1;
      ball.velocityY += player1.velocityY * 0.1; // Efecto spin
    }
  } else if (detectCollision(ball, player2)) {
    if (ball.x + ball.width >= player2.x) {
      ball.velocityX *= -1;
      ball.velocityY += player2.velocityY * 0.1; // Efecto spin
    }
  }

  // Punto marcado
  if (ball.x < 0) {
    player2Score++;
    resetBall(1);
    checkGameOver();
  } else if (ball.x + ball.width > boardWidth) {
    player1Score++;
    resetBall(-1);
    checkGameOver();
  }
}

function drawBall() {
  context.fillStyle = "#ffffff";
  context.shadowColor = "#ffffff";
  context.shadowBlur = 15;
  context.fillRect(ball.x, ball.y, ball.width, ball.height);
  context.shadowBlur = 0;
}

function drawCenterLine() {
  context.fillStyle = "rgba(255, 255, 255, 0.3)";
  for (let i = 10; i < boardHeight; i += 25) {
    context.fillRect(boardWidth / 2 - 2, i, 4, 15);
  }
}

function detectCollision(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

function resetBall(direction) {
  ball.x = boardWidth / 2 - ball.width / 2;
  ball.y = boardHeight / 2 - ball.height / 2;
  ball.velocityX = direction * 3;
  ball.velocityY = (Math.random() - 0.5) * 4;
}

function updateScoreDisplay() {
  document.getElementById("score1").textContent = player1Score;
  document.getElementById("score2").textContent = player2Score;
}

function checkGameOver() {
  if (player1Score >= maxScore || player2Score >= maxScore) {
    gameRunning = false;
    showGameOver();
  }
}

function showGameOver() {
  const winner = player1Score >= maxScore ? 1 : 2;
  document.getElementById(
    "winnerText"
  ).textContent = `¡Jugador ${winner} Gana! 🎉`;
  document.getElementById(
    "finalScore"
  ).textContent = `Puntuación Final: ${player1Score} - ${player2Score}`;
  document.getElementById("gameOverScreen").classList.add("show");
}

function restartGame() {
  player1Score = 0;
  player2Score = 0;
  gameRunning = true;
  resetPositions();
  resetBall(Math.random() > 0.5 ? 1 : -1);
  document.getElementById("gameOverScreen").classList.remove("show");
  requestAnimationFrame(update);
}
