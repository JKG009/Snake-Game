const grid = document.querySelector(".grid")
const score = document.getElementById("score")
const gameResult = document.getElementById("game-result")
const startGameBtn = document.getElementById("start")
const easyBtn = document.querySelector("#easyBtn")
const normalBtn = document.querySelector("#normalBtn")
const hardBtn = document.querySelector("#hardBtn")
const highscore = document.getElementById("highscore")
const scoreFromLocalStorage = JSON.parse(localStorage.getItem("snakeHighScore"))

let level = 0
let width = 20
let gameGrid = []
let snake = [190, 189, 188]
let direction = 1
let intervalTime = 300
const startTime = 300
let levelUp = 0
let appleIndex = 0
let currentScore = 0
let tickerId = 0
let bestScore = scoreFromLocalStorage
let currentDirection = direction

document.addEventListener("keydown", control)
startGameBtn.addEventListener("click", startGame)


function createGrid() {
    for (let i = 0; i < width*width; i++) {
        const square = document.createElement("div")
        square.classList.add("square")
        gameGrid.push(square)
        grid.appendChild(square)
    }
}

function startGame() {
    if (level === 1) {
        easyBtn.classList.add("selected-difficulty")
        normalBtn.classList.remove("selected-difficulty")
        hardBtn.classList.remove("selected-difficulty")
        intervalTime = 250
        levelUp = 0.9
    } else if (level === 2) {
        easyBtn.classList.remove("selected-difficulty")
        normalBtn.classList.add("selected-difficulty")
        hardBtn.classList.remove("selected-difficulty")
        intervalTime = 200
        levelUp = 0.9
    } else if (level === 3) {
        easyBtn.classList.remove("selected-difficulty")
        normalBtn.classList.remove("selected-difficulty")
        hardBtn.classList.add("selected-difficulty")
        intervalTime = 150
        levelUp = 0.9
    } else {
        gameResult.textContent = "Please Select a Difficulty Level"
        gameResult.style.display = ("block")
        return
    }

    gameGrid[appleIndex].classList.remove("apple")
    snake.forEach(index => gameGrid[index].classList.remove("snake"))
    clearInterval(tickerId)
    snake = [190, 189, 188]
    currentScore = 0
    score.textContent = currentScore
    direction = 1
    
    snake.forEach(index => gameGrid[index].classList.add("snake"))
    tickerId = setInterval(movement, intervalTime)
    generateApples()
    gameResult.textContent = ""
}

function movement() {
    if (
        (snake[0] - width < 0 && direction === -width) ||
        (snake[0] + width >= width*width && direction === width) ||
        (snake[0] % width === 0 && direction === -1) ||
        (snake[0] % width === (width - 1) && direction === 1) ||
        gameGrid[snake[0] + direction].classList.contains("snake")
    ) {
        gameResult.textContent = "Game Over!"
        gameResult.style.display = "block"
        return clearInterval(tickerId)
    }

    const tail = snake.pop()
    gameGrid[tail].classList.remove("snake")
    snake.unshift(snake[0] + direction)

    if (gameGrid[snake[0]].classList.contains("apple")) {
        gameGrid[snake[0]].classList.remove("apple")
        gameGrid[tail].classList.add("snake")
        snake.push(tail)
        generateApples()
        if (level === 1) {
            currentScore += 1
        } else if (level === 2) {
            currentScore += 3
        } else if (level === 3) {
            currentScore += 5
        }
        score.textContent = currentScore
        if (currentScore > bestScore) {
            highscore.textContent = currentScore
            bestScore = currentScore
            localStorage.setItem("snakeHighScore", JSON.stringify(bestScore))
        }
        clearInterval(tickerId)
        intervalTime *= levelUp
        tickerId = setInterval(movement, intervalTime)
    }
    gameGrid[snake[0]].classList.add("snake")
}

function generateApples() {
    do {appleIndex = Math.floor(Math.random() * gameGrid.length)
    } while (gameGrid[appleIndex].classList.contains("snake"))
    gameGrid[appleIndex].classList.add("apple")
}


function control(e){
    if (e.keyCode === 38 || e.keyCode === 87) {
        if (direction !== width) {
            direction = -width
        }
        // up
    } else if (e.keyCode === 40 || e.keyCode === 83) {
        if (direction !== -width) {
            direction = width
        }
        // down
    } else if (e.keyCode === 37 || e.keyCode === 65) {
        if (direction !== 1) {
            direction = -1
        }
        // left
    } else if (e.keyCode === 39 || e.keyCode === 68) {
        if (direction !== -1) {
            direction = 1
        }
        // right
    }
}

function changeDifficulty(difficulty){
    level = difficulty
}

function renderHighScore() {
    highscore.textContent = scoreFromLocalStorage
}

createGrid()
snake.forEach(index => gameGrid[index].classList.add("snake"))
renderHighScore()
