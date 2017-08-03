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
