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
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
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
  wrap (coord, max) {
    if (coord < 0) {
      return max - (coord % max);
    } else if (coord > max) {
      return coord % max;
    } else {
      return coord;
    }
  }
};

module.exports = Util;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

const MovingObject = __webpack_require__(2);

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


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

const Util = __webpack_require__(0);

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


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

const Game = __webpack_require__(4);
const GameView = __webpack_require__(6);

document.addEventListener("DOMContentLoaded", function(){
  // const bgCanvas = document.getElementById("bg-canvas");
  const fgCanvas = document.getElementById("fg-canvas");

  // const bgCtx = bgCanvas.getContext("2d");
  const fgCtx = fgCanvas.getContext("2d");

  //lets initialize a new game
  const game = new Game();
  new GameView(game, fgCtx).start();
});


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

const Tyran = __webpack_require__(7);
const Bullet = __webpack_require__(1);
const Ship = __webpack_require__(5);
const Util = __webpack_require__(0);
const PowerUp = __webpack_require__(8);
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
        srx: 21,
        sry: 3856,
        pos: this.poweruprandomPosition(),
        vel: Util.scale([2*Math.random(),2*Math.random()], 1),
        width: 37,
        height: 41,
        game: this,
        image: powerupImage,
        type: "more_health"
      },
      {
        srx: 23,
        sry: 3947,
        pos: this.poweruprandomPosition(),
        vel: Util.scale([2*Math.random(),2*Math.random()], 1),
        width: 37,
        height: 36,
        game: this,
        image: powerupImage,
        type: "upgrade_weapon"
      },
      {
        srx: 22,
        sry: 3903,
        pos: this.poweruprandomPosition(),
        vel: Util.scale([2*Math.random(),2*Math.random()], 1),
        width: 36,
        height: 37,
        game: this,
        image: powerupImage,
        type: "more_lives"
      }
    ]
    // console.log(allpowerups[]);
    this.add(new PowerUp(allpowerups[powerupPos]));
    setTimeout(()=> {this.powerups[this.powerups.length-1].remove()}, 8000)
  }

  addEnemies(stage) {
    var enemyImage = new Image();
    enemyImage.src = "assets/spaced_out_again_reverse.gif";
    switch (stage) {
    // default:
    //     text = "Looking forward to the Weekend";
    //     break;
    case 1:
        for (let i = 0; i < Game.NUM_ENEMIES; i++) {
          this.add(new Tyran({
            srx: 530,
            sry: 1998,
            pos: this.enemyrandomPosition(),
            mag: 2,
            vel: Util.scale([2*Math.random(),2*Math.random()], 2),
            width: 60,
            height: 46,
            game: this,
            image: enemyImage,
            type: "enemy_ship",
            lifebar: 3
          }));
        }
        this.addbigEnemies(1);
        break;
    case 2:
      for (let i = 0; i < Game.NUM_ENEMIES + 2; i++) {
        this.add(new Tyran({
          srx: 530,
          sry: 1998,
          pos: this.enemyrandomPosition(),
          mag: 2.2,
          vel: Util.scale([2*Math.random(),2*Math.random()], 2.2),
          width: 60,
          height: 46,
          game: this,
          image: enemyImage,
          type: "enemy_ship",
          lifebar: 6
        }));
      }
      this.addbigEnemies(2);
      break;
     case 3:
       for (let i = 0; i < Game.NUM_ENEMIES + 2; i++) {
         this.add(new Tyran({
           srx: 530,
           sry: 1998,
           pos: this.enemyrandomPosition(),
           mag: 2.3,
           vel: Util.scale([2*Math.random(),2*Math.random()], 2.3),
           width: 60,
           height: 46,
           game: this,
           image: enemyImage,
           type: "enemy_ship",
           lifebar: 8
         }));
       }
       this.addbigEnemies(3);
       break;
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
        mag: 2,
        vel: Util.scale([2*Math.random(),2*Math.random()], 2),
        width: 142,
        height: 117,
        game: this,
        image: enemy_num2,
        type: "enemy_ship",
        lifebar: 20
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
      width: 53,
      height: 46,
      game: this,
      image: shipImage,
      type: shiptype
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
      object.move(delta, animationFrame);
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
      x: 220,
      y: 250,
      size: "50px",
      font: "PixelEmulator",
      color: "red"
    }
    ctx.font = finished.size + " " + finished.font;
    ctx.fillStyle = finished.color;
    ctx.fillText("GAME OVER YOU LOSE", finished.x, finished.y);
  }

  drawNextStage(ctx, stage){
    this.clearScreen(ctx);
    let nxstage ={
      x: 280,
      y: 250,
      size: "50px",
      font: "PixelEmulator",
      color: "white"
    }
    ctx.font = nxstage.size + " " + nxstage.font;
    ctx.fillStyle = nxstage.color;
    ctx.fillText(`Stage ${stage}    Get Ready`, nxstage.x, nxstage.y);
  }

  //We use clear Rect and fillrect to draw over again
  //lets draw up all of the objects on the screen again before we render them again.
  draw(ctx) {
    //canvas clear and fill rect will allow us to clear and re-render.
    this.clearScreen(ctx);
    var imeg = new Image();
    imeg.src = "assets/shooter_background.jpg";
    ctx.drawImage(imeg,0,0,1000,1000,0, 0,1000, 550);
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
      Game.DIM_X * Math.random(),
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
    this.moveObjects(delta, animationFrame);
    this.checkCollisions();
  }

  wrap(pos) {
    return [
      Util.wrap(pos[0], Game.DIM_X), Util.wrap(pos[1], Game.DIM_Y)
    ];
  }
}

