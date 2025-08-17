const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let frames = 0;
const gravity = 0.25;
const jump = -4.6;
let score = 0;
let bestScore = 0;
let gameOver = false;

const bird = {
  x: 50,
  y: 150,
  radius: 12,
  velocity: 0,
  draw() {
    ctx.fillStyle = 'yellow';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
  },
  update() {
    this.velocity += gravity;
    this.y += this.velocity;
    if (this.y + this.radius >= canvas.height) gameOver = true;
  },
  flap() {
    this.velocity = jump;
  }
};

const pipes = [];
const pipeGap = 100;
const pipeWidth = 50;

function spawnPipe() {
  const topHeight = Math.floor(Math.random() * (canvas.height - pipeGap - 50)) + 20;
  pipes.push({
    x: canvas.width,
    top: topHeight,
    bottom: canvas.height - topHeight - pipeGap
  });
}

function drawPipes() {
  ctx.fillStyle = 'green';
  pipes.forEach(pipe => {
    ctx.fillRect(pipe.x, 0, pipeWidth, pipe.top);
    ctx.fillRect(pipe.x, canvas.height - pipe.bottom, pipeWidth, pipe.bottom);
  });
}

function updatePipes() {
  pipes.forEach(pipe => {
    pipe.x -= 2;
    if (
      bird.x + bird.radius > pipe.x &&
      bird.x - bird.radius < pipe.x + pipeWidth &&
      (bird.y - bird.radius < pipe.top ||
       bird.y + bird.radius > canvas.height - pipe.bottom)
    ) gameOver = true;

    if (pipe.x + pipeWidth === bird.x) {
      score++;
      bestScore = Math.max(score, bestScore);
    }
  });
  if (pipes.length && pipes[0].x + pipeWidth < 0) pipes.shift();
  if (frames % 100 === 0) spawnPipe();
}

function drawScore() {
  ctx.fillStyle = 'white';
  ctx.font = '20px Arial';
  ctx.fillText(`Score: ${score}`, 10, 20);
  ctx.fillText(`Best: ${bestScore}`, 10, 40);
}

function loop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  bird.update();
  bird.draw();
  updatePipes();
  drawPipes();
  drawScore();
  frames++;
  if (!gameOver) requestAnimationFrame(loop);
  else {
    ctx.fillStyle = 'white';
    ctx.font = '40px Arial';
    ctx.fillText('Game Over', 100, canvas.height / 2);
    ctx.font = '20px Arial';
    ctx.fillText('Click to Restart', 130, canvas.height / 2 + 30);
  }
}

canvas.addEventListener('click', () => {
  if (!gameOver) bird.flap();
  else {
    bird.y = 150;
    bird.velocity = 0;
    pipes.length = 0;
    score = 0;
    frames = 0;
    gameOver = false;
    loop();
  }
});

loop();
