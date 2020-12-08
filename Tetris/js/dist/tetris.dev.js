"use strict";

// set rows,columns, speed
var BOARD_ROWS = 20;
var BOARD_COLUMNS = 10;
var SIDEBOARD_ROWS = 4;
var SIDEBOARD_COLUMNS = 5;
var SQUARE = 20; //zoom

var VACANT = 'white'; //sfondo bianco

var BORDER = '#43464B'; //Bordo

var START_SPEED = 10;
var SPEED_DECREMENT = 1000;
var canvas = init(BOARD_ROWS, BOARD_COLUMNS, SQUARE);
var bodyElement = document.querySelector('body');
var scoreElement = document.querySelector('#score');
var levelElement = document.querySelector('#level');
var gameoverElement = document.querySelector('#gameover');
var newGameButton = gameoverElement.querySelector('button');
var ctx = canvas.getContext('2d');
document.addEventListener('keydown', handleInput);
newGameButton.addEventListener('click', handleNewGame);

function handleInput(event) {
  // console.log(event) //iterecettare i tasti
  if (!gameOver) {
    if (event.keyCode == 37) {
      p.moveLeft();
      dropStart = Date.now();
    } else if (event.keyCode == 38) {
      p.rotate();
      dropStart = Date.now();
    } else if (event.keyCode == 39) {
      p.moveRight();
      dropStart = Date.now();
    } else if (event.keyCode == 40) {
      p.moveDown();
    }
  }
}

function handleNewGame() {
  runTime = Date.now();
  difficulty = START_SPEED;
  score = 0;
  gameOver = false;
  emptyBoard();
  drawBoard();
  drawSideBoard();
  p = randomPiece();
  nextPiece = randomPiece();
  nextPiece.draw();
  scoreElement.innerHTML = score;
  gameoverElement.classList.add('hide');
  bodyElement.className = '';
  drop();
} // per ogni pezzo set un colore e il pezzo da usare


var pieces = [[Z, '#73956F'], [S, '#00ff00'], [T, '#2E5EAA'], [O, '#8F6593'], [L, '#3D2B56'], [I, '#D72638'], [J, '#FE7F2D'], [C, '#CCAACC']];
var nextPiece;
var p;
var difficulty;
var runTime;
var score = 0;
var board = [];
emptyBoard();

function emptyBoard() {
  for (row = 0; row < BOARD_ROWS; row++) {
    board[row] = [];

    for (col = 0; col < BOARD_COLUMNS; col++) {
      board[row][col] = VACANT;
    }
  }
}

function init(rows, cols, square) {
  var canvas = document.querySelector('#tetris'); //disegno l'area di gioco

  canvas.width = cols * square + (SIDEBOARD_COLUMNS + 2) * square;
  canvas.height = rows * square;
  return canvas;
} // set speed e aumento la difficoltà


function adjustDifficulty(runTime) {
  if (runTime <= 10000) {
    return START_SPEED;
  }

  if (runTime > 10000 && runTime <= 20000) {
    return START_SPEED - SPEED_DECREMENT;
  } else if (runTime > 20000 && runTime <= 30000) {
    return START_SPEED - 2 * SPEED_DECREMENT;
  } else if (runTime > 30000 && runTime <= 40000) {
    return START_SPEED - 3 * SPEED_DECREMENT;
  } else if (runTime > 40000 && runTime <= 50000) {
    return START_SPEED - 4 * SPEED_DECREMENT;
  } else if (runTime > 50000 && runTime <= 60000) {
    return START_SPEED - 5 * SPEED_DECREMENT;
  } else if (runTime > 60000 && runTime <= 70000) {
    return START_SPEED - 6 * SPEED_DECREMENT;
  } else if (runTime > 70000 && runTime <= 80000) {
    return START_SPEED - 7 * SPEED_DECREMENT;
  } else if (runTime > 80000 && runTime <= 100000) {
    return START_SPEED - 8 * SPEED_DECREMENT;
  } else if (runTime > 100000 && runTime <= 110000) {
    return START_SPEED - 9 * SPEED_DECREMENT;
  } else if (runTime >= 110000) {
    return difficulty;
  }
}

function drawSquare(x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x * SQUARE, y * SQUARE, SQUARE, SQUARE);
  ctx.strokeStyle = BORDER;
  ctx.strokeRect(x * SQUARE, y * SQUARE, SQUARE, SQUARE);
}

function drawBoard() {
  for (row = 0; row < BOARD_ROWS; row++) {
    for (col = 0; col < BOARD_COLUMNS; col++) {
      drawSquare(col, row, board[row][col]);
    }
  }
} //sideboard con offset, offset +2 del tetris


function drawSideBoard() {
  var offset = 2;

  for (row = 0; row < SIDEBOARD_ROWS; row++) {
    for (col = BOARD_COLUMNS + offset; col < BOARD_COLUMNS + SIDEBOARD_COLUMNS + offset; col++) {
      drawSquare(col, row, VACANT);
    }
  }
}

