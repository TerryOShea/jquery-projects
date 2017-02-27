const View = require('./ttt-view.js'); // require appropriate file
const Game = require('./game.js'); // require appropriate file

$( () => {
  const g = new Game();
  const $container = $('.ttt');
  const v = new View(g, $container);
  v.setupBoard();
  v.bindEvents();
});
