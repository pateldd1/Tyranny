## Tyranny Space Shooter
See Live Version Here: [https://pateldd1.github.io/Tyranny](https://pateldd1.github.io/Tyranny)

### Background

* Tyranny is a space shooter game, drawing inspiration from Tyrian. It is an infinitely-long 1-player game in which the player shoots enemy ships and tries to survive as long as possible, receiving a high score at the end.

![level1](/assets/level_one.gif)

Functionality & MVP:

#### Users are able to:

 * Start, pause, and reset the game (by pressing escape or pressing the enter button to pause, and ,temporarily, they can do cmd+r or refresh the page to restart the game)
 * Fire by pressing the spacebar
 * Move using the up, down, left, or right arrow keys.
 * Collect power ups from within the game that allow them to have more damage with every shot they fire and a different type of bullet, more health (+), extra lives.
 * Will have 4 lives before game over.

 Enemy Types:
 1. Large Laser Firing Ships. (Move at a different random vector every certain number of animation frames)
 2. Small fireball-firing ships. (Move at a different random vector every certain number of animation frames)
 3. Ships that fire rockets from two turrets. (Move at a different random vector every certain number of animation frames)
 4. Boss with AI implemented. (Moves at a vector that is relative to the vector that the user is moving (smart) for a certain
 number of animation frames and moves at a random vector for a certain number of animation frames (dumb))


 ![boss](/assets/boss_level.gif)

 Power Ups (with spin animation):
 1. Extra Life
 2. More Health
 3. Stronger/Different Ammo

 * User receives points for every ship they destroy with varying points by the type of ship.
 * Upgrades will render when you receive a certain number of points.

 User Bullet Types (weakest to strongest):
 1. Laser
 2. FireBall
 3. Missile

 Enemy Bullet Types (weakest to strongest):
 1. Small fireball
 2. Missile
 3. Blue Laser


### Architecture and Technologies

#### This project is implemented with the following technologies:

* Vanilla JavaScript for overall structure, game logic, and DOM Manipulation
* HTML5 Canvas for rendering,
* Webpack to bundle and serve up the various scripts.

#### In addition to the webpack entry file, there will be three scripts involved in this project:

1. tyranny.js: This is the entry file that begins the JS rendering of the game within canvas.

2. game_view.js: This file contains the 'requestAnimationFrame' javascript function that allows
for a recursive call that allows the game to render frame by frame.

3. game.js: This file keeps track of the arrays of the ships, player ship, powerups, enemy ships, bullets,
and all other moving objects. It's job is to iterate through this array, move each of these objects based on their individual vectors,
which are subclasses of MovingObject within moving_object.js, animate whichever ones of these objects require an animation, check if any two objects have collided and deal with this collision, and draw the to result to the canvas.

4. util.js: This file contains the physics for the game. The functions within this file create the vectors for each of the objects, using the norm and the scale function.

5. ship.js: this file is responsible for the actions of the player ship, animating the ship based on the animation frame, and firing bullets depending on the type of bullet the user currently has. It is also responsible for determining what happens when the ship collides with different objects, such as whether a ship collides with a powerup (obtain what the powerup contains) or an enemy (lose health).

6. bullet.js: this file is responsible for keeping data about each moving bullet such as the image, the type, the width, and the height of the bullet.

7. powerup.js: this file is responsible for containing the actions for every moving powerup. The action called 'grabAnimation' will grab the current animation picture of the powerup, since these powerups are spinning.

8. moving_object.js: This is the superclass of all of the moving objects and contains the 'move' function, which is a function that, depending on the type of object, moves the object based on that object's vector, grabs the animation picture for that object if it is an animated object, and then changes the position of that object. It also contains the 'isCollidedWith' function which will determine if two objects have collided by seeing if the two boxes surrounding each object intersect each other.

9. tyran.js: this file contains the enemy ships, the types of those ships, what kind of bullet each of those ships will be firing, and what the game should do if one of these ships were to collide with the user (lower user health) or with one of the user's bullets (lower its own health)

#### Bonus features-

* Game difficulty of easy, medium, hard
* differing game speed
* multiple levels
* a store where a user could buy weapons from the points they have.
