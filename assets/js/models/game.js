class Game {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext("2d");

    this.drawIntervalId = undefined;
    this.fps = 60;

    this.background = new Background(this.ctx);
    this.mario = new Mario(this.ctx, 10, this.canvas.height - 164);
    this.enemies = [];

    this.audio = new Audio("/assets/audio/main.mp3");
    this.audio.volume = 0.05;
    this.gameOverAudio = new Audio("/assets/audio/game-over.mp3");

    this.tick = 0;
  }

  onKeyDown(event) {
    this.mario.onKeyDown(event);
  }

  onKeyUp(event) {
    this.mario.onKeyUp(event);
  }

  start() {
    if (!this.drawIntervalId) {
      this.audio.play();

      this.drawIntervalId = setInterval(() => {
        this.clear();
        this.move();
        this.draw();
        this.checkCollisions();
        this.addEnemy();
      }, 1000 / this.fps);
    }
  }

  stop() {
    clearInterval(this.drawIntervalId);
    this.audio.pause();
    this.drawIntervalId = undefined;
  }

  addEnemy() {
    this.tick++;

    // we add new enemy every 100 times we draw!
    if (this.tick > 300) {
      this.tick = 0;
      this.enemies.push(new Enemy(this.ctx));
    }
  }

  checkCollisions() {
    const m = this.mario;

    this.enemies.forEach((e) => {
      const colx = m.x + m.w >= e.x && m.x < e.x + e.w;
      const coly = m.y + m.h >= e.y && m.y < e.y + e.h;

      if (colx && coly) {
        this.gameOver();
      }
    });
  }

  gameOver() {
    this.gameOverAudio.play();

    this.stop();

    this.ctx.font = "40px Comic Sans MS";
    this.ctx.textAlign = "center";
    this.ctx.fillText(
      "GAME OVER",
      this.ctx.canvas.width / 2,
      this.ctx.canvas.height / 2
    );
  }

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  move() {
    this.background.move();
    this.mario.move();
    this.enemies.forEach((e) => e.move());
  }

  draw() {
    this.background.draw();
    this.mario.draw();
    this.enemies.forEach((e) => e.draw());
  }
}
