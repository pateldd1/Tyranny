const Tyran = require("./tyran");
const Bullet = require("./bullet");
const Ship = require("./ship");
const Util = require("./util");
const PowerUp = require("./powerup");
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
      y: 320,
      size: "50px",
      font: "Sans-Serif",
      color: "red"
    }
    ctx.font = finished.size + " " + finished.font;
    ctx.fillStyle = finished.color;
    ctx.fillText("Sorry bud, you lose :(", finished.x, finished.y);
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
    ctx.fillText(`Stage ${stage}    Get Ready`, nxstage.x, nxstage.y);
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
