const Game = require("./game");
const GameView = require("./game_view");

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
