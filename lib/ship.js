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
    options.pos = options.pos;
    options.vel = options.vel;
    options.width = options.width;
    options.height = options.height;
    options.game = options.game;
    options.type = options.type;
    options.image = options.image;
    super(options);
    this.score = {
      scorevalue: 0,
      lifevalue: 10,
      health: 100,
      x: 600,
      y: 50,
      size: "25px",
      font: "PixelEmulator",
      color: "white"
    }
    this.direction = "flat";
    this.flyingFrame = 0;
    this.rightFrames = [[192,2255], [247, 2256], [303,2257], [468,2258]];
    this.leftFrames = [[200,2208], [305, 2207], [416,2208], [523,2207]];
    this.rightindex = -1;
    this.leftindex = -1;
    this.grabAnimation = this.grabAnimation.bind(this);
    this.bulletpower = 1;
    this.bullettype = 1;
  }

  grabAnimation(){
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
      this.score.health -= otherObject.power;
      if ( this.score.health <= 0 )
      {
        this.score.lifevalue -= 1;
        this.score.health = 100;
        this.bullettype = 1;
        this.bulletpower = 1;
        this.relocate();
      }
      otherObject.remove();
      return true;
    }
    else if (otherObject.type === "more_health"){
      this.score.health += 50;
      otherObject.remove();
      return true;
    }
    else if (otherObject.type === "upgrade_weapon"){
      this.bulletpower += 1;
      this.bullettype += 1;
      otherObject.remove();
      return true;
    }
    else if (otherObject.type === "more_lives"){
      this.score.lifevalue += 1;
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
    bullet_image.src = "assets/spaced_out_again_reverse.gif";
    var second = new Image();
    let bullet;
    second.src = "assets/spaced_out_again.gif";
    if (this.bullettype === 1){
      bullet = new Bullet({
        srx: 449,
        sry: 1270,
        pos: [this.pos[0] + 14, this.pos[1] - 63],
        vel: bulletVel,
        width: 21,
        height: 77,
        game: this.game,
        image: bullet_image,
        type: "bullet",
        power: this.bulletpower
      });
    }
    else if (this.bullettype === 2){
      bullet = new Bullet({
        srx: 113,
        sry: 3520,
        pos: [this.pos[0] + 14, this.pos[1] - 53],
        vel: bulletVel,
        width: 45,
        height: 66,
        game: this.game,
        image: second,
        type: "bullet",
        power: this.bulletpower
      });
    }
    else if (this.bullettype >= 3){
      bullet = new Bullet({
        srx: 539,
        sry: 2986,
        pos: [this.pos[0] + 14, this.pos[1] - 53],
        vel: bulletVel,
        width: 31,
        height: 97,
        game: this.game,
        image: second,
        type: "bullet",
        power: this.bulletpower
      });
    }

    this.game.add(bullet);
  }
//Power and then move the object
  power(impulse) {
    this.vel[0] = impulse[0];
    this.vel[1] = impulse[1];
  }

  relocate() {
    this.pos = this.game.randomPosition();
    this.vel = [0, 0];
  }
}

module.exports = Ship;