Game.BG_COLOR = "#000000";
Game.DIM_X = 1000;
Game.DIM_Y = 550;
Game.FPS = 32;
Game.NUM_ENEMIES = 6;

module.exports = Game;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

const MovingObject = __webpack_require__(2);
const Bullet = __webpack_require__(1);
const Util = __webpack_require__(0);


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
      this.score.health -= 20;
      if ( this.score.health === 0 )
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


/***/ }),
/* 6 */
/***/ (function(module, exports) {

//This contains all the logic for rendering the game
class GameView {
  constructor(game, ctx) {
    this.ctx = ctx;
    this.game = game;
    this.animationFrame = 0;
    //We add the ship as soon as the game starts.
    this.ship = this.game.addShip("player_ship");
    this.stage = 1;
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
  }

  start() {
    this.bindKeyHandlers();
    this.lastTime = 0;
    //start the animation
    requestAnimationFrame(this.animate.bind(this));
  }
  //This is doing a lot of things. It is determining all the new positions, checking for collisions.
  //Come back here when you are thinking about what is going on.
  //this is a recursive call contantly being made

  //animate refers to animating the entire game here.
  animate(time) {
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

    if ( (this.animationFrame + 300) % 200 === 0 )
    {
      this.game.enemies.slice(0,4).forEach((enemy) => {
        enemy.fireBullet();
      })
    }
    if ( (this.animationFrame + 400) % 300 === 0 )
    {
      this.game.enemies.slice(4,8).forEach((enemy) => {
        enemy.fireBullet();
      })
    }
    if ( (this.animationFrame + 500) % 400 === 0 )
    {
      this.game.enemies.slice(8,11).forEach((enemy) => {
        enemy.fireBullet();
      })
    }
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
    if ( this.game.enemies.length === 0 )
    {
      this.stage += 1;
      this.game.drawNextStage(this.ctx, this.stage);
      this.game.ships[0].pos = this.game.randomPosition();
      setTimeout(()=> {
        this.game.addEnemies(this.stage);
        requestAnimationFrame(this.animate.bind(this))
      }, 4000);
    }
    else{
      requestAnimationFrame(this.animate.bind(this));
    }
  }
}

GameView.MOVES = {
  "up": [ 0, -9],
  "left": [-9,  0],
  "down": [ 0,  9],
  "right": [ 9,  0]
};

module.exports = GameView;


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

const Util = __webpack_require__(0);
const MovingObject = __webpack_require__(2);
const Ship = __webpack_require__(5);
const Bullet = __webpack_require__(1);

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
				otherObject.score.health -= 50;
				this.relocate();
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


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

const MovingObject = __webpack_require__(2);

class PowerUp extends MovingObject {
  constructor(options = {}){
    super(options);
    this.isWrappable = true;
  }


}


module.exports = PowerUp;


/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map