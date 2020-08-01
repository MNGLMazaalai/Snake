let app = new PIXI.Application({
  width: 600,
  height: 600,
  // resolution: window.devicePixelRatio || 1,
});

document.body.appendChild(app.view);
const backgroundTexture = PIXI.Texture.from("assets/backgroundCell.jpg");
const snakeTexture = PIXI.Texture.from("assets/snakeBody.png");
const foodTexture = PIXI.Texture.from("assets/bunny.png");
const gameBoard = new PIXI.Container();
const snake = new PIXI.Container();
app.stage.addChild(gameBoard);
app.stage.addChild(snake);

const cellSize = 20,
  width = app.width / cellSize,
  height = app.height / cellSize;

for (let i = 0; i < width * height; i++) {
  const boardCell = new PIXI.Sprite(backgroundTexture);
  boardCell.width = cellSize;
  boardCell.height = cellSize;
  boardCell.x = (i % width) * cellSize;
  boardCell.y = Math.floor(i / width) * cellSize;
  gameBoard.addChild(boardCell);
}
let snakePos = [];
for (let j = 0; j < 15; j++) {
  let curPos = [];
  curPos[0] = width / 2;
  curPos[1] = height / 5 + j;
  const snakeCell = new PIXI.Sprite(snakeTexture);
  snakeCell.width = cellSize;
  snakeCell.height = cellSize;
  snakeCell.x = curPos[1] * cellSize;
  snakeCell.y = curPos[0] * cellSize;
  snakePos.push(snakeCell);
  gameBoard.addChild(snakeCell);
}
let directions = [
  [0, 1],
  [1, 0],
  [0, -1],
  [-1, 0],
];
let foodPos,
  direction = 0,
  nextCell,
  done = true,
  gameSpd = 1,
  eaten = 0;
let game = startGame();
dropFood();

document.body.onkeydown = checkKey;

function eat(foodPos, x, y) {
  gameBoard.removeChild(foodPos);
  const snakeCell = new PIXI.Sprite(snakeTexture);
  snakeCell.width = cellSize;
  snakeCell.height = cellSize;
  snakeCell.x = x;
  snakeCell.y = y;
  snakePos.push(snakeCell);
  gameBoard.addChild(snakeCell);
  dropFood();
}

function moveSnake() {
  // console.log(snakePos.length);
  const snakeCell = snakePos[snakePos.length - 1];
  let mod = width * cellSize;

  let x = (snakeCell.x + directions[direction][1] * cellSize + mod) % mod;
  let y = (snakeCell.y + directions[direction][0] * cellSize + mod) % mod;
  if (y == foodPos.y && x == foodPos.x) {
    eaten++;
    if (eaten % 2 == 0) {
      clearInterval(game);
      gameSpd += 0.1;
      game = startGame();
    }

    eat(foodPos, x, y);
    done = true;
    return;
  }
  for (let i = 0; i < snakePos.length - 1; i++) {
    const snakeCell = snakePos[i];
    if (snakeCell.x == x && snakeCell.y == y) return die();
  }
  for (let i = 0; i < snakePos.length - 1; i++) {
    const snakeCell = snakePos[i];
    snakeCell.x = snakePos[i + 1].x;
    snakeCell.y = snakePos[i + 1].y;
  }
  snakeCell.x = (snakeCell.x + directions[direction][1] * cellSize + mod) % mod;
  snakeCell.y = (snakeCell.y + directions[direction][0] * cellSize + mod) % mod;
  done = true;
}
function startGame() {
  return setInterval(function () {
    moveSnake();
  }, 100 / gameSpd);
}
function die() {
  alert("Game over!");
  clearInterval(game);
}
function checkKey(e) {
  e = e || window.event;
  let cur;
  if (e.keyCode < 37 || e.keyCode > 40 || !done) return;
  done = false;
  if (e.keyCode == "37") cur = 2;
  if (e.keyCode == "38") cur = 3;
  if (e.keyCode == "39") cur = 0;
  if (e.keyCode == "40") cur = 1;
  if (direction % 2 != cur % 2) direction = cur;
}
function dropFood() {
  let x = Math.floor(Math.random() * width) * cellSize;
  let y = Math.floor(Math.random() * height) * cellSize;
  let empty = true;
  for (let i = 0; i < snakePos.length; i++) {
    const snakeCell = snakePos[i];
    if (x == snakeCell.x && y == snakeCell.y) empty = false;
  }
  if (empty) {
    const food = new PIXI.Sprite(foodTexture);
    food.width = cellSize;
    food.height = cellSize;
    food.x = x;
    food.y = y;
    gameBoard.addChild(food);
    foodPos = food;
  } else dropFood();
}