drawBoard();
drawSideBoard(); //genero i pezzi casuli

function randomPiece() {
  var random = Math.floor(Math.random() * pieces.length);
  return new Piece(pieces[random][0], pieces[random][1]);
} // il pezzo con colore


function Piece(tetromino, color) {
  this.tetromino = tetromino;
  this.color = color;
  this.tetrominoIndex = 0;
  this.activeTetromino = this.tetromino[this.tetrominoIndex]; // pezzo nel sideboard centrato

  this.x = 13;
  this.y = 1;

  if (this.activeTetromino[0].length > 3) {
    this.x = 12;
    this.y = 0;
  }
}

Piece.prototype.fill = function (color) {
  for (row = 0; row < this.activeTetromino.length; row++) {
    for (col = 0; col < this.activeTetromino.length; col++) {
      if (this.activeTetromino[row][col]) {
        drawSquare(this.x + col, this.y + row, color);
      }
    }
  }
};

Piece.prototype.draw = function () {
  this.fill(this.color);
};

Piece.prototype.clear = function () {
  this.fill(VACANT);
};

Piece.prototype.moveDown = function () {
  // console.log(this.x,this.y) //pezzo che cade,  matrice delle coordinate nel tavolo
  if (!this.collision(0, 1, this.activeTetromino)) {
    this.clear();
    this.y++;
    this.draw();
  } else {
    // blocco il pezzo e creo un nuovo pezzo
    this.lock();
    p = nextPiece;
    p.x = 3;
    p.y = -2;

    if (!gameOver) {
      nextPiece = randomPiece();
      nextPiece.draw();
      difficulty = adjustDifficulty(Date.now() - runTime);
      var level = (START_SPEED - difficulty) / 100;
      levelElement.innerHTML = level;
      bodyElement.classList.add('.level-${level}');
      bodyElement.classList.remove('.level-${level-1}');
    }
  }
}; //move dx


Piece.prototype.moveRight = function () {
  if (!this.collision(1, 0, this.activeTetromino)) {
    this.clear();
    this.x++;
    this.draw();
  }
}; //move sx


Piece.prototype.moveLeft = function () {
  if (!this.collision(-1, 0, this.activeTetromino)) {
    this.clear();
    this.x--;
    this.draw();
  }
}; //ruoto il tetroM


Piece.prototype.rotate = function () {
  var nextIndex = (this.tetrominoIndex + 1) % this.tetromino.length;
  var nextPattern = this.tetromino[nextIndex];
  var kick = 0;

  if (this.collision(0, 0, nextPattern)) {
    if (this.x > BOARD_COLUMNS / 2) {
      kick = -1;
    } else {
      kick = 1;
    }
  }

  if (!this.collision(kick, 0, nextPattern)) {
    this.clear();
    this.x += kick;
    this.tetrominoIndex = nextIndex;
    this.activeTetromino = this.tetromino[this.tetrominoIndex];
    this.draw();
  }
};

Piece.prototype.lock = function () {
  for (row = 0; row < this.activeTetromino.length; row++) {
    for (col = 0; col < this.activeTetromino.length; col++) {
      if (!this.activeTetromino[row][col]) {
        continue;
      }

      if (this.y + row < 0) {
        gameoverElement.classList.remove('hide');
        gameOver = true;
        break;
      }

      board[this.y + row][this.x + col] = this.color;
    }
  }

  for (row = 0; row < BOARD_ROWS; row++) {
    var isRowFull = true;

    for (col = 0; col < BOARD_COLUMNS; col++) {
      isRowFull = isRowFull && board[row][col] != VACANT;
    }

    if (isRowFull) {
      for (y = row; y > 1; y--) {
        for (col = 0; col < BOARD_COLUMNS; col++) {
          board[y][col] = board[y - 1][col];
        }
      }

      for (col = 0; col < BOARD_COLUMNS; col++) {
        board[0][col] = VACANT;
      }

      score += 10;
    }
  }

  drawBoard();
  drawSideBoard();
  scoreElement.innerHTML = score;
}; // gestisco la collisione


Piece.prototype.collision = function (x, y, piece) {
  for (row = 0; row < piece.length; row++) {
    for (col = 0; col < piece.length; col++) {
      if (!piece[row][col]) {
        continue;
      }

      var futureX = this.x + col + x;
      var futureY = this.y + row + y;

      if (futureX < 0 || futureX >= BOARD_COLUMNS || futureY >= BOARD_ROWS) {
        return true;
      }

      if (futureY < 0) {
        continue;
      }

      if (board[futureY][futureX] != VACANT) {
        return true;
      }
    }
  }

  return false;
};

var dropStart = Date.now();
var gameOver = true;

function drop() {
  var now = Date.now();
  var delta = now - dropStart;

  if (delta > difficulty) {
    p.moveDown();
    dropStart = Date.now();
  }

  if (!gameOver) {
    window.requestAnimationFrame(drop); //richiamato e agg. l'animazione prima che il browser esegua il render.
  }
}