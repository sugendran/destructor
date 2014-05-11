define(['Phaser', 'background', 'tank', 'zombie', 'shadow'],
  function (Phaser, Background, Tank, Zombie, Shadow) {
  "use strict";

  var TIME_BETWEEN_HORDES = 1400;
  var ZOMBIE_TYPES = ['zombie', 'trucker'];

  var GameState = function() { };

  GameState.prototype = {
    preload: function () {
      var game = this.game;

      game.rnd.sow([123]);
      game.physics.startSystem(Phaser.Physics.ARCADE);

      game.load.atlas('gameart', 'img/destructor.png', 'img/destructor.json' );
      game.load.image('ground', 'img/ground.png');
      game.load.audio('pewpew', ['sounds/laser.mp3', 'sounds/laser.ogg']);
      game.load.audio('zap', ['sounds/zap.mp3', 'sounds/zap.ogg']);

      // some layering so that we can control render order
      this.bgLayer = game.add.group();
      this.shadowLayer = game.add.group();
      this.zombieLayer = game.add.group();
      this.laserLayer = game.add.group();
      this.tankLayer = game.add.group();

      this.lastHorde = new Date().getTime();
    },
    create:  function () {
      var game = this.game;
      var background = new Background(this.game);
      game.add.existing(background);
      this.bgLayer.add(background);

      var tank = new Tank(this.game, this.game.width / 4, this.game.height / 2, this.laserLayer);
      game.add.existing(tank);
      this.tankLayer.add(tank);

      var tankShadow = new Shadow(this.game, tank.x, tank.y, 'tankshadow.png');
      game.add.existing(tankShadow);
      this.shadowLayer.add(tankShadow);

      tankShadow.lockTo(tank, -30, 30);

      this.zombiedeath = this.game.add.audio('zap');

      // Show FPS
      this.game.time.advancedTiming = true;
      this.fpsText = this.game.add.text( 20, 40, '', { font: '16px Arial', fill: '#ffffff' });

      // some sort of score
      this.zombiesKilled = 0;
      this.scoreText = this.game.add.text( 20, 20, '', {
        font: '16px Arial',
        fill: '#ffffff',
        align: 'right'
      });
    },
    addZombie: function (game, x, y) {
      var zombieType = ZOMBIE_TYPES[game.rnd.integerInRange(0, ZOMBIE_TYPES.length -1)];
      var zombie = new Zombie(game, x, y, zombieType);
      game.add.existing(zombie);
      this.zombieLayer.add(zombie);

      var shadow = new Shadow(game, x, y, 'shadow.png');
      game.add.existing(shadow);
      this.shadowLayer.add(shadow);

      shadow.lockTo(zombie, 0, 0);
    },
    addHorde: function (game) {
      var rnd = game.rnd;
      var zombieCount = rnd.integerInRange(1, 3);
      var yOff = rnd.integerInRange(10, game.height - 10);
      for(var i=0; i<zombieCount; i++) {
        var dx = (i % 2) ? 0 : 30;
        this.addZombie(game, game.width + dx, yOff + 30 * i);
      }
    },
    update: function () {
      if (this.game.time.fps !== 0) {
          this.fpsText.setText(this.game.time.fps + ' FPS');
      }
      var now = new Date().getTime();
      if ((now - this.lastHorde - TIME_BETWEEN_HORDES) > 0) {
        this.addHorde(this.game);
        this.lastHorde = now;
      }
      // check for collisions
      var zombies = this.zombieLayer.children.slice(0);
      for(var i=0, ii=zombies.length; i<ii; i++) {
        var zombie = zombies[i];
        if (zombie.splatted) { continue; }
        var killed = this.game.physics.arcade.collide(zombie, this.laserLayer, zombie.lasered, null, zombie);
        if (killed) {
          this.zombiesKilled++;
          if (TIME_BETWEEN_HORDES > 400) {
            TIME_BETWEEN_HORDES -= 10;
          }
          this.zombiedeath.play();
        }
      }
      this.scoreText.setText('Zombies Killed: ' + this.zombiesKilled + '\n');
    }
  };
  return GameState;
});