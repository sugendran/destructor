define(['Phaser', 'Laser'], function (Phaser, Laser) {
  "use strict";

  var TIME_BETWEEN_ROUNDS = 200;
  var LASER_OFFSET = 45;
  var MAX_SPEED = 500;
  var ACCELERATION = 1500;

  function Tank(game, x, y, laserLayer) {
    Phaser.Sprite.call(this, game, x, y, 'gameart', 'tank.png');
    this.laserLayer = laserLayer;

    // var shadow = game.add.sprite(x, y, 'gameart', 'tankshadow.png');
    // shadow.anchor.x = 0.8;
    // shadow.anchor.y = 0.4;

    // game.add.existing(this);
    // game.add.existing(shadow);
    // game.tankLayer.add(this);
    // game.bgLayer.add(shadow);

    this.anchor.x = 0.5;
    this.anchor.y = 0.5;

    this.pewpew = game.add.audio('pewpew');

    game.physics.enable(this, Phaser.Physics.ARCADE);
    this.body.setSize(50, 10, 0, 0);
    this.body.collideWorldBounds = true;
    this.body.drag.setTo(2*ACCELERATION);
    this.body.maxVelocity.setTo(MAX_SPEED, MAX_SPEED);


    var spacekey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    spacekey.onDown.add(this.fire, this);

    this.lastFire = new Date().getTime();
  }
  Tank.prototype = Object.create(Phaser.Sprite.prototype);
  Tank.prototype.constructor = Tank;

  Tank.prototype.update = function () {
    this.body.acceleration.x = 0;
    this.body.acceleration.y = 0;

    var cursors = this.game.input.keyboard.createCursorKeys();
    if (cursors.left.isDown) {
      this.backward();
    } else if (cursors.right.isDown) {
      this.forward();
    }

    if (cursors.up.isDown) {
      this.up();
    } else if (cursors.down.isDown) {
      this.down();
    }
  };

  Tank.prototype._movex = function (delta) {
    this.body.acceleration.x += delta;
  };
  Tank.prototype.forward = function () {
    this._movex(ACCELERATION);
  };
  Tank.prototype.backward = function () {
    this._movex(-ACCELERATION);
  };
  Tank.prototype._movey = function (delta) {
    this.body.acceleration.y += delta;
  };
  Tank.prototype.up = function () {
    this._movey(-ACCELERATION);
  };
  Tank.prototype.down = function () {
    this._movey(ACCELERATION);
  };
  Tank.prototype.fire = function () {
    var now = new Date().getTime();
    if ((now - this.lastFire - TIME_BETWEEN_ROUNDS) > 0) {
      var x = this.x + LASER_OFFSET;
      var y = this.y - 4;
      var laser = new Laser(this.game, x, y, this.rotation);
      this.game.add.existing(laser);
      this.laserLayer.add(laser);
      this.lastFire = now;
      this.pewpew.play();
    }
  };

  return Tank;
});