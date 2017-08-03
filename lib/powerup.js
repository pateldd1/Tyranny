const MovingObject = require("./moving_object");

class PowerUp extends MovingObject {
  constructor(options = {}){
    super(options);
    this.isWrappable = true;
  }


}


module.exports = PowerUp;
