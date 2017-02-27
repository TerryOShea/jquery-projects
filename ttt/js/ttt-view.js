class View {
  constructor(game, $el) {
    this.game = game;
    this.el = $el;
  }

  bindEvents() {
    $('li').on('click', (e) => {
      const $clicked = $(e.currentTarget);
      const pos = $clicked.attr('pos');
      const $mark = this.game.currentPlayer;

      try {
        this.game.playMove(pos.split(", ").map(el => parseInt(el)));
        $clicked.addClass('clicked');
        $clicked.append($mark.toUpperCase());
        $clicked.css('color', $mark === 'x' ? 'red' : 'blue' );
      }
      catch(err) {
        alert("Invalid move :(");
      }

      if (this.game.isOver()) {
        const winner = this.game.winner();
        if (winner) {
          alert(`Congratulations, ${this.game.winner()}!`);
        } else {
          alert('Game over!');
        }
      }
    });
  }

  makeMove($square) {}

  setupBoard() {
    const grid = $('<ul></ul>');
    for (let i = 0; i < 9; i++) {
      grid.append($('<li></li>').attr('pos', `${Math.floor(i/3)}, ${i % 3}`));
    }
    this.el.append(grid);
  }
}

module.exports = View;
