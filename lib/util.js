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

  bossMove(bosspos, playerpos){
    let vector = [playerpos[0] - bosspos[0], 0];
    var normal = Util.norm(vector);
    return Util.scale(vector, 1.7 / normal);
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
  // wrap (coord, max) {
  //   if (coord > max) {
  //     return coord % max;
  //   } else {
  //     return coord;
  //   }
  // }
};

module.exports = Util;
