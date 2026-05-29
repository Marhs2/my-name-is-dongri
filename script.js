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

function randomCell() {
  return {
    x: Math.floor(Math.random() * tileCount),
    y: Math.floor(Math.random() * tileCount),
  };
}

function spawnFood() {
  let nextFood = randomCell();
  while (snake.some((part) => part.x === nextFood.x && part.y === nextFood.y)) {
    nextFood = randomCell();
  }
  food = nextFood;
}

function resetGame() {
  snake = [{ x: 10, y: 10 }];
  direction = { x: 1, y: 0 };
  nextDirection = direction;
  score = 0;
  gameOver = false;
  scoreEl.textContent = "0";
  messageEl.textContent = "";
  spawnFood();
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
  if (direction.x === -x && direction.y === -y) {
    return;
  }
  nextDirection = { x, y };
}

document.addEventListener("keydown", (event) => {
  const key = event.key.toLowerCase();

  if (event.code === "Space" && gameOver) {
    resetGame();
    draw();
    return;
  }

  if (key === "arrowup" || key === "w") setDirection(0, -1);
  if (key === "arrowdown" || key === "s") setDirection(0, 1);
  if (key === "arrowleft" || key === "a") setDirection(-1, 0);
  if (key === "arrowright" || key === "d") setDirection(1, 0);
});

resetGame();
draw();
loopId = setInterval(step, tickIntervalMs);
