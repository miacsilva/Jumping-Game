const character = document.querySelector('.character');
console.log(character);
const characterImages = [
  './styles/images/pngwing.com.png',
  './styles/images/pngwing.com (1).png',
  './styles/images/pngwing.com (3).png',
];
const gameContainer = document.querySelector('.game-container');
const distanceDisplay = document.querySelector('.distance-display');

let score = 0;
let isJumping = false;
let isGameOver = false;
let obstacleIntervals = [];
let currentIndex = 0;

const scoreDisplay = document.createElement('div');
scoreDisplay.classList.add('score-display');
scoreDisplay.innerText = 'SCORE: ' + score;
gameContainer.appendChild(scoreDisplay);

function changeImage() {
  character.src = characterImages[currentIndex];
  currentIndex = (currentIndex + 1) % characterImages.length;
}

setInterval(changeImage, 100);

function jump() {
  if (!isJumping && !isGameOver) {
    isJumping = true;
    let jumpCount = 0;
    const jumpInterval = setInterval(() => {
      const characterBottom = parseInt(
        window.getComputedStyle(character).getPropertyValue('bottom')
      );
      if (characterBottom < 150 && jumpCount < 15) {
        character.style.bottom = characterBottom + 15 + 'px';
      } else if (jumpCount >= 15) {
        clearInterval(jumpInterval);
        const fallInterval = setInterval(() => {
          const characterBottom = parseInt(
            window.getComputedStyle(character).getPropertyValue('bottom')
          );
          if (characterBottom > 0) {
            character.style.bottom = characterBottom - 10 + 'px';
          } else {
            clearInterval(fallInterval);
            isJumping = false;
          }
        }, 20);
      }
      jumpCount++;
    }, 20);
  }
}

document.addEventListener('keydown', (event) => {
  if (event.code === 'Space') {
    if (isGameOver) {
      restartGame();
    } else {
      jump();
      changeImage();
    }
  }
});

function generateObstacle() {
  if (!isGameOver) {
    const obstacleImages = [
      './styles/images/cactus.png',
      './styles/images/cactusYellow.png',
      './styles/images/cactusGreen.png',
    ];
    const obstacleElem = document.createElement('img');
    obstacleElem.classList.add('obstacle');
    const randomIndex = Math.floor(Math.random() * obstacleImages.length);
    obstacleElem.src = obstacleImages[randomIndex];
    obstacleElem.style.left = '500px';
    obstacleElem.style.bottom = '0px';
    gameContainer.appendChild(obstacleElem);

    let obstaclePosition = 500;
    let hasScored = false; // Flag to check if obstacle has already been scored

    const obstacleMoveInterval = setInterval(() => {
      if (obstaclePosition < -50) {
        clearInterval(obstacleMoveInterval);
        gameContainer.removeChild(obstacleElem);
      }

      const characterRect = character.getBoundingClientRect();
      const obstacleRect = obstacleElem.getBoundingClientRect();

      if (
        characterRect.right > obstacleRect.left + 10 &&
        characterRect.left < obstacleRect.right - 10 &&
        characterRect.bottom > obstacleRect.top + 10 &&
        characterRect.top < obstacleRect.bottom - 10
      ) {
        clearInterval(obstacleMoveInterval);
        gameOver();
      }

      if (obstaclePosition <= 50 && !hasScored) {
        score++;
        scoreDisplay.innerText = 'SCORE: ' + score;

        const distanceToNextObstacle = obstaclePosition + 'px';
        distanceDisplay.innerText =
          'Distance to next obstacle: ' + distanceToNextObstacle;

        hasScored = true; // Set the flag to true after scoring
      }

      obstaclePosition -= 5;
      obstacleElem.style.left = obstaclePosition + 'px';
    }, 20);

    obstacleIntervals.push(obstacleMoveInterval);
  }
}

function gameOver() {
  isGameOver = true;
  alert('Game Over! Your score: ' + score);
}

function restartGame() {
  obstacleIntervals.forEach((interval) => clearInterval(interval));
  obstacleIntervals = [];
  const obstacles = document.querySelectorAll('.obstacle');
  obstacles.forEach((obstacle) => obstacle.remove());

  isGameOver = false;
  score = 0;
  scoreDisplay.innerText = 'SCORE: ' + score;
}

setInterval(generateObstacle, 2000);
