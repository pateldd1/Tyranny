const Util = require("./util");
// const PowerUp = require("./powerup");

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
    this.isWrappable = options.isWrappable;
    this.bullettype = options.bullettype;
    //everything this wrappable except for bullets which are not.
    // this.isWrappable = true;
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
    let prevpos = this.pos.slice(0);
    this.pos = [this.pos[0] + offsetX, this.pos[1] + offsetY];
    //This is used to change the direction of the ships randomly
    //lets check if the x and y coords plus the offset will take us out of bounds
    //or not and if they do then we won't allow this. This is good to prevent the ship from goibg
    //across the screen
    if ( !this.bullettype === 4 && this.type === "enemy_ship" && animationFrame % 80 === 0 )
    {
      this.vel = Util.scale([2*Math.random(),2*Math.random()], this.mag);
    }
    if ( this.bullettype === 4 && animationFrame % 40 === 0 )
    {
      this.vel = Util.scale([4*Math.random() - 2, 0], this.mag);
    }
    if (this.game.isOutOfBounds(this.pos)) {
      if (this.isWrappable) {
        this.pos = this.game.wrap(this.pos);
      } else if (!this.isWrappable && (this.type === "player_ship"))
      {
        this.pos = prevpos;
      }
      else
      {
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
    if ( ["player_ship", "more_health", "upgrade_weapon", "more_lives"].includes(this.type) )
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
