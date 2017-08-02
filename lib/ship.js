const MovingObject = require("./moving_object");
const Bullet = require("./bullet");
const Util = require("./util");


function randomColor() {
  const hexDigits = "0123456789ABCDEF";

  let color = "#";
  for (let i = 0; i < 3; i ++) {
    color += hexDigits[Math.floor((Math.random() * 16))];
  }

  return color;
}

class Ship extends MovingObject {
  constructor(options) {
    // start with velocity of 0
    options.vel = options.vel || [0, 0];
    options.color = options.color || randomColor();
    options.image = options.image;
    super(options);
    this.score = {
      scorevalue: 0,
      lifevalue: 10,
      x: 750,
      y: 50,
      size: "25px",
      font: "PixelEmulator",
      color: "white"
    }
    this.direction = "flat";
    this.srx = 28;
    this.sry = 2212;
    this.flyingFrame = 0;
    this.rightFrames = [[192,2255], [247, 2256], [303,2257], [521,2257]];
    this.leftFrames = [[200,2208], [305, 2207], [416,2208], [523,2207]];
    this.rightindex = -1;
    this.leftindex = -1;
    this.grabImage = this.grabImage.bind(this);
  }

  grabImage(){
    let that = this;
    if ( that.direction === "right" )
    {
      if (that.flyingFrame % 4 === 0){
        that.rightindex += 1;
        if ( that.rightindex >= that.rightFrames.length ){
          return;
        }
        that.srx = that.rightFrames[that.rightindex][0];
        that.sry = that.rightFrames[that.rightindex][1];
      }
      that.flyingFrame += 1;
    }
    else if (that.direction === "left")
    {
      if (that.flyingFrame % 4 === 0){
        that.leftindex += 1;
        if ( that.leftindex >= that.leftFrames.length )
        {
          return;
        }
        that.srx = that.leftFrames[that.leftindex][0];
        that.sry = that.leftFrames[that.leftindex][1];
      }
      that.flyingFrame++;
    }
    // this.direction = "flat";
  }

  collideWith(otherObject) {
    if (otherObject.type === "enemy_bullet") {
      // otherObject.takeDamage();
      this.score.lifevalue -= 1;
      this.relocate();
      otherObject.remove();
          return true;
    }
  }

  fireBullet() {
    // const norm = Util.norm([0,this.vel[1]]);
    //change this in your game because you will be able to fire even if you are moving
    // if (norm == 0) {
    //   // Can't fire unless moving.
    //   return;
    // }
    //GET THE RELATIVE VELOCITY TO THE SHIP FROM THE DIRECTION AND THE SPEED
    const relVel = Util.scale(
      Util.dir([0, -1]),
      Bullet.SPEED
    );

    const bulletVel = [
      0, relVel[1] + this.vel[1]
    ];
    //MOVE THIS
    var bullet_image = new Image();
    bullet_image.src = "assets/space.jpeg";

    const bullet = new Bullet({
      pos: [this.pos[0] + 10, this.pos[1] - 63],
      width: 21,
      height: 77,
      vel: bulletVel,
      color: this.color,
      game: this.game,
      type: "bullet",
      image: bullet_image
    });

    this.game.add(bullet);
  }
//Power and then move the object
  power(impulse) {
    this.vel[0] += impulse[0];
    this.vel[1] += impulse[1];
  }

  relocate() {
    this.pos = this.game.randomPosition();
    this.vel = [0, 0];
  }
}

module.exports = Ship;
