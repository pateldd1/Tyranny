/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

const Util = {
  // Normalize the length of the vector to 1, maintaining direction.
  dir (vec) {
    var norm = Util.norm(vec);
    return Util.scale(vec, 1 / norm);
  },
  // Find distance between two points.
  dist (pos1, pos2) {
    return Math.sqrt(
      Math.pow(pos1[0] - pos2[0], 2) + Math.pow(pos1[1] - pos2[1], 2)
    );
  },
  // Find the length of the vector.
  norm (vec) {
    return Util.dist([0, 0], vec);
  },

  bossMove(bosspos, playerpos){
    let vector = [playerpos[0] - bosspos[0], 0];
    var normal = Util.norm(vector);
    return Util.scale(vector, 1.7 / normal);
  },
  // Return a randomly oriented vector with the given length.
  randomVec (length) {
    var deg = 2 * Math.PI * Math.random();
    return Util.scale([Math.sin(deg), Math.cos(deg)], length);
  },
  // Scale the length of a vector by the given amount.
  scale (vec, m) {
    return [vec[0] * m, vec[1] * m];
  },
  //This will help the wrapping of objects and will let cetain things go off screen and
  //return back to the screen.
  // wrap (coord, max) {
  //   if (coord > max) {
  //     return coord % max;
  //   } else {
  //     return coord;
  //   }
  // }
};

module.exports = Util;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

const Util = __webpack_require__(0);
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
  move(timeDelta, animationFrame, playerpos) {
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
    if ( this.bullettype !== 4 && this.type === "enemy_ship" && animationFrame % 80 === 0 )
    {
      this.vel = Util.scale([4*Math.random()-2,2*Math.random()], this.mag);
    }
    if ( this.bullettype === 4 && animationFrame % 400 === 0 )
    {
      this.vel = Util.bossMove(this.pos, playerpos);
    }
    if ( this.bullettype === 4 && animationFrame % 193 === 0 )
    {
      this.vel = Util.scale([4*Math.random() - 2, 0], 2);
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
    // ctx.arc(    //   this.pos[0], this.pos[1], this.radius, 0, 2 * Math.PI, true
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


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

const MovingObject = __webpack_require__(1);

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
  }
}

Bullet.SPEED = 15;

module.exports = Bullet;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

