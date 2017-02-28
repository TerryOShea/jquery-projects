const Snake = require("./snake.js");
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
