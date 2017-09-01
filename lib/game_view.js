//This contains all the logic for rendering the game
const Util = require("./util");
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
    this.ctx.fillText(`cmd + r to restart`, 540, 470)
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
