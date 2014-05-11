define(['Phaser'], function (Phaser) {
  "use strict";

  function Shadow (game, x, y, spriteName) {
    Phaser.Sprite.call(this, game, x, y, 'gameart', spriteName);
    this.anchor.x = 0.5;
    this.anchor.y = 0.5;
  }

  Shadow.prototype = Object.create(Phaser.Sprite.prototype);
  Shadow.prototype.constructor = Shadow;

  Shadow.prototype.lockTo = function (target, deltaX, deltaY) {
    this.shadowOf = target;
    this.shadowX = deltaX;
    this.shadowY = deltaY;
  };

  Shadow.prototype.update = function () {
    if (!this.shadowOf) {
      return;
    }
    if (!this.shadowOf.splatted) {
      this.destroy();
    } else {
      this.x = this.shadowOf.x + this.shadowX;
      this.y = this.shadowOf.y + this.shadowY;
    }
  };

  return Shadow;
});