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
