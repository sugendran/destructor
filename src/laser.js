define(['Phaser'], function (Phaser) {
  "use strict";

  var LASER_SPEED = 300;

  function Laser(game, x, y, angle) {
    Phaser.Sprite.call(this, game, x, y, 'gameart', 'laser.png');

    game.physics.enable(this, Phaser.Physics.ARCADE);

    this.rotation = angle;
    this.body.velocity.x = Math.cos(angle) * LASER_SPEED;
    this.body.velocity.y = Math.sin(angle) * LASER_SPEED;
    this.body.angle = angle;
  }

  Laser.prototype = Object.create(Phaser.Sprite.prototype);
  Laser.prototype.constructor = Laser;

  return Laser;

});