// Be sure to name any p5.js functions we use in the global so Glitch can recognize them.
// Add to this list as you consult the p5.js documentation for other functions.
/* global createCanvas, colorMode, HSB, width, height, random, background, fill, color, random,
          textAlign, LEFT, CENTER, createButton, rect, ellipse, stroke, image, loadImage, collideCircleCircle, collideRectCircle, text, 
          mouseX, mouseY, strokeWeight, line, mouseIsPressed, windowWidth, windowHeight, noStroke, 
          keyIsPressed, keyCode, UP_ARROW, LEFT_ARROW, RIGHT_ARROW, DOWN_ARROW, textSize, PI, position, mousePressed, floor */

let timer,
  startingTime,
  playBtn,
  gameIsOver,
  score,
  firstGameStarted,
  player,
  startingRad,
  highScore;
let dots;
let centerX;
let centerY;
let playerX, playerY, playerRad, playerV, playerColor;

function setup() {
  createCanvas(windowWidth - 20, windowHeight - 20);
  centerX = width / 2 - 35;
  centerY = height / 2 - 25;
  colorMode(HSB, 360, 100, 100);
  firstGameStarted = false;
  gameIsOver = true;
  startingTime = 1000;
  timer = startingTime;
  score = 0;
  playBtn = createButton("Click to play");
  playBtn.position(centerX, centerY);
  playBtn.show();
  playBtn.mousePressed(restart);
  playerX = centerX + 35;
  playerY = centerY + 40;
  playerV = 10;
  startingRad = 20;
  playerRad = startingRad;
  playerColor = random(360);
  highScore = 0;
  // player = ellipse(playerX, playerY, playerRad);

  dots = [];
  for (let i = 0; i < 20; i++) {
    dots.push(new BouncyDot());
  }
}

function draw() {
  background(220, 0, 80);

  noStroke();
  fill(playerColor, 80, 70);
  ellipse(playerX, playerY, playerRad);
  //checkCollisions();
  handleTime();
  if (keyIsPressed) checkKeyPressed();
  if (firstGameStarted) displayScores();
  if (!gameIsOver) {
    playBtn.hide();

    for (let i = 0; i < dots.length; i++) {
      dots[i].float();
      dots[i].display();
      dots[i].checkDotCollision();
      console.log("running for loop");
    }

    if (timer % 60 === 0) {
      for (let i = 0; i < 2; i++) {
        dots.push(new BouncyDot());
      }
    }
  }
  //checkCollisions();
}

function mousePressed() {
  // We'll use this for console log statements only.
  dots.push(new BouncyDot());
  console.log(dots);
}

function handleTime() {
  //adjust the time variable
  if (!gameIsOver && timer > 0) timer--;
  if (timer <= 0) {
    gameIsOver = true;
    console.log("game is over (time)");
  }
}

function checkKeyPressed() {
  if (!gameIsOver) {
    if (keyCode === UP_ARROW && playerY >= playerRad / 2) {
      playerY -= playerV;
    } else if (keyCode === DOWN_ARROW && playerY <= height - playerRad / 2) {
      playerY += playerV;
    } else if (keyCode === LEFT_ARROW && playerX >= playerRad / 2) {
      playerX -= playerV;
    } else if (keyCode === RIGHT_ARROW && playerX <= width - playerRad / 2) {
      playerX += playerV;
    }
  }
  //buggy - switching from left to right or vice versa doesn't rly work
}

/*function checkCollisions() {
  for (var i = 0; i < dots.length; i++) {
    if (
      collideCircleCircle(
        playerX,
        playerY,
        playerRad,
        dots[i].x,
        dots[i].y,
        dots[i].r * 2
      )
    ) {
      dots.splice(i, 1);
      playerRad += dots[i].r;
      score = floor(playerRad - 20);
    }
  }
}*/

function displayScores() {
  textSize(12);
  fill(0);
  // Display Score
  textAlign(LEFT);
  text(`Score: ${score}`, 10, 32);
  //Display Time
  text(`Time remaining: ${timer}`, 10, 48);
  // Display game over message if the game is over
  text(`High Score: ${highScore}`, 10, 64);
  if (gameIsOver) {
    console.log("game is over (scores)");
    textSize(60);
    if (score > highScore) {
      highScore = score;
    }
    textAlign(CENTER);
    text("GAME OVER", centerX + 15, centerY);
    console.log("press play");
    playBtn.show();
    playBtn.mousePressed(restart);
  }
}

function restart() {
  firstGameStarted = true;
  score = 0;
  timer = startingTime;
  playerColor = random(360);
  playerRad = startingRad;
  playBtn.position(centerX - 10, centerY + 20);
  gameIsOver = false;
}

class BouncyDot {
  constructor() {
    var xStartMinVelocity = 0.5;
    var xStartMaxVelocity = 3;
    var yStartMinVelocity = 0.5;
    var yStartMaxVelocity = 3;

    // Randomly generate position
    this.x = random(width);
    this.y = random(height);
    // Randomly generate radius
    this.r = random(5, 12);
    // Randomly generate color
    this.color = color(random(360), 80, 70);
    // Randomly generate a master velocity (broken into components)...
    this.masterXvelocity = random(xStartMinVelocity, xStartMaxVelocity);
    this.masterYvelocity = random(yStartMinVelocity, yStartMaxVelocity);
    // ...and use those as starting velocities.
    this.xVelocity = this.masterXvelocity;
    this.yVelocity = this.masterYvelocity;
  }

  float() {
    this.x += this.xVelocity;
    this.y += this.yVelocity;
    // Standard bounce code - like the DVD logo, but for spheres.
    if (this.x + this.r > width) {
      this.xVelocity = -1 * this.masterXvelocity;
    }
    if (this.x - this.r < 0) {
      this.xVelocity = this.masterXvelocity;
    }
    if (this.y + this.r > height) {
      this.yVelocity = -1 * this.masterYvelocity;
    }
    if (this.y - this.r < 0) {
      this.yVelocity = this.masterYvelocity;
    }
  }

  checkDotCollision() {
    if (
      collideCircleCircle(
        this.x,
        this.y,
        this.r * 2,
        playerX,
        playerY,
        playerRad
      )
    ) {
      playerRad += this.r;
      score = floor(playerRad - 20);
      dots.splice(dots.indexOf(this), 1);
    }
  }
  display() {
    fill(this.color);
    noStroke();
    ellipse(this.x, this.y, this.r * 2);
  }
}
