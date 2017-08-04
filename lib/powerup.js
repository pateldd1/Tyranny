const MovingObject = require("./moving_object");

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
