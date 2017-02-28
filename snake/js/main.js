const View = require('./view.js'); 

$( () => {
  const $container = $('.snake');
  const v = new View($container);
  v.board.render();
});
