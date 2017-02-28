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
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

const View = __webpack_require__(1); // require appropriate file

$( () => {
  const $container = $('.snake');
  const v = new View($container);
  v.board.render();
});


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

const Board = __webpack_require__(2);

class View{
  constructor($el){
    this.el = $el;
    this.board = new Board($el);
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

    this.snakeMoves = setInterval(()=> this.step(), 200);
    this.scoreEl = $(".score");
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
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

const Snake = __webpack_require__(3);
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
    $(".snake-body").removeClass("snake-body");
    $(".apple").removeClass("apple");
    this.snake.segments.forEach(seg => {
      seg.forEach(coord => {
        $(`li[pos="${coord[0]}, ${coord[1]}"]`).addClass("snake-body");
      });
    });
    $(`li[pos="${this.apple[0]}, ${this.apple[1]}"]`).addClass("apple");
  }

  resetApple() {
    this.apple = this.emptySpace();
  }

  isOver() {
    const head = this.snake.head();
    if (head[0] < 0 || head[1] < 0) return true;
    if (head[0] > 19 || head[1] > 19) return true;

    const snakeCoords = this.snake.snakeCoords();
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
/* 3 */
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

class Snake{
  constructor(){
    this.direction = "N";
    this.segments = [[[10,10]]];
    this.addOns = 0;
  }

  head() {
    let lastSeg = this.segments[this.segments.length -1];
    if(lastSeg.length === 0) {
      let secondLast = this.segments[this.segments.length -2];
      return secondLast[secondLast.length -1];
    } else {
      return lastSeg[lastSeg.length-1];
    }
  }

  move(){
    const d = dirDeltas[this.direction];
    let newHead = [...this.head()];
    newHead[0] += d[0];
    newHead[1] += d[1];

    let lastSeg = this.segments[this.segments.length -1];
    lastSeg.push(newHead);

    if (this.addOns) {
      this.addOns--;
    }
    else {
      this.segments[0].shift();
      if(this.segments[0].length === 0) this.segments.shift();
    }
  }

  turn(newDir){
    if (newDir !== oppositeDir[this.direction]){
      this.segments.push([]);
      this.direction = newDir;
    }
  }

  snakeCoords() {
    let flatten = arr => arr.reduce((acc, val) => acc.concat(val), []);
    return flatten(this.segments);
  }

  hasSnake(pos) {
    return this.snakeCoords().some(c => c[0] === pos[0] && c[1] === pos[1]);
  }
}

module.exports = Snake;


/***/ })
/******/ ]);