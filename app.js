let game;
let gameWidth = 750;
let gameHeight = 250;
let context;

let dinoWidth = 88;
let dinoHeight = 94;
let dinoX = 50;
let dinoY = gameHeight - dinoHeight;
let dinoImg;
let dino = {
  x: dinoX,
  y: dinoY,
  width: dinoWidth,
  height: dinoHeight,
};

let cactus1Img;
let cactus2Img;
let cactus3Img;
let cactusArray = [];
let cactus1Width = 34;
let cactus2Width = 69;
let cactus3Width = 102;
let cactusHeight = 70;
let cactusX = 700;
let cactusY = gameHeight - cactusHeight;


let speedyX = -8; 
let speedyY = 0;
let gravity = 0.4;

let gameOver = false;
let score = 0;

game = document.getElementById("game");
context = game.getContext("2d");    
game.height = gameHeight;
game.width = gameWidth;

const characterImages = [
  "./styles/images/branko1.png",
  "./styles/images/branko2.png",
];

const treeBackground = document.getElementById("treeBg");

let treeX = 0;

window.onload = function () {
  function animateBackground() {
    context.clearRect(0, 0, gameWidth, gameHeight);
    treeX--;
    context.drawImage(treeBackground, treeX, 0);
    context.drawImage(treeBackground, treeX + gameWidth, 0);
    if (treeX <= -gameWidth) {
      treeX = 0; 
    }
    requestAnimationFrame(animateBackground);
  }
  animateBackground();

  setInterval(changeImage, 100);
  dinoImg = new Image();
  let currentIndex = 0;
  function changeImage() {
    dinoImg.src = characterImages[currentIndex];
    currentIndex = (currentIndex + 1) % characterImages.length;
  }

  dinoImg.onload = function () {
    context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);
  };

  cactus1Img = new Image();
  cactus1Img.src = "./styles/images/cactus1.png";

  cactus2Img = new Image();
  cactus2Img.src = "./styles/images/cactus2.png";

  cactus3Img = new Image();
  cactus3Img.src = "./styles/images/cactus3.png";

  requestAnimationFrame(update);
  setInterval(placeCactus, 1000);

  function moveDino(e) {
    if (gameOver && e.code === "Space") {
      restartGame();
      return;
    }
    if (e.code == "Space" && dino.y == dinoY) {
      speedyY = -10;
     }
  }

  document.addEventListener("keydown", moveDino);
};

function update() {

  requestAnimationFrame(update);
  if (gameOver) {
    context.clearRect(0, 0, game.width, game.height);
    document.getElementById("game-over-text").textContent = "Oh no! The Brankossaur got caught!";
    document.getElementById("score-text").textContent = "Your score: " + score;
    document.getElementById("restart-text").textContent = "Press space to restart and help it escape!";
    document.getElementById("game-over-message").style.display = "block";
    return;
  }
  context.clearRect(0, 0, game.width, game.height);
  document.getElementById("game-over-message").style.display = "none";

  context.drawImage(treeBackground, treeX, 0);
  context.drawImage(treeBackground, treeX + gameWidth, 0);
  if (treeX <= -gameWidth) {
    treeX = 0;
  }

  for (let i = 0; i < cactusArray.length; i++) {
    let cactus = cactusArray[i];
    cactus.x += speedyX;
    context.drawImage(
      cactus.img,
      cactus.x,
      cactus.y,
      cactus.width,
      cactus.height
    );

    if (detectCollision(dino, cactus)) {
      gameOver = true;
      dinoImg.onload = function () {
        context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);
      };
    }
  }

  speedyY += gravity;
  dino.y = Math.min(dino.y + speedyY, dinoY);
  context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);

  context.fillStyle = "black";
  context.font = "20px courier";
  context.fillText("SCORE: " + score, 20, 30);
}

function placeCactus() {
  if (gameOver) {
    return;
  }

  let cactus = {
    img: null,
    x: cactusX,
    y: cactusY,
    width: null,
    height: cactusHeight,
  };

  let placeCactusChance = Math.random();

  if (placeCactusChance > 0.9) {
    cactus.img = cactus3Img;
    cactus.width = cactus3Width;
    cactusArray.push(cactus);
  } else if (placeCactusChance > 0.7) {
    cactus.img = cactus2Img;
    cactus.width = cactus2Width;
    cactusArray.push(cactus);
  } else if (placeCactusChance > 0.45) {
    cactus.img = cactus1Img;
    cactus.width = cactus1Width;
    cactusArray.push(cactus);
  }

  if (cactusArray.length > 5) {
    cactusArray.shift();
  }
}

function detectCollision(a, b) {
  let collision =
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y;

  if (!b.passed && a.x > b.x + b.width) {
    b.passed = true;
    score++;

  }
  return collision;
}

function restartGame() {
  gameOver = false;
  score = 0;
  speedyY = 0;
  speedyX = -8; 
  dino.y = dinoY;
  cactusArray = [];
  context.clearRect(0, 0, game.width, game.height);
}
