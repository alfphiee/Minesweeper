// ! CONSTANTS

const ROWS = 16, COLS = 16;
const MINE_COUNT = 40;

// ! STATE VARIABLES

let board, cleared

// ! CACHED ELEMENTS

const boardEl = document.querySelector('.board')
const cellEls = [...document.querySelectorAll('.cell')]
const gameOverOverlay = document.getElementById('game-over-overlay')
const playAgainBtn = document.getElementById('play-again')

// ! EVENT LISTENERS

boardEl.addEventListener('click', handleClick)
playAgainBtn.addEventListener('click', playAgain)

// ! FUNCTIONS

function init() {
    board = []
    cleared = []
    generate()
}

function generate() {
    generateBoardEl()
    generateBoardArr()
}

function generateBoardEl() {
    if(boardEl.children.length !== 0) boardEl.innerHTML = ''
    for(let i = 0; i < ROWS * COLS; i++) {
        const cellEL = document.createElement('div')
        cellEL.classList.add('cell')
        cellEL.dataset.index = i
        boardEl.appendChild(cellEL)
    }
}

function generateBoardArr() {
    for(let i = 0; i < ROWS; i++) {
        let row = []
        for (let j = 0; j < COLS; j++) {
            row.push(0)
        }
        board.push(row)
    }
    cleared =  board.map(row => row.map(() => false))
    const mineIndexes = generateMines()
    updateBoard(mineIndexes)
}

function generateMines() {
    const mineIndexes = []
    for (let i = 0; i < MINE_COUNT; i++) {
        do {
            index = randomIndex()
        } while (mineIndexes.includes(index))
        mineIndexes.push(index)
    }
    console.log(mineIndexes)
    return mineIndexes
}

function updateBoard(indexes) {
    indexes.forEach((index) => {
        const row = Math.floor(index / COLS)
        const col = index % COLS
        board[row][col] = -1
    })
    updateMineCounters()
}

function updateMineCounters() {
    let tempBoard = board.map(row => row.slice())
    board.forEach((row, rowIdx) => {
        row.forEach((cell, colIdx) => {
            if(cell !== -1) board[rowIdx][colIdx] = checkSurroundingCells(tempBoard, rowIdx, colIdx)
        })
    })
}

function checkSurroundingCells(matrix, row, col) {
    let results = []
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            let newRow = row + i
            let newCol = col + j

            // Check if newRow and newCol are within the bounds of the matrix
            if (newRow >= 0 && newRow < ROWS && newCol >= 0 && newCol < COLS) {
                // Avoid the current cell
                if (newRow !== row || newCol !== col) {
                    results.push(matrix[newRow][newCol])
                }
            }
        }
    }

    return Math.abs(results.reduce((partialSum, a) => partialSum + a, 0));
}

function randomIndex() {
    return Math.floor(Math.random() * ROWS * COLS)
}

function handleClick(event) {
    const cellIndex = event.target.dataset.index
    const cellRow = Math.floor(cellIndex / COLS)
    const cellCol = cellIndex % COLS
    if (board[cellRow][cellCol] === -1) {
        endGame()
    } else {
        clearCells(cellRow, cellCol)
    }
}

function clearCells(row, col) {
    if(row < 0 || row >= ROWS || col < 0 || col >= COLS) {
        return
    }
    console.log(row, col)
    if(cleared[row][col]) {
        return
    }

    updateBoardEl(row, col)

    cleared[row][col] = true
    if (board[row][col] === 0) {
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                clearCells(row + i, col + j);
            }
        }
    }
    // No need to recurse further if the cell has adjacent bombs
}

function updateBoardEl(row, col) {
    let index = row * COLS + col
    cellEl = boardEl.children[index]
    cellEl.innerText = board[row][col]
    cellEl.classList.add(board[row][col], 'cleared')
}

function endGame() {
    displayEndGameScreen()
}

function displayEndGameScreen() {
    gameOverOverlay.classList.add('visible')
}

function hideEndGameScreen() {
    gameOverOverlay.classList.remove('visible')
}

function playAgain() {
    hideEndGameScreen()
    init()
}

init()
