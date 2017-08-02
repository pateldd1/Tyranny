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