const MovingObject = __webpack_require__(1);
const Bullet = __webpack_require__(2);
const Util = __webpack_require__(0);

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
      lifevalue: 4,
      health: 100,
      x: 800,
      y: 50,
      size: "25px",
      font: "Sans-Serif",
      color: "#42f445"
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
      if (that.flyingFrame % 3 === 0){
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
      if (that.flyingFrame % 3 === 0){
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
        sry: 1267,
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


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

const Game = __webpack_require__(5);
const GameView = __webpack_require__(8);

document.addEventListener("DOMContentLoaded", function(){
  // const bgCanvas = document.getElementById("bg-canvas");
  const fgCanvas = document.getElementById("fg-canvas");

  // const bgCtx = bgCanvas.getContext("2d");
  const fgCtx = fgCanvas.getContext("2d");
  var imeg = new Image();
  imeg.src = "assets/shooter_background.jpg";
  imeg.onload = function(){
    fgCtx.drawImage(imeg,0,0,1267,620,0, 0,1267, 620);
    //lets initialize a new game
    const game = new Game();
    new GameView(game, fgCtx).start();    
  }
});


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

const Tyran = __webpack_require__(6);
const Bullet = __webpack_require__(2);
const Ship = __webpack_require__(3);
const Util = __webpack_require__(0);
const PowerUp = __webpack_require__(7);
// this contains all the objects in the game that we are going to change before we
// re-render them all

class Game {
  constructor() {
    this.bullets = [];
    this.ships = [];
    this.enemies = [];
    this.powerups = [];
    //lets add the enemies now
    this.drawText = this.drawText.bind(this);
    this.clearScreen = this.clearScreen.bind(this);
    this.addEnemies = this.addEnemies.bind(this);
    this.addEnemies(1);
  }

  add(object) {
    if (object instanceof Bullet) {
        this.bullets.push(object);
    }
    else if (object instanceof Tyran) {
        this.enemies.push(object);
    }
    else if (object instanceof Ship) {
        this.ships.push(object);
    }
    else if (object instanceof PowerUp){
      this.powerups.push(object);
    }
    else {
      throw "wtf?";
    }
  }

  addPowerUp(){
    var powerupImage = new Image();
    powerupImage.src = "assets/spaced_out_again.gif"
    let powerupPos = Math.floor(3*Math.random());
    let allpowerups = [
      {
        srx: 23,
        sry: 3861,
        pos: this.poweruprandomPosition(),
        vel: Util.scale([2*Math.random(),2*Math.random()], 1),
        width: 34,
        height: 30,
        game: this,
        image: powerupImage,
        type: "more_health",
        isWrappable: true
      },
      {
        srx: 23,
        sry: 3950,
        pos: this.poweruprandomPosition(),
        vel: Util.scale([2*Math.random(),2*Math.random()], 1),
        width: 34,
        height: 30,
        game: this,
        image: powerupImage,
        type: "upgrade_weapon",
        isWrappable: true
      },
      {
        srx: 23,
        sry: 3906,
        pos: this.poweruprandomPosition(),
        vel: Util.scale([2*Math.random(),2*Math.random()], 1),
        width: 34,
        height: 30,
        game: this,
        image: powerupImage,
        type: "more_lives",
        isWrappable: true
      }
    ]
    // console.log(allpowerups[]);
    this.add(new PowerUp(allpowerups[powerupPos]));
    setTimeout(()=> {this.powerups[this.powerups.length-1].remove()}, 11000)
  }

  addEnemies(stage) {

    switch (stage) {
     case 1:
        this.addsmallEnemies(5);
        this.addbigEnemies(1);
        this.addmediumEnemies(1);
        break;
     case 2:
        this.addsmallEnemies(6);
        this.addbigEnemies(1);
        this.addmediumEnemies(2);
      break;
     case 3:
       this.addsmallEnemies(7);
       this.addbigEnemies(2);
       this.addmediumEnemies(1);
       break;
     case 4:
       this.addboss();
       break;
    }
  }

  addboss(){
    var bossimage = new Image();
    bossimage.src = "assets/tyrianboss.gif";
    this.add(new Tyran({
      srx: 0,
      sry: 0,
      pos: [0,0],
      mag: 1.8,
      vel: [0,0],
      width: 294,
      height: 282,
      game: this,
      image: bossimage,
      type: "enemy_ship",
      lifebar: 100,
      bullettype: 4,
      isWrappable: true
    }));
  }

  addsmallEnemies(num){
    var enemyImage = new Image();
    enemyImage.src = "assets/spaced_out_again_reverse.gif";
    for (let i = 0; i < num; i++) {
      this.add(new Tyran({
        srx: 530,
        sry: 1998,
        pos: this.enemyrandomPosition(),
        mag: 1.9,
        vel: Util.scale([2*Math.random(),2*Math.random()], 1.9),
        width: 60,
        height: 46,
        game: this,
        image: enemyImage,
        type: "enemy_ship",
        lifebar: 5,
        bullettype: 1,
        isWrappable: true
      }));
    }
  }

  addbigEnemies(num){
    var enemy_num2 = new Image();
    enemy_num2.src = "assets/enemy2.png";
    for (let i = 0; i < num; i++)
    {
      this.add(new Tyran({
        srx: 0,
        sry: 0,
        pos: this.enemyrandomPosition(),
        mag: 1.5,
        vel: Util.scale([2*Math.random(),2*Math.random()], 1.5),
        width: 142,
        height: 117,
        game: this,
        image: enemy_num2,
        type: "enemy_ship",
        lifebar: 20,
        bullettype: 3,
        isWrappable: true
      }));
    }
  }

  addmediumEnemies(num){
    var enemy_num3 = new Image();
    enemy_num3.src = "assets/6.png";
    for (let i = 0; i < num; i++)
    {
      this.add(new Tyran({
        srx: 4,
        sry: 2,
        pos: this.enemyrandomPosition(),
        mag: 1.8,
        vel: Util.scale([2*Math.random(),2*Math.random()], 1.8),
        width: 166,
        height: 100,
        game: this,
        image: enemy_num3,
        type: "enemy_ship",
        lifebar: 15,
        bullettype: 2,
        isWrappable: true
      }));
    }
  }

  addShip(shiptype) {
    var shipImage = new Image();
    shipImage.src = "assets/spaced_out_again.gif";

    const ship = new Ship({
      srx: 28,
      sry: 2212,
      pos: [500, 500],
      vel: [0, 0],
      width: 48,
      height: 46,
      game: this,
      image: shipImage,
      type: shiptype,
      isWrappable: false
    });

    this.add(ship);

    return ship;
  }

  allObjects() {
    return [].concat(this.ships, this.bullets, this.enemies, this.powerups);
  }

  checkCollisions() {
    const allObjects = this.allObjects();
    for (let i = 0; i < allObjects.length; i++) {
      for (let j = 0; j < allObjects.length; j++) {
        const obj1 = allObjects[i];
        const obj2 = allObjects[j];
        //Everything depends on what type of object it is.
        if (obj1.isCollidedWith(obj2)) {
          //This is a way to end this early because their is only one collision per animation frame.
          const collision = obj1.collideWith(obj2);
          if (collision) return;
        }
      }
    }
  }

  //THIS DOES ALL THE WORK OF MOVING ALL THE OBJECTS BEFORE THE NEXT RENDER
  moveObjects(delta, animationFrame) {
    this.allObjects().forEach((object) => {
      object.move(delta, animationFrame, this.ships[0].pos);
    });
  }

  drawText(text, ctx){
    ctx.font = text.size + " " + text.font;
    ctx.fillStyle = text.color;
    ctx.fillText(`Score: ${text.scorevalue}    Health: ${text.health}    Lives: ${text.lifevalue}`, text.x, text.y);
  }

  clearScreen(ctx){
    ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
    ctx.fillStyle = Game.BG_COLOR;
    ctx.fillRect(0, 0, Game.DIM_X, Game.DIM_Y);
  }

  drawGameOver(ctx){
    this.clearScreen(ctx);
    let finished ={
      x: 370,
      y: 250,
      size: "50px",
      font: "Sans-Serif",
      color: "white"
    }
    ctx.font = finished.size + " " + finished.font;
    ctx.fillStyle = finished.color;
    ctx.fillText("Sorry bud, you lose :(", finished.x, finished.y);
    ctx.fillText("Press cmd + r to retry (LOL)", finished.x, finished.y + 60);
  }

  drawNextStage(ctx, stage){
    this.clearScreen(ctx);
    let nxstage ={
      x: 370,
      y: 320,
      size: "50px",
      font: "Sans-Serif",
      color: "white"
    }
    ctx.font = nxstage.size + " " + nxstage.font;
    ctx.fillStyle = nxstage.color;
    ctx.fillText(`Stage ${stage}    Wait but be Ready!`, nxstage.x, nxstage.y);
  }

  //We use clear Rect and fillrect to draw over again
  //lets draw up all of the objects on the screen again before we render them again.
  draw(ctx) {
    //canvas clear and fill rect will allow us to clear and re-render.
    this.clearScreen(ctx);
    var imegs = new Image();
    imegs.src = "assets/shooter_background.jpg";
    ctx.drawImage(imegs,0,0,1267,620,0, 0,1267, 620);
    this.drawText(this.ships[0].score, ctx);
    // ctx.setTransform(0,1,1,0,1,1)
    this.allObjects().forEach((object) => {
      object.draw(ctx);
    });
  }

  isOutOfBounds(pos) {
    return (pos[0] < 0) || (pos[1] < 0) ||
      (pos[0] > Game.DIM_X) || (pos[1] > Game.DIM_Y);
  }
  //Lets take all of our objects and move them based on how they should move and how far
  //they should move

  enemyrandomPosition() {
    return [
      Game.DIM_X * Math.random(),
      0
    ];
  }

  poweruprandomPosition() {
    return [
      Game.DIM_X * Math.random(),
      Game.DIM_Y * Math.random()
    ];
  }

  randomPosition() {
    return [
      1200 * Math.random(),
      500
    ];
  }

  remove(object) {
    if (object instanceof Bullet) {
      this.bullets.splice(this.bullets.indexOf(object), 1);
    } else if (object instanceof Tyran) {
      this.enemies.splice(this.enemies.indexOf(object), 1);
    } else if (object instanceof Ship) {
      this.ships.splice(this.ships.indexOf(object), 1);
    }
    else if(object instanceof PowerUp){
      this.powerups.splice(this.powerups.indexOf(object), 1)
    }
    else {
      throw "wtf?";
    }
  }
  //Lets hand the animation, then the movement, then the physics to check for collisions.
  step(delta, animationFrame) {
    // this.animateObjects();
    this.animationFrame = animationFrame;
    this.moveObjects(delta, animationFrame);
    this.checkCollisions();
  }

  wrap(pos) {
    return [
      Math.random()*Game.DIM_X, 0
    ];
  }
}

Game.BG_COLOR = "#000000";
Game.DIM_X = 1267;
Game.DIM_Y = 620;
Game.FPS = 32;
Game.NUM_ENEMIES = 4;

module.exports = Game;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

const Util = __webpack_require__(0);
const MovingObject = __webpack_require__(1);
const Ship = __webpack_require__(3);
const Bullet = __webpack_require__(2);

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


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

const MovingObject = __webpack_require__(1);

class PowerUp extends MovingObject {
  constructor(options = {}){
    super(options);
    this.isWrappable = true;
    this.spinFrame = 0;
    this.animationstates = [];
    for (let i = 0; i < 16; i++)
    {
      this.animationstates.push([this.srx + this.width * i, this.sry]);
    }
    this.animindex = 0;
  }

  grabAnimation(){
    let that = this;
    if (that.spinFrame % 4 === 0){
      if ( that.animindex === 16 ){
        that.animindex = 0;
      }
      that.srx = that.animationstates[that.animindex][0];
      that.sry = that.animationstates[that.animindex][1];
      that.animindex += 1;
    }
    that.spinFrame++;
  }
}


module.exports = PowerUp;


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

//This contains all the logic for rendering the game
const Util = __webpack_require__(0);
class GameView {
  constructor(game, ctx) {
    this.ctx = ctx;
    this.game = game;
    this.animationFrame = 0;
    //We add the ship as soon as the game starts.
    this.ship = this.game.addShip("player_ship");
    // this.animating = this.animating.bind(this);
    this.drawPaused = this.drawPaused.bind(this);
    this.requestId = undefined;
    // this.stopping = this.stopping.bind(this);
    this.start = this.start.bind(this);
    this.stage = 1;
    this.paused = false;
    this.startmenu = true;
    this.bosslaser = true;
    this.bossmissile = false;
    this.bossorange = false;
  }

  drawPaused(){
    this.game.draw(this.ctx);
    this.ctx.font = "70px Sans-Serif";
    this.ctx.fillStyle = "white";
    this.ctx.fillText("Tyranny", 520, 240);
    this.ctx.font = "50px Sans-Serif";
    this.ctx.fillStyle = "white";
    this.ctx.fillText("Controls:", 550, 310);
    this.ctx.font = "30px Sans-Serif";
    this.ctx.fillText(`Space to shoot`, 550, 350);
    this.ctx.fillText(`Directional pad to steer`, 500, 390);
    this.ctx.fillText(`Esc / Enter to pause`, 520, 430);
    this.ctx.fillText(`cmd + r to restart (LOL)`, 520, 470)
  }

  drawVictory(){
    this.game.draw(this.ctx);
    this.ctx.font = "60px Sans-Serif";
    this.ctx.fillStyle = "white";
    this.ctx.fillText("Congratulations You Win!", 280, 360);
  }

  //Lets bind the key handlers that are going to let us handle input from the user.
  bindKeyHandlers() {
    const ship = this.ship;
    let that = this;

    Object.keys(GameView.MOVES).forEach((k) => {
      let move = GameView.MOVES[k];
      key(k, () => {
        // console.log(key.isPressed(k));
        ship.direction = k;
        ship.power(move); });
    });

    key("space", () => { ship.fireBullet() });
    key("esc", () => {
      if ( !this.paused )
      {
        this.paused = true;
        this.drawPaused();
        this.game.enemies.forEach((enemy) => {
          enemy.vel = [0,0];
        });
      }
      else {
        this.paused = false;
        this.game.enemies.forEach((enemy) => {
          //if its not a boss
          if ( enemy.bullettype !== 4 )
          {
            enemy.vel = Util.scale([2*Math.random(),2*Math.random()], enemy.mag);
          }
        });
      }
      this.requestId = requestAnimationFrame(this.animate.bind(this));
    })
    key("enter", () => {
      if ( !this.paused )
      {
        this.paused = true;
        this.drawPaused();
        this.game.enemies.forEach((enemy) => {
          enemy.vel = [0,0];
        });
      }
      else {
        this.paused = false;
        this.game.enemies.forEach((enemy) => {
          if ( enemy.bullettype !== 4 )
          {
            enemy.vel = Util.scale([2*Math.random(),2*Math.random()], enemy.mag);
          }
        });
      }
      this.requestId = requestAnimationFrame(this.animate.bind(this));
    })
  }

  // togglepause(){
  //   if ( this.requestId )
  //   {
  //     this.stop();
  //   }
  //   else
  //   {
  //     this.requestId = requestAnimationFrame(this.animate.bind(this));
  //   }
  // }

  start() {
    this.bindKeyHandlers();
    this.lastTime = 0;
    //start the animation
    this.requestId = requestAnimationFrame(this.animate.bind(this));
  }

  // stopping(){
  //   if ( this.requestId )
  //   {
  //     console.log(this.requestId);
  //     console.log(this.animationFrame);
  //     window.cancelAnimationFrame(this.requestId);
  //     // key.deleteScope("player");
  //     //or null???
  //     this.requestId = 0;
  //   }
  //   else
  //   {
  //     this.requestId = window.requestAnimationFrame(this.animate.bind(this));
  //     // this.setScope("player");
  //   }
  // }

  // animating(frame){
  //   if (!this.paused){
  //     window.requestAnimationFrame(this.animate.bind(this));
  //   }
  //   else{
  //     window.cancelAnimationFrame(frame - 1);
  //   }
  // }

  //This is doing a lot of things. It is determining all the new positions, checking for collisions.
  //Come back here when you are thinking about what is going on.
  //this is a recursive call contantly being made

  //animate refers to animating the entire game here.
  animate(time) {
    // if ( this.game.enemies.length === 0 )
    // {
    //   this.game.addEnemies(this.stage);
    // }
    if ( this.paused )
    {
      return;
    }
    //   window.cancelAnimationFrame(this.requestId);
    //   return;
    //   // console.log('hi');
    //   // return;
    //   // window.cancelAnimationFrame(this.requestId);
    //   // this.requestId = 0;
    //   // this.requestId = window.requestAnimationFrame(this.animate.bind(this));
    // }
    const timeDelta = time - this.lastTime;
    let pressed_keys = key.getPressedKeyCodes()
    if ( pressed_keys.length === 0 )
    {
      this.ship.srx = 28;
      this.ship.sry = 2212;
      this.ship.direction = "flat";
      this.ship.flyingFrame = 0;
      this.ship.rightindex = -1;
      this.ship.leftindex = -1;
      this.ship.vel = [0,0];
    }
    //Using prime numbers to prevent coincidences of boss ammo
    if ( this.animationFrame % 277 === 0 )
    {
      this.bosslaser = !this.bosslaser;
    }
    if ( this.animationFrame % 347 === 0 )
    {
      this.bossorange = !this.bossorange;
    }
    if ( this.animationFrame % 67 === 0 )
    {
      this.bossmissile = !this.bossmissile;
    }
    this.game.enemies.forEach((enemy) => {
      if ( enemy.bullettype === 1 && ((this.animationFrame + 30) % 80) === 0 )
      {
        enemy.fireBullet();
      }
      else if (enemy.bullettype === 2 && ((this.animationFrame + 50) % 100) === 0){
        enemy.fireBullet();
      }
      else if (enemy.bullettype === 3){
        enemy.fireBullet();
      }
      else if (enemy.bullettype === 4 && this.bosslaser){
        enemy.fireBullet("laser");
      }
      else if (enemy.bullettype === 4 && this.bossmissile && this.animationFrame % 20 === 0){
        enemy.fireBullet("missile");
      }
      else if (enemy.bullettype === 4 && this.bossorange && this.animationFrame % 20 === 0){
        enemy.fireBullet("orange");
      }
    })
    this.game.step(timeDelta, this.animationFrame);
    this.game.draw(this.ctx);
    //lets reset the time.
    this.lastTime = time;
    this.animationFrame++;
    if ( this.game.ships[0].score.lifevalue === 0 )
    {
      this.game.drawGameOver(this.ctx);
      return;
    }
    //every call to animate requests causes another call to animate
    //repetitive callback
    if ( this.animationFrame === 20 )
    {
      this.paused = true;
      this.drawPaused();
      return;
    }
    if ( this.game.enemies.length === 0 )
    {
      this.paused = true;
      this.stage += 1;
      if ( this.stage === 5 )
      {
        this.drawVictory();
        // cancelAnimationFrame(this.requestId);
        return;
      }
      this.game.drawNextStage(this.ctx, this.stage);
      this.game.ships[0].pos = this.game.randomPosition();
      setTimeout(()=> {
        this.paused = false;
        this.game.addEnemies(this.stage);
        this.requestId = requestAnimationFrame(this.animate.bind(this));
      }, 4000);
    }
    this.requestId = requestAnimationFrame(this.animate.bind(this));
  }
}


GameView.MOVES = {
  "up": [ 0, -9],
  "left": [-9,  0],
  "down": [ 0,  9],
  "right": [ 9,  0]
};

module.exports = GameView;


/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map