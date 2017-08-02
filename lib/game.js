const Tyran = require("./tyran");
const Bullet = require("./bullet");
const Ship = require("./ship");
const Util = require("./util");
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
