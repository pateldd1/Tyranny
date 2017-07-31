Tyranny Space Shooter

Background

Tyranny is a space shooter game, drawing inspiration from Tyrian. It is an infinitely-long 1-player game in which the player shoots enemy ships and tries to survive as long as possible, receiving a high score at the end.

Any live cell with 2 or 3 live neighbors (defined to be the eight cells surrounding it) stays alive,
Any dead cell with exactly 3 neighbors will come to life,
Any live cell with less than 2 neighbors or more than 3 neighbors will die.
There are many variations on the GoL. This simulation will incorporate several of those variations, outlined in the Functionality & MVP and Bonus Features sections.

Functionality & MVP

Users will be able to:

 Start, pause, and reset the game (by pressing escape or pressing a pause button which leads to a menu to do these things)
 Fire by pressing the spacebar or by holding down their left-mouse button.
 Move using the up, down, left, or right arrow keys or by moving their mouse around.
 Collect power ups from within the game that allow them to have more damage with every shot they fire and a different type of bullet, more health (+), extra lives. They
 Will have 3 lives before game over.

 Enemy Types:
 1. Dumb ships that just fire and move from top to bottom without moving left or right. (20 pts)
 2. Ships that follow the user and fire (50 pts)
 3. ships that don't fire but just try to run into the user (10pts)
 4. Boss with AI implemented (1000 pts)

 There will be a scrolling background that will move top to bottom, using CSS scrolling and javascript.
 User will receive points for every ship they destroy with varying points by the type of ship, and by collecting coins.
 Upgrades will render when you receive a certain number of points.

 Bullet Types:
 1. fires straight and slowly. - default and after death
 2. fires straight and rapidly. - after receiving 500 points.
 3. fires in 3 directions. - after receiving 1000 points.
 4. fires in 5 directions. - after receiving 2000 points.

In addition, this project will include:

 A "contols" modal describing the controls and rules of the game
 A production Readme

Wireframes

This app will consist of a single screen with game board, game controls, and nav links to the Github, my LinkedIn, and the "controls" modal. Wireframe is in the /docs/wireframes folder.

Architecture and Technologies

This project will be implemented with the following technologies:

Vanilla JavaScript and (maybe jquery if absolutely necessary, probably not) for overall structure and game logic,
Easel.js with HTML5 Canvas for DOM manipulation and rendering,
Webpack to bundle and serve up the various scripts.
This project will be done with vanilla javascript as much as possible.

In addition to the webpack entry file, there will be three scripts involved in this project:

background.js: this script will handle the logic for the background canvas and the scrolling of it, and determining all of the enemy objects that will be on the screen for the current frame.

enemies.js: this file will contain all the enemy objects, their locations, widths, heights, and structural information. Maybe split into different folders for each enemy type.

player.js: this file will contain the player object, its movement, and animation, and will determine the different positions of the player based on animation frame.

input.js: this file will be responsible for handling input from the player, such as mouseclicks, movements on on the mouse or keyboard, spacebar for firing, escape for pausing, etc.

animation.js: this file is responsible for determining position information about the player and the enemies depending on the animation frame.

movement.js: this file will be responsible for updating the movement of all the entities on the page based on their positional data that is sent from animation.js.

AI.js: this file will be responsible for figuring out where the enemies will be moving based on the location of the player on the screen if they require AI.

physics.js: this file will be used for detecting and handling the collisions such as when a player is hit by a bullet, when a player's bullet hits an enemy, when a player runs into an enemy, when a player collects
coins or upgrades, etc. It will also manage sounds such as collecting coins, getting an upgrade, getting damaged by a bullet, or dying.

render.js: this file will be responsible for rendering the whole screen over again after all of the objects are updated.

game.js: this file will be responsible for putting everything together, causing all the object updates, and re-rendering the screen.

Implementation Timeline

Day 1: Setup all necessary Node modules, including getting webpack up and running and Easel.js installed. Create webpack.config.js as well as package.json. Write a basic entry file and the bare bones of all 3 scripts outlined above. Learn the basics of Easel.js. Goals for the day:

Get a green bundle with webpack
Learn enough Easel.js to render an object to the Canvas element
Find a background that is scrolling and get the background scrolling.
Find sounds
Get the spritesheet ready.
Make the player object.
Get a ship moving around on the screen. Start the input.js file, determining the currentState of the player based on input.
Figure out how to use Easel.js perfectly.
Figure out the data object that you will want to pass through each each object that will help to determine each objects positioning, movement, and animation.


Day 2:

Make All 4 types of enemy objects, including the boss.
Add to the input.js file that handles all of the other inputs, such as escape, etc. Do the animation.js file, handling the animation with easel.js.
Make the ship able to rotate left and right, and shoot. Make the ships rotate as well.
Maybe use a mod doing this in every 13 or so animation frames, reseting to 0 depending on the number of frames you have.
Handle the connection between user input and the current animation frame, such as pressing left and rotating left, etc.
Handle the physics of the movement, such as increasing the velocity to the left or to the right depending on if you press left or right or hover the mouse left or right.

Day 3:

Create all the objects that allow for powerups, make the score render on the page, make the coins
Figure out the logic of enemies firing at you
Figure out the logic of enemies that don't fire and where they will be rendered on the screen.
Figure out the logic of the boss and the AI that will be needed to create a difficult boss.
Render all of these things.


Day 4: Install the controls for the user to interact with the game. Style the frontend, making it polished and professional. Goals for the day:

Create controls for game speed, stop, start, reset, and shape type
Have a styled Canvas, nice looking controls and title
Polish everything and fix all the bugs.

Bonus features-

--Game difficulty of easy, medium, hard
--differing game speed
--multiple levels
--a store where a user could buy weapons from the points they have.
