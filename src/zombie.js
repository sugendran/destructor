define(['Phaser'], function (Phaser) {
  "use strict";

  var SPLATS = ['splat.png', 'splat2.png'];

  var ZOMBIE_SCALE = 0.6;

  function Zombie(game, x, y, kind) {
    Phaser.Sprite.call(this, game, x, y, 'gameart');
    this.scale.x = ZOMBIE_SCALE;
    this.scale.y = ZOMBIE_SCALE;
    this.anchor.x = 0.5;
    this.anchor.y = 0.5;

    var keys = [];
    for(var i=0; i<8; i++) {
      keys.push(kind + i + '.png');
    }
    this.animations.add('brains', keys, 10, true, false);
    this.animations.play('brains');

    game.physics.enable(this, Phaser.Physics.ARCADE);
    this.body.velocity.x = -120;
  }

  Zombie.prototype = Object.create(Phaser.Sprite.prototype);
  Zombie.prototype.constructor = Zombie;

  Zombie.prototype.update = function () {
    if (this.splatted) {
      this.x -= 2;
    }
  };

  Zombie.prototype.lasered = function (me, laser) {
    laser.destroy();
    this.animations.stop('brains');
    this.frameName = SPLATS[~~(Math.random() * SPLATS.length)];
    this.body.velocity.x = 0;
    this.splatted = true;
  };

  return Zombie;
});