const View = require('./view.js'); // require appropriate file

$( () => {
  const $container = $('.snake');
  const v = new View($container);
  v.board.render();
});
