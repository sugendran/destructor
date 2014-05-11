define(['Phaser', 'game'], function (Phaser, GameState) {
  "use strict";

  var game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO, '');
  game.state.add('runtime' , GameState);
  game.state.start('runtime');
});