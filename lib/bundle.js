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
    this.pos = options.pos;
    this.width = options.width;
    this.height = options.height;
    this.vel = options.vel;
    this.radius = options.radius;
    this.color = options.color;
    this.game = options.game;
    this.image = options.image;
    this.type = options.type;
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
    if ( this.type === "enemy_ship" && animationFrame % 80 === 0 )
    {
      this.vel = Util.scale([2*Math.random(),2*Math.random()], 1);
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
      this.grabImage();
      ctx.drawImage(this.image, this.srx, this.sry, this.width, this.height, this.pos[0], this.pos[1], this.width, this.height);
    }
    if ( this.type === "bullet" )
    {
      ctx.drawImage(this.image, 449, 1270, this.width, this.height, this.pos[0], this.pos[1], this.width, this.height);
    }
    if ( this.type === "enemy_ship" )
    {
      ctx.drawImage(this.image, 530, 1998, this.width, this.height, this.pos[0], this.pos[1], this.width, this.height);
    }
    if ( this.type === "enemy_bullet" )
    {
      ctx.drawImage(this.image, 141, 1552, this.width, this.height, this.pos[0], this.pos[1], this.width, this.height);
    }
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
  const canvasEl = document.getElementsByTagName("canvas")[0];
  canvasEl.width = Game.DIM_X;
  canvasEl.height = Game.DIM_Y;

  const ctx = canvasEl.getContext("2d");
  //lets initialize a new game
  const game = new Game();
  new GameView(game, ctx).start();
});


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

const Tyran = __webpack_require__(7);
const Bullet = __webpack_require__(1);
const Ship = __webpack_require__(5);
const Util = __webpack_require__(0);
// this contains all the objects in the game that we are going to change before we
// re-render them all

class Game {
  constructor() {
    this.bullets = [];
    this.ships = [];
    this.enemies = [];
    //lets add the enemies now
    this.drawText = this.drawText.bind(this);
    this.clearScreen = this.clearScreen.bind(this);
    this.addEnemies();
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
    } else {
      throw "wtf?";
    }
  }

  addEnemies() {
    var enemyImage = new Image();
    enemyImage.src = "assets/space.jpeg";
    for (let i = 0; i < Game.NUM_ENEMIES; i++) {
      this.add(new Tyran({
        game: this,
        image: enemyImage,
        type: "enemy_ship",
        width: 60,
        height: 46,
      }));
    }
  }

  addShip(shiptype) {
    var shipImage = new Image();
    shipImage.src = "assets/space_forward.jpeg";

    const ship = new Ship({
      pos: [500,500],
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
    return [].concat(this.ships, this.bullets, this.enemies);
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
    ctx.fillText("Score:" + " " + text.scorevalue + "     " + "Lives:" + " " + text.lifevalue, text.x, text.y);
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

  //We use clear Rect and fillrect to draw over again
  //lets draw up all of the objects on the screen again before we render them again.
  draw(ctx) {
    //canvas clear and fill rect will allow us to clear and re-render.
    this.clearScreen(ctx);
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

  randomPosition() {
    return [
      Game.DIM_X * Math.random(),
      ((Game.DIM_Y) / 2) * Math.random()
    ];
  }

  remove(object) {
    if (object instanceof Bullet) {
      this.bullets.splice(this.bullets.indexOf(object), 1);
    } else if (object instanceof Tyran) {
      this.enemies.splice(this.enemies.indexOf(object), 1);
    } else if (object instanceof Ship) {
      this.ships.splice(this.ships.indexOf(object), 1);
    } else {
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
Game.NUM_ENEMIES = 10;

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
    if ( key.getPressedKeyCodes().length === 0 )
    {
      this.ship.srx = 28;
      this.ship.sry = 2212;
      this.ship.direction = "flat";
      this.ship.flyingFrame = 0;
      this.ship.rightindex = -1;
      this.ship.leftindex = -1;
      this.ship.vel = [0,0];
    }

    if ( this.animationFrame % 200 === 0 )
    {
      this.game.enemies.forEach((enemy) => {
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
    requestAnimationFrame(this.animate.bind(this));
  }
}

GameView.MOVES = {
  "up": [ 0, -1],
  "left": [-1,  0],
  "down": [ 0,  1],
  "right": [ 1,  0]
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
      options.pos = options.pos || options.game.randomPosition();
      options.vel = options.vel || Util.scale([2*Math.random(),2*Math.random()], DEFAULTS.SPEED);
			super(options);
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
            this.game.ships[0].score.scorevalue += 100;
            this.remove();
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
        Util.dir([0, 1]),
        2
      );

      const bulletVel = [
        0, relVel[1] + this.vel[1]
      ];
      //MOVE THIS
      var enemy_bullet_image = new Image();
      enemy_bullet_image.src = "assets/space.jpeg";

      const bullet = new Bullet({
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


/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map