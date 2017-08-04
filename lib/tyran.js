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
			// this.bullettype = options.bullettype;
    }
    //Make the logic for getting hurt by bullets here.
    //Our ship is currently just relocating when it gets hit
    collideWith(otherObject) {
      if (otherObject instanceof Ship) {
        // otherObject.takeDamage();
				otherObject.score.health -= 50;
				this.pos = this.game.enemyrandomPosition();
	      if ( otherObject.score.health <= 0 )
	      {
	        otherObject.score.lifevalue -= 1;
	        otherObject.score.health = 100;
	        otherObject.bullettype = 1;
	        otherObject.bulletpower = 1;
	        otherObject.relocate();
	      }
				// otherObject.bullettype = 1;
				// otherObject.bulletpower = 1;
        // otherObject.relocate();
        return true;
      } else if (otherObject.type === "bullet") {
						this.lifebar -= otherObject.power;
						otherObject.remove();
						if (this.lifebar <= 0){
	            this.game.ships[0].score.scorevalue += 100;
	            this.remove();
							if (this.game.enemies.length % 4 === 0){
								this.game.addPowerUp();
							}
						}
            return true;
        }
    }

    fireBullet(firetype) {
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
			var big_enemy_bullet_image = new Image();
			big_enemy_bullet_image.src = "assets/laserbeam.gif";
			switch(this.bullettype){
				case 1:
		      this.game.add(new Bullet({
		        srx: 425,
		        sry: 1103,
		        pos: [this.pos[0] + 14, this.pos[1] + 40],
		        width: 28,
		        height: 30,
		        vel: bulletVel,
		        game: this.game,
		        type: "enemy_bullet",
		        image: enemy_bullet_image,
						power: 20,
						isWrappable: false
		      }))
					break;
				case 2:
					this.game.add(new Bullet({
						srx: 141,
						sry: 1552,
						pos: [this.pos[0] + 24, this.pos[1] + 40],
						width: 27,
						height: 69,
						vel: bulletVel,
						game: this.game,
						type: "enemy_bullet",
						image: enemy_bullet_image,
						power: 30,
						isWrappable: false
					}))
					this.game.add(new Bullet({
						srx: 141,
						sry: 1552,
						pos: [this.pos[0] + 150, this.pos[1] + 40],
						width: 27,
						height: 69,
						vel: bulletVel,
						game: this.game,
						type: "enemy_bullet",
						image: enemy_bullet_image,
						power: 30,
						isWrappable: false
					}))
					break;
				case 3:
					this.game.add(new Bullet({
						srx: 83,
						sry: 55,
						pos: [this.pos[0] + 48, this.pos[1] + 80],
						width: 42,
						height: 20,
						vel: bulletVel,
						game: this.game,
						type: "enemy_bullet",
						image: big_enemy_bullet_image,
						power: 20,
						isWrappable: false
					}))
					break;
				case 4:
					if ( firetype === "laser" )
					{
						this.game.add(new Bullet({
							srx: 83,
							sry: 55,
							pos: [this.pos[0] + 120, this.pos[1] + 240],
							width: 42,
							height: 20,
							vel: bulletVel,
							game: this.game,
							type: "enemy_bullet",
							image: big_enemy_bullet_image,
							power: 20,
							isWrappable: false
						}))
						break;
					}
					else if( firetype === "missile"){
						this.game.add(new Bullet({
							srx: 141,
							sry: 1552,
							pos: [this.pos[0] + 70, this.pos[1] + 240],
							width: 27,
							height: 69,
							vel: bulletVel,
							game: this.game,
							type: "enemy_bullet",
							image: enemy_bullet_image,
							power: 30,
							isWrappable: false
						}))
						this.game.add(new Bullet({
							srx: 141,
							sry: 1552,
							pos: [this.pos[0] + 250, this.pos[1] + 240],
							width: 27,
							height: 69,
							vel: bulletVel,
							game: this.game,
							type: "enemy_bullet",
							image: enemy_bullet_image,
							power: 30,
							isWrappable: false
						}))
						break;
					}
					else if( firetype === "orange"){
						this.game.add(new Bullet({
							srx: 425,
							sry: 1103,
							pos: [this.pos[0] + 70, this.pos[1] + 240],
							width: 28,
							height: 30,
							vel: bulletVel,
							game: this.game,
							type: "enemy_bullet",
							image: enemy_bullet_image,
							power: 10,
							isWrappable: false
						}))
						this.game.add(new Bullet({
							srx: 425,
							sry: 1103,
							pos: [this.pos[0] + 120, this.pos[1] + 240],
							width: 28,
							height: 30,
							vel: bulletVel,
							game: this.game,
							type: "enemy_bullet",
							image: enemy_bullet_image,
							power: 10,
							isWrappable: false
						}))
						this.game.add(new Bullet({
							srx: 425,
							sry: 1103,
							pos: [this.pos[0] + 250, this.pos[1] + 240],
							width: 28,
							height: 30,
							vel: bulletVel,
							game: this.game,
							type: "enemy_bullet",
							image: enemy_bullet_image,
							power: 10,
							isWrappable: false
						}))
						break;
					}
			}
      //You want the game to have knowledge of this bullet
      // this.game.add(bullet);
    }
}

module.exports = Tyran;
