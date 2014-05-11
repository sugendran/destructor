define(['Phaser'], function (Phaser) {
  "use strict";

  function Background (game) {
    Phaser.TileSprite.call(this, game, 0, 0, game.width, game.height, 'ground');
  }

  Background.prototype = Object.create(Phaser.TileSprite.prototype);
  Background.prototype.constructor = Background;

  Background.prototype.update = function () {
    this.tilePosition.x -= 2;
  };

  return Background;
});