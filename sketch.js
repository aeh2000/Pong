var DIAMETER = 20;
var TEXTSIZE_ = 18;
const canvasSize = 400; // symmetrical square
var game;

class Ball {
  constructor(velocityIncrement, xStarting, yStarting) {
    // pass things to constructor on instantion
    this.x = xStarting ?? 60; //ball coordinates set by default
    this.y = yStarting ?? 60;
    this.vy = 3; //speed of acceleration I am assuming, like Velocity X and Velocity Y changed from Vx and vy
    this.vx = 2;
    this.vIncrement = velocityIncrement ?? 1.25; // if velocity increment is undefined, set to 1.25
    this.img = loadImage("me.png");
  }
  move() {
    this.x += this.vx; // move ball on the X axis and accelerate --> ball.x = ball.x + ball.vx
    this.y += this.vy; // move ball  on the Y axis and accelerate
    var hitTheTop = this.y > height - DIAMETER / 2;
    var hitTheBottom = this.y < DIAMETER / 2;
    if (hitTheTop || hitTheBottom) {
      this.vy = -this.vy; //invert Y direction
    }
  }
}

class Paddle {
  constructor(side) {
    // "left" || "right"
    this.side = side;
    this.PADDLEHEIGHT = 80;
    this.PADDLEWIDTH = 20;
    this.PADDLEOFFSET = 20;
    this.paddleY = canvasSize / 2; // WIDTH AND HEIGHT FROM P5 !!!!
  }

  drawPaddle(ball_) {
    var sideOffset =
      this.side === "left" ? this.PADDLEOFFSET : width - this.PADDLEOFFSET;
    var paddleY = this.side === "left" ? mouseY : height - mouseY;
    var key = this.side + "ScorePosition"; // game.leftScorePosition

    rect(sideOffset, paddleY, this.PADDLEWIDTH, this.PADDLEHEIGHT);
    var sideConditional =
      this.side === "left"
        ? ball_.x - DIAMETER < this.PADDLEOFFSET + this.PADDLEWIDTH
        : ball_.x + DIAMETER > width - this.PADDLEOFFSET - this.PADDLEWIDTH;

    if (sideConditional) {
      //no clue  what side conditional is, but made it concise
      if (
        (ball_.y < paddleY - this.PADDLEHEIGHT && this.side === "left") ||
        (ball_.y > paddleY + this.PADDLEHEIGHT && this.side === "left") ||
        (ball_.y < paddleY - this.PADDLEHEIGHT && this.side === "right") ||
        (ball_.y > paddleY + this.PADDLEHEIGHT && this.side === "right")
      ) {
        // hit the other side, boo game over
        game.gameOver = true;
      } else {
        // it hit paddle! Plus 1, ball is speeding up in other direction
        game[this.side] += 1;
        ball_.vx = -ball_.vx;
        ball_.vx = ball_.vx * ball_.vIncrement;
      }
    }
  }
}

class Game {
  constructor() {
    this.ball = new Ball(1.2, 100, 100);
    this.paddleRight = new Paddle("right"); // new Paddle
    this.paddleLeft = new Paddle("left");
    this.left = 0; // score
    this.right = 0; //score
    this.gameOver = false;
    this.leftScorePosition = [60, 30]; //x, y
    this.rightScorePosition = [330, 30];
  }
  setGameBackground() {
    background(50, 200, 50);
    imageMode(CENTER);
    image(
      this.ball.img,
      this.ball.x,
      this.ball.y,
      DIAMETER * 2.5,
      DIAMETER * 2.5
    );
  }

  displayWinner() {
    if (this.left > this.right) {
      return "Left won!";
    } else if (this.left < this.right) {
      return "Right won!";
    } else if (this.left === this.right) {
      return "No one won! Tie!";
    }
  }

  displayScore() {
    textSize(TEXTSIZE_);
    text(this.left, this.leftScorePosition[0], this.leftScorePosition[1]);
    text(this.right, this.rightScorePosition[0], this.rightScorePosition[1]);
  }

  displayGameOver() {
    background(50, 200, 50);
    imageMode(CENTER);
    textSize(TEXTSIZE_);
    textAlign(CENTER);
    text(this.displayWinner(), canvasSize / 2, canvasSize / 2);
  }
  drawGame() {
    this.paddleRight.drawPaddle(this.ball);
    this.paddleLeft.drawPaddle(this.ball);
    this.ball.move();
    this.displayScore();
  }
}

// P5 functions
function setup() {
  createCanvas(canvasSize, canvasSize);
}

function preload() {
  game = new Game();
}

function draw() {
  game.gameOver
    ? (game.displayGameOver(), game.displayScore())
    : (game.setGameBackground(), game.drawGame());
}