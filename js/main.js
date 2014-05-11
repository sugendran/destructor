/* globals Phaser:true */
"use strict";

var LASER_SPEED = 300;
var TIME_BETWEEN_ROUNDS = 200;
var LASER_OFFSET = 45;
var MAX_SPEED = 500;
var ACCELERATION = 1500;

var game;
var tank;
var bgLayer;
var laserLayer;
var tankLayer;
var bg;

function Zombie(x, y, kind) {
  var zombie = game.add.sprite(x, y, 'gameart');
  zombie.scale.x = 0.6;
  zombie.scale.y = 0.6;

  var keys = [];
  for(var i=0; i<8; i++) {
    keys.push(kind + i + '.png');
  }
  zombie.animations.add('brains', keys, 10, true, false);
  zombie.animations.play('brains');

  game.physics.enable(zombie, Phaser.Physics.ARCADE);
  zombie.body.velocity.x = -80;

  laserLayer.add(zombie);

  this.sprite = zombie;
}

function Laser(x, y, angle) {
  var laser = game.add.sprite(x, y, 'gameart', 'laser.png');
  laserLayer.add(laser);
  game.physics.enable(laser, Phaser.Physics.ARCADE);
  laser.rotation = angle;
  laser.body.velocity.x = Math.cos(laser.rotation) * LASER_SPEED;
  laser.body.velocity.y = Math.sin(laser.rotation) * LASER_SPEED;
  laser.body.angle = angle;
  this.sprite = laser;
}

function Tank(x, y) {
  var tank = game.add.sprite(x, y, 'gameart', 'tank.png');
  var shadow = game.add.sprite(x, y, 'gameart', 'tankshadow.png');
  shadow.anchor.x = 0.8;
  shadow.anchor.y = 0.4;
  // tank.frameName = 'tank.png';
  tankLayer.add(tank);
  bgLayer.add(shadow);

  tank.anchor.x = 0.5;
  tank.anchor.y = 0.5;

  this.sprite = tank;
  this.shadow = shadow;
  this.pewpew = game.add.audio('pewpew');

  game.physics.enable(tank, Phaser.Physics.ARCADE);
  tank.body.collideWorldBounds = true;
  tank.body.drag.setTo(2*ACCELERATION);
  tank.body.maxVelocity.setTo(MAX_SPEED, MAX_SPEED);

  this.lastFire = new Date().getTime();
}
Tank.prototype._movex = function (delta) {
  this.sprite.body.acceleration.x += delta;
};
Tank.prototype.forward = function () {
  this._movex(ACCELERATION);
};
Tank.prototype.backward = function () {
  this._movex(-ACCELERATION);
};
Tank.prototype._movey = function (delta) {
  this.sprite.body.acceleration.y += delta;
};
Tank.prototype.up = function () {
  this._movey(-ACCELERATION);
};
Tank.prototype.down = function () {
  this._movey(ACCELERATION);
};
Tank.prototype.update = function () {
  this.sprite.body.acceleration.x = 0;
  this.sprite.body.acceleration.y = 0;
  this.shadow.x = this.sprite.x;
  this.shadow.y = this.sprite.y;
};
Tank.prototype.fire = function () {
  var now = new Date().getTime();
  if ((now - this.lastFire - TIME_BETWEEN_ROUNDS) > 0) {
    var x = this.sprite.x + LASER_OFFSET;
    var y = this.sprite.y - 4;
    new Laser(x, y, this.sprite.rotation);
    this.lastFire = now;
    this.pewpew.play();
  }
};

function preload() {
  // game.stage.backgroundColor = '#6A6A6A';
  game.load.atlas('gameart', 'img/destructor.png', 'img/destructor.json' );
  game.load.image('ground', 'img/ground.png');
  game.load.audio('pewpew', ['sounds/laser.mp3', 'sounds/laser.ogg']);


  bgLayer = game.add.group();
  laserLayer = game.add.group();
  tankLayer = game.add.group();
}

function create() {
  bg = game.add.tileSprite(0, 0, game.width, game.height, 'ground');
  bgLayer.add(bg);

  tank = new Tank(game.width / 4, game.height / 2);
  var spacekey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
  spacekey.onDown.add(tank.fire, tank);

  new Zombie(400, 300, 'zombie');
  new Zombie(400, 500, 'trucker');
}

function update() {
  tank.update();
  var cursors = game.input.keyboard.createCursorKeys();
  if (cursors.left.isDown) {
    tank.backward();
  } else if (cursors.right.isDown) {
    tank.forward();
  }

  if (cursors.up.isDown) {
    tank.up();
  } else if (cursors.down.isDown) {
    tank.down();
  }
  bg.tilePosition.x -= 2;
}

game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO, '', {
  preload: preload, create: create, update: update
});

