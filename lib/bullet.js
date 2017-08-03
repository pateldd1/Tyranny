const MovingObject = require("./moving_object");

class Bullet extends MovingObject {
  constructor(options) {
    options.image = options.image;
    options.type = options.type;
    options.width = options.width;
    options.height = options.height;
    super(options);
    //Everything else will be the same as moving object
    //we don't want it to go offscreen and come back on screen.

    this.power = options.power;
    this.isWrappable = false;
  }
}

Bullet.SPEED = 15;

module.exports = Bullet;
