//listeners
document.addEventListener('keydown', keyPush);

//canvas
const canvas = document.querySelector("canvas");
const title = document.querySelector("h2");
const context = canvas.getContext("2d");
var levels = document.getElementById("level");
var scores = document.getElementById("score")

//game
let gameIsRunning = true;

const tileSize = 50;
const tileCountX = canvas.width / tileSize;
const tileCountY = canvas.height / tileSize;

function initialData(){
    score = 0;
    fps = 5;

    //player
    snakeSpeed = tileSize;
    snakePosX = 0;
    snakePosY = canvas.height/2;

    velocityX = 1;
    velocityY = 0;
    foodCounter = 0;

    tail = [];
    snakeLength = 4;

    //food
    foodPosX = 0;
    foodPosY = 0;
}

// loop
function gameLoop() {
    if (gameIsRunning) {
        drawStuff();
        moveStuff();
        setTimeout(gameLoop, 1000 / fps);
    }
}
initialData();
resetFood();
gameLoop();

/**
 * MOVE EVERYTHING
 */
 function moveStuff() {
    snakePosX += snakeSpeed * velocityX;
    snakePosY += snakeSpeed * velocityY;

    // wall collision
    if (snakePosX > canvas.width - tileSize) {
        snakePosX = 0;
    }
    if (snakePosX < 0) {
        snakePosX = canvas.width;
    }
    if (snakePosY > canvas.height - tileSize) {
        snakePosY = 0;
    }
    if (snakePosY < 0) {
        snakePosY = canvas.height;
    }

    //Game over, crash into myself
    tail.forEach((snakePart) => {
		if (snakePosX === snakePart.x && snakePosY === snakePart.y) {
			gameOver();
        }
    });
    
    //tail
    tail.push ({ x: snakePosX, y: snakePosY });

    //forget earliest parts of snake
    tail = tail.slice(-1 * snakeLength);

    //food collision
    if (snakePosX === foodPosX && snakePosY === foodPosY){
        score++;
        foodCounter++;
        scores.textContent = score;
        snakeLength++;
        resetFood();
    }
    if (foodCounter === 5){
        fps++;
        levels.textContent = parseInt(levels.textContent) + 1;
        foodCounter = 0
    }
 }

/**
 * DRAW EVERYTHING
 */

function drawStuff() {
    //pozadie
    rectangle("#ffbf00", 0, 0, canvas.width, canvas.height);
    
    //grid
    drawGrid();
    
    //food
    rectangle("#48b944", foodPosX, foodPosY, tileSize, tileSize);

    //tail
    tail.forEach((snakePart) => 
    rectangle("#555", snakePart.x, snakePart.y, tileSize, tileSize));
    
    //snake
    rectangle("black", snakePosX, snakePosY, tileSize, tileSize);

}

//draw rectangle
function rectangle(color, x, y, width, height){
    context.fillStyle = color;
    context.fillRect (x, y, width, height);
}

function resetFood(){
    //game over, nowhere to go
    if (snakeLength === tileCountX * tileCountY) {
        gameOver();
    }

    foodPosX = Math.floor(Math.random() * tileCountX) * tileSize;
    foodPosY = Math.floor(Math.random() * tileCountY) * tileSize;

    //dont spawn food on snakes head
    if (foodPosX === snakePosX && foodPosY === snakePosY){
        resetFood();
    }

    //dont spawn food on any snake part
    if (
        tail.some(
            (snakePart) => snakePart.x === foodPosX && snakePart.y === foodPosY
        )
    ) { resetFood();}
}

//game over, keyboard restarts game
function gameOver() {
    gameIsRunning = false;
        title.innerHTML = `<strong> GAME OVER <strong> <br><button onclick="newGame()"> Play again </button>`;      
}

/**
 * KEYBOARD 
 */

function keyPush(event) {
    switch (event.key){
        case "ArrowLeft":
            if (velocityX !== 1){
                velocityX = -1;
                velocityY = 0;
            }
            break;
        case "ArrowUp":
            if (velocityY !== 1){
                velocityX = 0;
                velocityY = -1;
            }
            break;
        case "ArrowRight":
            if (velocityX !== -1){
                velocityX = 1;
                velocityY = 0;
            }
            break;
        case "ArrowDown":
            if (velocityY !== -1){
                velocityX = 0;
                velocityY = 1;
            }
            break;
        default:
            //restart game
            if (!gameIsRunning) location.reload();
            break;
    }
}

//grid
function drawGrid(){
    for (let i = 0; i < tileCountX; i++){
        for (let j = 0; j < tileCountY; j++){     
            rectangle( '#fff', tileSize * i, tileSize * j, tileSize -1, tileSize -1 );
        }
    }
}

function newGame(){
    gameIsRunning = true;
    scores.textContent = 0;
    levels.textContent = 1;
    initialData();
    resetFood();
    gameLoop()
}