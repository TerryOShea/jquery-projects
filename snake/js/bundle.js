/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.l = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };

/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};

/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};

/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

const Board = __webpack_require__(1);

class View{
  constructor($el){
    this.el = $el;
    this.board = new Board($el);
    this.buttonEl = $(".button");
    this.scoreEl = $(".score");
    this.snakeMoves = setInterval(()=> this.step(), 300);
    this.addListeners();
    this.paused = false;
  }

  addListeners() {
    $(document).keydown(e =>{
      e.preventDefault();
      switch(e.which) {
        case 37: // left
          this.board.snake.turn("W");
          break;

        case 38: // up
          this.board.snake.turn("N");
          break;

        case 39: // right
          this.board.snake.turn("E");
          break;

        case 40: // down
          this.board.snake.turn("S");
          break;

        default: return; // exit this handler for other keys
      }
    });

    this.buttonEl.on('click', () => {
      if (!this.paused) {
        clearInterval(this.snakeMoves);
        this.buttonEl.html('<i class="fa fa-play"></i>');
        this.paused = true;
      } else {
        this.snakeMoves = setInterval(()=> this.step(), 300);
        this.buttonEl.html('<i class="fa fa-pause"></i>');
        this.paused = false;
      }
    });
  }

  step(){
    this.board.snake.move();
    if (this.board.hitApple()) {
      this.board.snake.addOns = 3;
      let score = parseInt(this.scoreEl.html());
      this.scoreEl.html(`${score + 10}`);
      this.board.resetApple();
    }
    if (this.board.isOver()) {
      clearInterval(this.snakeMoves);
      alert("you lost!");
    }
    this.board.render();
  }
}

module.exports = View;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

const Snake = __webpack_require__(2);
class Board{
  constructor($el){
    this.snake = new Snake();

    for (let i = 0; i < 20; i++) {
      let row = $(`<ul class="row-${i}"></ul>`);
      for (let j = 0; j < 20; j++) {
        let box = $("<li></li>").attr("pos", `${i}, ${j}`);
        row.append(box);
      }
      $el.append(row);
    }

    this.resetApple();
  }

  render() {
    const head = this.snake.head();
    const tail = this.snake.removedTail;

    if (tail) $(`li[pos="${tail[0]}, ${tail[1]}"]`).removeClass("snake-body");
    $(`li[pos="${head[0]}, ${head[1]}"]`).addClass("snake-body");
  }

  resetApple() {
    $(".apple").removeClass("apple");
    this.apple = this.emptySpace();
    $(`li[pos="${this.apple[0]}, ${this.apple[1]}"]`).addClass("apple");
  }

  isOver() {
    const head = this.snake.head();
    if (head[0] < 0 || head[1] < 0) return true;
    if (head[0] > 19 || head[1] > 19) return true;

    const snakeCoords = this.snake.segments;
    for (let i = 0; i < snakeCoords.length - 1; i++) {
      if (snakeCoords[i][0] === head[0] && snakeCoords[i][1] === head[1]) {
        return true;
      }
    }

    return false;
  }

  hitApple() {
    const head = this.snake.head();
    return this.apple[0] === head[0] && this.apple[1] === head[1];
  }

  emptySpace() {
    let randomRow = Math.floor(Math.random() * 20);
    let randomCol = Math.floor(Math.random() * 20);
    while (this.snake.hasSnake([randomRow, randomCol])) {
      randomRow = Math.floor(Math.random() * 20);
      randomCol = Math.floor(Math.random() * 20);
    }
    return [randomRow, randomCol];
  }
}
module.exports = Board;


/***/ }),
/* 2 */
/***/ (function(module, exports) {

const dirDeltas = {
  "N": [-1, 0],
  "S": [1, 0],
  "E": [0, 1],
  "W": [0, -1]
};

const oppositeDir = {
  "N": "S",
  "E": "W",
  "S": "N",
  "W": "E"
};

class Snake {
  constructor() {
    this.direction = "N";
    this.segments = [[10,10]];
    this.addOns = 0;
    this.removedTail = null;
  }

  head() {
    return this.segments[this.segments.length - 1];
  }

  move() {
    // add new "head" to snake
    const d = dirDeltas[this.direction];
    let newHead = [...this.head()];
    newHead[0] += d[0];
    newHead[1] += d[1];
    this.segments.push(newHead);

    // remove snake's "tail" unless an apple has recently been hit
    if (this.addOns) {
      this.addOns--;
      this.removedTail = null;
    }
    else {
      this.removedTail = this.segments.shift();
    }
  }

  turn(newDir) {
    if (newDir !== oppositeDir[this.direction]) {
      this.direction = newDir;
    }
  }

  hasSnake(pos) {
    return this.segments.some(c => c[0] === pos[0] && c[1] === pos[1]);
  }
}

module.exports = Snake;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

const View = __webpack_require__(0); 

$( () => {
  const $container = $('.snake');
  const v = new View($container);
  v.board.render();
});


/***/ })
/******/ ]);