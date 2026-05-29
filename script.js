const canvas = document.getElementById("board");
const ctx = canvas.getContext("2d");
const scoreEl = document.getElementById("score");
const messageEl = document.getElementById("message");

const grid = 20;
const tileCount = canvas.width / grid;
const tickIntervalMs = 120;

let snake;
let direction;
let nextDirection;
let food;
let score;
let gameOver;
let loopId;

function spawnFood() {
  const emptyCells = [];

  for (let x = 0; x < tileCount; x += 1) {
    for (let y = 0; y < tileCount; y += 1) {
      if (!snake.some((part) => part.x === x && part.y === y)) {
        emptyCells.push({ x, y });
      }
    }
  }

  if (emptyCells.length === 0) {
    gameOver = true;
    messageEl.textContent = "You win! Press Space to restart.";
    clearInterval(loopId);
    return;
  }

  food = emptyCells[Math.floor(Math.random() * emptyCells.length)];
}

function resetGame() {
  const startCell = Math.floor(tileCount / 2);
  snake = [{ x: startCell, y: startCell }];
  direction = { x: 1, y: 0 };
  nextDirection = direction;
  score = 0;
  gameOver = false;
  scoreEl.textContent = "0";
  messageEl.textContent = "";
  spawnFood();
  clearInterval(loopId);
  loopId = setInterval(step, tickIntervalMs);
}

function drawCell(x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x * grid, y * grid, grid - 1, grid - 1);
}

function draw() {
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  drawCell(food.x, food.y, "#ff4d4d");
  snake.forEach((part, index) => drawCell(part.x, part.y, index === 0 ? "#6cff6c" : "#3cbf3c"));
}

function step() {
  if (gameOver) {
    return;
  }

  direction = nextDirection;
  const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

  const hitWall = head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount;
  const hitSelf = snake.some((part) => part.x === head.x && part.y === head.y);

  if (hitWall || hitSelf) {
    gameOver = true;
    messageEl.textContent = "Game over! Press Space to restart.";
    clearInterval(loopId);
    return;
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score += 1;
    scoreEl.textContent = String(score);
    spawnFood();
  } else {
    snake.pop();
  }

  draw();
}

function setDirection(x, y) {
  if (nextDirection.x === -x && nextDirection.y === -y) {
    return;
  }
  nextDirection = { x, y };
}

document.addEventListener("keydown", (event) => {
  const movementKeys = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];
  if (movementKeys.includes(event.code)) {
    event.preventDefault();
  }

  if (event.code === "Space" && gameOver) {
    resetGame();
    draw();
    return;
  }

  if (event.code === "ArrowUp" || event.code === "KeyW") setDirection(0, -1);
  if (event.code === "ArrowDown" || event.code === "KeyS") setDirection(0, 1);
  if (event.code === "ArrowLeft" || event.code === "KeyA") setDirection(-1, 0);
  if (event.code === "ArrowRight" || event.code === "KeyD") setDirection(1, 0);
});

resetGame();
draw();
