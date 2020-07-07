// const { dir } = require('console');

window.onload = function () {
  let app = new PIXI.Application({
    width: 500,
    height: 500,
    resolution: window.devicePixelRatio || 1,
  });
  document.body.appendChild(app.view);
  const backgroundTexture = PIXI.Texture.from('assets/backgroundCell.jpg');
  const snakeTexture = PIXI.Texture.from('assets/snakeBody.png');
  const gameBoard = new PIXI.Container();
  const snake = new PIXI.Container();
  app.stage.addChild(gameBoard);
  app.stage.addChild(snake);

  const cellSize = 10,
    width = 50,
    height = 50;
  for (let i = 0; i < width * height; i++) {
    const boardCell = new PIXI.Sprite(backgroundTexture);
    boardCell.width = cellSize;
    boardCell.height = cellSize;
    boardCell.x = (i % width) * cellSize;
    boardCell.y = Math.floor(i / width) * cellSize;
    gameBoard.addChild(boardCell);
  }
  let snakePos = [];
  for (let j = 0; j < 10; j++) {
    let curPos = [];
    curPos[0] = 25;
    curPos[1] = 10 + j;
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
  let direction = 0;
  function moveSnake() {
    for (let i = 0; i < snakePos.length - 1; i++) {
      const snakeCell = snakePos[i];
      snakeCell.x = snakePos[i + 1].x;
      snakeCell.y = snakePos[i + 1].y;
    }
    const snakeCell = snakePos[snakePos.length - 1];
    snakeCell.x =
      (snakeCell.x + directions[direction][1] * cellSize + width * cellSize) %
      (width * cellSize);
    snakeCell.y =
      (snakeCell.y + directions[direction][0] * cellSize + width * cellSize) %
      (width * cellSize);
  }
  function startGame() {
    setInterval(function () {
      moveSnake();
    }, 100);
  }
  startGame();

  document.body.onkeydown = checkKey;
  function checkKey(e) {
    e = e || window.event;
    let cur;
    if (e.keyCode < 37 || e.keyCode > 40) return;
    if (e.keyCode == '37') {
      cur = 2;
    }
    if (e.keyCode == '38') {
      cur = 3;
    }
    if (e.keyCode == '39') {
      cur = 0;
    }
    if (e.keyCode == '40') {
      cur = 1;
    }
    if (direction % 2 != cur % 2) direction = cur;
  }
  // Listen for animate update
  //   app.ticker.add((delta) => {
  //     // rotate the gameBoard!
  //     // use delta to create frame-independent transform
  //     gameBoard.rotation -= 0.01 * delta;
  //   });
};
