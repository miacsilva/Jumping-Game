//board
let board;
let boardWidth = 750;
let boardHeight = 250;
let context;

//dino
let dinoWidth = 88;
let dinoHeight = 94;
let dinoX = 50;
let dinoY = boardHeight - dinoHeight;
let dinoImg;

let dino = {
  x: dinoX,
  y: dinoY,
  width: dinoWidth,
  height: dinoHeight,
};

//cactus
let cactusArray = [];

let cactus1Width = 34;
let cactus2Width = 69;
let cactus3Width = 102;

let cactusHeight = 70;
let cactusX = 700;
let cactusY = boardHeight - cactusHeight;

let cactus1Img;
let cactus2Img;
let cactus3Img;

//physics
let velocityX = -8; //cactus moving left speed
let velocityY = 0;
let gravity = 0.4;

let gameOver = false;
let score = 0;


window.onload = function () {
  board = document.getElementById("board");
  board.height = boardHeight;
  board.width = boardWidth;

  context = board.getContext("2d"); //used for drawing on the board

  const characterImages = [
    './styles/images/branko1.png',
    './styles/images/branko2.png'
  ];

setInterval(changeImage, 100);

  //draw initial dinosaur
  dinoImg = new Image();
  let currentIndex = 0;
function changeImage() {
    dinoImg.src = characterImages[currentIndex];
    currentIndex = (currentIndex + 1) % characterImages.length; 
}
  /* dinoImg.src = "./styles/images/branko1.png"; */
  dinoImg.onload = function () {
    context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);
  };

  cactus1Img = new Image();
  cactus1Img.src = "./styles/images/cactus1.png";

  cactus2Img = new Image();
  cactus2Img.src = "./styles/images/cactus2.png";

  cactus3Img = new Image();
  cactus3Img.src = "./styles/images/cactus3.png";

  // Ensure all images are loaded before starting the game
  Promise.all([
    new Promise(resolve => dinoImg.onload = resolve),
    new Promise(resolve => cactus1Img.onload = resolve),
    new Promise(resolve => cactus2Img.onload = resolve),
    new Promise(resolve => cactus3Img.onload = resolve)
  ]).then(() => {
    requestAnimationFrame(update);
    setInterval(placeCactus, 1000); //1000 milliseconds = 1 second
  });

  document.addEventListener("keydown", moveDino);
};

function update() {
  requestAnimationFrame(update);
  if (gameOver) {
    context.clearRect(0, 0, board.width, board.height);
    context.fillStyle = "black";
    context.font = "20px courier";   
    context.fillText("Game Over! Your score: " + score, 250, 100);
    context.fillText("Press space to restart", 250, 150);
    return;
  }
  context.clearRect(0, 0, board.width, board.height);

  //dino
  velocityY += gravity;
  dino.y = Math.min(dino.y + velocityY, dinoY); //apply gravity to current dino.y, making sure it doesn't exceed the ground
  context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);

  //cactus
  for (let i = 0; i < cactusArray.length; i++) {
    let cactus = cactusArray[i];
    cactus.x += velocityX;
    context.drawImage(
      cactus.img,
      cactus.x,
      cactus.y,
      cactus.width,
      cactus.height
    );

    if (detectCollision(dino, cactus)) {
      gameOver = true;
      dinoImg.src = "./styles/images/dino-dead.png";
      dinoImg.onload = function () {
        context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);
      };
    }
  }

  // Score
  context.fillStyle = "black";
  context.font = "20px courier";
  context.fillText("Score: " + score, 5, 20);
}

function moveDino(e) {
  if (gameOver && e.code === "Space") {
    restartGame();
    return;
  }

  if (gameOver) {
    return;
  }

  if ((e.code == "Space" || e.code == "ArrowUp") && dino.y == dinoY) {
    //jump
    velocityY = -10;
  } else if (e.code == "ArrowDown" && dino.y == dinoY) {
    //duck
  }
}

function placeCactus() {
  if (gameOver) {
    return;
  }

  //place cactus
  let cactus = {
    img: null,
    x: cactusX,     
    y: cactusY,
    width: null,
    height: cactusHeight,
  };

  let placeCactusChance = Math.random(); //0 - 0.9999...

  if (placeCactusChance > 0.9) {
    //10% you get cactus3
    cactus.img = cactus3Img;
    cactus.width = cactus3Width;
    cactusArray.push(cactus);
  } else if (placeCactusChance > 0.7) {
    //30% you get cactus2
    cactus.img = cactus2Img;
    cactus.width = cactus2Width;
    cactusArray.push(cactus);
  } else if (placeCactusChance > 0.5) {
    //50% you get cactus1
    cactus.img = cactus1Img;
    cactus.width = cactus1Width;
    cactusArray.push(cactus);
  }

  if (cactusArray.length > 5) {
    cactusArray.shift(); //remove the first element from the array so that the array doesn't constantly grow
  }
}

function detectCollision(a, b) {
  // Check if dinosaur collides with the cactus
  let collision =
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y;

  // Check if dinosaur passed the cactus
  if (!b.passed && a.x > b.x + b.width) {
    b.passed = true;
    score++; // Increment score when the dinosaur passes the cactus
    // Draw the updated score
    context.fillStyle = "black";
    context.font = "20px courier";
    context.fillText("Score: " + score, 5, 20);
  }

  return collision;
}

function restartGame() {

  gameOver = false;
  score = 0;
  velocityY = 0;
  velocityX = -8; // Reset cactus velocity
  dino.y = dinoY;
  cactusArray = []; // Clear existing cacti

  // Reset dinosaur image to alive state
  dinoImg.src = "./styles/images/branko1.png";

  // Clear the canvas
  context.clearRect(0, 0, board.width, board.height);


}
