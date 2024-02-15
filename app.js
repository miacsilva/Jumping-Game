const character = document.querySelector('#character');
console.log(character)
const gameContainer = document.querySelector('.game-container');
let score = 0;
let isJumping = false;
let isGameOver = false;       
let obstacleIntervals = [];     

function jump() {
    if (!isJumping && !isGameOver) {
        isJumping = true; 
        let jumpCount = 0;
        const jumpInterval = setInterval(() => {
            const characterBottom = parseInt(window.getComputedStyle(character).getPropertyValue('bottom'));
            if (characterBottom < 150 && jumpCount < 15) {
                character.style.bottom = (characterBottom + 10) + 'px';
            } else if (jumpCount >= 15) {
                clearInterval(jumpInterval);
                const fallInterval = setInterval(() => {
                    const characterBottom = parseInt(window.getComputedStyle(character).getPropertyValue('bottom'));
                    if (characterBottom > 0) {
                        character.style.bottom = (characterBottom - 10) + 'px';
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
        }
    }
});

function generateObstacle() {
    if (!isGameOver) {
        const obstacleElem = document.createElement('img');
        obstacleElem.classList.add('obstacle');
        obstacleElem.src = "./styles/images/cactus.png"; // Set the path to your obstacle image
        obstacleElem.style.left = '500px';
        obstacleElem.style.bottom = '0px';
        gameContainer.appendChild(obstacleElem);

        let obstaclePosition = 500;
        const obstacleMoveInterval = setInterval(() => {
            if (obstaclePosition < -50) {
                clearInterval(obstacleMoveInterval);
                gameContainer.removeChild(obstacleElem);
            }

            const characterRect = character.getBoundingClientRect();
            const obstacleRect = obstacleElem.getBoundingClientRect();

            if (
                characterRect.right > obstacleRect.left &&
                characterRect.left < obstacleRect.right &&
                characterRect.bottom > obstacleRect.top &&
                characterRect.top < obstacleRect.bottom
            ) {
                clearInterval(obstacleMoveInterval);
                gameOver();
            }

            if (obstaclePosition === 50) {
                score++;
                scoreDisplay.innerText = 'SCORE: ' + score;
            }

            obstaclePosition -= 10;
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
    
    obstacleIntervals.forEach(interval => clearInterval(interval));
    obstacleIntervals = []; 
    const obstacles = document.querySelectorAll('.obstacle');
    obstacles.forEach(obstacle => obstacle.remove());
    
    isGameOver = false;
    score = 0;
    scoreDisplay.innerText = 'SCORE: ' + score;
}

const scoreDisplay = document.createElement('div');
scoreDisplay.classList.add('score-display');
scoreDisplay.innerText = 'SCORE: ' + score;
gameContainer.appendChild(scoreDisplay);

setInterval(generateObstacle, 2000);

