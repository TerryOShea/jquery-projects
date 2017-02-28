const Board = require("./board.js");

class View {
  constructor($el) {
    this.el = $el;
    this.board = new Board($el);
    this.paused = false;
    this.score = 0;

    this.playPauseEl = $(".play-pause-button");
    this.playPauseIcon = $(".play-pause-button i");
    this.scoreEl = $(".score");

    this.snakeMoves = setInterval(()=> this.step(), 300);
    this.addListeners();
    this.board.render();
  }

  addListeners() {
    // turn the snake based on arrow key inputs
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

    // listen for clicks on the pause/play button
    this.playPauseEl.on('click', () => {
      if (!this.paused) {
        clearInterval(this.snakeMoves);
      }
      else {
        this.snakeMoves = setInterval(()=> this.step(), 300);
      }

      this.paused = !this.paused;
      this.playPauseIcon.toggleClass("fa-pause");
      this.playPauseIcon.toggleClass("fa-play");
    });
  }

  step() {
    this.board.snake.move();

    if (this.board.hitApple()) {
      this.board.snake.addOns = 3;
      this.score += 10;
      this.scoreEl.html(`${this.score}`);
      this.board.resetApple();
    }

    if (this.board.isOver()) {
      clearInterval(this.snakeMoves);
      alert("You lost!");
    }

    this.board.render();
  }
}

module.exports = View;
