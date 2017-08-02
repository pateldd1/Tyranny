const Util = require("./util");
const MovingObject = require("./moving_object");
const Ship = require("./ship");
const Bullet = require("./bullet");

const DEFAULTS = {
	SPEED: 1
};

class Tyran extends MovingObject {
    constructor(options = {}) {
      options.game = options.game;
      options.width = options.width;
      options.height = options.height;
      options.pos = options.pos;
      options.vel = options.vel;
      options.image = options.image;
      options.type = options.type;
      super(options);
      this.lifebar = options.lifebar;
			this.mag = options.mag;
    }
    //Make the logic for getting hurt by bullets here.
    //Our ship is currently just relocating when it gets hit
    collideWith(otherObject) {
      if (otherObject instanceof Ship) {
        // otherObject.takeDamage();
        otherObject.score.lifevalue -= 1;
        otherObject.relocate();
            return true;
      } else if (otherObject.type === "bullet") {
						this.lifebar -= 1
						otherObject.remove();
						if (this.lifebar === 0){
	            this.game.ships[0].score.scorevalue += 100;
	            this.remove();
						}
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
        Util.dir([0, 1]),
        2
      );

      const bulletVel = [
        0, relVel[1] + this.vel[1]
      ];
      //MOVE THIS
      var enemy_bullet_image = new Image();
      enemy_bullet_image.src = "assets/spaced_out_again_reverse.gif";

      const bullet = new Bullet({
        srx: 141,
        sry: 1552,
        pos: [this.pos[0] + 14, this.pos[1] + 40],
        width: 27,
        height: 69,
        vel: bulletVel,
        color: this.color,
        game: this.game,
        type: "enemy_bullet",
        image: enemy_bullet_image
      });
      //You want the game to have knowledge of this bullet
      this.game.add(bullet);
    }
}

module.exports = Tyran;
