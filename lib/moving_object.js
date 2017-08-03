const Util = require("./util");

class MovingObject {
  constructor(options) {
    this.vel = options.vel;
    this.pos = options.pos;
    this.width = options.width;
    this.height = options.height;
    this.game = options.game;
    this.image = options.image;
    this.type = options.type;
    this.srx = options.srx;
    this.sry = options.sry;

    //everything this wrappable except for bullets which are not.
    this.isWrappable = true;
  }

  //Basically the handle collision function that will be run if there is a collision.
  collideWith(otherObject) {
    // default do nothing
  }

  //Since each object inherits from moving_object, they will all move a certain way
  //that comes from this move method. They can all run the move method. This will come
  //from the step method.
  move(timeDelta, animationFrame) {
    //timeDelta is number of milliseconds since last move
    //if the computer is busy the time delta will be larger
    //in this case the MovingObject should move farther in this frame
    //velocity of object is how far it should move in 1/60th of a second

    //We should normally move 60 frames in a second, so we are taking a time proportionality
    //of the amount of time delta it took to reach this frame and multiplying by our nomal
    //frame rate so we get movement that is proporitional.
    const velocityScale = timeDelta / NORMAL_FRAME_TIME_DELTA,
    offsetX = this.vel[0] * velocityScale,
    offsetY = this.vel[1] * velocityScale;

    this.pos = [this.pos[0] + offsetX, this.pos[1] + offsetY];
    //This is used to change the direction of the ships randomly
    if ( this.type === "enemy_ship" && animationFrame % 80 === 0 )
    {
      this.vel = Util.scale([2*Math.random(),2*Math.random()], this.mag);
    }
    if (this.game.isOutOfBounds(this.pos)) {
      if (this.isWrappable) {
        this.pos = this.game.wrap(this.pos);
      } else {
        this.remove();
      }
    }
  }
  //MOVE AND THEN DRAW
  //This draw method will help to draw a circle to the screen.
  draw(ctx) {
    ctx.fillStyle = this.color;
    //beginpath pretty much just lets us start the canvas drawing.
    ctx.beginPath();
    if ( this.type === "player_ship" )
    {
      this.grabAnimation();
    }
    ctx.drawImage(this.image, this.srx, this.sry, this.width, this.height, this.pos[0], this.pos[1], this.width, this.height);
    // ctx.arc(
    //   this.pos[0], this.pos[1], this.radius, 0, 2 * Math.PI, true
    // );
    ctx.fill();
  }

  //A better thing to do is to check for box collision since we won't be using circles.
  isCollidedWith(otherObject) {
    let x1 = this.pos[0];
    let y1 = this.pos[1];
    let w1 = this.width;
    let h1 = this.height;
    let x2 = otherObject.pos[0];
    let y2 = otherObject.pos[1];
    let w2 = otherObject.width;
    let h2 = otherObject.height;
    return !(x1 + w1 < x2 || x1 > x2 + w2 || y1 > y2 + h2 || y1 + h1 < y2);
  }


  remove() {
    this.game.remove(this);
  }
}

const NORMAL_FRAME_TIME_DELTA = 1000/60;

module.exports = MovingObject;
