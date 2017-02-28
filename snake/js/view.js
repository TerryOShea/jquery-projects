const Board = require("./board.js");

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
